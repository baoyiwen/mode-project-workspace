/**
 * 模型设计器页面组件类
 */

import React, { Component } from 'react';
import { ModelDesignerGraph } from '../components/model/ModelDesignerGraph';
import type { Entity, ModelData, EntityField } from '../components/model/ModelDesignerGraphComponent';
import type { AppMode } from '../types/modes';
import { ModelDataManager } from '../managers/ModelDataManager';
import { t, i18n, LOCALE_CONFIGS, type Locale } from '../i18n';
import { appEventActor } from '../state/appEventCenter';
import './ModelDesigner.css';

export interface ModelDesignerComponentProps {
  currentMode: AppMode;
  onModeChange: (mode: AppMode) => void;
}

interface ModelDesignerComponentState {
  modelData: ModelData;
  selectedEntityId: string | null;
  canUndo: boolean;
  canRedo: boolean;
  activePanel: 'properties' | 'hierarchy' | 'settings' | null;
  locale: string; // 用于触发重新渲染
}

/**
 * 模型设计器页面组件类
 */
export class ModelDesignerComponent extends Component<ModelDesignerComponentProps, ModelDesignerComponentState> {
  private dataManager: ModelDataManager;
  private unsubscribe?: () => void;
  private unsubscribeI18n?: () => void;
  private appEventSub?: { unsubscribe: () => void };
  private lastCommandNonce = 0;

  constructor(props: ModelDesignerComponentProps) {
    super(props);
    
    // 初始化数据管理器
    this.dataManager = new ModelDataManager({
      maxHistorySize: 50,
      autoSave: true,
      storageKey: 'model-designer-data',
    });

    this.state = {
      modelData: this.dataManager.getData(),
      selectedEntityId: null,
      canUndo: this.dataManager.canUndo(),
      canRedo: this.dataManager.canRedo(),
      activePanel: null,
      locale: i18n.getLocale(),
    };
  }

  /**
   * 组件挂载
   */
  public componentDidMount(): void {
    // 订阅数据变化
    this.unsubscribe = this.dataManager.subscribe((data) => {
      this.setState({
        modelData: data,
        canUndo: this.dataManager.canUndo(),
        canRedo: this.dataManager.canRedo(),
      });
    });

    // 订阅语言变化
    this.unsubscribeI18n = i18n.subscribe((locale) => {
      this.setState({ locale });
    });

    // 订阅应用事件中心
    const snapshot = appEventActor.getSnapshot();
    this.lastCommandNonce = snapshot.context.commandNonce;
    this.appEventSub = appEventActor.subscribe((state) => {
      const { commandNonce, lastCommand } = state.context;
      if (commandNonce === this.lastCommandNonce || !lastCommand) return;
      this.lastCommandNonce = commandNonce;
      switch (lastCommand) {
        case 'undo':
          this.handleUndo();
          break;
        case 'redo':
          this.handleRedo();
          break;
        case 'save':
          this.handleSave();
          break;
        case 'export':
          this.handleExport();
          break;
        default:
          break;
      }
    });
  }

  /**
   * 组件卸载
   */
  public componentWillUnmount(): void {
    // 取消订阅数据变化
    if (this.unsubscribe) {
      this.unsubscribe();
    }
    
    // 取消订阅语言变化
    if (this.unsubscribeI18n) {
      this.unsubscribeI18n();
    }
    this.appEventSub?.unsubscribe();
    
    // 销毁管理器
    this.dataManager.destroy();
  }

  /**
   * 添加新实体
   */
  private handleAddEntity = (x?: number, y?: number): void => {
    const newEntity = this.dataManager.addEntity({
      fields: [
        {
          id: `field-1`,
          name: 'id',
          type: 'uuid',
          required: true,
        },
      ],
      x: x || this.state.modelData.entities.length * 250 + 100,
      y: y || 200,
    });

    this.setState({ selectedEntityId: newEntity.id, activePanel: 'properties' });
  };

  /**
   * 处理画布点击（由 Graph 组件触发，点击空白处）
   */
  private handleCanvasClick = (x: number, y: number): void => {
    const { currentMode } = this.props;
    
    // 根据模式执行不同操作
    switch (currentMode) {
      case 'create':
        // 创建模式：在点击位置创建新实体
        this.handleAddEntity(x, y);
        break;
      case 'select':
        // 选择模式：取消选择并收起属性面板
        this.setState({ selectedEntityId: null, activePanel: null });
        break;
      default:
        // 其他模式点击空白处也取消选择并收起属性面板
        this.setState({ selectedEntityId: null, activePanel: null });
        break;
    }
  };

