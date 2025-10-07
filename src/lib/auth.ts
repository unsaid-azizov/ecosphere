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
      role: string
      firstName?: string | null
      lastName?: string | null
      phone?: string | null
      inn?: string | null
      companyName?: string | null
      // IP fields
      ipFullName?: string | null
      ipShortName?: string | null
      ipRegistrationAddress?: string | null
      ipActualAddress?: string | null
      ipOgrnip?: string | null
      ipBankName?: string | null
      ipBik?: string | null
      ipCorrAccount?: string | null
      ipCheckingAccount?: string | null
      ipOkved?: string | null
      ipTaxSystem?: string | null
      ipVatStatus?: string | null
      // OOO fields
      oooFullName?: string | null
      oooShortName?: string | null
      oooLegalAddress?: string | null
      oooActualAddress?: string | null
      kpp?: string | null
      oooOgrn?: string | null
      oooDirector?: string | null
      oooAccountant?: string | null
      oooAuthorizedPerson?: string | null
      oooBankName?: string | null
      oooBik?: string | null
      oooCorrAccount?: string | null
      oooCheckingAccount?: string | null
      oooOkved?: string | null
      oooTaxSystem?: string | null
      oooVatStatus?: string | null
    }
  }

  interface User {
    id: string
    email: string
    userType: string
    role: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    inn?: string | null
    companyName?: string | null
    // IP fields
    ipFullName?: string | null
    ipShortName?: string | null
    ipRegistrationAddress?: string | null
    ipActualAddress?: string | null
    ipOgrnip?: string | null
    ipBankName?: string | null
    ipBik?: string | null
    ipCorrAccount?: string | null
    ipCheckingAccount?: string | null
    ipOkved?: string | null
    ipTaxSystem?: string | null
    ipVatStatus?: string | null
    // OOO fields
    oooFullName?: string | null
    oooShortName?: string | null
    oooLegalAddress?: string | null
    oooActualAddress?: string | null
    kpp?: string | null
    oooOgrn?: string | null
    oooDirector?: string | null
    oooAccountant?: string | null
    oooAuthorizedPerson?: string | null
    oooBankName?: string | null
    oooBik?: string | null
    oooCorrAccount?: string | null
    oooCheckingAccount?: string | null
    oooOkved?: string | null
    oooTaxSystem?: string | null
    oooVatStatus?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    userType: string
    role: string
    firstName?: string | null
    lastName?: string | null
    phone?: string | null
    inn?: string | null
    companyName?: string | null
    // IP fields
    ipFullName?: string | null
    ipShortName?: string | null
    ipRegistrationAddress?: string | null
    ipActualAddress?: string | null
    ipOgrnip?: string | null
    ipBankName?: string | null
    ipBik?: string | null
    ipCorrAccount?: string | null
    ipCheckingAccount?: string | null
    ipOkved?: string | null
    ipTaxSystem?: string | null
    ipVatStatus?: string | null
    // OOO fields
    oooFullName?: string | null
    oooShortName?: string | null
    oooLegalAddress?: string | null
    oooActualAddress?: string | null
    kpp?: string | null
    oooOgrn?: string | null
    oooDirector?: string | null
    oooAccountant?: string | null
    oooAuthorizedPerson?: string | null
    oooBankName?: string | null
    oooBik?: string | null
    oooCorrAccount?: string | null
    oooCheckingAccount?: string | null
    oooOkved?: string | null
    oooTaxSystem?: string | null
    oooVatStatus?: string | null
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
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          inn: user.inn,
          companyName: user.companyName,
          ipFullName: user.ipFullName,
          ipShortName: user.ipShortName,
          ipRegistrationAddress: user.ipRegistrationAddress,
          ipActualAddress: user.ipActualAddress,
          ipOgrnip: user.ipOgrnip,
          ipBankName: user.ipBankName,
          ipBik: user.ipBik,
          ipCorrAccount: user.ipCorrAccount,
          ipCheckingAccount: user.ipCheckingAccount,
          ipOkved: user.ipOkved,
          ipTaxSystem: user.ipTaxSystem,
          ipVatStatus: user.ipVatStatus,
          oooFullName: user.oooFullName,
          oooShortName: user.oooShortName,
          oooLegalAddress: user.oooLegalAddress,
          oooActualAddress: user.oooActualAddress,
          kpp: user.kpp,
          oooOgrn: user.oooOgrn,
          oooDirector: user.oooDirector,
          oooAccountant: user.oooAccountant,
          oooAuthorizedPerson: user.oooAuthorizedPerson,
          oooBankName: user.oooBankName,
          oooBik: user.oooBik,
          oooCorrAccount: user.oooCorrAccount,
          oooCheckingAccount: user.oooCheckingAccount,
          oooOkved: user.oooOkved,
          oooTaxSystem: user.oooTaxSystem,
          oooVatStatus: user.oooVatStatus,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.userType = user.userType
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.phone = user.phone
        token.inn = user.inn
        token.companyName = user.companyName
        token.ipFullName = user.ipFullName
        token.ipShortName = user.ipShortName
        token.ipRegistrationAddress = user.ipRegistrationAddress
        token.ipActualAddress = user.ipActualAddress
        token.ipOgrnip = user.ipOgrnip
        token.ipBankName = user.ipBankName
        token.ipBik = user.ipBik
        token.ipCorrAccount = user.ipCorrAccount
        token.ipCheckingAccount = user.ipCheckingAccount
        token.ipOkved = user.ipOkved
        token.ipTaxSystem = user.ipTaxSystem
        token.ipVatStatus = user.ipVatStatus
        token.oooFullName = user.oooFullName
        token.oooShortName = user.oooShortName
        token.oooLegalAddress = user.oooLegalAddress
        token.oooActualAddress = user.oooActualAddress
        token.kpp = user.kpp
        token.oooOgrn = user.oooOgrn
        token.oooDirector = user.oooDirector
        token.oooAccountant = user.oooAccountant
        token.oooAuthorizedPerson = user.oooAuthorizedPerson
        token.oooBankName = user.oooBankName
        token.oooBik = user.oooBik
        token.oooCorrAccount = user.oooCorrAccount
        token.oooCheckingAccount = user.oooCheckingAccount
        token.oooOkved = user.oooOkved
        token.oooTaxSystem = user.oooTaxSystem
        token.oooVatStatus = user.oooVatStatus
      }
      // Handle session update from ProfileEditDialog
      if (trigger === 'update' && session?.user) {
        return { ...token, ...session.user }
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.userType = token.userType
      session.user.role = token.role
      session.user.firstName = token.firstName
      session.user.lastName = token.lastName
      session.user.phone = token.phone
      session.user.inn = token.inn
      session.user.companyName = token.companyName
      session.user.ipFullName = token.ipFullName
      session.user.ipShortName = token.ipShortName
      session.user.ipRegistrationAddress = token.ipRegistrationAddress
      session.user.ipActualAddress = token.ipActualAddress
      session.user.ipOgrnip = token.ipOgrnip
      session.user.ipBankName = token.ipBankName
      session.user.ipBik = token.ipBik
      session.user.ipCorrAccount = token.ipCorrAccount
      session.user.ipCheckingAccount = token.ipCheckingAccount
      session.user.ipOkved = token.ipOkved
      session.user.ipTaxSystem = token.ipTaxSystem
      session.user.ipVatStatus = token.ipVatStatus
      session.user.oooFullName = token.oooFullName
      session.user.oooShortName = token.oooShortName
      session.user.oooLegalAddress = token.oooLegalAddress
      session.user.oooActualAddress = token.oooActualAddress
      session.user.kpp = token.kpp
      session.user.oooOgrn = token.oooOgrn
      session.user.oooDirector = token.oooDirector
      session.user.oooAccountant = token.oooAccountant
      session.user.oooAuthorizedPerson = token.oooAuthorizedPerson
      session.user.oooBankName = token.oooBankName
      session.user.oooBik = token.oooBik
      session.user.oooCorrAccount = token.oooCorrAccount
      session.user.oooCheckingAccount = token.oooCheckingAccount
      session.user.oooOkved = token.oooOkved
      session.user.oooTaxSystem = token.oooTaxSystem
      session.user.oooVatStatus = token.oooVatStatus
      return session
    }
  }
}