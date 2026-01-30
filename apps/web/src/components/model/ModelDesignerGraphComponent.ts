/**
 * Model Designer Graph组件类
 * 使用d3.js渲染实体关系图
 */

import * as d3 from 'd3';
import { SVGComponent, type SVGConfig } from '../base/SVGComponent';

/**
 * 实体字段定义（类似数据库表的列）
 */
export interface EntityField {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description?: string;
}

/**
 * 实体定义（类似数据库表）
 * - 基本属性：id, name, description, color 等元数据
 * - 字段列表：fields 表示该实体能存储的数据字段
 */
export interface Entity {
  id: string;
  name: string;
  description?: string; // 实体描述
  color?: string; // 实体圆形的填充色
  fields: EntityField[]; // 实体字段（类似表的列）
  // 位置信息（内部使用）
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

/**
 * @deprecated 使用 EntityField 代替
 */
export type EntityAttribute = EntityField;

export interface Relationship {
  source: string | Entity;
  target: string | Entity;
  type: string;
  label?: string;
}

export interface ModelData {
  entities: Entity[];
  relationships: Relationship[];
}

export interface ModelDesignerGraphConfig extends SVGConfig {
  entityRadius?: number; // 实体圆形半径
  relationshipDistance?: number;
  chargeStrength?: number;
  enableDrag?: boolean;
  currentMode?: string; // 当前操作模式
  snapThreshold?: number; // 吸附阈值（像素）
  showGuides?: boolean; // 是否显示辅助线
  onEntityClick?: (entity: Entity) => void;
  onEntityDoubleClick?: (entity: Entity) => void;
  onRelationshipClick?: (relationship: Relationship) => void;
}

export interface ModelDesignerGraphEvents {
  onEntityClick?: (entity: Entity) => void;
  onEntityDoubleClick?: (entity: Entity) => void;
  onRelationshipClick?: (relationship: Relationship) => void;
  onEntityUpdate?: (entity: Entity) => void;
  onCanvasClick?: (x: number, y: number) => void; // 画布点击事件
}

/**
 * Model Designer Graph组件类
 * 继承自SVGComponent
 */
export class ModelDesignerGraphComponent extends SVGComponent<ModelDesignerGraphConfig> {
  private data: ModelData = { entities: [], relationships: [] };
  private simulation: d3.Simulation<Entity, Relationship> | null = null;
  private events: ModelDesignerGraphEvents = {};
  private selectedEntityId: string | null = null;
  private guidesGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;

  constructor(config: ModelDesignerGraphConfig, data: ModelData) {
    super(config);
    this.data = { ...data };
  }

  /**
   * 设置模型数据
   */
  public setData(data: ModelData): void {
    this.data = { ...data };
    if (this.isMounted) {
      this.renderSVG();
    }
  }

  /**
   * 获取模型数据
   */
  public getData(): ModelData {
    return { ...this.data };
  }

  /**
   * 设置事件回调
   */
  public setEvents(events: ModelDesignerGraphEvents): void {
    this.events = { ...this.events, ...events };
  }

  /**
   * 选择实体
   */
  public selectEntity(entityId: string | null): void {
    this.selectedEntityId = entityId;
    this.updateSelection();
  }

  /**
   * 添加实体
   */
  public addEntity(entity: Entity): void {
    // 设置初始位置
    entity.x = this.currentSize.width / 2 + (Math.random() - 0.5) * 200;
    entity.y = this.currentSize.height / 2 + (Math.random() - 0.5) * 200;
    
    this.data.entities.push(entity);
    this.renderSVG();
  }

  /**
   * 删除实体
   */
  public removeEntity(entityId: string): void {
    this.data.entities = this.data.entities.filter(e => e.id !== entityId);
    this.data.relationships = this.data.relationships.filter(
      r => (typeof r.source === 'string' ? r.source : r.source.id) !== entityId &&
           (typeof r.target === 'string' ? r.target : r.target.id) !== entityId
    );
    if (this.selectedEntityId === entityId) {
      this.selectedEntityId = null;
    }
    this.renderSVG();
  }

