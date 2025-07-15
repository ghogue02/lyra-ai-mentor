import React, { useEffect, useRef, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Heart, AlertCircle, Sparkles, CheckCircle } from 'lucide-react';

interface StorySegment {
  type: 'hook' | 'tension' | 'emotion' | 'dialogue' | 'revelation' | 'transition' | 'impact' | 'features';
  content: string;
}

interface StoryContentRendererProps {
  title: string;
  rawContent: string;
  onComplete?: () => void;
}

export const StoryContentRenderer: React.FC<StoryContentRendererProps> = ({ 
  title, 
  rawContent,
  onComplete 
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const hasTriggeredCompletion = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isCompleted, setIsCompleted] = React.useState(false);
  
  // Stable completion callback to prevent effect re-runs
  const stableOnComplete = useCallback(() => {
    if (!hasTriggeredCompletion.current && !isCompleted && onComplete) {
      hasTriggeredCompletion.current = true;
      setIsCompleted(true);
      onComplete();
    }
  }, [onComplete, isCompleted]);
  
  // Auto-complete when user has viewed enough of the content
  useEffect(() => {
    if (!onComplete || isCompleted || hasTriggeredCompletion.current || observerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Mark as read when 40% is visible for story content
        if (entry.intersectionRatio > 0.4) {
          setTimeout(() => {
            stableOnComplete();
          }, 1500); // 1.5 seconds for story content
        }
      },
      { 
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: '0px 0px -10% 0px'
      }
    );

    if (contentRef.current) {
      observerRef.current.observe(contentRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [stableOnComplete, isCompleted]);
  
  // Manual completion on click
  const handleClick = useCallback(() => {
    if (!isCompleted && !hasTriggeredCompletion.current) {
      stableOnComplete();
    }
  }, [isCompleted, stableOnComplete]);
  
  // Parse Maya's story into structured segments
  const parseStoryContent = (content: string): StorySegment[] => {
    const segments: StorySegment[] = [];
    
    // Strip HTML tags for analysis but preserve for display
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };
    
    // Transform asterisk formatting into proper HTML
    const transformFormatting = (text: string): string => {
      // Transform **bold** markers into strong tags
      let transformed = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
      
      // Transform lists with asterisks into visual elements
      if (text.includes('**') && text.includes(':')) {
        // This looks like a feature list, transform it
        const lines = transformed.split('\n');
        const formattedLines = lines.map(line => {
          if (line.includes('<strong>') && line.includes(':')) {
            // Extract the title and description
            const match = line.match(/<strong[^>]*>([^<]+)<\/strong>:\s*(.+)/);
            if (match) {
              return `<div class="mb-4">
                <div class="font-semibold text-gray-900 mb-1">${match[1]}</div>
                <div class="text-gray-700 pl-4">${match[2]}</div>
              </div>`;
            }
          }
          return line;
        });
        transformed = formattedLines.join('\n');
      }
      
      return transformed;
    };
    
    // Split by double newlines or paragraph tags
    const paragraphs = content
      .replace(/<\/p>\s*<p>/gi, '\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/?p>/gi, '')
      .split(/\n\n+/)
      .filter(p => stripHtml(p).trim().length > 0);
    
    paragraphs.forEach((para, index) => {
      const plainText = stripHtml(para);
      const formattedPara = transformFormatting(para);
      
      // Check if this is a features/list block
      if (para.includes('**') && para.includes(':') && para.split('\n').length > 2) {
        segments.push({ type: 'features', content: formattedPara });
      }
      // Detect different types of content based on plain text
      else if (index === 0 || plainText.includes('Monday morning') || plainText.includes('7:30 AM')) {
        segments.push({ type: 'hook', content: formattedPara });
      } else if (plainText.includes('anxiety') || plainText.includes('wrestling') || plainText.includes('break her week')) {
        segments.push({ type: 'tension', content: formattedPara });
      } else if (plainText.includes('"') || plainText.includes('"') || plainText.includes('"')) {
        segments.push({ type: 'dialogue', content: formattedPara });
      } else if (plainText.includes('doesn\'t know yet') || plainText.includes('about to change')) {
        segments.push({ type: 'revelation', content: formattedPara });
      } else if (plainText.includes('imagined') || plainText.includes('thought she\'d') || plainText.includes('feeling')) {
        segments.push({ type: 'emotion', content: formattedPara });
      } else {
        segments.push({ type: 'transition', content: formattedPara });
      }
    });
    
    return segments;
  };

  const segments = parseStoryContent(rawContent);

  const renderSegment = (segment: StorySegment, index: number) => {
    switch (segment.type) {
      case 'hook':
        return (
          <div key={index} className="story-hook mb-10">
            {/* Opening with visual emphasis - no label */}
            <div className="relative">
              <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-transparent rounded-full" />
              <div 
                className="text-lg leading-loose text-gray-800 font-light pl-6"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            </div>
            
            {/* Subtle visual breathing room */}
            <div className="mt-8 flex justify-center">
              <div className="flex gap-1">
                <div className="w-8 h-0.5 bg-gray-200 rounded-full" />
                <div className="w-4 h-0.5 bg-gray-200 rounded-full" />
                <div className="w-2 h-0.5 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        );

      case 'tension':
        return (
          <div key={index} className="story-tension mb-8">
            {/* Tension through visual density and color */}
            <div className="relative pl-6">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-400 to-orange-200" />
              <div 
                className="text-base leading-snug text-gray-700"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            </div>
          </div>
        );

      case 'emotion':
        return (
          <div key={index} className="story-emotion mb-8">
            {/* Soft emotional content without labels */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-rose-100/20 to-transparent rounded-lg blur-xl" />
              <Card className="relative border-0 bg-white/80 shadow-sm">
                <CardContent className="p-6">
                  <div 
                    className="text-base leading-relaxed text-gray-700 italic"
                    dangerouslySetInnerHTML={{ __html: segment.content }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'dialogue':
        return (
          <div key={index} className="story-dialogue mb-10">
            {/* Dialogue with dramatic spacing and typography */}
            <div className="mx-auto max-w-2xl">
              <div className="relative bg-gray-50/50 rounded-lg p-8">
                <span className="absolute -left-2 -top-2 text-6xl text-gray-200 font-serif leading-none">"</span>
                <div 
                  className="text-lg leading-relaxed text-gray-800 font-light italic"
                  dangerouslySetInnerHTML={{ __html: segment.content }}
                />
              </div>
            </div>
          </div>
        );

      case 'revelation':
        return (
          <div key={index} className="story-revelation mb-12">
            {/* Revelation through emphasis and space */}
            <div className="relative mx-auto max-w-2xl">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-100/30 via-purple-50/20 to-transparent rounded-2xl blur-2xl" />
              <div 
                className="relative text-lg leading-relaxed text-gray-900 font-medium px-8 py-6"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            </div>
            
            {/* Visual pause after revelation */}
            <div className="mt-10 flex justify-center">
              <div className="w-32 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
            </div>
          </div>
        );

      case 'features':
        return (
          <div key={index} className="story-features mb-10">
            {/* Feature list with visual cards */}
            <div className="space-y-3 max-w-2xl mx-auto">
              <style dangerouslySetInnerHTML={{ __html: `
                .story-features .feature-content > div {
                  background: linear-gradient(to right, #f9fafb, transparent);
                  border-left: 3px solid #e5e7eb;
                  padding: 1rem 1.5rem;
                  margin-bottom: 0.75rem;
                  border-radius: 0.375rem;
                  transition: all 0.2s ease;
                }
                .story-features .feature-content > div:hover {
                  border-left-color: #9333ea;
                  background: linear-gradient(to right, #faf5ff, transparent);
                  transform: translateX(4px);
                }
                .story-features .feature-content .font-semibold {
                  color: #111827;
                  margin-bottom: 0.25rem;
                }
              `}} />
              <div 
                className="feature-content"
                dangerouslySetInnerHTML={{ __html: segment.content }}
              />
            </div>
          </div>
        );
      
      default:
        return (
          <div key={index} className="story-transition mb-6">
            <div 
              className="text-base leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          </div>
        );
    }
  };

  return (
    <div 
      ref={contentRef}
      onClick={handleClick}
      className={`story-content max-w-3xl mx-auto p-6 rounded-lg transition-all duration-300 cursor-pointer ${
        isCompleted ? 'bg-green-50/30 border border-green-200' : 'bg-white hover:bg-gray-50/50'
      }`}
    >
      {/* Story Title */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Read</span>
            </div>
          )}
        </div>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
      </div>

      {/* Rendered Story Segments */}
      <div className="space-y-2">
        {segments.map((segment, index) => renderSegment(segment, index))}
      </div>
      
      {!isCompleted && (
        <div className="mt-8 text-center text-xs text-gray-500">
          Click anywhere to mark as read
        </div>
      )}
    </div>
  );
};