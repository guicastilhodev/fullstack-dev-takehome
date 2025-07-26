import { Badge } from "@/components/ui/badge"
import type { Quote } from "@/lib/api/generated-client"

interface StatusBadgeProps {
  status: Quote["status"]
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getVariant = (status: Quote["status"]) => {
    switch (status) {
      case "Pending Review":
        return "secondary"
      case "Approved":
        return "default"
      case "Rejected":
        return "destructive"
      case "Converted to Order":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getColor = (status: Quote["status"]) => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "Approved":
        return "bg-green-100 text-green-800 hover:bg-green-100"
      case "Rejected":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "Converted to Order":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
      default:
        return ""
    }
  }

  return (
    <Badge variant={getVariant(status)} className={getColor(status)}>
      {status}
    </Badge>
  )
}
