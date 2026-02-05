import type { AttributeType } from './AttributeType';

export interface AttributeDefinition {
  name: string;
  type: AttributeType;
  nullable: boolean;
}
