# 后端项目架构

## 目录结构

本项目采用分层架构设计，参考DDD（领域驱动设计）思想，将代码分为以下几个层次：

```
src/
├── core/              # 核心层：纯规范与领域模型（无IO）
├── engine/            # 执行引擎：解析器、验证器、规划器、执行器
├── integration/       # 集成层：外部适配（数据提供者、持久化、HTTP）
├── api/               # API层：Controller / Routes
└── index.ts           # 应用入口
```

## 架构说明

详细架构说明请参考 [ARCHITECTURE.md](./ARCHITECTURE.md)

## 快速开始

### 创建新的API端点

1. **创建路由** (`api/routes/example.ts`):
```typescript
import { Router } from "express";
import { exampleController } from "../controllers/example";

const router = Router();
router.get("/example", exampleController.getExample);
export const exampleRoutes = router;
```

2. **创建控制器** (`api/controllers/example.ts`):
```typescript
import { Request, Response } from "express";
import { exampleService } from "../../core/service/business/example";

export const exampleController = {
  getExample: async (_req: Request, res: Response) => {
    const data = await exampleService.getExample();
    res.json(data);
  },
};
```

3. **创建服务** (`core/service/business/example.ts`):
```typescript
export class ExampleService {
  async getExample() {
    // 业务逻辑处理
    return { message: "Example" };
  }
}

export const exampleService = new ExampleService();
```

4. **注册路由** (`index.ts`):
```typescript
import { exampleRoutes } from "./api/routes/example";
app.use("/api", exampleRoutes);
```

## 开发规范

1. **分层清晰**：代码必须放在正确的层中
2. **依赖方向**：只能依赖下层，不能依赖上层
3. **无IO原则**：Core层不包含任何IO操作
4. **单一职责**：每个模块只负责一个功能
5. **类型安全**：充分利用TypeScript类型系统

## 运行项目

```bash
# 开发模式
pnpm dev

# 构建
pnpm build

# 生产模式
pnpm start
```
