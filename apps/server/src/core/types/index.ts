/**
 * 核心类型定义
 * 纯类型定义，无IO操作
 */

// 导出共享类型
export * from '@app/shared/src/types';

// 可以在这里添加后端特定的类型定义
export interface BaseEntity {
  id: string | number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
