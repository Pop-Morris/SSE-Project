import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { OrderService } from '@/services/orderService';

export async function POST(request: Request) {
  console.log('=== Webhook Received ===');
  console.log('Time:', new Date().toISOString());
  
  try {
    const headersList = await headers();
    
    // Debug: Log all headers
    console.log('All Headers:', Object.fromEntries(headersList.entries()));
    
    const signature = headersList.get('x-bc-signature') || headersList.get('X-BC-Signature');
    const timestamp = headersList.get('x-bc-timestamp') || headersList.get('X-BC-Timestamp');
    
    // Debug: Log signature and timestamp
    console.log('Signature:', signature);
    console.log('Timestamp:', timestamp);

    // Get the raw body
    const body = await request.text();
    console.log('Raw Body:', body);

    // Parse the webhook payload
    const payload = JSON.parse(body);
    
    // Log the webhook event for debugging
    console.log('Webhook Payload:', {
      scope: payload.scope,
      data: payload.data
    });

    // Process order created webhook
    if (payload.scope === 'store/order/created') {
      console.log('Processing new order webhook');
      const orderId = payload.data.id;
      const orderService = new OrderService();
      
      // Get all workflows that trigger on new orders
      const workflows = await prisma.workflow.findMany({
        where: {
          triggerEvent: 'new_order'
        }
      });

      console.log(`Found ${workflows.length} matching workflows`);

      // Get the order details
      const order = await orderService.getOrder(orderId);
      const orderTotal = parseFloat(order.total_inc_tax);

      console.log(`Order ${orderId} total: ${orderTotal}`);

      // Process each workflow
      for (const workflow of workflows) {
        console.log(`Checking workflow ${workflow.id}:`, {
          threshold: workflow.threshold,
          actionValue: workflow.actionValue
        });
        
        // Check if order total meets the threshold
        if (orderTotal > workflow.threshold) {
          console.log(`Workflow ${workflow.id} condition met: ${orderTotal} > ${workflow.threshold}`);
          // Update the order with the internal note
          await orderService.updateOrderNote(orderId, workflow.actionValue);
          console.log(`Updated order ${orderId} with note: ${workflow.actionValue}`);
        } else {
          console.log(`Workflow ${workflow.id} condition not met: ${orderTotal} <= ${workflow.threshold}`);
        }
      }
    } else {
      console.log('Webhook scope not handled:', payload.scope);
    }

    console.log('=== Webhook Processing Complete ===');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    console.log('=== Webhook Processing Failed ===');
    return NextResponse.json({ received: true }); // Always return 200
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