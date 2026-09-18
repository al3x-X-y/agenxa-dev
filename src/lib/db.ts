import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

declare global {
    var prisma: PrismaClient | undefined
}

function createPrismaClient() {
    const adapter = new PrismaMariaDb({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'agenxa',
        connectionLimit: 5,
        allowPublicKeyRetrieval: true,
    })
    return new PrismaClient({ adapter })
}

export const db = globalThis.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma = db