import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { WebhookService } from '@/services/webhookService';
import { getWebhookScopeForTrigger } from '@/lib/workflow/triggers';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, triggerEvent, conditionType, threshold, actionType, actionValue } = body;

  try {
    // Get the webhook scope for this trigger
    const webhookScope = getWebhookScopeForTrigger(triggerEvent);
    if (!webhookScope) {
      return NextResponse.json(
        { error: 'Invalid trigger event' },
        { status: 400 }
      );
    }

    console.log('Creating webhook with scope:', webhookScope);

    // Create the webhook in BigCommerce
    const webhookService = new WebhookService();
    
    // Check for existing webhooks with the same scope
    const existingWebhooks = await webhookService.listWebhooks();
    console.log('Existing webhooks:', existingWebhooks);
    
    for (const webhook of existingWebhooks.data) {
      if (webhook.scope === webhookScope) {
        console.log('Deleting existing webhook:', webhook.id);
        await webhookService.deleteWebhook(webhook.id);
      }
    }

    // Create new webhook
    const webhook = await webhookService.createWebhook(webhookScope);
    console.log('Created new webhook:', webhook);

    // Create the workflow with the webhook ID
    const workflow = await prisma.workflow.create({
      data: {
        name,
        category: triggerEvent === 'customer_created' ? 'customer' : 'order',
        triggerEvent,
        conditionType,
        threshold: triggerEvent === 'customer_created' ? 0 : threshold,
        actionType,
        actionValue,
        webhookId: webhook.data.id,
      },
    });

    console.log('Created workflow with webhook ID:', workflow.webhookId);

    return NextResponse.json(workflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const workflows = await prisma.workflow.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(workflows);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workflows' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Workflow ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get the workflow to find its webhook ID
    const workflow = await prisma.workflow.findUnique({
      where: { id: parseInt(id) }
    });

    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found' },
        { status: 404 }
      );
    }

    console.log('Found workflow:', workflow);
    console.log('Webhook ID:', workflow.webhookId);

    // If the workflow has a webhook ID, delete the webhook from BigCommerce
    if (workflow.webhookId) {
      const webhookService = new WebhookService();
      try {
        console.log('Attempting to delete webhook:', workflow.webhookId);
        await webhookService.deleteWebhook(workflow.webhookId);
        console.log('Successfully deleted webhook');
      } catch (error) {
        console.error('Error deleting webhook:', error);
        // Continue with workflow deletion even if webhook deletion fails
      }
    } else {
      console.log('No webhook ID found for workflow');
    }

    // Delete the workflow from the database
    await prisma.$transaction([
      // First delete all associated activity logs
      prisma.activityLog.deleteMany({
        where: { workflowId: parseInt(id) }
      }),
      // Then delete the workflow
      prisma.workflow.delete({
        where: { id: parseInt(id) }
      })
    ]);

    return NextResponse.json(
      { message: 'Workflow and associated webhook deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting workflow:', error);
    return NextResponse.json(
      { error: 'Failed to delete workflow' },
      { status: 500 }
    );
  }
} 