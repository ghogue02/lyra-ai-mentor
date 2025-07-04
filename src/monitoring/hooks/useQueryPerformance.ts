import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PerformanceMonitor } from '../PerformanceMonitor';

/**
 * Hook to set up React Query performance monitoring
 * Call this once in your app root
 */
export function useQueryPerformanceMonitoring() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Set up default options for performance tracking
    const defaultOptions = queryClient.getDefaultOptions();
    
    queryClient.setDefaultOptions({
      ...defaultOptions,
      queries: {
        ...defaultOptions.queries,
        onSuccess: (data: any, query: any) => {
          // Track successful query performance
          if (query.state.dataUpdatedAt && query.state.dataUpdateCount > 0) {
            const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : query.queryKey;
            PerformanceMonitor.trackRender(`Query: ${queryKey}`, query.state.fetchFailureCount);
          }
          
          // Call original onSuccess if exists
          defaultOptions.queries?.onSuccess?.(data, query);
        },
        onError: (error: Error, query: any) => {
          // Track query errors
          const queryKey = Array.isArray(query.queryKey) ? query.queryKey[0] : query.queryKey;
          PerformanceMonitor.trackError(
            new Error(`Query Error [${queryKey}]: ${error.message}`)
          );
          
          // Call original onError if exists
          defaultOptions.queries?.onError?.(error, query);
        },
      },
      mutations: {
        ...defaultOptions.mutations,
        onSuccess: (data: any, variables: any, context: any, mutation: any) => {
          // Track successful mutation performance
          const mutationKey = mutation.options.mutationKey?.[0] || 'unnamed';
          PerformanceMonitor.trackRender(`Mutation: ${mutationKey}`, 0);
          
          // Call original onSuccess if exists
          defaultOptions.mutations?.onSuccess?.(data, variables, context, mutation);
        },
        onError: (error: Error, variables: any, context: any, mutation: any) => {
          // Track mutation errors
          const mutationKey = mutation.options.mutationKey?.[0] || 'unnamed';
          PerformanceMonitor.trackError(
            new Error(`Mutation Error [${mutationKey}]: ${error.message}`)
          );
          
          // Call original onError if exists
          defaultOptions.mutations?.onError?.(error, variables, context, mutation);
        },
      },
    });

    // Set up cache event monitoring
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'queryUpdated' && event.query.state.fetchStatus === 'idle') {
        const queryKey = Array.isArray(event.query.queryKey) 
          ? event.query.queryKey[0] 
          : event.query.queryKey;
        
        // Track cache hits
        if (event.query.state.dataUpdateCount === 0 && event.query.state.data) {
          console.log(`[Performance] Cache hit for query: ${queryKey}`);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryClient]);
}

/**
 * Hook to track individual query performance
 */
export function useQueryPerformance(queryKey: string) {
  useEffect(() => {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      if (duration > 0) {
        PerformanceMonitor.trackRender(`QueryLifecycle: ${queryKey}`, duration);
      }
    };
  }, [queryKey]);
}