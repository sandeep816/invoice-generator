"use client"

import type React from "react"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TemplateOption {
  id: string
  name: string
  description: string
  primaryColor: string
  accentColor: string
  backgroundColor: string
  fontFamily: string
  preview: React.ReactNode
}

// Default color scheme for PDF generation
export const DEFAULT_PDF_COLORS = {
  text: '#1f2937', // gray-800
  background: '#ffffff', // white
  primary: '#3b82f6', // blue-500
  accent: '#2563eb', // blue-600
  border: '#e5e7eb', // gray-200
  muted: '#6b7280', // gray-500
}

export const templates: TemplateOption[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with a colored accent bar",
    primaryColor: "#3b82f6", // blue-500
    accentColor: "#2563eb", // blue-600
    backgroundColor: "#ffffff",
    fontFamily: "'Inter', sans-serif",
    preview: (
      <div className="h-full w-full bg-white border-l-4 border-blue-500 p-3">
        <div className="h-2 w-20 bg-blue-500 mb-2 rounded"></div>
        <div className="h-3 w-24 bg-gray-800 mb-3 rounded"></div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-2 w-16 bg-gray-400 rounded"></div>
          <div className="h-2 w-16 bg-gray-400 rounded"></div>
        </div>
        <div className="h-1 w-full bg-gray-200 mb-3"></div>
        <div className="flex justify-between mb-2">
          <div className="h-2 w-32 bg-gray-300 rounded"></div>
          <div className="h-2 w-10 bg-gray-300 rounded"></div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="h-2 w-32 bg-gray-300 rounded"></div>
          <div className="h-2 w-10 bg-gray-300 rounded"></div>
        </div>
      </div>
    ),
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional business style with elegant borders",
    primaryColor: "#1e293b", // slate-800
    accentColor: "#475569", // slate-600
    backgroundColor: "#f8fafc", // slate-50
    fontFamily: "'Georgia', serif",
    preview: (
      <div className="h-full w-full bg-slate-50 border border-slate-300 p-3">
        <div className="h-3 w-24 bg-slate-800 mb-3 rounded"></div>
        <div className="border-b-2 border-slate-800 mb-3 pb-1">
          <div className="h-2 w-16 bg-slate-600 rounded"></div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-2 w-16 bg-slate-400 rounded"></div>
          <div className="h-2 w-16 bg-slate-400 rounded"></div>
        </div>
        <div className="h-1 w-full bg-slate-200 mb-3"></div>
        <div className="flex justify-between mb-2">
          <div className="h-2 w-32 bg-slate-300 rounded"></div>
          <div className="h-2 w-10 bg-slate-300 rounded"></div>
        </div>
      </div>
    ),
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple and elegant with clean typography",
    primaryColor: "#18181b", // zinc-900
    accentColor: "#71717a", // zinc-500
    backgroundColor: "#fafafa", // zinc-50
    fontFamily: "'Inter', sans-serif",
    preview: (
      <div className="h-full w-full bg-zinc-50 p-3">
        <div className="h-3 w-24 bg-zinc-900 mb-4 rounded"></div>
        <div className="flex justify-between items-center mb-4">
          <div className="h-2 w-16 bg-zinc-400 rounded"></div>
          <div className="h-2 w-16 bg-zinc-400 rounded"></div>
        </div>
        <div className="h-px w-full bg-zinc-200 mb-4"></div>
        <div className="flex justify-between mb-2">
          <div className="h-2 w-32 bg-zinc-300 rounded"></div>
          <div className="h-2 w-10 bg-zinc-300 rounded"></div>
        </div>
        <div className="flex justify-between mb-2">
          <div className="h-2 w-32 bg-zinc-300 rounded"></div>
          <div className="h-2 w-10 bg-zinc-300 rounded"></div>
        </div>
      </div>
    ),
  },
  {
    id: "creative",
    name: "Creative",
    description: "Colorful and modern with gradient accents",
    primaryColor: "#8b5cf6", // violet-500
    accentColor: "#7c3aed", // violet-600
    backgroundColor: "#f5f3ff", // violet-50
    fontFamily: "'Poppins', sans-serif",
    preview: (
      <div className="h-full w-full bg-gradient-to-br from-violet-50 to-fuchsia-50 p-3">
        <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 mb-3 rounded-full"></div>
        <div className="h-3 w-24 bg-violet-700 mb-3 rounded"></div>
        <div className="flex justify-between items-center mb-3">
          <div className="h-2 w-16 bg-violet-400 rounded"></div>
          <div className="h-2 w-16 bg-violet-400 rounded"></div>
        </div>
        <div className="h-px w-full bg-violet-200 mb-3"></div>
        <div className="flex justify-between mb-2">
          <div className="h-2 w-32 bg-violet-300 rounded"></div>
          <div className="h-2 w-10 bg-violet-300 rounded"></div>
        </div>
      </div>
    ),
  },
]

interface TemplatePickerProps {
  selectedTemplate: string
  onSelectTemplate: (templateId: string) => void
}

