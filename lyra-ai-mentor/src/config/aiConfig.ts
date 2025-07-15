// AI Configuration and Management
// Environment variables override defaults for production flexibility

const getEnvNumber = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  return value ? parseInt(value, 10) : defaultValue;
};

const getEnvBoolean = (key: string, defaultValue: boolean): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
};

const getEnvString = (key: string, defaultValue: string): string => {
  return import.meta.env[key] || defaultValue;
};

export const AI_CONFIG = {
  // API Keys (loaded from environment)
  API_KEYS: {
    OPENAI: import.meta.env.VITE_OPENAI_API_KEY || '',
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },

  // Rate Limiting (configurable via environment)
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: getEnvNumber('VITE_RATE_LIMIT_REQUESTS_PER_MINUTE', 50),
    REQUESTS_PER_HOUR: getEnvNumber('VITE_RATE_LIMIT_REQUESTS_PER_HOUR', 500),
    TOKENS_PER_MINUTE: getEnvNumber('VITE_RATE_LIMIT_TOKENS_PER_MINUTE', 40000),
    COST_LIMIT_PER_DAY: getEnvNumber('VITE_COST_LIMIT_PER_DAY_USD', 20), // USD
  },

  // Model Selection (configurable via environment)
  MODELS: {
    TEXT_GENERATION: getEnvString('VITE_OPENAI_MODEL_TEXT', 'gpt-4o-mini'),
    HIGH_QUALITY: getEnvString('VITE_OPENAI_MODEL_HIGH_QUALITY', 'gpt-4o'),
    FAST_RESPONSES: getEnvString('VITE_OPENAI_MODEL_FAST', 'gpt-3.5-turbo'),
    TTS_MODEL: getEnvString('VITE_TTS_MODEL', 'tts-1'),
    STT_MODEL: getEnvString('VITE_STT_MODEL', 'whisper-1'),
    IMAGE_MODEL: getEnvString('VITE_IMAGE_MODEL', 'dall-e-3'),
  },

  // Voice Configuration
  VOICE: {
    DEFAULT_VOICE: getEnvString('VITE_TTS_VOICE', 'alloy'),
    DEFAULT_LANGUAGE: getEnvString('VITE_STT_LANGUAGE', 'en'),
  },

  // Image Configuration
  IMAGE: {
    SIZE: getEnvString('VITE_IMAGE_SIZE', '1024x1024') as '256x256' | '512x512' | '1024x1024',
    QUALITY: getEnvString('VITE_IMAGE_QUALITY', 'standard') as 'standard' | 'hd',
    STYLE: getEnvString('VITE_IMAGE_STYLE', 'vivid') as 'vivid' | 'natural',
  },

  // Default Parameters
  DEFAULTS: {
    TEMPERATURE: 0.7,
    MAX_TOKENS: 800,
    TIMEOUT: getEnvNumber('VITE_ERROR_FALLBACK_TIMEOUT_MS', 30000),
    MAX_RETRIES: getEnvNumber('VITE_MAX_RETRIES', 3),
    RETRY_DELAY: getEnvNumber('VITE_RETRY_DELAY_MS', 1000),
  },

  // Character-specific configurations
  CHARACTERS: {
    maya: {
      systemMessage: 'You are Maya Rodriguez, a skilled nonprofit Program Director specializing in communication and community engagement. You help nonprofit professionals craft empathetic, professional emails and communications.',
      temperature: 0.7,
      maxTokens: 800,
      tone: 'warm and professional'
    },
    alex: {
      systemMessage: 'You are Alex Chen, an experienced Executive Director and change management expert. You help nonprofit leaders navigate organizational transformation and strategic initiatives.',
      temperature: 0.8,
      maxTokens: 1200,
      tone: 'strategic and decisive'
    },
    david: {
      systemMessage: 'You are David Chen, a data analyst and visualization expert for nonprofits. You help organizations extract insights from data and communicate findings effectively.',
      temperature: 0.6,
      maxTokens: 1000,
      tone: 'analytical and clear'
    },
    rachel: {
      systemMessage: 'You are Rachel Torres, an operations manager and automation specialist. You help nonprofits streamline workflows and implement technology solutions.',
      temperature: 0.8,
      maxTokens: 1200,
      tone: 'efficient and practical'
    },
    sofia: {
      systemMessage: 'You are Sofia Reyes, a communications director and storytelling expert. You help nonprofits craft compelling narratives that inspire action and engagement.',
      temperature: 0.8,
      maxTokens: 1000,
      tone: 'creative and inspiring'
    }
  },

  // Feature flags (configurable via environment)
  FEATURES: {
    STREAMING_ENABLED: getEnvBoolean('VITE_FEATURE_STREAMING_ENABLED', true),
    CACHING_ENABLED: getEnvBoolean('VITE_CACHE_ENABLED', true),
    FALLBACK_TO_MOCK: getEnvBoolean('VITE_FEATURE_FALLBACK_TO_MOCK', true),
    COST_TRACKING: getEnvBoolean('VITE_FEATURE_COST_TRACKING', true),
    RATE_LIMITING: true, // Always enabled for safety
    MULTIMODAL_ENABLED: getEnvBoolean('VITE_FEATURE_MULTIMODAL_ENABLED', true),
    VOICE_ENABLED: getEnvBoolean('VITE_FEATURE_VOICE_ENABLED', true),
  },

  // Error handling (configurable via environment)
  ERROR_HANDLING: {
    MAX_RETRIES: getEnvNumber('VITE_MAX_RETRIES', 3),
    RETRY_DELAY_BASE: getEnvNumber('VITE_RETRY_DELAY_MS', 1000),
    FALLBACK_TIMEOUT: getEnvNumber('VITE_ERROR_FALLBACK_TIMEOUT_MS', 5000),
    SHOW_API_ERRORS: getEnvBoolean('VITE_ERROR_SHOW_API_ERRORS', false),
    REPORTING_ENABLED: getEnvBoolean('VITE_ERROR_REPORTING_ENABLED', true),
  },

  // Cache settings (configurable via environment)
  CACHE: {
    TTL: getEnvNumber('VITE_CACHE_TTL_MS', 300000), // 5 minutes default
    MAX_SIZE: getEnvNumber('VITE_CACHE_MAX_SIZE', 100),
    ENABLED_FOR_CHARACTERS: ['maya', 'alex', 'david', 'rachel', 'sofia'],
  },

  // Security Configuration
  SECURITY: {
    CSP_ENABLED: getEnvBoolean('VITE_CSP_ENABLED', true),
    CORS_ALLOWED_ORIGINS: getEnvString('VITE_CORS_ALLOWED_ORIGINS', '').split(',').filter(Boolean),
    API_KEY_ROTATION_DAYS: getEnvNumber('VITE_API_KEY_ROTATION_DAYS', 90),
    SESSION_TIMEOUT_MINUTES: getEnvNumber('VITE_SESSION_TIMEOUT_MINUTES', 60),
  },

  // Analytics Configuration
  ANALYTICS: {
    ENABLED: getEnvBoolean('VITE_ANALYTICS_ENABLED', true),
    ID: getEnvString('VITE_ANALYTICS_ID', ''),
    PERFORMANCE_MONITORING: getEnvBoolean('VITE_PERFORMANCE_MONITORING_ENABLED', true),
  },

  // Development Configuration
  DEV: {
    SHOW_DEBUG_INFO: getEnvBoolean('VITE_DEV_SHOW_DEBUG_INFO', import.meta.env.DEV),
    LOG_LEVEL: getEnvString('VITE_DEV_LOG_LEVEL', 'info') as 'error' | 'warn' | 'info' | 'debug',
    MOCK_DELAY_MS: getEnvNumber('VITE_DEV_MOCK_DELAY_MS', 0),
  }
};

