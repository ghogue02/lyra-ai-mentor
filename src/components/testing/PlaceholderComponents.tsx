import React, { useState } from 'react';

export const SequenceSorter = () => {
  const [items, setItems] = useState([
    { id: 1, text: 'First step' },
    { id: 2, text: 'Second step' },
    { id: 3, text: 'Third step' },
  ]);

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

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Drag and Drop Sequence</h3>
      <p className="text-sm text-gray-600">Reorder the steps into the correct sequence.</p>
      {items.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          className="bg-white p-3 rounded-md shadow-sm border border-gray-200 cursor-move"
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};

export const NonprofitAIBingo = () => {
  const bingoSquares = [
    "Chatbot", "Email Writer", "Donor Analytics", "Grant Finder", "FREE SPACE",
    "Impact Tracker", "Route Planner", "Photo Sorter", "Security Monitor", "Calendar Bot",
    "Budget Planner", "Social Scheduler", "Voice Assistant", "Document Reader", "Supply Tracker",
    "Talent Finder", "Feedback Analyzer", "Performance Dashboard", "Communication Hub", "Event Planner",
    "Translation Tool", "Newsletter Bot", "Volunteer Matcher", "Report Generator", "Data Visualizer"
  ];

  const [clickedSquares, setClickedSquares] = useState<{ [key: number]: boolean }>({});

  const toggleSquare = (index: number) => {
    setClickedSquares(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Nonprofit AI Tools Bingo</h3>
        <p className="text-sm text-gray-600">Click on AI tools your organization uses or could benefit from!</p>
      </div>
      
      <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
        {bingoSquares.map((square, index) => (
          <div 
            key={index}
            onClick={() => square !== "FREE SPACE" && toggleSquare(index)}
            className={`
              aspect-square border-2 rounded-lg flex items-center justify-center text-center p-1
              text-xs font-medium leading-tight cursor-pointer transition-all duration-200
              ${square === "FREE SPACE" 
                ? "bg-yellow-200 border-yellow-400 text-yellow-800" 
                : clickedSquares[index]
                  ? "bg-green-200 border-green-400 text-green-800"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {square}
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-600">
        <p>Clicked: {Object.keys(clickedSquares).length}/24 tools</p>
      </div>
    </div>
  );
};

export const MultipleChoiceScenarios = () => {
  const scenarios = [
    {
      id: 1,
      question: "What is the primary goal of a nonprofit organization?",
      options: ["Generating profit for shareholders", "Serving a public interest or mission", "Influencing government policies", "Providing employment opportunities"],
      correctAnswer: "Serving a public interest or mission",
    },
    {
      id: 2,
      question: "Which of the following is NOT a typical source of funding for nonprofits?",
      options: ["Individual donations", "Government grants", "Venture capital investments", "Corporate sponsorships"],
      correctAnswer: "Venture capital investments",
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});

  const handleAnswerChange = (scenarioId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [scenarioId]: answer,
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Multiple Choice Scenarios</h3>
      <p className="text-sm text-gray-600">Test your knowledge with these multiple-choice questions.</p>
      {scenarios.map((scenario) => (
        <div key={scenario.id} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <p className="font-medium text-gray-700 mb-2">{scenario.question}</p>
          {scenario.options.map((option) => (
            <label key={option} className="flex items-center space-x-2 mb-1">
              <input
                type="radio"
                name={`scenario-${scenario.id}`}
                value={option}
                checked={selectedAnswers[scenario.id] === option}
                onChange={() => handleAnswerChange(scenario.id, option)}
                className="form-radio h-4 w-4 text-indigo-600"
              />
              <span className="text-gray-600">{option}</span>
            </label>
          ))}
          {selectedAnswers[scenario.id] && (
            <div className="mt-2">
              {selectedAnswers[scenario.id] === scenario.correctAnswer ? (
                <p className="text-green-600 text-sm">Correct!</p>
              ) : (
                <p className="text-red-600 text-sm">Incorrect. The correct answer is: {scenario.correctAnswer}</p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
