import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Copy, Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TemplateCreatorProps {
  onComplete?: () => void;
}

export const TemplateCreator: React.FC<TemplateCreatorProps> = ({ onComplete }) => {
  const [templateType, setTemplateType] = useState<string>('');
  const [templateName, setTemplateName] = useState('');
  const [customFields, setCustomFields] = useState<Array<{id: string, name: string, type: string}>>([]);
  const [generatedTemplate, setGeneratedTemplate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');

  const templateTypes = [
    { value: 'meeting_summary', label: 'Meeting Summary', description: 'Follow-up notes with action items' },
    { value: 'donor_thank_you', label: 'Donor Thank You', description: 'Appreciation letters for gifts' },
    { value: 'volunteer_welcome', label: 'Volunteer Welcome', description: 'Onboarding packets for new volunteers' },
    { value: 'program_update', label: 'Program Update', description: 'Regular stakeholder communications' },
    { value: 'grant_report', label: 'Grant Report', description: 'Funder reporting templates' },
    { value: 'board_memo', label: 'Board Memo', description: 'Executive communications' }
  ];

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'date', label: 'Date' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'textarea', label: 'Long Text' }
  ];

  const addCustomField = () => {
    if (!newFieldName.trim()) {
      toast.error('Please enter a field name');
      return;
    }

    const newField = {
      id: Date.now().toString(),
      name: newFieldName.trim(),
      type: newFieldType
    };

    setCustomFields(prev => [...prev, newField]);
    setNewFieldName('');
    toast.success('Field added!');
  };

  const removeField = (fieldId: string) => {
    setCustomFields(prev => prev.filter(field => field.id !== fieldId));
  };

  const generateTemplate = async () => {
    if (!templateType || !templateName.trim()) {
      toast.error('Please select template type and enter a name');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const template = createTemplate(templateType, templateName, customFields);
      setGeneratedTemplate(template);
      
      toast.success('Template created successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create template. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createTemplate = (type: string, name: string, fields: Array<{id: string, name: string, type: string}>): string => {
    const selectedType = templateTypes.find(t => t.value === type);
    const fieldPlaceholders = fields.map(field => `[${field.name.toUpperCase()}]`).join('\n');
    
    switch (type) {
      case 'meeting_summary':
        return `# ${name}

**Date:** [DATE]
**Attendees:** [ATTENDEES]
**Meeting Duration:** [DURATION]

## Key Decisions
[DECISIONS]

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [ACTION_1] | [OWNER_1] | [DUE_DATE_1] | [STATUS_1] |
| [ACTION_2] | [OWNER_2] | [DUE_DATE_2] | [STATUS_2] |

## Discussion Points
[DISCUSSION_NOTES]

## Next Steps
[NEXT_STEPS]

${fields.length > 0 ? '## Additional Information\n' + fieldPlaceholders : ''}

---
*Meeting summary generated on [GENERATION_DATE]*`;

      case 'donor_thank_you':
        return `[DATE]

Dear [DONOR_NAME],

Thank you for your generous gift of [GIFT_AMOUNT] to [ORGANIZATION_NAME]. Your support makes a direct difference in our community.

## Your Impact
[SPECIFIC_IMPACT_DESCRIPTION]

## How We Used Your Gift
[PROGRAM_DETAILS]

We are grateful for partners like you who believe in our mission. Your contribution helps us [MISSION_SPECIFIC_OUTCOME].

${fields.length > 0 ? fieldPlaceholders + '\n' : ''}

With sincere appreciation,

[SIGNATURE_NAME]
[TITLE]
[ORGANIZATION_NAME]

P.S. [PERSONAL_NOTE]`;

      case 'volunteer_welcome':
        return `# Welcome to [ORGANIZATION_NAME]!

Dear [VOLUNTEER_NAME],

Welcome to our volunteer family! We're excited to have you join our mission of [MISSION_STATEMENT].

## Your Volunteer Information
- **Role:** [VOLUNTEER_ROLE]
- **Department:** [DEPARTMENT]
- **Supervisor:** [SUPERVISOR_NAME]
- **Start Date:** [START_DATE]

## First Day Checklist
- [ ] Complete orientation materials
- [ ] Meet your supervisor
- [ ] Review safety protocols
- [ ] Get building access/keys
- [ ] Join volunteer communication channels

## Important Resources
- **Volunteer Handbook:** [HANDBOOK_LINK]
- **Contact Information:** [CONTACT_INFO]
- **Emergency Procedures:** [EMERGENCY_INFO]

${fields.length > 0 ? '## Additional Details\n' + fieldPlaceholders : ''}

Thank you for choosing to volunteer with us. Your time and talents make our work possible!

Best regards,
[VOLUNTEER_COORDINATOR]`;

      case 'program_update':
        return `# [PROGRAM_NAME] Update - [MONTH/QUARTER]

## Program Highlights
[KEY_ACHIEVEMENTS]

## By the Numbers
- **Participants Served:** [PARTICIPANT_COUNT]
- **Programs Delivered:** [PROGRAM_COUNT]
- **Completion Rate:** [COMPLETION_RATE]%
- **Satisfaction Score:** [SATISFACTION_SCORE]/5

## Success Stories
[PARTICIPANT_STORY_1]

[PARTICIPANT_STORY_2]

## Challenges & Solutions
**Challenge:** [CHALLENGE_DESCRIPTION]
**Solution:** [SOLUTION_IMPLEMENTED]

## Looking Ahead
[NEXT_MONTH_GOALS]

${fields.length > 0 ? '## Additional Metrics\n' + fieldPlaceholders : ''}

---
*Update prepared by [STAFF_NAME] on [UPDATE_DATE]*`;

      case 'grant_report':
        return `# Grant Report: [GRANT_NAME]
**Reporting Period:** [START_DATE] to [END_DATE]
**Grant Amount:** [GRANT_AMOUNT]
**Organization:** [ORGANIZATION_NAME]

## Executive Summary
[BRIEF_OVERVIEW_OF_PERIOD]

## Goals & Objectives Progress
### Goal 1: [GOAL_1_DESCRIPTION]
- **Target:** [TARGET_METRIC]
- **Achieved:** [ACTUAL_METRIC]
- **Status:** [ON_TRACK/BEHIND/EXCEEDED]

### Goal 2: [GOAL_2_DESCRIPTION]
- **Target:** [TARGET_METRIC_2]
- **Achieved:** [ACTUAL_METRIC_2]
- **Status:** [STATUS_2]

## Financial Summary
- **Total Grant Amount:** [TOTAL_GRANT]
- **Amount Spent This Period:** [SPENT_AMOUNT]
- **Remaining Balance:** [REMAINING_BALANCE]
- **Budget Variance:** [VARIANCE_EXPLANATION]

## Challenges Encountered
[CHALLENGES_DESCRIPTION]

## Adaptations Made
[ADAPTATIONS_EXPLANATION]

## Upcoming Quarter Plans
[NEXT_QUARTER_PLANS]

${fields.length > 0 ? '## Funder-Specific Requirements\n' + fieldPlaceholders : ''}`;

      case 'board_memo':
        return `# Board Memorandum

**To:** Board of Directors
**From:** [SENDER_NAME], [SENDER_TITLE]
**Date:** [DATE]
**Re:** [SUBJECT_LINE]

## Executive Summary
[BRIEF_OVERVIEW]

## Background
[CONTEXT_AND_BACKGROUND]

## Key Issues
1. [ISSUE_1]
2. [ISSUE_2]
3. [ISSUE_3]

## Analysis
[DETAILED_ANALYSIS]

## Recommendations
1. **[RECOMMENDATION_1]**
   - Rationale: [RATIONALE_1]
   - Timeline: [TIMELINE_1]
   - Resources Required: [RESOURCES_1]

2. **[RECOMMENDATION_2]**
   - Rationale: [RATIONALE_2]
   - Timeline: [TIMELINE_2]
   - Resources Required: [RESOURCES_2]

## Financial Implications
[BUDGET_IMPACT]

## Risk Assessment
[RISKS_AND_MITIGATION]

## Next Steps
[ACTION_ITEMS_FOR_BOARD]

${fields.length > 0 ? '## Additional Information\n' + fieldPlaceholders : ''}

Respectfully submitted,
[SIGNATURE_NAME]`;

      default:
        return `# ${name}

This is a custom template for ${selectedType?.label || type}.

${fields.length > 0 ? fieldPlaceholders : ''}

---
Template created with AI assistance`;
    }
  };

  const copyTemplate = () => {
    navigator.clipboard.writeText(generatedTemplate);
    toast.success('Template copied to clipboard!');
  };

  const downloadTemplate = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedTemplate], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${templateName.replace(/\s+/g, '_')}_template.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Template downloaded!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Template Creator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create reusable templates that save time on routine documents
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Template Type</label>
              <Select value={templateType} onValueChange={setTemplateType}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose template type" />
                </SelectTrigger>
                <SelectContent>
                  {templateTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Template Name</label>
              <Input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="e.g., 'Weekly Team Meeting Notes'"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Custom Fields (Optional)</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="Field name (e.g., 'Project Code')"
                  className="flex-1"
                />
                <Select value={newFieldType} onValueChange={setNewFieldType}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={addCustomField} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {customFields.length > 0 && (
                <div className="space-y-1">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">{field.name}</Badge>
                      <span className="text-gray-500">({field.type})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={generateTemplate} 
            disabled={isGenerating || !templateType || !templateName.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Template...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Create Template
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Your Template</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyTemplate}>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="w-fit">
              {templateTypes.find(t => t.value === templateType)?.label}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-96">
                {generatedTemplate}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>How to use:</strong> Replace text in [BRACKETS] with your specific information. Save this template for repeated use across similar documents.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};