'use client'

import { Navbar } from '@/components/navbar'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-96 rounded-lg" />
            <div className="flex space-x-2">
              <Skeleton className="w-20 h-20 rounded" />
              <Skeleton className="w-20 h-20 rounded" />
              <Skeleton className="w-20 h-20 rounded" />
            </div>
          </div>
          
          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            
            <div className="flex space-x-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}