"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Activity } from "lucide-react"
import Link from "next/link"

function DashboardContent() {
  const { user } = useAuth()

  const salesActions = [
    {
      title: "Submit New Quote",
      description: "Create a new quote request",
      href: "/quotes/new",
      icon: Plus,
      color: "bg-blue-500",
    },
    {
      title: "My Quotes",
      description: "View and manage your quotes",
      href: "/quotes",
      icon: FileText,
      color: "bg-green-500",
    },
  ]

  const adminActions = [
    {
      title: "All Quotes",
      description: "Review and manage all quotes",
      href: "/quotes",
      icon: FileText,
      color: "bg-blue-500",
    },
    {
      title: "Activity Logs",
      description: "View system activity logs",
      href: "/admin/logs",
      icon: Activity,
      color: "bg-purple-500",
    },
  ]

  const actions = user?.is_staff ? adminActions : salesActions

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user?.first_name ? user.first_name : user?.username}!</h1>
        <p className="text-muted-foreground mt-2">Here's what you can do today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Card key={action.href} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{action.description}</p>
                <Button asChild className="w-full">
                  <Link href={action.href}>Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
