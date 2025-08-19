/**
 * Production Monitoring Configuration
 * Environment-specific settings for monitoring system deployment
 */

import { MonitoringThresholds, DashboardConfig } from '../types';

export interface MonitoringConfiguration {
  environment: 'development' | 'staging' | 'production';
  enabled: boolean;
  
  // Core monitoring features
  features: {
    errorTracking: boolean;
    performanceMonitoring: boolean;
    userAnalytics: boolean;
    componentProfiling: boolean;
    regressionDetection: boolean;
    realTimeAlerts: boolean;
    dashboard: boolean;
  };

  // Collection settings
  collection: {
    metricsInterval: number; // milliseconds
    errorSampling: number; // 0-1, percentage of errors to track
    analyticsSampling: number; // 0-1, percentage of interactions to track
    maxSessionDuration: number; // milliseconds
    batchSize: number;
    retentionPeriod: number; // milliseconds
  };

  // Performance thresholds
  thresholds: MonitoringThresholds;

  // Dashboard configuration
  dashboard: DashboardConfig;

  // Alert settings
  alerts: {
    enabled: boolean;
    channels: ('console' | 'webhook' | 'email' | 'sentry')[];
    webhookUrl?: string;
    emailSettings?: {
      to: string[];
      from: string;
      subject: string;
    };
    sentrySettings?: {
      dsn: string;
      environment: string;
      release?: string;
    };
    rateLimiting: {
      maxAlertsPerHour: number;
      suppressDuplicates: boolean;
      suppressionWindow: number; // milliseconds
    };
  };

  // Privacy and compliance
  privacy: {
    anonymizeUserData: boolean;
    excludePaths: string[]; // Paths to exclude from tracking
    excludeElements: string[]; // CSS selectors to exclude
    cookieConsent: boolean;
    dataRetention: number; // days
    allowDataExport: boolean;
  };

  // Performance optimization
  optimization: {
    useWebWorkers: boolean;
    compressionEnabled: boolean;
    lazyLoadComponents: boolean;
    debounceInterval: number; // milliseconds
    throttleInterval: number; // milliseconds
  };

  // Integration settings
  integrations: {
    supabase: {
      enabled: boolean;
      projectUrl?: string;
      anonKey?: string;
      tableName: string;
    };
    analytics: {
      enabled: boolean;
      googleAnalytics?: {
        measurementId: string;
      };
      mixpanel?: {
        projectToken: string;
      };
    };
    errorReporting: {
      sentry?: {
        dsn: string;
        environment: string;
        tracesSampleRate: number;
      };
      bugsnag?: {
        apiKey: string;
        releaseStage: string;
      };
    };
  };
}

