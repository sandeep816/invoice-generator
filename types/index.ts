// Invoice Item type
export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Main Invoice type
export interface Invoice {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  lineItems: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  currency: string;
  template: string;
  templateColors: {
    primary: string;
    accent: string;
    background: string;
  };
  showLogo: boolean;
  logoPosition: "left" | "right" | "center";
  logo: string | null;
}
