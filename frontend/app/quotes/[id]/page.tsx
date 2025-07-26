"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { QuoteDetails } from "@/components/quotes/quote-details"
import { Button } from "@/components/ui/button"
import { quotesApiCompat as quotesApi, type Quote } from "@/lib/api/generated-client"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

function QuoteDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const quoteId = Number.parseInt(params.id as string)

  useEffect(() => {
    if (quoteId) {
      fetchQuote()
    }
  }, [quoteId])

  const fetchQuote = async () => {
    try {
      setIsLoading(true)
      const data = await quotesApi.get(quoteId)
      setQuote(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quote details",
        variant: "destructive",
      })
      router.push("/quotes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuoteUpdate = (updatedQuote: Quote) => {
    setQuote(updatedQuote)
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!quote) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Quote not found</p>
          <Button asChild className="mt-4">
            <Link href="/quotes">Back to Quotes</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/quotes">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Quotes
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Quote Details</h1>
          <p className="text-muted-foreground">View detailed information about this quote request</p>
        </div>
      </div>

      <QuoteDetails quote={quote} onUpdate={handleQuoteUpdate} />
    </div>
  )
}

export default function QuoteDetailsPage() {
  return (
    <ProtectedRoute>
      <QuoteDetailsContent />
    </ProtectedRoute>
  )
}
