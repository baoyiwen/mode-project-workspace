/**
 * Model Designer Graph组件（React包装器）
 * 使用ModelDesignerGraphComponent类组件
 */

import React, { useEffect, useRef } from 'react';
import {
  ModelDesignerGraphComponent,
  type ModelDesignerGraphConfig,
  type ModelData,
  type Entity,
  type Relationship,
  type ModelDesignerGraphEvents,
} from './ModelDesignerGraphComponent';
import './ModelDesignerGraph.css';

export interface ModelDesignerGraphProps {
  data: ModelData;
  config?: Partial<ModelDesignerGraphConfig>;
  currentMode?: string;
  selectedEntityId?: string | null;
  onEntityClick?: (entity: Entity) => void;
  onEntityDoubleClick?: (entity: Entity) => void;
  onRelationshipClick?: (relationship: Relationship) => void;
  onEntityUpdate?: (entity: Entity) => void;
  onCanvasClick?: (x: number, y: number) => void;
  className?: string;
}

const ModelDesignerGraph: React.FC<ModelDesignerGraphProps> = ({
  data,
  config = {},
  currentMode = 'select',
  selectedEntityId = null,
  onEntityClick,
  onEntityDoubleClick,
  onRelationshipClick,
  onEntityUpdate,
  onCanvasClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphComponentRef = useRef<ModelDesignerGraphComponent | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 如果已经存在实例，先清理
    if (graphComponentRef.current) {
      graphComponentRef.current.destroy();
      graphComponentRef.current = null;
    }

    // 使用requestAnimationFrame确保DOM已渲染
    const initComponent = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerWidth = rect.width > 0 ? rect.width : (config.width || 800);
      const containerHeight = rect.height > 0 ? rect.height : (config.height || 600);

      // 创建ModelDesignerGraphComponent实例
      const defaultConfig: ModelDesignerGraphConfig = {
        width: containerWidth,
        height: containerHeight,
        autoResize: config.autoResize !== false,
        enableZoom: config.enableZoom !== false,
        enablePan: config.enablePan !== false,
        entityWidth: config.entityWidth || 200,
        entityHeaderHeight: config.entityHeaderHeight || 40,
        attributeHeight: config.attributeHeight || 25,
        relationshipDistance: config.relationshipDistance || 300,
        chargeStrength: config.chargeStrength || -800,
        enableDrag: config.enableDrag !== false,
        currentMode: currentMode,
        ...config,
      };

      const graphComponent = new ModelDesignerGraphComponent(defaultConfig, data);
      graphComponent.setContainer(containerRef.current);
      graphComponent.setEvents({
        onEntityClick,
        onEntityDoubleClick,
        onRelationshipClick,
        onEntityUpdate,
        onCanvasClick,
      });

      graphComponentRef.current = graphComponent;
    };

    requestAnimationFrame(initComponent);

    // 清理函数
    return () => {
      if (graphComponentRef.current) {
        graphComponentRef.current.destroy();
        graphComponentRef.current = null;
      }
    };
  }, []); // 只在挂载时创建

  // 更新数据
  useEffect(() => {
    if (graphComponentRef.current) {
      graphComponentRef.current.setData(data);
    }
  }, [data]);

  // 更新配置
  useEffect(() => {
    if (graphComponentRef.current && config) {
      graphComponentRef.current.updateConfig(config);
    }
  }, [config]);

  // 更新事件回调
  useEffect(() => {
    if (graphComponentRef.current) {
      graphComponentRef.current.setEvents({
        onEntityClick,
        onEntityDoubleClick,
        onRelationshipClick,
        onEntityUpdate,
        onCanvasClick,
      });
    }
  }, [onEntityClick, onEntityDoubleClick, onRelationshipClick, onEntityUpdate, onCanvasClick]);

  // 更新选中状态
  useEffect(() => {
    if (graphComponentRef.current) {
      graphComponentRef.current.selectEntity(selectedEntityId);
    }
  }, [selectedEntityId]);

  // 更新模式
  useEffect(() => {
    if (graphComponentRef.current) {
      graphComponentRef.current.setMode(currentMode);
    }
  }, [currentMode]);

  return <div ref={containerRef} className={`model-designer-graph ${className}`} />;
};

export default ModelDesignerGraph;
export { ModelDesignerGraph };
