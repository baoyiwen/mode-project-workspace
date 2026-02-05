import type { AttributeDefinition } from '../types/AttributeDefinition';
import type { InheritanceGraph } from './InheritanceGraph';
import type { ModelRegistry } from '../registry/ModelRegistry';
import type { ResolvedModel } from '../types/ResolvedModel';

export class InheritanceResolver {
  resolve(
    modelId: string,
    registry: ModelRegistry,
    graph: InheritanceGraph
  ): ResolvedModel {
    const ordered = this.collectModelChain(modelId, registry, graph);
    const attributes = this.mergeAttributes(ordered);

    return {
      modelId,
      attributes,
    };
  }

  private collectModelChain(
    modelId: string,
    registry: ModelRegistry,
    graph: InheritanceGraph
  ) {
    const ordered: string[] = [];
    const visited = new Set<string>();

    const visit = (currentId: string) => {
      if (visited.has(currentId)) {
        return;
      }
      visited.add(currentId);
      for (const parentId of graph.getParents(currentId)) {
        visit(parentId);
      }
      ordered.push(currentId);
    };

    visit(modelId);
    return ordered.map((id) => registry.get(id));
  }

  private mergeAttributes(models: { attributes: AttributeDefinition[] }[]) {
    const byName = new Map<string, AttributeDefinition>();
    for (const model of models) {
      for (const attribute of model.attributes ?? []) {
        byName.set(attribute.name, attribute);
      }
    }
    return Array.from(byName.values());
  }
}
