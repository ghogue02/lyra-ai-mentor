import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Users, Target, MapPin, Heart, BarChart, Gamepad2, 
  Timer, CheckCircle, ArrowRight, Shuffle, Star,
  DollarSign, Clock, TrendingUp, Award, RefreshCw, Trophy
} from 'lucide-react';

// Element 12 - Donor Segmentation Simulator
export const DonorSegmentationSimulator = () => {
  const [currentDonor, setCurrentDonor] = useState(0);
  const [assignments, setAssignments] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const donors = [
    {
      id: 1,
      name: "Sarah Chen",
      age: 45,
      givingPattern: "$500 monthly for 3 years",
      interests: "Education, Youth Programs",
      engagement: "Attends events, volunteers occasionally",
      correctSegment: "Major Donor"
    },
    {
      id: 2,
      name: "Mike Rodriguez",
      age: 28,
      givingPattern: "$25 one-time donation last year",
      interests: "Environmental causes",
      engagement: "Email subscriber only",
      correctSegment: "Lapsed Donor"
    },
    {
      id: 3,
      name: "Janet Thompson",
      age: 62,
      givingPattern: "$50 quarterly donations",
      interests: "Senior services, Health",
      engagement: "Regular newsletter reader",
      correctSegment: "Regular Giver"
    },
    {
      id: 4,
      name: "Alex Kim",
      age: 34,
      givingPattern: "No previous donations",
      interests: "Technology, Innovation",
      engagement: "Recently signed up for updates",
      correctSegment: "New Prospect"
    }
  ];

  const segments = ["Major Donor", "Regular Giver", "Lapsed Donor", "New Prospect"];

  const handleAssignment = (donorId: number, segment: string) => {
    setAssignments(prev => ({ ...prev, [donorId]: segment }));
  };

  const checkResults = () => {
    let correctCount = 0;
    donors.forEach(donor => {
      if (assignments[donor.id] === donor.correctSegment) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const reset = () => {
    setCurrentDonor(0);
    setAssignments({});
    setShowResults(false);
    setScore(0);
  };

  const allAssigned = donors.every(donor => assignments[donor.id]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Donor Segmentation Simulator</h3>
        <p className="text-sm text-gray-600">Categorize donors to optimize outreach strategies</p>
      </div>

      <div className="space-y-3">
        {donors.map(donor => (
          <Card key={donor.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-sm">{donor.name}, {donor.age}</h4>
                  <p className="text-xs text-gray-600">Giving: {donor.givingPattern}</p>
                  <p className="text-xs text-gray-600">Interests: {donor.interests}</p>
                  <p className="text-xs text-gray-600">Engagement: {donor.engagement}</p>
                </div>
                {assignments[donor.id] && (
                  <Badge className={`text-xs ${
                    showResults 
                      ? assignments[donor.id] === donor.correctSegment 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {assignments[donor.id]}
                  </Badge>
                )}
              </div>
              
              {!showResults && (
                <div className="flex flex-wrap gap-1">
                  {segments.map(segment => (
                    <Button
                      key={segment}
                      onClick={() => handleAssignment(donor.id, segment)}
                      variant={assignments[donor.id] === segment ? "default" : "outline"}
                      size="sm"
                      className="text-xs h-6"
                    >
                      {segment}
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={checkResults} 
          disabled={!allAssigned || showResults}
          size="sm"
        >
          <Target className="w-3 h-3 mr-1" />
          Check Segmentation
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <RefreshCw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {showResults && (
        <Card className="border border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Score: {score}/{donors.length}</span>
            </div>
            <p className="text-xs text-blue-700">
              {score >= 3 ? "Excellent segmentation! You understand donor categories." : "Good try! Consider engagement levels and giving patterns."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Element 13 - Volunteer Coordination Game
export const VolunteerCoordinationGame = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [assignments, setAssignments] = useState<{[key: string]: string}>({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const tasks = [
    { id: "kitchen", name: "Kitchen Prep", skill: "Cooking", urgency: "High" },
    { id: "setup", name: "Event Setup", skill: "Manual Labor", urgency: "Medium" },
    { id: "registration", name: "Registration Desk", skill: "Communication", urgency: "High" },
    { id: "cleanup", name: "Cleanup Crew", skill: "Manual Labor", urgency: "Low" }
  ];

  const volunteers = [
    { id: "maria", name: "Maria", skills: ["Cooking", "Communication"], availability: "Full Day" },
    { id: "john", name: "John", skills: ["Manual Labor", "Driving"], availability: "Morning" },
    { id: "sarah", name: "Sarah", skills: ["Communication", "Organization"], availability: "Full Day" },
    { id: "mike", name: "Mike", skills: ["Manual Labor", "Cooking"], availability: "Afternoon" }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setIsActive(false);
      calculateScore();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startGame = () => {
    setIsActive(true);
    setGameOver(false);
    setTimeLeft(60);
    setAssignments({});
    setScore(0);
  };

  const assignVolunteer = (taskId: string, volunteerId: string) => {
    if (!isActive) return;
    setAssignments(prev => ({ ...prev, [taskId]: volunteerId }));
  };

  const calculateScore = () => {
    let points = 0;
    Object.entries(assignments).forEach(([taskId, volunteerId]) => {
      const task = tasks.find(t => t.id === taskId);
      const volunteer = volunteers.find(v => v.id === volunteerId);
      if (task && volunteer && volunteer.skills.includes(task.skill)) {
        points += task.urgency === "High" ? 3 : task.urgency === "Medium" ? 2 : 1;
      }
    });
    setScore(points);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Volunteer Coordination Game</h3>
        <p className="text-sm text-gray-600">Match volunteers to tasks quickly and efficiently</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium">Time: {timeLeft}s</span>
        </div>
        <Badge variant="outline">Score: {score}</Badge>
      </div>

      {!isActive && !gameOver && (
        <Button onClick={startGame} className="w-full">
          <Timer className="w-3 h-3 mr-1" />
          Start Coordination Challenge
        </Button>
      )}

      {isActive && (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Urgent Tasks:</h4>
            {tasks.map(task => (
              <Card key={task.id} className="border border-gray-200 mb-2">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{task.name}</span>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">{task.skill}</Badge>
                        <Badge className={`text-xs ${
                          task.urgency === "High" ? "bg-red-100 text-red-700" :
                          task.urgency === "Medium" ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {task.urgency}
                        </Badge>
                      </div>
                    </div>
                    {assignments[task.id] && (
                      <Badge className="bg-blue-100 text-blue-700">
                        {volunteers.find(v => v.id === assignments[task.id])?.name}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Available Volunteers:</h4>
            <div className="flex flex-wrap gap-2">
              {volunteers.map(volunteer => (
                <Button
                  key={volunteer.id}
                  onClick={() => {
                    // Find unassigned high priority task first
                    const unassignedTask = tasks.find(task => 
                      !assignments[task.id] && volunteer.skills.includes(task.skill)
                    );
                    if (unassignedTask) {
                      assignVolunteer(unassignedTask.id, volunteer.id);
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  disabled={Object.values(assignments).includes(volunteer.id)}
                >
                  {volunteer.name}
                  <div className="text-xs text-gray-500 ml-1">
                    ({volunteer.skills.join(", ")})
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameOver && (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">Coordination Complete!</h4>
              <p className="text-sm text-gray-600 mb-2">
                Final Score: {score} points
              </p>
              <p className="text-xs text-gray-500">
                {score >= 8 ? "Excellent coordination!" : 
                 score >= 5 ? "Good job managing volunteers!" : 
                 "Keep practicing coordination skills!"}
              </p>
              <Button onClick={startGame} size="sm" className="mt-3">
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Element 14 - Food Rescue Route Optimizer
export const FoodRescueRouteOptimizer = () => {
  const [selectedRoute, setSelectedRoute] = useState<string[]>([]);
  const [efficiency, setEfficiency] = useState(0);
  const [optimized, setOptimized] = useState(false);

  const locations = [
    { id: "base", name: "Food Bank HQ", type: "base", urgency: 0, distance: 0 },
    { id: "rest1", name: "Mario's Pizza", type: "pickup", urgency: 3, distance: 2.1 },
    { id: "rest2", name: "Green Grocery", type: "pickup", urgency: 1, distance: 1.5 },
    { id: "rest3", name: "Campus Cafeteria", type: "pickup", urgency: 2, distance: 3.2 },
    { id: "shelter", name: "City Shelter", type: "delivery", urgency: 3, distance: 2.8 }
  ];

  const optimalRoute = ["base", "rest2", "rest1", "rest3", "shelter"];

  const addToRoute = (locationId: string) => {
    if (!selectedRoute.includes(locationId)) {
      setSelectedRoute(prev => [...prev, locationId]);
    }
  };

  const removeFromRoute = (locationId: string) => {
    setSelectedRoute(prev => prev.filter(id => id !== locationId));
  };

  const calculateEfficiency = () => {
    let score = 0;
    let totalDistance = 0;
    
    for (let i = 0; i < selectedRoute.length - 1; i++) {
      const current = locations.find(l => l.id === selectedRoute[i]);
      const next = locations.find(l => l.id === selectedRoute[i + 1]);
      if (current && next) {
        totalDistance += Math.abs(current.distance - next.distance);
      }
    }

    // Score based on route similarity to optimal and urgency handling
    const routeScore = selectedRoute.length >= 4 ? 50 : 0;
    const urgencyScore = selectedRoute.includes("rest1") && selectedRoute.includes("shelter") ? 30 : 0;
    const efficiencyScore = totalDistance < 8 ? 20 : 0;
    
    score = routeScore + urgencyScore + efficiencyScore;
    setEfficiency(score);
    setOptimized(true);
  };

  const reset = () => {
    setSelectedRoute([]);
    setEfficiency(0);
    setOptimized(false);
  };

  const showOptimal = () => {
    setSelectedRoute(optimalRoute);
    setEfficiency(100);
    setOptimized(true);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Food Rescue Route Optimizer</h3>
        <p className="text-sm text-gray-600">Plan the most efficient pickup and delivery route</p>
      </div>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium mb-2">Available Locations:</h4>
          <div className="space-y-2">
            {locations.map(location => (
              <Card key={location.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-medium">{location.name}</span>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {location.type}
                        </Badge>
                        {location.urgency > 0 && (
                          <Badge className={`text-xs ${
                            location.urgency === 3 ? "bg-red-100 text-red-700" :
                            location.urgency === 2 ? "bg-orange-100 text-orange-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            Urgency: {location.urgency}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {location.distance} mi
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {selectedRoute.includes(location.id) ? (
                        <Button
                          onClick={() => removeFromRoute(location.id)}
                          variant="default"
                          size="sm"
                          className="text-xs h-6"
                        >
                          #{selectedRoute.indexOf(location.id) + 1}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => addToRoute(location.id)}
                          variant="outline"
                          size="sm"
                          className="text-xs h-6"
                        >
                          Add to Route
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {selectedRoute.length > 0 && (
          <Card className="border border-blue-200">
            <CardContent className="p-3">
              <h4 className="text-sm font-medium mb-2">Your Route:</h4>
              <div className="flex items-center gap-1 flex-wrap">
                {selectedRoute.map((locationId, index) => {
                  const location = locations.find(l => l.id === locationId);
                  return (
                    <React.Fragment key={locationId}>
                      <Badge className="bg-blue-100 text-blue-700 text-xs">
                        {location?.name}
                      </Badge>
                      {index < selectedRoute.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={calculateEfficiency} 
          disabled={selectedRoute.length < 3 || optimized}
          size="sm"
        >
          <BarChart className="w-3 h-3 mr-1" />
          Optimize Route
        </Button>
        <Button onClick={showOptimal} variant="outline" size="sm">
          <Star className="w-3 h-3 mr-1" />
          Show Optimal
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <RefreshCw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {optimized && (
        <Card className="border border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Route Efficiency: {efficiency}%</span>
            </div>
            <p className="text-xs text-green-700">
              {efficiency >= 90 ? "Excellent route optimization!" :
               efficiency >= 70 ? "Good route planning!" :
               "Consider prioritizing urgent pickups and minimizing distance."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Element 15 - Mentor Matching Simulator
export const MentorMatchingSimulator = () => {
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const mentors = [
    { id: "sarah", name: "Sarah Wilson", skills: ["Technology", "Career Development"], schedule: "Weekends", personality: "Patient" },
    { id: "james", name: "James Chen", skills: ["Arts", "Creative Writing"], schedule: "Evenings", personality: "Creative" },
    { id: "maria", name: "Maria Lopez", skills: ["Business", "Leadership"], schedule: "Flexible", personality: "Motivating" },
    { id: "david", name: "David Kim", skills: ["Technology", "Gaming"], schedule: "Afternoons", personality: "Fun" }
  ];

  const mentees = [
    { id: "alex", name: "Alex (16)", interests: ["Coding", "Video Games"], needs: "Technical skills", personality: "Shy", optimalMentor: "david" },
    { id: "zoe", name: "Zoe (15)", interests: ["Writing", "Poetry"], needs: "Creative guidance", personality: "Expressive", optimalMentor: "james" },
    { id: "marcus", name: "Marcus (17)", interests: ["Business", "Sports"], needs: "Leadership skills", personality: "Outgoing", optimalMentor: "maria" },
    { id: "emma", name: "Emma (16)", interests: ["Programming", "Science"], needs: "Career planning", personality: "Focused", optimalMentor: "sarah" }
  ];

  const createMatch = (menteeId: string, mentorId: string) => {
    setMatches(prev => ({ ...prev, [menteeId]: mentorId }));
  };

  const removeMatch = (menteeId: string) => {
    setMatches(prev => {
      const newMatches = { ...prev };
      delete newMatches[menteeId];
      return newMatches;
    });
  };

  const checkMatches = () => {
    let correctMatches = 0;
    mentees.forEach(mentee => {
      if (matches[mentee.id] === mentee.optimalMentor) {
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

  const allMatched = mentees.every(mentee => matches[mentee.id]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Mentor Matching Simulator</h3>
        <p className="text-sm text-gray-600">Match mentors with mentees based on compatibility</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Mentees:</h4>
          {mentees.map(mentee => (
            <Card key={mentee.id} className="border border-gray-200 mb-2">
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-sm font-medium">{mentee.name}</span>
                    <p className="text-xs text-gray-600">Interests: {mentee.interests.join(", ")}</p>
                    <p className="text-xs text-gray-600">Needs: {mentee.needs}</p>
                    <p className="text-xs text-gray-600">Personality: {mentee.personality}</p>
                  </div>
                  {matches[mentee.id] && (
                    <Badge className={`text-xs ${
                      showResults
                        ? matches[mentee.id] === mentee.optimalMentor
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {mentors.find(m => m.id === matches[mentee.id])?.name.split(' ')[0]}
                    </Badge>
                  )}
                </div>
                {!showResults && (
                  <div className="mt-2">
                    {matches[mentee.id] ? (
                      <Button
                        onClick={() => removeMatch(mentee.id)}
                        variant="outline"
                        size="sm"
                        className="text-xs h-6"
                      >
                        Change Match
                      </Button>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {mentors.filter(mentor => !Object.values(matches).includes(mentor.id)).map(mentor => (
                          <Button
                            key={mentor.id}
                            onClick={() => createMatch(mentee.id, mentor.id)}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6"
                          >
                            {mentor.name.split(' ')[0]}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Available Mentors:</h4>
          {mentors.map(mentor => (
            <Card key={mentor.id} className={`border mb-2 ${
              Object.values(matches).includes(mentor.id) 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-200'
            }`}>
              <CardContent className="p-3">
                <span className="text-sm font-medium">{mentor.name}</span>
                <p className="text-xs text-gray-600">Skills: {mentor.skills.join(", ")}</p>
                <p className="text-xs text-gray-600">Available: {mentor.schedule}</p>
                <p className="text-xs text-gray-600">Style: {mentor.personality}</p>
                {Object.values(matches).includes(mentor.id) && (
                  <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">
                    Matched
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={checkMatches} 
          disabled={!allMatched || showResults}
          size="sm"
        >
          <Heart className="w-3 h-3 mr-1" />
          Check Matches
        </Button>
        <Button onClick={reset} variant="outline" size="sm">
          <RefreshCw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>

      {showResults && (
        <Card className="border border-green-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium">Compatibility Score: {score}/{mentees.length}</span>
            </div>
            <p className="text-xs text-green-700">
              {score >= 3 ? "Excellent matching! Great mentor-mentee compatibility." :
               score >= 2 ? "Good matches! Consider interests and personalities." :
               "Keep practicing! Focus on matching skills with needs."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Element 16 - AI Before/After Slider
export const AIBeforeAfterSlider = () => {
  const [selectedScenario, setSelectedScenario] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);

  const scenarios = [
    {
      title: "Volunteer Coordination",
      before: {
        timeSpent: "20 hours/week",
        efficiency: "60%",
        volunteers: "50 active",
        satisfaction: "75%"
      },
      after: {
        timeSpent: "5 hours/week",
        efficiency: "90%",
        volunteers: "120 active",
        satisfaction: "95%"
      }
    },
    {
      title: "Donor Outreach",
      before: {
        responseRate: "5%",
        timePerCampaign: "40 hours",
        personalization: "20%",
        donations: "$50K/year"
      },
      after: {
        responseRate: "15%",
        timePerCampaign: "12 hours",
        personalization: "85%",
        donations: "$120K/year"
      }
    },
    {
      title: "Program Management",
      before: {
        beneficiariesServed: "200/month",
        adminTime: "30 hours/week",
        dataAccuracy: "70%",
        reportingTime: "8 hours/week"
      },
      after: {
        beneficiariesServed: "450/month",
        adminTime: "10 hours/week",
        dataAccuracy: "95%",
        reportingTime: "2 hours/week"
      }
    }
  ];

  const interpolateValue = (before: string, after: string, ratio: number) => {
    const beforeNum = parseFloat(before.replace(/[^0-9.]/g, ''));
    const afterNum = parseFloat(after.replace(/[^0-9.]/g, ''));
    const interpolated = beforeNum + (afterNum - beforeNum) * ratio;
    
    if (before.includes('%')) return `${Math.round(interpolated)}%`;
    if (before.includes('K')) return `$${Math.round(interpolated)}K`;
    if (before.includes('hours')) return `${Math.round(interpolated)} hours`;
    return Math.round(interpolated).toString();
  };

  const current = scenarios[selectedScenario];
  const ratio = sliderValue / 100;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Before/After Comparison</h3>
        <p className="text-sm text-gray-600">See the impact of AI on nonprofit operations</p>
      </div>

      <div className="flex gap-1">
        {scenarios.map((scenario, index) => (
          <Button
            key={index}
            onClick={() => {
              setSelectedScenario(index);
              setSliderValue(0);
            }}
            variant={selectedScenario === index ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {scenario.title}
          </Button>
        ))}
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-red-100 text-red-700">Before AI</Badge>
            <Badge className="bg-green-100 text-green-700">After AI</Badge>
          </div>
          
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="100"
              value={sliderValue}
              onChange={(e) => setSliderValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Before</span>
              <span>{sliderValue}% AI Implementation</span>
              <span>After</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(current.before).map(([key, beforeValue]) => {
              const afterValue = current.after[key as keyof typeof current.after];
              const currentValue = interpolateValue(beforeValue, afterValue, ratio);
              
              return (
                <div key={key} className="text-center">
                  <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-lg font-bold text-blue-600">{currentValue}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-blue-200">
        <CardContent className="p-3">
          <p className="text-sm text-blue-700">
            <strong>Impact Summary:</strong> {
              ratio === 0 ? "Traditional manual processes in place." :
              ratio < 0.5 ? "Early AI adoption showing initial improvements." :
              ratio < 0.8 ? "Significant AI integration delivering measurable results." :
              "Full AI implementation maximizing organizational efficiency."
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Element 17 - Nonprofit AI Bingo
export const NonprofitAIBingo = () => {
  const [markedSquares, setMarkedSquares] = useState<Set<string>>(new Set());
  const [currentBoard, setCurrentBoard] = useState(0);
  const [hasBingo, setHasBingo] = useState(false);

  const bingoSquares = [
    "Email Automation", "Donor Prediction", "Volunteer Matching", "Route Optimization", "Data Analysis",
    "Chatbot Support", "Image Recognition", "Sentiment Analysis", "Fraud Detection", "Content Creation",
    "Translation Services", "Scheduling AI", "Budget Forecasting", "Impact Measurement", "Social Media AI",
    "Voice Recognition", "Document Processing", "Grant Writing AI", "Inventory Management", "Recruitment AI",
    "Event Planning AI", "Survey Analysis", "Compliance Checking", "Performance Tracking", "Communication AI"
  ];

  const boards = [
    bingoSquares.slice(0, 25),
    [...bingoSquares.slice(10, 25), ...bingoSquares.slice(0, 10)],
    bingoSquares.slice().sort(() => Math.random() - 0.5).slice(0, 25)
  ];

  const toggleSquare = (square: string) => {
    const newMarked = new Set(markedSquares);
    if (newMarked.has(square)) {
      newMarked.delete(square);
    } else {
      newMarked.add(square);
    }
    setMarkedSquares(newMarked);
    checkBingo(newMarked);
  };

  const checkBingo = (marked: Set<string>) => {
    const board = boards[currentBoard];
    
    // Check rows
    for (let row = 0; row < 5; row++) {
      if (board.slice(row * 5, (row + 1) * 5).every(square => marked.has(square))) {
        setHasBingo(true);
        return;
      }
    }
    
    // Check columns
    for (let col = 0; col < 5; col++) {
      if (board.filter((_, index) => index % 5 === col).every(square => marked.has(square))) {
        setHasBingo(true);
        return;
      }
    }
    
    // Check diagonals
    const diagonal1 = [0, 6, 12, 18, 24].map(i => board[i]);
    const diagonal2 = [4, 8, 12, 16, 20].map(i => board[i]);
    
    if (diagonal1.every(square => marked.has(square)) || diagonal2.every(square => marked.has(square))) {
      setHasBingo(true);
      return;
    }
    
    setHasBingo(false);
  };

  const newGame = () => {
    setMarkedSquares(new Set());
    setCurrentBoard((prev) => (prev + 1) % boards.length);
    setHasBingo(false);
  };

  const currentBoardSquares = boards[currentBoard];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Nonprofit AI Bingo</h3>
        <p className="text-sm text-gray-600">Mark AI tools your organization could use</p>
      </div>

      <div className="grid grid-cols-5 gap-1">
        {currentBoardSquares.map((square, index) => (
          <Button
            key={`${currentBoard}-${index}`}
            onClick={() => toggleSquare(square)}
            variant={markedSquares.has(square) ? "default" : "outline"}
            className="h-12 text-xs p-1 flex items-center justify-center"
            size="sm"
          >
            <span className="text-center leading-tight">{square}</span>
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Badge variant="outline">
          Marked: {markedSquares.size}/25
        </Badge>
        <Button onClick={newGame} variant="outline" size="sm">
          <Shuffle className="w-3 h-3 mr-1" />
          New Board
        </Button>
      </div>

      {hasBingo && (
        <Card className="border border-yellow-200">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <h4 className="font-bold text-yellow-800">BINGO!</h4>
            <p className="text-sm text-yellow-700">
              Great job exploring AI tools for nonprofits!
            </p>
            <Button onClick={newGame} size="sm" className="mt-2">
              Play Again
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="border border-blue-200">
        <CardContent className="p-3">
          <p className="text-xs text-blue-700">
            <strong>Game Tip:</strong> Click on AI tools that could benefit your nonprofit. 
            Get 5 in a row (horizontal, vertical, or diagonal) to win!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
