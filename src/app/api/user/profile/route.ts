import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Не авторизован' },
        { status: 401 }
      );
    }

    const data = await req.json();

    // Validate required fields based on user type
    if (data.userType === 'INDIVIDUAL') {
      if (!data.firstName || !data.lastName || !data.phone || !data.email) {
        return NextResponse.json(
          { message: 'Пожалуйста, заполните все обязательные поля' },
          { status: 400 }
        );
      }
    } else if (data.userType === 'IP') {
      if (!data.inn || !data.ipFullName || !data.firstName || !data.phone || !data.email) {
        return NextResponse.json(
          { message: 'Пожалуйста, заполните все обязательные поля для ИП' },
          { status: 400 }
        );
      }
    } else if (data.userType === 'OOO') {
      if (!data.inn || !data.oooFullName || !data.phone || !data.email) {
        return NextResponse.json(
          { message: 'Пожалуйста, заполните все обязательные поля для ООО' },
          { status: 400 }
        );
      }
    }

    // Check if email is already taken by another user
    if (data.email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser && existingUser.id !== session.user.id) {
        return NextResponse.json(
          { message: 'Email уже используется другим пользователем' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      email: data.email,
      phone: data.phone,
      userType: data.userType,
    };

    // Add fields based on user type
    if (data.userType === 'INDIVIDUAL') {
      updateData.firstName = data.firstName;
      updateData.lastName = data.lastName;
      updateData.inn = null;
      // Clear IP and OOO fields
      updateData.ipFullName = null;
      updateData.ipShortName = null;
      updateData.ipRegistrationAddress = null;
      updateData.ipActualAddress = null;
      updateData.ipOgrnip = null;
      updateData.ipBankName = null;
      updateData.ipBik = null;
      updateData.ipCorrAccount = null;
      updateData.ipCheckingAccount = null;
      updateData.ipOkved = null;
      updateData.ipTaxSystem = null;
      updateData.ipVatStatus = null;
      updateData.oooFullName = null;
      updateData.oooShortName = null;
      updateData.oooLegalAddress = null;
      updateData.oooActualAddress = null;
      updateData.kpp = null;
      updateData.oooOgrn = null;
      updateData.oooDirector = null;
      updateData.oooAccountant = null;
      updateData.oooAuthorizedPerson = null;
      updateData.oooBankName = null;
      updateData.oooBik = null;
      updateData.oooCorrAccount = null;
      updateData.oooCheckingAccount = null;
      updateData.oooOkved = null;
      updateData.oooTaxSystem = null;
      updateData.oooVatStatus = null;
    } else if (data.userType === 'IP') {
      updateData.inn = data.inn;
      updateData.firstName = data.firstName;
      updateData.lastName = data.lastName;
      updateData.ipFullName = data.ipFullName;
      updateData.ipShortName = data.ipShortName || null;
      updateData.ipRegistrationAddress = data.ipRegistrationAddress || null;
      updateData.ipActualAddress = data.ipActualAddress || null;
      updateData.ipOgrnip = data.ipOgrnip || null;
      updateData.ipBankName = data.ipBankName || null;
      updateData.ipBik = data.ipBik || null;
      updateData.ipCorrAccount = data.ipCorrAccount || null;
      updateData.ipCheckingAccount = data.ipCheckingAccount || null;
      updateData.ipOkved = data.ipOkved || null;
      updateData.ipTaxSystem = data.ipTaxSystem || null;
      updateData.ipVatStatus = data.ipVatStatus || null;
      // Clear OOO fields
      updateData.oooFullName = null;
      updateData.oooShortName = null;
      updateData.oooLegalAddress = null;
      updateData.oooActualAddress = null;
      updateData.kpp = null;
      updateData.oooOgrn = null;
      updateData.oooDirector = null;
      updateData.oooAccountant = null;
      updateData.oooAuthorizedPerson = null;
      updateData.oooBankName = null;
      updateData.oooBik = null;
      updateData.oooCorrAccount = null;
      updateData.oooCheckingAccount = null;
      updateData.oooOkved = null;
      updateData.oooTaxSystem = null;
      updateData.oooVatStatus = null;
    } else if (data.userType === 'OOO') {
      updateData.inn = data.inn;
      updateData.kpp = data.kpp || null;
      updateData.oooFullName = data.oooFullName;
      updateData.oooShortName = data.oooShortName || null;
      updateData.oooLegalAddress = data.oooLegalAddress || null;
      updateData.oooActualAddress = data.oooActualAddress || null;
      updateData.oooOgrn = data.oooOgrn || null;
      updateData.oooDirector = data.oooDirector || null;
      updateData.oooAccountant = data.oooAccountant || null;
      updateData.oooAuthorizedPerson = data.oooAuthorizedPerson || null;
      updateData.oooBankName = data.oooBankName || null;
      updateData.oooBik = data.oooBik || null;
      updateData.oooCorrAccount = data.oooCorrAccount || null;
      updateData.oooCheckingAccount = data.oooCheckingAccount || null;
      updateData.oooOkved = data.oooOkved || null;
      updateData.oooTaxSystem = data.oooTaxSystem || null;
      updateData.oooVatStatus = data.oooVatStatus || null;
      // Clear IP fields and individual fields
      updateData.firstName = null;
      updateData.lastName = null;
      updateData.ipFullName = null;
      updateData.ipShortName = null;
      updateData.ipRegistrationAddress = null;
      updateData.ipActualAddress = null;
      updateData.ipOgrnip = null;
      updateData.ipBankName = null;
      updateData.ipBik = null;
      updateData.ipCorrAccount = null;
      updateData.ipCheckingAccount = null;
      updateData.ipOkved = null;
      updateData.ipTaxSystem = null;
      updateData.ipVatStatus = null;
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        userType: true,
        firstName: true,
        lastName: true,
        phone: true,
        inn: true,
        kpp: true,
        ipFullName: true,
        ipShortName: true,
        ipRegistrationAddress: true,
        ipActualAddress: true,
        ipOgrnip: true,
        ipBankName: true,
        ipBik: true,
        ipCorrAccount: true,
        ipCheckingAccount: true,
        ipOkved: true,
        ipTaxSystem: true,
        ipVatStatus: true,
        oooFullName: true,
        oooShortName: true,
        oooLegalAddress: true,
        oooActualAddress: true,
        oooOgrn: true,
        oooDirector: true,
        oooAccountant: true,
        oooAuthorizedPerson: true,
        oooBankName: true,
        oooBik: true,
        oooCorrAccount: true,
        oooCheckingAccount: true,
        oooOkved: true,
        oooTaxSystem: true,
        oooVatStatus: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Произошла ошибка при обновлении профиля' },
      { status: 500 }
    );
  }
}
