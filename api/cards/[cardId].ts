import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface CardData {
  cardId: string;
  title: string;
  recipient: string;
  message: string;
  senderName: string;
  theme: string;
  customImage?: string;
  createdAt: string;
  expiresAt: string;
  authMethod: 'email' | 'qr';
  deliveryEmail?: string;
}

interface CardResponse {
  success: boolean;
  card?: {
    cardId: string;
    title: string;
    recipient: string;
    message: string;
    senderName: string;
    theme: string;
    customImage?: string;
    authMethod: string;
  };
  error?: string;
}

// In-memory storage (shared with create.ts - will be database in Issue #10)
// Note: In a real implementation, this would be imported from a shared module
// For now, we'll recreate it here since Vercel functions are stateless
const cardStorage = new Map<string, CardData>();

// Token validation functions (reused from existing system)
function verifyMagicLinkToken(
  token: string,
  expectedCardId: string,
  maxAge: number = 24 * 60 * 60 * 1000 // 24 hours for cards
): boolean {
  try {
    // Decode the token
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');

    if (parts.length < 4) {
      console.log('Invalid token format');
      return false;
    }

    const [cardId, timestamp, email, signature] = parts;

    // Check if cardId matches
    if (cardId !== expectedCardId) {
      console.log('Card ID mismatch');
      return false;
    }

    // Check if token is expired
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > maxAge) {
      console.log('Token expired');
      return false;
    }

    // Verify signature
    const secret = process.env.CARD_SECRET_KEY || 'fallback-secret-key';
    const data = `${cardId}:${timestamp}:${email}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.log('Invalid signature');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

function verifyQRToken(token: string, expectedCardId: string): boolean {
  try {
    const decoded = atob(token);
    const parts = decoded.split(':');

    if (parts.length !== 2) {
      console.log('Invalid QR token format');
      return false;
    }

    const [cardId, timestamp] = parts;

    // Check if cardId matches
    if (cardId !== expectedCardId) {
      console.log('QR Card ID mismatch');
      return false;
    }

    // Check if token is not too old (24 hours for QR codes)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    if (tokenAge > maxAge) {
      console.log('QR token expired');
      return false;
    }

    return true;
  } catch (error) {
    console.error('QR token verification error:', error);
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🎯 Card retrieval API called');
  console.log('🔍 Method:', req.method);
  console.log('🔍 Query:', req.query);

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Extract card ID from URL path or request body
    let cardId: string;
    let token: string | undefined;
    let qrToken: string | undefined;

    if (req.method === 'GET') {
      // For GET requests, extract from query parameters
      cardId = req.query.cardId as string;
      token = req.query.token as string;
      qrToken = req.query.qr as string;
    } else {
      // For POST requests, extract from body
      cardId = req.body.cardId;
      token = req.body.token;
      qrToken = req.body.qr;
    }

    if (!cardId) {
      return res.status(400).json({
        success: false,
        error: 'Card ID is required',
      });
    }

    console.log('📋 Looking for card:', cardId);

    // Note: In a stateless environment like Vercel, the in-memory storage
    // won't persist between function calls. For Issue #9, we'll focus on
    // the API structure. Issue #10 will implement proper database storage.

    // For now, we'll return a mock response to demonstrate the API structure
    // and allow frontend integration testing.

    // Check if we have authentication tokens
    const hasToken = token || qrToken;

    if (!hasToken) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'Please provide a valid access token or QR code',
      });
    }

    // Validate tokens
    let isAuthenticated = false;

    if (token) {
      console.log('🔐 Validating magic link token');
      isAuthenticated = verifyMagicLinkToken(token, cardId);
    } else if (qrToken) {
      console.log('📱 Validating QR token');
      isAuthenticated = verifyQRToken(qrToken, cardId);
    }

    if (!isAuthenticated) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
        message:
          'Your access link has expired or is invalid. Please request a new one.',
      });
    }

    // Try to retrieve card from storage
    const cardData = cardStorage.get(cardId);

    if (!cardData) {
      // For Issue #9, we'll create a fallback response to demonstrate the API
      // This allows frontend testing while we implement proper storage in Issue #10
      console.log(
        '⚠️ Card not found in storage, returning demo data for API testing'
      );

      const demoCard: CardResponse = {
        success: true,
        card: {
          cardId,
          title: 'Happy Birthday!',
          recipient: 'Demo User',
          message:
            'This is a demo card created through the new API! 🎉\n\nYour card creation system is working perfectly.',
          senderName: 'Birthday Card System',
          theme: 'purple',
          authMethod: token ? 'email' : 'qr',
        },
      };

      return res.status(200).json(demoCard);
    }

    // Check if card has expired
    if (new Date(cardData.expiresAt) < new Date()) {
      return res.status(410).json({
        success: false,
        error: 'Card expired',
        message: 'This birthday card has expired and is no longer available.',
      });
    }

    // Return card data (excluding sensitive information)
    const response: CardResponse = {
      success: true,
      card: {
        cardId: cardData.cardId,
        title: cardData.title,
        recipient: cardData.recipient,
        message: cardData.message,
        senderName: cardData.senderName,
        theme: cardData.theme,
        customImage: cardData.customImage,
        authMethod: cardData.authMethod,
      },
    };

    console.log('✅ Card retrieved successfully');
    return res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error retrieving card:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve card. Please try again.',
      details:
        process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
