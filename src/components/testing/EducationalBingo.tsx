
import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Clock, Trophy, BookOpen, X, Lightbulb } from 'lucide-react';

interface AITool {
  name: string;
  description: string;
  cost: string;
  example: string;
}

interface Scenario {
  challenge: string;
  correctTool: string;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  hint: string;
}

const AI_TOOLS: AITool[] = [
  { name: "Chatbot", description: "Automated customer service and FAQ responses", cost: "Low", example: "24/7 donor inquiries" },
  { name: "Email Writer", description: "Personalized donor communications", cost: "Low", example: "Thank you letters" },
  { name: "Donor Analytics", description: "Predict giving patterns and identify prospects", cost: "Medium", example: "Major gift targeting" },
  { name: "Grant Finder", description: "Automated grant opportunity discovery", cost: "Medium", example: "Foundation matching" },
  { name: "Impact Tracker", description: "Measure and visualize program outcomes", cost: "Medium", example: "ROI reporting" },
  { name: "Route Planner", description: "Optimize delivery and service routes", cost: "Low", example: "Food bank efficiency" },
  { name: "Photo Sorter", description: "Automatically categorize event photos", cost: "Low", example: "Event documentation" },
  { name: "Security Monitor", description: "Detect unusual activity patterns", cost: "High", example: "Fraud prevention" },
  { name: "Calendar Bot", description: "Automated meeting scheduling", cost: "Low", example: "Volunteer coordination" },
  { name: "Budget Planner", description: "AI-powered financial forecasting", cost: "Medium", example: "Annual planning" },
  { name: "Social Scheduler", description: "Optimize social media posting times", cost: "Low", example: "Engagement boost" },
  { name: "Voice Assistant", description: "Hands-free data entry and queries", cost: "Medium", example: "Field work support" },
  { name: "Document Reader", description: "Extract data from forms and documents", cost: "Medium", example: "Application processing" },
  { name: "Supply Tracker", description: "Inventory management and predictions", cost: "Medium", example: "Food pantry stock" },
  { name: "Talent Finder", description: "Match volunteers to optimal roles", cost: "Medium", example: "Skill-based matching" },
  { name: "Feedback Analyzer", description: "Process and categorize client feedback", cost: "Low", example: "Service improvement" },
  { name: "Performance Dashboard", description: "Real-time organizational metrics", cost: "High", example: "Board reporting" },
  { name: "Communication Hub", description: "Unified messaging across platforms", cost: "Medium", example: "Team coordination" },
  { name: "Event Planner", description: "Automated event logistics management", cost: "Medium", example: "Fundraising galas" },
  { name: "Translation Tool", description: "Multi-language client communication", cost: "Low", example: "Diverse communities" },
  { name: "Newsletter Bot", description: "Automated content creation and sending", cost: "Low", example: "Monthly updates" },
  { name: "Volunteer Matcher", description: "Connect volunteers with opportunities", cost: "Medium", example: "Skill alignment" },
  { name: "Report Generator", description: "Automated compliance and impact reports", cost: "Medium", example: "Funder requirements" },
  { name: "Data Visualizer", description: "Transform data into compelling charts", cost: "Medium", example: "Impact storytelling" }
];

