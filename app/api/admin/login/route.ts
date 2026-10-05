import { NextResponse } from 'next/server'
import { findAdminByEmail, verifyPassword } from '@/lib/db'
import { createSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mail e senha são obrigatórios.' }, { status: 400 })
    }

    // Busca o usuário admin no banco de dados
    const admin = findAdminByEmail(email)

    if (!admin) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
    }

    // Valida a senha contra a hash criptografada no banco de dados
    const isValid = verifyPassword(password, admin.passwordHash, admin.salt)

    if (!isValid) {
      return NextResponse.json({ error: 'E-mail ou senha incorretos.' }, { status: 401 })
    }

    // Gera o token de sessão seguro
    const token = createSessionToken(admin.id, admin.email)

    const response = NextResponse.json({ success: true, email: admin.email })

    // Define o cookie HTTP-only seguro
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 horas
    })

    return response
  } catch (error) {
    console.error('Erro na autenticação admin:', error)
    return NextResponse.json({ error: 'Erro interno no servidor de autenticação.' }, { status: 500 })
  }
}
