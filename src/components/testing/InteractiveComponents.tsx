import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowUp, ArrowDown, Shuffle, CheckCircle, 
  Clock, DollarSign, Calculator, Target, Zap, Users
} from 'lucide-react';

// Multiple Choice Scenarios Component
export const MultipleChoiceScenarios = () => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const scenarios = [
    {
      question: "Your nonprofit wants to use AI for donor outreach. What's the first step?",
      options: [
        "Buy the most expensive AI tool available",
        "Assess current donor communication processes", 
        "Replace all staff with AI systems",
        "Wait for AI to become cheaper"
      ],
      correct: 1,
      explanation: "Always start by understanding your current processes before implementing any AI solution."
    },
    {
      question: "When choosing an AI tool for your nonprofit, what matters most?",
      options: [
        "The tool has the most features",
        "It's the same tool big corporations use",
        "It fits your budget and staff capabilities",
        "It's the newest technology available"
      ],
      correct: 2,
      explanation: "The best AI tool is one your team can actually use effectively within your resources."
    },
    {
      question: "How should you introduce AI to hesitant staff members?",
      options: [
        "Implement it without telling them",
        "Force them to use it immediately",
        "Provide training and address their concerns",
        "Replace them with AI-friendly staff"
      ],
      correct: 2,
      explanation: "Change management requires empathy, training, and open communication about concerns."
    }
  ];

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const currentQ = scenarios[currentScenario];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Implementation Scenarios</h3>
        <p className="text-sm text-gray-600">Choose the best approach for each situation</p>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="mb-4">
            <Badge variant="outline" className="mb-2">
              Scenario {currentScenario + 1} of {scenarios.length}
            </Badge>
            <h4 className="font-medium mb-3">{currentQ.question}</h4>
          </div>

          <div className="space-y-2">
            {currentQ.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className={`w-full text-left justify-start h-auto p-3 ${
                  showResult
                    ? index === currentQ.correct
                      ? "bg-green-100 border-green-500 text-green-700"
                      : selectedAnswer === index
                      ? "bg-red-100 border-red-500 text-red-700"
                      : ""
                    : ""
                }`}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
              >
                <span className="text-sm">{option}</span>
              </Button>
            ))}
          </div>

          {showResult && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-sm text-blue-700">
                <strong>Explanation:</strong> {currentQ.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button onClick={nextScenario} size="sm">
          {showResult ? "Next Scenario" : "Skip"}
        </Button>
      </div>
    </div>
  );
};

