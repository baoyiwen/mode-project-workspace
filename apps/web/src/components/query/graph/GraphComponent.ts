/**
 * Graph组件类
 * 使用d3.js渲染力导向图
 */

import * as d3 from 'd3';
import { SVGComponent, type SVGConfig } from '../../base/SVGComponent';
import type { GraphData, GraphNode, GraphEdge } from '../../../types/graph';

export interface GraphComponentConfig extends SVGConfig {
  nodeRadius?: number;
  linkDistance?: number;
  chargeStrength?: number;
  enableDrag?: boolean;
  nodeColor?: string | ((node: GraphNode) => string);
  linkColor?: string | ((link: GraphEdge) => string);
  nodeLabel?: (node: GraphNode) => string;
  linkLabel?: (link: GraphEdge) => string;
}

export interface GraphComponentEvents {
  onNodeClick?: (node: GraphNode) => void;
  onNodeDoubleClick?: (node: GraphNode) => void;
  onLinkClick?: (link: GraphEdge) => void;
}

/**
 * Graph组件类
 * 继承自SVGComponent
 */
export class GraphComponent extends SVGComponent<GraphComponentConfig> {
  private data: GraphData = { nodes: [], edges: [] };
  private simulation: d3.Simulation<GraphNode, GraphEdge> | null = null;
  private events: GraphComponentEvents = {};

  constructor(config: GraphComponentConfig, data: GraphData) {
    super(config);
    this.data = { ...data };
  }

  /**
   * 设置图数据
   */
  public setData(data: GraphData): void {
    this.data = { ...data };
    if (this.isMounted) {
      this.renderSVG();
    }
  }

  /**
   * 获取图数据
   */
  public getData(): GraphData {
    return { ...this.data };
  }

  /**
   * 设置事件回调
   */
  public setEvents(events: GraphComponentEvents): void {
    this.events = { ...this.events, ...events };
  }

  /**
   * 渲染SVG内容
   */
  protected renderSVG(): void {
    if (!this.g || !this.data.nodes.length) {
      // 如果没有数据，确保simulation已停止
      if (this.simulation) {
        this.simulation.stop();
        this.simulation = null;
      }
      return;
    }

    // 如果simulation已存在且数据未变化，只更新中心点
    if (this.simulation && this.simulation.nodes().length === this.data.nodes.length) {
      // 只更新force center，不重新创建整个图形
      this.simulation.force('center', d3.forceCenter(this.currentSize.width / 2, this.currentSize.height / 2));
      return;
    }

    // 清除之前的内容
    this.g.selectAll('*').remove();

    // 停止旧的模拟
    if (this.simulation) {
      this.simulation.stop();
    }

    const {
      nodeRadius = 8,
      linkDistance = 100,
      chargeStrength = -300,
      enableDrag = true,
      nodeColor = '#69b3a2',
      linkColor = '#999',
      nodeLabel = (node: GraphNode) => node.label || node.id,
      linkLabel = (link: GraphEdge) => link.label || '',
    } = this.config;

    // 创建力导向模拟
    this.simulation = d3
      .forceSimulation<GraphNode>(this.data.nodes)
      .force(
        'link',
        d3
          .forceLink<GraphNode, GraphEdge>(this.data.edges)
          .id((d) => d.id)
          .distance(linkDistance)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('center', d3.forceCenter(this.currentSize.width / 2, this.currentSize.height / 2))
      .force('collision', d3.forceCollide().radius(nodeRadius + 2));

    // 创建箭头标记
    this.createArrowMarker();

    // 创建边
    const link = this.createLinks(linkColor, linkLabel);

    // 创建节点
    const node = this.createNodes(nodeRadius, nodeColor, nodeLabel, enableDrag);

    // 创建标签
    this.createLabels(nodeLabel, linkLabel);

    // 更新位置
    this.simulation.on('tick', () => {
      this.updatePositions(link);
    });
  }

  /**
   * 创建箭头标记
   */
  private createArrowMarker(): void {
    if (!this.svg) return;

    const defs = this.svg.select('defs').empty()
      ? this.svg.append('defs')
      : this.svg.select('defs');

    const marker = defs.select('marker#arrowhead').empty()
      ? defs.append('marker')
      : defs.select('marker#arrowhead');

    (marker as d3.Selection<SVGMarkerElement, unknown, null, undefined>)
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', (this.config.nodeRadius ?? 8) + 5)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto');

    const path = marker.select('path').empty()
      ? marker.append('path')
      : marker.select('path');

    (path as d3.Selection<SVGPathElement, unknown, null, undefined>)
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', typeof this.config.linkColor === 'string' ? this.config.linkColor : '#999');
  }

