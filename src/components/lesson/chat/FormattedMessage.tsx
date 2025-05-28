
import React from 'react';
import { AnimatedDataDisplay } from './AnimatedDataDisplay';
import { AnimatedAnalysisDisplay } from './AnimatedAnalysisDisplay';
import { AnimatedInsightsDisplay } from './AnimatedInsightsDisplay';
import { AnimatedRecommendationsDisplay } from './AnimatedRecommendationsDisplay';

interface FormattedMessageProps {
  content: string;
  isProcessing?: boolean;
  onSendMessage?: (message: string) => void;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ 
  content, 
  isProcessing = false, 
  onSendMessage 
}) => {
  const formatText = (text: string) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
      // Handle data/code blocks with animated display
      if (paragraph.includes('===') || paragraph.includes('CSV') || paragraph.includes('_EXPORT_')) {
        return (
          <AnimatedDataDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle AI analysis content
      if (paragraph.includes('AI Analysis in Progress') || 
          (paragraph.includes('Processing') && paragraph.includes('patterns'))) {
        return (
          <AnimatedAnalysisDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle insights content
      if ((paragraph.includes('PATTERNS DISCOVERED') || paragraph.includes('Hidden Revenue')) &&
          (paragraph.includes('Target quarterly') || paragraph.includes('Revenue Optimization'))) {
        return (
          <AnimatedInsightsDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle recommendations content
      if ((paragraph.includes('Actionable Recommendations') || paragraph.includes('This Week')) &&
          (paragraph.includes('Call Patricia') || paragraph.includes('Send personalized'))) {
        return (
          <AnimatedRecommendationsDisplay
            key={index}
            content={paragraph}
            autoStart={true}
          />
        );
      }
      
      // Handle numbered lists
      if (paragraph.includes('\n') && /^\d+\./.test(paragraph.trim())) {
        const lines = paragraph.split('\n').filter(line => line.trim());
        return (
          <ol key={index} className="list-decimal list-inside space-y-2 mb-4">
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^\d+\.\s*/, '').trim();
              return (
                <li key={lineIndex} className="leading-relaxed">
                  {formatInlineText(cleanLine)}
                </li>
              );
            })}
          </ol>
        );
      }
      
      // Handle bullet lists with emoji or special characters
      if (paragraph.includes('\n') && /^[•·▪▫‣⁃]\s/.test(paragraph.trim())) {
        const lines = paragraph.split('\n').filter(line => line.trim());
        return (
          <ul key={index} className="space-y-2 mb-4">
            {lines.map((line, lineIndex) => {
              const cleanLine = line.replace(/^[•·▪▫‣⁃]\s*/, '').trim();
              return (
                <li key={lineIndex} className="leading-relaxed flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{formatInlineText(cleanLine)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Handle section headers
      if (/^\*\*.*\*\*$/.test(paragraph.trim())) {
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-gray-800 text-base leading-relaxed">
              {formatInlineText(paragraph)}
            </h4>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 last:mb-0 leading-relaxed text-gray-700">
          {formatInlineText(paragraph)}
        </p>
      );
    });
  };

  const formatInlineText = (text: string) => {
    // Convert **text** to bold
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold text-gray-900">{boldText}</strong>;
      }
      
      // Handle special highlighting for metrics and numbers
      if (/\d+%|\$[\d,]+|[\d,]+\s*(hours|participants|donors)/.test(part)) {
        return <span key={index} className="font-medium text-blue-600">{part}</span>;
      }
      
      return part;
    });
  };

  return (
    <div className="text-sm leading-relaxed">
      {formatText(content)}
    </div>
  );
};
