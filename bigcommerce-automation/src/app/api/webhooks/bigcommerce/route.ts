import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const signature = headersList.get('x-bc-signature');
    const timestamp = headersList.get('x-bc-timestamp');
    
    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing signature or timestamp' }, { status: 400 });
    }

    // Get the raw body
    const body = await request.text();
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(body, signature, timestamp);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the webhook payload
    const payload = JSON.parse(body);
    
    // Log the webhook event for debugging
    console.log('Received webhook:', {
      scope: payload.scope,
      data: payload.data
    });

    // TODO: Process the webhook based on the scope
    // This will be implemented when we add the order processing logic

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string
): boolean {
  const clientSecret = process.env.BIGCOMMERCE_CLIENT_SECRET;
  if (!clientSecret) {
    console.error('Missing BIGCOMMERCE_CLIENT_SECRET');
    return false;
  }

  const hmac = crypto.createHmac('sha256', clientSecret);
  hmac.update(payload + timestamp);
  const calculatedSignature = hmac.digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(calculatedSignature),
    Buffer.from(signature)
  );
} 