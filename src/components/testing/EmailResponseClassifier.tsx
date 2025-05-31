
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, AlertTriangle, Clock, Heart, Sparkles, Loader2, RefreshCw, MessageSquare } from 'lucide-react';
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';

const defaultEmails = [
  {
    id: 1,
    subject: "Urgent: Volunteer needed for food distribution tonight",
    preview: "Hi Maria, we have a last-minute cancellation and need someone to help with food distribution at the shelter from 6-9pm...",
    type: "urgent",
    icon: AlertTriangle,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200"
  },
  {
    id: 2,
    subject: "Thank you for the amazing fundraiser!",
    preview: "Dear team, I wanted to reach out and express my heartfelt gratitude for organizing such a wonderful event...",
    type: "appreciation",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50 border-pink-200"
  },
  {
    id: 3,
    subject: "Question about next month's volunteer schedule",
    preview: "Hello, I'm planning my calendar for next month and wanted to know when the next volunteer orientation will be...",
    type: "inquiry",
    icon: Clock,
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200"
  }
];

export const EmailResponseClassifier = () => {
  const [emails, setEmails] = useState(defaultEmails);
  const [currentEmail, setCurrentEmail] = useState(0);
  const [classifications, setClassifications] = useState<{[key: number]: string}>({});
  const [showResult, setShowResult] = useState<{[key: number]: boolean}>({});
  const [aiResponse, setAiResponse] = useState<{[key: number]: string}>({});
  const [showAiResponse, setShowAiResponse] = useState<{[key: number]: boolean}>({});
  const [organizationType, setOrganizationType] = useState('');
  const { callAI, loading } = useAITestingAssistant();

  const classifyEmail = (emailId: number, classification: string) => {
    setClassifications(prev => ({
      ...prev,
      [emailId]: classification
    }));
    setShowResult(prev => ({
      ...prev,
      [emailId]: true
    }));
  };

  const generateAiResponse = async (emailId: number) => {
    const email = emails.find(e => e.id === emailId);
    if (!email || !classifications[emailId]) return;

    try {
      const prompt = `Email Subject: ${email.subject}
Email Content: ${email.preview}
Classification: ${classifications[emailId]}
Organization Type: ${organizationType || 'general nonprofit'}

Generate a professional, appropriate response to this email. Keep it concise but helpful. The response should match the urgency and tone of the classification.`;

      const result = await callAI('grant_writing', prompt);
      setAiResponse(prev => ({
        ...prev,
        [emailId]: result
      }));
      setShowAiResponse(prev => ({
        ...prev,
        [emailId]: true
      }));
    } catch (error) {
      console.error('Error generating AI response:', error);
    }
  };

  const generateNewEmail = async () => {
    try {
      const prompt = `Generate a realistic nonprofit email scenario for classification practice. 
Organization type: ${organizationType || 'general nonprofit'}

Create an email with:
- A realistic subject line
- Email preview content (2-3 sentences)
- Make it either urgent (requiring immediate action), appreciation (thank you/positive feedback), or inquiry (information request)

Return the email in this exact format:
Subject: [subject line]
Preview: [email preview content]
Type: [urgent/appreciation/inquiry]`;

      const result = await callAI('grant_writing', prompt);
      
      // Parse the AI response to extract email components
      const lines = result.split('\n');
      const subject = lines.find(line => line.startsWith('Subject:'))?.replace('Subject:', '').trim() || 'Generated Email';
      const preview = lines.find(line => line.startsWith('Preview:'))?.replace('Preview:', '').trim() || 'Generated email content...';
      const type = lines.find(line => line.startsWith('Type:'))?.replace('Type:', '').trim() || 'inquiry';

      const iconMap = {
        urgent: AlertTriangle,
        appreciation: Heart,
        inquiry: Clock
      };

      const colorMap = {
        urgent: "text-red-600",
        appreciation: "text-pink-600", 
        inquiry: "text-blue-600"
      };

      const bgColorMap = {
        urgent: "bg-red-50 border-red-200",
        appreciation: "bg-pink-50 border-pink-200",
        inquiry: "bg-blue-50 border-blue-200"
      };

      const newEmail = {
        id: Date.now(),
        subject,
        preview,
        type: type as 'urgent' | 'appreciation' | 'inquiry',
        icon: iconMap[type as keyof typeof iconMap] || Clock,
        color: colorMap[type as keyof typeof colorMap] || "text-blue-600",
        bgColor: bgColorMap[type as keyof typeof bgColorMap] || "bg-blue-50 border-blue-200"
      };

      setEmails(prev => [...prev, newEmail]);
      setCurrentEmail(emails.length);
    } catch (error) {
      console.error('Error generating new email:', error);
    }
  };

  const nextEmail = () => {
    setCurrentEmail(prev => (prev + 1) % emails.length);
  };

  const prevEmail = () => {
    setCurrentEmail(prev => (prev - 1 + emails.length) % emails.length);
  };

  const email = emails[currentEmail];
  const IconComponent = email.icon;
  const isCorrect = classifications[email.id] === email.type;
  const hasClassified = showResult[email.id];

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI-Powered Email Classifier</h3>
        <p className="text-sm text-gray-600">Practice classifying volunteer emails with AI assistance</p>
        <Badge variant="outline" className="mt-1">
          {currentEmail + 1} of {emails.length}
        </Badge>
      </div>

      {/* Organization Type Input */}
      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">Your Organization Type (Optional)</label>
        <Input
          placeholder="e.g., Food Bank, Animal Shelter, Education..."
          value={organizationType}
          onChange={(e) => setOrganizationType(e.target.value)}
          className="text-sm"
        />
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{email.subject}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{email.preview}</p>
            
            {!hasClassified ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">How should this email be prioritized?</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    onClick={() => classifyEmail(email.id, 'urgent')}
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Urgent
                  </Button>
                  <Button 
                    onClick={() => classifyEmail(email.id, 'appreciation')}
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    <Heart className="w-3 h-3 mr-1" />
                    Thanks
                  </Button>
                  <Button 
                    onClick={() => classifyEmail(email.id, 'inquiry')}
                    size="sm" 
                    variant="outline"
                    className="text-xs"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    Info
                  </Button>
                </div>
              </div>
            ) : (
              <div className={`p-3 rounded-lg border ${email.bgColor}`}>
                <div className="flex items-center gap-2 mb-2">
                  <IconComponent className={`w-4 h-4 ${email.color}`} />
                  <span className={`text-sm font-medium ${email.color}`}>
                    {isCorrect ? 'Correct!' : 'Try again!'} This is {email.type}
                  </span>
                </div>
                <p className="text-xs mb-2 opacity-75">
                  {email.type === 'urgent' && 'Requires immediate action within hours'}
                  {email.type === 'appreciation' && 'Positive feedback that can be responded to later'}
                  {email.type === 'inquiry' && 'Information request with flexible timing'}
                </p>
                
                {isCorrect && !showAiResponse[email.id] && (
                  <Button
                    onClick={() => generateAiResponse(email.id)}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                    className="text-xs"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Show AI Response
                      </>
                    )}
                  </Button>
                )}

                {showAiResponse[email.id] && aiResponse[email.id] && (
                  <div className="mt-2 p-2 bg-white rounded border">
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-medium text-purple-700">AI Suggested Response:</span>
                    </div>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">{aiResponse[email.id]}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button onClick={prevEmail} size="sm" variant="outline">
          <ChevronLeft className="w-3 h-3 mr-1" />
          Previous
        </Button>
        
        <Button 
          onClick={generateNewEmail}
          disabled={loading}
          size="sm" 
          variant="outline"
          className="text-xs"
        >
          {loading ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Generate New Email
            </>
          )}
        </Button>

        <Button onClick={nextEmail} size="sm" variant="outline">
          Next
          <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Classified: {Object.keys(classifications).length}/{emails.length} emails
        </p>
      </div>
    </div>
  );
};
