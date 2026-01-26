/**
 * HTTP 客户端类
 * 基于 fetch API 实现的 HTTP 请求客户端
 */

import { URLBuilder } from '../url/URLBuilder';
import {
  RequestInterceptorManager,
  ResponseInterceptorManager,
  ErrorInterceptorManager,
} from '../interceptor/InterceptorManager';
import { StorageUtil } from '../storage/StorageUtil';
import { StatusCodeUtil } from '../status/StatusCodeUtil';
import { ConfigManager } from '../../config/ConfigManager';
import type { RequestConfig, ResponseData } from './types';
import { HttpMethod } from './types';

/**
 * HTTP 客户端配置接口
 */
export interface HttpClientConfig {
  /** 基础URL */
  baseURL?: string;
  /** 默认超时时间（毫秒） */
  timeout?: number;
  /** 存储工具实例 */
  storage?: StorageUtil;
  /** 配置管理器实例 */
  configManager?: ConfigManager;
}

/**
 * HTTP 客户端类
 */
export class HttpClient {
  private baseURL: string;
  private timeout: number;
  private requestInterceptorManager: RequestInterceptorManager;
  private responseInterceptorManager: ResponseInterceptorManager;
  private errorInterceptorManager: ErrorInterceptorManager;
  private storage: StorageUtil;
  private configManager: ConfigManager;

  /**
   * 构造函数
   * @param config 客户端配置
   */
  constructor(config: HttpClientConfig = {}) {
    this.configManager = config.configManager || ConfigManager.getInstance();
    const appConfig = this.configManager.getAppConfig();
    
    this.baseURL = config.baseURL || appConfig.apiBaseURL;
    this.timeout = config.timeout || appConfig.requestTimeout;
    this.storage = config.storage || new StorageUtil('localStorage');
    
    this.requestInterceptorManager = new RequestInterceptorManager();
    this.responseInterceptorManager = new ResponseInterceptorManager();
    this.errorInterceptorManager = new ErrorInterceptorManager();
  }

  /**
   * 添加请求拦截器
   * @param interceptor 拦截器函数
   * @returns 拦截器ID
   */
  public addRequestInterceptor(interceptor: Parameters<RequestInterceptorManager['add']>[0]): number {
    return this.requestInterceptorManager.add(interceptor);
  }

  /**
   * 添加响应拦截器
   * @param interceptor 拦截器函数
   * @returns 拦截器ID
   */
  public addResponseInterceptor(interceptor: Parameters<ResponseInterceptorManager['add']>[0]): number {
    return this.responseInterceptorManager.add(interceptor);
  }

  /**
   * 添加错误拦截器
   * @param interceptor 拦截器函数
   * @returns 拦截器ID
   */
  public addErrorInterceptor(interceptor: Parameters<ErrorInterceptorManager['add']>[0]): number {
    return this.errorInterceptorManager.add(interceptor);
  }

  /**
   * 构建完整 URL
   */
  private buildURL(url: string, params?: Record<string, any>): string {
    return URLBuilder.build(this.baseURL, url, params);
  }

  /**
   * 创建超时 Promise
   */
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * 处理请求体
   */
  private processRequestBody(body: any, headers: HeadersInit): { body: string | undefined; headers: HeadersInit } {
    let processedBody: string | undefined;
    const processedHeaders = { ...headers };

    if (body) {
      if (typeof body === 'string') {
        processedBody = body;
      } else if (body instanceof FormData) {
        processedBody = undefined;
        if (typeof processedHeaders === 'object' && processedHeaders !== null && 'Content-Type' in processedHeaders) {
          // @ts-ignore
          delete processedHeaders['Content-Type'];
        }
      } else {
        processedBody = JSON.stringify(body);
      }
    }

    return { body: processedBody, headers: processedHeaders };
  }

  /**
   * 解析响应数据
   */
  private async parseResponseData<T>(response: Response): Promise<ResponseData<T>> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      const text = await response.text();
      return {
        code: response.status,
        message: 'Success',
        data: text as any,
      };
    }
  }

  /**
   * 核心请求方法
   */
  private async request<T = any>(url: string, config: RequestConfig = {}): Promise<ResponseData<T>> {
    try {
      // 应用请求拦截器
      let finalConfig = await this.requestInterceptorManager.apply(config);

      // 构建完整 URL
      const fullURL = this.buildURL(url, finalConfig.params);

      // 设置默认 headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...finalConfig.headers,
      };

      // 处理请求体
      const { body, headers: processedHeaders } = this.processRequestBody(finalConfig.body, headers);

      // 创建请求配置
      const requestInit: RequestInit = {
        ...finalConfig,
        headers: processedHeaders,
        body: body || finalConfig.body,
      };

      // 执行请求（带超时控制）
      const timeout = finalConfig.timeout || this.timeout;
      const fetchPromise = fetch(fullURL, requestInit);
      const timeoutPromise = this.createTimeoutPromise(timeout);

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 解析响应数据
      const data = await this.parseResponseData<T>(response);

      // 应用响应拦截器
      const finalData = await this.responseInterceptorManager.apply(response, data);

      return finalData;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));

      // 应用错误拦截器
      await this.errorInterceptorManager.apply(err);

      // 如果配置了显示错误，可以在这里添加错误提示逻辑
      if (config.showError !== false) {
        console.error('Request error:', err.message);
      }

      throw err;
    }
  }

  /**
   * GET 请求
   */
  public get<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.GET });
  }

  /**
   * POST 请求
   */
  public post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>(url, {
      ...config,
      method: HttpMethod.POST,
      body: data,
    });
  }

  /**
   * PUT 请求
   */
  public put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>(url, {
      ...config,
      method: HttpMethod.PUT,
      body: data,
    });
  }

  /**
   * PATCH 请求
   */
  public patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>(url, {
      ...config,
      method: HttpMethod.PATCH,
      body: data,
    });
  }

  /**
   * DELETE 请求
   */
  public delete<T = any>(url: string, config?: RequestConfig): Promise<ResponseData<T>> {
    return this.request<T>(url, { ...config, method: HttpMethod.DELETE });
  }

  /**
   * 获取存储工具实例
   */
  public getStorage(): StorageUtil {
    return this.storage;
  }

  /**
   * 获取配置管理器实例
   */
  public getConfigManager(): ConfigManager {
    return this.configManager;
  }
}
