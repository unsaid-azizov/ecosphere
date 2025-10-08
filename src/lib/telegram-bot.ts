import TelegramBot from 'node-telegram-bot-api';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Store authenticated chat IDs in memory
// Map<chatId, { email, role, name, userId }>
const authenticatedChats = new Map<number, { email: string; role: string; name: string; userId: string }>();

let bot: TelegramBot | null = null;
let isInitializing = false;

export function initTelegramBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('⚠️  TELEGRAM_BOT_TOKEN not set, bot disabled');
    return null;
  }

  if (bot || isInitializing) {
    return bot;
  }

  isInitializing = true;

  try {
    bot = new TelegramBot(token, { polling: true });

    bot.on('polling_error', (error) => {
      console.error('Telegram polling error:', error.message);
      // Ignore conflict errors (multiple instances)
      if (error.message.includes('409 Conflict')) {
        console.log('⚠️  Another bot instance is already running. Stopping this one.');
        bot?.stopPolling();
        bot = null;
        isInitializing = false;
      }
    });

    console.log('✅ Telegram bot started');
  } catch (error) {
    console.error('Failed to start Telegram bot:', error);
    bot = null;
    isInitializing = false;
    return null;
  }

  isInitializing = false;

  // Handle /start command
  bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot?.sendMessage(
      chatId,
      '🔐 Добро пожаловать в EcoSphere Notification Bot!\n\n' +
      'Для получения уведомлений войдите в систему:\n' +
      '/login your@email.com yourpassword\n\n' +
      '👥 Пользователи получают уведомления о статусах своих заказов\n' +
      '👨‍💼 Администраторы и менеджеры получают уведомления о новых заказах и пользователях'
    );
  });

  // Handle /login command
  bot.onText(/\/login (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;

    if (!match) {
      bot?.sendMessage(chatId, '❌ Неверный формат.\nИспользуйте: /login email password');
      return;
    }

    const email = match[1];
    const password = match[2];

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        bot?.sendMessage(chatId, '❌ Пользователь не найден.');
        return;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        bot?.sendMessage(chatId, '❌ Неверный email или пароль.');
        return;
      }

      // Store authenticated chat
      authenticatedChats.set(chatId, {
        email: user.email,
        role: user.role,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        userId: user.id,
      });

      const roleText = user.role === 'ADMIN' ? 'Администратор' : user.role === 'MANAGER' ? 'Менеджер' : 'Пользователь';

      let notificationsList = '';
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        notificationsList =
          '• Новых зарегистрированных пользователях\n' +
          '• Новых заказах от клиентов\n' +
          '• Изменениях статусов заказов\n';
      } else {
        notificationsList = '• Изменениях статуса ваших заказов\n';
      }

      bot?.sendMessage(
        chatId,
        `✅ Вы успешно вошли как ${roleText}!\n\n` +
        `👤 ${user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}\n\n` +
        'Теперь вы будете получать уведомления о:\n' +
        notificationsList +
        '\n' +
        'Команды:\n' +
        '/status - Проверить статус подключения\n' +
        '/logout - Выйти из системы'
      );

      console.log(`✅ User authenticated: ${user.email} (${user.role}) - Chat ID: ${chatId}`);
    } catch (error) {
      console.error('Error authenticating user:', error);
      bot?.sendMessage(chatId, '❌ Ошибка при входе. Попробуйте позже.');
    }
  });

  // Handle /status command
  bot.onText(/\/status/, (msg) => {
    const chatId = msg.chat.id;
    const user = authenticatedChats.get(chatId);

    if (!user) {
      bot?.sendMessage(chatId, '❌ Вы не авторизованы.\nИспользуйте /login для входа.');
      return;
    }

    bot?.sendMessage(
      chatId,
      `✅ Вы подключены!\n\n` +
      `👤 ${user.name}\n` +
      `📧 ${user.email}\n` +
      `🔑 Роль: ${user.role === 'ADMIN' ? 'Администратор' : 'Менеджер'}`
    );
  });

  // Handle /logout command
  bot.onText(/\/logout/, (msg) => {
    const chatId = msg.chat.id;
    const user = authenticatedChats.get(chatId);

    if (!user) {
      bot?.sendMessage(chatId, '❌ Вы не авторизованы.');
      return;
    }

    authenticatedChats.delete(chatId);
    bot?.sendMessage(chatId, '👋 Вы вышли из системы. Уведомления отключены.');
    console.log(`👋 User logged out: ${user.email} - Chat ID: ${chatId}`);
  });

  // Handle /help command
  bot.onText(/\/help/, (msg) => {
    const chatId = msg.chat.id;
    bot?.sendMessage(
      chatId,
      '📋 Доступные команды:\n\n' +
      '/start - Начать работу сботом\n' +
      '/login <email> <password> - Войти в систему\n' +
      '/status - Проверить статус подключения\n' +
      '/logout - Выйти из системы\n' +
      '/help - Показать эту справку'
    );
  });

  return bot;
}