// Default configurations for different environments
export const defaultConfigurations: Record<string, MonitoringConfiguration> = {
  development: {
    environment: 'development',
    enabled: true,
    
    features: {
      errorTracking: true,
      performanceMonitoring: true,
      userAnalytics: true,
      componentProfiling: true,
      regressionDetection: true,
      realTimeAlerts: true,
      dashboard: true
    },

    collection: {
      metricsInterval: 5000, // 5 seconds
      errorSampling: 1.0, // Track all errors
      analyticsSampling: 1.0, // Track all interactions
      maxSessionDuration: 24 * 60 * 60 * 1000, // 24 hours
      batchSize: 50,
      retentionPeriod: 7 * 24 * 60 * 60 * 1000 // 7 days
    },

    thresholds: {
      performance: {
        responseTime: { warning: 10000, critical: 30000 },
        fps: { warning: 45, critical: 30 },
        memoryUsage: { warning: 100, critical: 200 },
        bundleSize: { warning: 5 * 1024 * 1024, critical: 10 * 1024 * 1024 },
        errorRate: { warning: 0.05, critical: 0.1 }
      },
      userExperience: {
        engagementTime: { minimum: 30000 },
        dropoffRate: { warning: 0.3, critical: 0.5 },
        satisfactionScore: { minimum: 3.5 }
      },
      system: {
        cpuUsage: { warning: 70, critical: 90 },
        networkLatency: { warning: 1000, critical: 3000 },
        cacheHitRate: { minimum: 0.8 }
      }
    },

    dashboard: {
      refreshInterval: 5000,
      timeRange: '1h',
      enableRealTime: true,
      widgets: [
        {
          id: 'performance-overview',
          type: 'metric',
          title: 'Performance Overview',
          position: { x: 0, y: 0, w: 6, h: 4 },
          config: { metrics: ['responseTime', 'memoryUsage', 'fps'] },
          dataSource: 'metrics'
        },
        {
          id: 'error-summary',
          type: 'alert',
          title: 'Active Errors',
          position: { x: 6, y: 0, w: 6, h: 4 },
          config: { severity: ['high', 'critical'] },
          dataSource: 'errors'
        },
        {
          id: 'user-analytics',
          type: 'chart',
          title: 'User Interactions',
          position: { x: 0, y: 4, w: 12, h: 6 },
          config: { chartType: 'line', metric: 'interactions' },
          dataSource: 'analytics'
        }
      ],
      alerts: {
        enabled: true,
        sound: false,
        desktop: true
      }
    },

    alerts: {
      enabled: true,
      channels: ['console'],
      rateLimiting: {
        maxAlertsPerHour: 50,
        suppressDuplicates: true,
        suppressionWindow: 300000 // 5 minutes
      }
    },

    privacy: {
      anonymizeUserData: false,
      excludePaths: ['/admin', '/debug'],
      excludeElements: ['[data-private]', '.sensitive'],
      cookieConsent: false,
      dataRetention: 30,
      allowDataExport: true
    },

    optimization: {
      useWebWorkers: false,
      compressionEnabled: false,
      lazyLoadComponents: false,
      debounceInterval: 300,
      throttleInterval: 1000
    },

    integrations: {
      supabase: {
        enabled: false,
        tableName: 'monitoring_events'
      },
      analytics: {
        enabled: false
      },
      errorReporting: {}
    }
  },

  staging: {
    environment: 'staging',
    enabled: true,
    
    features: {
      errorTracking: true,
      performanceMonitoring: true,
      userAnalytics: true,
      componentProfiling: true,
      regressionDetection: true,
      realTimeAlerts: true,
      dashboard: true
    },

    collection: {
      metricsInterval: 10000, // 10 seconds
      errorSampling: 1.0,
      analyticsSampling: 0.8, // Sample 80% of interactions
      maxSessionDuration: 12 * 60 * 60 * 1000, // 12 hours
      batchSize: 100,
      retentionPeriod: 14 * 24 * 60 * 60 * 1000 // 14 days
    },

    thresholds: {
      performance: {
        responseTime: { warning: 8000, critical: 20000 },
        fps: { warning: 50, critical: 35 },
        memoryUsage: { warning: 80, critical: 150 },
        bundleSize: { warning: 4 * 1024 * 1024, critical: 8 * 1024 * 1024 },
        errorRate: { warning: 0.03, critical: 0.08 }
      },
      userExperience: {
        engagementTime: { minimum: 45000 },
        dropoffRate: { warning: 0.25, critical: 0.4 },
        satisfactionScore: { minimum: 4.0 }
      },
      system: {
        cpuUsage: { warning: 60, critical: 80 },
        networkLatency: { warning: 800, critical: 2000 },
        cacheHitRate: { minimum: 0.85 }
      }
    },

    dashboard: {
      refreshInterval: 10000,
      timeRange: '24h',
      enableRealTime: true,
      widgets: [
        {
          id: 'performance-overview',
          type: 'metric',
          title: 'Performance Overview',
          position: { x: 0, y: 0, w: 6, h: 4 },
          config: { metrics: ['responseTime', 'memoryUsage', 'fps'] },
          dataSource: 'metrics'
        },
        {
          id: 'error-summary',
          type: 'alert',
          title: 'Active Errors',
          position: { x: 6, y: 0, w: 6, h: 4 },
          config: { severity: ['high', 'critical'] },
          dataSource: 'errors'
        }
      ],
      alerts: {
        enabled: true,
        sound: true,
        desktop: true
      }
    },

    alerts: {
      enabled: true,
      channels: ['console', 'webhook'],
      webhookUrl: process.env.MONITORING_WEBHOOK_URL,
      rateLimiting: {
        maxAlertsPerHour: 30,
        suppressDuplicates: true,
        suppressionWindow: 600000 // 10 minutes
      }
    },

    privacy: {
      anonymizeUserData: true,
      excludePaths: ['/admin', '/debug', '/staging'],
      excludeElements: ['[data-private]', '.sensitive', '.internal'],
      cookieConsent: true,
      dataRetention: 30,
      allowDataExport: true
    },

    optimization: {
      useWebWorkers: true,
      compressionEnabled: true,
      lazyLoadComponents: true,
      debounceInterval: 500,
      throttleInterval: 2000
    },

    integrations: {
      supabase: {
        enabled: true,
        projectUrl: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        tableName: 'monitoring_events'
      },
      analytics: {
        enabled: true,
        googleAnalytics: {
          measurementId: process.env.GA_MEASUREMENT_ID || ''
        }
      },
      errorReporting: {
        sentry: {
          dsn: process.env.SENTRY_DSN || '',
          environment: 'staging',
          tracesSampleRate: 0.5
        }
      }
    }
  },

  production: {
    environment: 'production',
    enabled: true,
    
    features: {
      errorTracking: true,
      performanceMonitoring: true,
      userAnalytics: true,
      componentProfiling: false, // Disabled in production for performance
      regressionDetection: true,
      realTimeAlerts: true,
      dashboard: false // Dashboard usually accessed separately
    },

    collection: {
      metricsInterval: 30000, // 30 seconds
      errorSampling: 1.0, // Track all errors in production
      analyticsSampling: 0.1, // Sample 10% of interactions
      maxSessionDuration: 4 * 60 * 60 * 1000, // 4 hours
      batchSize: 500,
      retentionPeriod: 90 * 24 * 60 * 60 * 1000 // 90 days
    },

    thresholds: {
      performance: {
        responseTime: { warning: 5000, critical: 15000 },
        fps: { warning: 55, critical: 40 },
        memoryUsage: { warning: 60, critical: 120 },
        bundleSize: { warning: 3 * 1024 * 1024, critical: 6 * 1024 * 1024 },
        errorRate: { warning: 0.01, critical: 0.05 }
      },
      userExperience: {
        engagementTime: { minimum: 60000 },
        dropoffRate: { warning: 0.2, critical: 0.3 },
        satisfactionScore: { minimum: 4.2 }
      },
      system: {
        cpuUsage: { warning: 50, critical: 70 },
        networkLatency: { warning: 500, critical: 1500 },
        cacheHitRate: { minimum: 0.9 }
      }
    },

    dashboard: {
      refreshInterval: 60000,
      timeRange: '24h',
      enableRealTime: false,
      widgets: [],
      alerts: {
        enabled: false,
        sound: false,
        desktop: false
      }
    },

    alerts: {
      enabled: true,
      channels: ['webhook', 'email', 'sentry'],
      webhookUrl: process.env.MONITORING_WEBHOOK_URL,
      emailSettings: {
        to: ['alerts@company.com', 'team@company.com'],
        from: 'monitoring@company.com',
        subject: 'Production Alert'
      },
      sentrySettings: {
        dsn: process.env.SENTRY_DSN || '',
        environment: 'production',
        release: process.env.APP_VERSION
      },
      rateLimiting: {
        maxAlertsPerHour: 10,
        suppressDuplicates: true,
        suppressionWindow: 1800000 // 30 minutes
      }
    },

    privacy: {
      anonymizeUserData: true,
      excludePaths: ['/admin', '/debug', '/internal'],
      excludeElements: ['[data-private]', '.sensitive', '.internal', '.pii'],
      cookieConsent: true,
      dataRetention: 90,
      allowDataExport: false
    },

    optimization: {
      useWebWorkers: true,
      compressionEnabled: true,
      lazyLoadComponents: true,
      debounceInterval: 1000,
      throttleInterval: 5000
    },

    integrations: {
      supabase: {
        enabled: true,
        projectUrl: process.env.SUPABASE_URL,
        anonKey: process.env.SUPABASE_ANON_KEY,
        tableName: 'monitoring_events'
      },
      analytics: {
        enabled: true,
        googleAnalytics: {
          measurementId: process.env.GA_MEASUREMENT_ID || ''
        },
        mixpanel: {
          projectToken: process.env.MIXPANEL_PROJECT_TOKEN || ''
        }
      },
      errorReporting: {
        sentry: {
          dsn: process.env.SENTRY_DSN || '',
          environment: 'production',
          tracesSampleRate: 0.1
        },
        bugsnag: {
          apiKey: process.env.BUGSNAG_API_KEY || '',
          releaseStage: 'production'
        }
      }
    }
  }
};

