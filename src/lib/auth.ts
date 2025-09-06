import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { User } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      userType: string
      firstName?: string | null
      lastName?: string | null
      companyName?: string | null
    }
  }

  interface User {
    id: string
    email: string
    userType: string
    firstName?: string | null
    lastName?: string | null
    companyName?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userType: string
    firstName?: string | null
    lastName?: string | null
    companyName?: string | null
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          userType: user.userType,
          firstName: user.firstName,
          lastName: user.lastName,
          companyName: user.companyName,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = user.userType
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.companyName = user.companyName
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.userType = token.userType
      session.user.firstName = token.firstName
      session.user.lastName = token.lastName
      session.user.companyName = token.companyName
      return session
    }
  }
}