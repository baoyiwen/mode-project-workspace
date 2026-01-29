/**
 * 模型数据管理器
 * 负责管理实体、关系的增删改查，并支持 undo/redo 功能
 */

import type { Entity, EntityField, ModelData, Relationship } from '../components/model/ModelDesignerGraphComponent';

/**
 * 预定义的颜色列表
 */
const ENTITY_COLORS = [
  '#667eea', // 紫蓝
  '#764ba2', // 紫色
  '#f093fb', // 粉色
  '#f5576c', // 红色
  '#4facfe', // 蓝色
  '#00f2fe', // 青色
  '#43e97b', // 绿色
  '#38f9d7', // 青绿
  '#fa709a', // 粉红
  '#fee140', // 黄色
  '#30cfd0', // 青色
  '#330867', // 深紫
  '#11998e', // 深青
  '#fc4a1a', // 橙色
  '#6a11cb', // 紫色
];

/**
 * 历史记录项
 */
interface HistoryItem {
  data: ModelData;
  timestamp: number;
  action: string;
}

/**
 * 管理器配置
 */
export interface ModelDataManagerConfig {
  maxHistorySize?: number; // 最大历史记录数量
  autoSave?: boolean; // 是否自动保存到 localStorage
  storageKey?: string; // localStorage 的 key
}

/**
 * 模型数据管理器类
 */
export class ModelDataManager {
  private currentData: ModelData;
  private history: HistoryItem[] = []; // 历史记录栈
  private historyIndex: number = -1; // 当前历史记录索引
  private config: Required<ModelDataManagerConfig>;
  private listeners: Set<(data: ModelData) => void> = new Set();
  private nextEntityId: number = 1;
  private nextFieldId: number = 1;

  constructor(config: ModelDataManagerConfig = {}) {
    this.config = {
      maxHistorySize: config.maxHistorySize || 50,
      autoSave: config.autoSave || false,
      storageKey: config.storageKey || 'model-designer-data',
    };

    // 初始化数据
    this.currentData = this.loadFromStorage() || {
      entities: [],
      relationships: [],
    };

    // 保存初始状态到历史
    this.saveToHistory('init');
  }

