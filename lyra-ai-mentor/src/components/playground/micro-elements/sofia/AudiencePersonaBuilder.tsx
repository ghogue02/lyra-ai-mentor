import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Target, Download, Brain } from 'lucide-react';

interface AudiencePersona {
  name: string;
  role: string;
  demographics: {
    age: string;
    location: string;
    income: string;
    education: string;
  };
  psychographics: {
    values: string[];
    concerns: string[];
    motivations: string[];
    communication_style: string;
  };
  behavior: {
    preferred_channels: string[];
    decision_factors: string[];
    barriers: string[];
  };
  messaging: {
    key_messages: string[];
    tone: string;
    call_to_action: string;
  };
}

const AudiencePersonaBuilder: React.FC = () => {
  const [persona, setPersona] = useState<AudiencePersona>({
    name: '',
    role: '',
    demographics: {
      age: '',
      location: '',
      income: '',
      education: ''
    },
    psychographics: {
      values: [],
      concerns: [],
      motivations: [],
      communication_style: ''
    },
    behavior: {
      preferred_channels: [],
      decision_factors: [],
      barriers: []
    },
    messaging: {
      key_messages: [],
      tone: '',
      call_to_action: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [generatedPersona, setGeneratedPersona] = useState<AudiencePersona | null>(null);

  const steps = [
    { title: 'Basic Info', icon: Users },
    { title: 'Demographics', icon: Target },
    { title: 'Psychology', icon: Brain },
    { title: 'Behavior', icon: Users },
    { title: 'Messaging', icon: Target }
  ];

  const valueOptions = [
    'Family', 'Community', 'Education', 'Environment', 'Health', 'Justice', 'Faith', 'Innovation', 'Tradition', 'Freedom'
  ];

  const channelOptions = [
    'Email', 'Social Media', 'Direct Mail', 'Phone', 'In-Person', 'Website', 'Newsletter', 'Events'
  ];

  const generatePersona = () => {
    // Generate complete persona with AI-like intelligence
    const enhanced = {
      ...persona,
      psychographics: {
        ...persona.psychographics,
        concerns: persona.psychographics.concerns.length > 0 ? persona.psychographics.concerns : [
          'Making a meaningful impact',
          'Ensuring donations are used effectively',
          'Understanding true need'
        ],
        motivations: persona.psychographics.motivations.length > 0 ? persona.psychographics.motivations : [
          'Creating positive change',
          'Being part of something bigger',
          'Helping others'
        ]
      },
      messaging: {
        ...persona.messaging,
        key_messages: persona.messaging.key_messages.length > 0 ? persona.messaging.key_messages : [
          'Your impact creates real change',
          'Join our community of changemakers',
          'Together we can solve this challenge'
        ],
        tone: persona.messaging.tone || 'Warm and authentic',
        call_to_action: persona.messaging.call_to_action || 'Join us in making a difference'
      }
    };
    
    setGeneratedPersona(enhanced);
  };

  const exportPersona = () => {
    if (!generatedPersona) return;
    
    const exportData = {
      persona: generatedPersona,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audience-persona-${generatedPersona.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Persona Name</label>
              <Input
                placeholder="e.g., Sarah the Supporter"
                value={persona.name}
                onChange={(e) => setPersona(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Role/Relationship</label>
              <Input
                placeholder="e.g., Monthly Donor, Volunteer, Board Member"
                value={persona.role}
                onChange={(e) => setPersona(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Age Range</label>
                <Select
                  value={persona.demographics.age}
                  onValueChange={(value) => setPersona(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, age: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="18-25">18-25</SelectItem>
                    <SelectItem value="26-35">26-35</SelectItem>
                    <SelectItem value="36-45">36-45</SelectItem>
                    <SelectItem value="46-55">46-55</SelectItem>
                    <SelectItem value="56-65">56-65</SelectItem>
                    <SelectItem value="65+">65+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="e.g., Urban, Suburban, Rural"
                  value={persona.demographics.location}
                  onChange={(e) => setPersona(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, location: e.target.value }
                  }))}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Income Level</label>
                <Select
                  value={persona.demographics.income}
                  onValueChange={(value) => setPersona(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, income: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select income level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Lower Income</SelectItem>
                    <SelectItem value="middle">Middle Income</SelectItem>
                    <SelectItem value="upper-middle">Upper Middle</SelectItem>
                    <SelectItem value="high">High Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Education</label>
                <Select
                  value={persona.demographics.education}
                  onValueChange={(value) => setPersona(prev => ({
                    ...prev,
                    demographics: { ...prev.demographics, education: value }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="some-college">Some College</SelectItem>
                    <SelectItem value="bachelors">Bachelor's</SelectItem>
                    <SelectItem value="masters">Master's</SelectItem>
                    <SelectItem value="doctorate">Doctorate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Core Values</label>
              <div className="flex flex-wrap gap-2">
                {valueOptions.map(value => (
                  <Badge
                    key={value}
                    variant={persona.psychographics.values.includes(value) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const values = persona.psychographics.values.includes(value)
                        ? persona.psychographics.values.filter(v => v !== value)
                        : [...persona.psychographics.values, value];
                      setPersona(prev => ({
                        ...prev,
                        psychographics: { ...prev.psychographics, values }
                      }));
                    }}
                  >
                    {value}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Communication Style</label>
              <Select
                value={persona.psychographics.communication_style}
                onValueChange={(value) => setPersona(prev => ({
                  ...prev,
                  psychographics: { ...prev.psychographics, communication_style: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select communication style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal & Professional</SelectItem>
                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                  <SelectItem value="personal">Personal & Emotional</SelectItem>
                  <SelectItem value="direct">Direct & Action-Oriented</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Communication Channels</label>
              <div className="flex flex-wrap gap-2">
                {channelOptions.map(channel => (
                  <Badge
                    key={channel}
                    variant={persona.behavior.preferred_channels.includes(channel) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const channels = persona.behavior.preferred_channels.includes(channel)
                        ? persona.behavior.preferred_channels.filter(c => c !== channel)
                        : [...persona.behavior.preferred_channels, channel];
                      setPersona(prev => ({
                        ...prev,
                        behavior: { ...prev.behavior, preferred_channels: channels }
                      }));
                    }}
                  >
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Preferred Tone</label>
              <Select
                value={persona.messaging.tone}
                onValueChange={(value) => setPersona(prev => ({
                  ...prev,
                  messaging: { ...prev.messaging, tone: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select messaging tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warm">Warm & Authentic</SelectItem>
                  <SelectItem value="professional">Professional & Trustworthy</SelectItem>
                  <SelectItem value="urgent">Urgent & Compelling</SelectItem>
                  <SelectItem value="inspiring">Inspiring & Hopeful</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Call to Action</label>
              <Input
                placeholder="e.g., Join us in making a difference"
                value={persona.messaging.call_to_action}
                onChange={(e) => setPersona(prev => ({
                  ...prev,
                  messaging: { ...prev.messaging, call_to_action: e.target.value }
                }))}
              />
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <Target className="h-6 w-6 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold">Audience Persona Builder</h1>
        </div>
        <p className="text-muted-foreground">
          Create detailed audience personas to guide your communication strategy.
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <div key={index} className="flex items-center">
                <div className={`
                  p-2 rounded-full border-2 transition-all
                  ${index <= currentStep 
                    ? 'border-purple-500 bg-purple-500 text-white' 
                    : 'border-gray-300 text-gray-300'
                  }
                `}>
                  <StepIcon className="h-4 w-4" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  index <= currentStep ? 'text-purple-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-8 h-0.5 ml-4 ${
                    index < currentStep ? 'bg-purple-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>
            {currentStep === 0 && "Start with basic information about your audience persona."}
            {currentStep === 1 && "Define the demographic characteristics of your audience."}
            {currentStep === 2 && "Understand their values, concerns, and motivations."}
            {currentStep === 3 && "Identify their preferred communication channels and behaviors."}
            {currentStep === 4 && "Define your messaging approach and tone."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-6">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep === steps.length - 1 ? (
              <Button 
                onClick={generatePersona}
                disabled={!persona.name || !persona.role}
              >
                Generate Persona
              </Button>
            ) : (
              <Button 
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedPersona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {generatedPersona.name}
            </CardTitle>
            <CardDescription>{generatedPersona.role}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Demographics</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Age: {generatedPersona.demographics.age}</li>
                  <li>Location: {generatedPersona.demographics.location}</li>
                  <li>Income: {generatedPersona.demographics.income}</li>
                  <li>Education: {generatedPersona.demographics.education}</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Values</h4>
                <div className="flex flex-wrap gap-1">
                  {generatedPersona.psychographics.values.map(value => (
                    <Badge key={value} variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Alert>
              <Target className="h-4 w-4" />
              <AlertDescription>
                Your audience persona is complete! Use this to guide your communication strategy.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button onClick={exportPersona} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Persona
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AudiencePersonaBuilder;