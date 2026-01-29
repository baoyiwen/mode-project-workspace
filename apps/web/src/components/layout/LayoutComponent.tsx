/**
 * Layout组件类
 * 页面布局组件，支持center、left、right、top、bottom区域
 */

import React, { Component } from 'react';
import './Layout.css';

export interface LayoutComponentProps {
  /** 中心区域内容 */
  center?: React.ReactNode;
  /** 左侧菜单内容 */
  leftMenu?: React.ReactNode;
  /** 右侧菜单内容 */
  rightMenu?: React.ReactNode;
  /** 顶部菜单内容 */
  topMenu?: React.ReactNode;
  /** 底部菜单内容 */
  bottomMenu?: React.ReactNode;
  /** 自定义类名 */
  className?: string;
  /** 是否显示左侧菜单 */
  showLeftMenu?: boolean;
  /** 是否显示右侧菜单 */
  showRightMenu?: boolean;
  /** 是否显示顶部菜单 */
  showTopMenu?: boolean;
  /** 是否显示底部菜单 */
  showBottomMenu?: boolean;
}

interface LayoutComponentState {
  // 可以在这里添加状态
}

/**
 * Layout组件类
 */
export class LayoutComponent extends Component<LayoutComponentProps, LayoutComponentState> {
  constructor(props: LayoutComponentProps) {
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
   * 渲染方法
   */
  public render(): React.ReactNode {
    const {
      center,
      leftMenu,
      rightMenu,
      topMenu,
      bottomMenu,
      className = '',
      showLeftMenu = false,
      showRightMenu = false,
      showTopMenu = false,
      showBottomMenu = false,
    } = this.props;

    return (
      <div className={`layout-container ${className}`}>
        {/* 中心区域 - 占满全屏 */}
        <div className="layout-center">
          {center}
        </div>

        {/* 悬浮菜单 */}
        {showTopMenu && topMenu && (
          <div className="layout-menu-top-floating">
            {topMenu}
          </div>
        )}

        {showLeftMenu && leftMenu && (
          <div className="layout-menu-left-floating">
            {leftMenu}
          </div>
        )}

        {showRightMenu && rightMenu && (
          <div className="layout-menu-right-floating">
            {rightMenu}
          </div>
        )}

        {showBottomMenu && bottomMenu && (
          <div className="layout-menu-bottom-floating">
            {bottomMenu}
          </div>
        )}
      </div>
    );
  }
}
