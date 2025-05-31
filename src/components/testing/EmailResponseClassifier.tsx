
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, AlertTriangle, Clock, Heart } from 'lucide-react';

const emails = [
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
  const [currentEmail, setCurrentEmail] = useState(0);
  const [classifications, setClassifications] = useState<{[key: number]: string}>({});
  const [showResult, setShowResult] = useState<{[key: number]: boolean}>({});

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

  const nextEmail = () => {
    setCurrentEmail(prev => (prev + 1) % emails.length);
  };

  const prevEmail = () => {
    setCurrentEmail(prev => (prev - 1 + emails.length) % emails.length);
  };

  const email = emails[currentEmail];
  const IconComponent = email.icon;
  const isCorrect = classifications[email.id] === email.type;

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">Classify Volunteer Emails</h3>
        <p className="text-sm text-gray-600">Swipe or use arrows to classify each email</p>
        <Badge variant="outline" className="mt-1">
          {currentEmail + 1} of {emails.length}
        </Badge>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">{email.subject}</h4>
            <p className="text-xs text-gray-600 leading-relaxed">{email.preview}</p>
            
            {!showResult[email.id] ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-700">How should Maria prioritize this email?</p>
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
                <div className="flex items-center gap-2">
                  <IconComponent className={`w-4 h-4 ${email.color}`} />
                  <span className={`text-sm font-medium ${email.color}`}>
                    {isCorrect ? 'Correct!' : 'Try again!'} This is {email.type}
                  </span>
                </div>
                <p className="text-xs mt-1 opacity-75">
                  {email.type === 'urgent' && 'Requires immediate action within hours'}
                  {email.type === 'appreciation' && 'Positive feedback that can be responded to later'}
                  {email.type === 'inquiry' && 'Information request with flexible timing'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button onClick={prevEmail} size="sm" variant="outline">
          <ChevronLeft className="w-3 h-3 mr-1" />
          Previous
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