export function TemplatePicker({ selectedTemplate, onSelectTemplate }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer overflow-hidden transition-all ${
            selectedTemplate === template.id
              ? "ring-2 ring-offset-2 ring-primary"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
          onClick={() => onSelectTemplate(template.id)}
        >
          <div className="relative h-32 w-full">
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 z-10">
                <Check className="h-4 w-4" />
              </div>
            )}
            {template.preview}
          </div>
          <div className="p-3 border-t">
            <h3 className="font-medium">{template.name}</h3>
            <p className="text-sm text-gray-500">{template.description}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export function getTemplateById(id: string): TemplateOption {
  return templates.find((t) => t.id === id) || templates[0]
}

export interface TemplateStyles {
  container: string
  borderColor: string
  header: string
  title: string
  companyName: string
  sectionTitle: string
  table: string
  tableHeader: string
  tableRow: string
  tableCell: string
  totalSection: string
  totalRow: string
  grandTotal: string
  notes: string
  // PDF specific styles
  pdf?: {
    fontFamily: string
    colors: {
      text: string
      background: string
      primary: string
      accent: string
      border: string
      muted: string
    }
  }
}

export function getTemplateStyles(template: TemplateOption): TemplateStyles {
  const baseStyles = {
    container: "",
    borderColor: template.primaryColor,
    header: "mb-8",
    title: "text-4xl font-bold mb-2",
    companyName: "text-2xl font-bold",
    sectionTitle: "text-lg font-semibold mb-2",
    table: "w-full",
    tableHeader: "border-b-2 text-left py-3 font-semibold",
    tableRow: "border-b",
    tableCell: "py-3",
    totalSection: "w-64",
    totalRow: "flex justify-between py-2",
    grandTotal: "flex justify-between py-2 border-t-2 font-bold text-lg",
    notes: "mt-8",
  }

  switch (template.id) {
    case "modern":
      return {
        ...baseStyles,
        container: "bg-white border-l-4 rounded-sm shadow-md",
        pdf: {
          fontFamily: 'Helvetica',
          colors: {
            ...DEFAULT_PDF_COLORS,
            primary: template.primaryColor,
            accent: template.accentColor,
          }
        }
      }
    case "classic":
      return {
        container: "bg-slate-50 border border-slate-300 rounded-none shadow-md",
        borderColor: template.primaryColor,
        header: "mb-8 border-b-2 pb-4",
        title: "text-3xl font-serif font-bold mb-2",
        companyName: "text-2xl font-serif font-bold",
        sectionTitle: "text-lg font-serif font-semibold mb-2 border-b pb-1",
        table: "w-full",
        tableHeader: "border-b-2 text-left py-3 font-semibold",
        tableRow: "border-b border-slate-200",
        tableCell: "py-3",
        totalSection: "w-64 border-t-2 mt-4 pt-2",
        totalRow: "flex justify-between py-2",
        grandTotal: "flex justify-between py-2 border-t-2 font-bold text-lg",
        notes: "mt-8 border-t-2 pt-4",
      }
    case "minimal":
      return {
        container: "bg-zinc-50 rounded-sm shadow-sm",
        borderColor: template.primaryColor,
        header: "mb-8",
        title: "text-3xl font-bold mb-4",
        companyName: "text-xl font-bold",
        sectionTitle: "text-base font-medium mb-2",
        table: "w-full",
        tableHeader: "border-b text-left py-3 font-medium",
        tableRow: "border-b border-zinc-100",
        tableCell: "py-3",
        totalSection: "w-64",
        totalRow: "flex justify-between py-2",
        grandTotal: "flex justify-between py-2 border-t font-bold text-base",
        notes: "mt-8 pt-4 border-t",
      }
    case "creative":
      return {
        container: "bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-lg shadow-lg",
        borderColor: template.primaryColor,
        header: "mb-8",
        title: "text-4xl font-bold mb-2 bg-gradient-to-r from-violet-700 to-fuchsia-700 text-transparent bg-clip-text",
        companyName: "text-2xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-transparent bg-clip-text",
        sectionTitle: "text-lg font-semibold mb-2 text-violet-700",
        table: "w-full",
        tableHeader: "border-b-2 border-violet-200 text-left py-3 font-semibold text-violet-800",
        tableRow: "border-b border-violet-100",
        tableCell: "py-3",
        totalSection: "w-64 bg-white bg-opacity-50 p-4 rounded-lg",
        totalRow: "flex justify-between py-2",
        grandTotal: "flex justify-between py-2 border-t-2 border-violet-300 font-bold text-lg text-violet-800",
        notes: "mt-8 p-4 bg-white bg-opacity-50 rounded-lg",
      }
    default:
      return {
        container: "bg-white",
        borderColor: template.primaryColor,
        header: "mb-8",
        title: "text-4xl font-bold mb-2",
        companyName: "text-2xl font-bold",
        sectionTitle: "text-lg font-semibold mb-2",
        table: "w-full",
        tableHeader: "border-b-2 text-left py-3 font-semibold",
        tableRow: "border-b",
        tableCell: "py-3",
        totalSection: "w-64",
        totalRow: "flex justify-between py-2",
        grandTotal: "flex justify-between py-2 border-t-2 font-bold text-lg",
        notes: "mt-8",
      }
  }
}
