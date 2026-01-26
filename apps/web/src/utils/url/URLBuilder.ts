/**
 * URL 构建工具类
 * 封装 URL 构建和参数处理逻辑
 */
export class URLBuilder {
  private baseURL: string;
  private path: string;
  private params: Map<string, string | string[]> = new Map();

  /**
   * 构造函数
   * @param baseURL 基础URL
   */
  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
    this.path = '';
  }

  /**
   * 设置路径
   * @param path 路径
   * @returns 当前实例（支持链式调用）
   */
  public setPath(path: string): this {
    this.path = path;
    return this;
  }

  /**
   * 添加查询参数
   * @param key 参数名
   * @param value 参数值
   * @returns 当前实例（支持链式调用）
   */
  public addParam(key: string, value: string | number | boolean | null | undefined): this {
    if (value !== null && value !== undefined) {
      this.params.set(key, String(value));
    }
    return this;
  }

  /**
   * 添加多个查询参数
   * @param params 参数对象
   * @returns 当前实例（支持链式调用）
   */
  public addParams(params: Record<string, any>): this {
    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          this.params.set(key, value.map(String));
        } else {
          this.params.set(key, String(value));
        }
      }
    });
    return this;
  }

  /**
   * 移除查询参数
   * @param key 参数名
   * @returns 当前实例（支持链式调用）
   */
  public removeParam(key: string): this {
    this.params.delete(key);
    return this;
  }

  /**
   * 清空所有查询参数
   * @returns 当前实例（支持链式调用）
   */
  public clearParams(): this {
    this.params.clear();
    return this;
  }

  /**
   * 构建完整的URL
   * @returns 完整的URL字符串
   */
  public build(): string {
    let url = this.path;

    // 如果路径不是完整URL，则拼接基础URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `${this.baseURL}${url}`;
    }

    // 构建查询字符串
    const searchParams = new URLSearchParams();
    this.params.forEach((value, key) => {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    });

    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }

    return url;
  }

  /**
   * 静态方法：快速构建URL
   * @param baseURL 基础URL
   * @param path 路径
   * @param params 查询参数
   * @returns 完整的URL字符串
   */
  public static build(baseURL: string, path: string, params?: Record<string, any>): string {
    const builder = new URLBuilder(baseURL);
    builder.setPath(path);
    if (params) {
      builder.addParams(params);
    }
    return builder.build();
  }

  /**
   * 解析URL
   * @param url 完整URL
   * @returns 解析后的对象
   */
  public static parse(url: string): {
    protocol: string;
    host: string;
    path: string;
    params: Record<string, string>;
  } {
    try {
      const urlObj = new URL(url);
      const params: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        params[key] = value;
      });

      return {
        protocol: urlObj.protocol,
        host: urlObj.host,
        path: urlObj.pathname,
        params,
      };
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }
}
