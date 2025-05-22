import { BigCommerceClient } from './bigcommerceService';

export class OrderService {
  private client: BigCommerceClient;
  private storeHash: string;
  private accessToken: string;

  constructor() {
    this.storeHash = process.env.BIGCOMMERCE_STORE_HASH || '';
    this.accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN || '';
    this.client = new BigCommerceClient(this.storeHash, this.accessToken);
  }

  async getOrder(orderId: number): Promise<any> {
    try {
      const response = await this.client.get(`/v2/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  async updateOrderNote(orderId: number, note: string): Promise<any> {
    try {
      const response = await this.client.put(`/v2/orders/${orderId}`, {
        staff_notes: note
      });
      return response.data;
    } catch (error) {
      console.error('Error updating order note:', error);
      throw error;
    }
  }
} 