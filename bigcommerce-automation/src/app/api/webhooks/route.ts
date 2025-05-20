import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const signature = request.headers.get('x-bc-signature');

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', process.env.BIGCOMMERCE_CLIENT_SECRET!);
    const calculatedSignature = hmac.update(JSON.stringify(payload)).digest('hex');

    if (signature !== calculatedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Process webhook based on type
    const webhookType = payload.type;
    console.log('Received webhook:', webhookType, payload);

    // TODO: Implement workflow processing logic

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 