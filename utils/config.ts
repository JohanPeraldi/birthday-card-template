// utils/config.ts - Flexible configuration system
interface CardConfig {
  title: string;
  recipient: string;
  image: string;
  message: string[];
  cardId: string;
  authentication: {
    enabled: boolean;
    method: 'magic-link' | 'qr-code' | 'none';
  };
  email?: {
    fromName: string;
    subject: string;
    recipientEmail?: string;
  };
}

// Get configuration from environment variables OR config file
export function getCardConfig(): CardConfig {
  // Try environment variables first (Vite variables)
  if (import.meta.env?.VITE_CARD_RECIPIENT) {
    return {
      title: import.meta.env?.VITE_CARD_TITLE || 'Happy Birthday!',
      recipient: import.meta.env?.VITE_CARD_RECIPIENT || '',
      image: import.meta.env?.VITE_CARD_IMAGE || '/happy-birthday.jpeg',
      message: import.meta.env?.VITE_CARD_MESSAGE?.split('|') || [
        'Happy Birthday!',
      ],
      cardId: import.meta.env?.VITE_CARD_ID || 'default-card',
      authentication: {
        enabled: import.meta.env?.VITE_AUTH_METHOD !== 'none',
        method: (import.meta.env?.VITE_AUTH_METHOD as any) || 'magic-link',
      },
      email: {
        fromName: import.meta.env?.VITE_EMAIL_FROM_NAME || 'Birthday Surprise',
        subject:
          import.meta.env?.VITE_EMAIL_SUBJECT ||
          '🎉 Your Birthday Surprise Awaits!',
      },
    };
  }

  // Fallback to build-time config (your current template approach)
  return {
    title: '__SUBTITLE__',
    recipient: '__RECIPIENT__',
    image: '/__IMAGE__',
    message: ['__MESSAGE_LINES__'],
    cardId: '__CARD_ID__',
    authentication: {
      enabled: true, // Will be replaced by template
      method: 'magic-link',
    },
    email: {
      fromName: import.meta.env.VITE_EMAIL_FROM_NAME || 'Birthday Surprise',
      subject:
        import.meta.env.VITE_EMAIL_SUBJECT ||
        '🎉 Your Birthday Surprise Awaits!',
    },
  };
}

// Runtime configuration for API routes (server-side)
export function getServerConfig() {
  return {
    cardSecretKey: process.env.CARD_SECRET_KEY || 'fallback-dev-key',
    resendApiKey: process.env.RESEND_API_KEY,
    sendgridApiKey: process.env.SENDGRID_API_KEY,
    gmailUser: process.env.GMAIL_USER,
    gmailPassword: process.env.GMAIL_APP_PASSWORD,
    baseUrl: process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_BASE_URL
      ? process.env.NEXT_PUBLIC_BASE_URL
      : 'http://localhost:3000',
    linkExpirationMinutes: parseInt(
      process.env.VITE_LINK_EXPIRATION_MINUTES || '15'
    ),
    maxEmailSends: parseInt(process.env.VITE_MAX_EMAIL_SENDS || '3'),
    rateLimit: parseInt(process.env.VITE_RATE_LIMIT || '10'),
    isDevelopment: process.env.NODE_ENV === 'development',
  };
}
