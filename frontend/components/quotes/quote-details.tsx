"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "./file-upload"
import { useAuth } from "@/contexts/auth-context"
import { quotesApiCompat as quotesApi, type Quote } from "@/lib/api/generated-client"
import { useToast } from "@/hooks/use-toast"
import { Calendar, User, Mail, Building, FileText, Download, ShieldCheck, CheckCircle, XCircle, Upload } from "lucide-react"

interface QuoteDetailsProps {
  quote: Quote
  onUpdate: (updatedQuote: Quote) => void
}

export function QuoteDetails({ quote, onUpdate }: QuoteDetailsProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
   
  const handleDownload = () => {
    if (quote.supporting_document) {
      const link = document.createElement("a")
      link.href = quote.supporting_document
      link.download = `quote-${quote.id}-document`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleSetStatus = async (status: "Approved" | "Rejected") => {
    setIsUpdating(true)
    try {
      const updatedQuote = await quotesApi.setStatus(quote.id, { status })
      onUpdate(updatedQuote)
      toast({
        title: "Status Updated",
        description: `Quote has been ${status.toLowerCase()}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quote status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    try {
      const updatedQuote = await quotesApi.uploadFile(quote.id, selectedFile)
      onUpdate(updatedQuote)
      setSelectedFile(null)
      toast({
        title: "Document Uploaded",
        description: "Supporting document has been uploaded successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Quote #{quote.id}</CardTitle>
              <p className="text-muted-foreground mt-1">Opportunity ID: {quote.opportunity_id}</p>
            </div>
            <StatusBadge status={quote.status} />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Customer Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                Customer Name
              </div>
              <p className="font-medium">{quote.customer_name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                Email
              </div>
              <p className="font-medium">{quote.customer_email}</p>
            </div>

            {quote.customer_company && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building className="h-4 w-4" />
                  Company
                </div>
                <p className="font-medium">{quote.customer_company}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quote Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Created Date
              </div>
              <p className="font-medium">
                {new Date(quote.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Last Updated
              </div>
              <p className="font-medium">
                {new Date(quote.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>

          {quote.supporting_document && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  Supporting Document
                </div>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Document
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {quote.status === "Pending Review" && (user?.is_staff || String(quote.submitted_by) === String(user?.id)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Supporting Document
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {quote.supporting_document ? (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 mb-2">
                  A supporting document is already uploaded. You can replace it by uploading a new one.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800 mb-2">
                  Upload a supporting document to provide additional information for your quote.
                </p>
              </div>
            )}
            
            <FileUpload onFileSelect={setSelectedFile} selectedFile={selectedFile} />
            
            {selectedFile && (
              <div className="flex gap-2">
                <Button 
                  onClick={handleFileUpload} 
                  disabled={isUploading}
                  className="flex-1"
                >
                  {isUploading ? "Uploading..." : "Upload Document"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedFile(null)}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Quote Submitted</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(quote.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {quote.status !== "Pending Review" && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-2 h-2 rounded-full ${
                    quote.status === "Approved"
                      ? "bg-green-500"
                      : quote.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-blue-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium">Status Updated to {quote.status}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(quote.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
