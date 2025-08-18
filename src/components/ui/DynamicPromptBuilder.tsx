import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Code2, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Copy, 
  Check,
  Wand2,
  Brain
} from 'lucide-react';

export interface PromptSegment {
  id: string;
  label: string;
  value: string;
  type: 'context' | 'instruction' | 'constraint' | 'format' | 'data';
  color: string;
  required: boolean;
}

export interface DynamicPromptBuilderProps {
  segments: PromptSegment[];
  onPromptUpdate?: (finalPrompt: string) => void;
  characterName?: string;
  characterTheme?: 'carmen' | 'sofia' | 'alex' | 'maya' | 'default';
  className?: string;
  showCopyButton?: boolean;
  autoUpdate?: boolean;
}

const themeColors = {
  carmen: {
    primary: 'bg-orange-600',
    secondary: 'bg-amber-500',
    accent: 'border-orange-200',
    gradient: 'from-orange-50 to-amber-50'
  },
  sofia: {
    primary: 'bg-rose-600',
    secondary: 'bg-purple-500', 
    accent: 'border-rose-200',
    gradient: 'from-rose-50 to-purple-50'
  },
  alex: {
    primary: 'bg-blue-600',
    secondary: 'bg-indigo-500',
    accent: 'border-blue-200',
    gradient: 'from-blue-50 to-indigo-50'
  },
  maya: {
    primary: 'bg-green-600',
    secondary: 'bg-teal-500',
    accent: 'border-green-200',
    gradient: 'from-green-50 to-teal-50'
  },
  default: {
    primary: 'bg-gray-600',
    secondary: 'bg-gray-500',
    accent: 'border-gray-200',
    gradient: 'from-gray-50 to-gray-100'
  }
};

const segmentTypeIcons = {
  context: '🎯',
  instruction: '📋',
  constraint: '⚖️',
  format: '📐',
  data: '📊'
};

export const DynamicPromptBuilder: React.FC<DynamicPromptBuilderProps> = ({
  segments,
  onPromptUpdate,
  characterName = 'AI Assistant',
  characterTheme = 'default',
  className,
  showCopyButton = true,
  autoUpdate = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [finalPrompt, setFinalPrompt] = useState('');

  const theme = themeColors[characterTheme];

  // Build the final prompt from segments
  useEffect(() => {
    const activeSegments = segments.filter(segment => segment.value.trim() !== '');
    
    let prompt = `You are ${characterName}, an expert in people management and organizational development.\n\n`;
    
    // Add context segments
    const contextSegments = activeSegments.filter(s => s.type === 'context');
    if (contextSegments.length > 0) {
      prompt += `CONTEXT:\n${contextSegments.map(s => `- ${s.value}`).join('\n')}\n\n`;
    }

    // Add instruction segments
    const instructionSegments = activeSegments.filter(s => s.type === 'instruction');
    if (instructionSegments.length > 0) {
      prompt += `INSTRUCTIONS:\n${instructionSegments.map(s => `- ${s.value}`).join('\n')}\n\n`;
    }

    // Add constraint segments
    const constraintSegments = activeSegments.filter(s => s.type === 'constraint');
    if (constraintSegments.length > 0) {
      prompt += `CONSTRAINTS:\n${constraintSegments.map(s => `- ${s.value}`).join('\n')}\n\n`;
    }

    // Add data segments
    const dataSegments = activeSegments.filter(s => s.type === 'data');
    if (dataSegments.length > 0) {
      prompt += `PROVIDED DATA:\n${dataSegments.map(s => `- ${s.value}`).join('\n')}\n\n`;
    }

    // Add format segments
    const formatSegments = activeSegments.filter(s => s.type === 'format');
    if (formatSegments.length > 0) {
      prompt += `OUTPUT FORMAT:\n${formatSegments.map(s => `- ${s.value}`).join('\n')}\n\n`;
    }

    prompt += `Please provide a comprehensive, actionable response that reflects ${characterName}'s expertise and approach.`;

    setFinalPrompt(prompt);
    
    if (autoUpdate && onPromptUpdate) {
      onPromptUpdate(prompt);
    }
  }, [segments, characterName, autoUpdate, onPromptUpdate]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(finalPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const activeSegments = segments.filter(segment => segment.value.trim() !== '');
  const totalSegments = segments.length;
  const completionPercentage = (activeSegments.length / totalSegments) * 100;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header with Toggle */}
      <Card className={cn('border-2', theme.accent)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="w-5 h-5 text-orange-600" />
              Dynamic AI Prompt Builder
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {activeSegments.length}/{totalSegments} segments
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs"
              >
                {isExpanded ? (
                  <>
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3 mr-1" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={cn('h-2 rounded-full', theme.primary)}
              initial={{ width: '0%' }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          
          <p className="text-sm text-gray-600 mt-2">
            Watch how your selections build the AI prompt in real-time
          </p>
        </CardHeader>

        <AnimatePresence>
          {isExpanded && (
            <CardContent className="pt-0">
              {/* Segment Visualization */}
              <div className="space-y-3 mb-6">
                <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  Prompt Components
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {segments.map((segment, index) => (
                    <motion.div
                      key={segment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'p-3 rounded-lg border-l-4 bg-white shadow-sm',
                        segment.value.trim() ? segment.color + ' border-opacity-100' : 'border-gray-200 border-opacity-50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{segmentTypeIcons[segment.type]}</span>
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              'text-xs',
                              segment.value.trim() ? 'opacity-100' : 'opacity-50'
                            )}
                          >
                            {segment.type}
                          </Badge>
                          {segment.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                        </div>
                        
                        <motion.div
                          className={cn(
                            'w-3 h-3 rounded-full',
                            segment.value.trim() ? 'bg-green-500' : 'bg-gray-300'
                          )}
                          initial={{ scale: 0 }}
                          animate={{ scale: segment.value.trim() ? 1.2 : 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                      
                      <h5 className="font-medium text-sm text-gray-900 mb-1">
                        {segment.label}
                      </h5>
                      
                      {segment.value.trim() ? (
                        <p className="text-xs text-gray-600 italic line-clamp-2">
                          "{segment.value}"
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">
                          Not yet configured
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Final Prompt Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Generated AI Prompt
                  </h4>
                  
                  {showCopyButton && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!finalPrompt.trim()}
                      className="text-xs"
                    >
                      {copiedPrompt ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" />
                          Copy Prompt
                        </>
                      )}
                    </Button>
                  )}
                </div>
                
                <div className={cn('bg-gradient-to-br', theme.gradient, 'p-4 rounded-lg border')}>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono max-h-64 overflow-y-auto">
                    {finalPrompt || 'Configure the segments above to see your AI prompt...'}
                  </pre>
                </div>
                
                {activeSegments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>
                      Prompt automatically updates as you make selections above
                    </span>
                  </motion.div>
                )}
              </div>
            </CardContent>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default DynamicPromptBuilder;