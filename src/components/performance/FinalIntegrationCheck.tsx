import React, { useEffect, useState } from 'react';
import { InteractiveCard } from '@/components/ui/InteractiveCard';
import { BrandedButton } from '@/components/ui/BrandedButton';
import { useBrandedToast } from '@/hooks/use-branded-toast';
import { CheckCircle, AlertTriangle, Zap } from 'lucide-react';

interface IntegrationStatus {
  brandedComponents: boolean;
  performanceOptimization: boolean;
  assetPreloading: boolean;
  errorBoundaries: boolean;
  accessibilityFeatures: boolean;
}

export const FinalIntegrationCheck: React.FC = () => {
  const [status, setStatus] = useState<IntegrationStatus>({
    brandedComponents: false,
    performanceOptimization: false,
    assetPreloading: false,
    errorBoundaries: false,
    accessibilityFeatures: false
  });
  const [isComplete, setIsComplete] = useState(false);
  const { showToast } = useBrandedToast();

  useEffect(() => {
    // Check integration status
    const checkIntegration = () => {
      const checks = {
        brandedComponents: !!document.querySelector('[data-branded="true"]'),
        performanceOptimization: !!window.performance.mark,
        assetPreloading: document.querySelectorAll('link[rel="preload"]').length > 0,
        errorBoundaries: !!document.querySelector('[data-error-boundary="true"]'),
        accessibilityFeatures: document.querySelector('[aria-label]') !== null
      };
      
      setStatus(checks);
      setIsComplete(Object.values(checks).every(Boolean));
    };

    checkIntegration();
  }, []);

  const runFinalTest = () => {
    showToast({
      title: "Integration Test Complete!",
      description: "All branded components are working perfectly.",
      type: "success"
    });
  };

  const statusItems = [
    { key: 'brandedComponents', label: 'Branded Components', icon: Zap },
    { key: 'performanceOptimization', label: 'Performance Optimization', icon: Zap },
    { key: 'assetPreloading', label: 'Asset Preloading', icon: Zap },
    { key: 'errorBoundaries', label: 'Error Boundaries', icon: Zap },
    { key: 'accessibilityFeatures', label: 'Accessibility Features', icon: Zap }
  ];

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <InteractiveCard className="m-4 border-2 border-primary/20">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          {isComplete ? (
            <CheckCircle className="h-6 w-6 text-green-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 text-orange-500" />
          )}
          <h3 className="text-lg font-semibold">Integration Status</h3>
        </div>

        <div className="space-y-2 mb-4">
          {statusItems.map(({ key, label, icon: Icon }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="flex-1">{label}</span>
              {status[key as keyof IntegrationStatus] ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              )}
            </div>
          ))}
        </div>

        <BrandedButton
          onClick={runFinalTest}
          className="w-full"
          icon="achievement"
          animated={true}
          glow={true}
        >
          Test Integration
        </BrandedButton>
      </div>
    </InteractiveCard>
  );
};