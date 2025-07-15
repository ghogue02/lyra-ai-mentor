import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  Users, 
  DollarSign, 
  MapPin, 
  Heart,
  Download,
  Save,
  Upload,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  FileJson,
  Database
} from 'lucide-react';
import { 
  generateSyntheticData, 
  saveSyntheticProfile, 
  loadSyntheticProfile,
  exportData,
  NonprofitProfile,
  DataGenerationOptions,
  GeneratedData
} from '@/services/syntheticDataService';

interface QuestionStep {
  id: string;
  question: string;
  type: 'select' | 'radio' | 'number' | 'text' | 'multiselect';
  options?: Array<{ value: string; label: string }>;
  validation?: (value: any) => boolean;
  helpText?: string;
  icon?: React.ReactNode;
}

const questionSteps: QuestionStep[] = [
  {
    id: 'orgType',
    question: 'What type of nonprofit organization is this?',
    type: 'select',
    icon: <Building2 className="w-5 h-5" />,
    options: [
      { value: 'arts', label: 'Arts & Culture' },
      { value: 'education', label: 'Education' },
      { value: 'health', label: 'Health Services' },
      { value: 'humanServices', label: 'Human Services' },
      { value: 'environment', label: 'Environment & Animals' },
      { value: 'international', label: 'International' },
      { value: 'publicBenefit', label: 'Public & Societal Benefit' },
      { value: 'religion', label: 'Religion Related' },
      { value: 'mutual', label: 'Mutual/Membership Benefit' },
      { value: 'other', label: 'Other' }
    ],
    helpText: 'Select the primary category that best describes the organization'
  },
  {
    id: 'budgetRange',
    question: 'What is the annual operating budget?',
    type: 'select',
    icon: <DollarSign className="w-5 h-5" />,
    options: [
      { value: 'micro', label: 'Under $50,000' },
      { value: 'small', label: '$50,000 - $250,000' },
      { value: 'medium', label: '$250,000 - $1 million' },
      { value: 'large', label: '$1 million - $10 million' },
      { value: 'major', label: '$10 million - $50 million' },
      { value: 'enterprise', label: 'Over $50 million' }
    ],
    helpText: 'This helps determine appropriate staff size and program scope'
  },
  {
    id: 'staffSize',
    question: 'How many staff members does the organization have?',
    type: 'select',
    icon: <Users className="w-5 h-5" />,
    options: [
      { value: 'volunteer', label: 'All volunteer (0 paid staff)' },
      { value: 'minimal', label: '1-5 staff members' },
      { value: 'small', label: '6-20 staff members' },
      { value: 'medium', label: '21-50 staff members' },
      { value: 'large', label: '51-200 staff members' },
      { value: 'enterprise', label: 'Over 200 staff members' }
    ]
  },
  {
    id: 'geographicFocus',
    question: 'What is the geographic scope of operations?',
    type: 'select',
    icon: <MapPin className="w-5 h-5" />,
    options: [
      { value: 'neighborhood', label: 'Neighborhood/Local Community' },
      { value: 'city', label: 'City/Municipality' },
      { value: 'county', label: 'County/Region' },
      { value: 'state', label: 'State/Province' },
      { value: 'national', label: 'National' },
      { value: 'international', label: 'International' }
    ]
  },
  {
    id: 'primaryPrograms',
    question: 'Describe the primary programs and services',
    type: 'text',
    icon: <Heart className="w-5 h-5" />,
    helpText: 'Brief description of main programs (e.g., "After-school tutoring, weekend workshops, summer camps")'
  },
  {
    id: 'donorDemographics',
    question: 'What are the typical donor demographics?',
    type: 'multiselect',
    icon: <Users className="w-5 h-5" />,
    options: [
      { value: 'individuals', label: 'Individual Donors' },
      { value: 'foundations', label: 'Private Foundations' },
      { value: 'corporations', label: 'Corporate Sponsors' },
      { value: 'government', label: 'Government Grants' },
      { value: 'events', label: 'Fundraising Events' },
      { value: 'membership', label: 'Membership Fees' },
      { value: 'fees', label: 'Program Service Fees' }
    ],
    helpText: 'Select all that apply'
  },
  {
    id: 'dataTypes',
    question: 'What types of synthetic data do you need?',
    type: 'multiselect',
    icon: <Database className="w-5 h-5" />,
    options: [
      { value: 'donors', label: 'Donor Records' },
      { value: 'volunteers', label: 'Volunteer Database' },
      { value: 'programs', label: 'Program Participants' },
      { value: 'financials', label: 'Financial Transactions' },
      { value: 'grants', label: 'Grant Applications' },
      { value: 'events', label: 'Event Attendees' },
      { value: 'board', label: 'Board Members' },
      { value: 'staff', label: 'Staff Directory' }
    ],
    helpText: 'Choose all data types you want to generate'
  }
];

