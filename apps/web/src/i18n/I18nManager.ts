/**
 * 国际化管理器
 * 负责管理多语言文本的加载、切换和获取
 */

export type Locale = 'zh-CN' | 'en-US';

/**
 * 语言包类型定义
 */
export interface LocaleMessages {
  // 通用
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    confirm: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    ok: string;
    search: string;
    reset: string;
    export: string;
    import: string;
  };

  // 应用模式
  modes: {
    select: {
      label: string;
      description: string;
    };
    create: {
      label: string;
      description: string;
    };
    copy: {
      label: string;
      description: string;
    };
    delete: {
      label: string;
      description: string;
    };
    multiSelect: {
      label: string;
      description: string;
    };
    connect: {
      label: string;
      description: string;
    };
    pan: {
      label: string;
      description: string;
    };
    zoom: {
      label: string;
      description: string;
    };
  };

  // 页面导航
  pages: {
    modelDesigner: string;
    queryDesigner: string;
    resultViewer: string;
  };

  // 操作按钮
  actions: {
    undo: string;
    redo: string;
    save: string;
    export: string;
    zoomIn: string;
    zoomOut: string;
    fitView: string;
  };

  // Model Designer
  modelDesigner: {
    title: string;
    emptyTitle: string;
    emptyDescription: string;
    // 工作栏
    workbench: {
      hierarchy: string;
      properties: string;
      settings: string;
    };
    // 实体属性
    entity: {
      metadata: string;
      name: string;
      description: string;
      color: string;
      fields: string;
      noFields: string;
      addFirstField: string;
      fieldName: string;
      fieldType: string;
      fieldRequired: string;
      selectEntity: string;
    };
    // 字段类型
    fieldTypes: {
      string: string;
      number: string;
      boolean: string;
      date: string;
      text: string;
      integer: string;
      float: string;
      uuid: string;
    };
    // 层级面板
    hierarchy: {
      title: string;
      empty: string;
    };
  };

  // Query Designer
  queryDesigner: {
    title: string;
  };

  // Result Viewer
  resultViewer: {
    title: string;
  };

  // 设置
  settings: {
    title: string;
    language: string;
    theme: string;
    comingSoon: string;
  };
}

/**
 * 国际化管理器配置
 */
export interface I18nManagerConfig {
  defaultLocale?: Locale;
  storageKey?: string;
}

/**
 * 国际化管理器类
 */
export class I18nManager {
  private static instance: I18nManager;
  private currentLocale: Locale;
  private messages: Map<Locale, LocaleMessages> = new Map();
  private listeners: Set<(locale: Locale) => void> = new Set();
  private config: Required<I18nManagerConfig>;

  private constructor(config: I18nManagerConfig = {}) {
    this.config = {
      defaultLocale: config.defaultLocale || 'zh-CN',
      storageKey: config.storageKey || 'app-locale',
    };

    // 从 localStorage 加载语言设置
    const savedLocale = localStorage.getItem(this.config.storageKey) as Locale | null;
    this.currentLocale = savedLocale || this.config.defaultLocale;
  }

  /**
   * 获取单例实例
   */
  public static getInstance(config?: I18nManagerConfig): I18nManager {
    if (!I18nManager.instance) {
      I18nManager.instance = new I18nManager(config);
    }
    return I18nManager.instance;
  }

  /**
   * 注册语言包
   */
  public registerLocale(locale: Locale, messages: LocaleMessages): void {
    this.messages.set(locale, messages);
  }

  /**
   * 获取当前语言
   */
  public getLocale(): Locale {
    return this.currentLocale;
  }

  /**
   * 设置当前语言
   */
  public setLocale(locale: Locale): void {
    if (!this.messages.has(locale)) {
      console.warn(`Locale "${locale}" is not registered.`);
      return;
    }

    this.currentLocale = locale;
    localStorage.setItem(this.config.storageKey, locale);
    this.notifyListeners();
  }

  /**
   * 获取所有已注册的语言
   */
  public getAvailableLocales(): Locale[] {
    return Array.from(this.messages.keys());
  }

  /**
   * 获取翻译文本
   * @param key 点分隔的键路径，如 'modes.select.label'
   * @param params 可选的插值参数
   */
  public t(key: string, params?: Record<string, string | number>): string {
    const messages = this.messages.get(this.currentLocale);
    if (!messages) {
      console.warn(`No messages found for locale "${this.currentLocale}"`);
      return key;
    }

    // 按点分隔解析键路径
    const keys = key.split('.');
    let value: any = messages;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for locale "${this.currentLocale}"`);
        return key;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`);
      return key;
    }

    // 处理插值参数
    if (params) {
      return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
        return params[paramKey]?.toString() || `{${paramKey}}`;
      });
    }

    return value;
  }

  /**
   * 订阅语言变化
   */
  public subscribe(listener: (locale: Locale) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * 通知所有监听器
   */
  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentLocale));
  }
}

// 导出单例实例
export const i18n = I18nManager.getInstance();

// 导出便捷函数
export const t = (key: string, params?: Record<string, string | number>): string => {
  return i18n.t(key, params);
};
