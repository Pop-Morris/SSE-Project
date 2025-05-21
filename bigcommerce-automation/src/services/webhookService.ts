import { BigCommerceClient } from './bigcommerceService';

interface WebhookConfig {
  scope: string;
  destination: string;
  is_active: boolean;
}

export class WebhookService {
  private client: BigCommerceClient;
  private storeHash: string;
  private accessToken: string;

  constructor() {
    this.storeHash = process.env.BIGCOMMERCE_STORE_HASH || '';
    this.accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN || '';
    this.client = new BigCommerceClient(this.storeHash, this.accessToken);
  }

  async createWebhook(scope: string): Promise<any> {
    const webhookConfig: WebhookConfig = {
      scope,
      destination: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhooks/bigcommerce`,
      is_active: true
    };

    try {
      console.log('WebhookService: Creating webhook with config:', webhookConfig);
      const response = await this.client.post('/v3/hooks', webhookConfig);
      console.log('WebhookService: Create webhook response:', response);
      console.log('WebhookService: Webhook ID from response:', response.data?.id);
      return response.data;
    } catch (error) {
      console.error('WebhookService: Error creating webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(webhookId: number): Promise<void> {
    try {
      console.log('WebhookService: Deleting webhook with ID:', webhookId);
      console.log('Using store hash:', this.storeHash);
      const response = await this.client.delete(`/v3/hooks/${webhookId}`);
      console.log('WebhookService: Delete response:', response);
    } catch (error) {
      console.error('WebhookService: Error deleting webhook:', error);
      throw error;
    }
  }

  async listWebhooks(): Promise<any> {
    try {
      const response = await this.client.get('/v3/hooks');
      console.log('WebhookService: List webhooks response:', response);
      return response.data;
    } catch (error) {
      console.error('Error listing webhooks:', error);
      throw error;
    }
  }
} 