/**
 * Configuration loader with environment detection
 */
export class MonitoringConfigLoader {
  private static instance: MonitoringConfigLoader;
  private config: MonitoringConfiguration;

  private constructor() {
    this.config = this.loadConfiguration();
  }

  static getInstance(): MonitoringConfigLoader {
    if (!MonitoringConfigLoader.instance) {
      MonitoringConfigLoader.instance = new MonitoringConfigLoader();
    }
    return MonitoringConfigLoader.instance;
  }

  getConfig(): MonitoringConfiguration {
    return { ...this.config };
  }

  updateConfig(updates: Partial<MonitoringConfiguration>): void {
    this.config = { ...this.config, ...updates };
  }

  private loadConfiguration(): MonitoringConfiguration {
    // Detect environment
    const environment = this.detectEnvironment();
    
    // Load base configuration
    const baseConfig = defaultConfigurations[environment] || defaultConfigurations.development;
    
    // Apply environment variable overrides
    const envOverrides = this.loadEnvironmentOverrides();
    
    // Merge configurations
    return this.mergeConfigurations(baseConfig, envOverrides);
  }

  private detectEnvironment(): string {
    // Check various environment indicators
    if (typeof process !== 'undefined' && process.env.NODE_ENV) {
      return process.env.NODE_ENV;
    }
    
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname.includes('127.0.0.1')) {
        return 'development';
      }
      
