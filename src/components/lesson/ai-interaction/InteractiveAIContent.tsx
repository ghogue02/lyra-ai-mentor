import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { 
  Edit3, 
  Save, 
  X, 
  RefreshCw, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Copy,
  Download,
  Undo,
  Redo,
  MessageSquare,
  Heart,
  Lightbulb,
  Target
} from 'lucide-react';

export interface ContentRefinementSuggestion {
  id: string;
  type: 'tone' | 'clarity' | 'inclusivity' | 'empathy' | 'structure' | 'impact';
  title: string;
  description: string;
  originalText: string;
  suggestedText: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
}

export interface ContentVersion {
  id: string;
  content: string;
  timestamp: Date;
  version: number;
  changes?: string;
}

export interface InteractiveAIContentProps {
  initialContent: string;
  title: string;
  contentType: 'job-description' | 'interview-questions' | 'performance-review' | 'engagement-strategy' | 'email' | 'policy' | 'custom';
  characterName?: string;
  onContentChange?: (content: string) => void;
  onSave?: (content: string, metadata?: any) => void;
  className?: string;
  allowRefinement?: boolean;
  allowVersioning?: boolean;
  allowExport?: boolean;
  readOnly?: boolean;
  showCharacterGuidance?: boolean;
  maxVersions?: number;
  'aria-label'?: string;
}

const contentTypeInfo = {
  'job-description': {
    icon: <Target className="w-4 h-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    refinementTypes: ['tone', 'inclusivity', 'clarity', 'structure']
  },
  'interview-questions': {
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    refinementTypes: ['empathy', 'clarity', 'inclusivity', 'structure']
  },
  'performance-review': {
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    refinementTypes: ['empathy', 'tone', 'clarity', 'impact']
  },
  'engagement-strategy': {
    icon: <Heart className="w-4 h-4" />,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    refinementTypes: ['impact', 'empathy', 'clarity', 'structure']
  },
  'email': {
    icon: <MessageSquare className="w-4 h-4" />,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    refinementTypes: ['tone', 'clarity', 'empathy']
  },
  'policy': {
    icon: <Lightbulb className="w-4 h-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    refinementTypes: ['clarity', 'inclusivity', 'structure', 'tone']
  },
  'custom': {
    icon: <Sparkles className="w-4 h-4" />,
    color: 'text-gray-600',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    refinementTypes: ['tone', 'clarity', 'structure', 'impact']
  }
};

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-blue-100 text-blue-800 border-blue-200'
};

