import type { AttributeDefinition } from './AttributeDefinition';

export interface ResolvedModel {
  modelId: string;
  attributes: AttributeDefinition[];
}
