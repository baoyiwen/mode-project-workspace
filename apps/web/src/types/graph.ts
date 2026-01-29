/**
 * Graph类型定义
 */

/**
 * 图节点
 */
export interface GraphNode {
  id: string;
  label?: string;
  type?: string;
  x?: number;
  y?: number;
  [key: string]: any;
}

/**
 * 图边
 */
export interface GraphEdge {
  id?: string;
  source: string | GraphNode;
  target: string | GraphNode;
  label?: string;
  type?: string;
  [key: string]: any;
}

/**
 * 图数据
 */
export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Graph组件配置
 */
export interface GraphConfig {
  width?: number;
  height?: number;
  nodeRadius?: number;
  linkDistance?: number;
  chargeStrength?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  enableDrag?: boolean;
  nodeColor?: string | ((node: GraphNode) => string);
  linkColor?: string | ((link: GraphEdge) => string);
  nodeLabel?: (node: GraphNode) => string;
  linkLabel?: (link: GraphEdge) => string;
}
