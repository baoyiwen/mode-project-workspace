/**
 * 后台接口状态码枚举
 * 统一管理前后端状态码定义
 */

/**
 * 接口响应状态码
 */
export enum ResponseStatus {
  /** 成功 */
  SUCCESS = 200,
  
  /** 请求参数错误 */
  BAD_REQUEST = 400,
  
  /** 未授权/未登录 */
  UNAUTHORIZED = 401,
  
  /** 无权限/禁止访问 */
  FORBIDDEN = 403,
  
  /** 资源不存在 */
  NOT_FOUND = 404,
  
  /** 请求方法不允许 */
  METHOD_NOT_ALLOWED = 405,
  
  /** 请求超时 */
  REQUEST_TIMEOUT = 408,
  
  /** 请求冲突 */
  CONFLICT = 409,
  
  /** 请求实体过大 */
  PAYLOAD_TOO_LARGE = 413,
  
  /** 请求参数格式错误 */
  UNPROCESSABLE_ENTITY = 422,
  
  /** 请求过于频繁 */
  TOO_MANY_REQUESTS = 429,
  
  /** 服务器内部错误 */
  INTERNAL_SERVER_ERROR = 500,
  
  /** 服务不可用 */
  SERVICE_UNAVAILABLE = 503,
  
  /** 网关超时 */
  GATEWAY_TIMEOUT = 504,
}

/**
 * 业务状态码（可根据实际业务扩展）
 */
export enum BusinessStatus {
  /** 业务处理成功 */
  SUCCESS = 200,
  
  /** 业务处理失败 */
  FAILED = 1000,
  
  /** 数据验证失败 */
  VALIDATION_ERROR = 1001,
  
  /** 数据已存在 */
  DATA_EXISTS = 1002,
  
  /** 数据不存在 */
  DATA_NOT_FOUND = 1003,
  
  /** 操作不允许 */
  OPERATION_NOT_ALLOWED = 1004,
  
  /** 登录过期 */
  TOKEN_EXPIRED = 1005,
  
  /** 账号被禁用 */
  ACCOUNT_DISABLED = 1006,
  
  /** 账号未激活 */
  ACCOUNT_NOT_ACTIVATED = 1007,
}

/**
 * 状态码对应的消息映射
 */
export const StatusMessage: Record<number, string> = {
  [ResponseStatus.SUCCESS]: '操作成功',
  [ResponseStatus.BAD_REQUEST]: '请求参数错误',
  [ResponseStatus.UNAUTHORIZED]: '未授权，请先登录',
  [ResponseStatus.FORBIDDEN]: '无权限访问',
  [ResponseStatus.NOT_FOUND]: '资源不存在',
  [ResponseStatus.METHOD_NOT_ALLOWED]: '请求方法不允许',
  [ResponseStatus.REQUEST_TIMEOUT]: '请求超时',
  [ResponseStatus.CONFLICT]: '请求冲突',
  [ResponseStatus.PAYLOAD_TOO_LARGE]: '请求数据过大',
  [ResponseStatus.UNPROCESSABLE_ENTITY]: '请求参数格式错误',
  [ResponseStatus.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后再试',
  [ResponseStatus.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ResponseStatus.SERVICE_UNAVAILABLE]: '服务暂不可用',
  [ResponseStatus.GATEWAY_TIMEOUT]: '网关超时',
  
  [BusinessStatus.FAILED]: '操作失败',
  [BusinessStatus.VALIDATION_ERROR]: '数据验证失败',
  [BusinessStatus.DATA_EXISTS]: '数据已存在',
  [BusinessStatus.DATA_NOT_FOUND]: '数据不存在',
  [BusinessStatus.OPERATION_NOT_ALLOWED]: '操作不允许',
  [BusinessStatus.TOKEN_EXPIRED]: '登录已过期，请重新登录',
  [BusinessStatus.ACCOUNT_DISABLED]: '账号已被禁用',
  [BusinessStatus.ACCOUNT_NOT_ACTIVATED]: '账号未激活',
};

/**
 * 获取状态码对应的消息
 */
export function getStatusMessage(code: number): string {
  return StatusMessage[code] || '未知错误';
}

/**
 * 判断状态码是否表示成功
 */
export function isSuccessStatus(code: number): boolean {
  return code === ResponseStatus.SUCCESS || code === BusinessStatus.SUCCESS;
}

/**
 * 判断状态码是否需要重新登录
 */
export function isAuthError(code: number): boolean {
  return code === ResponseStatus.UNAUTHORIZED || code === BusinessStatus.TOKEN_EXPIRED;
}
