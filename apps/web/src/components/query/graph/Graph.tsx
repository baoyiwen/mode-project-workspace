/**
 * Graph组件（React包装器）
 * 使用GraphComponent类组件
 */

import React, { useEffect, useRef } from 'react';
import { GraphComponent, type GraphComponentConfig } from './GraphComponent';
import type { GraphData, GraphNode, GraphEdge } from '../../../types/graph';
import './Graph.css';

export interface GraphProps {
  data: GraphData;
  config?: Partial<GraphComponentConfig>;
  onNodeClick?: (node: GraphNode) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphEdge) => void;
  className?: string;
}

const Graph: React.FC<GraphProps> = ({
  data,
  config = {},
  onNodeClick,
  onNodeDoubleClick,
  onLinkClick,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphComponentRef = useRef<GraphComponent | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 如果已经存在实例，先清理
    if (graphComponentRef.current) {
      graphComponentRef.current.destroy();
      graphComponentRef.current = null;
    }

    // 获取容器尺寸，使用requestAnimationFrame确保DOM已渲染
    const initComponent = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      // 如果容器尺寸为0，使用默认值，autoResize会自动调整
      const containerWidth = rect.width > 0 ? rect.width : (config.width || 800);
      const containerHeight = rect.height > 0 ? rect.height : (config.height || 600);

      // 创建GraphComponent实例
      const defaultConfig: GraphComponentConfig = {
        width: containerWidth,
        height: containerHeight,
        autoResize: config.autoResize !== false,
        enableZoom: config.enableZoom !== false,
        enablePan: config.enablePan !== false,
        nodeRadius: config.nodeRadius || 8,
        linkDistance: config.linkDistance || 100,
        chargeStrength: config.chargeStrength || -300,
        enableDrag: config.enableDrag !== false,
        nodeColor: config.nodeColor || '#69b3a2',
        linkColor: config.linkColor || '#999',
        nodeLabel: config.nodeLabel || ((node: GraphNode) => node.label || node.id),
        linkLabel: config.linkLabel || ((link: GraphEdge) => link.label || ''),
        ...config,
      };

      const graphComponent = new GraphComponent(defaultConfig, data);
      graphComponent.setContainer(containerRef.current);
      graphComponent.setEvents({
        onNodeClick,
        onNodeDoubleClick,
        onLinkClick,
      });

      graphComponentRef.current = graphComponent;
    };

    // 使用requestAnimationFrame确保DOM已渲染
    requestAnimationFrame(initComponent);

    // 清理函数
    return () => {
      if (graphComponentRef.current) {
        graphComponentRef.current.destroy();
        graphComponentRef.current = null;
      }
    };
  }, []); // 只在挂载时创建

  // 更新数据和配置
  useEffect(() => {
    if (graphComponentRef.current) {
      graphComponentRef.current.setData(data);
    }
  }, [data]);

  useEffect(() => {
    if (graphComponentRef.current && config) {
      graphComponentRef.current.updateConfig(config);
    }
  }, [config]);

  // 更新事件回调
  useEffect(() => {
    if (graphComponentRef.current) {
      graphComponentRef.current.setEvents({
        onNodeClick,
        onNodeDoubleClick,
        onLinkClick,
      });
    }
  }, [onNodeClick, onNodeDoubleClick, onLinkClick]);

  return <div ref={containerRef} className={`graph-container ${className}`} />;
};

export default Graph;
