
import React from 'react';

interface FormattedMessageProps {
  content: string;
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content }) => {
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
      
      // Regular paragraph
      return (
        <p key={index} className="mb-4 last:mb-0 leading-relaxed">
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
        return <strong key={index} className="font-semibold">{boldText}</strong>;
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
