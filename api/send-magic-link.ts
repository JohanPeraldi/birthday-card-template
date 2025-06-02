// api/send-magic-link.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

interface EmailService {
  sendEmail(to: string, subject: string, html: string): Promise<void>;
}

// Resend Email Service (free tier: 3000 emails/month)
class ResendEmailService implements EmailService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Birthday Cards <noreply@resend.dev>',
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `Failed to send email: ${response.statusText} - ${error}`
      );
    }
  }
}

// Alternative: Nodemailer with Gmail (free)
class GmailEmailService implements EmailService {
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    // This is a placeholder - you'd need to install nodemailer
    // and set up OAuth2 or app passwords for Gmail
    throw new Error('Gmail service not implemented in this example');
  }
}

// Generate secure magic link token
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debugging
  console.log('🔍 API called with method:', req.method);
  console.log('🔍 Request body:', req.body);
  console.log('🔍 RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

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
    const { email, cardId, recipientName } = req.body;

    if (!email || !cardId) {
      return res.status(400).json({ error: 'Email and cardId are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Generate magic link
    const token = generateMagicLinkToken(email, cardId);
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : req.headers.host
      ? `https://${req.headers.host}`
      : 'http://localhost:3000';

    const magicLink = `${baseUrl}?token=${token}`;

    // Create beautiful email template
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
              ${
                recipientName
                  ? `<p style="color: #6b7280; font-size: 18px; margin-bottom: 30px;">Happy Birthday, ${recipientName}! 🎂</p>`
                  : ''
              }
              
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
                  This link is valid for 15 minutes and will expire after use.
                </p>
                <p style="color: #9ca3af; font-size: 12px;">
                  If you didn't expect this card, you can safely ignore this email.
                </p>
              </div>
              
              <!-- Fun Footer -->
              <div style="margin-top: 30px; padding: 20px; background: linear-gradient(45deg, #fef3c7, #fce7f3); border-radius: 15px;">
                <p style="color: #92400e; font-size: 14px; margin: 0;">
                  🎈 Made with love using Birthday Card Template 🎈
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email (only if API key is configured)
    if (process.env.RESEND_API_KEY) {
      console.log('🔍 About to send email to:', email);
      const emailService = new ResendEmailService(process.env.RESEND_API_KEY);
      try {
        await emailService.sendEmail(
          email,
          `🎉 ${
            recipientName ? `${recipientName}, your` : 'Your'
          } Birthday Surprise Awaits!`,
          emailHtml
        );
        console.log('✅ Email sent successfully');
        return res.status(200).json({
          success: true,
          message: 'Magic link sent successfully!',
        });
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        throw emailError;
      }
    } else {
      console.log('❌ No RESEND_API_KEY found');
      // Development mode - return the link
      console.log('🔗 Magic Link (no email service configured):', magicLink);

      return res.status(200).json({
        success: true,
        message: 'Magic link generated (check console in development)',
        ...(process.env.NODE_ENV === 'development' && { magicLink }),
      });
    }
  } catch (error) {
    console.error('Error sending magic link:', error);
    return res.status(500).json({
      error: 'Failed to send magic link',
      details:
        process.env.NODE_ENV === 'development' ? String(error) : undefined,
    });
  }
}