export type CharacterType = keyof typeof AI_CONFIG.CHARACTERS;

// Environment-specific overrides and validation
export const getAIConfig = () => {
  const config = { ...AI_CONFIG };
  
  // Validate required API keys
  if (!config.API_KEYS.OPENAI && import.meta.env.PROD) {
    console.error('WARNING: OpenAI API key is not configured. AI features will be limited.');
  }
  
  if (!config.API_KEYS.SUPABASE_URL || !config.API_KEYS.SUPABASE_ANON_KEY) {
    console.error('WARNING: Supabase configuration is missing. Database features will not work.');
  }
  
  // Apply environment-specific overrides
  if (import.meta.env.DEV) {
    // Development overrides for safety
    config.RATE_LIMITS.REQUESTS_PER_MINUTE = Math.min(config.RATE_LIMITS.REQUESTS_PER_MINUTE, 20);
    config.RATE_LIMITS.COST_LIMIT_PER_DAY = Math.min(config.RATE_LIMITS.COST_LIMIT_PER_DAY, 5);
    config.ERROR_HANDLING.SHOW_API_ERRORS = true;
  }
  
  if (import.meta.env.PROD) {
    // Production overrides for reliability
    config.FEATURES.FALLBACK_TO_MOCK = false;
    config.ERROR_HANDLING.SHOW_API_ERRORS = false;
    config.DEV.SHOW_DEBUG_INFO = false;
  }
  
  return config;
};

// API Key rotation check
export const checkAPIKeyRotation = () => {
  const config = getAIConfig();
  const lastRotationKey = 'lastAPIKeyRotation';
  const lastRotation = localStorage.getItem(lastRotationKey);
  
  if (!lastRotation) {
    localStorage.setItem(lastRotationKey, new Date().toISOString());
    return;
  }
  
  const daysSinceRotation = Math.floor(
    (Date.now() - new Date(lastRotation).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSinceRotation >= config.SECURITY.API_KEY_ROTATION_DAYS) {
    console.warn(`API key rotation recommended: ${daysSinceRotation} days since last rotation`);
  }
};

// Configuration status helper
export const getConfigurationStatus = () => {
  const config = getAIConfig();
  return {
    openAI: {
      configured: !!config.API_KEYS.OPENAI,
      models: {
        text: config.MODELS.TEXT_GENERATION,
        highQuality: config.MODELS.HIGH_QUALITY,
        fast: config.MODELS.FAST_RESPONSES,
      },
    },
    supabase: {
      configured: !!config.API_KEYS.SUPABASE_URL && !!config.API_KEYS.SUPABASE_ANON_KEY,
      url: config.API_KEYS.SUPABASE_URL,
    },
    features: config.FEATURES,
    rateLimits: config.RATE_LIMITS,
    security: {
      cspEnabled: config.SECURITY.CSP_ENABLED,
      sessionTimeout: config.SECURITY.SESSION_TIMEOUT_MINUTES,
    },
    environment: {
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      isProd: import.meta.env.PROD,
    },
  };
};