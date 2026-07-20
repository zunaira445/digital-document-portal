import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding...')

  // Clean existing data
  await prisma.notification.deleteMany().catch(() => {})
  await prisma.requestStatusHistory.deleteMany().catch(() => {})
  await prisma.uploadedFile.deleteMany().catch(() => {})
  await prisma.documentRequest.deleteMany().catch(() => {})
  await prisma.documentType.deleteMany().catch(() => {})
  await prisma.user.deleteMany().catch(() => {})

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123_hashed',
      name: 'Admin User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  })

  // Create User
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'user123_hashed',
      name: 'John Doe',
      role: 'USER',
      status: 'ACTIVE',
    },
  })

  // Create Document Types
  await prisma.documentType.createMany({
    data: [
      { name: 'Birth Certificate', description: 'Official birth certificate' },
      { name: 'CNIC', description: 'National identity card' },
      { name: 'Domicile', description: 'Proof of residence' },
      { name: 'Character Certificate', description: 'Police verification' },
    ],
  })

  console.log('✅ Seed completed!')
  console.log('Admin:', admin.email)
  console.log('User:', user.email)
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })