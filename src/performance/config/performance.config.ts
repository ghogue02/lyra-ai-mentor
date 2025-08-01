/**
 * Performance Validation System Configuration
 * Centralized configuration for all performance monitoring components
 */

export interface PerformanceConfiguration {
  // Environment settings
  environment: 'development' | 'staging' | 'production';
  
  // API Configuration
  api: {
    openaiApiKey?: string;
    baseUrl?: string;
    timeout: number;
    retries: number;
    rateLimiting: {
      requestsPerMinute: number;
      tokensPerMinute: number;
    };
  };

  // Cost Analysis Settings
  costAnalysis: {
    enabled: boolean;
    budgetLimits: {
      daily?: number;
      weekly?: number;
      monthly?: number;
    };
    alertThresholds: {
      percentage: number; // Alert when reaching this % of budget
      absolute?: number;  // Alert when cost exceeds this amount
    };
    trackingGranularity: 'request' | 'session' | 'user';
    exportSettings: {
      enabled: boolean;
      format: 'json' | 'csv' | 'both';
      schedule: 'hourly' | 'daily' | 'weekly';
    };
  };

  // Performance Monitoring Settings
  monitoring: {
    enabled: boolean;
    realTimeMonitoring: boolean;
    metricsCollection: {
      intervalMs: number;
      retentionPeriod: string; // e.g., '7d', '30d'
      batchSize: number;
    };
    alerts: {
      enabled: boolean;
      channels: ('console' | 'webhook' | 'email')[];
      webhookUrl?: string;
      emailSettings?: {
        smtp: string;
        from: string;
        to: string[];
      };
    };
    thresholds: {
      responseTime: {
        warning: number;
        critical: number;
      };
      errorRate: {
        warning: number;
        critical: number;
      };
      throughput: {
        minimum: number;
      };
      tokenProcessingRate: {
        minimum: number;
      };
    };
  };

  // Optimization Engine Settings
  optimization: {
    caching: {
      enabled: boolean;
      strategy: 'memory' | 'redis' | 'hybrid';
      maxSize: number;
      ttl: number; // Time to live in seconds
      compressionEnabled: boolean;
      similarityThreshold: number; // For semantic caching
    };
    contextCompression: {
      enabled: boolean;
      strategy: 'semantic' | 'structural' | 'summarization' | 'adaptive';
      qualityThreshold: number; // Minimum quality score (0-1)
      maxCompressionRatio: number; // Maximum compression (0-1)
      fallbackStrategy: string;
    };
    requestBatching: {
      enabled: boolean;
      batchSize: number;
      delayMs: number;
      timeoutMs: number;
    };
    modelRouting: {
      enabled: boolean;
      costOptimization: boolean;
      latencyOptimization: boolean;
      qualityThreshold: number;
      fallbackModel: string;
    };
  };

  // Benchmarking Settings
  benchmarking: {
    enabled: boolean;
    autoSchedule: {
      enabled: boolean;
      frequency: 'daily' | 'weekly' | 'monthly';
      time?: string; // e.g., '02:00' for 2 AM
    };
    scenarios: {
      useDefaults: boolean;
      customScenarios?: Array<{
        name: string;
        description: string;
        contextSize: number;
        outputLength: number;
        concurrency: number;
        iterations: number;
      }>;
    };
    reporting: {
      enabled: boolean;
      format: 'json' | 'html' | 'pdf';
      recipients?: string[];
    };
  };

  // Dashboard Settings
  dashboard: {
    enabled: boolean;
    refreshInterval: number;
    theme: 'light' | 'dark' | 'auto';
    features: {
      realTimeMetrics: boolean;
      costTracking: boolean;
      alertManagement: boolean;
      benchmarkResults: boolean;
      optimizationRecommendations: boolean;
    };
  };

  // Logging and Debugging
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error';
    outputs: ('console' | 'file' | 'remote')[];
    fileSettings?: {
      path: string;
      maxSize: string; // e.g., '10MB'
      maxFiles: number;
    };
    remoteSettings?: {
      endpoint: string;
      apiKey: string;
    };
  };
}