  /**
   * 处理实体点击
   */
  private handleEntityClick = (entity: Entity): void => {
    const { currentMode } = this.props;
    
    // 根据模式执行不同操作
    switch (currentMode) {
      case 'select':
        // 选择模式：选中实体
        this.handleSelectEntity(entity.id);
        break;
      case 'delete':
        // 删除模式：删除实体
        this.handleDeleteEntity(entity.id);
        break;
      case 'copy':
        // 复制模式：复制实体
        this.handleCopyEntity(entity);
        break;
      default:
        // 默认选中
        this.handleSelectEntity(entity.id);
        break;
    }
  };

  /**
   * 处理复制实体
   */
  private handleCopyEntity = (entity: Entity): void => {
    const newEntity = this.dataManager.copyEntity(entity.id, 50, 50);
    if (newEntity) {
      this.setState({ selectedEntityId: newEntity.id, activePanel: 'properties' });
    }
  };

  /**
   * 选择实体
   */
  private handleSelectEntity = (entityId: string): void => {
    this.setState({ 
      selectedEntityId: entityId,
      activePanel: 'properties', // 选中实体时自动打开属性面板
    });
  };

  /**
   * 切换面板
   */
  private handleTogglePanel = (panel: 'properties' | 'hierarchy' | 'settings'): void => {
    this.setState((prevState) => ({
      activePanel: prevState.activePanel === panel ? null : panel,
    }));
  };

  /**
   * 关闭面板
   */
  private handleClosePanel = (): void => {
    this.setState({ activePanel: null });
  };

  /**
   * 删除实体
   */
  private handleDeleteEntity = (entityId: string): void => {
    this.dataManager.deleteEntity(entityId);
    if (this.state.selectedEntityId === entityId) {
      this.setState({ selectedEntityId: null });
    }
  };

  /**
   * 添加字段
   */
  private handleAddField = (): void => {
    if (!this.state.selectedEntityId) return;

    const entity = this.getSelectedEntity();
    this.dataManager.addFieldToEntity(this.state.selectedEntityId, {
      name: `field${entity?.fields.length || 0}`,
      type: 'string',
      required: false,
    });
  };

  /**
   * 删除字段
   */
  private handleDeleteField = (fieldId: string): void => {
    if (!this.state.selectedEntityId) return;
    this.dataManager.deleteEntityField(this.state.selectedEntityId, fieldId);
  };

  /**
   * 更新字段
   */
  private handleUpdateField = (fieldId: string, key: keyof EntityField, value: any): void => {
    if (!this.state.selectedEntityId) return;
    this.dataManager.updateEntityField(this.state.selectedEntityId, fieldId, { [key]: value });
  };

  /**
   * 更新实体描述
   */
  private handleUpdateEntityDescription = (description: string): void => {
    if (!this.state.selectedEntityId) return;
    this.dataManager.updateEntity(this.state.selectedEntityId, { description });
  };

  /**
   * 更新实体颜色
   */
  private handleUpdateEntityColor = (color: string): void => {
    if (!this.state.selectedEntityId) return;
    this.dataManager.updateEntity(this.state.selectedEntityId, { color });
  };

  /**
   * 更新实体（拖拽结束时保存位置，或保存其他属性如颜色）
   */
  private handleEntityUpdate = (updatedEntity: Entity): void => {
    // 更新实体的所有可能变化的属性
    this.dataManager.updateEntity(updatedEntity.id, {
      x: updatedEntity.x,
      y: updatedEntity.y,
      fx: updatedEntity.fx,
      fy: updatedEntity.fy,
      color: updatedEntity.color, // 保存颜色
    }, true);
  };

  /**
   * 更新实体名称
   */
  private handleUpdateEntityName = (name: string): void => {
    if (!this.state.selectedEntityId) return;
    this.dataManager.updateEntity(this.state.selectedEntityId, { name });
  };

  /**
   * 撤销
   */
  private handleUndo = (): void => {
    if (this.dataManager.canUndo()) {
      this.dataManager.undo();
    }
  };

  /**
   * 重做
   */
  private handleRedo = (): void => {
    if (this.dataManager.canRedo()) {
      this.dataManager.redo();
    }
  };

