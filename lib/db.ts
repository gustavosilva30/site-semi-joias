import fs from 'fs'
import path from 'path'
import os from 'os'
import crypto from 'crypto'

export interface AdminUser {
  id: string
  email: string
  passwordHash: string
  salt: string
  createdAt: string
}

// Credenciais padrão da loja (Criptografadas com PBKDF2)
const DEFAULT_EMAIL = 'ugcalessandradias@gmail.com'
const DEFAULT_PASS = 'Aale.9494'

// Função de Hashing de Senha (pbkdf2 com salt e timingSafeEqual)
export function hashPassword(password: string, salt?: string) {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 100000, 64, 'sha512').toString('hex')
  return { hash, salt: generatedSalt }
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const { hash: calculatedHash } = hashPassword(password, salt)
    const storedBuffer = Buffer.from(storedHash, 'hex')
    const calcBuffer = Buffer.from(calculatedHash, 'hex')
    if (storedBuffer.length !== calcBuffer.length) return false
    return crypto.timingSafeEqual(storedBuffer, calcBuffer)
  } catch {
    return false
  }
}

// Pré-gera a hash do usuário padrão para fallback resiliente em memória
const defaultUserSalt = 'a1b2c3d4e5f67890a1b2c3d4e5f67890'
const { hash: defaultUserHash } = hashPassword(DEFAULT_PASS, defaultUserSalt)

const defaultAdminUser: AdminUser = {
  id: 'admin_default_01',
  email: DEFAULT_EMAIL,
  passwordHash: defaultUserHash,
  salt: defaultUserSalt,
  createdAt: '2026-10-04T00:00:00.000Z',
}

// Obter caminho de arquivo com fallback resiliente para os.tmpdir() em ambientes Docker/Linux com permissões restritas
function getDBFilePath(): string | null {
  const primaryDir = path.join(process.cwd(), 'data')
  try {
    if (!fs.existsSync(primaryDir)) {
      fs.mkdirSync(primaryDir, { recursive: true })
    }
    return path.join(primaryDir, 'admin_users.json')
  } catch {
    // Se a criação no process.cwd() falhar devido a EACCES em containers Docker/Vercel
    try {
      const fallbackDir = path.join(os.tmpdir(), 'semi_joias_data')
      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true })
      }
      return path.join(fallbackDir, 'admin_users.json')
    } catch {
      return null
    }
  }
}

function initDB(): AdminUser[] {
  const dbFile = getDBFilePath()
  let users: AdminUser[] = [defaultAdminUser]

  if (dbFile && fs.existsSync(dbFile)) {
    try {
      const data = fs.readFileSync(dbFile, 'utf-8')
      const parsedUsers: AdminUser[] = JSON.parse(data)
      if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
        users = parsedUsers
      }
    } catch {
      // Usar fallback em memória
    }
  }

  // Garantir que a conta admin oficial está sempre presente
  const exists = users.some((u) => u.email.toLowerCase() === DEFAULT_EMAIL.toLowerCase())
  if (!exists) {
    users.push(defaultAdminUser)
    if (dbFile) {
      try {
        fs.writeFileSync(dbFile, JSON.stringify(users, null, 2), 'utf-8')
      } catch {
        // Silenciosamente ignorar se o sistema de arquivos for estritamente read-only
      }
    }
  }

  return users
}

export function findAdminByEmail(email: string): AdminUser | null {
  try {
    const users = initDB()
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    return user || null
  } catch {
    // Fallback absoluto em memória em caso de qualquer exceção de sistema
    if (email.trim().toLowerCase() === DEFAULT_EMAIL.toLowerCase()) {
      return defaultAdminUser
    }
    return null
  }
}
