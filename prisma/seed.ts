import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

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

  // Create Gram Panchayats
  const panchayat1 = await prisma.gramPanchayat.upsert({
    where: { code: 'KA-DK-GP-001' },
    update: {},
    create: {
      name: 'Bantwal Gram Panchayat',
      code: 'KA-DK-GP-001',
      blockId: block.id,
      population: 8500,
      area: 12.5,
    },
  })
  console.log('✅ Created Gram Panchayat:', panchayat1.name)

  const panchayat2 = await prisma.gramPanchayat.upsert({
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
  console.log('✅ Created Demo Panchayat:', panchayat2.name)

  // Create Wards
  const ward1 = await prisma.ward.upsert({
    where: { id: 'demo-ward-1' },
    update: {},
    create: {
      id: 'demo-ward-1',
      name: 'Ward 1 - Central',
      wardNumber: 1,
      panchayatId: panchayat2.id,
      households: 120,
    },
  })
  console.log('✅ Created Ward:', ward1.name)

  const ward2 = await prisma.ward.upsert({
    where: { id: 'demo-ward-2' },
    update: {},
    create: {
      id: 'demo-ward-2',
      name: 'Ward 2 - East',
      wardNumber: 2,
      panchayatId: panchayat2.id,
      households: 95,
    },
  })
  console.log('✅ Created Ward:', ward2.name)

  // Create Collectors
  const collector1 = await prisma.collector.upsert({
    where: { id: 'demo-collector-1' },
    update: {},
    create: {
      id: 'demo-collector-1',
      name: 'Ramesh Kumar',
      phone: '+91-9876543210',
      email: 'ramesh@example.com',
      role: 'COLLECTOR',
      panchayatId: panchayat2.id,
      wardId: ward1.id,
    },
  })
  console.log('✅ Created Collector:', collector1.name)

  const collector2 = await prisma.collector.upsert({
    where: { phone: '+91-9876543211' },
    update: {},
    create: {
      name: 'Priya Shetty',
      phone: '+91-9876543211',
      email: 'priya@example.com',
      role: 'COLLECTOR',
      panchayatId: panchayat2.id,
      wardId: ward2.id,
    },
  })
  console.log('✅ Created Collector:', collector2.name)

  const supervisor = await prisma.collector.upsert({
    where: { phone: '+91-9876543212' },
    update: {},
    create: {
      name: 'Suresh Nayak',
      phone: '+91-9876543212',
      email: 'suresh@example.com',
      role: 'SUPERVISOR',
      panchayatId: panchayat2.id,
    },
  })
  console.log('✅ Created Supervisor:', supervisor.name)

  // Create Container Templates
  const containers = [
    { type: '60L_bin', volumeLiters: 60, material: 'Plastic' },
    { type: '120L_bin', volumeLiters: 120, material: 'Plastic' },
    { type: '240L_bin', volumeLiters: 240, material: 'Plastic' },
  ]

  for (const container of containers) {
    await prisma.container.create({
      data: {
        ...container,
        condition: 'GOOD',
      },
    })
  }
  console.log('✅ Created container templates')

  console.log('🎉 Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
