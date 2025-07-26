"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import { ActivityLogs } from "@/components/admin/activity-logs"

export default function ActivityLogsPage() {
  return (
    <ProtectedRoute adminOnly>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and integration logs</p>
        </div>

        <ActivityLogs />
      </div>
    </ProtectedRoute>
  )
}
