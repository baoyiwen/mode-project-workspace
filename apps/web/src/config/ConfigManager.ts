/**
 * 配置管理类
 * 封装配置的读取和管理逻辑
 */

import { CommonConfig, type ProjectConfig, type ThirdPartyConfig } from './CommonConfig';

/**
 * 应用配置接口
 */
export interface AppConfig {
  /** API 基础 URL */
  apiBaseURL: string;
  /** 请求超时时间（毫秒） */
  requestTimeout: number;
  /** 是否启用请求日志 */
  enableRequestLog: boolean;
  /** Token 存储键名 */
  tokenKey: string;
  /** 应用标题 */
  appTitle: string;
  /** 应用版本 */
  appVersion: string;
}

/**
 * 开发环境配置接口
 */
export interface DevConfig {
  /** 是否启用 Mock 数据 */
  enableMock: boolean;
  /** Mock API 基础 URL */
  mockApiBaseURL: string;
}

/**
 * 生产环境配置接口
 */
export interface ProdConfig {
  /** 是否启用错误上报 */
  enableErrorReport: boolean;
  /** 错误上报地址 */
  errorReportURL: string;
}

/**
 * 配置管理类
 */
export class ConfigManager {
  private static instance: ConfigManager;
  private appConfig: AppConfig;
  private devConfig: DevConfig;
  private prodConfig: ProdConfig;
  private commonConfig: CommonConfig;

  /**
   * 私有构造函数（单例模式）
   */
  private constructor() {
    this.appConfig = this.loadAppConfig();
    this.devConfig = this.loadDevConfig();
    this.prodConfig = this.loadProdConfig();
    this.commonConfig = CommonConfig.getInstance();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 获取环境变量值
   */
  private getEnvValue(key: string, defaultValue: string = ''): string {
    return import.meta.env[key] || defaultValue;
  }

  /**
   * 获取布尔类型环境变量
   */
  private getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * 获取数字类型环境变量
   */
  private getEnvNumber(key: string, defaultValue: number): number {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  }

  /**
   * 加载应用配置
   */
  private loadAppConfig(): AppConfig {
    return {
      apiBaseURL: this.getEnvValue('VITE_API_BASE_URL', 'http://localhost:3000'),
      requestTimeout: this.getEnvNumber('VITE_REQUEST_TIMEOUT', 10000),
      enableRequestLog: this.getEnvBoolean('VITE_ENABLE_REQUEST_LOG', false),
      tokenKey: this.getEnvValue('VITE_TOKEN_KEY', 'token'),
      appTitle: this.getEnvValue('VITE_APP_TITLE', 'Web App'),
      appVersion: this.getEnvValue('VITE_APP_VERSION', '1.0.0'),
    };
  }

  /**
   * 加载开发环境配置
   */
  private loadDevConfig(): DevConfig {
    return {
      enableMock: this.getEnvBoolean('VITE_ENABLE_MOCK', false),
      mockApiBaseURL: this.getEnvValue('VITE_MOCK_API_BASE_URL', 'http://localhost:3001'),
    };
  }

  /**
   * 加载生产环境配置
   */
  private loadProdConfig(): ProdConfig {
    return {
      enableErrorReport: this.getEnvBoolean('VITE_ENABLE_ERROR_REPORT', true),
      errorReportURL: this.getEnvValue('VITE_ERROR_REPORT_URL', ''),
    };
  }

  /**
   * 获取应用配置
   */
  public getAppConfig(): AppConfig {
    return { ...this.appConfig };
  }

  /**
   * 获取开发环境配置
   */
  public getDevConfig(): DevConfig {
    return { ...this.devConfig };
  }

  /**
   * 获取生产环境配置
   */
  public getProdConfig(): ProdConfig {
    return { ...this.prodConfig };
  }

  /**
   * 更新应用配置（运行时更新）
   */
  public updateAppConfig(updates: Partial<AppConfig>): void {
    this.appConfig = { ...this.appConfig, ...updates };
  }

  /**
   * 判断是否为开发环境
   */
  public isDev(): boolean {
    return import.meta.env.DEV;
  }

  /**
   * 判断是否为生产环境
   */
  public isProd(): boolean {
    return import.meta.env.PROD;
  }

  /**
   * 获取当前环境名称
   */
  public getEnvName(): string {
    return import.meta.env.MODE || 'development';
  }

  /**
   * 获取公共配置管理器
   */
  public getCommonConfig(): CommonConfig {
    return this.commonConfig;
  }

  /**
   * 获取项目配置
   */
  public getProjectConfig(): ProjectConfig {
    return this.commonConfig.getProjectConfig();
  }

  /**
   * 获取第三方服务配置
   */
  public getThirdPartyConfig(): ThirdPartyConfig {
    return this.commonConfig.getThirdPartyConfig();
  }

  /**
   * 获取特定第三方服务配置
   */
  public getThirdPartyService<K extends keyof ThirdPartyConfig>(
    service: K
  ): ThirdPartyConfig[K] {
    return this.commonConfig.getThirdPartyService(service);
  }
}

/**
 * 默认配置管理器实例
 */
export const configManager = ConfigManager.getInstance();

/**
 * 导出便捷方法
 */
export const appConfig = configManager.getAppConfig();
export const devConfig = configManager.getDevConfig();
export const prodConfig = configManager.getProdConfig();
export const isDev = configManager.isDev();
export const isProd = configManager.isProd();
export const envName = configManager.getEnvName();
