/**
 * 组件基类
 * 提供所有组件的基础功能
 */

export interface ComponentConfig {
  [key: string]: any;
}

export interface ComponentLifecycle {
  onMount?: () => void;
  onUnmount?: () => void;
  onUpdate?: () => void;
}

/**
 * 抽象组件基类
 */
export abstract class Component<TConfig extends ComponentConfig = ComponentConfig> {
  protected config: TConfig;
  protected container: HTMLElement | null = null;
  protected isMounted: boolean = false;
  protected lifecycle: ComponentLifecycle = {};

  constructor(config: TConfig) {
    this.config = { ...config };
  }

  /**
   * 设置容器元素
   */
  public setContainer(container: HTMLElement | null): void {
    this.container = container;
    if (container && !this.isMounted) {
      this.mount();
    } else if (!container && this.isMounted) {
      this.unmount();
    }
  }

  /**
   * 获取容器元素
   */
  public getContainer(): HTMLElement | null {
    return this.container;
  }

  /**
   * 挂载组件
   */
  protected mount(): void {
    if (this.isMounted) return;
    this.isMounted = true;
    this.render();
    this.lifecycle.onMount?.();
  }

  /**
   * 卸载组件
   */
  protected unmount(): void {
    if (!this.isMounted) return;
    this.cleanup();
    this.isMounted = false;
    this.lifecycle.onUnmount?.();
  }

  /**
   * 更新配置
   */
  public updateConfig(newConfig: Partial<TConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.isMounted) {
      this.render();
      this.lifecycle.onUpdate?.();
    }
  }

  /**
   * 获取配置
   */
  public getConfig(): TConfig {
    return { ...this.config };
  }

  /**
   * 设置生命周期回调
   */
  public setLifecycle(lifecycle: ComponentLifecycle): void {
    this.lifecycle = { ...this.lifecycle, ...lifecycle };
  }

  /**
   * 渲染组件（子类必须实现）
   */
  protected abstract render(): void;

  /**
   * 清理资源（子类可以重写）
   */
  protected cleanup(): void {
    // 子类可以重写此方法进行资源清理
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.unmount();
    this.container = null;
    this.config = {} as TConfig;
  }
}
