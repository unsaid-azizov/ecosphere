import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Common redirect patterns
  const redirects: Record<string, string> = {
    // Old paths to new paths
    '/shop': '/catalog',
    '/products': '/catalog',
    '/store': '/catalog',
    '/category': '/catalog',
    '/categories': '/catalog',
    
    // Common typos
    '/catlog': '/catalog',
    '/catolag': '/catalog',
    '/catalogue': '/catalog',
    
    // Order variations
    '/order': '/orders',
    '/myorders': '/orders',
    '/my-orders': '/orders',
    '/order-history': '/orders',
    
    // About variations
    '/about-us': '/about',
    '/company': '/about',
    '/info': '/about',
    
    // Contact variations
    '/contact': '/catalog', // Redirect to catalog since no contact page
    '/contacts': '/catalog',
    '/contact-us': '/catalog',
    
    // Admin variations
    '/dashboard': '/admin',
    '/panel': '/admin',
    '/management': '/admin',
    '/admin-panel': '/admin',
    
    // Auth variations
    '/signin': '/',
    '/signup': '/',
    '/login': '/',
    '/register': '/',
    '/auth': '/',
    
    // Cart variations
    '/basket': '/cart',
    '/shopping-cart': '/cart',
    '/my-cart': '/cart',
    
    // Common ecommerce paths
    '/checkout/success': '/order-success',
    '/order-complete': '/order-success',
    '/payment-success': '/order-success',
    '/thank-you': '/order-success',
    
    // Remove trailing slashes and common extensions
    '/catalog/': '/catalog',
    '/orders/': '/orders',
    '/about/': '/about',
    '/admin/': '/admin',
    '/cart/': '/cart',
  }
  
  // Handle exact matches
  if (redirects[pathname]) {
    return NextResponse.redirect(new URL(redirects[pathname], request.url))
  }
  
  // Handle product URLs with different formats
  if (pathname.match(/^\/product\/[^\/]+\/?$/)) {
    // Let Next.js handle the product page normally first
    // If it returns 404, the not-found page will handle it
    return NextResponse.next()
  }
  
  // Handle category URLs
  if (pathname.match(/^\/category\//)) {
    return NextResponse.redirect(new URL('/catalog', request.url))
  }
  
  // Handle old style product URLs
  if (pathname.match(/^\/products\//)) {
    const productId = pathname.split('/products/')[1]?.split('/')[0]
    if (productId) {
      return NextResponse.redirect(new URL(`/catalog`, request.url))
    }
  }
  
  // Handle trailing slashes
  if (pathname.endsWith('/') && pathname !== '/') {
    return NextResponse.redirect(
      new URL(pathname.slice(0, -1), request.url)
    )
  }
  
  // Handle common file extensions that should redirect
  const extensionRedirects = ['.html', '.htm', '.php', '.aspx', '.jsp']
  for (const ext of extensionRedirects) {
    if (pathname.endsWith(ext)) {
      const newPath = pathname.replace(ext, '')
      return NextResponse.redirect(new URL(newPath || '/', request.url))
    }
  }
  
  // Handle API routes that don't exist - redirect to home
  if (pathname.startsWith('/api/') && !pathname.match(/^\/api\/(auth|products|cart|orders|admin|discounts)/)) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // Handle common favicon and robot requests
  if (pathname.match(/^\/favicon\.ico$|^\/robots\.txt$|^\/sitemap\.xml$/)) {
    return NextResponse.next()
  }
  
  // Handle old WordPress/CMS paths
  const wpRedirects = [
    '/wp-admin', '/wp-login', '/wp-content', '/wp-includes',
    '/admin.php', '/login.php', '/index.php',
    '/phpmyadmin', '/pma', '/mysql',
    '/.env', '/config', '/backup'
  ]
  
  for (const wpPath of wpRedirects) {
    if (pathname.startsWith(wpPath)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  // Handle common attack vectors by redirecting to home
  const suspiciousPaths = [
    '/.well-known', '/xmlrpc.php', '/wp-json',
    '/vendor', '/node_modules', '/package.json',
    '/composer.json', '/yarn.lock', '/package-lock.json'
  ]
  
  for (const suspiciousPath of suspiciousPaths) {
    if (pathname.startsWith(suspiciousPath)) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}