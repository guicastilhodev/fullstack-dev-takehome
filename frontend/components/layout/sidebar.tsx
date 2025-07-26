"use client"

import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { FileText, Home, Plus, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const salesNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/quotes/new", label: "New Quote", icon: Plus },
  { href: "/quotes", label: "My Quotes", icon: FileText },
]

const adminNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/quotes", label: "All Quotes", icon: FileText },
  { href: "/admin/logs", label: "Activity Logs", icon: Activity },
]

export function Sidebar() {
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()

  if (!isAuthenticated) {
    return null
  }

  const navItems = user?.is_staff ? adminNavItems : salesNavItems

  return (
    <aside className="w-64 bg-gray-50 border-r min-h-screen">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
