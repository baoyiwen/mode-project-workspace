# 配置文件说明

## 概述

`src/config/index.ts` 是前端应用的统一配置文件，用于集中管理所有配置项。

## 配置项说明

### 基础配置

- `apiBaseURL`: API 基础 URL，默认 `http://localhost:3000`
- `requestTimeout`: 请求超时时间（毫秒），默认 `10000`
- `enableRequestLog`: 是否启用请求日志，默认 `false`
- `tokenKey`: Token 存储键名，默认 `token`
- `appTitle`: 应用标题，默认 `Web App`
- `appVersion`: 应用版本，默认 `1.0.0`

### 开发环境配置

- `enableMock`: 是否启用 Mock 数据，默认 `false`
- `mockApiBaseURL`: Mock API 基础 URL，默认 `http://localhost:3001`

### 生产环境配置

- `enableErrorReport`: 是否启用错误上报，默认 `true`
- `errorReportURL`: 错误上报地址

## 使用方式

### 1. 获取应用配置

```typescript
import { appConfig, configManager } from '@/config';

// 方式1: 直接使用导出的配置对象
console.log(appConfig.apiBaseURL);

// 方式2: 通过配置管理器获取
const config = configManager.getAppConfig();
console.log(config.requestTimeout);
```

### 2. 获取项目信息

```typescript
import { projectConfig, configManager } from '@/config';

// 方式1: 直接使用导出的配置对象
console.log(projectConfig.projectName);
console.log(projectConfig.projectVersion);

// 方式2: 通过配置管理器获取
const projectInfo = configManager.getProjectConfig();
console.log(projectInfo.projectAuthor);
```

### 3. 获取第三方服务配置

```typescript
import { thirdPartyConfig, commonConfig, configManager } from '@/config';

// 方式1: 直接使用导出的配置对象
const mapConfig = thirdPartyConfig.map;
console.log(mapConfig.apiKey);

// 方式2: 通过公共配置管理器获取
const paymentConfig = commonConfig.getThirdPartyService('payment');
console.log(paymentConfig.appId);

// 方式3: 通过应用配置管理器获取
const analyticsConfig = configManager.getThirdPartyService('analytics');
console.log(analyticsConfig.trackingId);
```

### 4. 检查服务是否已配置

```typescript
import { commonConfig } from '@/config';

// 检查地图服务是否已配置
if (commonConfig.isServiceConfigured('map')) {
  // 初始化地图服务
  const mapConfig = commonConfig.getThirdPartyService('map');
  // 使用 mapConfig 初始化地图
}
```

### 5. 使用环境变量

创建 `.env.local` 文件（或 `.env.development` / `.env.production`）：

```env
# 应用配置
VITE_API_BASE_URL=http://localhost:3000
VITE_REQUEST_TIMEOUT=10000

# 项目信息
VITE_PROJECT_NAME=My Web App
VITE_PROJECT_VERSION=1.0.0

# 第三方服务配置
VITE_MAP_PROVIDER=高德
VITE_MAP_API_KEY=your-map-api-key
VITE_ANALYTICS_PROVIDER=Google Analytics
VITE_ANALYTICS_TRACKING_ID=UA-XXXXX-X
VITE_ANALYTICS_ENABLED=true
```

### 6. 在代码中使用

```typescript
import { appConfig, projectConfig, thirdPartyConfig, isDev, isProd } from '@/config';

// 环境判断
if (isDev) {
  console.log('开发环境');
}

if (isProd) {
  console.log('生产环境');
}

// 使用项目信息
document.title = projectConfig.projectName;

// 使用第三方服务配置
if (thirdPartyConfig.analytics.enabled) {
  // 初始化分析服务
}
```

## 环境变量命名规则

所有环境变量必须以 `VITE_` 开头，才能在客户端代码中访问。

## 配置文件优先级

1. 环境变量（`.env.local` > `.env.[mode]` > `.env`）
2. 代码中的默认值

## 注意事项

- `.env.local` 文件不应提交到版本控制系统
- 敏感信息应使用环境变量，不要硬编码在代码中
- 修改配置后需要重启开发服务器
