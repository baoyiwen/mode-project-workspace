/**
 * 国际化模块入口
 * 自动注册所有语言包
 */

import { I18nManager, i18n, t } from './I18nManager';
import type { Locale, LocaleMessages, I18nManagerConfig } from './I18nManager';
import { zhCN, enUS } from './locales';

// 注册语言包
i18n.registerLocale('zh-CN', zhCN);
i18n.registerLocale('en-US', enUS);

// 导出类型
export type { Locale, LocaleMessages, I18nManagerConfig };

// 导出管理器和便捷函数
export { I18nManager, i18n, t };

// 导出语言包（供需要直接访问的场景）
export { zhCN, enUS };

/**
 * 语言配置（用于下拉选择等 UI）
 */
export const LOCALE_CONFIGS: Record<Locale, { label: string; nativeLabel: string }> = {
  'zh-CN': {
    label: 'Chinese (Simplified)',
    nativeLabel: '简体中文',
  },
  'en-US': {
    label: 'English (US)',
    nativeLabel: 'English',
  },
};
