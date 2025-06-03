import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface CardData {
  recipientName: string;
  recipientAge?: string;
  cardTitle?: string;
  message: string;
  senderName?: string;
  selectedTheme: string;
  image?: string;
  deliveryMethod: 'magic-link' | 'qr-code';
  recipientEmail?: string; // For magic links
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const cardData: CardData = req.body;

    console.log('🎂 Creating new birthday card:', {
      recipient: cardData.recipientName,
      method: cardData.deliveryMethod,
      hasEmail: !!cardData.recipientEmail,
    });

    // Validate required fields
    if (!cardData.recipientName || !cardData.message) {
      return res.status(400).json({
        error: 'Recipient name and message are required',
      });
    }

    if (cardData.deliveryMethod === 'magic-link' && !cardData.recipientEmail) {
      return res.status(400).json({
        error: 'Email address is required for magic link delivery',
      });
    }

    // Generate unique card ID
    const cardId = generateCardId(cardData.recipientName);
    console.log('🆔 Generated card ID:', cardId);

    // Get base URL for links
    const baseUrl = getBaseUrl(req);

    let responseData: any = {
      success: true,
      cardId: cardId,
      cardUrl: `${baseUrl}/card/${cardId}`,
    };

    // Handle delivery method
    if (cardData.deliveryMethod === 'magic-link') {
      console.log('📧 Sending magic link email...');

      // Generate magic link
      const magicLink = generateMagicLink(
        cardId,
        cardData.recipientEmail!,
        baseUrl
      );

      // Send email using your existing Resend integration
      await sendMagicLinkEmail(
        cardData.recipientEmail!,
        cardData.recipientName,
        magicLink,
        cardData.cardTitle ||
          `Happy ${
            cardData.recipientAge ? `${cardData.recipientAge}th ` : ''
          }Birthday!`,
        cardData.senderName || 'Someone special'
      );

      responseData.message = 'Magic link sent successfully!';
      responseData.emailSent = true;
    } else if (cardData.deliveryMethod === 'qr-code') {
      console.log('📱 Generating QR code...');

      // Generate QR code token and URL
      const qrToken = generateQRToken(cardId);
      const qrUrl = `${baseUrl}/card/${cardId}?qr=${qrToken}`;

      responseData.qrCode = {
        url: qrUrl,
        token: qrToken,
        imageUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
          qrUrl
        )}&bgcolor=ffffff&color=000000&margin=20&format=png`,
      };
      responseData.message = 'QR code generated successfully!';
    }

    // Store card data in URL parameters (for simplicity)
    // In production, you'd save this to a database
    const cardParams = new URLSearchParams({
      recipient: cardData.recipientName,
      title:
        cardData.cardTitle ||
        `Happy ${
          cardData.recipientAge ? `${cardData.recipientAge}th ` : ''
        }Birthday!`,
      message: cardData.message,
      sender: cardData.senderName || 'Someone special',
      theme: cardData.selectedTheme,
      image: cardData.image || '/happy-birthday.jpeg',
    });

    responseData.cardUrl = `${baseUrl}/card/${cardId}?${cardParams.toString()}`;

    console.log('✅ Card created successfully:', cardId);
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('❌ Error creating card:', error);
    return res.status(500).json({
      error: 'Failed to create birthday card',
      details:
        process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}

// Helper functions
function generateCardId(recipientName: string): string {
  const timestamp = Date.now();
  const randomSuffix = crypto.randomBytes(3).toString('hex');
  const cleanName = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 10);
  return `${cleanName}-${timestamp}-${randomSuffix}`;
}

function getBaseUrl(req: VercelRequest): string {
  // Check if we're in development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5173';
  }

  // Production - use the request host
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host;
  return `${protocol}://${host}`;
}

function generateQRToken(cardId: string): string {
  const timestamp = Date.now();
  const data = `${cardId}:${timestamp}`;
  return Buffer.from(data).toString('base64url');
}

function generateMagicLink(
  cardId: string,
  email: string,
  baseUrl: string
): string {
  const timestamp = Date.now();
  const secret = process.env.CARD_SECRET_KEY || 'fallback-secret-key';

  // Create signature
  const data = `${cardId}:${timestamp}:${email}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');

  // Create token
  const token = Buffer.from(
    `${cardId}:${timestamp}:${email}:${signature}`
  ).toString('base64url');

  return `${baseUrl}/card/${cardId}?token=${token}`;
}

async function sendMagicLinkEmail(
  email: string,
  recipientName: string,
  magicLink: string,
  cardTitle: string,
  senderName: string
): Promise<void> {
  console.log('📬 Preparing email for:', email);

  // Beautiful email template
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${cardTitle}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            margin: 0; 
            padding: 20px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 20px; 
            overflow: hidden; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          }
          .header { 
            background: linear-gradient(135deg, #ff6b6b, #ee5a24); 
            padding: 40px 30px; 
            text-align: center; 
            color: white; 
          }
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: bold;
          }
          .header p {
            margin: 0;
            opacity: 0.9;
            font-size: 16px;
          }
          .content { 
            padding: 40px 30px; 
            text-align: center; 
          }
          .content h2 {
            color: #333;
            margin: 0 0 20px 0;
            font-size: 24px;
          }
          .content p {
            color: #666;
            line-height: 1.6;
            margin: 0 0 20px 0;
            font-size: 16px;
          }
          .button { 
            display: inline-block; 
            padding: 18px 35px; 
            background: linear-gradient(135deg, #667eea, #764ba2); 
            color: white; 
            text-decoration: none; 
            border-radius: 50px; 
            font-weight: bold; 
            margin: 30px 0;
            font-size: 16px;
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            transition: transform 0.2s ease;
          }
          .button:hover {
            transform: translateY(-2px);
          }
          .footer {
            padding: 20px 30px;
            background: #f8f9fa;
            text-align: center;
            border-top: 1px solid #eee;
          }
          .footer p {
            margin: 0;
            color: #999;
            font-size: 14px;
          }
          .emoji {
            font-size: 24px;
            margin: 0 5px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 ${cardTitle}</h1>
            <p>A special birthday surprise awaits you!</p>
          </div>
          <div class="content">
            <h2>Hi ${recipientName}! <span class="emoji">🎂</span></h2>
            <p>
              ${senderName} has created a magical birthday card just for you! 
              It's filled with love, surprises, and birthday magic.
            </p>
            <p>
              Click the button below to open your personalized birthday surprise:
            </p>
            <a href="${magicLink}" class="button">🎁 Open Your Birthday Surprise</a>
            <p>
              <small>This is a secure, one-time link that will expire in 24 hours.</small>
            </p>
          </div>
          <div class="footer">
            <p>
              <span class="emoji">🎈</span> 
              Made with love at bday.top 
              <span class="emoji">🎈</span>
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send email using Resend
  if (process.env.RESEND_API_KEY) {
    console.log('📤 Sending via Resend...');

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Birthday Surprise <surprise@bday.top>',
        to: email,
        subject: `🎉 ${cardTitle} - Your Birthday Surprise Awaits!`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('❌ Resend API error:', error);
      throw new Error(`Failed to send email: ${response.status} - ${error}`);
    }

    console.log('✅ Email sent successfully via Resend');
  } else {
    // Development mode - log the magic link
    console.log('🔗 Development Magic Link:', magicLink);
    console.log('📧 Would send email to:', email);
  }
}
