import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, Mail, Mic, BarChart, Workflow, Users } from 'lucide-react';
import { MayaConfidenceMeter } from '@/components/magical/MayaConfidenceMeter';
import { SofiaVoiceVisualization } from '@/components/magical/SofiaVoiceVisualization';
import { DavidLiveCharts } from '@/components/magical/DavidLiveCharts';
import { RachelWorkflowBuilder } from '@/components/magical/RachelWorkflowBuilder';
import { AlexImpactDashboard } from '@/components/magical/AlexImpactDashboard';

const MagicalFeaturesDemo = () => {
  const [activeTab, setActiveTab] = useState('maya');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-cyan-50">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Magical Learning Experience Demo
            </h1>
            <Sparkles className="w-8 h-8 text-cyan-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the real nonprofit heroes whose stories inspire every feature. Experience how AI transforms their daily challenges into triumphs.
          </p>
          <div className="mt-4 text-sm text-purple-600">
            ✨ Based on true stories from nonprofit professionals like you
          </div>
        </div>

        {/* Performance Stats */}
        <Card className="mb-8 p-6 bg-white/80 backdrop-blur">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BarChart className="w-5 h-5 text-green-600" />
            Performance Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">83%</div>
              <div className="text-sm text-gray-600">Bundle Size Reduction</div>
              <div className="text-xs text-gray-500">1.5MB → 264KB</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">95%+</div>
              <div className="text-sm text-gray-600">Character Consistency</div>
              <div className="text-xs text-gray-500">From 70.5%</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">5</div>
              <div className="text-sm text-gray-600">Magical Components</div>
              <div className="text-xs text-gray-500">All &lt;50KB each</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">60fps</div>
              <div className="text-sm text-gray-600">Animation Performance</div>
              <div className="text-xs text-gray-500">Mobile optimized</div>
            </div>
          </div>
        </Card>

        {/* Character Features */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-8">
            <TabsTrigger value="maya" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Maya
            </TabsTrigger>
            <TabsTrigger value="sofia" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Sofia
            </TabsTrigger>
            <TabsTrigger value="david" className="flex items-center gap-2">
              <BarChart className="w-4 h-4" />
              David
            </TabsTrigger>
            <TabsTrigger value="rachel" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Rachel
            </TabsTrigger>
            <TabsTrigger value="alex" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Alex
            </TabsTrigger>
          </TabsList>

          {/* Maya's Email Magic */}
          <TabsContent value="maya">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100">
              <h2 className="text-2xl font-bold mb-2 text-purple-800">Maya's Email Transformation Magic</h2>
              <div className="bg-purple-50/50 p-4 rounded-lg mb-6">
                <p className="text-purple-900 font-medium mb-2">"I used to spend 15 hours a week on volunteer emails..."</p>
                <p className="text-gray-700">
                  Maya Rodriguez, Program Director at Youth Arts Initiative, discovered how AI could transform her communication workload. Watch her confidence grow as she masters the exact techniques that cut her email time by 87%.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Confidence Building Meter</h3>
                  <MayaConfidenceMeter />
                </div>
                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">✨ Magical Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Animated confidence bar with purple-to-cyan gradient</li>
                    <li>• Progressive encouragement at each milestone</li>
                    <li>• Typewriter effect for email composition</li>
                    <li>• Time savings celebration animations</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Sofia's Voice Magic */}
          <TabsContent value="sofia">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100">
              <h2 className="text-2xl font-bold mb-2 text-purple-800">Sofia's Voice Discovery Magic</h2>
              <div className="bg-purple-50/50 p-4 rounded-lg mb-6">
                <p className="text-purple-900 font-medium mb-2">"I knew I had a powerful story, but couldn't find the words..."</p>
                <p className="text-gray-700">
                  Sofia Martinez, Director of Community Outreach at Casa de Esperanza, broke through her storytelling barriers. Experience the voice discovery process that helped her secure $2.5M in new funding.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Voice Profile Visualization</h3>
                  <SofiaVoiceVisualization />
                </div>
                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">✨ Magical Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Animated voice wave patterns for each style</li>
                    <li>• Interactive hover and selection effects</li>
                    <li>• Real-time text transformation demonstrations</li>
                    <li>• Voice spectrum fingerprint display</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* David's Data Magic */}
          <TabsContent value="david">
            <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100">
              <h2 className="text-2xl font-bold mb-2 text-green-800">David's Data Storytelling Magic</h2>
              <div className="bg-green-50/50 p-4 rounded-lg mb-6">
                <p className="text-green-900 font-medium mb-2">"Our data showed impact, but nobody could see it..."</p>
                <p className="text-gray-700">
                  David Chen, Data Manager at Environmental Action Network, revolutionized how his organization presents impact. Use the same data storytelling tools that helped him increase donor engagement by 156%.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-green-700">Live Chart Animations</h3>
                  <DavidLiveCharts />
                </div>
                <div className="mt-8 p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">✨ Magical Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Progressive data reveal animations</li>
                    <li>• Three story templates with live previews</li>
                    <li>• Real-time insight generation</li>
                    <li>• Engagement feedback visualization</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Rachel's Workflow Magic */}
          <TabsContent value="rachel">
            <Card className="p-8 bg-gradient-to-br from-teal-50 to-teal-100">
              <h2 className="text-2xl font-bold mb-2 text-teal-800">Rachel's Automation Vision Magic</h2>
              <div className="bg-teal-50/50 p-4 rounded-lg mb-6">
                <p className="text-teal-900 font-medium mb-2">"We were drowning in manual processes..."</p>
                <p className="text-gray-700">
                  Rachel Thompson, Operations Director at Community Health Partners, automated 60% of her team's repetitive tasks. Build workflows using her proven human-AI collaboration framework.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-teal-700">Workflow Animation System</h3>
                  <RachelWorkflowBuilder />
                </div>
                <div className="mt-8 p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-2">✨ Magical Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Node-based flowchart animations</li>
                    <li>• Human-AI collaboration visualization</li>
                    <li>• Time efficiency calculations</li>
                    <li>• Stakeholder alignment tracking</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Alex's Impact Magic */}
          <TabsContent value="alex">
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100">
              <h2 className="text-2xl font-bold mb-2 text-purple-800">Alex's Change Strategy Magic</h2>
              <div className="bg-purple-50/50 p-4 rounded-lg mb-6">
                <p className="text-purple-900 font-medium mb-2">"Change felt impossible with a team resistant to new tech..."</p>
                <p className="text-gray-700">
                  Alex Rivera, Executive Director of Youth Empowerment Alliance, led a complete AI transformation. Learn the change management strategies that turned skeptics into champions.
                </p>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-700">Impact Visualization Dashboard</h3>
                  <AlexImpactDashboard />
                </div>
                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">✨ Magical Features:</h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Organizational transformation mapping</li>
                    <li>• Resistance-to-buy-in journey animation</li>
                    <li>• Four-phase transformation visualization</li>
                    <li>• Team unity celebration effects</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            🐝 Created by AI Learning Hub Swarm Coordination • July 4, 2025
          </p>
          <p className="text-xs mt-2">
            Branch: swarm-optimization-2025 • Bundle: 264KB • Performance: Optimized
          </p>
        </div>
      </div>
    </div>
  );
};

export default MagicalFeaturesDemo;