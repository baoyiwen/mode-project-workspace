/**
 * 请求相关的类型定义
 */

/**
 * 请求配置接口
 */
export interface RequestConfig extends RequestInit {
  /** 基础URL（会覆盖实例的baseURL） */
  baseURL?: string;
  /** 超时时间（毫秒） */
  timeout?: number;
  /** URL查询参数 */
  params?: Record<string, any>;
  /** 是否显示错误提示 */
  showError?: boolean;
  /** 是否显示加载提示 */
  showLoading?: boolean;
}

/**
 * 响应数据接口
 */
export interface ResponseData<T = any> {
  /** 状态码 */
  code: number;
  /** 消息 */
  message: string;
  /** 数据 */
  data: T;
}

/**
 * HTTP请求方法
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS',
}
