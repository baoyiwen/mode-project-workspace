import type { InheritanceDefinition } from './InheritanceDefinition';
import type { ModelDefinition } from './ModelDefinition';

export interface ModelSnapshot {
  models: ModelDefinition[];
  inheritances: InheritanceDefinition[];
}
