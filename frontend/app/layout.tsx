import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { QuotesProvider } from "@/contexts/quotes-context"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quote Portal",
  description: "Quote management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <QuotesProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
            <Toaster />
          </QuotesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
