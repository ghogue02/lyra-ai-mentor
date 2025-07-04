import { PerformanceMonitor } from './PerformanceMonitor';
import { PerformanceMetric } from './types';

// Axios interceptor for API performance tracking
export function createAxiosPerformanceInterceptor(axiosInstance: any) {
  // Request interceptor
  axiosInstance.interceptors.request.use(
    (config: any) => {
      config.metadata = { startTime: Date.now() };
      return config;
    },
    (error: any) => {
      PerformanceMonitor.trackError(error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: any) => {
      if (response.config.metadata?.startTime) {
        const duration = Date.now() - response.config.metadata.startTime;
        const metric: PerformanceMetric = {
          id: `api-${Date.now()}-${Math.random()}`,
          type: 'api-call',
          name: `${response.config.method?.toUpperCase()} ${response.config.url}`,
          value: duration,
          timestamp: Date.now(),
          metadata: {
            status: response.status,
            method: response.config.method,
            url: response.config.url
          }
        };
        
        PerformanceMonitor.trackRender('API Call', duration);
        
        // Alert on slow API calls
        if (duration > 3000) {
          console.warn(`Slow API call: ${metric.name} took ${duration}ms`);
        }
      }
      return response;
    },
    (error: any) => {
      if (error.config?.metadata?.startTime) {
        const duration = Date.now() - error.config.metadata.startTime;
        PerformanceMonitor.trackError(
          new Error(`API Error: ${error.config.method?.toUpperCase()} ${error.config.url} - ${error.message}`)
        );
      } else {
        PerformanceMonitor.trackError(error);
      }
      return Promise.reject(error);
    }
  );
}

// React Query middleware for query performance tracking
export function createReactQueryPerformanceLogger() {
  return {
    onSuccess: (data: any, query: any) => {
      if (query.state.dataUpdatedAt && query.state.fetchMeta?.fetchStart) {
        const duration = query.state.dataUpdatedAt - query.state.fetchMeta.fetchStart;
        PerformanceMonitor.trackRender(`Query: ${query.queryKey[0]}`, duration);
      }
    },
    onError: (error: Error, query: any) => {
      PerformanceMonitor.trackError(
        new Error(`Query Error: ${query.queryKey[0]} - ${error.message}`)
      );
    }
  };
}

// Redux middleware for action performance tracking (if using Redux)
export const reduxPerformanceMiddleware = (store: any) => (next: any) => (action: any) => {
  const start = Date.now();
  const result = next(action);
  const duration = Date.now() - start;
  
  if (duration > 16) { // Log actions taking more than 16ms
    console.warn(`Slow Redux action: ${action.type} took ${duration}ms`);
  }
  
  return result;
};

// Custom fetch wrapper with performance tracking
export async function performanceTrackedFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const startTime = Date.now();
  const url = typeof input === 'string' ? input : input.toString();
  
  try {
    const response = await fetch(input, init);
    const duration = Date.now() - startTime;
    
    const metric: PerformanceMetric = {
      id: `fetch-${Date.now()}-${Math.random()}`,
      type: 'api-call',
      name: `${init?.method || 'GET'} ${url}`,
      value: duration,
      timestamp: Date.now(),
      metadata: {
        status: response.status,
        method: init?.method || 'GET',
        url
      }
    };
    
    PerformanceMonitor.trackRender('Fetch Call', duration);
    
    if (!response.ok) {
      PerformanceMonitor.trackError(
        new Error(`Fetch Error: ${init?.method || 'GET'} ${url} - Status: ${response.status}`)
      );
    }
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    PerformanceMonitor.trackError(
      error instanceof Error ? error : new Error(`Fetch Error: ${init?.method || 'GET'} ${url}`)
    );
    throw error;
  }
}

// Supabase client wrapper with performance tracking
export function createSupabasePerformanceWrapper(supabaseClient: any) {
  const performanceWrapper = (operation: string, table?: string) => {
    return new Proxy(supabaseClient, {
      get(target, prop) {
        if (typeof target[prop] === 'function') {
          return async (...args: any[]) => {
            const startTime = Date.now();
            const operationName = table ? `${operation}.${table}.${String(prop)}` : `${operation}.${String(prop)}`;
            
            try {
              const result = await target[prop](...args);
              const duration = Date.now() - startTime;
              
              PerformanceMonitor.trackRender(`Supabase: ${operationName}`, duration);
              
              if (duration > 1000) {
                console.warn(`Slow Supabase operation: ${operationName} took ${duration}ms`);
              }
              
              return result;
            } catch (error) {
              PerformanceMonitor.trackError(
                error instanceof Error ? error : new Error(`Supabase Error: ${operationName}`)
              );
              throw error;
            }
          };
        }
        
        if (typeof target[prop] === 'object' && target[prop] !== null) {
          return performanceWrapper(`${operation}.${String(prop)}`, table);
        }
        
        return target[prop];
      }
    });
  };
  
  return performanceWrapper('supabase');
}

// Web Vitals tracking integration
export function trackWebVitals() {
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        PerformanceMonitor.trackRender('LCP', lastEntry.startTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP tracking not supported');
    }

    // First Input Delay
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          PerformanceMonitor.trackRender('FID', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID tracking not supported');
    }

    // Cumulative Layout Shift
    try {
      let cls = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            cls += entry.value;
          }
        });
        PerformanceMonitor.trackRender('CLS', cls);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS tracking not supported');
    }
  }
}