export default function SyntheticDataBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [generatedData, setGeneratedData] = useState<GeneratedData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<NonprofitProfile[]>([]);
  const [profileName, setProfileName] = useState('');
  const [activeTab, setActiveTab] = useState('builder');

  useEffect(() => {
    const profiles = loadSyntheticProfile();
    setSavedProfiles(profiles);
  }, []);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const canProceed = () => {
    const currentQuestion = questionSteps[currentStep];
    const answer = answers[currentQuestion.id];
    
    if (!answer) return false;
    if (currentQuestion.type === 'multiselect' && (!Array.isArray(answer) || answer.length === 0)) return false;
    if (currentQuestion.validation) return currentQuestion.validation(answer);
    
    return true;
  };

  const progress = ((currentStep + 1) / questionSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < questionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateData();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateData = async () => {
    setIsGenerating(true);
    setActiveTab('preview');
    
    const options: DataGenerationOptions = {
      organizationType: answers.orgType,
      budgetRange: answers.budgetRange,
      staffSize: answers.staffSize,
      geographicScope: answers.geographicFocus,
      programDescription: answers.primaryPrograms,
      donorTypes: answers.donorDemographics || [],
      dataTypes: answers.dataTypes || []
    };

    try {
      const data = await generateSyntheticData(options);
      setGeneratedData(data);
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProfile = () => {
    if (!profileName || !generatedData) return;

    const profile: NonprofitProfile = {
      id: Date.now().toString(),
      name: profileName,
      options: {
        organizationType: answers.orgType,
        budgetRange: answers.budgetRange,
        staffSize: answers.staffSize,
        geographicScope: answers.geographicFocus,
        programDescription: answers.primaryPrograms,
        donorTypes: answers.donorDemographics || [],
        dataTypes: answers.dataTypes || []
      },
      createdAt: new Date().toISOString()
    };

    saveSyntheticProfile(profile);
    setSavedProfiles(loadSyntheticProfile());
    setProfileName('');
  };

  const handleLoadProfile = (profile: NonprofitProfile) => {
    setAnswers({
      orgType: profile.options.organizationType,
      budgetRange: profile.options.budgetRange,
      staffSize: profile.options.staffSize,
      geographicFocus: profile.options.geographicScope,
      primaryPrograms: profile.options.programDescription,
      donorDemographics: profile.options.donorTypes,
      dataTypes: profile.options.dataTypes
    });
    setCurrentStep(0);
    setActiveTab('builder');
  };

  const handleExport = (format: 'json' | 'csv') => {
    if (!generatedData) return;
    exportData(generatedData, format);
  };

  const renderQuestion = () => {
    const question = questionSteps[currentStep];
    const value = answers[question.id];

    switch (question.type) {
      case 'select':
        return (
          <Select value={value || ''} onValueChange={(v) => handleAnswer(question.id, v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'radio':
        return (
          <RadioGroup value={value || ''} onValueChange={(v) => handleAnswer(question.id, v)}>
            {question.options?.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'text':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder="Enter your answer..."
            rows={4}
          />
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {question.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValues = value || [];
                    if (e.target.checked) {
                      handleAnswer(question.id, [...currentValues, option.value]);
                    } else {
                      handleAnswer(question.id, currentValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  className="rounded border-gray-300"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Synthetic Nonprofit Data Builder
          </CardTitle>
          <CardDescription>
            Generate realistic nonprofit data through an interactive conversation with Lyra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="builder">Builder</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="profiles">Saved Profiles</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-6">
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Step {currentStep + 1} of {questionSteps.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      {questionSteps[currentStep].icon}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-lg font-medium">
                          {questionSteps[currentStep].question}
                        </h3>
                        
                        {questionSteps[currentStep].helpText && (
                          <p className="text-sm text-muted-foreground">
                            {questionSteps[currentStep].helpText}
                          </p>
                        )}

                        {renderQuestion()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  {currentStep === questionSteps.length - 1 ? 'Generate Data' : 'Next'}
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              {isGenerating && (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
                  <span className="ml-3 text-lg">Generating synthetic data...</span>
                </div>
              )}

              {generatedData && !isGenerating && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Generated Data Preview</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
                        <FileJson className="w-4 h-4 mr-2" />
                        Export JSON
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {generatedData.organization && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Organization Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <dt className="font-medium">Name</dt>
                              <dd className="text-muted-foreground">{generatedData.organization.name}</dd>
                            </div>
                            <div>
                              <dt className="font-medium">Type</dt>
                              <dd className="text-muted-foreground">{generatedData.organization.type}</dd>
                            </div>
                            <div>
                              <dt className="font-medium">Annual Budget</dt>
                              <dd className="text-muted-foreground">${generatedData.organization.annualBudget.toLocaleString()}</dd>
                            </div>
                            <div>
                              <dt className="font-medium">Staff Size</dt>
                              <dd className="text-muted-foreground">{generatedData.organization.staffCount}</dd>
                            </div>
                          </dl>
                        </CardContent>
                      </Card>
                    )}

                    {generatedData.donors && generatedData.donors.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Sample Donors ({generatedData.donors.length} total)</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-48">
                            <div className="space-y-2">
                              {generatedData.donors.slice(0, 5).map((donor, index) => (
                                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                                  <div>
                                    <p className="font-medium">{donor.name}</p>
                                    <p className="text-sm text-muted-foreground">{donor.type}</p>
                                  </div>
                                  <Badge variant="secondary">${donor.totalGiving.toLocaleString()}</Badge>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>
                    )}

                    {generatedData.programs && generatedData.programs.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Programs ({generatedData.programs.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {generatedData.programs.map((program, index) => (
                              <div key={index} className="p-2 bg-muted rounded">
                                <p className="font-medium">{program.name}</p>
                                <p className="text-sm text-muted-foreground">{program.description}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Input
                      placeholder="Profile name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="max-w-xs"
                    />
                    <Button onClick={handleSaveProfile} disabled={!profileName}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="profiles" className="space-y-4">
              {savedProfiles.length === 0 ? (
                <Alert>
                  <AlertDescription>
                    No saved profiles yet. Generate data and save it as a profile for quick access.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="grid gap-4">
                  {savedProfiles.map(profile => (
                    <Card key={profile.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{profile.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Created {new Date(profile.createdAt).toLocaleDateString()}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Badge variant="outline">{profile.options.organizationType}</Badge>
                              <Badge variant="outline">{profile.options.budgetRange}</Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLoadProfile(profile)}
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Load
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export { SyntheticDataBuilder };