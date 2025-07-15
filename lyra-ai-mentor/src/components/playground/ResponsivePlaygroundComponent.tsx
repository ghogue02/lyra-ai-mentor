import React, { Suspense } from 'react';
import { useResponsive } from '@/hooks/useResponsive';

// Dynamic imports for code splitting using React.lazy
const SofiaVoiceFinder = React.lazy(() => import('./challenges/SofiaVoiceFinder'));
const MobileSofiaVoiceFinder = React.lazy(() => import('./challenges/mobile/MobileSofiaVoiceFinder'));

const DavidDataStoryteller = React.lazy(() => import('./challenges/DavidDataStoryteller'));
const MobileDavidDataStoryteller = React.lazy(() => import('./challenges/mobile/MobileDavidDataStoryteller'));

const AlexChangeNavigator = React.lazy(() => import('./challenges/AlexChangeNavigator'));
const RachelAutomationBuilder = React.lazy(() => import('./challenges/RachelAutomationBuilder'));
const MayaEmailChallenge = React.lazy(() => import('./challenges/MayaEmailChallenge'));

interface ResponsivePlaygroundComponentProps {
  component: 'sofia' | 'david' | 'alex' | 'rachel' | 'maya';
  onComplete?: (score: number) => void;
  onBack?: () => void;
}

export const ResponsivePlaygroundComponent: React.FC<ResponsivePlaygroundComponentProps> = ({
  component,
  onComplete,
  onBack
}) => {
  const { isMobile, isTablet } = useResponsive();
  const useMobileVersion = isMobile || (isTablet && window.innerWidth < 900);

  const renderComponent = () => {
    switch (component) {
      case 'sofia':
        return useMobileVersion ? (
          <MobileSofiaVoiceFinder onComplete={onComplete} onBack={onBack} />
        ) : (
          <SofiaVoiceFinder onComplete={onComplete} />
        );
        
      case 'david':
        return useMobileVersion ? (
          <MobileDavidDataStoryteller onComplete={onComplete} onBack={onBack} />
        ) : (
          <DavidDataStoryteller onComplete={onComplete} />
        );
        
      case 'alex':
        // TODO: Create mobile version
        return <AlexChangeNavigator onComplete={onComplete} />;
        
      case 'rachel':
        // TODO: Create mobile version
        return <RachelAutomationBuilder onComplete={onComplete} />;
        
      case 'maya':
        // TODO: Create mobile version
        return <MayaEmailChallenge onComplete={onComplete} />;
        
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      {renderComponent()}
    </Suspense>
  );
};