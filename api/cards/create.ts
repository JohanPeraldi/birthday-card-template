import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface CreateCardRequest {
  cardTitle: string;
  recipientName: string;
  message: string;
  senderName: string;
  theme: 'purple' | 'yellow';
  customImage?: string; // base64 encoded image data
  deliveryMethod: 'email' | 'qr';
  recipientEmail?: string;
}

interface CreateCardResponse {
  success: boolean;
  cardId: string;
  accessUrl: string;
  qrCodeUrl?: string;
  magicLinkSent?: boolean;
  message: string;
}

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

// In-memory storage (will be replaced with database in Issue #10)
const cardStorage = new Map<string, CardData>();

// Generate secure magic link token (reusing existing logic)
function generateMagicLinkToken(email: string, cardId: string): string {
  const timestamp = Date.now().toString();
  const secret = process.env.CARD_SECRET_KEY || 'fallback-secret-key';

  // Create a secure hash
  const data = `${cardId}:${timestamp}:${email}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');

  // Encode the token
  const token = Buffer.from(`${data}:${signature}`).toString('base64url');
  return token;
}

// Generate QR code data
function generateQRToken(cardId: string): string {
  const timestamp = Date.now();
  const qrData = `${cardId}:${timestamp}`;
  return btoa(qrData);
}

// Send magic link email (reusing existing service)
async function sendMagicLinkEmail(
  email: string,
  cardId: string,
  recipientName: string
): Promise<void> {
  // Only send if API key is configured
  if (!process.env.RESEND_API_KEY) {
    console.log('📧 RESEND_API_KEY not configured - skipping email send');
    return;
  }

  const token = generateMagicLinkToken(email, cardId);
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const magicLink = `${baseUrl}/card?token=${token}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Birthday Surprise!</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%);">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center;">
            
            <!-- Header -->
            <div style="font-size: 60px; margin-bottom: 20px;">🎉</div>
            <h1 style="color: #3b82f6; font-size: 32px; margin-bottom: 10px; font-weight: bold;">
              Someone has a special surprise for you!
            </h1>
            <p style="color: #6b7280; font-size: 18px; margin-bottom: 30px;">Happy Birthday, ${recipientName}! 🎂</p>
            
            <!-- Main Content -->
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); border-radius: 15px; padding: 30px; margin: 30px 0;">
              <p style="color: white; font-size: 16px; margin-bottom: 25px; line-height: 1.6;">
                You've received a private birthday card! Click the button below to open your surprise.
              </p>
              <a href="${magicLink}" 
                 style="display: inline-block; background: white; color: #3b82f6; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 16px; transition: all 0.3s ease;">
                🎁 Open My Birthday Card
              </a>
            </div>
            
            <!-- Security Notice -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 5px 0;">
                This link is valid for 24 hours and will expire after use.
              </p>
              <p style="color: #9ca3af; font-size: 12px;">
                If you didn't expect this card, you can safely ignore this email.
              </p>
            </div>
            
            <!-- Fun Footer -->
            <div style="margin-top: 30px; padding: 20px; background: linear-gradient(45deg, #fef3c7, #fce7f3); border-radius: 15px;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                🎈 Made with love using Birthday Cards 🎈
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Birthday Surprise <surprise@yourdomain.com>',
      to: [email],
      subject: `🎉 ${recipientName}, your Birthday Surprise Awaits!`,
      html: emailHtml,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${response.statusText} - ${error}`);
  }
}

// Input validation
function validateCardRequest(data: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.cardTitle?.trim()) {
    errors.push('Card title is required');
  } else if (data.cardTitle.length > 50) {
    errors.push('Card title must be 50 characters or less');
  }

  if (!data.recipientName?.trim()) {
    errors.push('Recipient name is required');
  } else if (data.recipientName.length > 30) {
    errors.push('Recipient name must be 30 characters or less');
  }

  if (!data.message?.trim()) {
    errors.push('Message is required');
  } else if (data.message.length > 300) {
    errors.push('Message must be 300 characters or less');
  }

  if (!data.senderName?.trim()) {
    errors.push('Sender name is required');
  } else if (data.senderName.length > 30) {
    errors.push('Sender name must be 30 characters or less');
  }

  if (!['purple', 'yellow'].includes(data.theme)) {
    errors.push('Theme must be either purple or yellow');
  }

  if (!['email', 'qr'].includes(data.deliveryMethod)) {
    errors.push('Delivery method must be either email or qr');
  }

  if (data.deliveryMethod === 'email') {
    if (!data.recipientEmail?.trim()) {
      errors.push('Recipient email is required for email delivery');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipientEmail)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Validate custom image if provided
  if (data.customImage) {
    // Basic base64 validation
    if (!data.customImage.startsWith('data:image/')) {
      errors.push('Custom image must be a valid image data URL');
    }
    // Check size (approximate - base64 is ~1.33x larger than original)
    const sizeInBytes = (data.customImage.length * 3) / 4;
    if (sizeInBytes > 10 * 1024 * 1024) {
      // 10MB limit
      errors.push('Custom image must be less than 10MB');
    }
  }

  return { isValid: errors.length === 0, errors };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('🎉 Card creation API called');
  console.log('🔍 Method:', req.method);
  console.log('🔍 Body keys:', Object.keys(req.body || {}));

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Validate input
    const validation = validateCardRequest(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: validation.errors,
      });
    }

    const cardRequest: CreateCardRequest = req.body;

    // Generate unique card ID
    const timestamp = Date.now();
    const randomBytes = crypto.randomBytes(8).toString('hex');
    const cardId = `card-${timestamp}-${randomBytes}`;

    console.log('📋 Generated card ID:', cardId);

    // Calculate expiration (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Create card data
    const cardData: CardData = {
      cardId,
      title: cardRequest.cardTitle.trim(),
      recipient: cardRequest.recipientName.trim(),
      message: cardRequest.message.trim(),
      senderName: cardRequest.senderName.trim(),
      theme: cardRequest.theme,
      customImage: cardRequest.customImage,
      createdAt: new Date().toISOString(),
      expiresAt,
      authMethod: cardRequest.deliveryMethod,
      deliveryEmail:
        cardRequest.deliveryMethod === 'email'
          ? cardRequest.recipientEmail
          : undefined,
    };

    // Store card data
    cardStorage.set(cardId, cardData);

    console.log('💾 Card data stored successfully');
    console.log('📊 Total cards in storage:', cardStorage.size);

    // Prepare response
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : req.headers.host
      ? `https://${req.headers.host}`
      : 'http://localhost:3000';

    const response: CreateCardResponse = {
      success: true,
      cardId,
      accessUrl: `${baseUrl}/card`,
      message: 'Card created successfully!',
    };

    // Handle delivery method
    if (cardRequest.deliveryMethod === 'email' && cardRequest.recipientEmail) {
      try {
        await sendMagicLinkEmail(
          cardRequest.recipientEmail,
          cardId,
          cardRequest.recipientName
        );
        response.magicLinkSent = true;
        response.message = 'Card created and magic link sent successfully!';
        console.log('📧 Magic link sent to:', cardRequest.recipientEmail);
      } catch (emailError) {
        console.error('📧 Failed to send email:', emailError);
        // Don't fail the whole request if email fails
        response.magicLinkSent = false;
        response.message =
          'Card created but failed to send email. You can still access it via direct link.';
      }
    } else if (cardRequest.deliveryMethod === 'qr') {
      const qrToken = generateQRToken(cardId);
      const qrUrl = `${baseUrl}/card?qr=${qrToken}`;
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
        qrUrl
      )}&bgcolor=f8fafc&color=3b82f6&margin=10`;

      response.qrCodeUrl = qrImageUrl;
      response.message = 'Card created and QR code generated successfully!';
      console.log('📱 QR code generated for card');
    }

    console.log('✅ Card creation completed successfully');
    return res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error in card creation:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to create card. Please try again.',
      details:
        process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }

  // Cleanup old cards periodically (basic garbage collection)
  // Use Array.from() to avoid iterator issues
  const now = Date.now();
  const entries = Array.from(cardStorage.entries());
  for (const [id, card] of entries) {
    if (new Date(card.expiresAt).getTime() < now) {
      cardStorage.delete(id);
      console.log('🗑️ Cleaned up expired card:', id);
    }
  }
}
