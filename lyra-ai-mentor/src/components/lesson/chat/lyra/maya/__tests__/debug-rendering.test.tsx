import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import LyraNarratedMayaSideBySideComplete from '../LyraNarratedMayaSideBySideComplete';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    button: ({ children, className, onClick, ...props }: any) => <button className={className} onClick={onClick} {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => children,
}));

// Test wrapper
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('Maya Component Debug Rendering', () => {
  it('should render component structure without errors', () => {
    console.log('🔍 Testing basic component rendering...');
    
    const { container } = render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Debug: Log the entire rendered HTML
    console.log('📋 Rendered HTML:', container.innerHTML);
    
    // Check if component rendered anything
    expect(container.firstChild).toBeTruthy();
    console.log('✅ Component rendered successfully');
  });

  it('should render header with title', () => {
    console.log('🔍 Testing header rendering...');
    
    render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Look for Maya's title
    const title = screen.queryByText(/Maya's Complete Communication Mastery/i);
    console.log('📋 Title element:', title);
    
    if (title) {
      console.log('✅ Title found');
    } else {
      console.log('❌ Title not found - checking all text content...');
      const allText = screen.queryAllByText(/Maya/i);
      console.log('📋 All Maya-related text:', allText.map(el => el.textContent));
    }
  });

  it('should render blur overlay elements', () => {
    console.log('🔍 Testing blur overlay rendering...');
    
    const { container } = render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Look for blur-related elements
    const blurElements = container.querySelectorAll('[class*="blur"]');
    console.log('📋 Blur elements found:', blurElements.length);
    
    blurElements.forEach((el, index) => {
      console.log(`📋 Blur element ${index}:`, el.className);
    });

    // Look for backdrop-blur specifically
    const backdropBlurElements = container.querySelectorAll('[class*="backdrop-blur"]');
    console.log('📋 Backdrop blur elements:', backdropBlurElements.length);
    
    backdropBlurElements.forEach((el, index) => {
      console.log(`📋 Backdrop blur element ${index}:`, el.className);
    });
  });

  it('should render fast forward button', () => {
    console.log('🔍 Testing fast forward button rendering...');
    
    render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Look for fast forward button
    const fastForwardButton = screen.queryByText(/fast forward/i);
    console.log('📋 Fast forward button (by text):', fastForwardButton);
    
    const fastForwardByLabel = screen.queryByLabelText(/fast forward/i);
    console.log('📋 Fast forward button (by label):', fastForwardByLabel);
    
    // Look for any buttons
    const allButtons = screen.queryAllByRole('button');
    console.log('📋 All buttons found:', allButtons.length);
    
    allButtons.forEach((button, index) => {
      console.log(`📋 Button ${index}:`, button.textContent, '|', button.getAttribute('aria-label'));
    });
  });

  it('should check for narrative messages', () => {
    console.log('🔍 Testing narrative message rendering...');
    
    render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Look for narrative content
    const meetMaya = screen.queryByText(/Meet Maya Rodriguez/i);
    console.log('📋 First narrative message:', meetMaya);
    
    // Look for any text content with "Maya"
    const mayaContent = screen.queryAllByText(/Maya/i);
    console.log('📋 All Maya content:', mayaContent.map(el => el.textContent));
    
    // Look for interactive elements
    const beginButton = screen.queryByText(/Begin Maya's Complete Journey/i);
    console.log('📋 Begin journey button:', beginButton);
  });

  it('should check component structure and layout', () => {
    console.log('🔍 Testing component structure...');
    
    const { container } = render(
      <TestWrapper>
        <LyraNarratedMayaSideBySideComplete />
      </TestWrapper>
    );

    // Check for main layout elements
    const gridElements = container.querySelectorAll('[class*="grid"]');
    console.log('📋 Grid elements:', gridElements.length);
    
    const flexElements = container.querySelectorAll('[class*="flex"]');
    console.log('📋 Flex elements:', flexElements.length);
    
    // Check for specific layout classes
    const screenElements = container.querySelectorAll('[class*="h-screen"]');
    console.log('📋 Full screen elements:', screenElements.length);
    
    // Check for columns
    const columnElements = container.querySelectorAll('[class*="col"]');
    console.log('📋 Column elements:', columnElements.length);
  });

  it('should check for errors in console', () => {
    console.log('🔍 Testing for rendering errors...');
    
    // Capture console errors
    const originalError = console.error;
    const errors: string[] = [];
    console.error = (...args) => {
      errors.push(args.join(' '));
      originalError(...args);
    };

    try {
      render(
        <TestWrapper>
          <LyraNarratedMayaSideBySideComplete />
        </TestWrapper>
      );
      
      console.log('📋 Console errors during render:', errors.length);
      errors.forEach((error, index) => {
        console.log(`📋 Error ${index}:`, error);
      });
      
    } finally {
      console.error = originalError;
    }
  });
});