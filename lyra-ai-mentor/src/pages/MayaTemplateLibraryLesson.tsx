import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LyraAvatar } from '@/components/LyraAvatar';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Mail, FileText, Clock, Sparkles, Users, Target } from 'lucide-react';
import { MayaTemplateDesigner } from '@/components/interactive/MayaTemplateDesigner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MayaTemplateLibraryLesson: React.FC = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'story' | 'workshop'>('story');
  const [mayaProgress, setMayaProgress] = useState(0);
  
  // PACE Integration: Dynamic audience profiles
  const audienceProfiles = [
    {
      id: 'busy-director',
      label: 'Busy Executive Director',
      context: 'Limited time, high responsibility',
      templates: ['Board updates', 'Donor thank you', 'Staff announcements'],
      timeNeeds: 'Quick, efficient, professional'
    },
    {
      id: 'community-coordinator',
      label: 'Community Coordinator',
      context: 'Relationship-focused, creative',
      templates: ['Volunteer engagement', 'Community stories', 'Event invitations'],
      timeNeeds: 'Warm, personal, engaging'
    },
    {
      id: 'grant-writer',
      label: 'Grant Writer',
      context: 'Detail-oriented, results-driven',
      templates: ['Proposal templates', 'Impact reports', 'Funder communications'],
      timeNeeds: 'Data-driven, compelling, structured'
    }
  ];
  
  useEffect(() => {
    // Simulate Maya's story progression
    const timer = setInterval(() => {
      setMayaProgress(prev => Math.min(prev + 1, 100));
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <LyraAvatar size="md" expression="helping" animated />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Template Library Builder</h1>
              <p className="text-lg text-gray-600">Maya's Email Efficiency System</p>
            </div>
          </div>
        </motion.div>

        {currentView === 'story' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Maya's Template Story */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Maya's Template Revolution
                </CardTitle>
                <CardDescription>
                  Witness Maya's transformation from writing everything from scratch to building efficient template systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-3">
                      <strong>The Problem:</strong> Maya was spending 3+ hours weekly writing repetitive communications. 
                      Each donor thank you took 20 minutes, volunteer emails took 15 minutes, and board reports started from scratch every time.
                    </p>
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <p className="text-red-700 text-sm">
                        "I felt like I was constantly reinventing the wheel. The same messages, over and over, 
                        but I didn't want to sound robotic. I was drowning in communication tasks."
                      </p>
                      <p className="text-red-600 text-xs mt-1">- Maya, before templates</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-700 mb-3">
                      <strong>The Solution:</strong> Maya discovered that templates don't make communication robotic - 
                      they make it consistently excellent while saving precious time for what matters most.
                    </p>
                    <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                      <p className="text-green-700 text-sm">
                        "Now I have 15 templates covering 80% of my communications. What used to take 3 hours 
                        now takes 20 minutes. That's 2.5 hours back for our youth!"
                      </p>
                      <p className="text-green-600 text-xs mt-1">- Maya, with her template library</p>
                    </div>
                  </div>
                  
                  {/* PACE Integration: Audience-Specific Templates */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {audienceProfiles.map((profile) => (
                      <div key={profile.id} className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-sm">{profile.label}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{profile.context}</p>
                        <div className="space-y-1">
                          {profile.templates.map((template, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs mr-1">
                              {template}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-blue-600 mt-2 italic">{profile.timeNeeds}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    onClick={() => setCurrentView('workshop')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Build Your Template Library
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {currentView === 'workshop' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Interactive Template Designer */}
            <MayaTemplateDesigner />
            
            {/* Navigation */}
            <div className="flex gap-3 justify-center mt-8">
              <Button 
                onClick={() => setCurrentView('story')}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Story
              </Button>
              <Button 
                onClick={() => navigate('/chapter/2/lesson/5')}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Chapter Hub
              </Button>
              <Button 
                onClick={() => navigate('/chapter/2/lesson/5/difficult-conversations')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Next: Difficult Conversations <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MayaTemplateLibraryLesson;