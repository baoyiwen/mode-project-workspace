/**
 * 公共配置类
 * 管理项目名称、第三方服务Token等公共配置项
 */

/**
 * 项目信息配置接口
 */
export interface ProjectConfig {
  /** 项目名称 */
  projectName: string;
  /** 项目描述 */
  projectDescription: string;
  /** 项目版本 */
  projectVersion: string;
  /** 项目作者 */
  projectAuthor: string;
  /** 项目仓库地址 */
  projectRepository: string;
  /** 项目主页 */
  projectHomepage: string;
}

/**
 * 第三方服务配置接口
 */
export interface ThirdPartyConfig {
  /** 地图服务配置 */
  map: {
    /** 地图服务提供商（如：高德、百度、腾讯） */
    provider: string;
    /** 地图服务API Key */
    apiKey: string;
    /** 地图服务基础URL */
    baseURL: string;
  };
  /** 支付服务配置 */
  payment: {
    /** 支付服务提供商（如：支付宝、微信） */
    provider: string;
    /** 支付服务App ID */
    appId: string;
    /** 支付服务密钥 */
    secretKey: string;
    /** 支付服务回调地址 */
    callbackURL: string;
  };
  /** 分析服务配置 */
  analytics: {
    /** 分析服务提供商（如：Google Analytics、百度统计） */
    provider: string;
    /** 分析服务ID */
    trackingId: string;
    /** 是否启用分析 */
    enabled: boolean;
  };
  /** 对象存储服务配置 */
  storage: {
    /** 存储服务提供商（如：OSS、COS、S3） */
    provider: string;
    /** 存储服务Access Key */
    accessKey: string;
    /** 存储服务Secret Key */
    secretKey: string;
    /** 存储服务Bucket名称 */
    bucket: string;
    /** 存储服务区域 */
    region: string;
  };
  /** 短信服务配置 */
  sms: {
    /** 短信服务提供商 */
    provider: string;
    /** 短信服务Access Key */
    accessKey: string;
    /** 短信服务Secret Key */
    secretKey: string;
    /** 短信服务签名 */
    signName: string;
  };
  /** 邮件服务配置 */
  email: {
    /** 邮件服务提供商 */
    provider: string;
    /** 邮件服务API Key */
    apiKey: string;
    /** 发件人邮箱 */
    fromEmail: string;
    /** 发件人名称 */
    fromName: string;
  };
  /** 推送服务配置 */
  push: {
    /** 推送服务提供商 */
    provider: string;
    /** 推送服务App Key */
    appKey: string;
    /** 推送服务Secret */
    secret: string;
  };
  /** OAuth服务配置 */
  oauth: {
    /** OAuth服务提供商（如：GitHub、Google、微信） */
    provider: string;
    /** OAuth Client ID */
    clientId: string;
    /** OAuth Client Secret */
    clientSecret: string;
    /** OAuth回调地址 */
    redirectURI: string;
  };
}

/**
 * 公共配置类
 */
export class CommonConfig {
  private static instance: CommonConfig;
  private projectConfig: ProjectConfig;
  private thirdPartyConfig: ThirdPartyConfig;

  /**
   * 私有构造函数（单例模式）
   */
  private constructor() {
    this.projectConfig = this.loadProjectConfig();
    this.thirdPartyConfig = this.loadThirdPartyConfig();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(): CommonConfig {
    if (!CommonConfig.instance) {
      CommonConfig.instance = new CommonConfig();
    }
    return CommonConfig.instance;
  }

  /**
   * 获取环境变量值
   */
  private getEnvValue(key: string, defaultValue: string = ''): string {
    return import.meta.env[key] || defaultValue;
  }

  /** 
   * 获取布尔类型环境变量
   */
  private getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = import.meta.env[key];
    if (value === undefined) return defaultValue;
    return value === 'true' || value === '1';
  }

  /**
   * 加载项目配置
   */
  private loadProjectConfig(): ProjectConfig {
    return {
      projectName: this.getEnvValue('VITE_PROJECT_NAME', 'Web App'),
      projectDescription: this.getEnvValue('VITE_PROJECT_DESCRIPTION', 'A modern web application'),
      projectVersion: this.getEnvValue('VITE_PROJECT_VERSION', '1.0.0'),
      projectAuthor: this.getEnvValue('VITE_PROJECT_AUTHOR', ''),
      projectRepository: this.getEnvValue('VITE_PROJECT_REPOSITORY', ''),
      projectHomepage: this.getEnvValue('VITE_PROJECT_HOMEPAGE', ''),
    };
  }

