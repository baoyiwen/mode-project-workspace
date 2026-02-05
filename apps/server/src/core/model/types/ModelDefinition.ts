import type { AttributeDefinition } from './AttributeDefinition';

export interface ModelDefinition {
  modelId: string;
  name: string;
  description?: string;
  attributes: AttributeDefinition[];
}