export const InteractiveAIContent: React.FC<InteractiveAIContentProps> = ({
  initialContent,
  title,
  contentType,
  characterName = 'Carmen',
  onContentChange,
  onSave,
  className,
  allowRefinement = true,
  allowVersioning = true,
  allowExport = true,
  readOnly = false,
  showCharacterGuidance = true,
  maxVersions = 10,
  'aria-label': ariaLabel = 'Interactive AI content editor'
}) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const [versions, setVersions] = useState<ContentVersion[]>([
    { id: '1', content: initialContent, timestamp: new Date(), version: 1 }
  ]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<ContentRefinementSuggestion[]>([]);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const typeInfo = contentTypeInfo[contentType];
  const currentVersion = versions[currentVersionIndex];

  // Generate refinement suggestions (mock implementation)
  const generateSuggestions = useCallback(async (text: string): Promise<ContentRefinementSuggestion[]> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
    
    const mockSuggestions: ContentRefinementSuggestion[] = [
      {
        id: '1',
        type: 'inclusivity',
        title: 'More Inclusive Language',
        description: 'Replace gendered terms with inclusive alternatives',
        originalText: 'He/she must have...',
        suggestedText: 'They must have...',
        reasoning: 'Using gender-neutral pronouns creates a more inclusive environment for all candidates.',
        priority: 'high'
      },
      {
        id: '2',
        type: 'empathy',
        title: 'Add Empathetic Tone',
        description: 'Soften demanding language with supportive phrasing',
        originalText: 'Must demonstrate...',
        suggestedText: 'We would love to see...',
        reasoning: 'Supportive language encourages candidates while maintaining clear expectations.',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'clarity',
        title: 'Improve Clarity',
        description: 'Break down complex requirements into clearer points',
        originalText: 'Extensive experience with...',
        suggestedText: '3+ years of experience with...',
        reasoning: 'Specific timeframes help candidates better understand requirements.',
        priority: 'medium'
      }
    ];

    return mockSuggestions.filter(suggestion => 
      typeInfo.refinementTypes.includes(suggestion.type)
    );
  }, [typeInfo.refinementTypes]);

  // Handle content changes
  const handleContentChange = useCallback((newContent: string) => {
    setContent(newContent);
    setHasUnsavedChanges(true);
    onContentChange?.(newContent);
  }, [onContentChange]);

  // Save current content as new version
  const saveVersion = useCallback((changes?: string) => {
    const newVersion: ContentVersion = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      version: versions.length + 1,
      changes
    };

    const newVersions = [...versions, newVersion];
    if (newVersions.length > maxVersions) {
      newVersions.shift(); // Remove oldest version
    }

    setVersions(newVersions);
    setCurrentVersionIndex(newVersions.length - 1);
    setHasUnsavedChanges(false);
    
    onSave?.(content, { version: newVersion.version, changes });
    
    toast({
      title: "Version Saved",
      description: `${characterName} has saved version ${newVersion.version} of your content.`,
    });
  }, [content, versions, maxVersions, onSave, characterName, toast]);

  // Apply suggestion
  const applySuggestion = useCallback((suggestion: ContentRefinementSuggestion) => {
    const newContent = content.replace(suggestion.originalText, suggestion.suggestedText);
    handleContentChange(newContent);
    
    toast({
      title: "Suggestion Applied",
      description: `${characterName} has improved the ${suggestion.type} of your content.`,
    });
  }, [content, handleContentChange, characterName, toast]);

  // Generate suggestions for current content
  const handleGenerateSuggestions = useCallback(async () => {
    setIsGeneratingSuggestions(true);
    try {
      const newSuggestions = await generateSuggestions(content);
      setSuggestions(newSuggestions);
      
      if (newSuggestions.length === 0) {
        toast({
          title: "Great Work!",
          description: `${characterName} couldn't find any improvements needed. Your content looks excellent!`,
        });
      } else {
        toast({
          title: "Refinement Suggestions Ready",
          description: `${characterName} has ${newSuggestions.length} suggestions to make your content even better.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error Generating Suggestions",
        description: "Unable to generate refinement suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  }, [content, generateSuggestions, characterName, toast]);

  // Copy content to clipboard
  const copyContent = useCallback(() => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${title} copied to clipboard.`,
    });
  }, [content, title, toast]);

  // Download content as file
  const downloadContent = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${title} has been saved to your device.`,
    });
  }, [content, title, toast]);

  // Navigate versions
  const goToVersion = useCallback((index: number) => {
    if (hasUnsavedChanges) {
      const confirmSwitch = window.confirm('You have unsaved changes. Switch versions anyway?');
      if (!confirmSwitch) return;
    }
    
    setCurrentVersionIndex(index);
    setContent(versions[index].content);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges, versions]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isEditing]);

  return (
    <div className={cn('space-y-4', className)} aria-label={ariaLabel} role="region">
      {/* Character Guidance */}
      {showCharacterGuidance && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-orange-800">
                  {characterName}'s Content Assistant
                </h4>
                <p className="text-sm text-orange-700">
                  I'll help you refine this content to be more inclusive, empathetic, and effective.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Editor */}
      <Card className={cn('border-2', typeInfo.border)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              {typeInfo.icon}
              <span className={typeInfo.color}>{title}</span>
            </CardTitle>

            <div className="flex items-center space-x-2">
              {/* Version Navigation */}
              {allowVersioning && versions.length > 1 && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => goToVersion(Math.max(0, currentVersionIndex - 1))}
                    disabled={currentVersionIndex === 0}
                    className="h-8 px-2"
                  >
                    <Undo className="w-3 h-3" />
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    v{currentVersion.version}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => goToVersion(Math.min(versions.length - 1, currentVersionIndex + 1))}
                    disabled={currentVersionIndex === versions.length - 1}
                    className="h-8 px-2"
                  >
                    <Redo className="w-3 h-3" />
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              {!readOnly && (
                <div className="flex space-x-1">
                  {!isEditing ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="h-8 px-3"
                    >
                      <Edit3 className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setContent(currentVersion.content);
                          setHasUnsavedChanges(false);
                        }}
                        className="h-8 px-2"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          setIsEditing(false);
                          if (hasUnsavedChanges) {
                            saveVersion('Manual edit');
                          }
                        }}
                        className="h-8 px-3 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                    </>
                  )}
                </div>
              )}

              {/* Export Buttons */}
              {allowExport && (
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyContent}
                    className="h-8 px-2"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadContent}
                    className="h-8 px-2"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {hasUnsavedChanges && (
            <Badge variant="outline" className="w-fit text-amber-600 border-amber-600">
              Unsaved Changes
            </Badge>
          )}
        </CardHeader>

        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[300px] resize-none overflow-hidden"
                placeholder={`Start typing your ${contentType.replace('-', ' ')}...`}
              />
              
              {/* Refinement Tools */}
              {allowRefinement && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleGenerateSuggestions}
                    disabled={isGeneratingSuggestions}
                    className="flex items-center space-x-2"
                  >
                    {isGeneratingSuggestions ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>{isGeneratingSuggestions ? 'Analyzing...' : 'Get Suggestions'}</span>
                  </Button>
                  
                  <span className="text-xs text-gray-500">
                    {content.length} characters
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className={cn('p-4 rounded-lg border-2 border-dashed', typeInfo.bg, typeInfo.border)}>
              <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {content}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Refinement Suggestions */}
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <h4 className="font-semibold text-orange-800 flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>{characterName}'s Refinement Suggestions</span>
            </h4>

            {suggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge className={priorityColors[suggestion.priority]}>
                          {suggestion.priority}
                        </Badge>
                        <span className="font-medium text-gray-900">
                          {suggestion.title}
                        </span>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                        className="bg-orange-600 hover:bg-orange-700 text-white h-8"
                      >
                        Apply
                      </Button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {suggestion.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-red-600">Current:</span>
                        <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded">
                          "{suggestion.originalText}"
                        </div>
                      </div>
                      
                      <div>
                        <span className="font-medium text-green-600">Suggested:</span>
                        <div className="mt-1 p-2 bg-green-50 border border-green-200 rounded">
                          "{suggestion.suggestedText}"
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                      <span className="text-xs font-medium text-blue-800">
                        {characterName}'s Insight:
                      </span>
                      <p className="text-xs text-blue-700 mt-1">
                        {suggestion.reasoning}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Version History */}
      {allowVersioning && versions.length > 1 && (
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Version History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {versions.slice().reverse().map((version, index) => {
                const reverseIndex = versions.length - 1 - index;
                const isActive = reverseIndex === currentVersionIndex;
                
                return (
                  <div
                    key={version.id}
                    className={cn(
                      'flex items-center justify-between p-2 rounded cursor-pointer transition-colors',
                      isActive ? 'bg-orange-50 border border-orange-200' : 'hover:bg-gray-50'
                    )}
                    onClick={() => goToVersion(reverseIndex)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={isActive ? "default" : "outline"} className="text-xs">
                          v{version.version}
                        </Badge>
                        {version.changes && (
                          <span className="text-xs text-gray-600">{version.changes}</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {version.timestamp.toLocaleString()}
                      </span>
                    </div>
                    
                    {isActive && (
                      <CheckCircle className="w-4 h-4 text-orange-600" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InteractiveAIContent;