  /**
   * 创建边
   */
  private createLinks(
    linkColor: string | ((link: GraphEdge) => string),
    linkLabel: (link: GraphEdge) => string
  ): d3.Selection<SVGLineElement, GraphEdge, SVGGElement, unknown> {
    if (!this.g) throw new Error('SVG group not initialized');

    const link = this.g
      .append('g')
      .attr('class', 'links')
      .selectAll<SVGLineElement, GraphEdge>('line')
      .data(this.data.edges)
      .enter()
      .append('line')
      .attr('stroke', typeof linkColor === 'function' ? (d) => linkColor(d) : linkColor)
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        this.events.onLinkClick?.(d);
      });

    // 创建边标签
    const linkLabels = this.g
      .append('g')
      .attr('class', 'link-labels')
      .selectAll<SVGTextElement, GraphEdge>('text')
      .data(this.data.edges.filter((d) => linkLabel(d)))
      .enter()
      .append('text')
      .attr('class', 'link-label')
      .text((d) => linkLabel(d))
      .style('font-size', '12px')
      .style('fill', '#666')
      .style('pointer-events', 'none');

    return link;
  }

  /**
   * 创建节点
   */
  private createNodes(
    nodeRadius: number,
    nodeColor: string | ((node: GraphNode) => string),
    nodeLabel: (node: GraphNode) => string,
    enableDrag: boolean
  ): d3.Selection<SVGCircleElement, GraphNode, SVGGElement, unknown> {
    if (!this.g) throw new Error('SVG group not initialized');

    const node = this.g
      .append('g')
      .attr('class', 'nodes')
      .selectAll<SVGCircleElement, GraphNode>('circle')
      .data(this.data.nodes)
      .enter()
      .append('circle')
      .attr('r', nodeRadius)
      .attr('fill', typeof nodeColor === 'function' ? (d) => nodeColor(d) : nodeColor)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        this.events.onNodeClick?.(d);
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation();
        this.events.onNodeDoubleClick?.(d);
      });

    // 启用节点拖拽
    if (enableDrag && this.simulation) {
      const dragHandler = d3
        .drag<SVGCircleElement, GraphNode>()
        .on('start', (event, d) => {
          if (!event.active && this.simulation) {
            this.simulation.alphaTarget(0.3).restart();
          }
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active && this.simulation) {
            this.simulation.alphaTarget(0);
          }
          d.fx = null;
          d.fy = null;
        });

      node.call(dragHandler);
    }

    return node;
  }

  /**
   * 创建标签
   */
  private createLabels(
    nodeLabel: (node: GraphNode) => string,
    linkLabel: (link: GraphEdge) => string
  ): void {
    if (!this.g) return;

    const nodeRadius = this.config.nodeRadius || 8;

    // 创建节点标签
    this.g
      .append('g')
      .attr('class', 'node-labels')
      .selectAll<SVGTextElement, GraphNode>('text')
      .data(this.data.nodes)
      .enter()
      .append('text')
      .attr('class', 'node-label')
      .text((d) => nodeLabel(d))
      .style('font-size', '12px')
      .style('fill', '#333')
      .style('pointer-events', 'none')
      .attr('dx', nodeRadius + 5)
      .attr('dy', 4);
  }

  /**
   * 更新位置
   */
  private updatePositions(link: d3.Selection<SVGLineElement, GraphEdge, SVGGElement, unknown>): void {
    if (!this.g || !this.simulation) return;

    // 更新边的位置
    link
      .attr('x1', (d) => (d.source as GraphNode).x!)
      .attr('y1', (d) => (d.source as GraphNode).y!)
      .attr('x2', (d) => (d.target as GraphNode).x!)
      .attr('y2', (d) => (d.target as GraphNode).y!);

    // 更新边标签位置
    this.g
      .selectAll<SVGTextElement, GraphEdge>('.link-label')
      .attr('x', (d) => {
        const source = d.source as GraphNode;
        const target = d.target as GraphNode;
        return (source.x! + target.x!) / 2;
      })
      .attr('y', (d) => {
        const source = d.source as GraphNode;
        const target = d.target as GraphNode;
        return (source.y! + target.y!) / 2;
      });

    // 更新节点位置
    this.g
      .selectAll<SVGCircleElement, GraphNode>('.nodes circle')
      .attr('cx', (d) => d.x!)
      .attr('cy', (d) => d.y!);

    // 更新节点标签位置
    this.g
      .selectAll<SVGTextElement, GraphNode>('.node-label')
      .attr('x', (d) => d.x!)
      .attr('y', (d) => d.y!);
  }

  /**
   * 清理资源
   */
  protected cleanup(): void {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
    super.cleanup();
  }
}
