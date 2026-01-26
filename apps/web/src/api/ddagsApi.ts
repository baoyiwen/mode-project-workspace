/**
 * DDAGS API
 * 定义所有API调用方法
 */

import request from '../utils/request';
import type { HelloResponse } from '@app/shared/src/types';

/**
 * 获取Hello消息
 */
export const getHello = async (): Promise<HelloResponse> => {
  const response = await request.get<HelloResponse>('/api/hello');
  return response.data;
};

// 可以在这里添加更多API方法
// 例如：
// export const getModels = async () => {
//   const response = await request.get('/api/models');
//   return response.data;
// };
