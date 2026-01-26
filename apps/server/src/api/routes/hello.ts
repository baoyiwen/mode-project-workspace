/**
 * Hello路由
 * 定义 /api/hello 相关的路由
 */

import { Router } from "express";
import { helloController } from "../controllers/hello";

const router = Router();

router.get("/hello", helloController.getHello);

export const helloRoutes = router;
