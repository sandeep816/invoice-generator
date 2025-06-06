"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Plus, Download, Save, Upload, Trash2, GripVertical, Eye } from "lucide-react"
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { InvoicePDF } from "@/components/pdf/InvoicePDF";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// Add the LogoUpload import
import { LogoUpload } from "@/components/logo-upload"

// Update the InvoiceData interface to include logo
interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  companyName: string
  companyAddress: string
  companyEmail: string
  companyPhone: string
  clientName: string
  clientAddress: string
  clientEmail: string
  lineItems: LineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes: string
  currency: string
  template: string
  templateColors: {
    primary: string
    accent: string
    background: string
  }
  showLogo: boolean
  logoPosition: "left" | "right" | "center"
  logo: string | null
}

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

// Replace the templates array with an import from the new components
import { TemplatePicker, getTemplateById, getTemplateStyles } from "@/components/invoice-templates"
import { ColorPicker } from "@/components/color-picker"

const currencies = [
  { code: "INR", symbol: "₹", name: "US Dollar" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
]

export default function InvoiceGenerator() {
  // Update the initial state to include logo
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    clientName: "",
    clientAddress: "",
    clientEmail: "",
    lineItems: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    total: 0,
    notes: "",
    currency: "USD",
    template: "modern",
    templateColors: {
      primary: "#3b82f6",
      accent: "#2563eb",
      background: "#ffffff",
    },
    showLogo: false,
    logoPosition: "left",
    logo: null,
  })

  const [showPreview, setShowPreview] = useState(false)

  const selectedCurrency = currencies.find((c) => c.code === invoice.currency)

  useEffect(() => {
    calculateTotals()
  }, [invoice.lineItems, invoice.taxRate])

  const calculateTotals = () => {
    const subtotal = invoice.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const taxAmount = subtotal * (invoice.taxRate / 100)
    const total = subtotal + taxAmount

    setInvoice((prev) => ({
      ...prev,
      subtotal,
      taxAmount,
      total,
    }))
  }

  const addLineItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    }
    setInvoice((prev) => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem],
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      }),
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((item) => item.id !== id),
    }))
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(invoice.lineItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setInvoice((prev) => ({ ...prev, lineItems: items }))
  }

  const generatePDF = () => {
    // This function is now just a wrapper for the PDFDownloadLink
    // The actual download will be handled by the PDFDownloadLink component
    toast.success("Generating PDF...");
  }

  const generatePrintableHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company-info, .client-info { flex: 1; }
            .invoice-title { font-size: 32px; font-weight: bold; color: #333; }
            .invoice-details { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f8f9fa; font-weight: bold; }
            .totals { margin-left: auto; width: 300px; }
            .total-row { font-weight: bold; font-size: 18px; }
            .notes { margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              <h2>${invoice.companyName}</h2>
              <p>${invoice.companyAddress.replace(/\n/g, "<br>")}</p>
              <p>${invoice.companyEmail}</p>
              <p>${invoice.companyPhone}</p>
            </div>
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-details">
                <p><strong>Invoice #:</strong> ${invoice.invoiceNumber}</p>
                <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
                <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div class="client-info">
            <h3>Bill To:</h3>
            <p><strong>${invoice.clientName}</strong></p>
            <p>${invoice.clientAddress.replace(/\n/g, "<br>")}</p>
            <p>${invoice.clientEmail}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${invoice.lineItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>${selectedCurrency?.symbol}${item.rate.toFixed(2)}</td>
                  <td>${selectedCurrency?.symbol}${item.amount.toFixed(2)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr>
                <td>Subtotal:</td>
                <td>${selectedCurrency?.symbol}${invoice.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Tax (${invoice.taxRate}%):</td>
                <td>${selectedCurrency?.symbol}${invoice.taxAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td>Total:</td>
                <td>${selectedCurrency?.symbol}${invoice.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          ${
            invoice.notes
              ? `
            <div class="notes">
              <h3>Notes:</h3>
              <p>${invoice.notes.replace(/\n/g, "<br>")}</p>
            </div>
          `
              : ""
          }
        </body>
      </html>
    `
  }

  const saveInvoice = () => {
    const invoices = JSON.parse(localStorage.getItem("invoices") || "[]")
    const existingIndex = invoices.findIndex((inv: InvoiceData) => inv.invoiceNumber === invoice.invoiceNumber)

    if (existingIndex >= 0) {
      invoices[existingIndex] = invoice
    } else {
      invoices.push(invoice)
    }

    localStorage.setItem("invoices", JSON.stringify(invoices))
    alert("Invoice saved successfully!")
  }

  const loadInvoice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string)
          setInvoice(data)
          alert("Invoice loaded successfully!")
        } catch (error) {
          alert("Invalid file format")
        }
      }
      reader.readAsText(file)
    }
    // Clear the input value to allow selecting the same file again
    event.target.value = ""
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
            <p className="text-gray-600">Create professional invoices with ease</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </Button>
            <Button variant="outline" onClick={saveInvoice}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <PDFDownloadLink 
              document={<InvoicePDF invoice={invoice} currency={selectedCurrency?.symbol || '$'} />}
              fileName={`invoice-${invoice.invoiceNumber}.pdf`}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              {({ blob, url, loading, error }) => (
                <Button onClick={generatePDF} disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Generating PDF...' : 'Download PDF'}
                </Button>
              )}
            </PDFDownloadLink>
          </div>
        </div>

        {showPreview ? (
          <InvoicePreview invoice={invoice} currency={selectedCurrency} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Invoice Details</TabsTrigger>
                  <TabsTrigger value="items">Line Items</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Company Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyName">Company Name</Label>
                          <Input
                            id="companyName"
                            value={invoice.companyName}
                            onChange={(e) => setInvoice((prev) => ({ ...prev, companyName: e.target.value }))}
                            placeholder="Your Company Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyEmail">Email</Label>
                          <Input
                            id="companyEmail"
                            type="email"
                            value={invoice.companyEmail}
                            onChange={(e) => setInvoice((prev) => ({ ...prev, companyEmail: e.target.value }))}
                            placeholder="company@example.com"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="companyAddress">Address</Label>
                          <Textarea
                            id="companyAddress"
                            value={invoice.companyAddress}
                            onChange={(e) => setInvoice((prev) => ({ ...prev, companyAddress: e.target.value }))}
                            placeholder="123 Business St, City, State 12345"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="companyPhone">Phone</Label>
                          <Input
                            id="companyPhone"
                            value={invoice.companyPhone}
                            onChange={(e) => setInvoice((prev) => ({ ...prev, companyPhone: e.target.value }))}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Client Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="clientName">Client Name</Label>
                          <Input
                            id="clientName"
                            value={invoice.clientName}
                            onChange={(e) => setInvoice((prev) => ({ ...prev, clientName: e.target.value }))}
                            placeholder="Client Company Name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="clientEmail">Email</Label>
                          <Input
                            id="clientEmail"
                            type="email"
                            value={invoice.clientEmail}
                            onChange={(e) => setInvoice((prev) => ({ ...prev, clientEmail: e.target.value }))}
                            placeholder="client@example.com"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="clientAddress">Address</Label>
                        <Textarea
                          id="clientAddress"
                          value={invoice.clientAddress}
                          onChange={(e) => setInvoice((prev) => ({ ...prev, clientAddress: e.target.value }))}
                          placeholder="456 Client Ave, City, State 67890"
                          rows={3}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="items" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Line Items</CardTitle>
                        <Button onClick={addLineItem}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Item
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="lineItems">
                          {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                              {invoice.lineItems.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className="flex items-center gap-4 p-4 border rounded-lg bg-white"
                                    >
                                      <div {...provided.dragHandleProps}>
                                        <GripVertical className="w-4 h-4 text-gray-400" />
                                      </div>
                                      <div className="flex-1 grid grid-cols-4 gap-4">
                                        <div className="col-span-2">
                                          <Input
                                            placeholder="Description"
                                            value={item.description}
                                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                                          />
                                        </div>
                                        <div>
                                          <Input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) =>
                                              updateLineItem(
                                                item.id,
                                                "quantity",
                                                Number.parseFloat(e.target.value) || 0,
                                              )
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Input
                                            type="number"
                                            placeholder="Rate"
                                            value={item.rate}
                                            onChange={(e) =>
                                              updateLineItem(item.id, "rate", Number.parseFloat(e.target.value) || 0)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="w-24 text-right font-medium">
                                        {selectedCurrency?.symbol}
                                        {item.amount.toFixed(2)}
                                      </div>
                                      <Button variant="ghost" size="sm" onClick={() => removeLineItem(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Invoice Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={invoice.currency}
                            onValueChange={(value) => setInvoice((prev) => ({ ...prev, currency: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                  {currency.symbol} {currency.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="taxRate">Tax Rate (%)</Label>
                          <Input
                            id="taxRate"
                            type="number"
                            value={invoice.taxRate}
                            onChange={(e) =>
                              setInvoice((prev) => ({ ...prev, taxRate: Number.parseFloat(e.target.value) || 0 }))
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={invoice.notes}
                          onChange={(e) => setInvoice((prev) => ({ ...prev, notes: e.target.value }))}
                          placeholder="Additional notes or payment terms..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Template Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <TemplatePicker
                        selectedTemplate={invoice.template}
                        onSelectTemplate={(templateId) => {
                          const template = getTemplateById(templateId)
                          setInvoice((prev) => ({
                            ...prev,
                            template: templateId,
                            templateColors: {
                              primary: template.primaryColor,
                              accent: template.accentColor,
                              background: template.backgroundColor,
                            },
                          }))
                        }}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Template Customization</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <ColorPicker
                          label="Primary Color"
                          value={invoice.templateColors.primary}
                          onChange={(color) =>
                            setInvoice((prev) => ({
                              ...prev,
                              templateColors: { ...prev.templateColors, primary: color },
                            }))
                          }
                        />
                        <ColorPicker
                          label="Accent Color"
                          value={invoice.templateColors.accent}
                          onChange={(color) =>
                            setInvoice((prev) => ({
                              ...prev,
                              templateColors: { ...prev.templateColors, accent: color },
                            }))
                          }
                        />
                        <ColorPicker
                          label="Background Color"
                          value={invoice.templateColors.background}
                          onChange={(color) =>
                            setInvoice((prev) => ({
                              ...prev,
                              templateColors: { ...prev.templateColors, background: color },
                            }))
                          }
                        />
                      </div>

                      <LogoUpload
                        currentLogo={invoice.logo}
                        onLogoChange={(logoUrl) => setInvoice((prev) => ({ ...prev, logo: logoUrl }))}
                      />

                      {invoice.logo && (
                        <div>
                          <Label>Logo Position</Label>
                          <RadioGroup
                            value={invoice.logoPosition}
                            onValueChange={(value: "left" | "right" | "center") =>
                              setInvoice((prev) => ({ ...prev, logoPosition: value }))
                            }
                            className="flex space-x-4 mt-2"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="left" id="logo-left" />
                              <Label htmlFor="logo-left">Left</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="center" id="logo-center" />
                              <Label htmlFor="logo-center">Center</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="right" id="logo-right" />
                              <Label htmlFor="logo-right">Right</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoice.invoiceNumber}
                        onChange={(e) => setInvoice((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={invoice.date}
                        onChange={(e) => setInvoice((prev) => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={invoice.dueDate}
                      onChange={(e) => setInvoice((prev) => ({ ...prev, dueDate: e.target.value }))}
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>
                        {selectedCurrency?.symbol}
                        {invoice.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax ({invoice.taxRate}%):</span>
                      <span>
                        {selectedCurrency?.symbol}
                        {invoice.taxAmount.toFixed(2)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>
                        {selectedCurrency?.symbol}
                        {invoice.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      setInvoice((prev) => ({ ...prev, invoiceNumber: `INV-${Date.now().toString().slice(-6)}` }))
                    }
                  >
                    Generate New Invoice Number
                  </Button>
                  <Button variant="outline" className="w-full" onClick={addLineItem}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Line Item
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={loadInvoice}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Button variant="outline" className="w-full" type="button">
                      <Upload className="w-4 h-4 mr-2" />
                      Load Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function InvoicePreview({ invoice, currency }: { invoice: InvoiceData; currency: any }) {
  const template = getTemplateById(invoice.template)
  const styles = getTemplateStyles(template)

  return (
    <div
      className={`max-w-4xl mx-auto p-8 shadow-lg ${styles.container}`}
      style={{
        backgroundColor: invoice.templateColors.background,
        borderColor: invoice.templateColors.primary,
      }}
    >
      {invoice.logo && (
        <div
          className={`mb-6 flex ${
            invoice.logoPosition === "center"
              ? "justify-center"
              : invoice.logoPosition === "right"
                ? "justify-end"
                : "justify-start"
          }`}
        >
          <img
            src={invoice.logo || "/placeholder.svg"}
            alt="Company logo"
            className="max-h-16 max-w-[200px] object-contain"
          />
        </div>
      )}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className={styles.title} style={{ color: invoice.templateColors.primary }}>
            INVOICE
          </h1>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Invoice #:</strong> {invoice.invoiceNumber}
            </p>
            <p>
              <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <h2 className={styles.companyName} style={{ color: invoice.templateColors.accent }}>
            {invoice.companyName}
          </h2>
          <div className="text-sm text-gray-600 mt-2">
            <p>
              {invoice.companyAddress.split("\n").map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p>{invoice.companyEmail}</p>
            <p>{invoice.companyPhone}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className={styles.sectionTitle} style={{ color: invoice.templateColors.accent }}>
          Bill To:
        </h3>
        <div className="text-gray-700">
          <p className="font-semibold">{invoice.clientName}</p>
          <p>
            {invoice.clientAddress.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </p>
          <p>{invoice.clientEmail}</p>
        </div>
      </div>

      <div className="mb-8">
        <table className={styles.table}>
          <thead>
            <tr className={styles.tableHeader} style={{ borderColor: invoice.templateColors.primary }}>
              <th className="text-left py-3 font-semibold">Description</th>
              <th className="text-center py-3 font-semibold w-20">Qty</th>
              <th className="text-right py-3 font-semibold w-24">Rate</th>
              <th className="text-right py-3 font-semibold w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{item.description}</td>
                <td className={`${styles.tableCell} text-center`}>{item.quantity}</td>
                <td className={`${styles.tableCell} text-right`}>
                  {currency?.symbol}
                  {item.rate.toFixed(2)}
                </td>
                <td className={`${styles.tableCell} text-right`}>
                  {currency?.symbol}
                  {item.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mb-8">
        <div className={styles.totalSection} style={{ borderColor: invoice.templateColors.primary }}>
          <div className={styles.totalRow}>
            <span>Subtotal:</span>
            <span>
              {currency?.symbol}
              {invoice.subtotal.toFixed(2)}
            </span>
          </div>
          <div className={styles.totalRow}>
            <span>Tax ({invoice.taxRate}%):</span>
            <span>
              {currency?.symbol}
              {invoice.taxAmount.toFixed(2)}
            </span>
          </div>
          <div className={styles.grandTotal} style={{ borderColor: invoice.templateColors.primary }}>
            <span>Total:</span>
            <span>
              {currency?.symbol}
              {invoice.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {invoice.notes && (
        <div className={styles.notes}>
          <h3 className={styles.sectionTitle} style={{ color: invoice.templateColors.accent }}>
            Notes:
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
        </div>
      )}
    </div>
  )
}
