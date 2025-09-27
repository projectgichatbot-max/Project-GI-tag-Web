const { seedDatabase } = require('../lib/seed.ts')

async function main() {
  try {
    console.log('🌱 Starting database seeding...')
    const result = await seedDatabase()
    console.log('✅ Seeding completed successfully!')
    console.log('📊 Results:', result)
    process.exit(0)
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

main()
