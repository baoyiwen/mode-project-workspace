/**
 * 请求工厂类
 * 用于创建和配置 HTTP 客户端实例
 */

import { HttpClient, type HttpClientConfig } from './HttpClient';
import { StorageUtil } from '../storage/StorageUtil';
import { ConfigManager } from '../../config/ConfigManager';
import { StatusCodeUtil } from '../status/StatusCodeUtil';

/**
 * 请求工厂类
 */
export class RequestFactory {
  /**
   * 创建默认的 HTTP 客户端实例
   * @param config 可选的客户端配置
   * @returns HTTP 客户端实例
   */
  public static createDefaultClient(config?: HttpClientConfig): HttpClient {
    const configManager = config?.configManager || ConfigManager.getInstance();
    const storage = config?.storage || new StorageUtil('localStorage');
    const appConfig = configManager.getAppConfig();

    const client = new HttpClient({
      baseURL: config?.baseURL || appConfig.apiBaseURL,
      timeout: config?.timeout || appConfig.requestTimeout,
      storage,
      configManager,
    });

    // 设置默认请求拦截器：添加 token
    client.addRequestInterceptor((requestConfig) => {
      const token = storage.getString(appConfig.tokenKey);
      if (token) {
        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${token}`,
        };
      }

      // 如果启用了请求日志，记录请求信息
      if (appConfig.enableRequestLog) {
        console.log('[Request]', requestConfig.method || 'GET', requestConfig.baseURL || appConfig.apiBaseURL);
      }

      return requestConfig;
    });

    // 设置默认响应拦截器：统一处理响应
    client.addResponseInterceptor((_response, data) => {
      // 使用状态码工具类判断是否成功
      if (data.code && !StatusCodeUtil.isSuccess(data.code)) {
        // 如果是认证错误，清除 token 并跳转登录
        if (StatusCodeUtil.isAuthError(data.code)) {
          storage.removeItem(appConfig.tokenKey);
          // 可以在这里添加跳转登录页的逻辑
          // window.location.href = '/login';
        }

        // 使用状态码获取默认消息，如果没有提供消息
        const errorMessage = data.message || StatusCodeUtil.getMessage(data.code);
        throw new Error(errorMessage);
      }
      return data;
    });

    // 设置默认错误拦截器：统一处理错误
    client.addErrorInterceptor((error) => {
      // 可以在这里添加全局错误处理逻辑
      // 例如：跳转到登录页、显示错误提示等
      console.error('Request error:', error.message);
    });

    return client;
  }

  /**
   * 创建自定义的 HTTP 客户端实例
   * @param config 客户端配置
   * @returns HTTP 客户端实例
   */
  public static createCustomClient(config: HttpClientConfig): HttpClient {
    return new HttpClient(config);
  }
}
