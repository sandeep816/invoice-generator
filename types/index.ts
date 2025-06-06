// Invoice Item type
export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Alias for backward compatibility
export type InvoiceItem = LineItem;

// Template colors interface
export interface TemplateColors {
  primary: string;
  accent: string;
  background: string;
}

// Main Invoice type
export interface InvoiceData {
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
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes: string;
  currency: string;
  template: string;
  templateColors: TemplateColors;
  showLogo: boolean;
  logoPosition: "left" | "right" | "center";
  logo: string | null;
}

// Alias for backward compatibility
export type Invoice = InvoiceData;
