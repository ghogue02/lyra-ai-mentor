import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileBarChart, Clock, CheckCircle, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ReportSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content?: string;
}

const reportSections: ReportSection[] = [
  { id: 'overview', title: 'Program Overview', icon: Users },
  { id: 'metrics', title: 'Impact Metrics', icon: TrendingUp },
  { id: 'financials', title: 'Financial Summary', icon: DollarSign },
  { id: 'stories', title: 'Success Stories', icon: FileBarChart }
];

export function MayaReportBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [reportType, setReportType] = useState("");
  const [reportPeriod, setReportPeriod] = useState("");
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [reportData, setReportData] = useState<Record<string, string>>({});

  const steps = [
    { title: "Maya's Report Challenge", description: "Understanding the urgency" },
    { title: "Configure Report", description: "Select type and sections" },
    { title: "Add Data Points", description: "Input key metrics" },
    { title: "AI Generation", description: "Create professional report" },
    { title: "Success!", description: "Report ready in minutes" }
  ];

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const generateReport = () => {
    // Simulate AI report generation
    const generatedReport = {
      overview: `The Sunshine Youth Center has exceeded all expectations this ${reportPeriod}. Under Maya Rodriguez's leadership, the program has grown from serving 75 youth to over 150, with a remarkable 95% retention rate.`,
      metrics: `
• Youth Served: 150 (100% increase)
• Academic Improvement: 87% showed grade increases
• College Readiness: 42 seniors accepted to colleges
• Community Hours: 3,200 volunteer hours contributed
• Parent Engagement: 89% active participation`,
      financials: `
Revenue: $485,000 (15% above budget)
- Morrison Foundation: $200,000
- Government Grants: $150,000
- Individual Donors: $135,000

Expenses: $470,000
- Programs: $380,000 (81%)
- Administration: $70,000 (15%)
- Fundraising: $20,000 (4%)`,
      stories: `Maria's transformation exemplifies our impact. Starting with a 2.1 GPA, she now maintains a 3.8 GPA and mentors younger students. "The center didn't just help me with homework," Maria shares, "they helped me believe in myself."`
    };
    
    setReportData(generatedReport);
    setCurrentStep(4);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-700">Maya's Impact Report Builder</CardTitle>
        <CardDescription className="text-lg mt-2">
          Transform scattered data into compelling reports that win funding
        </CardDescription>
        <div className="flex items-center justify-center gap-4 mt-4 p-4 bg-green-50 rounded-lg">
          <Clock className="w-5 h-5 text-green-600" />
          <span className="text-sm font-semibold text-green-700">
            Before: 2 hours of report compilation → After: 12 minutes with AI assistance
          </span>
          <Badge className="bg-green-600">90% time saved</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-6">
          <Progress value={(currentStep + 1) / steps.length * 100} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`text-xs ${index <= currentStep ? 'text-purple-600 font-semibold' : 'text-gray-400'}`}
              >
                {step.title}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 text-purple-700">The Quarterly Report Crisis</h3>
              <p className="text-gray-700 mb-4">
                It's 4:45 PM on Friday. Maya just remembered the quarterly impact report is due to the 
                board by Monday morning. She has data scattered across spreadsheets, emails, and handwritten notes.
              </p>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="italic text-gray-600">
                  "I used to dread report season. Now, I can pull together a professional report that 
                  truly showcases our impact in just minutes instead of entire weekends."
                </p>
                <p className="text-sm mt-2 font-semibold text-purple-600">- Maya Rodriguez</p>
              </div>
            </div>
            <Button 
              onClick={() => setCurrentStep(1)} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Start Building Report <FileBarChart className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Configure Your Report</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quarterly">Quarterly Impact Report</SelectItem>
                    <SelectItem value="annual">Annual Report</SelectItem>
                    <SelectItem value="grant">Grant Progress Report</SelectItem>
                    <SelectItem value="board">Board Meeting Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Report Period</label>
                <Select value={reportPeriod} onValueChange={setReportPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                    <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                    <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                    <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Report Sections</label>
                <div className="grid grid-cols-2 gap-3">
                  {reportSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleSectionToggle(section.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedSections.includes(section.id)
                          ? 'border-purple-600 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <section.icon className="w-5 h-5 mx-auto mb-1" />
                      <p className="text-sm">{section.title}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(2)}
              disabled={!reportType || !reportPeriod || selectedSections.length === 0}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Continue to Data Input
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="font-semibold text-lg text-purple-700">Quick Data Input</h3>
            <p className="text-sm text-gray-600">
              Just provide a few key numbers - AI will handle the narrative and formatting
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Youth Served This Period</label>
                <Input type="number" placeholder="e.g., 150" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Program Retention Rate (%)</label>
                <Input type="number" placeholder="e.g., 95" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Total Funding Secured ($)</label>
                <Input type="number" placeholder="e.g., 485000" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Key Success Metric</label>
                <Input placeholder="e.g., 87% grade improvement" />
              </div>
            </div>

            <Button 
              onClick={() => setCurrentStep(3)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Generate Report with AI
            </Button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="animate-pulse">
                <FileBarChart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-purple-700 mb-2">AI is Creating Your Report...</h3>
                <p className="text-gray-600">Analyzing data and crafting compelling narratives</p>
              </div>
            </div>
            {setTimeout(() => generateReport(), 2000) && null}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-xl text-center text-gray-800 mb-4">
                Report Generated Successfully!
              </h3>
              
              <div className="bg-white rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                {Object.entries(reportData).map(([key, content]) => {
                  const section = reportSections.find(s => s.id === key);
                  return section ? (
                    <div key={key} className="border-b pb-4 last:border-0">
                      <h4 className="font-semibold text-purple-700 mb-2 flex items-center gap-2">
                        <section.icon className="w-4 h-4" />
                        {section.title}
                      </h4>
                      <p className="text-gray-700 whitespace-pre-line">{content}</p>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">12 min</p>
                  <p className="text-sm text-gray-600">Time Spent</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">90%</p>
                  <p className="text-sm text-gray-600">Time Saved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">Ready</p>
                  <p className="text-sm text-gray-600">To Share</p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1">
                  Save to Toolkit
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}