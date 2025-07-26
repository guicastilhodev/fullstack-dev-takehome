"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { useAuth } from "@/contexts/auth-context"
import type { Quote } from "@/lib/api/generated-client"
import { Eye, FileText, Calendar, ClipboardCheck } from "lucide-react"

interface QuotesTableProps {
  quotes: Quote[]
  isLoading?: boolean
}

export function QuotesTable({ quotes, isLoading }: QuotesTableProps) {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"created_at" | "customer_name" | "status" | "opportunity_id">("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const filteredQuotes = quotes
    .filter((quote) => {
      const matchesSearch =
        quote.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.opportunity_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.customer_company && quote.customer_company.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === "all" || quote.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === "created_at") {
        aValue = new Date(aValue).getTime()
        bValue = new Date(bValue).getTime()
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {user?.is_staff ? "All Quotes" : "My Quotes"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input placeholder="Search quotes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Pending Review">Pending Review</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Converted to Order">Converted to Order</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("opportunity_id")}>
                  Opportunity ID
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("customer_name")}>
                  Customer
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("status")}>
                  Status
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("created_at")}>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Created
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No quotes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.opportunity_id}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{quote.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{quote.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{quote.customer_company || "-"}</TableCell>
                    <TableCell>
                      <StatusBadge status={quote.status} />
                    </TableCell>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/quotes/${quote.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {user?.is_staff && quote.status === "Pending Review" && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/quotes/${quote.id}/review`}>
                              <ClipboardCheck className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredQuotes.length} of {quotes.length} quotes
        </div>
      </CardContent>
    </Card>
  )
}