const SCENARIOS: Scenario[] = [
  {
    challenge: "Donors are asking the same questions repeatedly about your programs",
    correctTool: "Chatbot",
    explanation: "A chatbot can handle common inquiries 24/7, freeing up staff time for complex donor relationships.",
    difficulty: 'basic',
    hint: "Think about automating repetitive conversations that happen frequently"
  },
  {
    challenge: "Your thank you letters feel generic and donors mention this in feedback",
    correctTool: "Email Writer",
    explanation: "AI email writers can personalize messages based on donor history, interests, and giving patterns.",
    difficulty: 'basic',
    hint: "Consider tools that can customize content based on individual donor data"
  },
  {
    challenge: "You want to identify which donors might be ready for a major gift ask",
    correctTool: "Donor Analytics",
    explanation: "Predictive analytics can score donors based on giving history, engagement, and capacity indicators.",
    difficulty: 'intermediate',
    hint: "Look for tools that can analyze patterns and predict future behavior"
  },
  {
    challenge: "Your development team spends hours searching for relevant grants",
    correctTool: "Grant Finder",
    explanation: "AI can continuously scan databases and alert you to opportunities matching your mission and criteria.",
    difficulty: 'basic',
    hint: "Think about automating the search and discovery process"
  },
  {
    challenge: "Board members want clear data on program effectiveness and ROI",
    correctTool: "Impact Tracker",
    explanation: "AI can correlate activities with outcomes, providing compelling evidence of your organization's impact.",
    difficulty: 'intermediate',
    hint: "Consider tools that measure and visualize results and outcomes"
  },
  {
    challenge: "Your food delivery routes are inefficient and waste gas money",
    correctTool: "Route Planner",
    explanation: "Route optimization can reduce fuel costs by 20-30% while serving more clients in less time.",
    difficulty: 'basic',
    hint: "Think about optimizing travel paths and logistics"
  },
  {
    challenge: "After events, you have thousands of photos that need organizing",
    correctTool: "Photo Sorter",
    explanation: "AI can automatically tag and categorize photos by people, activities, and locations for easy retrieval.",
    difficulty: 'basic',
    hint: "Consider tools that can automatically organize and categorize visual content"
  },
  {
    challenge: "You're concerned about potential fraud in your donation processing",
    correctTool: "Security Monitor",
    explanation: "AI can detect unusual patterns in transactions and flag potentially fraudulent activity for review.",
    difficulty: 'advanced',
    hint: "Look for tools that can detect suspicious patterns and unusual activity"
  },
  {
    challenge: "Coordinating volunteer schedules is becoming a full-time job",
    correctTool: "Calendar Bot",
    explanation: "Automated scheduling can handle availability, preferences, and conflicts without human intervention.",
    difficulty: 'intermediate',
    hint: "Think about automating time management and scheduling coordination"
  },
  {
    challenge: "Your annual budget planning takes months and feels like guesswork",
    correctTool: "Budget Planner",
    explanation: "AI can analyze historical data and trends to create more accurate financial forecasts.",
    difficulty: 'intermediate',
    hint: "Consider tools that can analyze historical data to predict future financial needs"
  },
  {
    challenge: "Your social media posts get low engagement despite good content",
    correctTool: "Social Scheduler",
    explanation: "AI can determine optimal posting times based on your audience's behavior patterns.",
    difficulty: 'basic',
    hint: "Think about timing and optimization of when content is shared"
  },
  {
    challenge: "Field workers waste time returning to office to enter data",
    correctTool: "Voice Assistant",
    explanation: "Voice-to-text AI allows real-time data entry while workers stay focused on clients.",
    difficulty: 'intermediate',
    hint: "Consider hands-free solutions that work in the field"
  },
  {
    challenge: "Processing volunteer applications manually takes your team weeks",
    correctTool: "Document Reader",
    explanation: "AI can extract key information from applications and forms, dramatically speeding up processing.",
    difficulty: 'intermediate',
    hint: "Look for tools that can automatically extract information from paperwork"
  },
  {
    challenge: "Your food pantry often runs out of essentials or overstocks items",
    correctTool: "Supply Tracker",
    explanation: "Predictive analytics can forecast demand and optimize inventory levels based on usage patterns.",
    difficulty: 'intermediate',
    hint: "Think about predicting demand and managing inventory levels"
  },
  {
    challenge: "Volunteers often quit because they're not matched to roles they enjoy",
    correctTool: "Talent Finder",
    explanation: "AI can match volunteer skills, interests, and personalities to roles where they'll be most effective.",
    difficulty: 'advanced',
    hint: "Consider tools that can match people based on skills and preferences"
  },
  {
    challenge: "You receive hundreds of client feedback forms but can't process them all",
    correctTool: "Feedback Analyzer",
    explanation: "AI can categorize feedback by themes and sentiment, highlighting priority areas for improvement.",
    difficulty: 'intermediate',
    hint: "Look for tools that can automatically categorize and analyze large amounts of text"
  },
  {
    challenge: "Creating board reports requires pulling data from multiple systems",
    correctTool: "Performance Dashboard",
    explanation: "AI dashboards can integrate multiple data sources into real-time, comprehensive reporting.",
    difficulty: 'advanced',
    hint: "Think about consolidating and visualizing data from various sources"
  },
  {
    challenge: "Your team uses different platforms and important messages get lost",
    correctTool: "Communication Hub",
    explanation: "AI can centralize and prioritize communications across email, Slack, texts, and other platforms.",
    difficulty: 'intermediate',
    hint: "Consider tools that can unify and organize communications across platforms"
  },
  {
    challenge: "Planning your annual fundraising gala involves countless moving parts",
    correctTool: "Event Planner",
    explanation: "AI can coordinate timelines, vendor management, and logistics while tracking budget and attendance.",
    difficulty: 'advanced',
    hint: "Look for tools that can manage complex logistics and coordination"
  },
  {
    challenge: "Many of your clients speak different languages than your staff",
    correctTool: "Translation Tool",
    explanation: "Real-time AI translation can break down language barriers and improve service accessibility.",
    difficulty: 'basic',
    hint: "Think about breaking down language barriers in real-time"
  }
];

