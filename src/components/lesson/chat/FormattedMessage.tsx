
import React from 'react';

interface FormattedMessageProps {
  content: string;
  isProcessing?: boolean;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isProcessing = false }) => {
  const formatText = (text: string) => {
    // Split text into paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => {
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
                  <span className="text-purple-500 mr-2">•</span>
                  <span>{formatInlineText(cleanLine)}</span>
                </li>
              );
            })}
          </ul>
        );
      }
      
      // Handle AI processing indicators with enhanced animations
      if (paragraph.includes('AI Analysis in Progress') || paragraph.includes('Processing patterns')) {
        return (
          <div key={index} className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 border border-purple-500/30 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-purple-400 font-medium animate-pulse">AI Processing...</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              {paragraph.split('\n').map((line, lineIdx) => (
                <div key={lineIdx} className="flex items-center space-x-2">
                  <span className="text-cyan-400">⚡</span>
                  <span className="animate-fade-in">{line}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }
      
      // Handle data/code blocks (for dummy data display)
      if (paragraph.includes('===') || paragraph.includes('CSV') || paragraph.includes('_EXPORT_')) {
        return (
          <div key={index} className="bg-gray-800 text-green-400 p-3 rounded-lg mb-4 font-mono text-xs overflow-x-auto border border-gray-600 relative">
            <div className="absolute top-2 right-2 flex space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
              <div className="w-1 h-1 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
            <pre className="whitespace-pre-wrap">{paragraph}</pre>
          </div>
        );
      }
      
      // Handle section headers with emojis
      if (/^[🎯🚀⚡📊💡🌟🎉✨🔍💫🎖️🎨]/.test(paragraph)) {
        return (
          <div key={index} className="mb-4">
            <h4 className="font-semibold text-purple-600 text-base leading-relaxed animate-fade-in">
              {formatInlineText(paragraph)}
            </h4>
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 last:mb-0 leading-relaxed animate-fade-in">
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
        return <strong key={index} className="font-semibold text-purple-700">{boldText}</strong>;
      }
      
      // Handle special highlighting for metrics and numbers
      if (/\d+%|\$[\d,]+|[\d,]+\s*(hours|participants|donors)/.test(part)) {
        return <span key={index} className="font-medium text-cyan-600">{part}</span>;
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
