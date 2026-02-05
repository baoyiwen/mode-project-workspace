import type { ModelDefinition } from '../types/ModelDefinition';

export class ModelRegistry {
  private readonly models = new Map<string, ModelDefinition>();

  register(model: ModelDefinition): void {
    if (!model.modelId) {
      throw new Error('modelId is required.');
    }
    if (this.models.has(model.modelId)) {
      throw new Error(`modelId "${model.modelId}" already exists.`);
    }

    const names = new Set<string>();
    for (const attribute of model.attributes ?? []) {
      if (names.has(attribute.name)) {
        throw new Error(
          `Duplicate attribute name "${attribute.name}" in model "${model.modelId}".`
        );
      }
      names.add(attribute.name);
    }

    this.models.set(model.modelId, model);
  }

  get(modelId: string): ModelDefinition {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model "${modelId}" not found.`);
    }
    return model;
  }

  list(): ModelDefinition[] {
    return Array.from(this.models.values());
  }
}
