/**
 * App组件类
 * 主应用组件
 */

import React, { Component } from 'react';
import { LayoutComponent } from './layout/LayoutComponent';
import { CircularMenu, type CircularMenuItem } from './ui/CircularMenu';
import { ModelDesignerComponent } from '../pages/ModelDesignerComponent';
import { QueryDesignerComponent } from '../pages/QueryDesignerComponent';
import { ResultViewerComponent } from '../pages/ResultViewerComponent';
import { getModeConfig, MODE_ICONS } from '../types/modes';
import type { AppMode } from '../types/modes';
import { t, i18n } from '../i18n';
import '../App.css';

export interface AppComponentProps {
  // 可以在这里添加props
}

interface AppComponentState {
  currentPage: 'model' | 'query' | 'result';
  currentMode: AppMode;
  locale: string; // 用于触发重新渲染
}

/**
 * App组件类
 */
export class AppComponent extends Component<AppComponentProps, AppComponentState> {
  private unsubscribeI18n?: () => void;

  constructor(props: AppComponentProps) {
    super(props);
    this.state = {
      currentPage: 'model',
      currentMode: 'select',
      locale: i18n.getLocale(),
    };
  }

  /**
   * 组件挂载
   */
  public componentDidMount(): void {
    // 订阅语言变化
    this.unsubscribeI18n = i18n.subscribe((locale) => {
      this.setState({ locale });
    });
  }

  /**
   * 组件卸载
   */
  public componentWillUnmount(): void {
    // 取消订阅
    this.unsubscribeI18n?.();
  }

  /**
   * 切换页面
   */
  private handlePageChange = (page: 'model' | 'query' | 'result'): void => {
    this.setState({ currentPage: page, currentMode: 'select' });
  };

  /**
   * 切换模式
   */
  private handleModeChange = (mode: AppMode): void => {
    this.setState({ currentMode: mode });
  };

  /**
   * 获取顶部菜单项（页面切换）
   */
  private getTopMenuItems(): CircularMenuItem[] {
    return [
      {
        id: 'model',
        label: t('pages.modelDesigner'),
        active: this.state.currentPage === 'model',
        onClick: () => this.handlePageChange('model'),
      },
      {
        id: 'query',
        label: t('pages.queryDesigner'),
        active: this.state.currentPage === 'query',
        onClick: () => this.handlePageChange('query'),
      },
    ];
  }

  /**
   * 获取左侧菜单项（操作模式）
   */
  private getLeftMenuItems(): CircularMenuItem[] {
    return [
      {
        id: 'select',
        label: t('modes.select.label'),
        icon: MODE_ICONS.select,
        active: this.state.currentMode === 'select',
        onClick: () => this.handleModeChange('select'),
      },
      {
        id: 'create',
        label: t('modes.create.label'),
        icon: MODE_ICONS.create,
        active: this.state.currentMode === 'create',
        onClick: () => this.handleModeChange('create'),
      },
      {
        id: 'copy',
        label: t('modes.copy.label'),
        icon: MODE_ICONS.copy,
        active: this.state.currentMode === 'copy',
        onClick: () => this.handleModeChange('copy'),
      },
      {
        id: 'delete',
        label: t('modes.delete.label'),
        icon: MODE_ICONS.delete,
        active: this.state.currentMode === 'delete',
        onClick: () => this.handleModeChange('delete'),
      },
      {
        id: 'multiSelect',
        label: t('modes.multiSelect.label'),
        icon: MODE_ICONS.multiSelect,
        active: this.state.currentMode === 'multiSelect',
        onClick: () => this.handleModeChange('multiSelect'),
      },
      {
        id: 'connect',
        label: t('modes.connect.label'),
        icon: MODE_ICONS.connect,
        active: this.state.currentMode === 'connect',
        onClick: () => this.handleModeChange('connect'),
      },
    ];
  }

  /**
   * 获取底部菜单项（视图操作）
   */
  private getBottomMenuItems(): CircularMenuItem[] {
    const showUndoRedo = this.state.currentPage === 'model';

    const items: CircularMenuItem[] = [
      {
        id: 'pan',
        label: t('modes.pan.label'),
        icon: MODE_ICONS.pan,
        active: this.state.currentMode === 'pan',
        onClick: () => this.handleModeChange('pan'),
      },
      {
        id: 'zoom',
        label: t('modes.zoom.label'),
        icon: MODE_ICONS.zoom,
        active: this.state.currentMode === 'zoom',
        onClick: () => this.handleModeChange('zoom'),
      },
    ];

    if (showUndoRedo) {
      items.push(
        {
          id: 'undo',
          label: t('actions.undo'),
          icon: '↶',
          active: false,
          onClick: () => this.handleUndo(),
        },
        {
          id: 'redo',
          label: t('actions.redo'),
          icon: '↷',
          active: false,
          onClick: () => this.handleRedo(),
        }
      );
    }

    items.push(
      {
        id: 'save',
        label: t('actions.save'),
        icon: '💾',
        active: false,
        onClick: () => this.handleSave(),
      },
      {
        id: 'export',
        label: t('actions.export'),
        icon: '📤',
        active: false,
        onClick: () => this.handleExport(),
      }
    );

    return items;
  }

  /**
   * 处理撤销
   */
  private handleUndo = (): void => {
    window.dispatchEvent(new CustomEvent('model-designer-undo'));
  };

  /**
   * 处理重做
   */
  private handleRedo = (): void => {
    window.dispatchEvent(new CustomEvent('model-designer-redo'));
  };

  /**
   * 处理保存
   */
  private handleSave = (): void => {
    window.dispatchEvent(new CustomEvent('model-designer-save'));
  };

  /**
   * 处理导出
   */
  private handleExport = (): void => {
    window.dispatchEvent(new CustomEvent('model-designer-export'));
  };

  /**
   * 渲染中心内容
   */
  private renderCenterContent(): React.ReactNode {
    switch (this.state.currentPage) {
      case 'model':
        return (
          <ModelDesignerComponent
            currentMode={this.state.currentMode}
            onModeChange={this.handleModeChange}
          />
        );
      case 'query':
        return <QueryDesignerComponent />;
      case 'result':
        return <ResultViewerComponent />;
      default:
        return (
          <ModelDesignerComponent
            currentMode={this.state.currentMode}
            onModeChange={this.handleModeChange}
          />
        );
    }
  }

  /**
   * 渲染方法
   */
  public render(): React.ReactNode {
    return (
      <LayoutComponent
        topMenu={
          <CircularMenu
            items={this.getTopMenuItems()}
            position="top"
            size={80}
            gap={16}
          />
        }
        leftMenu={
          <CircularMenu
            items={this.getLeftMenuItems()}
            position="left"
            size={64}
            gap={12}
          />
        }
        bottomMenu={
          <CircularMenu
            items={this.getBottomMenuItems()}
            position="bottom"
            size={64}
            gap={12}
          />
        }
        center={
          <div className="app-content">
            <div className="app-main">
              {this.renderCenterContent()}
            </div>
          </div>
        }
        showTopMenu={true}
        showLeftMenu={true}
        showRightMenu={false}
        showBottomMenu={true}
      />
    );
  }
}
