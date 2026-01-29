/**
 * 应用模式类型定义
 */

import { t } from '../i18n';

export type AppMode = 
  | 'select'      // 选择模式
  | 'create'      // 创建模式
  | 'copy'        // 复制模式
  | 'delete'      // 删除模式
  | 'multiSelect' // 多选模式
  | 'connect'     // 连接模式（创建关系）
  | 'pan'         // 平移模式
  | 'zoom';       // 缩放模式

export interface ModeConfig {
  mode: AppMode;
  label: string;
  icon?: string;
  description?: string;
}

/**
 * 模式图标配置（图标不需要国际化）
 */
export const MODE_ICONS: Record<AppMode, string> = {
  select: '👆',
  create: '🆕',
  copy: '📋',
  delete: '🗑️',
  multiSelect: '☑️',
  connect: '🔗',
  pan: '✋',
  zoom: '🔍',
};

/**
 * 获取模式配置（支持 i18n）
 */
export function getModeConfig(mode: AppMode): ModeConfig {
  return {
    mode,
    label: t(`modes.${mode}.label`),
    icon: MODE_ICONS[mode],
    description: t(`modes.${mode}.description`),
  };
}

/**
 * 获取所有模式配置（支持 i18n）
 */
export function getAllModeConfigs(): Record<AppMode, ModeConfig> {
  const modes: AppMode[] = ['select', 'create', 'copy', 'delete', 'multiSelect', 'connect', 'pan', 'zoom'];
  const configs: Record<AppMode, ModeConfig> = {} as Record<AppMode, ModeConfig>;
  
  for (const mode of modes) {
    configs[mode] = getModeConfig(mode);
  }
  
  return configs;
}

/**
 * 静态模式配置（用于需要静态配置的场景，不使用 i18n）
 * @deprecated 建议使用 getModeConfig 或 getAllModeConfigs
 */
export const MODE_CONFIGS: Record<AppMode, ModeConfig> = {
  select: {
    mode: 'select',
    label: 'Select',
    icon: '👆',
    description: 'Select and move entities',
  },
  create: {
    mode: 'create',
    label: 'Create',
    icon: '🆕',
    description: 'Click to create new entity',
  },
  copy: {
    mode: 'copy',
    label: 'Copy',
    icon: '📋',
    description: 'Click entity to copy',
  },
  delete: {
    mode: 'delete',
    label: 'Delete',
    icon: '🗑️',
    description: 'Click entity to delete',
  },
  multiSelect: {
    mode: 'multiSelect',
    label: 'Multi',
    icon: '☑️',
    description: 'Select multiple entities',
  },
  connect: {
    mode: 'connect',
    label: 'Connect',
    icon: '🔗',
    description: 'Connect entities with relationships',
  },
  pan: {
    mode: 'pan',
    label: 'Pan',
    icon: '✋',
    description: 'Pan the canvas',
  },
  zoom: {
    mode: 'zoom',
    label: 'Zoom',
    icon: '🔍',
    description: 'Zoom in/out',
  },
};
