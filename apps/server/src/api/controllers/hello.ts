/**
 * Hello控制器
 * 处理 /api/hello 相关的请求
 */

import { Request, Response } from "express";
import type { HelloResponse } from "@app/shared/src/types";

/**
 * Hello控制器
 */
export const helloController = {
  /**
   * 获取Hello消息
   */
  getHello: (_req: Request, res: Response<HelloResponse>) => {
    res.json({ message: "Hello from server" });
  },
};
