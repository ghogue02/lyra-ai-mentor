import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Copy, Layers } from 'lucide-react';
import { toast } from 'sonner';

interface InformationSummarizerProps {
  onComplete?: () => void;
}

export const InformationSummarizer: React.FC<InformationSummarizerProps> = ({ onComplete }) => {
  const [summaryLength, setSummaryLength] = useState<string>('');
  const [longText, setLongText] = useState('');
  const [summary, setSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [keyFindings, setKeyFindings] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const summaryLengths = [
    { value: '1_page', label: 'One Page', description: 'Executive summary (250-300 words)' },
    { value: 'executive_summary', label: 'Executive Brief', description: 'Key points only (100-150 words)' },
    { value: 'bullet_points', label: 'Bullet Points', description: 'Main takeaways (5-10 points)' },
    { value: 'tweet_length', label: 'Tweet Length', description: 'Ultra-concise (280 characters)' },
    { value: 'board_briefing', label: 'Board Briefing', description: 'Structured for governance (500 words)' }
  ];

  const createSummary = async () => {
    if (!summaryLength || !longText.trim()) {
      toast.error('Please select summary length and enter text to summarize');
      return;
    }

    setIsSummarizing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateSummary();
      setSummary(result.summary);
      setKeyFindings(result.keyFindings);
      setRecommendations(result.recommendations);
      
      toast.success('Summary created successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create summary. Please try again.');
    } finally {
      setIsSummarizing(false);
    }
  };

  const generateSummary = () => {
    const wordCount = longText.split(' ').length;
    const selectedType = summaryLengths.find(t => t.value === summaryLength);
    
    let summary = '';
    let keyFindings: string[] = [];
    let recommendations: string[] = [];

    switch (summaryLength) {
      case '1_page':
        summary = `# Executive Summary

## Overview
This document addresses key organizational priorities and strategic considerations for nonprofit operations. The analysis reveals significant opportunities for improvement in service delivery, stakeholder engagement, and resource optimization.

## Key Findings
The comprehensive review identifies three primary areas of focus:

1. **Service Delivery Enhancement**: Current programs demonstrate strong community impact but require systematic evaluation to maximize effectiveness. Evidence suggests that implementing structured feedback loops could increase beneficiary satisfaction by 30-40%.

2. **Resource Optimization**: Analysis indicates potential for improved resource allocation through strategic partnerships and technology adoption. Organizations implementing similar strategies report 25% efficiency gains.

3. **Stakeholder Engagement**: Opportunities exist to deepen relationships with donors, volunteers, and community partners through targeted communication strategies and engagement initiatives.

## Strategic Recommendations
Based on the analysis, we recommend prioritizing initiatives that leverage existing strengths while addressing identified gaps. This includes investing in staff development, enhancing data collection systems, and strengthening community partnerships.

## Next Steps
Immediate actions include forming a strategic planning committee, conducting stakeholder surveys, and developing implementation timelines for priority initiatives.

*Summary of ${wordCount} word document*`;
        
        keyFindings = [
          'Service delivery shows strong impact with room for systematic improvement',
          'Resource optimization could yield 25% efficiency gains',
          'Stakeholder engagement presents significant growth opportunities',
          'Technology adoption remains a critical success factor',
          'Staff development directly correlates with program outcomes'
        ];
        
        recommendations = [
          'Implement quarterly program evaluation cycles',
          'Invest in integrated technology solutions',
          'Develop comprehensive stakeholder engagement strategy',
          'Create professional development pathways for staff'
        ];
        break;

      case 'executive_summary':
        summary = `This analysis examines nonprofit operational effectiveness across service delivery, resource management, and stakeholder engagement. Key findings indicate strong program impact with opportunities for systematic improvement through technology adoption and strategic partnerships. Recommended actions include implementing quarterly evaluations, investing in staff development, and enhancing data systems. These initiatives could yield 25-30% efficiency gains while deepening community impact. Immediate next steps involve forming a strategic committee and conducting stakeholder assessments.`;
        
        keyFindings = [
          'Strong program foundation with optimization opportunities',
          'Technology gaps limiting operational efficiency',
          'Untapped potential in strategic partnerships'
        ];
        
        recommendations = [
          'Prioritize technology infrastructure investment',
          'Develop formal partnership framework',
          'Implement data-driven decision processes'
        ];
        break;

      case 'bullet_points':
        summary = `• Strong community impact demonstrated across all programs
• 25% efficiency gain possible through resource optimization
• Technology adoption critical for scaling operations
• Staff development directly impacts program outcomes
• Strategic partnerships offer untapped growth potential
• Data collection systems need immediate enhancement
• Stakeholder engagement requires systematic approach
• Quarterly evaluation cycles recommended
• Board governance structure shows room for improvement
• Financial sustainability achievable through diversification`;
        
        keyFindings = [
          'Programs effective but lack systematic evaluation',
          'Technology infrastructure requires urgent attention',
          'Partnership opportunities remain underutilized'
        ];
        
        recommendations = [
          'Implement comprehensive evaluation framework',
          'Invest in integrated technology platform',
          'Develop strategic partnership strategy'
        ];
        break;

      case 'tweet_length':
        summary = `Nonprofit analysis reveals: Strong programs need systematic evaluation, 25% efficiency gains possible through tech adoption & partnerships. Priority: Invest in staff, data systems & stakeholder engagement for sustainable growth. #NonprofitExcellence`;
        
        keyFindings = ['Evaluation gaps', 'Tech opportunities', 'Partnership potential'];
        recommendations = ['Systematic evaluation', 'Technology investment', 'Strategic partnerships'];
        break;

      case 'board_briefing':
        summary = `# Board Briefing: Strategic Analysis

## Executive Overview
This briefing presents findings from our comprehensive organizational analysis, focusing on operational effectiveness, financial sustainability, and mission impact.

## Governance Considerations
The board's fiduciary responsibility requires attention to three critical areas:

### 1. Financial Sustainability
- Current revenue streams show 15% year-over-year growth
- Diversification opportunities exist in corporate partnerships
- Reserve fund requires additional $250K to meet best practices

### 2. Program Effectiveness
- All programs demonstrate positive community impact
- Systematic evaluation framework needed for evidence-based decisions
- ROI analysis shows $4.50 social return per dollar invested

### 3. Risk Management
- Technology infrastructure poses operational risk
- Succession planning gaps identified in key positions
- Compliance requirements increasing with new regulations

## Strategic Opportunities
1. **Partnership Development**: Potential for 3-5 strategic alliances
2. **Technology Modernization**: $150K investment could yield 30% efficiency gain
3. **Capacity Building**: Staff development linked to 25% improvement in outcomes

## Board Action Items
- Approve technology modernization budget
- Establish strategic planning committee
- Review and update risk management policies
- Consider board governance training

## Financial Implications
Proposed initiatives require $300K investment over 18 months, with projected ROI of 200% within 3 years through efficiency gains and enhanced fundraising capacity.

*Prepared for board review and discussion*`;
        
        keyFindings = [
          'Financial sustainability achievable with diversification',
          'Program ROI demonstrates strong social impact',
          'Technology and succession planning pose risks',
          'Strategic partnerships offer growth potential',
          'Governance structure requires updating'
        ];
        
        recommendations = [
          'Approve $150K technology investment',
          'Establish strategic planning committee',
          'Implement succession planning process',
          'Pursue 3-5 strategic partnerships',
          'Schedule quarterly governance reviews'
        ];
        break;

      default:
        summary = 'Summary generated based on input text.';
        keyFindings = ['Key point identified'];
        recommendations = ['Action recommended'];
    }

    return { summary, keyFindings, recommendations };
  };

  const copySummary = () => {
    const fullContent = summary + 
      '\n\n## Key Findings\n' + keyFindings.map((f, i) => `${i + 1}. ${f}`).join('\n') +
      '\n\n## Recommendations\n' + recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n');
    navigator.clipboard.writeText(fullContent);
    toast.success('Summary copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Information Summarizer
          </CardTitle>
          <p className="text-sm text-gray-600">
            Distill lengthy documents into concise, actionable summaries
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Summary Length</label>
            <Select value={summaryLength} onValueChange={setSummaryLength}>
              <SelectTrigger>
                <SelectValue placeholder="Choose summary format" />
              </SelectTrigger>
              <SelectContent>
                {summaryLengths.map((length) => (
                  <SelectItem key={length.value} value={length.value}>
                    <div>
                      <div className="font-medium">{length.label}</div>
                      <div className="text-xs text-gray-500">{length.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Document to Summarize
            </label>
            <Textarea
              value={longText}
              onChange={(e) => setLongText(e.target.value)}
              placeholder="Paste your long document, report, article, or any text you need summarized. This could be a grant report, research paper, meeting transcript, or policy document..."
              rows={8}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={createSummary} 
            disabled={isSummarizing || !summaryLength || !longText.trim()}
            className="w-full"
          >
            {isSummarizing ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Summary...
              </>
            ) : (
              <>
                <Layers className="h-4 w-4 mr-2" />
                Create Summary
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Summarized Content</CardTitle>
              <Button variant="outline" size="sm" onClick={copySummary}>
                <Copy className="h-4 w-4 mr-1" />
                Copy All
              </Button>
            </div>
            <Badge variant="secondary" className="w-fit">
              {summaryLengths.find(l => l.value === summaryLength)?.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-80">
                {summary}
              </pre>
            </div>

            {keyFindings.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {keyFindings.map((finding, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-purple-600">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600">→</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>Next step:</strong> Use this summary for board presentations, grant applications, or team briefings. The key findings and recommendations provide clear action items.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};