"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { CrmIntegration } from "@/components/admin/crm-integration"

export default function CrmIntegrationPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">CRM Integration</h1>
          <p className="text-muted-foreground">Manage customer data integration with CRM system</p>
        </div>

        <CrmIntegration />
      </div>
    </ProtectedRoute>
  )
}
