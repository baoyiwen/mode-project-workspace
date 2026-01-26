# 工具类架构说明

## 概述

本项目严格按照 OOP（面向对象编程）思想设计，所有功能都封装为类，提高代码的复用性和可维护性，降低耦合度。

## 架构设计原则

1. **单一职责原则**：每个类只负责一个功能
2. **依赖注入**：通过构造函数注入依赖，降低耦合
3. **工厂模式**：使用工厂类创建实例
4. **单例模式**：配置管理等使用单例模式
5. **封装**：所有内部实现细节都封装在类内部

## 工具类结构

### 1. 配置管理类 (`config/ConfigManager.ts`)

**职责**：统一管理应用配置

**设计模式**：单例模式

**主要功能**：
- 读取环境变量
- 管理应用配置、开发环境配置、生产环境配置
- 提供类型安全的配置访问

**使用示例**：
```typescript
import { configManager } from '@/config';

const apiURL = configManager.getAppConfig().apiBaseURL;
```

### 2. 存储工具类 (`utils/storage/StorageUtil.ts`)

**职责**：封装 localStorage 和 sessionStorage 操作

**主要功能**：
- 自动 JSON 序列化/反序列化
- 类型安全的存储访问
- 存储大小计算
- 批量操作

**使用示例**：
```typescript
import { localStorageUtil } from '@/utils';

localStorageUtil.setItem('user', { name: 'John' });
const user = localStorageUtil.getItem<User>('user');
```

### 3. 状态码工具类 (`utils/status/StatusCodeUtil.ts`)

**职责**：封装状态码相关的判断和处理逻辑

**主要功能**：
- 判断状态码类型（成功、客户端错误、服务器错误等）
- 获取状态码消息
- 验证状态码有效性

**使用示例**：
```typescript
import { StatusCodeUtil } from '@/utils';

if (StatusCodeUtil.isSuccess(code)) {
  // 处理成功
}
```

### 4. URL 构建工具类 (`utils/url/URLBuilder.ts`)

**职责**：封装 URL 构建和参数处理逻辑

**设计模式**：建造者模式（支持链式调用）

**主要功能**：
- 构建完整 URL
- 处理查询参数
- 解析 URL

**使用示例**：
```typescript
import { URLBuilder } from '@/utils';

const url = new URLBuilder('http://api.example.com')
  .setPath('/users')
  .addParam('page', 1)
  .addParam('size', 10)
  .build();
```

### 5. 拦截器管理器类 (`utils/interceptor/InterceptorManager.ts`)

**职责**：管理请求、响应和错误拦截器

**主要功能**：
- 添加/移除拦截器
- 批量应用拦截器
- 拦截器生命周期管理

**使用示例**：
```typescript
import { RequestInterceptorManager } from '@/utils';

const manager = new RequestInterceptorManager();
manager.add((config) => {
  // 处理请求配置
  return config;
});
```

### 6. HTTP 客户端类 (`utils/request/HttpClient.ts`)

**职责**：封装 HTTP 请求逻辑

**设计模式**：依赖注入

**主要功能**：
- 支持 GET、POST、PUT、PATCH、DELETE 等方法
- 请求/响应拦截器
- 超时控制
- 错误处理

**依赖注入**：
- `StorageUtil`：存储操作
- `ConfigManager`：配置管理
- `URLBuilder`：URL 构建
- `StatusCodeUtil`：状态码处理

**使用示例**：
```typescript
import { HttpClient } from '@/utils';

const client = new HttpClient({
  baseURL: 'http://api.example.com',
  timeout: 5000,
});
```

### 7. 请求工厂类 (`utils/request/RequestFactory.ts`)

**职责**：创建和配置 HTTP 客户端实例

**设计模式**：工厂模式

**主要功能**：
- 创建默认配置的客户端
- 创建自定义配置的客户端
- 自动设置默认拦截器

**使用示例**：
```typescript
import { RequestFactory } from '@/utils';

// 创建默认客户端
const client = RequestFactory.createDefaultClient();

// 创建自定义客户端
const customClient = RequestFactory.createCustomClient({
  baseURL: 'http://custom.api.com',
});
```

## 类之间的关系

```
ConfigManager (单例)
    ↓
RequestFactory (工厂)
    ↓
HttpClient (客户端)
    ├── StorageUtil (存储)
    ├── ConfigManager (配置)
    ├── URLBuilder (URL构建)
    ├── StatusCodeUtil (状态码)
    └── InterceptorManager (拦截器)
        ├── RequestInterceptorManager
        ├── ResponseInterceptorManager
        └── ErrorInterceptorManager
```

## 使用建议

1. **优先使用工具类**：所有功能都通过工具类访问，避免直接操作底层 API
2. **依赖注入**：创建实例时通过构造函数注入依赖，便于测试和扩展
3. **工厂模式**：使用工厂类创建实例，统一管理配置
4. **类型安全**：充分利用 TypeScript 的类型系统，确保类型安全

## 扩展指南

### 添加新的工具类

1. 在 `utils/` 目录下创建新的子目录
2. 创建工具类文件，遵循单一职责原则
3. 在 `utils/index.ts` 中导出
4. 编写单元测试

### 扩展现有类

1. 通过继承或组合扩展功能
2. 保持向后兼容
3. 更新文档和示例

## 最佳实践

1. **封装**：所有内部实现细节都封装在类内部，只暴露必要的公共接口
2. **单一职责**：每个类只负责一个功能，避免职责过多
3. **依赖注入**：通过构造函数注入依赖，而不是在类内部创建
4. **接口隔离**：定义清晰的接口，避免接口过于庞大
5. **开闭原则**：对扩展开放，对修改关闭
