'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChartData {
  date: string
  revenue: number
  orders: number
}

interface OrderChartData {
  date: string
  orders: number
}

interface DashboardChartsProps {
  revenueData: ChartData[]
  orderData: OrderChartData[]
}

// Simple chart component using CSS for visualization
function SimpleAreaChart({ data, dataKey, label, color, formatter }: {
  data: any[]
  dataKey: string
  label: string
  color: string
  formatter: (value: number) => string
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Нет данных</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => item[dataKey]))
  const minValue = Math.min(...data.map(item => item[dataKey]))
  const hasData = data.some(item => item[dataKey] > 0)
  
  if (!hasData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Нет данных за этот период</div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Chart area */}
      <div className="relative flex items-end justify-between px-4 pb-8 pt-4" style={{ height: '240px' }}>
        {data.map((item, index) => {
          // Normalize height to use full available space
          const value = item[dataKey] || 0
          const maxHeight = 180 // Available height in pixels
          const normalizedHeight = maxValue > 0 ? Math.max((value / maxValue) * maxHeight, value > 0 ? 12 : 0) : 0
          
          return (
            <div key={index} className="flex flex-col items-center" style={{ flex: '1 1 0%', maxWidth: '80px' }}>
              <div 
                className="w-full max-w-8 rounded-t-sm transition-all duration-300 hover:scale-105 cursor-pointer relative group shadow-sm"
                style={{ 
                  height: `${normalizedHeight}px`, 
                  backgroundColor: color,
                  minHeight: value > 0 ? '12px' : '2px',
                  opacity: value > 0 ? 1 : 0.3
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                  <div className="font-medium">{formatter(value)}</div>
                  <div className="text-xs text-gray-300">{item.date}</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between px-4 pt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-muted-foreground text-center" style={{ flex: '1 1 0%', maxWidth: '80px' }}>
            <div className="transform -rotate-45 origin-center whitespace-nowrap" style={{ fontSize: '10px' }}>
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SimpleBarChart({ data, dataKey, label, color, formatter }: {
  data: any[]
  dataKey: string
  label: string
  color: string
  formatter: (value: number) => string
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Нет данных</div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(item => item[dataKey]))
  const hasData = data.some(item => item[dataKey] > 0)
  
  if (!hasData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-muted-foreground">Нет данных за этот период</div>
      </div>
    )
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Chart area */}
      <div className="relative flex items-end justify-between px-4 pb-8 pt-4" style={{ height: '240px' }}>
        {data.map((item, index) => {
          // Normalize height to use full available space
          const value = item[dataKey] || 0
          const maxHeight = 180 // Available height in pixels
          const normalizedHeight = maxValue > 0 ? Math.max((value / maxValue) * maxHeight, value > 0 ? 12 : 0) : 0
          
          return (
            <div key={index} className="flex flex-col items-center" style={{ flex: '1 1 0%', maxWidth: '80px' }}>
              <div 
                className="w-full max-w-12 rounded-t transition-all duration-300 hover:scale-105 cursor-pointer relative group shadow-sm"
                style={{ 
                  height: `${normalizedHeight}px`, 
                  backgroundColor: color,
                  minHeight: value > 0 ? '12px' : '2px',
                  opacity: value > 0 ? 1 : 0.3
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                  <div className="font-medium">{formatter(value)}</div>
                  <div className="text-xs text-gray-300">{item.date}</div>
                  {/* Arrow */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between px-4 pt-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-muted-foreground text-center" style={{ flex: '1 1 0%', maxWidth: '80px' }}>
            <div className="transform -rotate-45 origin-center whitespace-nowrap" style={{ fontSize: '10px' }}>
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardCharts({ revenueData, orderData }: DashboardChartsProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    // Ensure component is fully mounted before rendering
    const timer = setTimeout(() => {
      setMounted(true)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Доходы по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Загрузка графиков...</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Заказы по дням</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <div className="animate-pulse text-muted-foreground">Загрузка графиков...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Доходы по дням</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <SimpleAreaChart 
              data={revenueData}
              dataKey="revenue"
              label="Доход"
              color="#10b981"
              formatter={(value: number) => `₽${value.toLocaleString()}`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Заказы по дням</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <SimpleBarChart 
              data={orderData}
              dataKey="orders"
              label="Заказов"
              color="#14b8a6"
              formatter={(value: number) => value.toString()}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}