/**
 * 圆形菜单组件类
 * 支持在Layout四个方位放置的圆形菜单按钮
 */

import React, { Component } from 'react';
import './CircularMenu.css';

export type MenuPosition = 'top' | 'left' | 'right' | 'bottom';

export interface CircularMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode | string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export interface CircularMenuComponentProps {
  items: CircularMenuItem[];
  position: MenuPosition;
  size?: number;
  gap?: number;
}

interface CircularMenuComponentState {
  // 可以在这里添加状态
}

/**
 * 圆形菜单组件类
 */
export class CircularMenuComponent extends Component<CircularMenuComponentProps, CircularMenuComponentState> {
  constructor(props: CircularMenuComponentProps) {
    super(props);
    this.state = {};
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
   * 获取位置类名
   */
  private getPositionClass(): string {
    return `circular-menu-${this.props.position}`;
  }

  /**
   * 渲染菜单项
   */
  private renderMenuItem(item: CircularMenuItem): React.ReactNode {
    const { size = 64 } = this.props;
    const hasCustomIcon = item.icon && typeof item.icon !== 'string';

    return (
      <button
        key={item.id}
        className={`circular-menu-item ${item.active ? 'active' : ''} ${item.disabled ? 'disabled' : ''} ${
          hasCustomIcon ? 'has-icon' : ''
        }`}
        style={{ width: size, height: size }}
        onClick={item.onClick}
        disabled={item.disabled}
        title={item.label}
      >
        {hasCustomIcon ? (
          // 自定义图标 - 图标和文字上下排列
          <div className="circular-menu-item-content">
            <div className="circular-menu-item-icon">{item.icon}</div>
            <div className="circular-menu-item-label">{item.label}</div>
          </div>
        ) : item.icon && typeof item.icon === 'string' ? (
          // 字符串图标（emoji）- 图标和文字上下排列
          <div className="circular-menu-item-content">
            <div className="circular-menu-item-emoji">{item.icon}</div>
            <div className="circular-menu-item-label">{item.label}</div>
          </div>
        ) : (
          // 默认 - 只显示文字（在圆圈内）
          <div className="circular-menu-item-text">{item.label}</div>
        )}
      </button>
    );
  }

  /**
   * 渲染方法
   */
  public render(): React.ReactNode {
    const { items, gap = 12 } = this.props;

    return (
      <div className={`circular-menu ${this.getPositionClass()}`} style={{ gap: `${gap}px` }}>
        {items.map((item) => this.renderMenuItem(item))}
      </div>
    );
  }
}

// 导出为默认
export default CircularMenuComponent;
// 导出别名
export { CircularMenuComponent as CircularMenu };
