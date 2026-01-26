/**
 * 公共配置使用示例
 * 此文件仅作为示例参考，不会被实际使用
 */

import React from 'react';
import { commonConfig, projectConfig, thirdPartyConfig } from './CommonConfig';
import { configManager } from './ConfigManager';

// ==================== 示例 1: 获取项目配置 ====================
function exampleGetProjectConfig() {
  // 方式1: 直接使用导出的配置对象
  console.log('项目名称:', projectConfig.projectName);
  console.log('项目版本:', projectConfig.projectVersion);
  console.log('项目描述:', projectConfig.projectDescription);

  // 方式2: 通过配置管理器获取
  const projectInfo = configManager.getProjectConfig();
  console.log('项目作者:', projectInfo.projectAuthor);
  console.log('项目仓库:', projectInfo.projectRepository);
}

// ==================== 示例 2: 获取第三方服务配置 ====================
function exampleGetThirdPartyConfig() {
  // 获取所有第三方服务配置
  console.log('地图服务配置:', thirdPartyConfig.map);
  console.log('支付服务配置:', thirdPartyConfig.payment);
  console.log('分析服务配置:', thirdPartyConfig.analytics);

  // 获取特定服务配置
  const mapConfig = commonConfig.getThirdPartyService('map');
  console.log('地图API Key:', mapConfig.apiKey);

  // 通过配置管理器获取
  const paymentConfig = configManager.getThirdPartyService('payment');
  console.log('支付App ID:', paymentConfig.appId);
}

// ==================== 示例 3: 检查服务是否已配置 ====================
function exampleCheckServiceConfigured() {
  // 检查地图服务是否已配置
  if (commonConfig.isServiceConfigured('map')) {
    console.log('地图服务已配置');
    // 初始化地图服务
  } else {
    console.warn('地图服务未配置');
  }

  // 检查分析服务是否启用
  if (commonConfig.isServiceConfigured('analytics')) {
    console.log('分析服务已启用');
    // 初始化分析服务
  }
}

// ==================== 示例 4: 运行时更新配置 ====================
function exampleUpdateConfig() {
  // 更新项目配置
  commonConfig.updateProjectConfig({
    projectVersion: '1.1.0',
  });

  // 更新第三方服务配置
  commonConfig.updateThirdPartyConfig('map', {
    apiKey: 'new-api-key',
  });
}

// ==================== 示例 5: 在组件中使用配置 ====================
function exampleUseInComponent() {
  // 在React组件中使用
  const MapComponent = () => {
    const mapConfig = configManager.getThirdPartyService('map');

    if (!mapConfig.apiKey) {
      return React.createElement('div', null, '地图服务未配置');
    }

    return React.createElement(
      'div',
      null,
      [
        React.createElement('h1', { key: 'title' }, '地图组件'),
        // 使用 mapConfig.apiKey 初始化地图
        React.createElement('div', { key: 'desc' }, `地图API Key: ${mapConfig.apiKey}`),
      ]
    );
  };
  return MapComponent;
}

// ==================== 示例 6: 初始化第三方服务 ====================
function exampleInitThirdPartyServices() {
  // 初始化地图服务
  if (commonConfig.isServiceConfigured('map')) {
    const mapConfig = thirdPartyConfig.map;
    // 根据provider初始化对应的地图服务
    switch (mapConfig.provider) {
      case '高德':
        // 初始化高德地图
        console.log('初始化高德地图:', mapConfig.apiKey);
        break;
      case '百度':
        // 初始化百度地图
        console.log('初始化百度地图:', mapConfig.apiKey);
        break;
      default:
        console.warn('未知的地图服务提供商');
    }
  }

  // 初始化分析服务
  if (commonConfig.isServiceConfigured('analytics')) {
    const analyticsConfig = thirdPartyConfig.analytics;
    // 根据provider初始化对应的分析服务
    switch (analyticsConfig.provider) {
      case 'Google Analytics':
        // 初始化Google Analytics
        console.log('初始化Google Analytics:', analyticsConfig.trackingId);
        break;
      case '百度统计':
        // 初始化百度统计
        console.log('初始化百度统计:', analyticsConfig.trackingId);
        break;
      default:
        console.warn('未知的分析服务提供商');
    }
  }
}

// ==================== 示例 7: 条件渲染基于配置 ====================
function exampleConditionalRendering() {
  const analyticsConfig = thirdPartyConfig.analytics;

  // 根据配置决定是否显示某些功能
  if (analyticsConfig.enabled) {
    console.log('分析功能已启用');
    // 加载分析脚本
  }

  const paymentConfig = thirdPartyConfig.payment;
  if (paymentConfig.provider) {
    console.log('支付功能可用');
    // 显示支付按钮
  }
}

export {
  exampleGetProjectConfig,
  exampleGetThirdPartyConfig,
  exampleCheckServiceConfigured,
  exampleUpdateConfig,
  exampleUseInComponent,
  exampleInitThirdPartyServices,
  exampleConditionalRendering,
};
