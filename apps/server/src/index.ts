/**
 * 应用入口文件
 * 统一导出所有模块
 */

import express, { type Express } from "express";
import { helloRoutes } from "./api/routes/hello";

const app: Express = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use("/api", helloRoutes);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

export default app;
