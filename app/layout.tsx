import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Free Invoice Generator  Create & Download Professional Invoices Online',
  description: 'Generate professional invoices instantly with our Free Invoice Generator. Customize, download, and send invoices effortlessly—perfect for freelancers, businesses, and entrepreneurs. Simplify your billing process today!',

}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
