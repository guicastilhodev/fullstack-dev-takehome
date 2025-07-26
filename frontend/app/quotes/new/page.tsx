"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { QuoteSubmissionForm } from "@/components/quotes/quote-submission-form"

export default function NewQuotePage() {
  return (
    <ProtectedRoute salesOnly>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Submit New Quote</h1>
          <p className="text-muted-foreground">Fill out the form below to submit a new quote request</p>
        </div>
        <QuoteSubmissionForm />
      </div>
    </ProtectedRoute>
  )
}
