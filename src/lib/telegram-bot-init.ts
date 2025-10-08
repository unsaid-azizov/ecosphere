import { initTelegramBot } from './telegram-bot';

// Initialize the bot when the module is imported
if (typeof window === 'undefined') {
  // Only run on server side
  initTelegramBot();
}

export {}; // Make this a module
