# 后端架构说明

## 目录结构

```
src/
├── core/              # 核心层：纯规范与领域模型（无IO）
│   ├── model/        # 数据模型
│   │   ├── entities/      # 实体类
│   │   ├── value-objects/ # 值对象
│   │   └── dto/          # 数据传输对象
│   ├── service/      # 业务服务层
│   │   ├── business/     # 业务服务
│   │   └── domain/       # 领域服务
│   ├── domain/       # 领域模型（DDD）
│   │   ├── entities/      # 领域实体
│   │   ├── value-objects/ # 值对象
│   │   ├── aggregates/    # 聚合根
│   │   └── domain-events/ # 领域事件
│   ├── types/        # 类型定义
│   └── index.ts      # 统一导出
│
├── engine/           # 执行引擎
│   ├── parser/       # 解析器
│   ├── validator/    # 验证器
│   ├── planner/      # 规划器
│   ├── executor/     # 执行器
│   └── index.ts      # 统一导出
│
├── integration/      # 集成层：外部适配
│   ├── data-provider/ # 数据提供者
│   ├── persistence/   # 持久化
│   ├── http/          # HTTP集成
│   └── index.ts      # 统一导出
│
├── api/              # API层：Controller / Routes
│   ├── routes/       # 路由定义
│   ├── controllers/  # 控制器
│   ├── middleware/   # 中间件
│   └── index.ts     # 统一导出
│
└── index.ts          # 应用入口
```

## 架构层次说明

### 1. Core（核心层）- 纯规范与领域模型（无IO）

**职责**：包含业务逻辑和领域模型，不包含任何IO操作

- **model/**: 数据模型定义
- **service/**: 业务服务层，处理业务逻辑
- **domain/**: 领域模型，遵循DDD思想
- **types/**: 类型定义

**特点**：
- 纯函数和类，无副作用
- 不依赖外部系统
- 可独立测试

### 2. Engine（执行引擎）

**职责**：处理应用执行相关的逻辑

- **parser/**: 解析器（请求解析、数据解析）
- **validator/**: 验证器（数据验证、参数验证）
- **planner/**: 规划器（执行计划、查询计划）
- **executor/**: 执行器（查询执行、命令执行）

**特点**：
- 处理应用运行时的逻辑
- 可以依赖core层
- 不直接进行IO操作

### 3. Integration（集成层）- 外部适配

**职责**：与外部系统交互的适配层

- **data-provider/**: 数据提供者（数据源适配）
- **persistence/**: 持久化（数据库操作、ORM）
- **http/**: HTTP集成（HTTP客户端、服务器配置）

**特点**：
- 封装外部系统调用
- 提供统一的接口
- 可以依赖core层

### 4. API（API层）- Controller / Routes

**职责**：定义API接口，处理HTTP请求和响应

- **routes/**: 路由定义
- **controllers/**: 控制器（处理请求）
- **middleware/**: 中间件（认证、日志、错误处理）

**特点**：
- 薄控制器，只负责协调
- 调用integration层和core层
- 处理HTTP相关逻辑

## 依赖关系

```
API层 → Integration层 → Core层
  ↓         ↓
Engine层 ←──┘
```

**规则**：
- 上层可以依赖下层
- 下层不能依赖上层
- Core层不依赖任何其他层
- Integration层可以依赖Core层
- Engine层可以依赖Core层
- API层可以依赖所有层

## 设计原则

1. **分层清晰**：每层职责明确
2. **依赖方向**：依赖方向单一，避免循环依赖
3. **无IO原则**：Core层不包含IO操作
4. **适配器模式**：Integration层使用适配器模式封装外部系统
5. **单一职责**：每个模块只负责一个功能

## 使用示例

### 创建路由

```typescript
// api/routes/user.ts
import { Router } from "express";
import { userController } from "../controllers/user";

const router = Router();
router.get("/users", userController.getUsers);
export const userRoutes = router;
```

### 创建控制器

```typescript
// api/controllers/user.ts
import { Request, Response } from "express";
import { userService } from "../../core/service/business/user";

export const userController = {
  getUsers: async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
  },
};
```

### 创建服务

```typescript
// core/service/business/user.ts
import { userRepository } from "../../integration/persistence/user";

export class UserService {
  async getAllUsers() {
    return await userRepository.findAll();
  }
}

export const userService = new UserService();
```
