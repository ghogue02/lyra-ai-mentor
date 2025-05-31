
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, RotateCcw } from 'lucide-react';

const volunteers = [
  { id: 1, name: "Alex", skills: ["Spanish", "Teaching", "Event Planning"], availability: "Weekends" },
  { id: 2, name: "Jordan", skills: ["Cooking", "Food Safety", "Team Leadership"], availability: "Evenings" },
  { id: 3, name: "Sam", skills: ["Accounting", "Excel", "Grant Writing"], availability: "Flexible" },
  { id: 4, name: "Casey", skills: ["Social Media", "Photography", "Design"], availability: "Mornings" }
];

const tasks = [
  { id: 1, title: "Tutor ESL Students", requirements: ["Spanish", "Teaching"], time: "Saturday mornings" },
  { id: 2, title: "Prepare Community Meals", requirements: ["Cooking", "Food Safety"], time: "Weekday evenings" },
  { id: 3, title: "Financial Report Prep", requirements: ["Accounting", "Excel"], time: "Flexible schedule" },
  { id: 4, title: "Social Media Campaign", requirements: ["Social Media", "Photography"], time: "Morning shifts" }
];

export const VolunteerSkillsMatcher = () => {
  const [matches, setMatches] = useState<{[key: number]: number}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const makeMatch = (taskId: number, volunteerId: number) => {
    setMatches(prev => ({
      ...prev,
      [taskId]: volunteerId
    }));
  };

  const checkMatches = () => {
    let correctMatches = 0;
    // Perfect matches based on skills and availability
    const correctAnswers = {
      1: 1, // ESL tutoring -> Alex (Spanish + Teaching)
      2: 2, // Cooking -> Jordan (Cooking + Food Safety)
      3: 3, // Financial -> Sam (Accounting + Excel)
      4: 4  // Social Media -> Casey (Social Media + Photography)
    };

    Object.entries(matches).forEach(([taskId, volunteerId]) => {
      if (correctAnswers[parseInt(taskId)] === volunteerId) {
        correctMatches++;
      }
    });

    setScore(correctMatches);
    setShowResults(true);
  };

  const reset = () => {
    setMatches({});
    setShowResults(false);
    setScore(0);
  };

  const getVolunteerById = (id: number) => volunteers.find(v => v.id === id);
  const isOptimalMatch = (taskId: number, volunteerId: number) => {
    const task = tasks.find(t => t.id === taskId);
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!task || !volunteer) return false;
    
    return task.requirements.every(req => volunteer.skills.includes(req));
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Match Volunteers to Tasks</h3>
        <p className="text-sm text-gray-600">Like Maria, use AI to match skills with needs</p>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-blue-600">Volunteers</h4>
            {volunteers.map(volunteer => (
              <Card key={volunteer.id} className="p-2 border border-blue-200">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{volunteer.name}</span>
                    <Users className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {volunteer.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-xs px-1 py-0">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">{volunteer.availability}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-600">Tasks</h4>
            {tasks.map(task => {
              const matchedVolunteer = getVolunteerById(matches[task.id]);
              const isMatched = !!matchedVolunteer;
              const isOptimal = isMatched && isOptimalMatch(task.id, matches[task.id]);
              
              return (
                <Card key={task.id} className={`p-2 border ${isMatched ? 'border-green-200 bg-green-50' : 'border-green-200'}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium">{task.title}</span>
                      {isOptimal && <CheckCircle className="w-3 h-3 text-green-600" />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {task.requirements.map(req => (
                          <Badge key={req} variant="secondary" className="text-xs px-1 py-0">
                            {req}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                    
                    {!showResults && (
                      <div className="flex flex-wrap gap-1">
                        {volunteers.map(volunteer => (
                          <Button
                            key={volunteer.id}
                            onClick={() => makeMatch(task.id, volunteer.id)}
                            size="sm"
                            variant={matches[task.id] === volunteer.id ? "default" : "outline"}
                            className="text-xs h-6"
                          >
                            {volunteer.name}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {isMatched && (
                      <div className="text-xs">
                        <span className="font-medium">Matched with: </span>
                        <span className={isOptimal ? "text-green-600" : "text-orange-600"}>
                          {matchedVolunteer?.name}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={checkMatches} 
          size="sm" 
          disabled={Object.keys(matches).length < tasks.length || showResults}
        >
          Check Matches
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {showResults && (
        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
          <p className="text-sm font-medium text-purple-800">
            Optimal Matches: {score}/{tasks.length}
          </p>
          <p className="text-xs text-purple-600 mt-1">
            {score === tasks.length ? 
              "Perfect matching! You understand how AI considers multiple factors." : 
              "Good effort! AI matches skills, availability, and task requirements together."
            }
          </p>
        </div>
      )}
    </div>
  );
};
