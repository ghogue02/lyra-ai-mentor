import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Copy, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

interface SummaryGeneratorProps {
  onComplete?: () => void;
}

export const SummaryGenerator: React.FC<SummaryGeneratorProps> = ({ onComplete }) => {
  const [summaryType, setSummaryType] = useState<string>('');
  const [roughNotes, setRoughNotes] = useState('');
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const summaryTypes = [
    { value: 'meeting_summary', label: 'Meeting Summary', description: 'Organized notes with action items' },
    { value: 'call_summary', label: 'Phone Call Summary', description: 'Key points and follow-up actions' },
    { value: 'event_summary', label: 'Event Summary', description: 'Event outcomes and learnings' },
    { value: 'training_summary', label: 'Training Summary', description: 'Workshop or training takeaways' },
    { value: 'interview_summary', label: 'Interview Summary', description: 'Candidate or stakeholder interview notes' }
  ];

  const generateSummary = async () => {
    if (!summaryType || !roughNotes.trim()) {
      toast.error('Please select summary type and enter your notes');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const summary = createStructuredSummary();
      setGeneratedSummary(summary);
      
      toast.success('Professional summary generated!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate summary. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createStructuredSummary = (): string => {
    const selectedType = summaryTypes.find(t => t.value === summaryType);
    const today = new Date().toLocaleDateString();
    
    let summary = '';

    switch (summaryType) {
      case 'meeting_summary':
        summary = `# Meeting Summary - ${today}

## Meeting Details
**Date:** ${today}
**Participants:** [Add participant names]
**Duration:** [Meeting length]

## Key Decisions Made
- [Decision 1 based on notes]
- [Decision 2 based on notes]
- [Decision 3 based on notes]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action item 1] | [Name] | [Date] | Pending |
| [Action item 2] | [Name] | [Date] | Pending |
| [Action item 3] | [Name] | [Date] | Pending |

## Discussion Points
${extractKeyPoints(roughNotes)}

## Next Steps
- [Next step 1]
- [Next step 2]
- [Next meeting scheduled for: Date]

## Notes
${roughNotes}

---
*Summary generated from meeting notes*`;
        break;

      case 'call_summary':
        summary = `# Call Summary - ${today}

## Call Overview
**Date:** ${today}
**Participants:** [Add names]
**Purpose:** [Call objective]

## Key Points Discussed
${extractKeyPoints(roughNotes)}

## Agreements Reached
- [Agreement 1]
- [Agreement 2]
- [Agreement 3]

## Follow-up Actions
- [ ] [Action for you]
- [ ] [Action for other party]
- [ ] [Mutual action]

## Next Contact
**When:** [Next call/meeting date]
**Purpose:** [Reason for next contact]

## Original Notes
${roughNotes}

---
*Professional call summary*`;
        break;

      case 'event_summary':
        summary = `# Event Summary - ${today}

## Event Overview
**Event:** [Event name]
**Date:** ${today}
**Attendance:** [Number of participants]

## Key Outcomes
${extractKeyPoints(roughNotes)}

## Successes
- [Success 1]
- [Success 2]
- [Success 3]

## Areas for Improvement
- [Improvement area 1]
- [Improvement area 2]

## Follow-up Actions
- [ ] [Thank participants]
- [ ] [Share resources]
- [ ] [Plan next event]

## Participant Feedback
[Summary of feedback received]

## Raw Notes
${roughNotes}

---
*Event summary for future planning*`;
        break;

      case 'training_summary':
        summary = `# Training Summary - ${today}

## Training Details
**Topic:** [Training subject]
**Date:** ${today}
**Facilitator:** [Trainer name]
**Participants:** [Number/names]

## Key Learning Points
${extractKeyPoints(roughNotes)}

## Skills Developed
- [Skill 1]
- [Skill 2]
- [Skill 3]

## Action Items for Implementation
- [ ] [Practice activity 1]
- [ ] [Apply skill in real situation]
- [ ] [Share learnings with team]

## Resources Provided
- [Resource 1]
- [Resource 2]
- [Resource 3]

## Additional Notes
${roughNotes}

---
*Training summary for future reference*`;
        break;

      case 'interview_summary':
        summary = `# Interview Summary - ${today}

## Interview Details
**Candidate/Interviewee:** [Name]
**Position/Purpose:** [Role or meeting purpose]
**Date:** ${today}
**Interviewer(s):** [Names]

## Key Qualifications
${extractKeyPoints(roughNotes)}

## Strengths Observed
- [Strength 1]
- [Strength 2]
- [Strength 3]

## Areas of Concern
- [Concern 1]
- [Concern 2]

## Next Steps
- [ ] [Reference checks]
- [ ] [Second interview]
- [ ] [Decision by date]

## Overall Assessment
[Summary assessment]

## Detailed Notes
${roughNotes}

---
*Interview summary for decision-making*`;
        break;

      default:
        summary = `# Summary - ${today}

## Overview
${extractKeyPoints(roughNotes)}

## Key Points
- [Point 1]
- [Point 2]
- [Point 3]

## Action Items
- [ ] [Action 1]
- [ ] [Action 2]

## Notes
${roughNotes}

---
*Summary generated with AI assistance*`;
    }

    return summary;
  };

  const extractKeyPoints = (notes: string): string => {
    // Simple extraction of key points from notes
    const sentences = notes.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const keyPoints = sentences.slice(0, 5).map((sentence, index) => 
      `- ${sentence.trim()}`
    ).join('\n');
    
    return keyPoints || '- [Key point 1]\n- [Key point 2]\n- [Key point 3]';
  };

  const copySummary = () => {
    navigator.clipboard.writeText(generatedSummary);
    toast.success('Summary copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Meeting Summary Generator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Transform rough notes into professional summaries with clear action items
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Summary Type</label>
            <Select value={summaryType} onValueChange={setSummaryType}>
              <SelectTrigger>
                <SelectValue placeholder="What type of summary?" />
              </SelectTrigger>
              <SelectContent>
                {summaryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Your Rough Notes
            </label>
            <Textarea
              value={roughNotes}
              onChange={(e) => setRoughNotes(e.target.value)}
              placeholder="Paste your rough meeting notes, call notes, or any unstructured notes here. For example: 'discussed budget increase for food program, Sarah will contact city council about permits, need to follow up with donors by Friday, next meeting March 15th'"
              rows={8}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={generateSummary} 
            disabled={isGenerating || !summaryType || !roughNotes.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Summary...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Professional Summary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedSummary && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckSquare className="h-5 w-5 text-green-600" />
                Professional Summary
              </CardTitle>
              <Button variant="outline" size="sm" onClick={copySummary}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
            <Badge variant="secondary" className="w-fit">
              {summaryTypes.find(t => t.value === summaryType)?.label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-96">
                {generatedSummary}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Next steps:</strong> Review the action items, assign owners and due dates, then share this summary with all participants within 24 hours.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};