  /**
   * 创建SVG元素（重写父类方法以添加画布点击事件）
   */
  protected createSVG(): void {
    if (!this.container) return;

    // 清除旧内容
    d3.select(this.container).selectAll('*').remove();

    // 创建SVG - 使用100%宽度和高度，避免固定像素值导致的溢出
    this.svg = d3
      .select(this.container)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${this.currentSize.width} ${this.currentSize.height}`)
      .style('display', 'block')
      .style('overflow', 'hidden');

    // 添加画布点击事件
    this.svg.on('click', (event: any) => {
      // 只在点击 SVG 背景时触发（不是点击实体）
      if (event.target === this.svg?.node() || event.target.tagName === 'svg') {
        if (this.g) {
          const [x, y] = d3.pointer(event, this.g.node());
          this.events.onCanvasClick?.(x, y);
        }
      }
    });

    // 创建主组
    this.g = this.svg.append('g');

    // 创建辅助线组（在最底层）
    this.guidesGroup = this.g.append('g').attr('class', 'guides');

    // 设置缩放和平移
    this.setupZoom();
    
    // 更新光标
    this.updateCursor();
  }

  /**
   * 设置当前模式
   */
  public setMode(mode: string): void {
    this.config.currentMode = mode;
    this.updateCursor();
  }

  /**
   * 更新鼠标光标
   */
  private updateCursor(): void {
    if (!this.svg) return;

    const mode = this.config.currentMode;
    switch (mode) {
      case 'create':
        this.svg.style('cursor', 'crosshair');
        break;
      case 'delete':
        this.svg.style('cursor', 'not-allowed');
        break;
      case 'copy':
        this.svg.style('cursor', 'copy');
        break;
      case 'pan':
        this.svg.style('cursor', 'grab');
        break;
      case 'select':
      default:
        this.svg.style('cursor', 'default');
        break;
    }
  }

  /**
   * 渲染SVG内容
   */
  protected renderSVG(): void {
    if (!this.g) {
      return;
    }

    // 如果没有实体，清空并显示空状态
    if (!this.data.entities.length) {
      this.g.selectAll('*').remove();
      if (this.simulation) {
        this.simulation.stop();
        this.simulation = null;
      }
      return;
    }

    // 清除之前的内容
    this.g.selectAll('*').remove();

    // 停止旧的模拟
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }

    const {
      entityRadius = 60,
      relationshipDistance = 200,
      chargeStrength = -500,
      enableDrag = true,
    } = this.config;

    // 检查所有实体是否都有固定位置（已保存的坐标）
    const allHavePositions = this.data.entities.every(
      e => e.fx !== undefined && e.fx !== null && e.fy !== undefined && e.fy !== null
    );

    // 创建力导向模拟
    this.simulation = d3
      .forceSimulation<Entity>(this.data.entities)
      .force(
        'link',
        d3
          .forceLink<Entity, Relationship>(this.data.relationships)
          .id((d) => d.id)
          .distance(relationshipDistance)
      )
      .force('charge', d3.forceManyBody().strength(chargeStrength))
      .force('collision', d3.forceCollide().radius(entityRadius + 20));

    // 如果所有实体都有位置，不需要力导向计算
    if (allHavePositions) {
      // 确保 x, y 与 fx, fy 同步
      this.data.entities.forEach(e => {
        e.x = e.fx as number;
        e.y = e.fy as number;
      });
      // 立即停止模拟
      this.simulation.alpha(0).stop();
    } else {
      // 只为没有位置的实体添加中心力
      this.simulation.force('center', d3.forceCenter(this.currentSize.width / 2, this.currentSize.height / 2));
    }

    // 创建关系
    const link = this.createRelationships();

    // 创建实体
    const entityGroup = this.createEntities(entityRadius, enableDrag);

    // 创建辅助线组（在最上层，最后创建）
    this.guidesGroup = this.g.append('g').attr('class', 'guides');

    // 如果所有实体都有位置，直接更新视图一次
    if (allHavePositions) {
      this.updatePositions(link, entityGroup);
    } else {
      // 更新位置
      this.simulation.on('tick', () => {
        this.updatePositions(link, entityGroup);
      });
    }
  }

  /**
   * 创建关系
   */
  private createRelationships(): d3.Selection<SVGLineElement, Relationship, SVGGElement, unknown> {
    if (!this.g) throw new Error('SVG group not initialized');

    const linkGroup = this.g.append('g').attr('class', 'relationships');

    const link = linkGroup
      .selectAll<SVGLineElement, Relationship>('line')
      .data(this.data.relationships)
      .enter()
      .append('line')
      .attr('stroke', '#adb5bd')
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        this.events.onRelationshipClick?.(d);
      });

    // 创建箭头标记
    this.createArrowMarker();

    // 创建关系标签
    linkGroup
      .selectAll<SVGTextElement, Relationship>('text')
      .data(this.data.relationships)
      .enter()
      .append('text')
      .attr('class', 'relationship-label')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .attr('font-size', '12px')
      .attr('fill', '#6c757d')
      .text((d) => d.label || d.type);

    return link;
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
      .attr('refX', 15)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto');

    const path = marker.select('path').empty()
      ? marker.append('path')
      : marker.select<SVGPathElement>('path');

    (path as d3.Selection<SVGPathElement, unknown, null, undefined>)
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#adb5bd');
  }

  /**
   * 创建实体
   */
  private createEntities(
    entityRadius: number,
    enableDrag: boolean
  ): d3.Selection<SVGGElement, Entity, SVGGElement, unknown> {
    if (!this.g) throw new Error('SVG group not initialized');

    const entityGroup = this.g
      .append('g')
      .attr('class', 'entities')
      .selectAll<SVGGElement, Entity>('g')
      .data(this.data.entities)
      .enter()
      .append('g')
      .attr('class', 'entity')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        this.selectedEntityId = d.id;
        this.updateSelection();
        this.events.onEntityClick?.(d);
      })
      .on('dblclick', (event, d) => {
        event.stopPropagation();
        this.events.onEntityDoubleClick?.(d);
      });

    // 启用拖拽
    if (enableDrag && this.simulation) {
      const snapThreshold = this.config.snapThreshold ?? 20; // 增大吸附阈值
      const showGuides = this.config.showGuides ?? true;
      
      // 用于跟踪拖拽状态
      let dragStartX = 0;
      let dragStartY = 0;
      let hasDragged = false;

      const dragHandler = d3
        .drag<SVGGElement, Entity>()
        .on('start', (event, d) => {
          // 阻止事件冒泡到 SVG 的 zoom 处理器
          event.sourceEvent.stopPropagation();
          
          // 记录起始位置
          dragStartX = d.x || 0;
          dragStartY = d.y || 0;
          hasDragged = false;
          
          // 固定所有实体的当前位置（包括被拖拽的）
          this.data.entities.forEach((entity) => {
            entity.fx = entity.x;
            entity.fy = entity.y;
          });
          
          // 停止模拟，防止任何自动布局
          if (this.simulation) {
            this.simulation.alphaTarget(0).stop();
          }
          
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          // 阻止事件冒泡到 SVG 的 zoom 处理器
          event.sourceEvent.stopPropagation();
          
          let newX = event.x;
          let newY = event.y;
          
          // 检测是否有实际移动（超过5像素认为是拖拽）
          const moveDistance = Math.sqrt(
            Math.pow(newX - dragStartX, 2) + Math.pow(newY - dragStartY, 2)
          );
          if (moveDistance > 5) {
            hasDragged = true;
          }
          
          // 检测对齐并吸附
          if (showGuides) {
            const alignResult = this.checkAlignment(d, newX, newY, snapThreshold);
            newX = alignResult.x;
            newY = alignResult.y;
            this.drawGuideLines(alignResult.alignSegments, alignResult.spacingSegments);
          }
          
          // 更新拖拽实体的固定位置
          d.fx = newX;
          d.fy = newY;
          
          // 手动更新位置和视图
          d.x = newX;
          d.y = newY;
          
          // 手动更新视图
          const links = this.g!.select('.relationships').selectAll<SVGLineElement, Relationship>('line');
          const entities = this.g!.select('.entities').selectAll<SVGGElement, Entity>('g');
          this.updatePositions(links, entities);
        })
        .on('end', (event, d) => {
          // 阻止事件冒泡到 SVG 的 zoom 处理器
          event.sourceEvent.stopPropagation();
          
          // 隐藏辅助线
          this.clearGuideLines();
          
          // 如果没有实际拖拽（移动距离很小），视为点击
          if (!hasDragged) {
            this.selectedEntityId = d.id;
            this.updateSelection();
            this.events.onEntityClick?.(d);
          } else {
            // 更新拖拽实体的最终位置
            d.x = d.fx as number;
            d.y = d.fy as number;
            
            // 保持所有实体固定，不再受力导向影响
            // 这样可以防止拖拽结束后其他实体移动
            
            this.events.onEntityUpdate?.(d);
          }
        });

      entityGroup.call(dragHandler);
    }

    // 绘制实体圆形
    this.drawEntityCircles(entityGroup, entityRadius);

    return entityGroup;
  }

  /**
   * 绘制实体圆形
   */
  private drawEntityCircles(
    entityGroup: d3.Selection<SVGGElement, Entity, SVGGElement, unknown>,
    entityRadius: number
  ): void {
    // 绘制圆形背景
    entityGroup
      .append('circle')
      .attr('class', 'entity-circle')
      .attr('r', entityRadius)
      .attr('fill', (d) => {
        // 如果实体没有颜色，分配一个并保存到实体对象
        if (!d.color) {
          d.color = this.getRandomColor();
          // 通知外部保存颜色
          this.events.onEntityUpdate?.(d);
        }
        return d.color;
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))');

    // 绘制实体名称（居中显示）
    entityGroup
      .append('text')
      .attr('class', 'entity-name')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('dy', 0)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.3)')
      .text((d) => this.truncateName(d.name, entityRadius));
  }

  /**
   * 截断名称以适应圆形
   */
  private truncateName(name: string, radius: number): string {
    // 估算可显示的字符数（中文字符约12px宽，英文约8px）
    const maxWidth = radius * 1.6;
    const avgCharWidth = 10;
    const maxChars = Math.floor(maxWidth / avgCharWidth);
    
    if (name.length > maxChars) {
      return name.substring(0, maxChars - 1) + '…';
    }
    return name;
  }

  /**
   * 获取随机颜色
   */
  private getRandomColor(): string {
    const colors = [
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
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 更新位置
   */
  private updatePositions(
    link: d3.Selection<SVGLineElement, Relationship, any, unknown>,
    entityGroup: d3.Selection<SVGGElement, Entity, any, unknown>
  ): void {
    // 更新关系位置
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y);

    // 更新关系标签位置
    this.g?.selectAll<SVGTextElement, Relationship>('.relationship-label')
      .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
      .attr('y', (d: any) => (d.source.y + d.target.y) / 2);

    // 更新实体位置
    entityGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
  }

  /**
   * 辅助线颜色
   */
  private guideLineColor = '#999999';

  /**
   * 检测对齐和间距
   * 对齐辅助线：只显示当前拖拽实体与最近对齐实体之间的连线
   * 间距辅助线：检测等间距对齐
   */
  private checkAlignment(
    draggedEntity: Entity,
    newX: number,
    newY: number,
    threshold: number
  ): { 
    x: number; 
    y: number; 
    alignSegments: Array<{ type: 'horizontal' | 'vertical'; x1: number; y1: number; x2: number; y2: number }>;
    spacingSegments: Array<{ type: 'horizontal' | 'vertical'; start: number; end: number; base: number }>;
  } {
    const alignSegments: Array<{ type: 'horizontal' | 'vertical'; x1: number; y1: number; x2: number; y2: number }> = [];
    const spacingSegments: Array<{ type: 'horizontal' | 'vertical'; start: number; end: number; base: number }> = [];
    let snappedX = newX;
    let snappedY = newY;

    // 获取其他实体
    const otherEntities = this.data.entities.filter(e => e.id !== draggedEntity.id);

    if (otherEntities.length === 0) {
      return { x: snappedX, y: snappedY, alignSegments, spacingSegments };
    }

    // ========== 1. 对齐辅助线（只显示相邻两个实体之间） ==========
    
    // 检测水平对齐（Y 坐标相同）- 找最近的一个对齐实体
    let closestHorizontalEntity: Entity | null = null;
    let closestHorizontalDistance = Infinity;
    
    for (const entity of otherEntities) {
      const yDiff = Math.abs(newY - (entity.y || 0));
      if (yDiff < threshold) {
        const xDiff = Math.abs(newX - (entity.x || 0));
        if (xDiff < closestHorizontalDistance) {
          closestHorizontalDistance = xDiff;
          closestHorizontalEntity = entity;
        }
      }
    }
    
    if (closestHorizontalEntity) {
      snappedY = closestHorizontalEntity.y || 0;
      // 只显示当前实体与最近对齐实体之间的连线
      alignSegments.push({
        type: 'horizontal',
        x1: Math.min(newX, closestHorizontalEntity.x || 0),
        y1: snappedY,
        x2: Math.max(newX, closestHorizontalEntity.x || 0),
        y2: snappedY,
      });
    }

    // 检测垂直对齐（X 坐标相同）- 找最近的一个对齐实体
    let closestVerticalEntity: Entity | null = null;
    let closestVerticalDistance = Infinity;
    
    for (const entity of otherEntities) {
      const xDiff = Math.abs(newX - (entity.x || 0));
      if (xDiff < threshold) {
        const yDiff = Math.abs(newY - (entity.y || 0));
        if (yDiff < closestVerticalDistance) {
          closestVerticalDistance = yDiff;
          closestVerticalEntity = entity;
        }
      }
    }
    
    if (closestVerticalEntity) {
      snappedX = closestVerticalEntity.x || 0;
      // 只显示当前实体与最近对齐实体之间的连线
      alignSegments.push({
        type: 'vertical',
        x1: snappedX,
        y1: Math.min(newY, closestVerticalEntity.y || 0),
        x2: snappedX,
        y2: Math.max(newY, closestVerticalEntity.y || 0),
      });
    }

    // ========== 2. 等间距辅助线 ==========
    // 当画布上有2个及以上其他实体时，检测等间距对齐
    
    const sortedByX = [...otherEntities].sort((a, b) => (a.x || 0) - (b.x || 0));
    const sortedByY = [...otherEntities].sort((a, b) => (a.y || 0) - (b.y || 0));
    
    // 水平方向等间距检测（需要至少2个其他实体）
    if (sortedByX.length >= 2) {
      // 计算辅助线的 Y 位置（在所有实体下方）
      const baseY = Math.max(...otherEntities.map(e => e.y || 0), newY) + 80;

      // 计算现有实体之间的间距
      const horizontalGaps: number[] = [];
      for (let i = 1; i < sortedByX.length; i++) {
        const gap = Math.abs((sortedByX[i].x || 0) - (sortedByX[i - 1].x || 0));
        horizontalGaps.push(gap);
      }

      // 检查间距是否都相同（允许一定误差，放宽到20像素）
      const gapThreshold = 20;
      const firstGap = horizontalGaps[0];
      const allGapsSame = horizontalGaps.length === 1 || horizontalGaps.every(gap => Math.abs(gap - firstGap) < gapThreshold);

      if (allGapsSame && firstGap > 20) { // 间距至少20像素
        const commonGap = firstGap;
        const leftMostX = sortedByX[0].x || 0;
        const rightMostX = sortedByX[sortedByX.length - 1].x || 0;

        // 检查放在最左边（等间距位置）
        const snapLeftX = leftMostX - commonGap;
        if (Math.abs(snappedX - snapLeftX) < threshold) {
          snappedX = snapLeftX;
          const allPositions = [snappedX, ...sortedByX.map(e => e.x || 0)].sort((a, b) => a - b);
          for (let i = 0; i < allPositions.length - 1; i++) {
            spacingSegments.push({
              type: 'horizontal',
              start: allPositions[i],
              end: allPositions[i + 1],
              base: baseY,
            });
          }
        }
        // 检查放在最右边（等间距位置）
        else if (Math.abs(snappedX - (rightMostX + commonGap)) < threshold) {
          snappedX = rightMostX + commonGap;
          const allPositions = [...sortedByX.map(e => e.x || 0), snappedX].sort((a, b) => a - b);
          for (let i = 0; i < allPositions.length - 1; i++) {
            spacingSegments.push({
              type: 'horizontal',
              start: allPositions[i],
              end: allPositions[i + 1],
              base: baseY,
            });
          }
        }
        // 检查放在中间位置（等间距）
        else {
          for (let i = 0; i < sortedByX.length - 1; i++) {
            const leftX = sortedByX[i].x || 0;
            const rightX = sortedByX[i + 1].x || 0;
            const midX = (leftX + rightX) / 2;
            
            if (Math.abs(snappedX - midX) < threshold) {
              snappedX = midX;
              spacingSegments.push({
                type: 'horizontal',
                start: leftX,
                end: snappedX,
                base: baseY,
              });
              spacingSegments.push({
                type: 'horizontal',
                start: snappedX,
                end: rightX,
                base: baseY,
              });
              break;
            }
          }
        }
      }
    }

    // 垂直方向等间距检测（需要至少2个其他实体）
    if (sortedByY.length >= 2) {
      // 计算辅助线的 X 位置（在所有实体右侧）
      const baseX = Math.max(...otherEntities.map(e => e.x || 0), newX) + 80;

      // 计算现有实体之间的间距
      const verticalGaps: number[] = [];
      for (let i = 1; i < sortedByY.length; i++) {
        const gap = Math.abs((sortedByY[i].y || 0) - (sortedByY[i - 1].y || 0));
        verticalGaps.push(gap);
      }

      // 检查间距是否都相同（允许一定误差，放宽到20像素）
      const gapThreshold = 20;
      const firstGap = verticalGaps[0];
      const allGapsSame = verticalGaps.length === 1 || verticalGaps.every(gap => Math.abs(gap - firstGap) < gapThreshold);

      if (allGapsSame && firstGap > 20) { // 间距至少20像素
        const commonGap = firstGap;
        const topMostY = sortedByY[0].y || 0;
        const bottomMostY = sortedByY[sortedByY.length - 1].y || 0;

        // 检查放在最上边（等间距位置）
        const snapTopY = topMostY - commonGap;
        if (Math.abs(newY - snapTopY) < threshold) {
          snappedY = snapTopY;
          const allPositions = [snappedY, ...sortedByY.map(e => e.y || 0)].sort((a, b) => a - b);
          for (let i = 0; i < allPositions.length - 1; i++) {
            spacingSegments.push({
              type: 'vertical',
              start: allPositions[i],
              end: allPositions[i + 1],
              base: baseX,
            });
          }
        }
        // 检查放在最下边（等间距位置）
        else if (Math.abs(newY - (bottomMostY + commonGap)) < threshold) {
          snappedY = bottomMostY + commonGap;
          const allPositions = [...sortedByY.map(e => e.y || 0), snappedY].sort((a, b) => a - b);
          for (let i = 0; i < allPositions.length - 1; i++) {
            spacingSegments.push({
              type: 'vertical',
              start: allPositions[i],
              end: allPositions[i + 1],
              base: baseX,
            });
          }
        }
        // 检查放在中间位置（等间距）
        else {
          for (let i = 0; i < sortedByY.length - 1; i++) {
            const topY = sortedByY[i].y || 0;
            const bottomY2 = sortedByY[i + 1].y || 0;
            const midY = (topY + bottomY2) / 2;
            
            if (Math.abs(newY - midY) < threshold) {
              snappedY = midY;
              spacingSegments.push({
                type: 'vertical',
                start: topY,
                end: snappedY,
                base: baseX,
              });
              spacingSegments.push({
                type: 'vertical',
                start: snappedY,
                end: bottomY2,
                base: baseX,
              });
              break;
            }
          }
        }
      }
    }

    return { x: snappedX, y: snappedY, alignSegments, spacingSegments };
  }

  /**
   * 绘制辅助线和间距
   */
  private drawGuideLines(
    alignSegments: Array<{ type: 'horizontal' | 'vertical'; x1: number; y1: number; x2: number; y2: number }>,
    spacingSegments: Array<{ type: 'horizontal' | 'vertical'; start: number; end: number; base: number }> = []
  ): void {
    if (!this.guidesGroup) return;

    // 清除旧的辅助线
    this.guidesGroup.selectAll('*').remove();

    const lineColor = this.guideLineColor;

    // 绘制对齐辅助线（分段，从圆心到圆心）
    alignSegments.forEach(segment => {
      this.guidesGroup!
        .append('line')
        .attr('x1', segment.x1)
        .attr('y1', segment.y1)
        .attr('x2', segment.x2)
        .attr('y2', segment.y2)
        .attr('stroke', lineColor)
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '4,4')
        .style('pointer-events', 'none');
    });

    // 绘制等间距标尺线（分段显示）
    spacingSegments.forEach(segment => {
      if (segment.type === 'horizontal') {
        const baseY = segment.base;

        // 绘制这一段的水平线
        this.guidesGroup!
          .append('line')
          .attr('x1', segment.start)
          .attr('y1', baseY)
          .attr('x2', segment.end)
          .attr('y2', baseY)
          .attr('stroke', lineColor)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4')
          .style('pointer-events', 'none');

        // 绘制起点垂直短线标记
        this.guidesGroup!
          .append('line')
          .attr('x1', segment.start)
          .attr('y1', baseY - 8)
          .attr('x2', segment.start)
          .attr('y2', baseY + 8)
          .attr('stroke', lineColor)
          .attr('stroke-width', 1)
          .style('pointer-events', 'none');

        // 绘制终点垂直短线标记
        this.guidesGroup!
          .append('line')
          .attr('x1', segment.end)
          .attr('y1', baseY - 8)
          .attr('x2', segment.end)
          .attr('y2', baseY + 8)
          .attr('stroke', lineColor)
          .attr('stroke-width', 1)
          .style('pointer-events', 'none');
      } else {
        const baseX = segment.base;

        // 绘制这一段的垂直线
        this.guidesGroup!
          .append('line')
          .attr('x1', baseX)
          .attr('y1', segment.start)
          .attr('x2', baseX)
          .attr('y2', segment.end)
          .attr('stroke', lineColor)
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '4,4')
          .style('pointer-events', 'none');

        // 绘制起点水平短线标记
        this.guidesGroup!
          .append('line')
          .attr('x1', baseX - 8)
          .attr('y1', segment.start)
          .attr('x2', baseX + 8)
          .attr('y2', segment.start)
          .attr('stroke', lineColor)
          .attr('stroke-width', 1)
          .style('pointer-events', 'none');

        // 绘制终点水平短线标记
        this.guidesGroup!
          .append('line')
          .attr('x1', baseX - 8)
          .attr('y1', segment.end)
          .attr('x2', baseX + 8)
          .attr('y2', segment.end)
          .attr('stroke', lineColor)
          .attr('stroke-width', 1)
          .style('pointer-events', 'none');
      }
    });
  }

  /**
   * 清除辅助线
   */
  private clearGuideLines(): void {
    if (this.guidesGroup) {
      this.guidesGroup.selectAll('*').remove();
    }
  }

  /**
   * 更新选中状态
   */
  private updateSelection(): void {
    if (!this.g) return;

    this.g.selectAll<SVGGElement, Entity>('.entity')
      .select('.entity-circle')
      .attr('stroke', (d) => d.id === this.selectedEntityId ? '#ffffff' : '#ffffff')
      .attr('stroke-width', (d) => d.id === this.selectedEntityId ? 5 : 3)
      .style('filter', (d) => d.id === this.selectedEntityId 
        ? 'drop-shadow(0 0 15px rgba(102, 126, 234, 0.8))' 
        : 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))');
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
