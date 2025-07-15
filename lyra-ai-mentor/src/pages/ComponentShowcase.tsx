
import React, { Suspense } from 'react';

// Simple error boundary without external dependency
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Lazy load the actual ComponentShowcase
const LazyComponentShowcase = React.lazy(() => import('./ComponentShowcaseInternal'));

const ComponentShowcase = () => {
  return (
    <ErrorBoundary fallback={<div>Error loading ComponentShowcase</div>}>
      <Suspense fallback={<div>Loading ComponentShowcase...</div>}>
        <LazyComponentShowcase />
      </Suspense>
    </ErrorBoundary>
  );
};

export default ComponentShowcase;
