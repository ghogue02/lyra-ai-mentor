import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Save, Building, Users, Target, Sparkles } from 'lucide-react';

interface CareSection {
  letter: string;
  title: string;
  description: string;
  content: string;
  completed: boolean;
}

const MayaCareFrameworkBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [careStructure, setCareStructure] = useState<CareSection[]>([
    {
      letter: 'C',
      title: 'Clarity',
      description: 'Define your clear, specific message',
      content: '',
      completed: false
    },
    {
      letter: 'A',
      title: 'Audience',
      description: 'Identify and understand your audience',
      content: '',
      completed: false
    },
    {
      letter: 'R',
      title: 'Relevance',
      description: 'Ensure content is relevant and valuable',
      content: '',
      completed: false
    },
    {
      letter: 'E',
      title: 'Engagement',
      description: 'Create compelling call-to-action',
      content: '',
      completed: false
    }
  ]);

  const updateSection = (index: number, content: string) => {
    const updated = [...careStructure];
    updated[index].content = content;
    updated[index].completed = content.trim().length > 10;
    setCareStructure(updated);
  };

  const nextStep = () => {
    if (currentStep < careStructure.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateFramework = async () => {
    // Simulate AI enhancement of CARE framework
    const enhanced = careStructure.map(section => ({
      ...section,
      content: section.content + '\n\n[AI Enhanced]: Additional strategic insights and best practices applied.'
    }));
    setCareStructure(enhanced);
  };

  const completedCount = careStructure.filter(s => s.completed).length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">CARE Framework Builder</CardTitle>
              <CardDescription>
                Build structured communication using Maya's CARE methodology
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="text-sm text-gray-600">
              Progress: {completedCount}/{careStructure.length} sections
            </div>
            <div className="flex gap-1">
              {careStructure.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${
                    careStructure[index].completed 
                      ? 'bg-green-500' 
                      : index === currentStep 
                        ? 'bg-purple-500' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CARE Overview */}
          <div className="grid grid-cols-4 gap-4">
            {careStructure.map((section, index) => (
              <Card 
                key={section.letter}
                className={`border-2 cursor-pointer transition-all ${
                  index === currentStep 
                    ? 'border-purple-500 bg-purple-50' 
                    : section.completed 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-white ${
                    section.completed ? 'bg-green-500' : index === currentStep ? 'bg-purple-500' : 'bg-gray-400'
                  }`}>
                    {section.completed ? <CheckCircle className="w-5 h-5" /> : section.letter}
                  </div>
                  <h3 className="font-semibold text-sm">{section.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{section.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Current Section Editor */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                  {careStructure[currentStep].letter}
                </span>
                {careStructure[currentStep].title}
              </CardTitle>
              <CardDescription>
                {careStructure[currentStep].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder={`Enter your ${careStructure[currentStep].title.toLowerCase()} content here...`}
                value={careStructure[currentStep].content}
                onChange={(e) => updateSection(currentStep, e.target.value)}
                rows={6}
                className="min-h-[150px]"
              />
              
              {/* Section Guidelines */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Guidelines for {careStructure[currentStep].title}:
                </h4>
                {currentStep === 0 && (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Be specific and concrete</li>
                    <li>• Avoid jargon and complex language</li>
                    <li>• State your main point upfront</li>
                  </ul>
                )}
                {currentStep === 1 && (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Consider their knowledge level</li>
                    <li>• Think about their priorities</li>
                    <li>• Address their concerns</li>
                  </ul>
                )}
                {currentStep === 2 && (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Connect to their needs</li>
                    <li>• Show clear value</li>
                    <li>• Stay focused on the topic</li>
                  </ul>
                )}
                {currentStep === 3 && (
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Include a clear next step</li>
                    <li>• Make it easy to respond</li>
                    <li>• Set expectations</li>
                  </ul>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button 
                  onClick={nextStep}
                  disabled={currentStep === careStructure.length - 1}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Next Section
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Complete Framework View */}
          {completedCount === 4 && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  Complete CARE Framework
                </CardTitle>
                <CardDescription className="text-green-600">
                  Your structured communication framework is ready
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {careStructure.map((section, index) => (
                  <div key={index} className="bg-white p-4 rounded border">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {section.letter}
                      </span>
                      <h4 className="font-semibold">{section.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700">{section.content}</p>
                  </div>
                ))}
                <Button onClick={generateFramework} className="w-full bg-green-600 hover:bg-green-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance with AI Insights
                </Button>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaCareFrameworkBuilder;