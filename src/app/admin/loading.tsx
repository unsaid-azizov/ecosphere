'use client'

import { Skeleton } from '@/components/ui/skeleton'

export default function AdminLoading() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Skeleton */}
      <div className="hidden lg:block w-64 bg-gradient-to-b from-emerald-50 to-teal-100 border-r border-emerald-200">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content Skeleton */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden p-4 bg-white border-b">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-32" />
            <div className="w-6" />
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-8">
          <Skeleton className="h-8 w-64" />
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="p-6 bg-white rounded-lg border">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg border">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="p-6 bg-white rounded-lg border">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}