  /**
   * 订阅数据变化
   */
  public subscribe(listener: (data: ModelData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * 通知所有监听器
   */
  private notify(): void {
    this.listeners.forEach((listener) => listener(this.getData()));
  }

  /**
   * 保存到历史记录
   */
  private saveToHistory(action: string): void {
    // 如果当前不在历史记录的末尾，删除后面的记录
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    // 添加新的历史记录
    this.history.push({
      data: this.deepClone(this.currentData),
      timestamp: Date.now(),
      action,
    });

    // 限制历史记录数量
    if (this.history.length > this.config.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }

    // 自动保存
    if (this.config.autoSave) {
      this.saveToStorage();
    }
  }

  /**
   * 深度克隆数据
   */
  private deepClone(data: ModelData): ModelData {
    return JSON.parse(JSON.stringify(data));
  }

  /**
   * 保存到 localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(this.config.storageKey, JSON.stringify(this.currentData));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * 从 localStorage 加载
   */
  private loadFromStorage(): ModelData | null {
    try {
      const data = localStorage.getItem(this.config.storageKey);
      if (!data) return null;
      
      const parsedData: ModelData = JSON.parse(data);
      
      // 确保所有实体都有颜色（兼容旧数据）
      parsedData.entities.forEach(entity => {
        if (!entity.color) {
          entity.color = this.getRandomColor();
        }
        // 更新 nextEntityId 以避免 ID 冲突
        const idNum = parseInt(entity.id.replace('entity-', ''), 10);
        if (!isNaN(idNum) && idNum >= this.nextEntityId) {
          this.nextEntityId = idNum + 1;
        }
        // 兼容旧数据：将 attributes 迁移到 fields
        if ((entity as any).attributes && !entity.fields) {
          entity.fields = (entity as any).attributes;
          delete (entity as any).attributes;
        }
        if (!entity.fields) {
          entity.fields = [];
        }
        // 更新 nextFieldId
        entity.fields.forEach(field => {
          const fieldIdNum = parseInt(field.id.replace('field-', ''), 10);
          if (!isNaN(fieldIdNum) && fieldIdNum >= this.nextFieldId) {
            this.nextFieldId = fieldIdNum + 1;
          }
        });
      });
      
      return parsedData;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return null;
    }
  }

  /**
   * 获取当前数据
   */
  public getData(): ModelData {
    return this.deepClone(this.currentData);
  }

  /**
   * 设置数据（直接替换）
   */
  public setData(data: ModelData, saveHistory: boolean = true): void {
    this.currentData = this.deepClone(data);
    if (saveHistory) {
      this.saveToHistory('setData');
    }
    this.notify();
  }

  /**
   * 获取随机颜色
   */
  private getRandomColor(): string {
    return ENTITY_COLORS[Math.floor(Math.random() * ENTITY_COLORS.length)];
  }

  /**
   * 添加实体
   */
  public addEntity(entity: Partial<Entity>): Entity {
    // 确保有初始坐标
    const x = entity.x ?? 100;
    const y = entity.y ?? 100;
    
    const newEntity: Entity = {
      id: entity.id || `entity-${this.nextEntityId++}`,
      name: entity.name || `Entity ${this.nextEntityId - 1}`,
      description: entity.description || '',
      color: entity.color || this.getRandomColor(), // 随机分配颜色
      fields: entity.fields || [],
      x: x,
      y: y,
      fx: x, // 固定位置，防止力导向模拟移动
      fy: y,
    };

    this.currentData.entities.push(newEntity);
    this.saveToHistory(`addEntity:${newEntity.id}`);
    this.notify();

    return newEntity;
  }

  /**
   * 更新实体
   */
  public updateEntity(entityId: string, updates: Partial<Entity>, saveHistory: boolean = true): void {
    const index = this.currentData.entities.findIndex((e) => e.id === entityId);
    if (index === -1) return;

    this.currentData.entities[index] = {
      ...this.currentData.entities[index],
      ...updates,
    };

    if (saveHistory) {
      this.saveToHistory(`updateEntity:${entityId}`);
    }
    this.notify();
  }

  /**
   * 更新实体位置（不保存历史，用于拖拽过程中）
   */
  public updateEntityPosition(entityId: string, x: number, y: number): void {
    const index = this.currentData.entities.findIndex((e) => e.id === entityId);
    if (index === -1) return;

    this.currentData.entities[index] = {
      ...this.currentData.entities[index],
      x,
      y,
      fx: x,
      fy: y,
    };
    // 不保存历史，不通知（避免频繁更新）
  }

  /**
   * 完成实体位置更新（拖拽结束时调用，保存历史）
   */
  public commitEntityPosition(entityId: string, x: number, y: number): void {
    const index = this.currentData.entities.findIndex((e) => e.id === entityId);
    if (index === -1) return;

    this.currentData.entities[index] = {
      ...this.currentData.entities[index],
      x,
      y,
      fx: x,
      fy: y,
    };

    this.saveToHistory(`moveEntity:${entityId}`);
    // 不需要 notify，因为视图已经更新
  }

  /**
   * 删除实体
   */
  public deleteEntity(entityId: string): void {
    this.currentData.entities = this.currentData.entities.filter((e) => e.id !== entityId);
    this.currentData.relationships = this.currentData.relationships.filter(
      (r) =>
        (typeof r.source === 'string' ? r.source : r.source.id) !== entityId &&
        (typeof r.target === 'string' ? r.target : r.target.id) !== entityId
    );

    this.saveToHistory(`deleteEntity:${entityId}`);
    this.notify();
  }

  /**
   * 获取实体
   */
  public getEntity(entityId: string): Entity | undefined {
    return this.currentData.entities.find((e) => e.id === entityId);
  }

  /**
   * 复制实体
   */
  public copyEntity(entityId: string, offsetX: number = 50, offsetY: number = 50): Entity | null {
    const entity = this.getEntity(entityId);
    if (!entity) return null;

    const x = (entity.x || 0) + offsetX;
    const y = (entity.y || 0) + offsetY;

    const newEntity: Entity = {
      id: `entity-${this.nextEntityId++}`,
      name: `${entity.name} (Copy)`,
      description: entity.description || '',
      color: this.getRandomColor(), // 复制时分配新颜色
      fields: entity.fields.map((field) => ({
        ...field,
        id: `field-${this.nextFieldId++}`,
      })),
      x: x,
      y: y,
      fx: x, // 固定位置
      fy: y,
    };

    this.currentData.entities.push(newEntity);
    this.saveToHistory(`copyEntity:${entityId}`);
    this.notify();

    return newEntity;
  }

  // ============= 实体字段管理 (Fields) =============

  /**
   * 添加字段到实体
   */
  public addFieldToEntity(entityId: string, field: Partial<EntityField>): void {
    const entity = this.getEntity(entityId);
    if (!entity) return;

    const newField: EntityField = {
      id: field.id || `field-${this.nextFieldId++}`,
      name: field.name || `field${entity.fields.length}`,
      type: field.type || 'string',
      required: field.required || false,
      description: field.description || '',
    };

    entity.fields.push(newField);
    this.updateEntity(entityId, { fields: entity.fields });
  }

  /**
   * 更新实体字段
   */
  public updateEntityField(
    entityId: string,
    fieldId: string,
    updates: Partial<EntityField>
  ): void {
    const entity = this.getEntity(entityId);
    if (!entity) return;

    const fieldIndex = entity.fields.findIndex((f) => f.id === fieldId);
    if (fieldIndex === -1) return;

    entity.fields[fieldIndex] = {
      ...entity.fields[fieldIndex],
      ...updates,
    };

    this.updateEntity(entityId, { fields: entity.fields });
  }

  /**
   * 删除实体字段
   */
  public deleteEntityField(entityId: string, fieldId: string): void {
    const entity = this.getEntity(entityId);
    if (!entity) return;

    entity.fields = entity.fields.filter((f) => f.id !== fieldId);
    this.updateEntity(entityId, { fields: entity.fields });
  }

  /**
   * 添加关系
   */
  public addRelationship(relationship: Relationship): void {
    this.currentData.relationships.push(relationship);
    this.saveToHistory(`addRelationship`);
    this.notify();
  }

  /**
   * 删除关系
   */
  public deleteRelationship(sourceId: string, targetId: string): void {
    this.currentData.relationships = this.currentData.relationships.filter(
      (r) =>
        !((typeof r.source === 'string' ? r.source : r.source.id) === sourceId &&
          (typeof r.target === 'string' ? r.target : r.target.id) === targetId)
    );

    this.saveToHistory(`deleteRelationship`);
    this.notify();
  }

  /**
   * 撤销
   */
  public undo(): boolean {
    if (!this.canUndo()) return false;

    this.historyIndex--;
    this.currentData = this.deepClone(this.history[this.historyIndex].data);
    this.notify();

    if (this.config.autoSave) {
      this.saveToStorage();
    }

    return true;
  }

  /**
   * 重做
   */
  public redo(): boolean {
    if (!this.canRedo()) return false;

    this.historyIndex++;
    this.currentData = this.deepClone(this.history[this.historyIndex].data);
    this.notify();

    if (this.config.autoSave) {
      this.saveToStorage();
    }

    return true;
  }

  /**
   * 是否可以撤销
   */
  public canUndo(): boolean {
    return this.historyIndex > 0;
  }

  /**
   * 是否可以重做
   */
  public canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  /**
   * 获取历史记录信息
   */
  public getHistoryInfo(): {
    current: number;
    total: number;
    canUndo: boolean;
    canRedo: boolean;
  } {
    return {
      current: this.historyIndex,
      total: this.history.length,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
    };
  }

  /**
   * 清空历史记录
   */
  public clearHistory(): void {
    this.history = [
      {
        data: this.deepClone(this.currentData),
        timestamp: Date.now(),
        action: 'clearHistory',
      },
    ];
    this.historyIndex = 0;
  }

  /**
   * 清空所有数据
   */
  public clear(): void {
    this.currentData = {
      entities: [],
      relationships: [],
    };
    this.nextEntityId = 1;
    this.nextFieldId = 1;
    this.saveToHistory('clear');
    this.notify();
  }

  /**
   * 导出数据
   */
  public exportData(): string {
    return JSON.stringify(this.currentData, null, 2);
  }

  /**
   * 导入数据
   */
  public importData(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.entities && Array.isArray(data.entities)) {
        this.setData(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * 销毁管理器
   */
  public destroy(): void {
    this.listeners.clear();
    if (this.config.autoSave) {
      this.saveToStorage();
    }
  }
}
