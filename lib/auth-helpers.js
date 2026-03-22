import bcrypt from "bcryptjs"

export async function hashPassword(password) {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function generateFlowAddress() {
  const chars = "0123456789abcdef"
  let address = "0x"
  for (let i = 0; i < 16; i++) {
    address += chars[Math.floor(Math.random() * chars.length)]
  }
  return address
}
