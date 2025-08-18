import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Shield, Heart, TrendingUp, Award, Copy, Download } from 'lucide-react';

const CarmenRetentionMastery: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<'intro' | 'workshop' | 'results'>('intro');
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePhaseComplete = (phase: string) => {
    if (phase === 'intro') {
      setCurrentPhase('workshop');
    } else if (phase === 'workshop') {
      setCurrentPhase('results');
    } else if (phase === 'results') {
      setIsCompleted(true);
      toast({
        title: "🎉 Retention Mastery Complete!",
        description: "You've mastered Carmen's advanced retention strategies that honor both data and humanity.",
      });
      setTimeout(() => navigate('/chapter/7'), 2000);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
        <div className="max-w-4xl mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-orange-800 mb-4">
            Retention Strategy Mastery Complete!
          </h1>
          <p className="text-lg text-orange-700 mb-8">
            You've mastered Carmen's advanced approach to AI-enhanced retention that preserves humanity.
          </p>
          <Button onClick={() => navigate('/chapter/7')} className="bg-orange-600 hover:bg-orange-700">
            Return to Chapter 7
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
              <Shield className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-orange-800">
              Retention Strategy Mastery
            </h1>
          </div>
          <p className="text-lg text-orange-700 max-w-3xl mx-auto">
            Master Carmen's advanced retention strategies that combine predictive AI insights with deeply human approaches to keeping your best people engaged and growing.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-4">
            {[
              { phase: 'intro', label: 'Strategic Foundation', icon: Heart },
              { phase: 'workshop', label: 'Mastery Workshop', icon: TrendingUp },
              { phase: 'results', label: 'Excellence', icon: Award }
            ].map(({ phase, label, icon: Icon }) => (
              <div
                key={phase}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  currentPhase === phase
                    ? 'bg-orange-600 text-white'
                    : phase === 'intro' || (phase === 'workshop' && currentPhase === 'results')
                    ? 'bg-orange-200 text-orange-800'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Phase Content */}
        {currentPhase === 'intro' && (
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Carmen's Advanced Retention Philosophy
              </CardTitle>
              <CardDescription>
                Discover how to predict, prevent, and proactively address retention challenges
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">💡 Carmen's Retention Wisdom</h3>
                  <p className="text-amber-700">
                    "True retention isn't about keeping people—it's about creating an environment where they choose to stay 
                    because they're growing, contributing, and feeling genuinely valued. AI helps us see the early signals, 
                    but our humanity creates the solutions."
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-800">🔮 Predictive Intelligence</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Early flight risk detection</li>
                      <li>• Engagement pattern analysis</li>
                      <li>• Career progression modeling</li>
                      <li>• Satisfaction trend monitoring</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-orange-800">🎯 Proactive Interventions</h3>
                    <ul className="space-y-2 text-orange-700">
                      <li>• Personalized career pathing</li>
                      <li>• Meaningful project assignments</li>
                      <li>• Skill development opportunities</li>
                      <li>• Values alignment conversations</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">📊 Retention Risk Dashboard</h3>
                  <p className="text-blue-700 mb-3">Advanced analytics that honor both data and intuition:</p>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-xs text-gray-600">Overall Retention</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-yellow-600">3</div>
                      <div className="text-xs text-gray-600">At-Risk Employees</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-blue-600">18</div>
                      <div className="text-xs text-gray-600">Growth Opportunities</div>
                    </div>
                    <div className="bg-white p-3 rounded text-center">
                      <div className="text-2xl font-bold text-purple-600">87%</div>
                      <div className="text-xs text-gray-600">Career Satisfaction</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">🌟 The Carmen Retention Model</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-green-700">PREDICT</h4>
                      <p className="text-sm text-green-600">Use AI to identify patterns and early warning signs</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Heart className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-green-700">CONNECT</h4>
                      <p className="text-sm text-green-600">Have meaningful conversations and show genuine care</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <h4 className="font-medium text-green-700">ELEVATE</h4>
                      <p className="text-sm text-green-600">Create growth opportunities aligned with aspirations</p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('intro')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Enter Mastery Workshop
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === 'workshop' && (
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Advanced Retention Strategy Workshop
              </CardTitle>
              <CardDescription>
                Master sophisticated retention interventions using AI insights and human wisdom
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">🚨 Critical Scenario: High-Value Team Member at Risk</h3>
                  <p className="text-red-700 mb-4">
                    Your AI system has detected that Sarah, your top program director (5 years tenure), shows 78% flight risk. 
                    Recent indicators: decreased collaboration, missed optional meetings, updated LinkedIn profile.
                  </p>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">🔍 AI Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-yellow-50 p-2 rounded">
                          <strong>Risk Factors:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• 6 months without promotion discussion</li>
                            <li>• Decreased team interaction (-40%)</li>
                            <li>• Lower satisfaction scores</li>
                            <li>• Industry network activity ↑</li>
                          </ul>
                        </div>
                        <div className="bg-blue-50 p-2 rounded">
                          <strong>Strengths:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• High impact performer</li>
                            <li>• Strong mission alignment</li>
                            <li>• Team leadership natural</li>
                            <li>• Innovation contributor</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">💬 Carmen's Intervention</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-green-50 p-2 rounded">
                          <strong>Immediate Actions:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Schedule personal coffee meeting</li>
                            <li>• Express genuine appreciation</li>
                            <li>• Ask about career aspirations</li>
                            <li>• Listen for underlying concerns</li>
                          </ul>
                        </div>
                        <div className="bg-purple-50 p-2 rounded">
                          <strong>Strategic Offers:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Director-level project leadership</li>
                            <li>• Professional development budget</li>
                            <li>• Flexible work arrangements</li>
                            <li>• Cross-organizational collaboration</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded border">
                      <h4 className="font-medium text-orange-800 mb-2">🎯 Long-term Strategy</h4>
                      <div className="space-y-2 text-sm">
                        <div className="bg-orange-50 p-2 rounded">
                          <strong>Career Pathway:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Deputy Director track (6 months)</li>
                            <li>• Board presentation opportunities</li>
                            <li>• Mentor incoming directors</li>
                            <li>• Strategic planning involvement</li>
                          </ul>
                        </div>
                        <div className="bg-pink-50 p-2 rounded">
                          <strong>Personal Growth:</strong>
                          <ul className="text-xs mt-1 space-y-1">
                            <li>• Executive coaching program</li>
                            <li>• Conference speaking opportunities</li>
                            <li>• Industry thought leadership</li>
                            <li>• Work-life integration support</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">📈 Outcome Tracking</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">30-Day Metrics:</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Flight Risk Score: 78% → 23%</li>
                        <li>• Engagement Score: +45%</li>
                        <li>• Team Collaboration: +60%</li>
                        <li>• Career Satisfaction: 4.8/5</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-blue-700 mb-2">Retention Strategies Applied:</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>✓ Predictive intervention (AI-identified)</li>
                        <li>✓ Personal career conversation</li>
                        <li>✓ Customized growth opportunities</li>
                        <li>✓ Ongoing mentorship support</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('workshop')}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    See Mastery Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentPhase === 'results' && (
          <Card className="border-orange-200">
            <CardHeader className="bg-orange-50">
              <CardTitle className="text-orange-800 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Retention Excellence Achieved
              </CardTitle>
              <CardDescription>
                Witness the transformative power of Carmen's advanced retention mastery
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-4">🏆 Extraordinary Results</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-green-700">Overall Retention Rate:</span>
                        <span className="font-bold text-green-800">96%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">High-Performer Retention:</span>
                        <span className="font-bold text-green-800">98%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Internal Promotions:</span>
                        <span className="font-bold text-green-800">+150%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Employee Advocacy Score:</span>
                        <span className="font-bold text-green-800">9.2/10</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-4">💎 Cultural Excellence</h3>
                    <div className="space-y-3 text-blue-700">
                      <p>• Created a culture where people choose to stay and grow</p>
                      <p>• Transformed retention from reactive to proactive</p>
                      <p>• Built genuine career development pathways</p>
                      <p>• Established deep trust through predictive caring</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800 mb-3">🌟 Carmen's Mastery Framework</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2">The Predictive Foundation:</h4>
                      <ul className="text-orange-600 space-y-1 text-sm">
                        <li>• AI-powered early warning systems that never sleep</li>
                        <li>• Pattern recognition across engagement, performance, and satisfaction</li>
                        <li>• Personalized risk profiles based on individual motivations</li>
                        <li>• Continuous monitoring with human interpretation</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2">The Human Touch:</h4>
                      <ul className="text-orange-600 space-y-1 text-sm">
                        <li>• Genuine conversations that show you truly care</li>
                        <li>• Customized growth opportunities aligned with dreams</li>
                        <li>• Proactive support during challenging times</li>
                        <li>• Recognition that honors individual contributions</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-3">🚀 Your Retention Excellence Roadmap</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Foundation (Month 1):</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Implement retention analytics</li>
                        <li>• Map career pathways</li>
                        <li>• Train managers in intervention</li>
                        <li>• Create early warning protocols</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Growth (Month 2-3):</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Launch personalized development</li>
                        <li>• Establish mentorship programs</li>
                        <li>• Create flexible growth options</li>
                        <li>• Build recognition systems</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-700 mb-2">Mastery (Month 4+):</h4>
                      <ul className="text-sm text-purple-600 space-y-1">
                        <li>• Optimize predictive models</li>
                        <li>• Scale successful interventions</li>
                        <li>• Develop succession planning</li>
                        <li>• Create retention culture</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">💫 The Carmen Promise</h3>
                  <p className="text-green-700 text-center italic text-lg">
                    "When we combine AI's insight with our humanity's wisdom, we don't just retain employees—
                    we create an environment where people flourish, grow, and choose to build their careers with us 
                    because they know we're truly invested in their success and happiness."
                  </p>
                </div>

                <div className="text-center pt-4">
                  <Button 
                    onClick={() => handlePhaseComplete('results')}
                    className="bg-orange-600 hover:bg-orange-700 text-lg px-8 py-3"
                  >
                    Achieve Retention Mastery
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CarmenRetentionMastery;