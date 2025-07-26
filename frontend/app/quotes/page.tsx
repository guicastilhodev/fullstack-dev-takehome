"use client"

import { useEffect, useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { QuotesTable } from "@/components/quotes/quotes-table"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { quotesApiCompat as quotesApi, type Quote } from "@/lib/api/generated-client"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import Link from "next/link"

function QuotesContent() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      setIsLoading(true)
      const data = await quotesApi.list()
      setQuotes(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load quotes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{user?.is_staff ? "All Quotes" : "My Quotes"}</h1>
          <p className="text-muted-foreground">
            {user?.is_staff ? "Review and manage all quote requests" : "View and track your quote requests"}
          </p>
        </div>

        {!user?.is_staff && (
          <Button asChild>
            <Link href="/quotes/new">
              <Plus className="h-4 w-4 mr-2" />
              New Quote
            </Link>
          </Button>
        )}
      </div>

      <QuotesTable quotes={quotes} isLoading={isLoading} />
    </div>
  )
}

export default function QuotesPage() {
  return (
    <ProtectedRoute>
      <QuotesContent />
    </ProtectedRoute>
  )
}
