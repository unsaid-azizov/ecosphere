'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Package, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProductNotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-gray-100">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <Package className="w-12 h-12 text-orange-600" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Товар не найден</h1>
            <p className="text-gray-600">
              Возможно, товар был удален или изменен артикул
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться назад
            </Button>
            
            <Link href="/catalog" className="block">
              <Button className="w-full bg-forest-600 hover:bg-forest-700">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Перейти в каталог
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Нужна помощь в поиске товара?
            </p>
            <a 
              href="tel:+79812808585" 
              className="text-xs text-forest-600 hover:text-forest-700"
            >
              +7 981 280-85-85
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}