/**
 * Default configuration for different environments
 */
export const defaultConfigurations: Record<string, Partial<PerformanceConfiguration>> = {
  development: {
    environment: 'development',
    api: {
      timeout: 30000,
      retries: 3,
      rateLimiting: {
        requestsPerMinute: 100,
        tokensPerMinute: 100000
      }
    },
    costAnalysis: {
      enabled: true,
      budgetLimits: {
        daily: 10,
        monthly: 200
      },
      alertThresholds: {
        percentage: 80
      },
      trackingGranularity: 'request',
      exportSettings: {
        enabled: false,
        format: 'json',
        schedule: 'daily'
      }
    },
    monitoring: {
      enabled: true,
      realTimeMonitoring: false,
      metricsCollection: {
        intervalMs: 60000,
        retentionPeriod: '24h',
        batchSize: 100
      },
      alerts: {
        enabled: true,
        channels: ['console']
      },
      thresholds: {
        responseTime: {
          warning: 10000,
          critical: 30000
        },
        errorRate: {
          warning: 0.05,
          critical: 0.1
        },
        throughput: {
          minimum: 0.5
        },
        tokenProcessingRate: {
          minimum: 50
        }
      }
    },
    optimization: {
      caching: {
        enabled: true,
        strategy: 'memory',
        maxSize: 1000,
        ttl: 3600,
        compressionEnabled: false,
        similarityThreshold: 0.9
      },
      contextCompression: {
        enabled: true,
        strategy: 'semantic',
        qualityThreshold: 0.85,
        maxCompressionRatio: 0.5,
        fallbackStrategy: 'structural'
      },
      requestBatching: {
        enabled: false, // Disabled for development
        batchSize: 5,
        delayMs: 1000,
        timeoutMs: 30000
      },
      modelRouting: {
        enabled: true,
        costOptimization: true,
        latencyOptimization: false,
        qualityThreshold: 0.8,
        fallbackModel: 'gpt-4.1'
      }
    },
    benchmarking: {
      enabled: true,
      autoSchedule: {
        enabled: false
      },
      scenarios: {
        useDefaults: true
      },
      reporting: {
        enabled: false,
        format: 'json'
      }
    },
    dashboard: {
      enabled: true,
      refreshInterval: 30000,
      theme: 'light',
      features: {
        realTimeMetrics: true,
        costTracking: true,
        alertManagement: true,
        benchmarkResults: true,
        optimizationRecommendations: true
      }
    },
    logging: {
      level: 'debug',
      outputs: ['console']
    }
  },

  staging: {
    environment: 'staging',
    api: {
      timeout: 45000,
      retries: 3,
      rateLimiting: {
        requestsPerMinute: 200,
        tokensPerMinute: 500000
      }
    },
    costAnalysis: {
      enabled: true,
      budgetLimits: {
        daily: 50,
        monthly: 1000
      },
      alertThresholds: {
        percentage: 75
      },
      trackingGranularity: 'session',
      exportSettings: {
        enabled: true,
        format: 'both',
        schedule: 'daily'
      }
    },
    monitoring: {
      enabled: true,
      realTimeMonitoring: true,
      metricsCollection: {
        intervalMs: 30000,
        retentionPeriod: '7d',
        batchSize: 200
      },
      alerts: {
        enabled: true,
        channels: ['console', 'webhook']
      },
      thresholds: {
        responseTime: {
          warning: 8000,
          critical: 20000
        },
        errorRate: {
          warning: 0.03,
          critical: 0.08
        },
        throughput: {
          minimum: 1.0
        },
        tokenProcessingRate: {
          minimum: 100
        }
      }
    },
    optimization: {
      caching: {
        enabled: true,
        strategy: 'hybrid',
        maxSize: 5000,
        ttl: 7200,
        compressionEnabled: true,
        similarityThreshold: 0.85
      },
      contextCompression: {
        enabled: true,
        strategy: 'adaptive',
        qualityThreshold: 0.9,
        maxCompressionRatio: 0.4,
        fallbackStrategy: 'semantic'
      },
      requestBatching: {
        enabled: true,
        batchSize: 8,
        delayMs: 500,
        timeoutMs: 45000
      },
      modelRouting: {
        enabled: true,
        costOptimization: true,
        latencyOptimization: true,
        qualityThreshold: 0.85,
        fallbackModel: 'gpt-4.1'
      }
    },
    benchmarking: {
      enabled: true,
      autoSchedule: {
        enabled: true,
        frequency: 'daily',
        time: '02:00'
      },
      scenarios: {
        useDefaults: true
      },
      reporting: {
        enabled: true,
        format: 'html'
      }
    },
    dashboard: {
      enabled: true,
      refreshInterval: 10000,
      theme: 'dark',
      features: {
        realTimeMetrics: true,
        costTracking: true,
        alertManagement: true,
        benchmarkResults: true,
        optimizationRecommendations: true
      }
    },
    logging: {
      level: 'info',
      outputs: ['console', 'file'],
      fileSettings: {
        path: './logs/performance.log',
        maxSize: '50MB',
        maxFiles: 10
      }
    }
  },

  production: {
    environment: 'production',
    api: {
      timeout: 60000,
      retries: 5,
      rateLimiting: {
        requestsPerMinute: 500,
        tokensPerMinute: 2000000
      }
    },
    costAnalysis: {
      enabled: true,
      budgetLimits: {
        daily: 500,
        weekly: 3000,
        monthly: 10000
      },
      alertThresholds: {
        percentage: 70,
        absolute: 100
      },
      trackingGranularity: 'user',
      exportSettings: {
        enabled: true,
        format: 'both',
        schedule: 'hourly'
      }
    },
    monitoring: {
      enabled: true,
      realTimeMonitoring: true,
      metricsCollection: {
        intervalMs: 10000,
        retentionPeriod: '30d',
        batchSize: 500
      },
      alerts: {
        enabled: true,
        channels: ['webhook', 'email']
      },
      thresholds: {
        responseTime: {
          warning: 5000,
          critical: 15000
        },
        errorRate: {
          warning: 0.01,
          critical: 0.05
        },
        throughput: {
          minimum: 2.0
        },
        tokenProcessingRate: {
          minimum: 200
        }
      }
    },
    optimization: {
      caching: {
        enabled: true,
        strategy: 'redis',
        maxSize: 50000,
        ttl: 14400,
        compressionEnabled: true,
        similarityThreshold: 0.8
      },
      contextCompression: {
        enabled: true,
        strategy: 'adaptive',
        qualityThreshold: 0.95,
        maxCompressionRatio: 0.3,
        fallbackStrategy: 'semantic'
      },
      requestBatching: {
        enabled: true,
        batchSize: 10,
        delayMs: 200,
        timeoutMs: 60000
      },
      modelRouting: {
        enabled: true,
        costOptimization: true,
        latencyOptimization: true,
        qualityThreshold: 0.9,
        fallbackModel: 'gpt-4.1'
      }
    },
    benchmarking: {
      enabled: true,
      autoSchedule: {
        enabled: true,
        frequency: 'weekly',
        time: '01:00'
      },
      scenarios: {
        useDefaults: true
      },
      reporting: {
        enabled: true,
        format: 'pdf'
      }
    },
    dashboard: {
      enabled: true,
      refreshInterval: 5000,
      theme: 'auto',
      features: {
        realTimeMetrics: true,
        costTracking: true,
        alertManagement: true,
        benchmarkResults: true,
        optimizationRecommendations: true
      }
    },
    logging: {
      level: 'warn',
      outputs: ['file', 'remote'],
      fileSettings: {
        path: './logs/performance.log',
        maxSize: '100MB',
        maxFiles: 20
      }
    }
  }
};

