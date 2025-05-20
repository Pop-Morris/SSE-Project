// Workflow Types
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  trigger: Trigger;
  conditions: Condition[];
  actions: Action[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Trigger Types
export interface Trigger {
  type: 'webhook' | 'schedule' | 'manual';
  event?: string; // For webhook triggers
  schedule?: string; // For scheduled triggers (cron expression)
}

// Condition Types
export interface Condition {
  id: string;
  type: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'matches';
  field: string;
  value: any;
  operator?: 'and' | 'or';
}

// Action Types
export interface Action {
  id: string;
  type: 'webhook' | 'email' | 'tag' | 'custom';
  config: {
    url?: string; // For webhook actions
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    email?: {
      to: string;
      subject: string;
      template: string;
    };
    tag?: {
      name: string;
      value?: string;
    };
  };
} 