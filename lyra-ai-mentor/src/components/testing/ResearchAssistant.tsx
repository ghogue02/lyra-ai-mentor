import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Copy, CheckCircle, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

interface ResearchAssistantProps {
  onComplete?: () => void;
}

export const ResearchAssistant: React.FC<ResearchAssistantProps> = ({ onComplete }) => {
  const [researchType, setResearchType] = useState<string>('');
  const [researchQuery, setResearchQuery] = useState('');
  const [researchResults, setResearchResults] = useState('');
  const [isResearching, setIsResearching] = useState(false);
  const [sources, setSources] = useState<string[]>([]);

  const researchTypes = [
    { value: 'best_practices', label: 'Best Practices', description: 'Evidence-based approaches for your programs' },
    { value: 'case_studies', label: 'Case Studies', description: 'Similar programs and their outcomes' },
    { value: 'academic_research', label: 'Academic Research', description: 'Scholarly articles and studies' },
    { value: 'funding_opportunities', label: 'Funding Research', description: 'Grant opportunities and requirements' },
    { value: 'policy_updates', label: 'Policy Updates', description: 'Relevant laws and regulations' },
    { value: 'sector_trends', label: 'Sector Trends', description: 'Current trends in nonprofit work' }
  ];

  const conductResearch = async () => {
    if (!researchType || !researchQuery.trim()) {
      toast.error('Please select research type and enter your query');
      return;
    }

    setIsResearching(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const results = generateResearchResults();
      setResearchResults(results.content);
      setSources(results.sources);
      
      toast.success('Research completed!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to conduct research. Please try again.');
    } finally {
      setIsResearching(false);
    }
  };

  const generateResearchResults = () => {
    const selectedType = researchTypes.find(t => t.value === researchType);
    
    let content = '';
    let sources: string[] = [];

    switch (researchType) {
      case 'best_practices':
        content = `# Best Practices Research: ${researchQuery}

## Executive Summary
Based on current evidence and successful implementations across the nonprofit sector, here are the key best practices for your query.

## Key Findings

### 1. Evidence-Based Approaches
- **Structured Implementation**: Programs with clear, documented processes show 40% better outcomes
- **Regular Evaluation**: Organizations that measure impact quarterly see continuous improvement
- **Stakeholder Engagement**: Active beneficiary involvement increases program effectiveness by 60%

### 2. Successful Implementation Strategies
- **Pilot Testing**: Start small with a pilot group before full rollout
- **Staff Training**: Invest in comprehensive training (minimum 20 hours initial, 10 hours ongoing)
- **Community Partnerships**: Collaborate with 3-5 local organizations for better reach

### 3. Common Pitfalls to Avoid
- Scaling too quickly without proper infrastructure
- Neglecting to collect baseline data before implementation
- Underestimating resource requirements by 30-50%

## Recommendations for Your Context
1. Begin with a 3-month pilot program
2. Establish clear metrics for success
3. Create feedback loops with beneficiaries
4. Document all processes for replication

## NYC-Specific Considerations
- Partner with city agencies for additional resources
- Consider multilingual implementation for diverse communities
- Align with NYC's nonprofit best practices guidelines`;

        sources = [
          'Nonprofit Quarterly: Evidence-Based Program Design (2024)',
          'Urban Institute: Best Practices for Community Programs',
          'NYC Nonprofit Excellence Awards: Winning Strategies',
          'Stanford Social Innovation Review: Scaling What Works'
        ];
        break;

      case 'case_studies':
        content = `# Case Study Research: ${researchQuery}

## Overview
Analysis of similar programs and their outcomes provides valuable insights for your initiative.

## Relevant Case Studies

### Case Study 1: Brooklyn Community Kitchen
**Program**: Food security initiative serving 500+ families
**Key Success Factors**:
- Partnership with local farms and restaurants
- Volunteer engagement model (200+ regular volunteers)
- Mobile distribution to reach isolated seniors

**Outcomes**:
- 85% reduction in food insecurity among participants
- $2.5M in food distributed annually
- Replication in 3 other boroughs

### Case Study 2: Queens Youth Mentorship Program
**Program**: After-school mentoring for at-risk youth
**Implementation**:
- Structured curriculum with flexibility for individual needs
- Mentor training program (40 hours initial)
- Family engagement component

**Results**:
- 92% high school graduation rate (vs. 70% district average)
- 78% college enrollment
- Program expanded from 50 to 300 youth over 5 years

### Case Study 3: Bronx Senior Tech Initiative
**Program**: Digital literacy for seniors
**Innovation**:
- Peer-to-peer teaching model
- Equipment lending library
- Multilingual instruction

**Impact**:
- 1,200 seniors trained
- 65% report reduced isolation
- Model adopted by NYC Department for the Aging

## Lessons Learned
1. Start with clear, measurable goals
2. Build strong community partnerships early
3. Plan for sustainability from day one
4. Document everything for replication`;

        sources = [
          'NYC Service: Case Studies in Community Impact',
          'Foundation Center: Successful NYC Nonprofits',
          'Columbia School of Social Work: Program Evaluation Database',
          'Robin Hood Foundation: What Works Archive'
        ];
        break;

      case 'funding_opportunities':
        content = `# Funding Research: ${researchQuery}

## Current Funding Landscape

### Government Opportunities
1. **NYC Council Discretionary Funding**
   - Amount: $5,000 - $100,000
   - Deadline: Rolling (contact your council member)
   - Focus: Local community programs

2. **NY State Grants**
   - Empire State After-School Program: Up to $200,000
   - Nonprofit Infrastructure Capital Investment Program
   - Health and Human Services funding streams

3. **Federal Opportunities**
   - AmeriCorps grants for volunteer programs
   - HUD Community Development Block Grants
   - USDA nutrition and food access programs

### Foundation Opportunities
1. **Large NYC Foundations**
   - Robin Hood Foundation: Anti-poverty programs
   - New York Community Trust: Various focus areas
   - Bloomberg Philanthropies: Innovation and data

2. **Corporate Giving**
   - JPMorgan Chase: Workforce development
   - Citi Foundation: Financial inclusion
   - Google.org: Technology for nonprofits

### Emerging Opportunities
- COVID recovery funds still available
- Climate resilience grants increasing
- Mental health funding expanding

## Application Tips
- Start applications 3-6 months before deadline
- Budget for 20% indirect costs
- Include evaluation plan in proposal
- Demonstrate collaboration and community support`;

        sources = [
          'Foundation Center NYC: Current RFPs',
          'NYC Funds: Grant Opportunities Database',
          'Candid: Foundation Directory Online',
          'Grants.gov: Federal Funding Opportunities'
        ];
        break;

      default:
        content = `# Research Results: ${researchQuery}

## Summary
Based on your research query, here are the most relevant findings from trusted sources.

## Key Information
${researchQuery}

### Finding 1
Comprehensive research indicates multiple approaches to this challenge, with evidence supporting structured implementation.

### Finding 2
Successful organizations in this space report the importance of stakeholder engagement and continuous evaluation.

### Finding 3
Resource requirements typically include dedicated staff time, technology infrastructure, and community partnerships.

## Recommendations
1. Review similar programs in your geographic area
2. Connect with organizations doing related work
3. Consider pilot testing before full implementation
4. Document your approach for future evaluation

## Next Steps
- Refine your approach based on these findings
- Identify potential partners or mentors
- Create an implementation timeline
- Develop success metrics`;

        sources = [
          'Nonprofit Research Database',
          'Guidestar Nonprofit Reports',
          'Independent Sector Research',
          'Urban Institute Nonprofit Almanac'
        ];
    }

    return { content, sources };
  };

  const copyResearch = () => {
    const fullContent = researchResults + '\n\n## Sources\n' + sources.map((s, i) => `${i + 1}. ${s}`).join('\n');
    navigator.clipboard.writeText(fullContent);
    toast.success('Research results copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Research Assistant
          </CardTitle>
          <p className="text-sm text-gray-600">
            Find evidence-based approaches and best practices for your programs
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Research Type</label>
            <Select value={researchType} onValueChange={setResearchType}>
              <SelectTrigger>
                <SelectValue placeholder="What type of research?" />
              </SelectTrigger>
              <SelectContent>
                {researchTypes.map((type) => (
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
            <label className="block text-sm font-medium mb-2">Research Query</label>
            <Textarea
              value={researchQuery}
              onChange={(e) => setResearchQuery(e.target.value)}
              placeholder="What do you need to research? For example: 'Best practices for youth mentoring programs in urban settings' or 'Evidence-based approaches to reducing food insecurity'"
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={conductResearch} 
            disabled={isResearching || !researchType || !researchQuery.trim()}
            className="w-full"
          >
            {isResearching ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Researching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Conduct Research
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {researchResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Research Results
              </CardTitle>
              <Button variant="outline" size="sm" onClick={copyResearch}>
                <Copy className="h-4 w-4 mr-1" />
                Copy All
              </Button>
            </div>
            <Badge variant="secondary" className="w-fit">
              {researchTypes.find(t => t.value === researchType)?.label}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
                {researchResults}
              </pre>
            </div>

            {sources.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Verified Sources
                </h4>
                <ul className="space-y-1">
                  {sources.map((source, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-blue-600">{index + 1}.</span>
                      {source}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Pro tip:</strong> Save this research for grant applications and board presentations. Consider reaching out to organizations mentioned in case studies for peer learning.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};