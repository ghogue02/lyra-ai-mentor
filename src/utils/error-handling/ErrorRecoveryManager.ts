interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<void>;
  successRate: number;
  estimatedTime: number; // in milliseconds
}

interface RecoveryResult {
  success: boolean;
  strategy: string;
  duration: number;
  error?: Error;
}

export class ErrorRecoveryManager {
  private recoveryHistory: RecoveryResult[] = [];
  private readonly MAX_HISTORY_SIZE = 50;

  constructor() {
    this.setupRecoveryStrategies();
  }

  private setupRecoveryStrategies(): void {
    // Initialize recovery strategies based on historical success rates
    this.loadRecoveryHistory();
  }

  private loadRecoveryHistory(): void {
    try {
      const history = localStorage.getItem('error_recovery_history');
      if (history) {
        this.recoveryHistory = JSON.parse(history);
      }
    } catch (e) {
      console.warn('Failed to load recovery history:', e);
    }
  }

  private saveRecoveryHistory(): void {
    try {
      const recentHistory = this.recoveryHistory.slice(-this.MAX_HISTORY_SIZE);
      localStorage.setItem('error_recovery_history', JSON.stringify(recentHistory));
    } catch (e) {
      console.warn('Failed to save recovery history:', e);
    }
  }

  async attemptNetworkRecovery(): Promise<RecoveryResult> {
    const strategies: RecoveryStrategy[] = [
      {
        id: 'connection-test',
        name: 'Connection Test',
        description: 'Test basic network connectivity',
        execute: async () => {
          const response = await fetch('/ping', { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          if (!response.ok) {
            throw new Error('Network test failed');
          }
        },
        successRate: 0.9,
        estimatedTime: 2000
      },
      {
        id: 'dns-flush',
        name: 'DNS Refresh',
        description: 'Clear DNS cache and retry',
        execute: async () => {
          // Force DNS refresh by appending cache-busting parameter
          const testUrl = `${window.location.origin}?_t=${Date.now()}`;
          const response = await fetch(testUrl, { 
            method: 'HEAD',
            cache: 'no-cache'
          });
          if (!response.ok) {
            throw new Error('DNS refresh failed');
          }
        },
        successRate: 0.7,
        estimatedTime: 3000
      },
      {
        id: 'offline-mode',
        name: 'Offline Mode',
        description: 'Switch to cached content',
        execute: async () => {
          // Enable offline mode if service worker is available
          if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
              // Signal to use cached resources
              registration.active?.postMessage({ type: 'ENABLE_OFFLINE_MODE' });
            }
          }
        },
        successRate: 0.8,
        estimatedTime: 1000
      }
    ];

    return this.executeRecoveryStrategy(strategies[0]); // Start with most likely to succeed
  }

  async clearChunkCache(): Promise<RecoveryResult> {
    const strategy: RecoveryStrategy = {
      id: 'chunk-cache-clear',
      name: 'Clear Chunk Cache',
      description: 'Remove cached JavaScript chunks and reload',
      execute: async () => {
        // Clear module cache
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => {
              if (cacheName.includes('chunk') || cacheName.includes('js')) {
                return caches.delete(cacheName);
              }
            })
          );
        }

        // Clear dynamic imports cache
        if ((window as any).__webpackChunkName) {
          delete (window as any).__webpackChunkName;
        }

