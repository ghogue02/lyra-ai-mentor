import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { 
  Heart, 
  Sparkles, 
  Users, 
  Target, 
  Brain, 
  Coffee,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Copy,
  Download,
  Edit3
} from 'lucide-react';

export interface CarmenPersonalityState {
  mode: 'thoughtful' | 'empathetic' | 'analytical' | 'strategic' | 'nurturing';
  message: string;
  emotion: string;
  processingStyle: 'careful' | 'thorough' | 'compassionate' | 'insightful';
}

export interface AIProcessingTask {
  id: string;
  title: string;
  description: string;
  type: 'job-description' | 'interview-questions' | 'candidate-analysis' | 'performance-review' | 'engagement-strategy' | 'retention-plan' | 'custom';
  prompt: string;
  context: string;
  expectedOutputType: 'structured' | 'narrative' | 'list' | 'analysis' | 'strategy';
  estimatedTime: number; // in seconds
  carmenPersonality: CarmenPersonalityState;
}

export interface CarmenAIProcessorProps {
  tasks: AIProcessingTask[];
  onTaskComplete?: (taskId: string, content: string, metadata?: any) => void;
  onAllComplete?: (results: Map<string, string>) => void;
  className?: string;
  showCarmenGuidance?: boolean;
  allowRetry?: boolean;
  allowEdit?: boolean;
  allowExport?: boolean;
  maxRetries?: number;
  'aria-label'?: string;
}

const personalityModes = {
  thoughtful: {
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: <Brain className="w-4 h-4" />,
    animation: { rotate: [0, -2, 2, 0], transition: { duration: 3, repeat: Infinity } }
  },
  empathetic: {
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: <Heart className="w-4 h-4" />,
    animation: { scale: [1, 1.05, 1], transition: { duration: 2.5, repeat: Infinity } }
  },
  analytical: {
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <Target className="w-4 h-4" />,
    animation: { x: [-1, 1, -1], transition: { duration: 2, repeat: Infinity } }
  },
  strategic: {
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: <Lightbulb className="w-4 h-4" />,
    animation: { opacity: [1, 0.8, 1], transition: { duration: 2.2, repeat: Infinity } }
  },
  nurturing: {
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <Users className="w-4 h-4" />,
    animation: { y: [-1, 1, -1], transition: { duration: 2.8, repeat: Infinity } }
  }
};

const processingStyles = {
  careful: "Taking extra care to ensure accuracy and compassion...",
  thorough: "Conducting comprehensive analysis with attention to detail...",
  compassionate: "Approaching this with empathy and human-centered thinking...",
  insightful: "Drawing deep insights from experience and best practices..."
};