  /**
   * 加载第三方服务配置
   */
  private loadThirdPartyConfig(): ThirdPartyConfig {
    return {
      map: {
        provider: this.getEnvValue('VITE_MAP_PROVIDER', ''),
        apiKey: this.getEnvValue('VITE_MAP_API_KEY', ''),
        baseURL: this.getEnvValue('VITE_MAP_BASE_URL', ''),
      },
      payment: {
        provider: this.getEnvValue('VITE_PAYMENT_PROVIDER', ''),
        appId: this.getEnvValue('VITE_PAYMENT_APP_ID', ''),
        secretKey: this.getEnvValue('VITE_PAYMENT_SECRET_KEY', ''),
        callbackURL: this.getEnvValue('VITE_PAYMENT_CALLBACK_URL', ''),
      },
      analytics: {
        provider: this.getEnvValue('VITE_ANALYTICS_PROVIDER', ''),
        trackingId: this.getEnvValue('VITE_ANALYTICS_TRACKING_ID', ''),
        enabled: this.getEnvBoolean('VITE_ANALYTICS_ENABLED', false),
      },
      storage: {
        provider: this.getEnvValue('VITE_STORAGE_PROVIDER', ''),
        accessKey: this.getEnvValue('VITE_STORAGE_ACCESS_KEY', ''),
        secretKey: this.getEnvValue('VITE_STORAGE_SECRET_KEY', ''),
        bucket: this.getEnvValue('VITE_STORAGE_BUCKET', ''),
        region: this.getEnvValue('VITE_STORAGE_REGION', ''),
      },
      sms: {
        provider: this.getEnvValue('VITE_SMS_PROVIDER', ''),
        accessKey: this.getEnvValue('VITE_SMS_ACCESS_KEY', ''),
        secretKey: this.getEnvValue('VITE_SMS_SECRET_KEY', ''),
        signName: this.getEnvValue('VITE_SMS_SIGN_NAME', ''),
      },
      email: {
        provider: this.getEnvValue('VITE_EMAIL_PROVIDER', ''),
        apiKey: this.getEnvValue('VITE_EMAIL_API_KEY', ''),
        fromEmail: this.getEnvValue('VITE_EMAIL_FROM_EMAIL', ''),
        fromName: this.getEnvValue('VITE_EMAIL_FROM_NAME', ''),
      },
      push: {
        provider: this.getEnvValue('VITE_PUSH_PROVIDER', ''),
        appKey: this.getEnvValue('VITE_PUSH_APP_KEY', ''),
        secret: this.getEnvValue('VITE_PUSH_SECRET', ''),
      },
      oauth: {
        provider: this.getEnvValue('VITE_OAUTH_PROVIDER', ''),
        clientId: this.getEnvValue('VITE_OAUTH_CLIENT_ID', ''),
        clientSecret: this.getEnvValue('VITE_OAUTH_CLIENT_SECRET', ''),
        redirectURI: this.getEnvValue('VITE_OAUTH_REDIRECT_URI', ''),
      },
    };
  }

  /**
   * 获取项目配置
   */
  public getProjectConfig(): ProjectConfig {
    return { ...this.projectConfig };
  }

  /**
   * 获取第三方服务配置
   */
  public getThirdPartyConfig(): ThirdPartyConfig {
    return { ...this.thirdPartyConfig };
  }

  /**
   * 获取特定第三方服务配置
   */
  public getThirdPartyService<K extends keyof ThirdPartyConfig>(
    service: K
  ): ThirdPartyConfig[K] {
    return { ...this.thirdPartyConfig[service] };
  }

  /**
   * 更新项目配置（运行时更新）
   */
  public updateProjectConfig(updates: Partial<ProjectConfig>): void {
    this.projectConfig = { ...this.projectConfig, ...updates };
  }

  /**
   * 更新第三方服务配置（运行时更新）
   */
  public updateThirdPartyConfig<K extends keyof ThirdPartyConfig>(
    service: K,
    updates: Partial<ThirdPartyConfig[K]>
  ): void {
    this.thirdPartyConfig[service] = {
      ...this.thirdPartyConfig[service],
      ...updates,
    } as ThirdPartyConfig[K];
  }

  /**
   * 检查第三方服务是否已配置
   */
  public isServiceConfigured(service: keyof ThirdPartyConfig): boolean {
    const serviceConfig = this.thirdPartyConfig[service];
    if (service === 'analytics') {
      return (serviceConfig as ThirdPartyConfig['analytics']).enabled;
    }
    // 检查是否有必要的配置项
    return Object.values(serviceConfig).some((value) => value !== '');
  }
}

/**
 * 默认公共配置实例
 */
export const commonConfig = CommonConfig.getInstance();

/**
 * 导出便捷方法
 */
export const projectConfig = commonConfig.getProjectConfig();
export const thirdPartyConfig = commonConfig.getThirdPartyConfig();
