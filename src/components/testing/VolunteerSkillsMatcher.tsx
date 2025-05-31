
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Target, 
  Sparkles, 
  Loader2, 
  RotateCcw, 
  Brain, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';

interface Volunteer {
  id: number;
  name: string;
  skills: string[];
  availability: string;
  experience: string;
  preferences: string;
}

interface Task {
  id: number;
  title: string;
  requirements: string[];
  timeCommitment: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
}

interface Match {
  volunteerId: number;
  taskId: number;
  confidence: number;
}

interface AIAnalysis {
  overallScore: number;
  feedback: string;
  suggestions: string[];
  bestMatches: Match[];
}

export const VolunteerSkillsMatcher = () => {
  const [organizationType, setOrganizationType] = useState('');
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userMatches, setUserMatches] = useState<{[taskId: number]: number}>({});
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [generatingData, setGeneratingData] = useState(false);
  const [analyzingMatches, setAnalyzingMatches] = useState(false);
  const { callAI, loading } = useAITestingAssistant();

  const generateVolunteersAndTasks = async () => {
    if (!organizationType.trim()) {
      alert('Please enter your organization type first');
      return;
    }

    setGeneratingData(true);
    try {
      // Generate volunteers
      const volunteerPrompt = `Generate 4 realistic volunteer profiles for a ${organizationType} nonprofit. 
      Return ONLY a JSON array with this exact structure:
      [
        {
          "id": 1,
          "name": "FirstName LastName",
          "skills": ["skill1", "skill2", "skill3"],
          "availability": "availability description",
          "experience": "experience level",
          "preferences": "what they prefer to do"
        }
      ]
      Make skills diverse and realistic. Include both hard and soft skills. Vary experience levels.`;

      const volunteerResult = await callAI('tool_recommendation', volunteerPrompt);
      
      // Generate tasks
      const taskPrompt = `Generate 4 realistic volunteer tasks for a ${organizationType} nonprofit. 
      Return ONLY a JSON array with this exact structure:
      [
        {
          "id": 1,
          "title": "Task Title",
          "requirements": ["requirement1", "requirement2"],
          "timeCommitment": "time description",
          "priority": "High|Medium|Low",
          "description": "brief description of the task"
        }
      ]
      Make requirements specific and varied. Include different priority levels.`;

      const taskResult = await callAI('tool_recommendation', taskPrompt);

      // Parse the JSON responses
      try {
        const volunteersData = JSON.parse(volunteerResult.replace(/```json\n?/g, '').replace(/```/g, ''));
        const tasksData = JSON.parse(taskResult.replace(/```json\n?/g, '').replace(/```/g, ''));
        
        setVolunteers(volunteersData);
        setTasks(tasksData);
        setUserMatches({});
        setAiAnalysis(null);
        setShowAnalysis(false);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        alert('Error generating data. Please try again.');
      }
    } catch (error) {
      console.error('Error generating volunteers and tasks:', error);
      alert('Error generating data. Please try again.');
    } finally {
      setGeneratingData(false);
    }
  };

  const makeMatch = (taskId: number, volunteerId: number) => {
    setUserMatches(prev => ({
      ...prev,
      [taskId]: volunteerId
    }));
  };

  const analyzeMatches = async () => {
    if (Object.keys(userMatches).length < tasks.length) {
      alert('Please match all tasks with volunteers before getting analysis');
      return;
    }

    setAnalyzingMatches(true);
    try {
      const analysisPrompt = `Analyze volunteer-task matches for a ${organizationType} nonprofit.

VOLUNTEERS:
${volunteers.map(v => `ID ${v.id}: ${v.name} - Skills: ${v.skills.join(', ')} - Availability: ${v.availability} - Experience: ${v.experience}`).join('\n')}

TASKS:
${tasks.map(t => `ID ${t.id}: ${t.title} - Requirements: ${t.requirements.join(', ')} - Priority: ${t.priority} - Time: ${t.timeCommitment}`).join('\n')}

USER MATCHES:
${Object.entries(userMatches).map(([taskId, volunteerId]) => {
  const task = tasks.find(t => t.id === parseInt(taskId));
  const volunteer = volunteers.find(v => v.id === volunteerId);
  return `Task "${task?.title}" -> Volunteer "${volunteer?.name}"`;
}).join('\n')}

Provide analysis as JSON:
{
  "overallScore": 85,
  "feedback": "Overall assessment of matching quality",
  "suggestions": ["specific improvement suggestion 1", "suggestion 2"],
  "bestMatches": [{"volunteerId": 1, "taskId": 2, "confidence": 95}]
}

Focus on skill alignment, availability fit, experience level appropriateness, and task priority consideration.`;

      const analysisResult = await callAI('readiness_assessment', analysisPrompt);
      
      try {
        const analysis = JSON.parse(analysisResult.replace(/```json\n?/g, '').replace(/```/g, ''));
        setAiAnalysis(analysis);
        setShowAnalysis(true);
      } catch (parseError) {
        console.error('Error parsing analysis:', parseError);
        alert('Error analyzing matches. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing matches:', error);
      alert('Error analyzing matches. Please try again.');
    } finally {
      setAnalyzingMatches(false);
    }
  };

  const reset = () => {
    setUserMatches({});
    setAiAnalysis(null);
    setShowAnalysis(false);
  };

  const getVolunteerById = (id: number) => volunteers.find(v => v.id === id);
  const getTaskById = (id: number) => tasks.find(t => t.id === id);
  
  const getMatchQuality = (taskId: number, volunteerId: number) => {
    if (!aiAnalysis) return null;
    const bestMatch = aiAnalysis.bestMatches.find(m => 
      m.taskId === taskId && m.volunteerId === volunteerId
    );
    return bestMatch?.confidence || null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" />
          AI Volunteer Skills Matcher
        </h3>
        <p className="text-sm text-gray-600">Smart volunteer allocation powered by AI</p>
      </div>

      {/* Organization Input */}
      <Card className="border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-600" />
            Organization Context
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="e.g., Food Bank, Animal Shelter, Youth Education..."
            value={organizationType}
            onChange={(e) => setOrganizationType(e.target.value)}
            className="text-sm"
          />
          <Button
            onClick={generateVolunteersAndTasks}
            disabled={generatingData || !organizationType.trim()}
            size="sm"
            className="w-full"
          >
            {generatingData ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Generating AI Scenarios...
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 mr-2" />
                Generate AI-Powered Scenarios
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {volunteers.length > 0 && tasks.length > 0 && (
        <>
          {/* Volunteers Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <h4 className="text-sm font-medium text-blue-700">Available Volunteers</h4>
              <Badge variant="outline" className="text-xs">{volunteers.length} profiles</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {volunteers.map(volunteer => (
                <Card key={volunteer.id} className="border-blue-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{volunteer.name}</span>
                        <Badge variant="secondary" className="text-xs">ID {volunteer.id}</Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.skills.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs px-2 py-0">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">📅 {volunteer.availability}</p>
                        <p className="text-xs text-gray-600">🎯 {volunteer.experience}</p>
                        <p className="text-xs text-gray-500">{volunteer.preferences}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              <h4 className="text-sm font-medium text-green-700">Tasks Needing Volunteers</h4>
              <Badge variant="outline" className="text-xs">{tasks.length} tasks</Badge>
            </div>
            <div className="space-y-3">
              {tasks.map(task => {
                const matchedVolunteer = getVolunteerById(userMatches[task.id]);
                const isMatched = !!matchedVolunteer;
                const matchQuality = getMatchQuality(task.id, userMatches[task.id]);
                
                return (
                  <Card key={task.id} className={`border-green-200 ${isMatched ? 'bg-green-50' : ''} transition-colors`}>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{task.title}</span>
                              <Badge 
                                className={`text-xs ${
                                  task.priority === 'High' ? 'bg-red-100 text-red-700' :
                                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {task.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {task.requirements.map(req => (
                                <Badge key={req} variant="secondary" className="text-xs px-2 py-0">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">⏱️ {task.timeCommitment}</p>
                          </div>
                          
                          {showAnalysis && matchQuality && (
                            <div className="flex items-center gap-1">
                              {matchQuality >= 80 ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-orange-600" />
                              )}
                              <span className="text-xs font-medium">{matchQuality}%</span>
                            </div>
                          )}
                        </div>
                        
                        {!showAnalysis && (
                          <div className="flex flex-wrap gap-1">
                            {volunteers.map(volunteer => (
                              <Button
                                key={volunteer.id}
                                onClick={() => makeMatch(task.id, volunteer.id)}
                                size="sm"
                                variant={userMatches[task.id] === volunteer.id ? "default" : "outline"}
                                className="text-xs h-7"
                              >
                                {volunteer.name}
                              </Button>
                            ))}
                          </div>
                        )}
                        
                        {isMatched && (
                          <div className="flex items-center gap-2 p-2 bg-white rounded border">
                            <Users className="w-3 h-3 text-blue-600" />
                            <span className="text-xs">
                              <span className="font-medium">Matched with:</span> {matchedVolunteer.name}
                            </span>
                            {matchQuality && (
                              <Badge variant="outline" className="text-xs">
                                {matchQuality}% match
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button 
              onClick={analyzeMatches} 
              disabled={Object.keys(userMatches).length < tasks.length || analyzingMatches || showAnalysis}
              size="sm"
              className="flex-1"
            >
              {analyzingMatches ? (
                <>
                  <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  AI Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="w-3 h-3 mr-2" />
                  Get AI Analysis
                </>
              )}
            </Button>
            <Button onClick={reset} variant="outline" size="sm">
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          {/* AI Analysis Results */}
          {showAnalysis && aiAnalysis && (
            <Card className="border-purple-200 bg-purple-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  AI Performance Analysis
                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                    Score: {aiAnalysis.overallScore}%
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded border">
                  <p className="text-sm text-gray-700">{aiAnalysis.feedback}</p>
                </div>
                
                {aiAnalysis.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-gray-700">AI Suggestions:</span>
                    </div>
                    <div className="space-y-1">
                      {aiAnalysis.suggestions.map((suggestion, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-white rounded border">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></div>
                          <p className="text-xs text-gray-600">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {volunteers.length === 0 && (
        <Card className="border-gray-200">
          <CardContent className="p-8 text-center">
            <Sparkles className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-3">
              Enter your organization type above and generate AI-powered volunteer scenarios
            </p>
            <p className="text-xs text-gray-500">
              AI will create realistic volunteers and tasks specific to your nonprofit's context
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
