/**
 * 悬浮菜单组件类
 * 支持四个方位放置的圆形悬浮菜单
 */

import React, { Component } from 'react';
import './FloatingMenu.css';

export type FloatingMenuPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export interface FloatingMenuItem {
  id: string;
  label: string;
  icon?: string;
  active?: boolean;
  onClick: () => void;
}

export interface FloatingMenuComponentProps {
  items: FloatingMenuItem[];
  position?: FloatingMenuPosition;
  size?: number;
  expanded?: boolean;
}

interface FloatingMenuComponentState {
  expanded: boolean;
}

/**
 * 悬浮菜单组件类
 */
export class FloatingMenuComponent extends Component<FloatingMenuComponentProps, FloatingMenuComponentState> {
  constructor(props: FloatingMenuComponentProps) {
    super(props);
    this.state = {
      expanded: props.expanded || false,
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
   * 切换展开/收起
   */
  private toggleExpand = (): void => {
    this.setState({ expanded: !this.state.expanded });
  };

  /**
   * 处理菜单项点击
   */
  private handleItemClick = (item: FloatingMenuItem): void => {
    item.onClick();
    // 点击后收起菜单
    this.setState({ expanded: false });
  };

  /**
   * 获取位置类名
   */
  private getPositionClass(): string {
    const { position = 'bottom-right' } = this.props;
    return `floating-menu-${position}`;
  }

  /**
   * 渲染方法
   */
  public render(): React.ReactNode {
    const { items, size = 64 } = this.props;
    const { expanded } = this.state;

    return (
      <div className={`floating-menu ${this.getPositionClass()}`}>
        {/* 主按钮 */}
        <button
          className="floating-menu-main"
          style={{ width: size, height: size }}
          onClick={this.toggleExpand}
          title={expanded ? 'Close Menu' : 'Open Menu'}
        >
          <span className={`floating-menu-icon ${expanded ? 'expanded' : ''}`}>
            {expanded ? '✕' : '☰'}
          </span>
        </button>

        {/* 菜单项 */}
        {expanded && (
          <div className="floating-menu-items">
            {items.map((item, index) => (
              <button
                key={item.id}
                className={`floating-menu-item ${item.active ? 'active' : ''}`}
                style={{
                  width: size * 0.8,
                  height: size * 0.8,
                  animationDelay: `${index * 0.05}s`,
                }}
                onClick={() => this.handleItemClick(item)}
                title={item.label}
              >
                {item.icon && <span className="floating-menu-item-icon">{item.icon}</span>}
                <span className="floating-menu-item-label">{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}

// 导出为默认
export default FloatingMenuComponent;
// 导出别名
export { FloatingMenuComponent as FloatingMenu };
