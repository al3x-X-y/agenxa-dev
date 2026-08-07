import 'server-only'
import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

declare global {
    var prisma : PrismaClient | undefined
}

const adapter = new PrismaMariaDb(process.env.DATABASE_URL || 'mysql://root:1234@localhost:3306/agenxa')

export const db = globalThis.prisma || new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") globalThis.prisma = db


