'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'

// Create a client component that wraps the provider
const ClientThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  const [mounted, setMounted] = React.useState(false)

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
      <Toaster position="top-center" />
    </NextThemesProvider>
  )
}

// Export the provider with proper typing
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <ClientThemeProvider {...props}>{children}</ClientThemeProvider>
}

// Export the hook for theme access
export { useTheme } from 'next-themes'
