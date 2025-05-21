import { NextResponse } from 'next/server';
import { WebhookService } from '@/services/webhookService';

export async function GET() {
  try {
    const webhookService = new WebhookService();
    
    // First, get all existing webhooks
    const existingWebhooks = await webhookService.listWebhooks();
    
    // Delete any existing webhooks with the same scope
    const scope = 'store/order/*';
    for (const webhook of existingWebhooks.data) {
      if (webhook.scope === scope) {
        await webhookService.deleteWebhook(webhook.id);
        console.log(`Deleted existing webhook with ID: ${webhook.id}`);
      }
    }
    
    // Create a new webhook
    const webhook = await webhookService.createWebhook(scope);
    
    return NextResponse.json({
      success: true,
      webhook,
      message: 'Test webhook created successfully'
    });
  } catch (error) {
    console.error('Error managing webhook:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to manage webhook'
    }, { status: 500 });
  }
} 