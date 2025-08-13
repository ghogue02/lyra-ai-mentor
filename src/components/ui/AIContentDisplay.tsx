import React from 'react';

interface AIContentDisplayProps {
  content: string;
  className?: string;
}

export const AIContentDisplay: React.FC<AIContentDisplayProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const formatContent = (text: string) => {
    // Remove markdown formatting
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1');

    return cleanText
      .split('\n\n')
      .map((paragraph, index) => {
        // Handle bullet points
        if (paragraph.includes('* ')) {
          const bulletItems = paragraph.split('\n').filter(line => line.trim());
          return (
            <div key={index} className="space-y-2">
              {bulletItems.map((item, itemIndex) => {
                if (item.trim().startsWith('* ')) {
                  return (
                    <div key={itemIndex} className="flex items-start gap-3 ml-4">
                      <span className="text-primary mt-1">•</span>
                      <span className="flex-1">{item.trim().substring(2)}</span>
                    </div>
                  );
                } else {
                  return <div key={itemIndex} className="font-medium">{item.trim()}</div>;
                }
              })}
            </div>
          );
        }
        // Handle regular paragraphs
        return paragraph.trim() ? (
          <div key={index} className="whitespace-pre-line">{paragraph.trim()}</div>
        ) : null;
      })
      .filter(Boolean);
  };

  return (
    <div className={`leading-relaxed text-sm font-normal space-y-4 ${className}`}>
      {formatContent(content)}
    </div>
  );
};