  /**
   * 保存
   */
  private handleSave = (): void => {
    const data = this.dataManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `model-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * 导出
   */
  private handleExport = (): void => {
    this.handleSave();
  };

  /**
   * 获取选中的实体
   */
  private getSelectedEntity = (): Entity | undefined => {
    return this.state.modelData.entities.find((e) => e.id === this.state.selectedEntityId);
  };

  /**
   * 渲染属性面板内容
   * 区分实体属性（Metadata）和实体字段（Fields）
   */
  private renderPropertiesPanel(): React.ReactNode {
    const selectedEntity = this.getSelectedEntity();

    if (!selectedEntity) {
      return (
        <div className="panel-empty">
          <div className="panel-empty-icon">📝</div>
          <div className="panel-empty-text">{t('modelDesigner.entity.selectEntity')}</div>
        </div>
      );
    }

    return (
      <div className="panel-content">
        {/* ========== 实体属性 (Metadata) ========== */}
        <div className="property-section">
          <div className="property-section-header">
            <span className="property-section-title">{t('modelDesigner.entity.metadata')}</span>
          </div>

          {/* 实体名称 */}
          <div className="property-group">
            <label className="property-label">{t('modelDesigner.entity.name')}</label>
            <input
              type="text"
              className="property-input"
              value={selectedEntity.name}
              onChange={(e) => this.handleUpdateEntityName(e.target.value)}
            />
          </div>

          {/* 实体描述 */}
          <div className="property-group">
            <label className="property-label">{t('modelDesigner.entity.description')}</label>
            <textarea
              className="property-input property-textarea"
              value={selectedEntity.description || ''}
              onChange={(e) => this.handleUpdateEntityDescription(e.target.value)}
              placeholder={t('modelDesigner.entity.description')}
              rows={3}
            />
          </div>

          {/* 实体颜色 */}
          <div className="property-group">
            <label className="property-label">{t('modelDesigner.entity.color')}</label>
            <div className="color-picker-row">
              <input
                type="color"
                className="color-picker"
                value={selectedEntity.color || '#667eea'}
                onChange={(e) => this.handleUpdateEntityColor(e.target.value)}
              />
              <input
                type="text"
                className="property-input color-input"
                value={selectedEntity.color || '#667eea'}
                onChange={(e) => this.handleUpdateEntityColor(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ========== 实体字段 (Fields) ========== */}
        <div className="property-section">
          <div className="property-section-header">
            <span className="property-section-title">{t('modelDesigner.entity.fields')}</span>
            <button className="property-add-button" onClick={this.handleAddField} title={t('common.add')}>
              +
            </button>
          </div>
          
          <div className="fields-list">
            {selectedEntity.fields && selectedEntity.fields.length > 0 ? (
              selectedEntity.fields.map((field) => (
                <div key={field.id} className="field-item">
                  <div className="field-item-header">
                    <input
                      type="text"
                      className="field-name"
                      value={field.name}
                      onChange={(e) => this.handleUpdateField(field.id, 'name', e.target.value)}
                      placeholder={t('modelDesigner.entity.fieldName')}
                    />
                    <button
                      className="field-delete"
                      onClick={() => this.handleDeleteField(field.id)}
                      title={t('common.delete')}
                    >
                      ×
                    </button>
                  </div>
                  <div className="field-item-body">
                    <select
                      className="field-type"
                      value={field.type}
                      onChange={(e) => this.handleUpdateField(field.id, 'type', e.target.value)}
                    >
                      <option value="string">{t('modelDesigner.fieldTypes.string')}</option>
                      <option value="number">{t('modelDesigner.fieldTypes.number')}</option>
                      <option value="boolean">{t('modelDesigner.fieldTypes.boolean')}</option>
                      <option value="date">{t('modelDesigner.fieldTypes.date')}</option>
                      <option value="text">{t('modelDesigner.fieldTypes.text')}</option>
                      <option value="integer">{t('modelDesigner.fieldTypes.integer')}</option>
                      <option value="float">{t('modelDesigner.fieldTypes.float')}</option>
                      <option value="uuid">{t('modelDesigner.fieldTypes.uuid')}</option>
                    </select>
                    <label className="field-required">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => this.handleUpdateField(field.id, 'required', e.target.checked)}
                      />
                      <span>{t('modelDesigner.entity.fieldRequired')}</span>
                    </label>
                  </div>
                </div>
              ))
            ) : (
              <div className="fields-empty">
                <span>{t('modelDesigner.entity.noFields')}</span>
                <button className="fields-empty-add" onClick={this.handleAddField}>
                  {t('modelDesigner.entity.addFirstField')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /**
   * 渲染层级面板内容
   */
  private renderHierarchyPanel(): React.ReactNode {
    const { modelData } = this.state;

    return (
      <div className="panel-content">
        <div className="hierarchy-list">
          {modelData.entities.map((entity) => (
            <div
              key={entity.id}
              className={`hierarchy-item ${entity.id === this.state.selectedEntityId ? 'active' : ''}`}
              onClick={() => this.handleSelectEntity(entity.id)}
            >
              <span 
                className="hierarchy-item-color" 
                style={{ backgroundColor: entity.color || '#667eea' }}
              />
              <span className="hierarchy-item-name">{entity.name}</span>
            </div>
          ))}
          {modelData.entities.length === 0 && (
            <div className="panel-empty-text" style={{ padding: '1rem', textAlign: 'center' }}>
              {t('modelDesigner.hierarchy.empty')}
            </div>
          )}
        </div>
      </div>
    );
  }

  /**
   * 渲染设置面板内容
   */
  private renderSettingsPanel(): React.ReactNode {
    const currentLocale = i18n.getLocale();
    const availableLocales = i18n.getAvailableLocales();

    return (
      <div className="panel-content">
        <div className="property-section">
          <div className="property-section-header">
            <span className="property-section-title">{t('settings.title')}</span>
          </div>

          {/* 语言设置 */}
          <div className="property-group">
            <label className="property-label">{t('settings.language')}</label>
            <select
              className="property-input"
              value={currentLocale}
              onChange={(e) => i18n.setLocale(e.target.value as Locale)}
            >
              {availableLocales.map((locale) => (
                <option key={locale} value={locale}>
                  {LOCALE_CONFIGS[locale].nativeLabel}
                </option>
              ))}
            </select>
          </div>

          {/* 主题设置（即将推出） */}
          <div className="property-group">
            <label className="property-label">{t('settings.theme')}</label>
            <div className="panel-empty-text" style={{ padding: '0.5rem 0', fontSize: '0.8125rem' }}>
              {t('settings.comingSoon')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * 渲染方法
   */
  public render(): React.ReactNode {
    const { activePanel } = this.state;
    const isPanelOpen = activePanel !== null;

    return (
      <div className="model-designer">
        {/* 主内容区 */}
        <div className="model-designer-content">
          {/* 画布区域 - SVG Graph */}
          <div className="model-designer-canvas">
            {this.state.modelData.entities.length === 0 && (
              <div className="model-designer-empty">
                <div className="model-designer-empty-icon">🎨</div>
                <div className="model-designer-empty-text">
                  <p>{t('modelDesigner.emptyTitle')}</p>
                  <p style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                    {t('modelDesigner.emptyDescription')}
                  </p>
                </div>
              </div>
            )}
            <ModelDesignerGraph
              data={this.state.modelData}
              currentMode={this.props.currentMode}
              selectedEntityId={this.state.selectedEntityId}
              onEntityClick={this.handleEntityClick}
              onEntityUpdate={this.handleEntityUpdate}
              onCanvasClick={this.handleCanvasClick}
              config={{
                autoResize: true,
                enableZoom: true,
                enablePan: true,
                enableDrag: true,
              }}
            />
          </div>

          {/* 右侧工作栏 */}
          <div className={`workbench ${isPanelOpen ? 'open' : ''}`}>
            {/* 工作栏标签 */}
            <div className="workbench-tabs">
              <button
                className={`workbench-tab ${activePanel === 'hierarchy' ? 'active' : ''}`}
                onClick={() => this.handleTogglePanel('hierarchy')}
                title={t('modelDesigner.workbench.hierarchy')}
              >
                📑
              </button>
              <button
                className={`workbench-tab ${activePanel === 'properties' ? 'active' : ''}`}
                onClick={() => this.handleTogglePanel('properties')}
                title={t('modelDesigner.workbench.properties')}
              >
                ⚙️
              </button>
              <button
                className={`workbench-tab ${activePanel === 'settings' ? 'active' : ''}`}
                onClick={() => this.handleTogglePanel('settings')}
                title={t('modelDesigner.workbench.settings')}
              >
                🔧
              </button>
            </div>

            {/* 工作栏面板 */}
            {isPanelOpen && (
              <div className="workbench-panel">
                <div className="workbench-panel-header">
                  <h3 className="workbench-panel-title">
                    {activePanel === 'properties' && t('modelDesigner.workbench.properties')}
                    {activePanel === 'hierarchy' && t('modelDesigner.workbench.hierarchy')}
                    {activePanel === 'settings' && t('modelDesigner.workbench.settings')}
                  </h3>
                  <button className="workbench-panel-close" onClick={this.handleClosePanel}>
                    ×
                  </button>
                </div>
                <div className="workbench-panel-content">
                  {activePanel === 'properties' && this.renderPropertiesPanel()}
                  {activePanel === 'hierarchy' && this.renderHierarchyPanel()}
                  {activePanel === 'settings' && this.renderSettingsPanel()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
