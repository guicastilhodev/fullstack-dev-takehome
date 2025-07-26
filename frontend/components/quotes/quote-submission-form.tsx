"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { quotesApiCompat as quotesApi, type QuoteCreateRequest } from "@/lib/api/generated-client"
import { FileUpload } from "./file-upload"
import { useToast } from "@/hooks/use-toast"

export function QuoteSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuoteCreateRequest>()

  const onSubmit = async (data: QuoteCreateRequest) => {
    setIsSubmitting(true)

    try {
      const submitData = {
        ...data,
        supporting_document: selectedFile || undefined,
      }

      await quotesApi.create(submitData)

      toast({
        title: "Success",
        description: "Quote submitted successfully!",
      })

      reset()
      setSelectedFile(null)
      router.push("/quotes")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit quote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Submit New Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="opportunity_id">Opportunity ID</Label>
            <Input
              id="opportunity_id"
              {...register("opportunity_id", {
                required: "Opportunity ID is required",
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
              placeholder="Enter opportunity ID"
            />
            {errors.opportunity_id && <p className="text-sm text-red-600">{errors.opportunity_id.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_name">Customer Name</Label>
            <Input
              id="customer_name"
              {...register("customer_name", {
                required: "Customer name is required",
                maxLength: { value: 255, message: "Maximum 255 characters" },
              })}
              placeholder="Enter customer name"
            />
            {errors.customer_name && <p className="text-sm text-red-600">{errors.customer_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_email">Customer Email</Label>
            <Input
              id="customer_email"
              type="email"
              {...register("customer_email", {
                required: "Customer email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
                maxLength: { value: 254, message: "Maximum 254 characters" },
              })}
              placeholder="Enter customer email"
            />
            {errors.customer_email && <p className="text-sm text-red-600">{errors.customer_email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="customer_company">Customer Company (Optional)</Label>
            <Input
              id="customer_company"
              {...register("customer_company", {
                maxLength: { value: 255, message: "Maximum 255 characters" },
              })}
              placeholder="Enter customer company"
            />
            {errors.customer_company && <p className="text-sm text-red-600">{errors.customer_company.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Supporting Document</Label>
            <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Submitting..." : "Submit Quote"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
