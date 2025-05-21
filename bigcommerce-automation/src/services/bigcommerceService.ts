import axios from 'axios';

export class BigCommerceClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(storeHash: string, accessToken: string) {
    this.baseUrl = `https://api.bigcommerce.com/stores/${storeHash}`;
    this.headers = {
      'X-Auth-Token': accessToken,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async get(endpoint: string) {
    try {
      console.log('BigCommerceClient: Making GET request to:', `${this.baseUrl}${endpoint}`);
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: this.headers
      });
      console.log('BigCommerceClient: GET response:', response.data);
      return response;
    } catch (error) {
      console.error('BigCommerceClient: GET Error:', error);
      throw error;
    }
  }

  async post(endpoint: string, data: any) {
    try {
      console.log('BigCommerceClient: Making POST request to:', `${this.baseUrl}${endpoint}`);
      console.log('BigCommerceClient: POST data:', data);
      const response = await axios.post(`${this.baseUrl}${endpoint}`, data, {
        headers: this.headers
      });
      console.log('BigCommerceClient: POST response:', response.data);
      return response;
    } catch (error) {
      console.error('BigCommerceClient: POST Error:', error);
      throw error;
    }
  }

  async put(endpoint: string, data: any) {
    try {
      console.log('BigCommerceClient: Making PUT request to:', `${this.baseUrl}${endpoint}`);
      const response = await axios.put(`${this.baseUrl}${endpoint}`, data, {
        headers: this.headers
      });
      console.log('BigCommerceClient: PUT response:', response.data);
      return response;
    } catch (error) {
      console.error('BigCommerceClient: PUT Error:', error);
      throw error;
    }
  }

  async delete(endpoint: string) {
    try {
      console.log('BigCommerceClient: Making DELETE request to:', `${this.baseUrl}${endpoint}`);
      const response = await axios.delete(`${this.baseUrl}${endpoint}`, {
        headers: this.headers
      });
      console.log('BigCommerceClient: DELETE response:', response.data);
      return response;
    } catch (error) {
      console.error('BigCommerceClient: DELETE Error:', error);
      throw error;
    }
  }
} 