export const EducationalBingo = () => {
  const { toast } = useToast();
  
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [bingoCard, setBingoCard] = useState<string[]>([]);
  const [markedSquares, setMarkedSquares] = useState<{[key: number]: boolean}>({});
  const [correctMarks, setCorrectMarks] = useState<{[key: number]: boolean}>({});
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [showEducation, setShowEducation] = useState<{[key: number]: boolean}>({});
  const [timeLeft, setTimeLeft] = useState(20);
  const [scenarioStartTime, setScenarioStartTime] = useState<Date | null>(null);
  const [showHint, setShowHint] = useState(false);

  // Auto-dismiss education tooltips after 4 seconds
  useEffect(() => {
    const activeTooltips = Object.keys(showEducation).filter(key => showEducation[parseInt(key)]);
    
    if (activeTooltips.length > 0) {
      const timeout = setTimeout(() => {
        setShowEducation({});
      }, 4000);
      
      return () => clearTimeout(timeout);
    }
  }, [showEducation]);

  // Hint timer - show hint after 5 seconds
  useEffect(() => {
    let hintTimeout: NodeJS.Timeout;
    
    if (gameActive && !gameWon && currentScenario && !showHint) {
      hintTimeout = setTimeout(() => {
        setShowHint(true);
      }, 5000);
    }
    
    return () => clearTimeout(hintTimeout);
  }, [gameActive, gameWon, currentScenario, showHint]);

  // Generate randomized bingo card
  const generateBingoCard = useCallback(() => {
    const shuffled = [...AI_TOOLS].sort(() => 0.5 - Math.random());
    const cardTools = shuffled.slice(0, 24).map(tool => tool.name);
    cardTools.splice(12, 0, "FREE SPACE"); // Insert free space in center
    return cardTools;
  }, []);

  // Initialize game
  const startNewGame = useCallback(() => {
    setBingoCard(generateBingoCard());
    setMarkedSquares({ 12: true }); // Mark free space
    setCorrectMarks({ 12: true });
    setGameWon(false);
    setScore(0);
    setScenarioIndex(0);
    setShowEducation({});
    setShowHint(false);
    setGameActive(true);
    setCurrentScenario(SCENARIOS[0]);
    setScenarioStartTime(new Date());
    setTimeLeft(20);
  }, [generateBingoCard]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameActive && !gameWon && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameActive && !gameWon) {
      // Time's up, move to next scenario
      nextScenario();
    }
    return () => clearInterval(interval);
  }, [gameActive, gameWon, timeLeft]);

  // Check for bingo
  const checkForBingo = useCallback((squares: {[key: number]: boolean}) => {
    const patterns: number[][] = [];
    
    // Rows
    for (let row = 0; row < 5; row++) {
      const line = [];
      for (let col = 0; col < 5; col++) {
        line.push(row * 5 + col);
      }
      if (line.every(index => squares[index])) {
        patterns.push(line);
      }
    }
    
    // Columns
    for (let col = 0; col < 5; col++) {
      const line = [];
      for (let row = 0; row < 5; row++) {
        line.push(row * 5 + col);
      }
      if (line.every(index => squares[index])) {
        patterns.push(line);
      }
    }
    
    // Diagonals
    const diagonal1 = [0, 6, 12, 18, 24];
    const diagonal2 = [4, 8, 12, 16, 20];
    
    if (diagonal1.every(index => squares[index])) {
      patterns.push(diagonal1);
    }
    if (diagonal2.every(index => squares[index])) {
      patterns.push(diagonal2);
    }
    
    return patterns;
  }, []);

  // Handle square click
  const handleSquareClick = (index: number) => {
    if (!gameActive || gameWon || index === 12) return;
    
    const toolName = bingoCard[index];
    const isCorrect = currentScenario && toolName === currentScenario.correctTool;
    
    if (isCorrect) {
      const timeBonus = Math.max(0, Math.floor(timeLeft / 4));
      setScore(prev => prev + 10 + timeBonus);
      
      const newMarkedSquares = { ...markedSquares, [index]: true };
      const newCorrectMarks = { ...correctMarks, [index]: true };
      
      setMarkedSquares(newMarkedSquares);
      setCorrectMarks(newCorrectMarks);
      
      // Show educational content
      setShowEducation({ [index]: true });
      
      toast({
        title: "🎯 Correct!",
        description: `+${10 + timeBonus} points! ${currentScenario?.explanation}`,
      });
      
      // Check for bingo
      const winningLines = checkForBingo(newCorrectMarks);
      if (winningLines.length > 0) {
        setGameWon(true);
        setGameActive(false);
        setShowEducation({});
        setShowHint(false);
        toast({
          title: "🏆 BINGO!",
          description: `Congratulations! You completed the game with ${score + 10 + timeBonus} points!`,
        });
        return;
      }
      
      // Automatically move to next scenario
      setTimeout(() => nextScenario(), 1500);
    } else {
      setScore(prev => Math.max(0, prev - 2));
      toast({
        title: "❌ Incorrect",
        description: "Try again! Think about what tool would solve this challenge.",
        variant: "destructive"
      });
    }
  };

  // Move to next scenario
  const nextScenario = () => {
    setShowEducation({});
    setShowHint(false);
    
    if (scenarioIndex < SCENARIOS.length - 1) {
      const nextIndex = scenarioIndex + 1;
      setScenarioIndex(nextIndex);
      setCurrentScenario(SCENARIOS[nextIndex]);
      setScenarioStartTime(new Date());
      setTimeLeft(20);
    } else {
      // End game
      setGameActive(false);
      toast({
        title: "🎉 Game Complete!",
        description: `You've completed all scenarios! Final score: ${score}`,
      });
    }
  };

  // Manual dismiss of education tooltip
  const dismissEducation = (index: number) => {
    setShowEducation(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  // Get tool info
  const getToolInfo = (toolName: string) => {
    return AI_TOOLS.find(tool => tool.name === toolName);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Educational Nonprofit AI Bingo
          </CardTitle>
          <p className="text-sm text-gray-600">
            Match nonprofit challenges with the right AI solutions to win BINGO!
          </p>
        </CardHeader>
        <CardContent>
          {/* Game Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={startNewGame}
                variant={gameActive ? "secondary" : "default"}
                size="sm"
              >
                {gameActive ? <RotateCcw className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {gameActive ? "New Game" : "Start Game"}
              </Button>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Score: {score}</Badge>
                <Badge variant="outline">Round: {round}</Badge>
              </div>
            </div>
            
            {gameActive && !gameWon && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <Badge variant={timeLeft <= 5 ? "destructive" : "default"}>
                  {timeLeft}s
                </Badge>
              </div>
            )}
          </div>

          {/* Current Scenario */}
          {gameActive && currentScenario && !gameWon && (
            <Card className="mb-4 bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-900 mb-1">Challenge:</p>
                    <p className="text-blue-800 mb-3">{currentScenario.challenge}</p>
                    
                    {/* Hint Section */}
                    {showHint && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800 text-sm mb-1">Hint:</p>
                            <p className="text-yellow-700 text-sm">{currentScenario.hint}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Badge 
                      variant="outline" 
                      className="mt-2"
                    >
                      {currentScenario.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bingo Card */}
          {bingoCard.length > 0 && (
            <div className="grid grid-cols-5 gap-2 max-w-md mx-auto relative">
              {bingoCard.map((tool, index) => {
                const isMarked = markedSquares[index];
                const isCorrect = correctMarks[index];
                const toolInfo = getToolInfo(tool);
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSquareClick(index)}
                    className={`
                      aspect-square border-2 rounded-lg flex flex-col items-center justify-center
                      text-center p-1 text-xs font-medium leading-tight transition-all duration-200
                      relative
                      ${tool === "FREE SPACE" 
                        ? "bg-yellow-200 border-yellow-400 text-yellow-800" 
                        : gameActive && !gameWon
                          ? "cursor-pointer hover:bg-gray-50 border-gray-300"
                          : "border-gray-300"
                      }
                      ${isMarked && isCorrect 
                        ? "bg-green-200 border-green-400 text-green-800"
                        : isMarked
                          ? "bg-red-200 border-red-400 text-red-800"
                          : "bg-white text-gray-700"
                      }
                    `}
                  >
                    <span className="text-[10px] leading-tight">{tool}</span>
                  </div>
                );
              })}
              
              {/* Educational Tooltips - Positioned absolutely over the grid */}
              {Object.keys(showEducation).map(indexStr => {
                const index = parseInt(indexStr);
                if (!showEducation[index]) return null;
                
                const toolInfo = getToolInfo(bingoCard[index]);
                if (!toolInfo) return null;
                
                // Calculate position based on grid index
                const row = Math.floor(index / 5);
                const col = index % 5;
                const topPos = row * 65 + 32;
                const leftPos = col * 65 + 32;
                
                return (
                  <div
                    key={index}
                    className="absolute z-20 bg-white border-2 border-green-400 rounded-lg p-3 shadow-lg max-w-xs"
                    style={{
                      top: `${topPos}px`,
                      left: `${leftPos}px`,
                      transform: 'translate(-50%, -100%)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-1">{toolInfo.name}</p>
                        <p className="text-xs text-gray-600 mb-2">{toolInfo.description}</p>
                        <div className="flex gap-1">
                          <Badge variant="outline" className="text-xs">
                            Cost: {toolInfo.cost}
                          </Badge>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Example: {toolInfo.example}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissEducation(index)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Game Over */}
          {gameWon && (
            <div className="text-center mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <h3 className="text-lg font-bold text-green-800 mb-2">🏆 BINGO!</h3>
              <p className="text-green-700 mb-2">
                Congratulations! You've mastered nonprofit AI solutions!
              </p>
              <p className="text-sm text-green-600">Final Score: {score} points</p>
            </div>
          )}

          {/* Instructions */}
          {!gameActive && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">How to Play:</h4>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click "Start Game" to begin with a randomized bingo card</li>
                <li>2. Read each nonprofit challenge scenario</li>
                <li>3. Wait for hints after 5 seconds if you need help</li>
                <li>4. Click the AI tool on your card that best solves the challenge</li>
                <li>5. Earn points for correct matches (bonus for speed!)</li>
                <li>6. Get 5 correct tools in a row to win BINGO!</li>
                <li>7. Learn about each AI tool's implementation and costs</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
