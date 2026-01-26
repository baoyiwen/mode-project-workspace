/**
 * 状态码工具类
 * 封装状态码相关的判断和处理逻辑
 */

import {
  ResponseStatus,
  BusinessStatus,
  StatusMessage,
  getStatusMessage as getStatusMessageFunc,
  isSuccessStatus as isSuccessStatusFunc,
  isAuthError as isAuthErrorFunc,
} from '@app/shared/src/status';

export class StatusCodeUtil {
  /**
   * 获取状态码对应的消息
   * @param code 状态码
   * @returns 状态消息
   */
  public static getMessage(code: number): string {
    return getStatusMessageFunc(code);
  }

  /**
   * 判断状态码是否表示成功
   * @param code 状态码
   * @returns 是否成功
   */
  public static isSuccess(code: number): boolean {
    return isSuccessStatusFunc(code);
  }

  /**
   * 判断状态码是否为认证错误
   * @param code 状态码
   * @returns 是否为认证错误
   */
  public static isAuthError(code: number): boolean {
    return isAuthErrorFunc(code);
  }

  /**
   * 判断状态码是否为客户端错误（4xx）
   * @param code 状态码
   * @returns 是否为客户端错误
   */
  public static isClientError(code: number): boolean {
    return code >= 400 && code < 500;
  }

  /**
   * 判断状态码是否为服务器错误（5xx）
   * @param code 状态码
   * @returns 是否为服务器错误
   */
  public static isServerError(code: number): boolean {
    return code >= 500 && code < 600;
  }

  /**
   * 判断状态码是否为业务错误（1000+）
   * @param code 状态码
   * @returns 是否为业务错误
   */
  public static isBusinessError(code: number): boolean {
    return code >= BusinessStatus.FAILED;
  }

  /**
   * 获取状态码类型
   * @param code 状态码
   * @returns 状态码类型
   */
  public static getStatusType(code: number): 'success' | 'client_error' | 'server_error' | 'business_error' | 'unknown' {
    if (this.isSuccess(code)) {
      return 'success';
    }
    if (this.isBusinessError(code)) {
      return 'business_error';
    }
    if (this.isClientError(code)) {
      return 'client_error';
    }
    if (this.isServerError(code)) {
      return 'server_error';
    }
    return 'unknown';
  }

  /**
   * 获取状态码对应的HTTP状态码枚举值
   * @param code 状态码
   * @returns ResponseStatus枚举值或null
   */
  public static getResponseStatus(code: number): ResponseStatus | null {
    if (Object.values(ResponseStatus).includes(code as ResponseStatus)) {
      return code as ResponseStatus;
    }
    return null;
  }

  /**
   * 获取状态码对应的业务状态码枚举值
   * @param code 状态码
   * @returns BusinessStatus枚举值或null
   */
  public static getBusinessStatus(code: number): BusinessStatus | null {
    if (Object.values(BusinessStatus).includes(code as BusinessStatus)) {
      return code as BusinessStatus;
    }
    return null;
  }

  /**
   * 验证状态码是否有效
   * @param code 状态码
   * @returns 是否有效
   */
  public static isValid(code: number): boolean {
    return (
      this.getResponseStatus(code) !== null ||
      this.getBusinessStatus(code) !== null ||
      StatusMessage[code] !== undefined
    );
  }
}