export const CarmenAIProcessor: React.FC<CarmenAIProcessorProps> = ({
  tasks,
  onTaskComplete,
  onAllComplete,
  className,
  showCarmenGuidance = true,
  allowRetry = true,
  allowEdit = false,
  allowExport = true,
  maxRetries = 3,
  'aria-label': ariaLabel = 'Carmen AI content processing'
}) => {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<Map<string, string>>(new Map());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());
  const [retryCount, setRetryCount] = useState<Map<string, number>>(new Map());
  const [progress, setProgress] = useState(0);
  const [currentPersonality, setCurrentPersonality] = useState<CarmenPersonalityState | null>(null);

  const { toast } = useToast();

  const currentTask = tasks[currentTaskIndex];
  const allCompleted = completed.size === tasks.length;

  // Mock AI processing function (replace with actual AI service)
  const processWithAI = useCallback(async (task: AIProcessingTask): Promise<string> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, task.estimatedTime * 1000));
    
    // Mock response based on task type
    const mockResponses = {
      'job-description': `**${task.title} - Job Description**\n\nWe are seeking a compassionate and skilled professional who shares our commitment to creating inclusive, supportive workplace environments...\n\n**Key Responsibilities:**\n• Lead with empathy and understanding\n• Foster collaborative team dynamics\n• Drive results through people-first approaches\n\n**What We Offer:**\n• A culture that values every individual\n• Opportunities for growth and development\n• Work that makes a meaningful impact`,
      
      'interview-questions': `**Behavioral Interview Questions**\n\n1. **Empathy & Understanding:** "Tell me about a time when you had to support a colleague through a difficult situation. How did you approach it?"\n\n2. **Growth Mindset:** "Describe a challenge that initially seemed overwhelming. How did you break it down and work through it?"\n\n3. **Team Collaboration:** "Share an example of when you had to work with someone whose work style was very different from yours."\n\n4. **Values Alignment:** "What does creating an inclusive environment mean to you, and how would you contribute to that here?"`,
      
      'candidate-analysis': `**Candidate Evaluation Framework**\n\n**Skills Assessment (40%)**\n• Technical competencies aligned with role requirements\n• Demonstrated problem-solving approach\n• Communication and collaboration abilities\n\n**Cultural Fit (35%)**\n• Values alignment with company culture\n• Growth mindset and adaptability\n• Team collaboration style\n\n**Potential & Development (25%)**\n• Learning agility and curiosity\n• Leadership potential\n• Long-term growth trajectory\n\n*Note: This framework emphasizes potential over perfection, ensuring we identify candidates who will thrive and contribute meaningfully.*`,
      
      'custom': `Based on your specific requirements, Carmen has thoughtfully crafted content that balances efficiency with empathy, ensuring both organizational needs and human dignity are honored throughout the process.`
    };

    return mockResponses[task.type] || mockResponses.custom;
  }, []);

  const processTask = useCallback(async (task: AIProcessingTask) => {
    setProcessing(true);
    setCurrentPersonality(task.carmenPersonality);

    try {
      const result = await processWithAI(task);
      setResults(prev => new Map(prev.set(task.id, result)));
      setCompleted(prev => new Set(prev.add(task.id)));
      setErrors(prev => {
        const newErrors = new Map(prev);
        newErrors.delete(task.id);
        return newErrors;
      });
      
      onTaskComplete?.(task.id, result);
      
      toast({
        title: "Carmen's AI Content Generated!",
        description: task.carmenPersonality.message,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrors(prev => new Map(prev.set(task.id, errorMessage)));
      
      toast({
        title: "Processing Error",
        description: `Carmen encountered an issue: ${errorMessage}`,
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setCurrentPersonality(null);
    }
  }, [processWithAI, onTaskComplete, toast]);

  const retryTask = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const currentRetries = retryCount.get(taskId) || 0;
    if (currentRetries >= maxRetries) {
      toast({
        title: "Maximum Retries Reached",
        description: "Please check the task configuration and try again later.",
        variant: "destructive"
      });
      return;
    }

    setRetryCount(prev => new Map(prev.set(taskId, currentRetries + 1)));
    await processTask(task);
  }, [tasks, retryCount, maxRetries, processTask, toast]);

  const copyContent = useCallback((content: string, title: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description: `${title} copied to clipboard.`,
    });
  }, [toast]);

  const downloadContent = useCallback((content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: `${filename} has been saved to your device.`,
    });
  }, [toast]);

  // Auto-process next task
  useEffect(() => {
    if (currentTask && !processing && !completed.has(currentTask.id) && !errors.has(currentTask.id)) {
      const timer = setTimeout(() => {
        processTask(currentTask);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentTask, processing, completed, errors, processTask]);

  // Update progress
  useEffect(() => {
    const completedCount = completed.size;
    const totalTasks = tasks.length;
    setProgress((completedCount / totalTasks) * 100);

    if (completedCount === totalTasks && completedCount > 0) {
      onAllComplete?.(results);
    }
  }, [completed, tasks.length, results, onAllComplete]);

  // Auto-advance to next task
  useEffect(() => {
    if (currentTask && completed.has(currentTask.id) && currentTaskIndex < tasks.length - 1) {
      const timer = setTimeout(() => {
        setCurrentTaskIndex(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTask, completed, currentTaskIndex, tasks.length]);

  return (
    <div className={cn('space-y-6', className)} aria-label={ariaLabel} role="region">
      {/* Carmen's Guidance Header */}
      {showCarmenGuidance && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Carmen's AI Assistant</h3>
                <p className="text-sm text-orange-700">
                  I'm creating HR content that balances efficiency with empathy, ensuring every process honors human dignity.
                </p>
              </div>
              <Badge variant="outline" className="text-orange-600 border-orange-600">
                {completed.size} / {tasks.length}
              </Badge>
            </div>
            
            <div className="mt-3">
              <Progress value={progress} className="h-2 bg-orange-100" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Processing Display */}
      <AnimatePresence>
        {processing && currentPersonality && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Card className={cn('border-2', personalityModes[currentPersonality.mode].border)}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <motion.div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center',
                      personalityModes[currentPersonality.mode].bg
                    )}
                    animate={personalityModes[currentPersonality.mode].animation}
                  >
                    {personalityModes[currentPersonality.mode].icon}
                  </motion.div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                      <span className={cn('font-medium', personalityModes[currentPersonality.mode].color)}>
                        {currentPersonality.mode.charAt(0).toUpperCase() + currentPersonality.mode.slice(1)} Mode
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {processingStyles[currentPersonality.processingStyle]}
                    </p>
                  </div>
                  
                  <Coffee className="w-5 h-5 text-orange-400 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Results */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const isCompleted = completed.has(task.id);
          const hasError = errors.has(task.id);
          const result = results.get(task.id);
          const isVisible = index <= currentTaskIndex || isCompleted;

          if (!isVisible) return null;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                'border-2 transition-all duration-300',
                isCompleted ? 'border-green-200 bg-green-50' : 
                hasError ? 'border-red-200 bg-red-50' : 
                'border-orange-200'
              )}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : hasError ? (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-orange-600" />
                      )}
                      <span className={isCompleted ? 'text-green-800' : hasError ? 'text-red-800' : 'text-orange-800'}>
                        {task.title}
                      </span>
                    </CardTitle>

                    {result && allowExport && (
                      <div className="flex space-x-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyContent(result, task.title)}
                          className="h-8 px-2"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadContent(result, `${task.id}.txt`)}
                          className="h-8 px-2"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                        {allowEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </CardHeader>

                <CardContent>
                  {hasError && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-red-700">{errors.get(task.id)}</span>
                        {allowRetry && (retryCount.get(task.id) || 0) < maxRetries && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retryTask(task.id)}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                        {result}
                      </div>
                    </div>
                  )}

                  {processing && currentTask?.id === task.id && (
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-orange-600" />
                        <span className="text-sm text-orange-700">
                          Carmen is thoughtfully crafting your {task.type.replace('-', ' ')}...
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Message */}
      <AnimatePresence>
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-green-800 mb-2">
                  All HR Content Generated!
                </h3>
                <p className="text-green-700">
                  Carmen has completed all tasks with her signature blend of efficiency and empathy. 
                  Your HR processes are now ready to honor both organizational needs and human dignity.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CarmenAIProcessor;