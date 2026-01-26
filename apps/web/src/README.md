# 前端项目结构

## 目录结构

```
src/
├── components/       # 组件目录
│   ├── model/       # 模型相关组件
│   ├── relation/     # 关系相关组件
│   └── query/        # 查询相关组件
│       └── graph/    # 查询图组件
│
├── pages/            # 页面目录
│   ├── ModelDesigner.tsx    # 模型设计器页面
│   ├── QueryDesigner.tsx    # 查询设计器页面
│   └── ResultViewer.tsx     # 结果查看器页面
│
├── state/            # 状态管理目录
│   ├── specStore.ts  # 规范状态管理
│   └── queryStore.ts # 查询状态管理
│
├── api/              # API目录
│   └── ddagsApi.ts   # DDAGS API调用
│
├── types/            # 类型定义目录
│   └── spec.ts       # 规范类型定义
│
├── config/           # 配置目录
├── utils/            # 工具类目录
├── assets/            # 静态资源
├── App.tsx          # 主应用组件
├── App.css          # 主应用样式
├── main.tsx         # 应用入口
└── index.css        # 全局样式
```

## 模块说明

### components/ - 组件目录

按功能模块组织的可复用组件：
- `model/` - 模型相关组件（模型列表、模型编辑器等）
- `relation/` - 关系相关组件（关系图、关系编辑器等）
- `query/graph/` - 查询图相关组件（查询图可视化、查询图编辑器等）

### pages/ - 页面目录

应用的主要页面组件：
- `ModelDesigner.tsx` - 模型设计器页面
- `QueryDesigner.tsx` - 查询设计器页面
- `ResultViewer.tsx` - 结果查看器页面

### state/ - 状态管理目录

使用 Zustand 进行状态管理：
- `specStore.ts` - 规范相关的状态管理
- `queryStore.ts` - 查询相关的状态管理

### api/ - API目录

所有API调用方法：
- `ddagsApi.ts` - DDAGS相关的API调用

### types/ - 类型定义目录

TypeScript类型定义：
- `spec.ts` - 规范相关的类型定义

## 使用示例

### 使用状态管理

```typescript
import { useSpecStore } from './state';

function MyComponent() {
  const { specs, setSpecs } = useSpecStore();
  // 使用状态
}
```

### 使用API

```typescript
import { getHello } from './api';

const data = await getHello();
```

### 使用页面组件

```typescript
import { ModelDesigner, QueryDesigner, ResultViewer } from './pages';
```

## 开发规范

1. **组件组织**：按功能模块组织组件
2. **状态管理**：使用Zustand进行状态管理
3. **类型安全**：充分利用TypeScript类型系统
4. **代码复用**：提取可复用组件到components目录
5. **页面分离**：每个页面独立文件
