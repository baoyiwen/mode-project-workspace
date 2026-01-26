/**
 * 请求工具使用示例
 * 此文件仅作为示例参考，不会被实际使用
 */

import request from './request';
import type { ResponseData } from './request';
import { ResponseStatus, BusinessStatus, isSuccessStatus, isAuthError } from './index';

// 示例 1: GET 请求
async function exampleGet() {
  try {
    const response = await request.get<{ message: string }>('/api/hello');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 2: GET 请求带参数
async function exampleGetWithParams() {
  try {
    const response = await request.get('/api/users', {
      params: {
        page: 1,
        pageSize: 10,
        keyword: 'search',
      },
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 3: POST 请求
async function examplePost() {
  try {
    const response = await request.post<{ id: number; name: string }>('/api/users', {
      name: 'John Doe',
      email: 'john@example.com',
    });
    console.log('Created user:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 4: PUT 请求
async function examplePut() {
  try {
    const response = await request.put('/api/users/1', {
      name: 'Jane Doe',
      email: 'jane@example.com',
    });
    console.log('Updated user:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 5: DELETE 请求
async function exampleDelete() {
  try {
    const response = await request.delete('/api/users/1');
    console.log('Deleted:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 6: 上传文件（FormData）
async function exampleUploadFile(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await request.post('/api/upload', formData, {
      // FormData 会自动处理，不需要手动设置 Content-Type
    });
    console.log('Uploaded:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 7: 自定义配置
async function exampleCustomConfig() {
  try {
    const response = await request.get('/api/data', {
      timeout: 5000, // 自定义超时时间
      showError: false, // 不显示错误提示
      headers: {
        'Custom-Header': 'custom-value',
      },
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 8: 使用状态枚举判断响应
async function exampleWithStatusCheck() {
  try {
    const response = await request.get('/api/data');
    
    // 使用状态枚举判断是否成功
    if (isSuccessStatus(response.code)) {
      console.log('请求成功:', response.data);
    } else {
      console.error('请求失败，状态码:', response.code);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 9: 处理特定状态码
async function exampleHandleSpecificStatus() {
  try {
    const response = await request.get('/api/data');
    
    // 使用状态枚举判断特定状态
    if (response.code === ResponseStatus.NOT_FOUND) {
      console.log('资源不存在');
    } else if (response.code === BusinessStatus.DATA_NOT_FOUND) {
      console.log('数据不存在');
    } else if (isAuthError(response.code)) {
      console.log('需要重新登录');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// 示例 10: 添加自定义拦截器
function setupCustomInterceptors() {
  // 添加请求拦截器
  request.addRequestInterceptor((config) => {
    // 在请求前添加时间戳
    config.headers = {
      ...config.headers,
      'X-Request-Time': new Date().toISOString(),
    };
    return config;
  });

  // 添加响应拦截器
  request.addResponseInterceptor((response, data) => {
    // 使用状态枚举统一处理响应数据
    if (isAuthError(data.code)) {
      // 未授权，跳转到登录页
      window.location.href = '/login';
    }
    
    // 处理业务状态码
    if (data.code === BusinessStatus.TOKEN_EXPIRED) {
      console.warn('Token 已过期');
    }
    
    return data;
  });

  // 添加错误拦截器
  request.addErrorInterceptor((error) => {
    // 统一处理错误
    if (error.message.includes('timeout')) {
      console.error('请求超时，请稍后重试');
    }
  });
}

export {
  exampleGet,
  exampleGetWithParams,
  examplePost,
  examplePut,
  exampleDelete,
  exampleUploadFile,
  exampleCustomConfig,
  exampleWithStatusCheck,
  exampleHandleSpecificStatus,
  setupCustomInterceptors,
};
