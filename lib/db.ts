import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface AdminUser {
  id: string
  email: string
  passwordHash: string
  salt: string
  createdAt: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DB_FILE = path.join(DATA_DIR, 'admin_users.json')

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

// Inicializa o banco de dados e garante a credencial inicial cadastrada e criptografada
function initDB(): AdminUser[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }

  let users: AdminUser[] = []
  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8')
      users = JSON.parse(data)
    } catch {
      users = []
    }
  }

  // Verificar se o admin padrão já está cadastrado
  const defaultEmail = 'ugcalessandradias@gmail.com'
  const defaultPass = 'Aale.9494'

  const exists = users.some((u) => u.email.toLowerCase() === defaultEmail.toLowerCase())
  if (!exists) {
    const { hash, salt } = hashPassword(defaultPass)
    const newUser: AdminUser = {
      id: crypto.randomUUID(),
      email: defaultEmail,
      passwordHash: hash,
      salt: salt,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf-8')
  }

  return users
}

export function findAdminByEmail(email: string): AdminUser | null {
  const users = initDB()
  const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  return user || null
}
