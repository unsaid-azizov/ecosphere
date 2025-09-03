import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Validate required fields
    if (!orderData.customer.contactPerson || !orderData.customer.phone || !orderData.customer.email) {
      return NextResponse.json(
        { error: 'Missing required customer information' },
        { status: 400 }
      );
    }

    if (!orderData.items || orderData.items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    // Format order for email
    const orderText = formatOrderForEmail(orderData);
    
    // Here you would normally send email
    // For now, we'll just log and return success
    console.log('Order received:', orderText);
    
    // Generate order ID
    const orderId = Date.now().toString();
    
    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order submitted successfully'
    });
    
  } catch (error) {
    console.error('Order processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function formatOrderForEmail(orderData: any): string {
  const { customer, items, totalAmount, totalItems } = orderData;
  
  let emailText = `🛒 НОВЫЙ ЗАКАЗ #${Date.now()}\n\n`;
  
  // Customer info
  emailText += `👤 ЗАКАЗЧИК:\n`;
  emailText += `Тип: ${getCompanyTypeLabel(customer.companyType)}\n`;
  if (customer.companyName) {
    emailText += `Компания: ${customer.companyName}\n`;
  }
  if (customer.inn) {
    emailText += `ИНН: ${customer.inn}\n`;
  }
  emailText += `Контактное лицо: ${customer.contactPerson}\n`;
  emailText += `Телефон: ${customer.phone}\n`;
  emailText += `Email: ${customer.email}\n`;
  if (customer.address) {
    emailText += `Адрес: ${customer.address}\n`;
  }
  
  // Order items
  emailText += `\n📦 ТОВАРЫ (${totalItems} шт.):\n`;
  items.forEach((item: any, index: number) => {
    emailText += `${index + 1}. ${item.name}\n`;
    emailText += `   Артикул: ${item.article}\n`;
    emailText += `   Цена: ₽${item.price.toLocaleString()} × ${item.quantity} шт. = ₽${item.total.toLocaleString()}\n\n`;
  });
  
  emailText += `💰 ИТОГО: ₽${totalAmount.toLocaleString()}\n`;
  
  if (customer.comment) {
    emailText += `\n💬 КОММЕНТАРИЙ:\n${customer.comment}\n`;
  }
  
  emailText += `\n📅 Дата заказа: ${new Date(orderData.createdAt).toLocaleString('ru-RU')}\n`;
  
  return emailText;
}

function getCompanyTypeLabel(type: string): string {
  switch (type) {
    case 'individual': return 'Физическое лицо';
    case 'ip': return 'Индивидуальный предприниматель';
    case 'ooo': return 'Общество с ограниченной ответственностью';
    default: return 'Не указано';
  }
}