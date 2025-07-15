import React, { useState } from 'react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Info, HelpCircle, X, Lightbulb, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HelpContent {
  title: string;
  quickHelp: string;
  detailedHelp?: {
    whatIs: string;
    whyItMatters: string;
    howToUse: string[];
    examples?: {
      input?: string;
      output?: string;
      description?: string;
    }[];
    commonMistakes?: string[];
    proTips?: string[];
  };
  contextualTip?: string;
  learnMoreUrl?: string;
}

interface HelpTooltipProps {
  content: HelpContent;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'inline' | 'button';
  showIcon?: boolean;
  onHelpViewed?: (helpType: 'hover' | 'click') => void;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  children,
  side = 'top',
  align = 'center',
  className,
  iconSize = 'sm',
  variant = 'default',
  showIcon = true,
  onHelpViewed
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [hasViewedQuickHelp, setHasViewedQuickHelp] = useState(false);

  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleTooltipOpen = (open: boolean) => {
    if (open && !hasViewedQuickHelp) {
      setHasViewedQuickHelp(true);
      onHelpViewed?.('hover');
    }
  };

  const handlePopoverOpen = (open: boolean) => {
    setIsPopoverOpen(open);
    if (open) {
      onHelpViewed?.('click');
    }
  };

  const HelpIcon = () => (
    <Info 
      className={cn(
        iconSizeMap[iconSize],
        'text-gray-400 hover:text-gray-600 transition-colors cursor-help'
      )} 
    />
  );

  // Inline variant - just the icon with tooltip
  if (variant === 'inline') {
    return (
      <TooltipProvider>
        <Tooltip onOpenChange={handleTooltipOpen}>
          <TooltipTrigger asChild>
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center',
                'hover:bg-gray-100 rounded-full p-0.5',
                'transition-colors',
                className
              )}
              aria-label="Help information"
            >
              <HelpIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side={side} 
            align={align}
            className="max-w-xs p-3"
          >
            <p className="text-sm">{content.quickHelp}</p>
            {content.detailedHelp && (
              <p className="text-xs text-gray-500 mt-2 cursor-pointer hover:text-gray-700">
                Click for more details →
              </p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Button variant - clickable info button that opens popover
  if (variant === 'button') {
    return (
      <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'gap-2 text-gray-600 hover:text-gray-900',
              className
            )}
          >
            <HelpCircle className={iconSizeMap[iconSize]} />
            Learn More
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          side={side} 
          align={align}
          className="w-96 max-h-[80vh] overflow-y-auto"
        >
          <DetailedHelpContent 
            content={content} 
            onClose={() => setIsPopoverOpen(false)} 
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Default variant - wraps children with help icon
  return (
    <TooltipProvider>
      <div className={cn('inline-flex items-center gap-2', className)}>
        {children}
        {showIcon && (
          <Popover open={isPopoverOpen} onOpenChange={handlePopoverOpen}>
            <Tooltip onOpenChange={handleTooltipOpen}>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center hover:bg-gray-100 rounded-full p-1 transition-colors"
                    aria-label="Help information"
                  >
                    <HelpIcon />
                  </button>
                </TooltipTrigger>
              </PopoverTrigger>
              <TooltipContent 
                side={side} 
                align={align}
                className="max-w-xs p-3"
              >
                <p className="text-sm">{content.quickHelp}</p>
                {content.detailedHelp && (
                  <p className="text-xs text-gray-500 mt-2">
                    Click (i) for detailed help
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            <PopoverContent 
              side={side} 
              align={align}
              className="w-96 max-h-[80vh] overflow-y-auto"
            >
              <DetailedHelpContent 
                content={content} 
                onClose={() => setIsPopoverOpen(false)} 
              />
            </PopoverContent>
          </Popover>
        )}
      </div>
    </TooltipProvider>
  );
};

// Detailed help content component
const DetailedHelpContent: React.FC<{
  content: HelpContent;
  onClose: () => void;
}> = ({ content, onClose }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-lg">{content.title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {content.contextualTip && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">{content.contextualTip}</p>
          </div>
        </div>
      )}

      {content.detailedHelp && (
        <>
          <section>
            <h4 className="font-medium text-sm text-gray-900 mb-2">What is this?</h4>
            <p className="text-sm text-gray-600">{content.detailedHelp.whatIs}</p>
          </section>

          <section>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Why it matters</h4>
            <p className="text-sm text-gray-600">{content.detailedHelp.whyItMatters}</p>
          </section>

          <section>
            <h4 className="font-medium text-sm text-gray-900 mb-2">How to use</h4>
            <ol className="space-y-1">
              {content.detailedHelp.howToUse.map((step, index) => (
                <li key={index} className="text-sm text-gray-600 flex gap-2">
                  <span className="font-medium text-gray-900">{index + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          {content.detailedHelp.examples && content.detailedHelp.examples.length > 0 && (
            <section>
              <h4 className="font-medium text-sm text-gray-900 mb-2">Examples</h4>
              <div className="space-y-3">
                {content.detailedHelp.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                    {example.input && (
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Input: </span>
                        <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">
                          {example.input}
                        </code>
                      </div>
                    )}
                    {example.output && (
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Output: </span>
                        <code className="bg-gray-200 px-1 py-0.5 rounded text-xs">
                          {example.output}
                        </code>
                      </div>
                    )}
                    {example.description && (
                      <p className="text-gray-600">{example.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {content.detailedHelp.commonMistakes && content.detailedHelp.commonMistakes.length > 0 && (
            <section>
              <h4 className="font-medium text-sm text-gray-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Common mistakes to avoid
              </h4>
              <ul className="space-y-1">
                {content.detailedHelp.commonMistakes.map((mistake, index) => (
                  <li key={index} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-amber-600">•</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {content.detailedHelp.proTips && content.detailedHelp.proTips.length > 0 && (
            <section className="bg-purple-50 rounded-lg p-3">
              <h4 className="font-medium text-sm text-purple-900 mb-2">Pro Tips</h4>
              <ul className="space-y-1">
                {content.detailedHelp.proTips.map((tip, index) => (
                  <li key={index} className="text-sm text-purple-700 flex gap-2">
                    <span>💡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      {content.learnMoreUrl && (
        <div className="pt-2 border-t">
          <a
            href={content.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            Learn more
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};

// Export helper function to create help content
export const createHelpContent = (
  title: string,
  quickHelp: string,
  detailed?: Partial<HelpContent['detailedHelp']>
): HelpContent => ({
  title,
  quickHelp,
  detailedHelp: detailed ? {
    whatIs: detailed.whatIs || '',
    whyItMatters: detailed.whyItMatters || '',
    howToUse: detailed.howToUse || [],
    examples: detailed.examples,
    commonMistakes: detailed.commonMistakes,
    proTips: detailed.proTips
  } : undefined
});