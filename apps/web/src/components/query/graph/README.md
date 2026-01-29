# 查询图组件目录

## 说明

此目录用于存放查询图相关的组件，使用d3.js实现图形可视化。

## 组件

- `Graph.tsx` - Graph组件（React包装器）
- `GraphComponent.ts` - GraphComponent类组件，继承自SVGComponent
- `Graph.css` - Graph组件样式
- `Graph.example.tsx` - Graph组件使用示例

## 架构说明

Graph组件采用class组件设计，继承链如下：

```
Component (基础组件)
  ↓
SizeComponent (尺寸组件 - resize功能)
  ↓
SVGComponent (SVG组件 - SVG操作)
  ↓
GraphComponent (Graph组件 - 具体实现)
```

### Component（基础组件）

提供所有组件的基础功能：
- 容器管理
- 生命周期管理
- 配置管理

### SizeComponent（尺寸组件）

继承自Component，添加resize功能：
- 自动resize监听（使用ResizeObserver）
- 尺寸管理
- 响应式布局

### SVGComponent（SVG组件）

继承自SizeComponent，添加SVG相关操作：
- SVG元素创建和管理
- 缩放和平移功能
- Zoom变换管理

### GraphComponent（Graph组件）

继承自SVGComponent，实现Graph功能：
- 力导向图布局
- 节点和边的渲染
- 交互事件处理

## Graph组件

基于d3.js的力导向图组件，支持节点和边的可视化。

### 功能特性

- ✅ 力导向图布局
- ✅ 节点拖拽
- ✅ 缩放和平移
- ✅ 节点和边的点击事件
- ✅ 自定义节点和边的样式
- ✅ 节点和边的标签显示
- ✅ 响应式布局

### 使用方法

```typescript
import { Graph } from '@/components/query/graph';
import type { GraphData } from '@/types/graph';

const graphData: GraphData = {
  nodes: [
    { id: '1', label: 'Node 1' },
    { id: '2', label: 'Node 2' },
  ],
  edges: [
    { source: '1', target: '2', label: 'relation' },
  ],
};

<Graph
  data={graphData}
  config={{
    width: 800,
    height: 600,
    enableZoom: true,
    enablePan: true,
    enableDrag: true,
  }}
  onNodeClick={(node) => console.log('Node clicked:', node)}
/>
```

### 配置选项

- `width`: 图形宽度（默认：800）
- `height`: 图形高度（默认：600）
- `nodeRadius`: 节点半径（默认：8）
- `linkDistance`: 边的长度（默认：100）
- `chargeStrength`: 节点之间的斥力强度（默认：-300）
- `enableZoom`: 是否启用缩放（默认：true）
- `enablePan`: 是否启用平移（默认：true）
- `enableDrag`: 是否启用节点拖拽（默认：true）
- `nodeColor`: 节点颜色（字符串或函数）
- `linkColor`: 边的颜色（字符串或函数）
- `nodeLabel`: 节点标签函数
- `linkLabel`: 边标签函数

### 事件回调

- `onNodeClick`: 节点点击事件
- `onNodeDoubleClick`: 节点双击事件
- `onLinkClick`: 边点击事件