        // Force reload of dynamic imports
        const scripts = document.querySelectorAll('script[src*="chunk"]');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.src = script.getAttribute('src') + `?_t=${Date.now()}`;
          newScript.async = true;
          script.parentNode?.replaceChild(newScript, script);
        });
      },
      successRate: 0.85,
      estimatedTime: 2000
    };

    return this.executeRecoveryStrategy(strategy);
  }

  async resetApplicationState(): Promise<RecoveryResult> {
    const strategy: RecoveryStrategy = {
      id: 'app-state-reset',
      name: 'Reset Application State',
      description: 'Clear application state and restart',
      execute: async () => {
        // Clear React Query cache
        if ((window as any).queryClient) {
          (window as any).queryClient.clear();
        }

        // Clear Redux store if present
        if ((window as any).__REDUX_STORE__) {
          (window as any).__REDUX_STORE__.dispatch({ type: 'RESET_STATE' });
        }

        // Clear React Context data
        const contextKeys = [
          'auth_context',
          'character_story_context',
          'global_chat_context',
          'interaction_pattern_context'
        ];
        
        contextKeys.forEach(key => {
          sessionStorage.removeItem(key);
          localStorage.removeItem(key);
        });

        // Clear component state
        this.clearComponentStates();

        // Force React to re-render from clean state
        const event = new CustomEvent('app-state-reset');
        window.dispatchEvent(event);
      },
      successRate: 0.75,
      estimatedTime: 1500
    };

    return this.executeRecoveryStrategy(strategy);
  }

  async resetInteractionPattern(patternType: string): Promise<RecoveryResult> {
    const strategy: RecoveryStrategy = {
      id: `pattern-reset-${patternType}`,
      name: `Reset ${patternType} Pattern`,
      description: `Clear state for ${patternType} interaction pattern`,
      execute: async () => {
        // Clear pattern-specific state
        const patternKeys = [
          `pattern_state_${patternType}`,
          `pattern_progress_${patternType}`,
          `pattern_selections_${patternType}`,
          `pattern_analytics_${patternType}`
        ];

        patternKeys.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        // Clear pattern analytics
        const analyticsKey = `interaction_analytics_${patternType}`;
        localStorage.removeItem(analyticsKey);

        // Reset pattern configuration
        const configEvent = new CustomEvent('pattern-config-reset', {
          detail: { patternType }
        });
        window.dispatchEvent(configEvent);
      },
      successRate: 0.9,
      estimatedTime: 500
    };

    return this.executeRecoveryStrategy(strategy);
  }

  async resetCarmenComponent(componentType: string, chapterNumber?: number): Promise<RecoveryResult> {
    const strategy: RecoveryStrategy = {
      id: `carmen-reset-${componentType}`,
      name: `Reset Carmen ${componentType}`,
      description: `Clear state for Carmen's ${componentType} component`,
      execute: async () => {
        // Clear Carmen-specific state
        const carmenKeys = [
          `carmen_${componentType}_state`,
          `carmen_${componentType}_progress`,
          `carmen_${componentType}_selections`,
          `carmen_narrative_progress_${componentType}`
        ];

        if (chapterNumber) {
          carmenKeys.push(`chapter_${chapterNumber}_carmen_progress`);
        }

        carmenKeys.forEach(key => {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        });

        // Clear generated content cache
        const contentKey = `generated_content_carmen_${componentType}`;
        localStorage.removeItem(contentKey);

        // Reset Carmen's character state
        const characterEvent = new CustomEvent('character-state-reset', {
          detail: { character: 'carmen', component: componentType }
        });
        window.dispatchEvent(characterEvent);
      },
      successRate: 0.95,
      estimatedTime: 300
    };

    return this.executeRecoveryStrategy(strategy);
  }

  async clearAllCaches(): Promise<RecoveryResult> {
    const strategy: RecoveryStrategy = {
      id: 'clear-all-caches',
      name: 'Clear All Caches',
      description: 'Remove all cached data and reset application',
      execute: async () => {
        // Clear browser caches
        if ('caches' in window) {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        // Clear storage
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          // Some browsers may restrict this
          console.warn('Failed to clear storage:', e);
        }

        // Clear IndexedDB
        if ('indexedDB' in window) {
          try {
            const databases = await indexedDB.databases();
            await Promise.all(
              databases.map(db => {
                if (db.name) {
                  return new Promise<void>((resolve, reject) => {
                    const deleteReq = indexedDB.deleteDatabase(db.name!);
                    deleteReq.onsuccess = () => resolve();
                    deleteReq.onerror = () => reject(deleteReq.error);
                  });
                }
              })
            );
          } catch (e) {
            console.warn('Failed to clear IndexedDB:', e);
          }
        }

        // Clear cookies (if possible)
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
      },
      successRate: 1.0,
      estimatedTime: 3000
    };

    return this.executeRecoveryStrategy(strategy);
  }

  private async executeRecoveryStrategy(strategy: RecoveryStrategy): Promise<RecoveryResult> {
    const startTime = Date.now();
    
    try {
      await strategy.execute();
      
      const duration = Date.now() - startTime;
      const result: RecoveryResult = {
        success: true,
        strategy: strategy.id,
        duration
      };

      // Update success rate based on actual result
      this.updateSuccessRate(strategy.id, true, duration);
      this.recordRecoveryResult(result);
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      const result: RecoveryResult = {
        success: false,
        strategy: strategy.id,
        duration,
        error: error as Error
      };

      this.updateSuccessRate(strategy.id, false, duration);
      this.recordRecoveryResult(result);
      
      return result;
    }
  }

  private clearComponentStates(): void {
    // Clear React component-specific state
    const componentStateKeys = [
      'conversation_flow_state',
      'decision_tree_state',
      'priority_cards_state',
      'preference_sliders_state',
      'timeline_scenario_state',
      'engagement_builder_state'
    ];

    componentStateKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }

  private updateSuccessRate(strategyId: string, success: boolean, duration: number): void {
    const recentResults = this.recoveryHistory
      .filter(result => result.strategy === strategyId)
      .slice(-10); // Last 10 attempts

    const successCount = recentResults.filter(r => r.success).length + (success ? 1 : 0);
    const totalCount = recentResults.length + 1;
    
    const newSuccessRate = successCount / totalCount;
    
    // Store updated success rate
    const rateKey = `recovery_rate_${strategyId}`;
    localStorage.setItem(rateKey, JSON.stringify({
      rate: newSuccessRate,
      lastUpdated: Date.now(),
      sampleSize: totalCount
    }));
  }

  private recordRecoveryResult(result: RecoveryResult): void {
    this.recoveryHistory.push(result);
    
    if (this.recoveryHistory.length > this.MAX_HISTORY_SIZE) {
      this.recoveryHistory = this.recoveryHistory.slice(-this.MAX_HISTORY_SIZE);
    }
    
    this.saveRecoveryHistory();
  }

  // Public methods for monitoring and analysis
  public getRecoveryStats(): {
    totalAttempts: number;
    successRate: number;
    averageDuration: number;
    byStrategy: Record<string, { attempts: number; successRate: number; avgDuration: number }>;
  } {
    const total = this.recoveryHistory.length;
    const successful = this.recoveryHistory.filter(r => r.success).length;
    const totalDuration = this.recoveryHistory.reduce((sum, r) => sum + r.duration, 0);
    
    const byStrategy: Record<string, { attempts: number; successRate: number; avgDuration: number }> = {};
    
    this.recoveryHistory.forEach(result => {
      if (!byStrategy[result.strategy]) {
        byStrategy[result.strategy] = { attempts: 0, successRate: 0, avgDuration: 0 };
      }
      byStrategy[result.strategy].attempts++;
    });
    
    Object.keys(byStrategy).forEach(strategy => {
      const strategyResults = this.recoveryHistory.filter(r => r.strategy === strategy);
      const strategySuccessful = strategyResults.filter(r => r.success).length;
      const strategyDuration = strategyResults.reduce((sum, r) => sum + r.duration, 0);
      
      byStrategy[strategy].successRate = strategySuccessful / strategyResults.length;
      byStrategy[strategy].avgDuration = strategyDuration / strategyResults.length;
    });
    
    return {
      totalAttempts: total,
      successRate: total > 0 ? successful / total : 0,
      averageDuration: total > 0 ? totalDuration / total : 0,
      byStrategy
    };
  }

  public clearRecoveryHistory(): void {
    this.recoveryHistory = [];
    localStorage.removeItem('error_recovery_history');
  }
}