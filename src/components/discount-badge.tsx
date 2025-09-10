'use client'

import { Badge } from '@/components/ui/badge'
import { Tag } from 'lucide-react'

interface DiscountBadgeProps {
  discountPercent: number
  discountName?: string
  className?: string
}

export function DiscountBadge({ 
  discountPercent, 
  discountName,
  className = '' 
}: DiscountBadgeProps) {
  if (discountPercent <= 0) return null

  return (
    <Badge 
      className={`bg-red-500 hover:bg-red-600 text-white flex items-center gap-1 ${className}`}
    >
      <Tag className="w-3 h-3" />
      -{discountPercent}%
      {discountName && (
        <span className="text-xs ml-1 opacity-90">
          {discountName.length > 15 ? `${discountName.substring(0, 15)}...` : discountName}
        </span>
      )}
    </Badge>
  )
}