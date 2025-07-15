import React, { useState } from 'react';
import { ChevronRight, Shuffle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AIExample, getCharacterExamples, getRandomExample } from '@/services/aiExamplesService';

interface ExampleSelectorProps {
  character: 'maya' | 'sofia' | 'david' | 'rachel' | 'alex';
  onSelectExample: (example: AIExample) => void;
  buttonText?: string;
  buttonVariant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

export function ExampleSelector({
  character,
  onSelectExample,
  buttonText = 'Try an example',
  buttonVariant = 'outline',
  className = ''
}: ExampleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedExample, setSelectedExample] = useState<AIExample | null>(null);
  
  const examples = getCharacterExamples(character);
  
  const handleSelectExample = (example: AIExample) => {
    setSelectedExample(example);
    setIsOpen(false);
    onSelectExample(example);
  };
  
  const handleRandomExample = () => {
    const randomExample = getRandomExample(character);
    if (randomExample) {
      handleSelectExample(randomExample);
    }
  };
  
  const getCharacterColor = () => {
    const colors = {
      maya: 'from-purple-500 to-purple-600',
      sofia: 'from-pink-500 to-pink-600',
      david: 'from-blue-500 to-blue-600',
      rachel: 'from-green-500 to-green-600',
      alex: 'from-orange-500 to-orange-600'
    };
    return colors[character];
  };
  
  return (
    <>
      <Button
        variant={buttonVariant}
        onClick={() => setIsOpen(true)}
        className={`gap-2 ${className}`}
      >
        {buttonText}
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Choose an Example</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRandomExample}
                className="gap-2"
              >
                <Shuffle className="h-4 w-4" />
                Random
              </Button>
            </DialogTitle>
            <DialogDescription>
              Select a pre-filled example to get started quickly
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 mt-4">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => handleSelectExample(example)}
                className={`
                  group relative p-4 rounded-lg border-2 
                  hover:border-primary hover:shadow-md
                  transition-all text-left w-full
                  ${selectedExample?.id === example.id ? 'border-primary bg-primary/5' : 'border-gray-200'}
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {example.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {example.description}
                    </p>
                    {example.tags && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {example.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </div>
                
                {/* Gradient accent on hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-r ${getCharacterColor()} 
                  opacity-0 group-hover:opacity-5 rounded-lg transition-opacity
                `} />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}