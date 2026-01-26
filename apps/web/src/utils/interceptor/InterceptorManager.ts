/**
 * 拦截器管理器类
 * 管理请求、响应和错误拦截器
 */

import type { RequestConfig, ResponseData } from '../request/types';

/**
 * 请求拦截器类型
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;

/**
 * 响应拦截器类型
 */
export type ResponseInterceptor = <T>(response: Response, data: ResponseData<T>) => ResponseData<T> | Promise<ResponseData<T>>;

/**
 * 错误拦截器类型
 */
export type ErrorInterceptor = (error: Error) => void | Promise<void>;

/**
 * 拦截器管理器类
 */
export class InterceptorManager<T extends RequestInterceptor | ResponseInterceptor | ErrorInterceptor> {
  private interceptors: T[] = [];

  /**
   * 添加拦截器
   * @param interceptor 拦截器函数
   * @returns 拦截器ID（用于移除）
   */
  public add(interceptor: T): number {
    const id = this.interceptors.length;
    this.interceptors.push(interceptor);
    return id;
  }

  /**
   * 移除拦截器
   * @param id 拦截器ID
   */
  public remove(id: number): void {
    if (id >= 0 && id < this.interceptors.length) {
      this.interceptors.splice(id, 1);
    }
  }

  /**
   * 清空所有拦截器
   */
  public clear(): void {
    this.interceptors = [];
  }

  /**
   * 获取所有拦截器
   * @returns 拦截器数组
   */
  public getAll(): T[] {
    return [...this.interceptors];
  }

  /**
   * 获取拦截器数量
   * @returns 拦截器数量
   */
  public getCount(): number {
    return this.interceptors.length;
  }
}

/**
 * 请求拦截器管理器
 */
export class RequestInterceptorManager extends InterceptorManager<RequestInterceptor> {
  /**
   * 应用所有请求拦截器
   * @param config 请求配置
   * @returns 处理后的请求配置
   */
  public async apply(config: RequestConfig): Promise<RequestConfig> {
    let finalConfig = config;
    for (const interceptor of this.getAll()) {
      finalConfig = await interceptor(finalConfig);
    }
    return finalConfig;
  }
}

/**
 * 响应拦截器管理器
 */
export class ResponseInterceptorManager extends InterceptorManager<ResponseInterceptor> {
  /**
   * 应用所有响应拦截器
   * @param response HTTP响应对象
   * @param data 响应数据
   * @returns 处理后的响应数据
   */
  public async apply<T>(response: Response, data: ResponseData<T>): Promise<ResponseData<T>> {
    let finalData = data;
    for (const interceptor of this.getAll()) {
      finalData = await interceptor(response, finalData);
    }
    return finalData;
  }
}

/**
 * 错误拦截器管理器
 */
export class ErrorInterceptorManager extends InterceptorManager<ErrorInterceptor> {
  /**
   * 应用所有错误拦截器
   * @param error 错误对象
   */
  public async apply(error: Error): Promise<void> {
    for (const interceptor of this.getAll()) {
      await interceptor(error);
    }
  }
}
