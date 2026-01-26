/**
 * 存储工具类
 * 封装 localStorage 和 sessionStorage 操作
 */
export class StorageUtil {
  /**
   * 存储类型枚举
   */
  public static readonly StorageType = {
    LOCAL: 'localStorage',
    SESSION: 'sessionStorage',
  } as const;

  private storage: Storage;

  /**
   * 构造函数
   * @param type 存储类型，默认为 localStorage
   */
  constructor(type: 'localStorage' | 'sessionStorage' = 'localStorage') {
    this.storage = type === 'localStorage' ? window.localStorage : window.sessionStorage;
  }

  /**
   * 设置存储项
   * @param key 键名
   * @param value 值（会自动序列化为JSON）
   */
  public setItem<T>(key: string, value: T): void {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`StorageUtil.setItem error:`, error);
      throw new Error(`Failed to set item: ${key}`);
    }
  }

  /**
   * 获取存储项
   * @param key 键名
   * @param defaultValue 默认值（如果不存在）
   * @returns 存储的值，如果不存在则返回默认值
   */
  public getItem<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`StorageUtil.getItem error:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * 获取字符串类型的存储项（不进行JSON解析）
   * @param key 键名
   * @param defaultValue 默认值
   * @returns 存储的字符串值
   */
  public getString(key: string, defaultValue: string = ''): string {
    return this.storage.getItem(key) ?? defaultValue;
  }

  /**
   * 设置字符串类型的存储项（不进行JSON序列化）
   * @param key 键名
   * @param value 字符串值
   */
  public setString(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  /**
   * 删除存储项
   * @param key 键名
   */
  public removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  /**
   * 清空所有存储项
   */
  public clear(): void {
    this.storage.clear();
  }

  /**
   * 检查存储项是否存在
   * @param key 键名
   * @returns 是否存在
   */
  public hasItem(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  /**
   * 获取所有键名
   * @returns 键名数组
   */
  public getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        keys.push(key);
      }
    }
    return keys;
  }

  /**
   * 获取存储大小（字节数，近似值）
   * @returns 存储大小
   */
  public getSize(): number {
    let size = 0;
    for (const key in this.storage) {
      if (this.storage.hasOwnProperty(key)) {
        size += this.storage[key].length + key.length;
      }
    }
    return size;
  }
}

/**
 * 默认的 localStorage 实例
 */
export const localStorageUtil = new StorageUtil('localStorage');

/**
 * 默认的 sessionStorage 实例
 */
export const sessionStorageUtil = new StorageUtil('sessionStorage');
