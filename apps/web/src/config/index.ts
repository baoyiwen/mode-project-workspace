/**
 * 前端配置文件
 * 统一管理应用配置项
 * 
 * 此文件保持向后兼容，实际使用 ConfigManager 类
 */

// 导出配置管理类
export {
  ConfigManager,
  configManager,
  type AppConfig,
  type DevConfig,
  type ProdConfig,
} from './ConfigManager';

// 导出公共配置
export {
  CommonConfig,
  commonConfig,
  type ProjectConfig,
  type ThirdPartyConfig,
  projectConfig,
  thirdPartyConfig,
} from './CommonConfig';

// 导出便捷访问（保持向后兼容）
export { appConfig, devConfig, prodConfig, isDev, isProd, envName } from './ConfigManager';

// 默认导出（保持向后兼容）
import { appConfig, devConfig, prodConfig, isDev, isProd, envName } from './ConfigManager';
import { projectConfig, thirdPartyConfig } from './CommonConfig';
export default {
  ...appConfig,
  isDev,
  isProd,
  envName,
  dev: devConfig,
  prod: prodConfig,
  project: projectConfig,
  thirdParty: thirdPartyConfig,
};
