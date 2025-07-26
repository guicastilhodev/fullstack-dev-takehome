"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { Quote } from "@/lib/api/generated-client"

interface QuotesContextType {
  quotes: Quote[]
  setQuotes: (quotes: Quote[]) => void
  currentQuote: Quote | null
  setCurrentQuote: (quote: Quote | null) => void
  refreshQuotes: () => Promise<void>
}

const QuotesContext = createContext<QuotesContextType | undefined>(undefined)

export function QuotesProvider({ children }: { children: React.ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)

  const refreshQuotes = async () => {
  }

  return (
    <QuotesContext.Provider
      value={{
        quotes,
        setQuotes,
        currentQuote,
        setCurrentQuote,
        refreshQuotes,
      }}
    >
      {children}
    </QuotesContext.Provider>
  )
}

export function useQuotes() {
  const context = useContext(QuotesContext)
  if (context === undefined) {
    throw new Error("useQuotes must be used within a QuotesProvider")
  }
  return context
}
