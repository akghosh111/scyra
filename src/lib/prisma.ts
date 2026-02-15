import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const adapter = new PrismaPg(pg)
const prisma = new PrismaClient({ adapter })

export default prisma
