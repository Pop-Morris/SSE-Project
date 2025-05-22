import { NextResponse } from 'next/server';
import { WebhookService } from '@/services/webhookService';

export async function GET() {
  try {
    const webhookService = new WebhookService();
    
    // First, get all existing webhooks
    const existingWebhooks = await webhookService.listWebhooks();
    console.log('Current webhook URL:', process.env.NEXT_PUBLIC_WEBHOOK_URL);
    console.log('Existing webhooks:', JSON.stringify(existingWebhooks, null, 2));
    
    // Delete any existing webhooks with the same scope
    const scope = 'store/order/*';
    for (const webhook of existingWebhooks.data) {
      if (webhook.scope === scope) {
        console.log('Deleting webhook:', webhook);
        await webhookService.deleteWebhook(webhook.id);
        console.log(`Deleted existing webhook with ID: ${webhook.id}`);
      }
    }
    
    // Create a new webhook
    const webhookConfig = {
      scope,
      destination: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhooks/bigcommerce`,
      is_active: true
    };
    console.log('Creating new webhook with config:', webhookConfig);
    const webhook = await webhookService.createWebhook(scope);
    console.log('Created new webhook:', webhook);
    
    return NextResponse.json({
      success: true,
      webhook,
      message: 'Test webhook created successfully',
      webhookUrl: webhookConfig.destination
    });
  } catch (error) {
    console.error('Error managing webhook:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to manage webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 