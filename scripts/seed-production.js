// Quick script to seed production database
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting production database seeding...')

  // Create Zilla Panchayat
  const zilla = await prisma.zillaPanchayat.upsert({
    where: { code: 'KA-DK-ZP' },
    update: {},
    create: {
      name: 'Dakshina Kannada Zilla Panchayat',
      code: 'KA-DK-ZP',
      state: 'Karnataka',
      district: 'Dakshina Kannada',
    },
  })
  console.log('✅ Created Zilla Panchayat:', zilla.name)

  // Create Block
  const block = await prisma.block.upsert({
    where: { code: 'KA-DK-MANGALURU' },
    update: {},
    create: {
      name: 'Mangaluru Block',
      code: 'KA-DK-MANGALURU',
      zillaId: zilla.id,
    },
  })
  console.log('✅ Created Block:', block.name)

  // Create Demo Panchayat
  const panchayat = await prisma.gramPanchayat.upsert({
    where: { id: 'demo-panchayat-1' },
    update: {},
    create: {
      id: 'demo-panchayat-1',
      name: 'Demo Panchayat (For Testing)',
      code: 'KA-DK-GP-DEMO',
      blockId: block.id,
      population: 5000,
      area: 8.0,
    },
  })
  console.log('✅ Created Demo Panchayat:', panchayat.name)

  // Create Wards
  const ward1 = await prisma.ward.upsert({
    where: { id: 'demo-ward-1' },
    update: {},
    create: {
      id: 'demo-ward-1',
      name: 'Ward 1 - Central',
      wardNumber: 1,
      panchayatId: panchayat.id,
      households: 120,
    },
  })
  console.log('✅ Created Ward:', ward1.name)

  // Create Collector
  const collector = await prisma.collector.upsert({
    where: { id: 'demo-collector-1' },
    update: {},
    create: {
      id: 'demo-collector-1',
      name: 'Ramesh Kumar',
      phone: '+91-9876543210',
      email: 'ramesh@example.com',
      role: 'COLLECTOR',
      panchayatId: panchayat.id,
      wardId: ward1.id,
    },
  })
  console.log('✅ Created Collector:', collector.name)

  console.log('🎉 Production seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
