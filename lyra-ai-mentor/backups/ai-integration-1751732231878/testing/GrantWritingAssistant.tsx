
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAITestingAssistant } from '@/hooks/useAITestingAssistant';
import { Loader2, Lightbulb, Edit } from 'lucide-react';

const sampleProposal = `Our organization needs funding to expand our after-school program. We serve kids in Brooklyn and need $50,000. The program is good and helps children with homework. We have been doing this for 5 years and need more money to grow.`;

export const GrantWritingAssistant = () => {
  const [proposal, setProposal] = useState(sampleProposal);
  const [feedback, setFeedback] = useState<string>('');
  const [improved, setImproved] = useState(false);
  const { callAI, loading } = useAITestingAssistant();

  const getAIFeedback = async () => {
    try {
      const result = await callAI(
        'grant_writing',
        proposal,
        'This is a sample grant proposal for a Brooklyn nonprofit after-school program. Provide specific suggestions to make it more compelling and likely to receive funding.'
      );
      setFeedback(result);
      setImproved(true);
    } catch (error) {
      setFeedback('Sorry, there was an error getting feedback. Please try again!');
    }
  };

  const reset = () => {
    setProposal(sampleProposal);
    setFeedback('');
    setImproved(false);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Grant Writing Assistant</h3>
        <p className="text-sm text-gray-600">Get AI feedback to improve your grant proposal</p>
      </div>

      <Card className="border border-gray-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Your Grant Proposal:
              </label>
              <textarea
                value={proposal}
                onChange={(e) => setProposal(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md text-sm"
                rows={4}
                placeholder="Enter your grant proposal text..."
              />
            </div>
            
            <Button 
              onClick={getAIFeedback} 
              size="sm" 
              disabled={loading || proposal.trim().length < 20}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
              ) : (
                <Lightbulb className="w-3 h-3 mr-2" />
              )}
              Get AI Feedback
            </Button>
          </div>
        </CardContent>
      </Card>

      {feedback && (
        <Card className="border border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Edit className="w-4 h-4 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700">AI Suggestions</Badge>
            </div>
            <div className="text-sm text-gray-700 whitespace-pre-wrap">
              {feedback}
            </div>
          </CardContent>
        </Card>
      )}

      {improved && (
        <div className="text-center">
          <Button onClick={reset} variant="outline" size="sm">
            Try Another Proposal
          </Button>
        </div>
      )}
    </div>
  );
};
