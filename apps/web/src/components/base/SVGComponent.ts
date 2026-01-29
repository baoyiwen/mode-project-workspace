/**
 * SVG组件基类
 * 提供SVG相关的基础操作
 */

import * as d3 from 'd3';
import { SizeComponent, type SizeConfig } from './SizeComponent';

export interface SVGConfig extends SizeConfig {
  margin?: { top: number; right: number; bottom: number; left: number };
  enableZoom?: boolean;
  enablePan?: boolean;
  zoomExtent?: [number, number];
}

/**
 * SVG组件抽象类
 * 继承自SizeComponent，添加SVG相关操作
 */
export abstract class SVGComponent<TConfig extends SVGConfig = SVGConfig> extends SizeComponent<TConfig> {
  protected svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  protected g: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  protected zoom: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;
  protected zoomTransform: d3.ZoomTransform = d3.zoomIdentity;

  constructor(config: TConfig) {
    super(config);
  }

  /**
   * 创建SVG元素
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

    // 创建主组
    this.g = this.svg.append('g');

    // 设置缩放和平移
    this.setupZoom();
  }

  /**
   * 设置缩放和平移
   */
  protected setupZoom(): void {
    if (!this.svg || !this.g) return;

    const { enableZoom = true, enablePan = true, zoomExtent = [0.1, 4] } = this.config;

    if (!enableZoom && !enablePan) {
      return;
    }

    this.zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent(zoomExtent)
      .filter((event: any) => {
        // 过滤掉来自拖拽实体的事件
        // 如果事件目标是 .entity 或其子元素，不触发 zoom/pan
        const target = event.target as HTMLElement;
        if (target.closest('.entity')) {
          return false;
        }
        // 允许鼠标滚轮缩放和其他缩放/平移操作
        return true;
      })
      .on('zoom', (event) => {
        this.zoomTransform = event.transform;
        this.g!.attr('transform', event.transform.toString());
        this.onZoom(event.transform);
      });

    if (enableZoom && enablePan) {
      this.svg.call(this.zoom as any);
    } else if (enableZoom) {
      this.svg.call(this.zoom.scaleExtent(zoomExtent) as any);
    } else if (enablePan) {
      this.svg.call(this.zoom.scaleExtent([1, 1]) as any);
    }
  }

  /**
   * 获取SVG元素
   */
  public getSVG(): d3.Selection<SVGSVGElement, unknown, null, undefined> | null {
    return this.svg;
  }

  /**
   * 获取主组元素
   */
  public getG(): d3.Selection<SVGGElement, unknown, null, undefined> | null {
    return this.g;
  }

  /**
   * 获取当前缩放变换
   */
  public getZoomTransform(): d3.ZoomTransform {
    return this.zoomTransform;
  }

  /**
   * 设置缩放变换
   */
  public setZoomTransform(transform: d3.ZoomTransform): void {
    if (!this.svg || !this.zoom) return;
    this.svg.call(this.zoom.transform as any, transform);
  }

  /**
   * 重置缩放和平移
   */
  public resetZoom(): void {
    this.setZoomTransform(d3.zoomIdentity);
  }

  /**
   * 缩放回调（子类可以重写）
   */
  protected onZoom(transform: d3.ZoomTransform): void {
    // 子类可以重写此方法处理缩放事件
  }

  /**
   * 更新尺寸（重写以更新SVG尺寸）
   */
  protected onResize(width: number, height: number): void {
    super.onResize(width, height);
    if (this.svg && width > 0 && height > 0) {
      // 只更新viewBox，不更新width/height属性（保持100%）
      // 这样可以避免SVG超出容器
      this.svg.attr('viewBox', `0 0 ${width} ${height}`);
    }
  }

  /**
   * 渲染组件（重写以创建SVG）
   */
  protected render(): void {
    if (!this.container) return;

    if (!this.svg) {
      this.createSVG();
    } else {
      // 只更新viewBox，不更新width/height属性
      if (this.currentSize.width > 0 && this.currentSize.height > 0) {
        this.svg.attr('viewBox', `0 0 ${this.currentSize.width} ${this.currentSize.height}`);
      }
    }

    // 调用子类的渲染逻辑
    this.renderSVG();
  }

  /**
   * 渲染SVG内容（子类必须实现）
   */
  protected abstract renderSVG(): void;

  /**
   * 清理资源（重写以清理SVG）
   */
  protected cleanup(): void {
    if (this.svg) {
      this.svg.remove();
      this.svg = null;
    }
    this.g = null;
    this.zoom = null;
    super.cleanup();
  }
}
