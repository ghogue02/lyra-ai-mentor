import React, { useState } from 'react';
export const SequenceSorter = () => {
  const [items, setItems] = useState([{
    id: 1,
    text: 'First step'
  }, {
    id: 2,
    text: 'Second step'
  }, {
    id: 3,
    text: 'Third step'
  }]);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const newItems = [...items];
    const draggedItem = newItems[dragIndex];
    newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);
    setItems(newItems);
  };
  return <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Drag and Drop Sequence</h3>
      <p className="text-sm text-gray-600">Reorder the steps into the correct sequence.</p>
      {items.map((item, index) => <div key={item.id} draggable onDragStart={e => handleDragStart(e, index)} onDragOver={handleDragOver} onDrop={e => handleDrop(e, index)} className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-move">
          {item.text}
        </div>)}
    </div>;
};
export const NonprofitAIBingo = () => {
  const bingoSquares = ["Chatbot", "Email Writer", "Donor Analytics", "Grant Finder", "FREE SPACE", "Impact Tracker", "Route Planner", "Photo Sorter", "Security Monitor", "Calendar Bot", "Budget Planner", "Social Scheduler", "Voice Assistant", "Document Reader", "Supply Tracker", "Talent Finder", "Feedback Analyzer", "Performance Dashboard", "Communication Hub", "Event Planner", "Translation Tool", "Newsletter Bot", "Volunteer Matcher", "Report Generator", "Data Visualizer"];
  const [clickedSquares, setClickedSquares] = useState<{
    [key: number]: boolean;
  }>({});
  const toggleSquare = (index: number) => {
    setClickedSquares(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  return <div className="space-y-4">
      <div className="text-center">
        
        <p className="text-sm text-gray-600">Click on AI tools your organization uses or could benefit from!</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {bingoSquares.map((square, index) => <div key={index} onClick={() => square !== "FREE SPACE" && toggleSquare(index)} className={`
              aspect-square border-2 rounded-lg flex items-center justify-center text-center p-1
              text-xs font-medium leading-tight cursor-pointer transition-all duration-200
              ${square === "FREE SPACE" ? "bg-yellow-200 border-yellow-400 text-yellow-800" : clickedSquares[index] ? "bg-green-200 border-green-400 text-green-800" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}
            `}>
            {square}
          </div>)}
      </div>
      
      <div className="text-center text-sm text-gray-600">
        <p>Clicked: {Object.keys(clickedSquares).length}/24 tools</p>
      </div>
    </div>;
};
export const MultipleChoiceScenarios = () => {
  const scenarios = [{
    id: 1,
    question: "What is the primary goal of a nonprofit organization?",
    options: ["Generating profit for shareholders", "Serving a public interest or mission", "Influencing government policies", "Providing employment opportunities"],
    correctAnswer: "Serving a public interest or mission"
  }, {
    id: 2,
    question: "Which of the following is NOT a typical source of funding for nonprofits?",
    options: ["Individual donations", "Government grants", "Venture capital investments", "Corporate sponsorships"],
    correctAnswer: "Venture capital investments"
  }];
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [currentScenario, setCurrentScenario] = useState(0);
  const handleAnswerChange = (scenarioId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [scenarioId]: answer
    }));
  };
  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
    }
  };
  const prevScenario = () => {
    if (currentScenario > 0) {
      setCurrentScenario(prev => prev - 1);
    }
  };
  const scenario = scenarios[currentScenario];
  return <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Multiple Choice Scenarios</h3>
      <p className="text-sm text-gray-600">Test your knowledge with these multiple-choice questions.</p>
      
      <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-500">Question {currentScenario + 1} of {scenarios.length}</span>
        </div>
        
        <p className="font-medium text-gray-700 mb-2">{scenario.question}</p>
        {scenario.options.map(option => <label key={option} className="flex items-center space-x-2 mb-1">
            <input type="radio" name={`scenario-${scenario.id}`} value={option} checked={selectedAnswers[scenario.id] === option} onChange={() => handleAnswerChange(scenario.id, option)} className="form-radio h-4 w-4 text-indigo-600" />
            <span className="text-gray-600">{option}</span>
          </label>)}
        
        {selectedAnswers[scenario.id] && <div className="mt-2">
            {selectedAnswers[scenario.id] === scenario.correctAnswer ? <p className="text-green-600 text-sm">Correct!</p> : <p className="text-red-600 text-sm">Incorrect. The correct answer is: {scenario.correctAnswer}</p>}
          </div>}
        
        <div className="flex justify-between mt-3">
          <button onClick={prevScenario} disabled={currentScenario === 0} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50">
            Previous
          </button>
          <button onClick={nextScenario} disabled={currentScenario === scenarios.length - 1} className="px-3 py-1 text-sm bg-blue-500 text-white rounded disabled:opacity-50">
            Next
          </button>
        </div>
      </div>
    </div>;
};