      if (hostname.includes('staging') || hostname.includes('test')) {
        return 'staging';
      }
      
      return 'production';
    }
    
    return 'development';
  }

  private loadEnvironmentOverrides(): Partial<MonitoringConfiguration> {
    const overrides: Partial<MonitoringConfiguration> = {};
    
    if (typeof process !== 'undefined' && process.env) {
      const env = process.env;
      
      // Feature toggles
      if (env.MONITORING_ENABLED !== undefined) {
        overrides.enabled = env.MONITORING_ENABLED === 'true';
      }
      
      // Collection settings
      if (env.MONITORING_METRICS_INTERVAL) {
        overrides.collection = {
          ...overrides.collection,
          metricsInterval: parseInt(env.MONITORING_METRICS_INTERVAL)
        };
      }
      
      // Alert settings
      if (env.MONITORING_WEBHOOK_URL) {
        overrides.alerts = {
          ...overrides.alerts,
          webhookUrl: env.MONITORING_WEBHOOK_URL
        };
      }
      
      // Sentry integration
      if (env.SENTRY_DSN) {
        overrides.integrations = {
          ...overrides.integrations,
          errorReporting: {
            sentry: {
              dsn: env.SENTRY_DSN,
              environment: this.detectEnvironment(),
              tracesSampleRate: parseFloat(env.SENTRY_TRACES_SAMPLE_RATE || '0.1')
            }
          }
        };
      }
    }
    
    return overrides;
  }

  private mergeConfigurations(
    base: MonitoringConfiguration, 
    overrides: Partial<MonitoringConfiguration>
  ): MonitoringConfiguration {
    return {
      ...base,
      ...overrides,
      features: { ...base.features, ...overrides.features },
      collection: { ...base.collection, ...overrides.collection },
      thresholds: { 
        ...base.thresholds, 
        ...overrides.thresholds,
        performance: { ...base.thresholds.performance, ...overrides.thresholds?.performance },
        userExperience: { ...base.thresholds.userExperience, ...overrides.thresholds?.userExperience },
        system: { ...base.thresholds.system, ...overrides.thresholds?.system }
      },
      dashboard: { ...base.dashboard, ...overrides.dashboard },
      alerts: { ...base.alerts, ...overrides.alerts },
      privacy: { ...base.privacy, ...overrides.privacy },
      optimization: { ...base.optimization, ...overrides.optimization },
      integrations: {
        ...base.integrations,
        ...overrides.integrations,
        supabase: { ...base.integrations.supabase, ...overrides.integrations?.supabase },
        analytics: { ...base.integrations.analytics, ...overrides.integrations?.analytics },
        errorReporting: { ...base.integrations.errorReporting, ...overrides.integrations?.errorReporting }
      }
    };
  }
}

// Export singleton instance
export const monitoringConfig = MonitoringConfigLoader.getInstance();