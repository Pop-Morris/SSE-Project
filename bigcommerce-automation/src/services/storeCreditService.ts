import { BigCommerceClient } from './bigcommerceService';

export class StoreCreditService {
  private client: BigCommerceClient;
  private storeHash: string;
  private accessToken: string;

  constructor() {
    this.storeHash = process.env.BIGCOMMERCE_STORE_HASH || '';
    this.accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN || '';
    this.client = new BigCommerceClient(this.storeHash, this.accessToken);
  }

  async updateStoreCredit(customerId: number, amount: number): Promise<any> {
    try {
      const payload = {
        store_credit: amount
      };

      const response = await this.client.put(
        `/v2/customers/${customerId}`,
        payload
      );

      return response.data;
    } catch (error) {
      console.error('Error updating store credit:', error);
      throw error;
    }
  }

  async getStoreCreditBalance(customerId: number): Promise<number> {
    try {
      const response = await this.client.get(`/v2/customers/${customerId}`);
      return response.data.store_credit || 0;
    } catch (error) {
      console.error('Error getting store credit balance:', error);
      throw error;
    }
  }
} 