// Notification functions
export async function sendNotificationToAdmins(message: string) {
  if (!bot) return;

  for (const [chatId, user] of authenticatedChats.entries()) {
    try {
      await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    } catch (error) {
      console.error(`Failed to send notification to ${user.email}:`, error);
      // Remove chat if it's no longer valid
      if (error && typeof error === 'object' && 'code' in error && error.code === 403) {
        authenticatedChats.delete(chatId);
      }
    }
  }
}

export async function notifyNewUser(user: { email: string; role: string; userType: string; firstName?: string; lastName?: string }) {
  const name = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email;
  const message =
    `🆕 <b>Новый пользователь зарегистрирован</b>\n\n` +
    `👤 ${name}\n` +
    `📧 ${user.email}\n` +
    `🔑 Роль: ${user.role === 'ADMIN' ? 'Администратор' : user.role === 'MANAGER' ? 'Менеджер' : 'Пользователь'}\n` +
    `🏢 Тип: ${user.userType === 'INDIVIDUAL' ? 'Физ. лицо' : user.userType === 'IP' ? 'ИП' : 'ООО'}`;

  await sendNotificationToAdmins(message);
}

export async function notifyNewOrder(order: {
  orderNumber: string;
  totalAmount: number;
  userEmail: string;
  userName?: string;
  itemsCount: number;
  items: Array<{
    name: string;
    article: string;
    quantity: number;
    price: number;
  }>;
  contactPhone?: string;
  deliveryAddress?: string;
}) {
  const itemsList = order.items
    .map((item, index) =>
      `${index + 1}. <b>${item.name}</b>\n` +
      `   Артикул: ${item.article}\n` +
      `   Количество: ${item.quantity} шт.\n` +
      `   Цена: ₽${item.price.toLocaleString()} × ${item.quantity} = ₽${(item.price * item.quantity).toLocaleString()}`
    )
    .join('\n\n');

  const message =
    `📦 <b>Новый заказ!</b>\n\n` +
    `📋 Номер: #${order.orderNumber}\n` +
    `👤 Клиент: ${order.userName || order.userEmail}\n` +
    `📧 Email: ${order.userEmail}\n` +
    (order.contactPhone ? `📱 Телефон: ${order.contactPhone}\n` : '') +
    (order.deliveryAddress ? `📍 Адрес доставки: ${order.deliveryAddress}\n` : '') +
    `\n<b>Товары (${order.itemsCount}):</b>\n\n` +
    itemsList +
    `\n\n💰 <b>Итого: ₽${order.totalAmount.toLocaleString()}</b>`;

  await sendNotificationToAdmins(message);
}

export async function notifyOrderStatusChange(order: {
  orderNumber: string;
  status: string;
  userId: string;
  userEmail: string;
  userName?: string;
}) {
  if (!bot) return;

  const statusNames: Record<string, string> = {
    PENDING: '⏳ Ожидает обработки',
    CONFIRMED: '✅ Подтвержден',
    PROCESSING: '⚙️ В обработке',
    SHIPPED: '🚚 Отправлен',
    DELIVERED: '✅ Доставлен',
    CANCELLED: '❌ Отменен',
  };

  // Message for admins/managers
  const adminMessage =
    `🔄 <b>Изменение статуса заказа</b>\n\n` +
    `📋 Номер: #${order.orderNumber}\n` +
    `📊 Новый статус: ${statusNames[order.status] || order.status}\n` +
    `👤 Клиент: ${order.userName || order.userEmail}`;

  // Message for order owner
  const userMessage =
    `🔔 <b>Статус вашего заказа изменился!</b>\n\n` +
    `📋 Заказ: #${order.orderNumber}\n` +
    `📊 Новый статус: ${statusNames[order.status] || order.status}`;

  // Send to admins and managers
  for (const [chatId, user] of authenticatedChats.entries()) {
    try {
      if (user.role === 'ADMIN' || user.role === 'MANAGER') {
        await bot.sendMessage(chatId, adminMessage, { parse_mode: 'HTML' });
      } else if (user.userId === order.userId) {
        // Send to order owner
        await bot.sendMessage(chatId, userMessage, { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.error(`Failed to send notification to ${user.email}:`, error);
      if (error && typeof error === 'object' && 'code' in error && error.code === 403) {
        authenticatedChats.delete(chatId);
      }
    }
  }
}

export async function notifyCriticalEvent(event: string) {
  const message = `🚨 <b>Критическое событие</b>\n\n${event}`;
  await sendNotificationToAdmins(message);
}

// Get authenticated users list
export function getAuthenticatedUsers() {
  return Array.from(authenticatedChats.values());
}
