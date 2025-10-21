'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Search, Package, AlertTriangle, CheckCircle, Edit, Eye, Plus, Save, X, Trash2, Download, Upload } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useRef } from 'react'
import { ImageUpload } from '@/components/image-upload'

interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: string
  images: string[]
  article: string
  stockQuantity: number
  isAvailable: boolean
  createdAt: string
  updatedAt: string
}

interface ProductStats {
  totalProducts: number
  availableProducts: number
  lowStockProducts: number
}

interface ProductsTableProps {
  initialProducts: Product[]
  stats: ProductStats
  totalCount: number
}

export function ProductsTable({ initialProducts, stats, totalCount }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('ALL')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMoreProducts, setHasMoreProducts] = useState(products.length < totalCount)
  const [isCleaningUp, setIsCleaningUp] = useState(false)
  const [cleanupResult, setCleanupResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Получение уникальных категорий
  const categories = Array.from(new Set(products.map(p => p.category)))

  // Функция для загрузки дополнительных товаров
  const loadMoreProducts = async () => {
    if (loadingMore || !hasMoreProducts) return

    setLoadingMore(true)
    try {
      const response = await fetch(`/api/admin/products?limit=50&offset=${products.length}`)
      const data = await response.json()
      
      if (response.ok) {
        setProducts(prev => [...prev, ...data.products])
        setHasMoreProducts(data.hasMore)
      } else {
        console.error('Ошибка загрузки товаров:', data.error)
      }
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  // Фильтрация товаров
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.article.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === 'ALL' || product.category === categoryFilter
    
    const matchesAvailability = availabilityFilter === 'ALL' || 
      (availabilityFilter === 'AVAILABLE' && product.isAvailable) ||
      (availabilityFilter === 'UNAVAILABLE' && !product.isAvailable) ||
      (availabilityFilter === 'LOW_STOCK' && product.stockQuantity <= 5)
    
    return matchesSearch && matchesCategory && matchesAvailability
  })

  const updateProductAvailability = async (productId: string, isAvailable: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/availability`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable })
      })
      
      if (response.ok) {
        // Обновляем локальное состояние вместо перезагрузки страницы
        setProducts(prev => prev.map(p => 
          p.id === productId ? { ...p, isAvailable } : p
        ))
      } else {
        alert('Ошибка при изменении доступности')
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      alert('Ошибка при изменении доступности')
    }
  }

  const handleExportCatalog = () => {
    window.location.href = '/api/admin/export/catalog'
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setErrorMessages(['Пожалуйста, выберите Excel файл (.xlsx или .xls)'])
      setErrorDialogOpen(true)
      return
    }

    setIsImporting(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/import/catalog', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok && response.status !== 207) {
        setErrorMessages(result.errors || [result.error || 'Неизвестная ошибка'])
        setErrorDialogOpen(true)
      } else {
        // Show success message
        const importSummary = result.imported?.map((item: any) => `${item.table}: ${item.count}\n${item.details || ''}`).join('\n') || ''

        // If there are errors/warnings, show them
        if (result.errors && result.errors.length > 0) {
          const warningMessage = `Импорт завершен с предупреждениями:\n\n${importSummary}\n\nПредупреждения:\n${result.errors.slice(0, 10).join('\n')}${result.errors.length > 10 ? `\n\n...и еще ${result.errors.length - 10} предупреждений` : ''}`
          alert(warningMessage)
        } else {
          alert(`Импорт успешно завершен!\n\n${importSummary}`)
        }

        window.location.reload()
      }
    } catch (error) {
      console.error('Error importing catalog:', error)
      setErrorMessages(['Ошибка при импорте каталога. Проверьте формат файла.'])
      setErrorDialogOpen(true)
    } finally {
      setIsImporting(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleCleanupImages = async () => {
    setIsCleaningUp(true)
    try {
      const response = await fetch('/api/admin/cleanup/images', {
        method: 'POST',
      })
      
      const result = await response.json()
      
      if (response.ok) {
        setCleanupResult(result)
        alert(`Очистка завершена!\n\nУдалено файлов: ${result.deleted}\nРазмер папки: ${result.uploadsInfo.sizeFormatted}\nФайлов в папке: ${result.uploadsInfo.files}`)
      } else {
        alert(`Ошибка очистки: ${result.error}`)
      }
    } catch (error) {
      console.error('Error cleaning up images:', error)
      alert('Ошибка при очистке изображений')
    } finally {
      setIsCleaningUp(false)
    }
  }

  const openProductDetails = (product: Product) => {
    setSelectedProduct(product)
    setIsProductDialogOpen(true)
    setIsEditMode(false)
    setEditingProduct(null)
  }

  const openEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setEditingProduct({ ...product })
    setIsProductDialogOpen(true)
    setIsEditMode(true)
  }

  const openCreateProduct = () => {
    setEditingProduct({
      name: '',
      description: '',
      price: 0,
      category: '',
      article: '',
      stockQuantity: 0,
      isAvailable: true,
      images: []
    })
    setIsCreateDialogOpen(true)
    setIsEditMode(true)
  }

  const saveProduct = async (isNew: boolean = false) => {
    if (!editingProduct) return

    setLoading(true)
    try {
      const url = isNew ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`
      const method = isNew ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      })
      
      if (response.ok) {
        // Перезагружаем все товары после создания/обновления
        const refreshResponse = await fetch(`/api/admin/products?limit=${products.length + 10}&offset=0`)
        const refreshData = await refreshResponse.json()
        if (refreshResponse.ok) {
          setProducts(refreshData.products)
          setHasMoreProducts(refreshData.hasMore)
        } else {
          window.location.reload()
        }
      } else {
        const result = await response.json()
        alert(result.error || 'Ошибка при сохранении товара')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Ошибка при сохранении товара')
    } finally {
      setLoading(false)
    }
  }

  const updateEditingProduct = (field: string, value: any) => {
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [field]: value })
    }
  }

  const openDeleteProduct = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const deleteProduct = async () => {
    if (!productToDelete) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        // Удаляем товар из локального состояния
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id))
        setHasMoreProducts(prev => prev || products.length > 1)
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Ошибка при удалении товара')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка при удалении товара')
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Всего товаров</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Доступно</p>
                <p className="text-2xl font-bold text-gray-900">{stats.availableProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Мало на складе</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Import/Export Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleExportCatalog}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Экспорт каталога (Excel)
            </Button>

            <Button
              variant="outline"
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isImporting ? 'Импортирование...' : 'Импорт каталога (Excel)'}
            </Button>

            <Button
              variant="outline"
              onClick={handleCleanupImages}
              disabled={isCleaningUp}
              className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
            >
              <Trash2 className="h-4 w-4" />
              {isCleaningUp ? 'Очистка...' : 'Очистить неиспользуемые изображения'}
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="search">Поиск товаров</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Название, артикул, категория..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div>
              <Label>Категория</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все категории" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все категории</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Доступность</Label>
              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все товары" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все товары</SelectItem>
                  <SelectItem value="AVAILABLE">Доступны</SelectItem>
                  <SelectItem value="UNAVAILABLE">Недоступны</SelectItem>
                  <SelectItem value="LOW_STOCK">Мало на складе</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Товары ({totalCount})
              {filteredProducts.length !== products.length && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (показано: {filteredProducts.length})
                </span>
              )}
            </CardTitle>
            <Button 
              onClick={openCreateProduct}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Добавить товар
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Товар</TableHead>
                  <TableHead>Артикул</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Остаток</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {product.images.length > 0 && (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.svg'
                            }}
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-muted-foreground">
                            ID: {product.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.article}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ₽{product.price.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${
                          product.stockQuantity <= 5 ? 'text-orange-600' : 
                          product.stockQuantity === 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {product.stockQuantity}
                        </span>
                        {product.stockQuantity <= 5 && (
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={product.isAvailable ? 'true' : 'false'} 
                        onValueChange={(value) => updateProductAvailability(product.id, value === 'true')}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Доступен
                            </div>
                          </SelectItem>
                          <SelectItem value="false">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              Недоступен
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openProductDetails(product)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDeleteProduct(product)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Товары не найдены</p>
              </div>
            )}
          </div>
          
          {/* Кнопка загрузки дополнительных товаров */}
          {hasMoreProducts && (
            <div className="flex justify-center mt-6">
              <Button
                onClick={loadMoreProducts}
                disabled={loadingMore}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    Показать больше товаров ({totalCount - products.length} осталось)
                  </>
                )}
              </Button>
            </div>
          )}
          
          {/* Информация о загруженных товарах */}
          <div className="text-center mt-4 text-sm text-gray-500">
            Показано {products.length} из {totalCount} товаров
          </div>
        </CardContent>
      </Card>

      {/* Edit/View Product Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
        setIsProductDialogOpen(open)
        if (!open) {
          setIsEditMode(false)
          setEditingProduct(null)
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {isEditMode ? 'Редактировать товар' : selectedProduct?.name}
              </div>
              {!isEditMode && selectedProduct && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => openEditProduct(selectedProduct)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Редактировать
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditMode ? 'Изменить информацию о товаре' : 'Детальная информация о товаре'}
            </DialogDescription>
          </DialogHeader>
          
          {(selectedProduct || editingProduct) && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-name">Название товара *</Label>
                    {isEditMode ? (
                      <Input
                        id="product-name"
                        value={editingProduct?.name || ''}
                        onChange={(e) => updateEditingProduct('name', e.target.value)}
                        placeholder="Введите название товара"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">{selectedProduct?.name}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product-article">Артикул *</Label>
                    {isEditMode ? (
                      <Input
                        id="product-article"
                        value={editingProduct?.article || ''}
                        onChange={(e) => updateEditingProduct('article', e.target.value)}
                        placeholder="Введите артикул"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md font-mono text-sm">{selectedProduct?.article}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product-category">Категория *</Label>
                    {isEditMode ? (
                      <div className="flex gap-2">
                        <Select
                          value={editingProduct?.category || ''}
                          onValueChange={(value) => updateEditingProduct('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Или новая категория"
                          onChange={(e) => updateEditingProduct('category', e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <Badge variant="outline">{selectedProduct?.category}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="product-price">Цена *</Label>
                    {isEditMode ? (
                      <Input
                        id="product-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={editingProduct?.price || 0}
                        onChange={(e) => updateEditingProduct('price', parseFloat(e.target.value) || 0)}
                        placeholder="0.00"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md font-medium">
                        ₽{selectedProduct?.price.toLocaleString()}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product-stock">Остаток на складе *</Label>
                    {isEditMode ? (
                      <Input
                        id="product-stock"
                        type="number"
                        min="0"
                        value={editingProduct?.stockQuantity || 0}
                        onChange={(e) => updateEditingProduct('stockQuantity', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <span className={`font-medium ${
                          (selectedProduct?.stockQuantity || 0) <= 5 ? 'text-orange-600' : 
                          (selectedProduct?.stockQuantity || 0) === 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {selectedProduct?.stockQuantity} шт
                        </span>
                        {(selectedProduct?.stockQuantity || 0) <= 5 && (
                          <div className="flex items-center gap-1 text-orange-600 text-sm mt-1">
                            <AlertTriangle className="h-3 w-3" />
                            Мало на складе
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="product-availability">Доступность</Label>
                    {isEditMode ? (
                      <Select
                        value={editingProduct?.isAvailable ? 'true' : 'false'}
                        onValueChange={(value) => updateEditingProduct('isAvailable', value === 'true')}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              Доступен
                            </div>
                          </SelectItem>
                          <SelectItem value="false">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              Недоступен
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-gray-50 rounded-md">
                        <Badge className={selectedProduct?.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {selectedProduct?.isAvailable ? 'Доступен' : 'Недоступен'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="product-description">Описание</Label>
                {isEditMode ? (
                  <Textarea
                    id="product-description"
                    value={editingProduct?.description || ''}
                    onChange={(e) => updateEditingProduct('description', e.target.value)}
                    placeholder="Описание товара"
                    rows={4}
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-md min-h-[100px]">
                    {selectedProduct?.description || 'Описание отсутствует'}
                  </div>
                )}
              </div>

              <div>
                <Label>Изображения</Label>
                {isEditMode ? (
                  <ImageUpload
                    images={editingProduct?.images || []}
                    onImagesChange={(images) => updateEditingProduct('images', images)}
                    maxImages={10}
                    className="mt-2"
                  />
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {selectedProduct?.images && selectedProduct.images.length > 0 ? (
                      selectedProduct.images.map((image, index) => (
                        <img 
                          key={index}
                          src={image} 
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-product.svg'
                          }}
                        />
                      ))
                    ) : (
                      <div className="text-gray-500 text-sm">Изображения отсутствуют</div>
                    )}
                  </div>
                )}
              </div>

              {!isEditMode && selectedProduct && (
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                    <div><strong>ID:</strong> {selectedProduct.id}</div>
                    <div><strong>Создан:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString('ru-RU')}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditMode && (
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditMode(false)
                  setEditingProduct(null)
                }}
                disabled={loading}
              >
                <X className="h-4 w-4 mr-2" />
                Отмена
              </Button>
              <Button 
                onClick={() => saveProduct(false)}
                disabled={loading || !editingProduct?.name || !editingProduct?.article || !editingProduct?.category}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Сохранить
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Product Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) {
          setEditingProduct(null)
          setIsEditMode(false)
        }
      }}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Добавить новый товар
            </DialogTitle>
            <DialogDescription>
              Заполните информацию о новом товаре
            </DialogDescription>
          </DialogHeader>
          
          {editingProduct && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-product-name">Название товара *</Label>
                    <Input
                      id="new-product-name"
                      value={editingProduct.name || ''}
                      onChange={(e) => updateEditingProduct('name', e.target.value)}
                      placeholder="Введите название товара"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-product-article">Артикул *</Label>
                    <Input
                      id="new-product-article"
                      value={editingProduct.article || ''}
                      onChange={(e) => updateEditingProduct('article', e.target.value)}
                      placeholder="Введите артикул"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-product-category">Категория *</Label>
                    <div className="flex gap-2">
                      <Select
                        value={editingProduct.category || ''}
                        onValueChange={(value) => updateEditingProduct('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="Или новая категория"
                        onChange={(e) => updateEditingProduct('category', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="new-product-price">Цена *</Label>
                    <Input
                      id="new-product-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={editingProduct.price || 0}
                      onChange={(e) => updateEditingProduct('price', parseFloat(e.target.value) || 0)}
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-product-stock">Остаток на складе *</Label>
                    <Input
                      id="new-product-stock"
                      type="number"
                      min="0"
                      value={editingProduct.stockQuantity || 0}
                      onChange={(e) => updateEditingProduct('stockQuantity', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="new-product-availability">Доступность</Label>
                    <Select
                      value={editingProduct.isAvailable ? 'true' : 'false'}
                      onValueChange={(value) => updateEditingProduct('isAvailable', value === 'true')}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            Доступен
                          </div>
                        </SelectItem>
                        <SelectItem value="false">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-3 w-3 text-red-500" />
                            Недоступен
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="new-product-description">Описание</Label>
                <Textarea
                  id="new-product-description"
                  value={editingProduct.description || ''}
                  onChange={(e) => updateEditingProduct('description', e.target.value)}
                  placeholder="Описание товара"
                  rows={4}
                />
              </div>

              <div>
                <Label>Изображения</Label>
                <ImageUpload
                  images={editingProduct.images || []}
                  onImagesChange={(images) => updateEditingProduct('images', images)}
                  maxImages={10}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Отмена
            </Button>
            <Button 
              onClick={() => saveProduct(true)}
              disabled={loading || !editingProduct?.name || !editingProduct?.article || !editingProduct?.category}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Создать товар
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Удалить товар
            </DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить товар <strong>&quot;{productToDelete?.name}&quot;</strong> (артикул: {productToDelete?.article})?
              <br /><br />
              Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={loading}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={deleteProduct}
              disabled={loading}
            >
              {loading ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Error Dialog */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Ошибка импорта
            </DialogTitle>
            <DialogDescription>
              При импорте каталога произошли следующие ошибки:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {errorMessages.map((error, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
                {error}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={() => setErrorDialogOpen(false)}>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}