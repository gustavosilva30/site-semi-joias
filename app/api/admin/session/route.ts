import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE_NAME, verifySessionToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ authenticated: false })
    }

    const payload = verifySessionToken(token)

    if (!payload) {
      return NextResponse.json({ authenticated: false })
    }

    return NextResponse.json({ authenticated: true, email: payload.email })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
