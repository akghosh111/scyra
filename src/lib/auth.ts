import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "../../prisma/generated/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"

const adapter = new PrismaPg(pg)
const prisma = new PrismaClient({ adapter })

const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL || 'http://localhost:3000'
const baseUrl = appUrl.startsWith('http') ? appUrl : `https://${appUrl}`

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: baseUrl,
  trustedOrigins: [baseUrl],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
      redirectURI: `${baseUrl}/api/auth/callback/google`,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
})
