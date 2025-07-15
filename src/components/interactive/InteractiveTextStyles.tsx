import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DialogueBlockProps {
  quote: string;
  author?: string;
  className?: string;
}

export const DialogueBlock: React.FC<DialogueBlockProps> = ({ quote, author, className = "" }) => {
  return (
    <div className={`mx-auto max-w-2xl ${className}`}>
      <div className="relative bg-gray-50/50 rounded-lg p-8">
        <span className="absolute -left-2 -top-2 text-6xl text-gray-200 font-serif leading-none">"</span>
        <p className="text-lg leading-relaxed text-gray-800 font-light italic">
          {quote}
        </p>
        {author && (
          <p className="text-right mt-4 text-sm text-gray-500">— {author}</p>
        )}
      </div>
    </div>
  );
};

interface EmotionBlockProps {
  children: React.ReactNode;
  className?: string;
}

export const EmotionBlock: React.FC<EmotionBlockProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-2 bg-gradient-to-r from-rose-100/20 to-transparent rounded-lg blur-xl" />
      <Card className="relative border-0 bg-white/80 shadow-sm">
        <CardContent className="p-6">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

interface FeatureItemProps {
  title: string;
  description: string;
}

export const FeatureItem: React.FC<FeatureItemProps> = ({ title, description }) => {
  return (
    <div className="group relative pl-6 py-4 transition-all duration-200 hover:translate-x-1">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-purple-200 rounded-full transition-all duration-200 group-hover:w-1.5" />
      <div className="font-semibold text-gray-900 mb-1">{title}</div>
      <div className="text-gray-700">{description}</div>
    </div>
  );
};

interface ScenarioBlockProps {
  title: string;
  children: React.ReactNode;
  variant?: 'blue' | 'purple' | 'green';
}

export const ScenarioBlock: React.FC<ScenarioBlockProps> = ({ 
  title, 
  children, 
  variant = 'blue' 
}) => {
  const variantStyles = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    green: 'bg-green-50 border-green-200'
  };

  return (
    <div className={`${variantStyles[variant]} border rounded-lg p-6 space-y-2`}>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

interface ImpactStatementProps {
  children: React.ReactNode;
  className?: string;
}

export const ImpactStatement: React.FC<ImpactStatementProps> = ({ children, className = "" }) => {
  return (
    <div className={`relative mx-auto max-w-2xl ${className}`}>
      <div className="absolute -inset-4 bg-gradient-to-r from-purple-100/30 via-purple-50/20 to-transparent rounded-2xl blur-2xl" />
      <div className="relative text-lg leading-relaxed text-gray-900 font-medium px-8 py-6">
        {children}
      </div>
    </div>
  );
};

interface StoryContextProps {
  challenge: string;
  solution: string;
  mission: string;
}

export const StoryContext: React.FC<StoryContextProps> = ({ challenge, solution, mission }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <FeatureItem title="Maya's Challenge" description={challenge} />
      <FeatureItem title="The Solution" description={solution} />
      <FeatureItem title="Your Mission" description={mission} />
    </div>
  );
};

// Transform text with asterisk formatting into proper HTML
export const transformTextFormatting = (text: string): string => {
  // Transform **bold** markers
  let transformed = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  
  // Remove remaining asterisks
  transformed = transformed.replace(/\*/g, '');
  
  return transformed;
};