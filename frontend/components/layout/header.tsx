"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { LogOut, User } from "lucide-react"
import Link from "next/link"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Quote Portal
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="text-sm font-medium">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-muted-foreground">({user?.role})</span>
          </div>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
