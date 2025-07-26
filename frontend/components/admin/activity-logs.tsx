"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { logsApiCompat as logsApi, type IntegrationLog } from "@/lib/api/generated-client"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Activity, RefreshCw, Search, Filter } from "lucide-react"

const ACTION_TYPES = [
  { value: "all", label: "All Actions" },
  { value: "CREATE", label: "Quote Created" },
  { value: "STATUS", label: "Status Changes" },
  { value: "UPLOAD", label: "File Upload" },
  { value: "ERP_SUCCESS", label: "ERP Success" },
  { value: "ERP_FAILURE", label: "ERP Failure" },
  { value: "CRM", label: "CRM Integration" },
]

export function ActivityLogs() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [logs, setLogs] = useState<IntegrationLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<IntegrationLog[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [quoteIdFilter, setQuoteIdFilter] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    filterLogs()
  }, [logs, searchTerm, actionFilter, quoteIdFilter])

  const fetchLogs = async () => {
    try {
      setIsLoading(true)
      const data = await logsApi.list()
      setLogs(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load activity logs",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterLogs = () => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(
        (log) => {
          const quoteId = log.payload?.quote_id?.toString() || log.quote?.split(' - ')[0] || "";
          return (
            log.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.id.toString().includes(searchTerm) ||
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            quoteId.includes(searchTerm)
          )
        }
      )
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter((log) => log.action === actionFilter)
    }

    if (quoteIdFilter) {
      filtered = filtered.filter((log) => {
        const quoteId = log.payload?.quote_id?.toString() || log.quote?.split(' - ')[0] || "";
        return quoteId.includes(quoteIdFilter)
      })
    }

    setFilteredLogs(filtered)
  }

  const getActionBadgeColor = (action: IntegrationLog["action"]) => {
    switch (action) {
      case "CREATE":
        return "bg-blue-100 text-blue-800"
      case "STATUS_CHANGE":
        return "bg-purple-100 text-purple-800"
      case "UPLOAD":
        return "bg-green-100 text-green-800"
      case "ERP_SUCCESS":
        return "bg-emerald-100 text-emerald-800"
      case "ERP_FAILURE":
        return "bg-red-100 text-red-800"
      case "CRM":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setActionFilter("all")
    setQuoteIdFilter("")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Logs
            {user?.is_staff ? " (All Users)" : " (My Activity)"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                {ACTION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              placeholder="Quote ID filter"
              value={quoteIdFilter}
              onChange={(e) => setQuoteIdFilter(e.target.value)}
              className="w-full sm:w-40"
            />

            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quote</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {logs.length === 0 ? "No activity logs found" : "No logs match your filters"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>
                        <Badge className={getActionBadgeColor(log.action)}>{log.action}</Badge>
                      </TableCell>
                      <TableCell>{log.status}</TableCell>
                      <TableCell>
                        {log.payload?.quote_id ? (
                          <span className="font-medium">#{log.payload.quote_id}</span>
                        ) : log.quote ? (
                          <span className="font-medium">#{log.quote.split(' - ')[0]}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{log.user}</span>
                      </TableCell>
                      <TableCell>
                        {new Date(log.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="max-w-md">
                        {log.response ? (
                          <div className="truncate" title={JSON.stringify(log.response, null, 2)}>
                            {log.response.message || JSON.stringify(log.response)}
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="mt-4 text-sm text-muted-foreground">
          Showing {filteredLogs.length} of {logs.length} logs
        </div>
      </CardContent>
    </Card>
  )
}