// Story Fill-in-the-Blanks Component  
export const StoryFillInBlanks = () => {
  const [answers, setAnswers] = useState<{[key: string]: string}>({});
  const [showStory, setShowStory] = useState(false);

  const storyTemplate = {
    title: "AI Success Story at Hope Community Center",
    blanks: {
      problem: "Our biggest challenge was ___________",
      solution: "We decided to use AI to ___________", 
      tool: "The AI tool we chose was ___________",
      result: "After implementation, we saw ___________",
      impact: "This helped our community by ___________"
    },
    suggestions: {
      problem: ["volunteer scheduling", "donor communication", "data entry"],
      solution: ["automate repetitive tasks", "improve efficiency", "better organize information"],
      tool: ["a scheduling assistant", "an email automation system", "a data management platform"],
      result: ["20% time savings", "improved volunteer satisfaction", "better donor engagement"],
      impact: ["serving more families", "reducing staff burnout", "increasing program effectiveness"]
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const generateStory = () => {
    setShowStory(true);
  };

  const allFieldsFilled = Object.keys(storyTemplate.blanks).every(key => answers[key]?.trim());

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Success Story Builder</h3>
        <p className="text-sm text-gray-600">Fill in the blanks to create your nonprofit's AI story</p>
      </div>

      {!showStory ? (
        <div className="space-y-3">
          {Object.entries(storyTemplate.blanks).map(([key, prompt]) => (
            <div key={key}>
              <label className="text-sm font-medium text-gray-700 block mb-1">{prompt}</label>
              <input
                type="text"
                value={answers[key] || ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded text-sm"
                placeholder={`e.g., ${storyTemplate.suggestions[key as keyof typeof storyTemplate.suggestions][0]}`}
              />
              <div className="flex flex-wrap gap-1 mt-1">
                {storyTemplate.suggestions[key as keyof typeof storyTemplate.suggestions].map((suggestion, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => handleInputChange(key, suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ))}
          
          <Button 
            onClick={generateStory} 
            disabled={!allFieldsFilled}
            className="w-full"
            size="sm"
          >
            Generate My Story
          </Button>
        </div>
      ) : (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 text-green-700">{storyTemplate.title}</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <p>{storyTemplate.blanks.problem.replace('___________', answers.problem)}.</p>
              <p>{storyTemplate.blanks.solution.replace('___________', answers.solution)}.</p>
              <p>{storyTemplate.blanks.tool.replace('___________', answers.tool)}.</p>
              <p>{storyTemplate.blanks.result.replace('___________', answers.result)}.</p>
              <p>{storyTemplate.blanks.impact.replace('___________', answers.impact)}.</p>
            </div>
            <Button 
              onClick={() => {setShowStory(false); setAnswers({});}} 
              variant="outline" 
              size="sm" 
              className="mt-3"
            >
              Create Another Story
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Enhanced Sequence Sorter Component with Tooltips
export const SequenceSorter = () => {
  const [steps, setSteps] = useState([
    { 
      id: 1, 
      text: "Assess current workflows",
      description: "Start by mapping out your current processes - from volunteer onboarding to donor communications. Document time-consuming tasks, identify bottlenecks, and note where staff spend most of their administrative time. This foundation helps you see where AI can make the biggest impact for your mission."
    },
    { 
      id: 2, 
      text: "Identify AI use cases",
      description: "Look for repetitive tasks that follow patterns - email responses, volunteer matching, data entry, or scheduling. Focus on areas where AI can free up your team's time for relationship-building and direct service delivery. Start with one clear problem that affects your daily operations."
    },
    { 
      id: 3, 
      text: "Choose appropriate tools",
      description: "Research AI solutions designed for nonprofits or small organizations. Consider your budget, technical skills, and integration needs. Look for tools with nonprofit pricing, good customer support, and simple interfaces that won't overwhelm your team."
    },
    { 
      id: 4, 
      text: "Train staff",
      description: "Provide hands-on training in small groups, focusing on how AI tools will make their specific jobs easier. Address concerns openly, emphasize that AI enhances their work rather than replacing them, and ensure everyone feels comfortable with the new technology."
    },
    { 
      id: 5, 
      text: "Implement gradually",
      description: "Start with a pilot program using one AI tool for one specific task. Monitor results closely, gather feedback from your team, and make adjustments before expanding. This approach reduces risk and builds confidence throughout your organization."
    },
    { 
      id: 6, 
      text: "Monitor and adjust",
      description: "Track key metrics like time saved, accuracy improvements, and staff satisfaction. Regular check-ins help you optimize the AI tools for your specific needs and demonstrate the value to stakeholders. Be prepared to make changes as your organization grows."
    }
  ]);

  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const correctOrder = [1, 2, 3, 4, 5, 6];

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex >= 0 && targetIndex < newSteps.length) {
      [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];
      setSteps(newSteps);
      setShowResult(false);
    }
  };

  const checkOrder = () => {
    const currentOrder = steps.map(step => step.id);
    const correct = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
    setIsCorrect(correct);
    setShowResult(true);
  };

  const shuffleSteps = () => {
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setSteps(shuffled);
    setShowResult(false);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="font-medium text-gray-800 mb-2">AI Implementation Sequence</h3>
          <p className="text-sm text-gray-600">Put these steps in the correct order (hover for details)</p>
        </div>

        <div className="space-y-2">
          {steps.map((step, index) => (
            <Tooltip key={step.id}>
              <TooltipTrigger asChild>
                <Card className="border border-gray-200 cursor-help hover:border-gray-300 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium">{step.text}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(index, 'up')}
                          disabled={index === 0}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveStep(index, 'down')}
                          disabled={index === steps.length - 1}
                          className="h-8 w-8 p-0"
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent className="max-w-80 p-3">
                <p className="text-sm">{step.description}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          <Button onClick={checkOrder} size="sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Check Order
          </Button>
          <Button onClick={shuffleSteps} variant="outline" size="sm">
            <Shuffle className="w-3 h-3 mr-1" />
            Shuffle
          </Button>
        </div>

        {showResult && (
          <Card className={`border ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
            <CardContent className="p-3 text-center">
              <p className={`text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? 
                  "Perfect! You've mastered the AI implementation sequence." : 
                  "Not quite right. Try rearranging the steps - think about what should come first!"
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

// AI Tool Recommendation Engine Component
export const AIToolRecommendationEngine = () => {
  const [orgProfile, setOrgProfile] = useState({
    size: '',
    budget: '',
    focus: '',
    techLevel: ''
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const generateRecommendations = () => {
    const tools = [
      {
        name: "Mailchimp AI",
        category: "Email Marketing",
        price: "Free - $299/month",
        fit: "Small to Medium Organizations",
        description: "AI-powered email optimization and audience insights"
      },
      {
        name: "Salesforce Nonprofit Cloud",
        category: "Donor Management", 
        price: "Free for qualifying nonprofits",
        fit: "All sizes",
        description: "Comprehensive CRM with AI-powered donor insights"
      },
      {
        name: "Microsoft Dynamics 365",
        category: "Operations",
        price: "$20-95/user/month",
        fit: "Medium to Large Organizations",
        description: "AI-enhanced operations and volunteer management"
      }
    ];

    const filtered = tools.filter(() => Math.random() > 0.3);
    setRecommendations(filtered);
  };

  const hasProfile = Object.values(orgProfile).every(value => value !== '');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Tool Recommendations</h3>
        <p className="text-sm text-gray-600">Find the right AI tools for your organization</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Organization Size</label>
          <select
            value={orgProfile.size}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, size: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select size</option>
            <option value="small">Small (1-10 staff)</option>
            <option value="medium">Medium (11-50 staff)</option>
            <option value="large">Large (50+ staff)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Monthly Budget</label>
          <select
            value={orgProfile.budget}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select budget</option>
            <option value="low">Under $100</option>
            <option value="medium">$100-500</option>
            <option value="high">$500+</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Primary Focus</label>
          <select
            value={orgProfile.focus}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, focus: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select focus</option>
            <option value="fundraising">Fundraising</option>
            <option value="programs">Program Delivery</option>
            <option value="operations">Operations</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Tech Comfort</label>
          <select
            value={orgProfile.techLevel}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, techLevel: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={generateRecommendations} 
        disabled={!hasProfile}
        className="w-full"
        size="sm"
      >
        <Target className="w-3 h-3 mr-1" />
        Get Recommendations
      </Button>

      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800">Recommended Tools:</h4>
          {recommendations.map((tool, index) => (
            <Card key={index} className="border border-blue-200">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sm">{tool.name}</h5>
                  <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Fit: {tool.fit}</span>
                  <span className="font-medium">{tool.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Time Savings Calculator Component
export const TimeSavingsCalculator = () => {
  const [inputs, setInputs] = useState({
    emailHours: '',
    dataEntryHours: '',
    schedulingHours: '',
    reportingHours: ''
  });
  const [results, setResults] = useState<any>(null);

  const calculateSavings = () => {
    const total = Object.values(inputs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const aiSavings = total * 0.3; // Assume 30% time savings
    const weeklySavings = aiSavings;
    const monthlySavings = weeklySavings * 4;
    const yearlySavings = monthlySavings * 12;
    const costSavings = yearlySavings * 25; // $25/hour average

    setResults({
      totalHours: total,
      weeklySavings,
      monthlySavings,
      yearlySavings,
      costSavings
    });
  };

  const hasData = Object.values(inputs).some(val => val !== '');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Time Savings Calculator</h3>
        <p className="text-sm text-gray-600">See how much time AI could save your team</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Email management (hours/week):</label>
          <input
            type="number"
            value={inputs.emailHours}
            onChange={(e) => setInputs(prev => ({ ...prev, emailHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Data entry (hours/week):</label>
          <input
            type="number"
            value={inputs.dataEntryHours}
            onChange={(e) => setInputs(prev => ({ ...prev, dataEntryHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 8"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Scheduling (hours/week):</label>
          <input
            type="number"
            value={inputs.schedulingHours}
            onChange={(e) => setInputs(prev => ({ ...prev, schedulingHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Reporting (hours/week):</label>
          <input
            type="number"
            value={inputs.reportingHours}
            onChange={(e) => setInputs(prev => ({ ...prev, reportingHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 6"
          />
        </div>
      </div>

      <Button 
        onClick={calculateSavings} 
        disabled={!hasData}
        className="w-full"
        size="sm"
      >
        <Calculator className="w-3 h-3 mr-1" />
        Calculate Savings
      </Button>

      {results && (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 text-green-700">Your Potential Savings</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{results.weeklySavings.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Hours/Week</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{results.monthlySavings.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Hours/Month</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{results.yearlySavings.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Hours/Year</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">${results.costSavings.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Annual Savings</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              *Based on 30% efficiency gains and $25/hour average cost
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
