"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

interface LayoutWrapperProps {
  children: React.ReactNode
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname()
  
  const publicRoutes = ["/login", "/register"]
  const isPublicRoute = publicRoutes.includes(pathname)

  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="w-full">{children}</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
