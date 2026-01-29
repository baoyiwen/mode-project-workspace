/**
 * Graph组件使用示例
 */

import React from 'react';
import Graph from './Graph';
import type { GraphData } from '../../../types/graph';
import type { GraphComponentConfig } from './GraphComponent';

const ExampleGraph: React.FC = () => {
  // 示例数据
  const graphData: GraphData = {
    nodes: [
      { id: '1', label: 'Node 1', type: 'entity' },
      { id: '2', label: 'Node 2', type: 'entity' },
      { id: '3', label: 'Node 3', type: 'entity' },
      { id: '4', label: 'Node 4', type: 'entity' },
      { id: '5', label: 'Node 5', type: 'entity' },
    ],
    edges: [
      { source: '1', target: '2', label: 'has' },
      { source: '2', target: '3', label: 'belongs to' },
      { source: '3', target: '4', label: 'contains' },
      { source: '4', target: '5', label: 'references' },
      { source: '1', target: '5', label: 'relates' },
    ],
  };

  // 配置选项
  const config: Partial<GraphComponentConfig> = {
    width: 800,
    height: 600,
    nodeRadius: 10,
    linkDistance: 150,
    chargeStrength: -400,
    enableZoom: true,
    enablePan: true,
    enableDrag: true,
    nodeColor: (node) => {
      // 根据节点类型设置颜色
      const colors: Record<string, string> = {
        entity: '#69b3a2',
        relation: '#ff6b6b',
        default: '#95a5a6',
      };
      return colors[node.type || 'default'] || colors.default;
    },
    linkColor: '#999',
    nodeLabel: (node) => node.label || node.id,
    linkLabel: (link) => link.label || '',
  };

  const handleNodeClick = (node: typeof graphData.nodes[0]) => {
    console.log('Node clicked:', node);
  };

  const handleNodeDoubleClick = (node: typeof graphData.nodes[0]) => {
    console.log('Node double clicked:', node);
  };

  const handleLinkClick = (link: typeof graphData.edges[0]) => {
    console.log('Link clicked:', link);
  };

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <Graph
        data={graphData}
        config={config}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onLinkClick={handleLinkClick}
      />
    </div>
  );
};

export default ExampleGraph;
