"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { ErpIntegration } from "@/components/admin/erp-integration"

export default function ErpIntegrationPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">ERP Integration</h1>
          <p className="text-muted-foreground">Manage order processing integration with ERP system</p>
        </div>

        <ErpIntegration />
      </div>
    </ProtectedRoute>
  )
}
