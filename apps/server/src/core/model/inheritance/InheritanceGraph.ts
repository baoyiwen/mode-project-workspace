import type { InheritanceDefinition } from '../types/InheritanceDefinition';

export class InheritanceGraph {
  private readonly parentsByChild = new Map<string, string[]>();
  private readonly childrenByParent = new Map<string, string[]>();

  constructor(inheritances: InheritanceDefinition[]) {
    for (const inheritance of inheritances) {
      if (!inheritance.parentModelId || !inheritance.childModelId) {
        throw new Error('Inheritance must include parentModelId and childModelId.');
      }
      if (inheritance.parentModelId === inheritance.childModelId) {
        throw new Error('Inheritance cannot reference itself.');
      }

      const parents = this.parentsByChild.get(inheritance.childModelId) ?? [];
      if (parents.length > 0 && !parents.includes(inheritance.parentModelId)) {
        throw new Error(
          `Multiple inheritance detected for "${inheritance.childModelId}".`
        );
      }
      if (!parents.includes(inheritance.parentModelId)) {
        parents.push(inheritance.parentModelId);
        this.parentsByChild.set(inheritance.childModelId, parents);
      }

      const children = this.childrenByParent.get(inheritance.parentModelId) ?? [];
      if (!children.includes(inheritance.childModelId)) {
        children.push(inheritance.childModelId);
        this.childrenByParent.set(inheritance.parentModelId, children);
      }
    }
  }

  getParents(modelId: string): string[] {
    return [...(this.parentsByChild.get(modelId) ?? [])];
  }

  getChildren(modelId: string): string[] {
    return [...(this.childrenByParent.get(modelId) ?? [])];
  }

  detectCycle(): void {
    const visiting = new Set<string>();
    const visited = new Set<string>();

    const visit = (modelId: string) => {
      if (visited.has(modelId)) {
        return;
      }
      if (visiting.has(modelId)) {
        throw new Error(`Inheritance cycle detected at "${modelId}".`);
      }

      visiting.add(modelId);
      for (const parent of this.getParents(modelId)) {
        visit(parent);
      }
      visiting.delete(modelId);
      visited.add(modelId);
    };

    const allModels = new Set<string>();
    for (const [child, parents] of this.parentsByChild.entries()) {
      allModels.add(child);
      for (const parent of parents) {
        allModels.add(parent);
      }
    }
    for (const [parent, children] of this.childrenByParent.entries()) {
      allModels.add(parent);
      for (const child of children) {
        allModels.add(child);
      }
    }

    for (const modelId of allModels) {
      visit(modelId);
    }
  }
}
