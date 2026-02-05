import type { AttributeDefinition } from '../types/AttributeDefinition';
import { PrimitiveType } from '../types/AttributeType';
import type { ModelRegistry } from '../registry/ModelRegistry';

export class AttributeValidator {
  validate(
    attributes: AttributeDefinition[],
    registry: ModelRegistry,
    ownerModelId?: string
  ): void {
    for (const attribute of attributes) {
      if (!attribute.name || attribute.name.trim().length === 0) {
        throw new Error('Attribute name is required.');
      }

      if (attribute.type.kind === 'primitive') {
        const values = Object.values(PrimitiveType) as string[];
        if (!values.includes(attribute.type.type)) {
          throw new Error(
            `Invalid primitive type "${String(attribute.type.type)}".`
          );
        }
        continue;
      }

      if (attribute.type.kind === 'reference') {
        if (!attribute.type.modelId) {
          throw new Error(
            `Reference modelId is required for "${attribute.name}".`
          );
        }
        if (ownerModelId && attribute.type.modelId === ownerModelId) {
          throw new Error(
            `Attribute "${attribute.name}" cannot reference itself.`
          );
        }
        registry.get(attribute.type.modelId);
        continue;
      }

      const kind = (attribute.type as { kind?: string }).kind ?? 'unknown';
      throw new Error(`Unsupported attribute type kind "${kind}".`);
    }
  }
}
