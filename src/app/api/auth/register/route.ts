import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserType } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      email,
      password,
      userType,
      // Физ. лицо
      firstName,
      lastName,
      phone,
      // ИП
      ipName,
      inn,
      // ООО
      companyName,
      legalAddress,
      kpp,
    } = body

    // Проверяем, что пользователь с таким email не существует
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже существует' },
        { status: 400 }
      )
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, 10)

    // Преобразуем тип пользователя
    let prismaUserType: UserType
    switch (userType) {
      case 'individual':
        prismaUserType = 'INDIVIDUAL'
        break
      case 'ip':
        prismaUserType = 'IP'
        break
      case 'ooo':
        prismaUserType = 'OOO'
        break
      default:
        return NextResponse.json(
          { error: 'Неверный тип пользователя' },
          { status: 400 }
        )
    }

    // Создаем пользователя
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        userType: prismaUserType,
        firstName: userType === 'individual' ? firstName : null,
        lastName: userType === 'individual' ? lastName : null,
        phone: phone || null,
        ipName: userType === 'ip' ? ipName : null,
        inn: (userType === 'ip' || userType === 'ooo') ? inn : null,
        companyName: userType === 'ooo' ? companyName : null,
        legalAddress: userType === 'ooo' ? legalAddress : null,
        kpp: userType === 'ooo' ? kpp : null,
      },
      select: {
        id: true,
        email: true,
        userType: true,
        firstName: true,
        lastName: true,
        companyName: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { 
        message: 'Пользователь успешно зарегистрирован',
        user 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}