/**
 * Configuration validator
 */
export class ConfigurationValidator {
  static validate(config: Partial<PerformanceConfiguration>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate required fields
    if (!config.environment) {
      errors.push('Environment must be specified');
    }

    // Validate budget limits
    if (config.costAnalysis?.budgetLimits) {
      const { daily, weekly, monthly } = config.costAnalysis.budgetLimits;
      if (daily && weekly && daily * 7 > weekly) {
        warnings.push('Daily budget * 7 exceeds weekly budget');
      }
      if (daily && monthly && daily * 30 > monthly) {
        warnings.push('Daily budget * 30 exceeds monthly budget');
      }
    }

    // Validate monitoring thresholds
    if (config.monitoring?.thresholds) {
      const { responseTime, errorRate } = config.monitoring.thresholds;
      if (responseTime && responseTime.warning >= responseTime.critical) {
        errors.push('Response time warning threshold must be less than critical threshold');
      }
      if (errorRate && errorRate.warning >= errorRate.critical) {
        errors.push('Error rate warning threshold must be less than critical threshold');
      }
    }

    // Validate optimization settings
    if (config.optimization?.contextCompression) {
      const { qualityThreshold, maxCompressionRatio } = config.optimization.contextCompression;
      if (qualityThreshold && (qualityThreshold < 0 || qualityThreshold > 1)) {
        errors.push('Quality threshold must be between 0 and 1');
      }
      if (maxCompressionRatio && (maxCompressionRatio < 0 || maxCompressionRatio > 1)) {
        errors.push('Max compression ratio must be between 0 and 1');
      }
    }

    // Validate caching settings
    if (config.optimization?.caching) {
      const { strategy, maxSize, ttl } = config.optimization.caching;
      if (strategy === 'redis' && !process.env.REDIS_URL) {
        warnings.push('Redis strategy selected but REDIS_URL not configured');
      }
      if (maxSize && maxSize <= 0) {
        errors.push('Cache max size must be positive');
      }
      if (ttl && ttl <= 0) {
        errors.push('Cache TTL must be positive');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

/**
 * Configuration loader utility
 */
export class ConfigurationLoader {
  static load(environment?: string): PerformanceConfiguration {
    const env = environment || process.env.NODE_ENV || 'development';
    const baseConfig = defaultConfigurations[env] || defaultConfigurations.development;
    
    // Merge with environment variables
    const envConfig = this.loadFromEnvironment();
    
    // Merge configurations
    const config = this.deepMerge(baseConfig, envConfig);
    
    // Validate configuration
    const validation = ConfigurationValidator.validate(config);
    if (!validation.isValid) {
      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
    }
    
    if (validation.warnings.length > 0) {
      console.warn('Configuration warnings:', validation.warnings.join(', '));
    }
    
    return config as PerformanceConfiguration;
  }

  private static loadFromEnvironment(): Partial<PerformanceConfiguration> {
    return {
      api: {
        openaiApiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_BASE_URL,
        timeout: process.env.OPENAI_TIMEOUT ? parseInt(process.env.OPENAI_TIMEOUT) : undefined
      },
      costAnalysis: {
        budgetLimits: {
          daily: process.env.BUDGET_DAILY ? parseFloat(process.env.BUDGET_DAILY) : undefined,
          monthly: process.env.BUDGET_MONTHLY ? parseFloat(process.env.BUDGET_MONTHLY) : undefined
        }
      },
      monitoring: {
        enabled: process.env.MONITORING_ENABLED !== 'false',
        alerts: {
          webhookUrl: process.env.WEBHOOK_URL,
          emailSettings: process.env.SMTP_HOST ? {
            smtp: process.env.SMTP_HOST,
            from: process.env.SMTP_FROM || 'noreply@example.com',
            to: process.env.ALERT_EMAILS ? process.env.ALERT_EMAILS.split(',') : []
          } : undefined
        }
      }
    };
  }

  private static deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }
    
    return result;
  }
}