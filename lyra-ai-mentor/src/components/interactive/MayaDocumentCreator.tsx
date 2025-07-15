import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Clock, CheckCircle, Brain, Target, Users } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface DocumentPhase {
  type: 'context' | 'creation' | 'refinement' | 'celebration';
  title: string;
  description: string;
  duration: string;
}

const phases: DocumentPhase[] = [
  {
    type: 'context',
    title: "Maya's Document Challenge",
    description: "Understand the high-stakes documentation need",
    duration: "2 minutes"
  },
  {
    type: 'creation',
    title: "Build Your Document",
    description: "Use AI to create professional content",
    duration: "8 minutes"
  },
  {
    type: 'refinement',
    title: "Polish for Impact",
    description: "Refine your document to perfection",
    duration: "5 minutes"
  },
  {
    type: 'celebration',
    title: "Celebrate Your Efficiency",
    description: "See how AI transformed your work",
    duration: "2 minutes"
  }
];

const documentTypes = [
  { value: "annual_report", label: "Annual Report", icon: FileText },
  { value: "impact_summary", label: "Impact Summary", icon: Target },
  { value: "donor_update", label: "Donor Update", icon: Users },
  { value: "program_overview", label: "Program Overview", icon: Brain }
];

export function MayaDocumentCreator() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [documentType, setDocumentType] = useState("");
  const [context, setContext] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [refinedContent, setRefinedContent] = useState("");

  const handleNextPhase = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handleGenerateDocument = () => {
    // Simulate AI generation
    const sampleContent = `
# Morrison Foundation Annual Report 2024

## Executive Summary
Under Maya Rodriguez's leadership, the Sunshine Youth Center has transformed the lives of over 150 at-risk youth this year. Our after-school program has become a beacon of hope in the community.

## Key Achievements
- 95% program retention rate (up from 78%)
- 87% improvement in academic performance
- 42 youth placed in summer internships
- $325,000 in funding secured

## Impact Story: Maria's Journey
Maria joined our program struggling with algebra and lacking confidence. Today, she's tutoring other students and has been accepted to three colleges with full scholarships.

## Financial Overview
Total Revenue: $485,000
Program Expenses: $412,000
Administrative: $58,000
Reserves: $15,000

## Looking Ahead
With continued support from the Morrison Foundation, we plan to:
- Expand to serve 200 youth by 2025
- Launch a weekend STEM program
- Create a parent engagement initiative

Maya Rodriguez reflects: "Every document we create is an opportunity to share the incredible transformations happening in our community. AI helps us tell these stories more powerfully than ever before."
    `;
    setGeneratedContent(sampleContent);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-700">Maya's Document Creation Powerhouse</CardTitle>
        <CardDescription className="text-lg mt-2">
          Transform hours of writing into minutes of strategic document creation
        </CardDescription>
        <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-green-50 rounded-lg">
          <Clock className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            Before: 2 hours of document drafting → After: 12 minutes of AI-powered creation
          </span>
          <span className="text-sm font-bold text-green-600">90% time saved</span>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Progress value={(currentPhase + 1) / phases.length * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`text-xs ${index <= currentPhase ? 'text-purple-600 font-semibold' : 'text-gray-400'}`}
              >
                {phase.title}
              </div>
            ))}
          </div>
        </div>

        {currentPhase === 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Maya's Document Challenge</h3>
              <p className="text-gray-700 mb-4">
                It's Thursday evening, and Maya just received an urgent request from the Morrison Foundation. 
                They need a comprehensive annual report by Monday morning to consider the Sunshine Youth Center 
                for a major multi-year grant.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="italic text-gray-600">
                  "I used to panic when I got requests like this. Now, with AI assistance, I can create 
                  compelling documents that truly capture our impact - in a fraction of the time."
                </p>
                <p className="text-sm mt-2 font-semibold text-purple-600">- Maya Rodriguez</p>
              </div>
            </div>
            <Button onClick={handleNextPhase} className="w-full bg-purple-600 hover:bg-purple-700">
              Help Maya Create This Document <Brain className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentPhase === 1 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Build Your Document with AI</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Select Document Type</label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose the document you need to create" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="w-4 h-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Provide Key Information (programs, impact metrics, success stories)
              </label>
              <Textarea
                placeholder="Example: 150 youth served, 95% retention rate, Maria's college success story, Morrison Foundation focus on education..."
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="h-32"
              />
            </div>

            <Button 
              onClick={() => {
                handleGenerateDocument();
                handleNextPhase();
              }}
              disabled={!documentType || !context}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Generate Professional Document <FileText className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentPhase === 2 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Polish Your Document</h3>
            
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm">{generatedContent}</pre>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Refine specific sections or add personal touches
              </label>
              <Textarea
                placeholder="Example: Add more detail about the STEM program impact, emphasize community partnerships..."
                value={refinedContent}
                onChange={(e) => setRefinedContent(e.target.value)}
                className="h-24"
              />
            </div>

            <Button onClick={handleNextPhase} className="w-full bg-purple-600 hover:bg-purple-700">
              Finalize Document <CheckCircle className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentPhase === 3 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-gray-800 mb-2">Document Created Successfully!</h3>
              
              <div className="grid grid-cols-3 gap-4 mt-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-purple-600">90%</p>
                  <p className="text-sm text-gray-600">Time Saved</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-blue-600">12 min</p>
                  <p className="text-sm text-gray-600">Total Time</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-2xl font-bold text-green-600">Pro</p>
                  <p className="text-sm text-gray-600">Quality Level</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <p className="italic text-gray-700">
                  "What used to take me an entire weekend now takes less than 15 minutes. 
                  I can focus on our youth instead of struggling with documents!"
                </p>
                <p className="text-sm mt-2 font-semibold text-purple-600">- Maya Rodriguez</p>
              </div>

              <p className="text-sm text-gray-600 mt-4">
                Your document has been saved to your toolkit for future reference and reuse.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MayaDocumentCreator;