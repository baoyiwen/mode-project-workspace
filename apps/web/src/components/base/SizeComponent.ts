/**
 * 尺寸组件基类
 * 提供resize功能的基础组件
 */

import { Component, type ComponentConfig } from './Component';

export interface SizeConfig extends ComponentConfig {
  width?: number;
  height?: number;
  autoResize?: boolean;
}

export interface Size {
  width: number;
  height: number;
}

/**
 * 尺寸组件抽象类
 * 继承自Component，添加resize功能
 */
export abstract class SizeComponent<TConfig extends SizeConfig = SizeConfig> extends Component<TConfig> {
  protected currentSize: Size = { width: 0, height: 0 };
  private resizeObserver: ResizeObserver | null = null;
  private resizeCallback: (() => void) | null = null;

  constructor(config: TConfig) {
    super(config);
    this.currentSize = {
      width: config.width || 0,
      height: config.height || 0,
    };
  }

  /**
   * 设置容器元素（重写以添加resize监听）
   */
  public setContainer(container: HTMLElement | null): void {
    // 先清理旧的监听器
    this.removeResizeListener();

    super.setContainer(container);

    // 添加新的监听器
    if (container && this.config.autoResize !== false) {
      this.addResizeListener();
    }
  }

  /**
   * 获取当前尺寸
   */
  public getSize(): Size {
    return { ...this.currentSize };
  }

  /**
   * 设置尺寸
   */
  public setSize(width: number, height: number): void {
    if (this.currentSize.width === width && this.currentSize.height === height) {
      return;
    }

    this.currentSize = { width, height };
    this.config.width = width;
    this.config.height = height;

    if (this.isMounted) {
      this.onResize(width, height);
      this.render();
    }
  }

  /**
   * 更新尺寸配置
   */
  public updateConfig(newConfig: Partial<TConfig>): void {
    super.updateConfig(newConfig);

    if (newConfig.width !== undefined || newConfig.height !== undefined) {
      const width = newConfig.width ?? this.currentSize.width;
      const height = newConfig.height ?? this.currentSize.height;
      this.setSize(width, height);
    }
  }

  /**
   * 添加resize监听器
   */
  private addResizeListener(): void {
    if (!this.container || typeof ResizeObserver === 'undefined') {
      // 如果不支持ResizeObserver，使用window resize事件
      this.resizeCallback = () => {
        this.updateSizeFromContainer();
      };
      window.addEventListener('resize', this.resizeCallback);
      // 立即更新一次
      this.updateSizeFromContainer();
      return;
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.updateSizeFromContainer();
    });

    this.resizeObserver.observe(this.container);
    // 立即更新一次
    this.updateSizeFromContainer();
  }

  /**
   * 移除resize监听器
   */
  private removeResizeListener(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    if (this.resizeCallback) {
      window.removeEventListener('resize', this.resizeCallback);
      this.resizeCallback = null;
    }
  }

  /**
   * 从容器更新尺寸
   */
  private updateSizeFromContainer(): void {
    if (!this.container) return;

    const rect = this.container.getBoundingClientRect();
    // 使用容器的实际尺寸，如果为0则不更新（避免在未渲染时更新）
    const width = Math.max(0, rect.width);
    const height = Math.max(0, rect.height);

    // 只有当尺寸有效且发生变化时才更新
    if (width > 0 && height > 0) {
      // 避免频繁更新，只有尺寸变化超过2px才更新（提高阈值）
      const widthDiff = Math.abs(this.currentSize.width - width);
      const heightDiff = Math.abs(this.currentSize.height - height);
      
      if (widthDiff > 2 || heightDiff > 2) {
        // 使用requestAnimationFrame避免在resize过程中频繁更新
        requestAnimationFrame(() => {
          if (this.container) {
            const newRect = this.container.getBoundingClientRect();
            const newWidth = Math.max(0, newRect.width);
            const newHeight = Math.max(0, newRect.height);
            if (newWidth > 0 && newHeight > 0) {
              this.setSize(newWidth, newHeight);
            }
          }
        });
      }
    }
  }

  /**
   * 尺寸变化回调（子类可以重写）
   */
  protected onResize(width: number, height: number): void {
    // 子类可以重写此方法处理尺寸变化
  }

  /**
   * 清理资源（重写以清理resize监听器）
   */
  protected cleanup(): void {
    this.removeResizeListener();
    super.cleanup();
  }
}
