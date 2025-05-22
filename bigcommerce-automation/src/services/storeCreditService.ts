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

  async addStoreCredit(customerId: number, amount: number, description: string): Promise<any> {
    try {
      const storeCreditData = {
        amount: amount,
        description: description,
        type: 'credit'
      };

      const response = await this.client.post(
        `/v2/customers/${customerId}/store_credit`,
        storeCreditData
      );

      return response.data;
    } catch (error) {
      console.error('Error adding store credit:', error);
      throw error;
    }
  }

  async getStoreCreditBalance(customerId: number): Promise<number> {
    try {
      const response = await this.client.get(
        `/v2/customers/${customerId}/store_credit`
      );
      return response.data.amount || 0;
    } catch (error) {
      console.error('Error getting store credit balance:', error);
      throw error;
    }
  }
} 