'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-700">Что-то пошло не так</h2>
            <p className="text-gray-600">
              Произошла непредвиденная ошибка. Попробуйте обновить страницу
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={reset} 
              className="w-full bg-forest-600 hover:bg-forest-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Попробовать снова
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                На главную
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Если ошибка повторяется, сообщите нам:
            </p>
            <a 
              href="mailto:info@ecosphere.su" 
              className="text-xs text-forest-600 hover:text-forest-700"
            >
              info@ecosphere.su
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}