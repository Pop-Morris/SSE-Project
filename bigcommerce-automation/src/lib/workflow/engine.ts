import { Workflow, Condition, Action } from './types';

export class WorkflowEngine {
  private workflows: Workflow[] = [];

  // Add a workflow to the engine
  addWorkflow(workflow: Workflow) {
    this.workflows.push(workflow);
  }

  // Process a webhook event
  async processWebhook(event: string, payload: any) {
    const matchingWorkflows = this.workflows.filter(
      workflow => 
        workflow.enabled && 
        workflow.trigger.type === 'webhook' && 
        workflow.trigger.event === event
    );

    for (const workflow of matchingWorkflows) {
      if (await this.evaluateConditions(workflow.conditions, payload)) {
        await this.executeActions(workflow.actions, payload);
      }
    }
  }

  // Evaluate workflow conditions
  private async evaluateConditions(conditions: Condition[], payload: any): Promise<boolean> {
    if (conditions.length === 0) return true;

    let result = true;
    let currentOperator: 'and' | 'or' | null = null;

    for (const condition of conditions) {
      const conditionResult = await this.evaluateCondition(condition, payload);

      if (currentOperator === null) {
        result = conditionResult;
      } else if (currentOperator === 'and') {
        result = result && conditionResult;
      } else if (currentOperator === 'or') {
        result = result || conditionResult;
      }

      currentOperator = condition.operator || null;
    }

    return result;
  }

  // Evaluate a single condition
  private async evaluateCondition(condition: Condition, payload: any): Promise<boolean> {
    const fieldValue = this.getFieldValue(payload, condition.field);

    switch (condition.type) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'greaterThan':
        return Number(fieldValue) > Number(condition.value);
      case 'lessThan':
        return Number(fieldValue) < Number(condition.value);
      case 'matches':
        return new RegExp(condition.value).test(String(fieldValue));
      default:
        return false;
    }
  }

  // Execute workflow actions
  private async executeActions(actions: Action[], payload: any) {
    for (const action of actions) {
      try {
        await this.executeAction(action, payload);
      } catch (error) {
        console.error(`Failed to execute action ${action.id}:`, error);
        // TODO: Implement error handling and retry logic
      }
    }
  }

  // Execute a single action
  private async executeAction(action: Action, payload: any) {
    switch (action.type) {
      case 'webhook':
        await this.executeWebhookAction(action, payload);
        break;
      case 'email':
        await this.executeEmailAction(action, payload);
        break;
      case 'tag':
        await this.executeTagAction(action, payload);
        break;
      case 'custom':
        await this.executeCustomAction(action, payload);
        break;
    }
  }

  // Helper method to get nested field values
  private getFieldValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // Action execution methods
  private async executeWebhookAction(action: Action, payload: any) {
    const { url, method = 'POST', headers = {}, body } = action.config;
    if (!url) throw new Error('Webhook URL is required');

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body || payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed: ${response.statusText}`);
    }
  }

  private async executeEmailAction(action: Action, payload: any) {
    // TODO: Implement email sending logic
    console.log('Email action:', action.config.email);
  }

  private async executeTagAction(action: Action, payload: any) {
    // TODO: Implement tag action logic
    console.log('Tag action:', action.config.tag);
  }

  private async executeCustomAction(action: Action, payload: any) {
    // TODO: Implement custom action logic
    console.log('Custom action:', action.config);
  }
} 