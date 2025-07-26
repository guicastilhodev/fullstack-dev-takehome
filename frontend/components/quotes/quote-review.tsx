"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { quotesApiCompat as quotesApi, type Quote } from "@/lib/api/generated-client"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, Package, AlertTriangle } from "lucide-react"

interface QuoteReviewProps {
  quote: Quote
  onStatusUpdate: (updatedQuote: Quote) => void
}

export function QuoteReview({ quote, onStatusUpdate }: QuoteReviewProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [reviewNotes, setReviewNotes] = useState("")
  const { toast } = useToast()

  const handleStatusUpdate = async (status: Quote["status"]) => {
    if (status === "Converted to Order" && quote.status !== "Approved") {
      toast({
        title: "Cannot Convert",
        description: "Quote must be approved before it can be converted to an order",
        variant: "destructive",
      })
      return
    }

    if (status === "Converted to Order" && !quote.supporting_document) {
      toast({
        title: "Cannot Convert",
        description: "Quote must have a supporting document before it can be converted to an order",
        variant: "destructive",
      })
      return
    }

    setIsUpdating(true)

    try {
      const updatedQuote = await quotesApi.setStatus(quote.id, { status })
      onStatusUpdate(updatedQuote)

      toast({
        title: "Status Updated",
        description: `Quote has been ${status.toLowerCase()}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quote status",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const canConvert = quote.status === "Approved" && quote.supporting_document

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
          <Textarea
            id="reviewNotes"
            placeholder="Add any notes about this quote review..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={3}
          />
        </div>

        {quote.status === "Approved" && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {canConvert
                ? "This quote meets all requirements and can be converted to an order."
                : "This quote needs a supporting document before it can be converted to an order."}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap gap-3">
          {quote.status === "Pending Review" && (
            <>
              <Button
                onClick={() => handleStatusUpdate("Approved")}
                disabled={isUpdating}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Quote
              </Button>

              <Button onClick={() => handleStatusUpdate("Rejected")} disabled={isUpdating} variant="destructive">
                <XCircle className="h-4 w-4 mr-2" />
                Reject Quote
              </Button>
            </>
          )}

          {quote.status === "Approved" && (
            <Button
              onClick={() => handleStatusUpdate("Converted to Order")}
              disabled={isUpdating || !canConvert}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Package className="h-4 w-4 mr-2" />
              Convert to Order
            </Button>
          )}

          {quote.status === "Rejected" && (
            <Button onClick={() => handleStatusUpdate("Pending Review")} disabled={isUpdating} variant="outline">
              Reopen for Review
            </Button>
          )}

          {quote.status === "Converted to Order" && (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>This quote has been converted to an order and cannot be modified.</AlertDescription>
            </Alert>
          )}
        </div>

        {isUpdating && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Updating status...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
