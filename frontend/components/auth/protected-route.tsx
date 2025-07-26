"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  adminOnly?: boolean
  salesOnly?: boolean
}

export function ProtectedRoute({
  children,
  adminOnly = false,
  salesOnly = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (adminOnly && !user?.is_staff) {
      router.push("/quotes") 
      return
    }

    if (salesOnly && user?.is_staff) {
      router.push("/quotes")  
      return
    }
  }, [isAuthenticated, user, isLoading, adminOnly, salesOnly, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) return null
  if (adminOnly && !user?.is_staff) return null
  if (salesOnly && user?.is_staff) return null

  return <>{children}</>
}
