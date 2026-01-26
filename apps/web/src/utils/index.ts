/**
 * 工具函数统一导出
 */

// 导出请求相关
export { default as request } from './request';
export { HttpClient } from './request/HttpClient';
export { RequestFactory } from './request/RequestFactory';
export type { HttpClientConfig } from './request/HttpClient';
export type { RequestConfig, ResponseData } from './request/types';

// 导出存储工具
export { StorageUtil, localStorageUtil, sessionStorageUtil } from './storage/StorageUtil';

// 导出状态码工具
export { StatusCodeUtil } from './status/StatusCodeUtil';

// 导出URL构建工具
export { URLBuilder } from './url/URLBuilder';

// 导出拦截器管理器
export {
  InterceptorManager,
  RequestInterceptorManager,
  ResponseInterceptorManager,
  ErrorInterceptorManager,
} from './interceptor/InterceptorManager';
export type {
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './interceptor/InterceptorManager';

// 导出状态码相关（从 shared 包）
export {
  ResponseStatus,
  BusinessStatus,
  StatusMessage,
  getStatusMessage,
  isSuccessStatus,
  isAuthError,
} from '@app/shared/src/status';
