#!/usr/bin/env tsx

import { initTelegramBot } from '../lib/telegram-bot';

console.log('🤖 Starting Telegram Bot...');

initTelegramBot();

console.log('✅ Bot is running. Press Ctrl+C to stop.');

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Stopping bot...');
  process.exit(0);
});
