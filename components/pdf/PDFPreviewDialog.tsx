// components/pdf/PDFPreviewDialog.tsx
"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import { X, Loader2 } from "lucide-react";
import { Invoice } from "@/types";
import { toast } from "sonner";
import { PDFDownloadButton } from './PDFDownloadButton';

// Type for the PDF renderer module
type PDFRendererModule = {
  PDFViewer: React.ComponentType<any>;
  default?: {
    PDFViewer: React.ComponentType<any>;
  };
};

// Dynamically import PDF components with SSR disabled
const PDFViewer = dynamic<React.ComponentProps<typeof import('@react-pdf/renderer').PDFViewer>>(
  () => 
    import('@react-pdf/renderer')
      .then((mod: PDFRendererModule) => {
        // Handle ESM and CJS exports
        if (mod.PDFViewer) return mod.PDFViewer;
        if (mod.default?.PDFViewer) return mod.default.PDFViewer;
        throw new Error('PDFViewer component not found in @react-pdf/renderer');
      })
      .catch((error) => {
        console.error('Failed to load PDFViewer:', error);
        throw error;
      }),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
);

// Import the PDF document with the correct props interface
const PDFDocument = dynamic<{ 
  invoice: Invoice; 
  currency?: string; 
  templateId?: string;
}>(
  () => import('./InvoicePDF')
    .then((mod) => {
      const PDF = mod.default || mod.InvoicePDF;
      if (!PDF) {
        throw new Error('InvoicePDF component not found in module');
      }
      
      // Return a simple wrapper component
      return function WrappedPDF({ 
        invoice, 
        currency = '$', 
        templateId = 'modern' 
      }: { 
        invoice: Invoice; 
        currency?: string; 
        templateId?: string 
      }) {
        return <PDF invoice={invoice} currency={currency} templateId={templateId} />;
      };
    })
    .catch((error) => {
      console.error('Failed to load InvoicePDF:', error);
      throw error;
    }),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }
);

interface PDFPreviewDialogProps {
  invoice: Invoice;
  className?: string;
  buttonText?: string;
}

export function PDFPreviewDialog({ 
  invoice, 
  className = "",
  buttonText = "Preview PDF" 
}: PDFPreviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpen = () => {
    try {
      setIsOpen(true);
      setError(null);
      setIsLoading(true);
    } catch (err) {
      console.error("Error opening PDF preview:", err);
      toast.error("Failed to open PDF preview");
      setError(err instanceof Error ? err : new Error("Unknown error occurred"));
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = (err: Error) => {
    console.error("PDF preview error:", err);
    toast.error("Failed to load PDF preview");
    setError(err);
    setIsLoading(false);
  };

  if (!isMounted) {
    return (
      <Button variant="outline" size="sm" className={className} disabled>
        {buttonText}
      </Button>
    );
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleOpen}
        className={className}
      >
        {buttonText}
      </Button>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="bg-background rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col shadow-xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">
                Invoice Preview: {invoice.invoiceNumber || 'Untitled'}
              </h3>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close preview"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-hidden">
              {error ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <p className="text-destructive font-medium mb-4">
                    Failed to load PDF preview
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {error.message}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                    }}
                  >
                    Retry
                  </Button>
                </div>
              ) : (
                <div className="h-[calc(90vh-8rem)] w-full">
                  <div className="h-full w-full">
                    <PDFViewer width="100%" height="100%">
                      <PDFDocument 
                        invoice={invoice} 
                        currency="$" 
                        templateId={invoice.template || 'default'}
                      />
                    </PDFViewer>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t flex justify-end gap-2">
              <PDFDownloadButton 
                invoice={invoice}
                className="border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-xs"
              />
              <Button 
                size="sm" 
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}