// Placeholder components for missing elements
export const AIToolRecommendationEngine = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">AI Tool Recommendation Engine</h4>
    <p className="text-sm text-gray-600">Get personalized AI tool recommendations based on your nonprofit's needs.</p>
    <button className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm">Start Assessment</button>
  </div>;
export const SuccessStoryBuilder = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">Success Story Builder</h4>
    <p className="text-sm text-gray-600">Create compelling success stories from your program data.</p>
    <button className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm">Build Story</button>
  </div>;
export const AIEthicsDecisionTree = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">AI Ethics Decision Tree</h4>
    <p className="text-sm text-gray-600">Navigate ethical considerations when implementing AI solutions.</p>
    <button className="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-sm">Start Ethics Check</button>
  </div>;
export const NonprofitAIReadinessQuiz = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">AI Readiness Quiz</h4>
    <p className="text-sm text-gray-600">Assess your organization's readiness for AI implementation.</p>
    <button className="mt-2 px-3 py-1 bg-orange-500 text-white rounded text-sm">Take Quiz</button>
  </div>;
export const AIMythBusterSpinner = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">AI Myth Buster Spinner</h4>
    <p className="text-sm text-gray-600">Spin to learn about common AI myths and facts.</p>
    <button className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm">Spin to Learn</button>
  </div>;
export const ROIImpactVisualizer = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">ROI Impact Visualizer</h4>
    <p className="text-sm text-gray-600">Visualize the potential return on investment for AI initiatives.</p>
    <button className="mt-2 px-3 py-1 bg-indigo-500 text-white rounded text-sm">Visualize ROI</button>
  </div>;
export const CommunityImpactMultiplier = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">Community Impact Multiplier</h4>
    <p className="text-sm text-gray-600">Calculate how AI can multiply your community impact.</p>
    <button className="mt-2 px-3 py-1 bg-teal-500 text-white rounded text-sm">Calculate Impact</button>
  </div>;
export const DonorSegmentationSimulator = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">Donor Segmentation Simulator</h4>
    <p className="text-sm text-gray-600">Simulate AI-powered donor segmentation strategies.</p>
    <button className="mt-2 px-3 py-1 bg-pink-500 text-white rounded text-sm">Start Simulation</button>
  </div>;
export const VolunteerCoordinationGame = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">Volunteer Coordination Game</h4>
    <p className="text-sm text-gray-600">Play a game to learn volunteer coordination with AI.</p>
    <button className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm">Play Game</button>
  </div>;
export const FoodRescueRouteOptimizer = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">Food Rescue Route Optimizer</h4>
    <p className="text-sm text-gray-600">Optimize food rescue routes using AI algorithms.</p>
    <button className="mt-2 px-3 py-1 bg-emerald-500 text-white rounded text-sm">Optimize Routes</button>
  </div>;
export const MentorMatchingSimulator = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">Mentor Matching Simulator</h4>
    <p className="text-sm text-gray-600">Simulate AI-powered mentor-mentee matching.</p>
    <button className="mt-2 px-3 py-1 bg-violet-500 text-white rounded text-sm">Start Matching</button>
  </div>;
export const AIBeforeAfterSlider = () => <div className="text-center p-4 border border-gray-200 rounded">
    <h4 className="font-medium mb-2">AI Before/After Slider</h4>
    <p className="text-sm text-gray-600">Compare processes before and after AI implementation.</p>
    <button className="mt-2 px-3 py-1 bg-cyan-500 text-white rounded text-sm">View Comparison</button>
  </div>;