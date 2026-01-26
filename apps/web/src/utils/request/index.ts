/**
 * 请求工具统一导出
 */

// 导出 HTTP 客户端类
export { HttpClient } from './HttpClient';
export type { HttpClientConfig } from './HttpClient';

// 导出请求工厂类
export { RequestFactory } from './RequestFactory';

// 导出类型定义
export type { RequestConfig, ResponseData } from './types';
export { HttpMethod } from './types';

// 创建默认实例
import { RequestFactory } from './RequestFactory';
const defaultClient = RequestFactory.createDefaultClient();

// 导出默认实例（保持向后兼容）
export default defaultClient;
