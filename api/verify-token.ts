// api/verify-token.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

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
    const { token, cardId } = req.body;

    if (!token || !cardId) {
      return res.status(400).json({ error: 'Token and cardId are required' });
    }

    // Verify magic link token
    const isValid = verifyMagicLinkToken(token, cardId);

    if (isValid) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function verifyMagicLinkToken(
  token: string,
  expectedCardId: string,
  maxAge: number = 15 * 60 * 1000
): boolean {
  try {
    // Decode the token
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');

    if (parts.length < 4) {
      return false;
    }

    const [cardId, timestamp, email, signature] = parts;

    // Check if cardId matches
    if (cardId !== expectedCardId) {
      return false;
    }

    // Check if token is expired
    const tokenAge = Date.now() - parseInt(timestamp);
    if (tokenAge > maxAge) {
      return false;
    }

    // Verify signature
    const secret = process.env.CARD_SECRET_KEY || 'fallback-secret-key';
    const data = `${cardId}:${timestamp}:${email}`;
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(data)
      .digest('hex');

    return signature === expectedSignature;
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}
