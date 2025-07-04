import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, BarChart3, X } from 'lucide-react';
import { setAnalyticsConsent } from '@/analytics/InteractiveElementAnalytics';

export const AnalyticsConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already made a consent decision
    const consent = localStorage.getItem('analytics_consent');
    if (consent === null) {
      setShowBanner(true);
    } else {
      setConsentGiven(consent === 'granted');
    }
  }, []);

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setConsentGiven(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setConsentGiven(false);
    setShowBanner(false);
  };

  const handleRevoke = () => {
    setAnalyticsConsent(false);
    setConsentGiven(false);
    localStorage.removeItem('analytics_consent');
  };

  if (!showBanner && consentGiven === null) return null;

  if (showBanner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/95 backdrop-blur-md shadow-lg border-t">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">Analytics & Privacy</h3>
              <p className="text-sm text-gray-600 mb-4">
                We use anonymous analytics to improve your learning experience. This helps us understand which 
                interactive elements are most effective and identify areas for improvement. No personal information 
                is collected or shared with third parties.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <p className="mb-1">• Anonymous usage data only</p>
                <p className="mb-1">• No personal information collected</p>
                <p className="mb-1">• Data used solely for improving the platform</p>
                <p>• You can change your preference at any time</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button onClick={handleAccept} className="bg-purple-600 hover:bg-purple-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Accept Analytics
                </Button>
                <Button onClick={handleDecline} variant="outline">
                  Decline
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show consent status in settings or profile
  if (consentGiven !== null) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Analytics Preferences
          </CardTitle>
          <CardDescription>
            Control how we collect anonymous usage data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Analytics enabled</span>
              <span className={`text-sm font-medium ${consentGiven ? 'text-green-600' : 'text-gray-500'}`}>
                {consentGiven ? 'Yes' : 'No'}
              </span>
            </div>
            {consentGiven ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  You're helping us improve the learning experience. Thank you!
                </p>
                <Button onClick={handleRevoke} variant="outline" size="sm">
                  Revoke Consent
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Analytics are currently disabled. Enable them to help us improve.
                </p>
                <Button onClick={handleAccept} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  Enable Analytics
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};