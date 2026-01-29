/**
 * React组件基类
 * 提供React组件的基础功能
 */

import { Component, type ComponentLifecycle } from './Component';

export interface ReactComponentConfig {
  [key: string]: any;
}

/**
 * React组件基类
 * 封装React组件的通用逻辑
 */
export abstract class ReactComponent<TProps = {}, TState = {}> {
  protected props: TProps;
  protected state: TState;
  protected lifecycle: ComponentLifecycle = {};

  constructor(props: TProps, initialState: TState) {
    this.props = props;
    this.state = initialState;
  }

  /**
   * 更新props
   */
  public updateProps(newProps: Partial<TProps>): void {
    this.props = { ...this.props, ...newProps };
    this.onPropsUpdate();
  }

  /**
   * 更新state
   */
  public setState(newState: Partial<TState>): void {
    this.state = { ...this.state, ...newState };
    this.onStateUpdate();
  }

  /**
   * 获取props
   */
  public getProps(): TProps {
    return { ...this.props };
  }

  /**
   * 获取state
   */
  public getState(): TState {
    return { ...this.state };
  }

  /**
   * 设置生命周期回调
   */
  public setLifecycle(lifecycle: ComponentLifecycle): void {
    this.lifecycle = { ...this.lifecycle, ...lifecycle };
  }

  /**
   * Props更新回调（子类可以重写）
   */
  protected onPropsUpdate(): void {
    // 子类可以重写此方法
  }

  /**
   * State更新回调（子类可以重写）
   */
  protected onStateUpdate(): void {
    // 子类可以重写此方法
  }

  /**
   * 组件挂载时调用
   */
  public componentDidMount(): void {
    this.lifecycle.onMount?.();
  }

  /**
   * 组件卸载时调用
   */
  public componentWillUnmount(): void {
    this.lifecycle.onUnmount?.();
  }

  /**
   * 组件更新时调用
   */
  public componentDidUpdate(): void {
    this.lifecycle.onUpdate?.();
  }
}
