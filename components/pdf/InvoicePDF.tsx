import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { InvoiceItem, Invoice } from '@/types';
import { getTemplateStyles, DEFAULT_PDF_COLORS } from '@/components/invoice-templates';

// Register fonts if needed
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ]
});

const createStyles = (templateStyles: any) => {
  const colors = templateStyles.pdf?.colors || DEFAULT_PDF_COLORS;
  
  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: 10,
      lineHeight: 1.5,
      fontFamily: templateStyles.pdf?.fontFamily || 'Helvetica',
      color: colors.text,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      flexDirection: 'column',
    },
    header: {
      marginBottom: 30,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: colors.primary,
    },
    subtitle: {
      fontSize: 12,
      color: colors.muted,
      marginBottom: 4,
    },
    section: {
      marginBottom: 20,
    },
    row: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      paddingVertical: 8,
      alignItems: 'center',
    },
    colHeader: {
      flex: 1,
      fontWeight: 'bold',
      color: colors.primary,
    },
    col: {
      flex: 1,
    },
    totalRow: {
      marginTop: 20,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.primary,
      fontWeight: 'bold',
    },
    headerRow: {
      backgroundColor: colors.primary + '10',
      padding: 8,
      marginBottom: 8,
      borderRadius: 4,
    },
    companyInfo: {
      marginBottom: 20,
    },
    clientInfo: {
      marginBottom: 20,
    },
    invoiceInfo: {
      marginBottom: 30,
    },
    notes: {
      marginTop: 30,
      paddingTop: 15,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      fontSize: 10,
      color: colors.muted,
    },
  });
};

interface InvoicePDFProps {
  invoice: Invoice;
  currency: string;
  templateId?: string;
}

export const InvoicePDF = ({ 
  invoice, 
  currency,
  templateId = 'modern' 
}: InvoicePDFProps) => {
  const templateStyles = getTemplateStyles({
    id: templateId,
    name: '',
    description: '',
    primaryColor: invoice.templateColors?.primary || DEFAULT_PDF_COLORS.primary,
    accentColor: invoice.templateColors?.accent || DEFAULT_PDF_COLORS.accent,
    backgroundColor: invoice.templateColors?.background || DEFAULT_PDF_COLORS.background,
    fontFamily: 'Helvetica',
    preview: null as any
  });
  
  const styles = createStyles(templateStyles);
  const colors = templateStyles.pdf?.colors || DEFAULT_PDF_COLORS;

  const calculateTotal = () => {
    return invoice.lineItems.reduce((sum: number, item: InvoiceItem) => {
      return sum + (item.quantity * item.rate);
    }, 0);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const subtotal = calculateTotal();
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                {invoice.logo && (
                  <Image 
                    src={invoice.logo}
                    style={{ width: 120, marginBottom: 10, objectFit: 'contain' }} 
                  />
                )}
                <Text style={styles.title}>INVOICE</Text>
              </View>
              <View style={{ textAlign: 'right' }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>
                  {invoice.companyName || 'Your Company Name'}
                </Text>
                {invoice.companyAddress && <Text style={styles.subtitle}>{invoice.companyAddress}</Text>}
                {invoice.companyEmail && <Text style={styles.subtitle}>{invoice.companyEmail}</Text>}
                {invoice.companyPhone && <Text style={styles.subtitle}>{invoice.companyPhone}</Text>}
              </View>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
            {/* Bill To */}
            <View style={styles.clientInfo}>
              <Text style={{ fontWeight: 'bold', marginBottom: 6 }}>Bill To:</Text>
              <Text>{invoice.clientName || 'Client Name'}</Text>
              {invoice.clientAddress && <Text>{invoice.clientAddress}</Text>}
              {invoice.clientEmail && <Text>{invoice.clientEmail}</Text>}
            </View>

            {/* Invoice Info */}
            <View style={styles.invoiceInfo}>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={{ width: 80, fontWeight: 'bold' }}>Invoice #:</Text>
                <Text>{invoice.invoiceNumber || 'N/A'}</Text>
              </View>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text style={{ width: 80, fontWeight: 'bold' }}>Date:</Text>
                <Text>{formatDate(invoice.date)}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ width: 80, fontWeight: 'bold' }}>Due Date:</Text>
                <Text>{formatDate(invoice.dueDate)}</Text>
              </View>
            </View>
          </View>

          {/* Items Table */}
          <View style={styles.section}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.colHeader, { flex: 3 }]}>Description</Text>
              <Text style={[styles.colHeader, { textAlign: 'right', width: 60 }]}>Qty</Text>
              <Text style={[styles.colHeader, { textAlign: 'right', width: 80 }]}>Rate</Text>
              <Text style={[styles.colHeader, { textAlign: 'right', width: 80 }]}>Amount</Text>
            </View>
            
            {invoice.lineItems.map((item: InvoiceItem) => (
              <View key={item.id} style={styles.row}>
                <Text style={[styles.col, { flex: 3 }]}>{item.description || 'Item description'}</Text>
                <Text style={[styles.col, { textAlign: 'right', width: 60 }]}>{item.quantity}</Text>
                <Text style={[styles.col, { textAlign: 'right', width: 80 }]}>{currency}{item.rate.toFixed(2)}</Text>
                <Text style={[styles.col, { textAlign: 'right', width: 80 }]}>{currency}{(item.quantity * item.rate).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* Totals */}
          <View style={{ alignSelf: 'flex-end', width: 250, marginTop: 20 }}>
            <View style={[styles.row, { borderBottomWidth: 0, justifyContent: 'space-between' }]}>
              <Text>Subtotal:</Text>
              <Text>{currency}{subtotal.toFixed(2)}</Text>
            </View>
            {invoice.taxRate > 0 && (
              <View style={[styles.row, { borderBottomWidth: 0, justifyContent: 'space-between' }]}>
                <Text>Tax ({invoice.taxRate}%):</Text>
                <Text>{currency}{taxAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={[styles.row, { 
              borderTopWidth: 1, 
              borderTopColor: colors.primary,
              paddingTop: 8,
              marginTop: 4,
              justifyContent: 'space-between',
              fontWeight: 'bold'
            }]}>
              <Text>Total:</Text>
              <Text>{currency}{total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Notes */}
          {invoice.notes && (
            <View style={styles.notes}>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Notes:</Text>
              <Text>{invoice.notes}</Text>
            </View>
          )}

          {/* Footer */}
          <View style={[styles.notes, { marginTop: 40, textAlign: 'center' }]}>
            <Text>{invoice.companyName || 'Your Company Name'}</Text>
            <Text style={{ fontSize: 8, marginTop: 4 }}>
              Thank you for your business!
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
