/**
 * 查询设计器页面组件类
 */

import React, { Component } from 'react';
import { Graph } from '../components/query/graph';
import type { GraphData } from '../types/graph';

export interface QueryDesignerComponentProps {
  // 可以在这里添加props
}

interface QueryDesignerComponentState {
  graphData: GraphData;
}

/**
 * 查询设计器页面组件类
 */
export class QueryDesignerComponent extends Component<QueryDesignerComponentProps, QueryDesignerComponentState> {
  constructor(props: QueryDesignerComponentProps) {
    super(props);
    this.state = {
      graphData: {
        nodes: [
          { id: '1', label: 'Entity A', type: 'entity' },
          { id: '2', label: 'Entity B', type: 'entity' },
          { id: '3', label: 'Entity C', type: 'entity' },
        ],
        edges: [
          { source: '1', target: '2', label: 'has' },
          { source: '2', target: '3', label: 'belongs to' },
        ],
      },
    };
  }

  /**
   * 组件挂载
   */
  public componentDidMount(): void {
    // 可以在这里添加挂载后的逻辑
  }

  /**
   * 组件卸载
   */
  public componentWillUnmount(): void {
    // 可以在这里添加清理逻辑
  }

  /**
   * 更新图数据
   */
  public updateGraphData(data: GraphData): void {
    this.setState({ graphData: data });
  }

  /**
   * 渲染方法
   */
  public render(): React.ReactNode {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <h2 style={{ margin: '0 0 1rem 0', padding: '0 1rem' }}>Query Designer</h2>
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <Graph
            data={this.state.graphData}
            config={{
              autoResize: true,
              enableZoom: true,
              enablePan: true,
              enableDrag: true,
            }}
            onNodeClick={(node) => {
              console.log('Node clicked:', node);
            }}
          />
        </div>
      </div>
    );
  }
}
