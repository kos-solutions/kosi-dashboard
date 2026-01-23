import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 1. Luăm domeniul de pe care intră utilizatorul (ex: dashboard.kosiapp.com)
  const hostname = request.headers.get('host') || ''

  // 2. Verificăm dacă intră pe subdomeniul "dashboard" ȘI este pe pagina principală ("/")
  if (hostname.startsWith('dashboard.') && request.nextUrl.pathname === '/') {
    // Îl redirecționăm automat către folderul /dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Altfel, lăsăm traficul să treacă normal
  return NextResponse.next()
}

// Configurăm middleware-ul să ruleze doar pe pagina principală pentru eficiență
export const config = {
  matcher: '/',
}