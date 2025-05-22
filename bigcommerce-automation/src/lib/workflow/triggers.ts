export const TRIGGER_TO_WEBHOOK_SCOPE: Record<string, string> = {
  'new_order': 'store/order/created',
  'customer_created': 'store/customer/created',
  // Add more mappings as you add more triggers
  // Example:
  // 'order_status_change': 'store/order/status/*',
  // 'product_created': 'store/product/*',
};

export function getWebhookScopeForTrigger(trigger: string): string | null {
  return TRIGGER_TO_WEBHOOK_SCOPE[trigger] || null;
} 