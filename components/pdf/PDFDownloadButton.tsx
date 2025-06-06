// components/pdf/PDFDownloadButton.tsx
"use client";

import { useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Button } from "@/components/ui/button";
import { Download, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { InvoicePDF } from "./InvoicePDF";
import { Invoice } from "@/types";
import { cn } from "@/lib/utils";

interface PDFDownloadButtonProps {
  /** The invoice data to generate the PDF from */
  invoice: Invoice;
  /** Optional CSS class name for the button */
  className?: string;
  /** Optional text to show while loading */
  loadingText?: string;
  /** Optional text to show when ready */
  readyText?: string;
  /** Optional text to show when generating */
  generatingText?: string;
  /** Optional flag to show the download icon */
  showIcon?: boolean;
}

/**
 * A client-side button component that handles PDF generation and download.
 * Uses dynamic imports to avoid SSR issues with @react-pdf/renderer.
 */
export function PDFDownloadButton({ 
  invoice, 
  className = "",
  loadingText = "Loading...",
  readyText = "Download PDF",
  generatingText = "Generating...",
  showIcon = true
}: PDFDownloadButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Set mounted state to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      setHasError(false);
      setIsGenerating(false);
    };
  }, []);

  // Handle PDF generation start
  const handleGenerationStart = () => {
    setIsGenerating(true);
    setHasError(false);
    toast.success("Preparing your PDF...");
  };

  // Handle PDF generation error
  const handleError = (error: Error) => {
    console.error("PDF generation error:", error);
    toast.error("Failed to generate PDF. Please try again.");
    setHasError(true);
    setIsGenerating(false);
  };

  // Show loading state on server-side
  if (!isMounted) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        className={cn("gap-2", className)} 
        disabled
      >
        {showIcon && <Loader2 className="h-4 w-4 animate-spin" />}
        {loadingText}
      </Button>
    );
  }

  // Main render for client-side
  return (
    <PDFDownloadLink
      document={
        <InvoicePDF 
          invoice={invoice} 
          currency={invoice.currency || '$'} 
          templateId={invoice.template || 'default'}
        />
      }
      fileName={`invoice-${invoice.invoiceNumber || 'untitled'}.pdf`}
      onClick={handleGenerationStart}
    >
      {({ loading, error }) => {
        // Handle any errors from the PDF generation
        if (error && !hasError) {
          handleError(error);
        }
        
        const isProcessing = loading || isGenerating;
        
        return (
          <Button
            variant="outline"
            size="sm"
            className={cn("gap-2 transition-all", className, {
              "opacity-50 cursor-not-allowed": isProcessing,
              "hover:bg-destructive/10 text-destructive border-destructive/50": hasError,
            })}
            disabled={isProcessing || hasError}
            onClick={hasError ? () => window.location.reload() : undefined}
          >
            {isProcessing ? (
              <>
                {showIcon && <Loader2 className="h-4 w-4 animate-spin" />}
                {generatingText}
              </>
            ) : hasError ? (
              <>
                {showIcon && <X className="h-4 w-4" />}
                Try Again
              </>
            ) : (
              <>
                {showIcon && <Download className="h-4 w-4" />}
                {readyText}
              </>
            )}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
}