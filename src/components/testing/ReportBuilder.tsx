import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, Download, CheckCircle, TrendingUp, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface ReportBuilderProps {
  onComplete?: () => void;
}

interface ReportSection {
  title: string;
  content: string;
  dataPoints?: DataPoint[];
  visualSuggestion?: string;
}

interface DataPoint {
  label: string;
  value: string | number;
  change?: string;
  context?: string;
}

interface Report {
  title: string;
  period: string;
  executiveSummary: string;
  sections: ReportSection[];
  conclusions: string[];
  nextSteps: string[];
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ onComplete }) => {
  const [reportType, setReportType] = useState<string>('');
  const [reportPeriod, setReportPeriod] = useState<string>('');
  const [keyData, setKeyData] = useState('');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [report, setReport] = useState<Report | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const reportTypes = [
    { value: 'annual_report', label: 'Annual Report', description: 'Comprehensive yearly overview' },
    { value: 'grant_report', label: 'Grant Report', description: 'Funder-specific outcomes' },
    { value: 'board_report', label: 'Board Report', description: 'Executive summary for board' },
    { value: 'program_report', label: 'Program Report', description: 'Single program analysis' },
    { value: 'financial_report', label: 'Financial Report', description: 'Budget and financial health' },
    { value: 'impact_report', label: 'Impact Report', description: 'Community outcomes focus' },
    { value: 'quarterly_report', label: 'Quarterly Report', description: 'Q1-Q4 progress update' }
  ];

  const periods = [
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi_annual', label: 'Semi-Annual' },
    { value: 'annual', label: 'Annual' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const audiences = [
    { value: 'board', label: 'Board of Directors' },
    { value: 'funders', label: 'Funders & Grantors' },
    { value: 'donors', label: 'Donors & Supporters' },
    { value: 'staff', label: 'Internal Staff' },
    { value: 'community', label: 'Community & Public' },
    { value: 'partners', label: 'Partner Organizations' }
  ];

  const buildReport = async () => {
    if (!reportType || !reportPeriod || !targetAudience || !keyData.trim()) {
      toast.error('Please complete all fields');
      return;
    }

    setIsBuilding(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateReport();
      setReport(result);
      
      toast.success('Report generated successfully!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate report. Please try again.');
    } finally {
      setIsBuilding(false);
    }
  };

  const generateReport = (): Report => {
    const templates: Record<string, () => Report> = {
      annual_report: () => ({
        title: '2024 Annual Report - Building Stronger Communities Together',
        period: 'January 1 - December 31, 2024',
        executiveSummary: `This year marked a transformative period for our organization as we expanded our reach, deepened our impact, and strengthened our financial foundation. Despite ongoing challenges in our communities, we achieved remarkable growth across all program areas while maintaining operational efficiency. Our dedicated team, volunteers, and supporters made it possible to serve 12,847 individuals—a 22% increase from last year—while reducing our cost per beneficiary by 15%. This report details our accomplishments, challenges overcome, and vision for the future.`,
        sections: [
          {
            title: 'Mission Impact',
            content: 'Our programs touched lives across all five NYC boroughs, with particular growth in underserved communities. We launched three new initiatives, expanded four existing programs, and formed strategic partnerships that amplified our reach.',
            dataPoints: [
              { label: 'Individuals Served', value: '12,847', change: '+22%', context: 'Highest number in organization history' },
              { label: 'Programs Offered', value: '15', change: '+3 new', context: 'Including youth mentorship and job training' },
              { label: 'Community Partners', value: '67', change: '+18', context: 'Strengthened collaborative network' },
              { label: 'Volunteer Hours', value: '34,521', change: '+31%', context: 'Equivalent to 16.6 FTE staff' }
            ],
            visualSuggestion: 'Bar chart comparing year-over-year program growth'
          },
          {
            title: 'Financial Performance',
            content: 'Strong fiscal management and diversified revenue streams ensured sustainable growth. We ended the year with a modest surplus while investing in critical infrastructure and staff development.',
            dataPoints: [
              { label: 'Total Revenue', value: '$3,247,891', change: '+24%', context: 'Exceeded budget by 8%' },
              { label: 'Total Expenses', value: '$3,145,672', change: '+19%', context: '78% to programs' },
              { label: 'Net Assets', value: '$892,456', change: '+13%', context: '3.4 months operating reserve' },
              { label: 'Cost per Beneficiary', value: '$245', change: '-15%', context: 'Improved efficiency' }
            ],
            visualSuggestion: 'Pie chart showing expense allocation'
          },
          {
            title: 'Program Highlights',
            content: 'Each program area showed significant growth and impact. Youth services saw the highest expansion with our new after-school STEM program reaching 234 students in its first year.',
            dataPoints: [
              { label: 'Youth Programs', value: '2,341 served', change: '+34%', context: '89% improved academic performance' },
              { label: 'Adult Education', value: '1,876 enrolled', change: '+18%', context: '67% found employment' },
              { label: 'Food Security', value: '456,789 meals', change: '+42%', context: 'Opened 2 new distribution sites' },
              { label: 'Housing Support', value: '342 families', change: '+28%', context: '94% remained housed' }
            ],
            visualSuggestion: 'Dashboard with program-specific metrics'
          },
          {
            title: 'Donor & Volunteer Engagement',
            content: 'Our community of supporters grew stronger with improved donor retention and record volunteer participation. Monthly giving increased 45%, providing stable funding for core programs.',
            dataPoints: [
              { label: 'Active Donors', value: '3,421', change: '+19%', context: '68% retention rate' },
              { label: 'Monthly Donors', value: '456', change: '+45%', context: 'Sustainable revenue growth' },
              { label: 'Major Gifts', value: '$567,890', change: '+31%', context: '12 gifts over $10,000' },
              { label: 'Active Volunteers', value: '892', change: '+26%', context: 'Average 38.7 hours/volunteer' }
            ],
            visualSuggestion: 'Line graph showing donor growth trends'
          }
        ],
        conclusions: [
          'Achieved record program participation while improving operational efficiency',
          'Diversified funding sources reduced reliance on any single revenue stream',
          'Strong volunteer engagement multiplied our impact across communities',
          'Technology investments improved service delivery and data tracking',
          'Board governance and strategic planning positioned us for sustainable growth'
        ],
        nextSteps: [
          'Launch capital campaign for new community center in Queens',
          'Expand mental health services to meet growing demand',
          'Implement new CRM system for improved donor stewardship',
          'Develop 3-year strategic plan with community input',
          'Strengthen evaluation framework to better measure long-term outcomes'
        ]
      }),

      grant_report: () => ({
        title: `Grant Progress Report - ${keyData}`,
        period: reportPeriod === 'quarterly' ? 'Q3 2024' : 'Year 1 Progress',
        executiveSummary: `This report provides a comprehensive update on our progress toward achieving the goals outlined in our grant proposal. We are pleased to report that all major milestones have been met or exceeded, with particularly strong outcomes in participant engagement and program quality metrics. The grant funding has been instrumental in scaling our impact and reaching underserved populations as intended.`,
        sections: [
          {
            title: 'Grant Objectives & Progress',
            content: 'All four primary objectives outlined in the grant proposal are on track or ahead of schedule. We have successfully implemented the planned activities and are seeing positive outcomes across all metrics.',
            dataPoints: [
              { label: 'Objective 1: Serve 500 youth', value: '567 enrolled', change: '113%', context: 'Exceeded target by 67 participants' },
              { label: 'Objective 2: 80% completion rate', value: '84%', change: '+4%', context: 'Above target threshold' },
              { label: 'Objective 3: Partner schools', value: '12 of 10', change: '120%', context: 'Expanded beyond initial goal' },
              { label: 'Objective 4: Parent engagement', value: '78%', change: '-2%', context: 'Slightly below 80% target' }
            ],
            visualSuggestion: 'Progress bars showing % completion for each objective'
          },
          {
            title: 'Budget Utilization',
            content: 'Grant funds have been carefully managed according to the approved budget. Minor reallocations were made within allowable guidelines to maximize impact.',
            dataPoints: [
              { label: 'Total Grant Amount', value: '$250,000', context: 'Year 1 funding' },
              { label: 'Funds Expended', value: '$187,500', context: '75% at 75% time elapsed' },
              { label: 'Personnel Costs', value: '$112,500', context: 'As budgeted' },
              { label: 'Program Expenses', value: '$75,000', context: '$5,000 under budget' }
            ],
            visualSuggestion: 'Budget vs. actual comparison chart'
          },
          {
            title: 'Outcome Measurements',
            content: 'Using the evaluation framework approved in our proposal, we have documented significant positive outcomes for program participants.',
            dataPoints: [
              { label: 'Academic Improvement', value: '73%', context: 'Increased GPA by 0.5+' },
              { label: 'School Attendance', value: '91%', context: 'Up from 82% baseline' },
              { label: 'Parent Satisfaction', value: '4.6/5', context: 'Survey of 234 parents' },
              { label: 'Teacher Feedback', value: '89% positive', context: 'Improved classroom behavior' }
            ]
          }
        ],
        conclusions: [
          'Grant objectives are being met or exceeded in most areas',
          'Budget management has been effective with funds on track',
          'Strong partnerships with schools enhanced program delivery',
          'Parent engagement remains an area for continued focus',
          'Evaluation data supports program effectiveness'
        ],
        nextSteps: [
          'Implement new parent engagement strategies in Q4',
          'Submit Year 2 continuation application by deadline',
          'Conduct mid-program evaluation with external evaluator',
          'Share best practices at funder convening in November',
          'Prepare for site visit scheduled for December'
        ]
      }),

      board_report: () => ({
        title: 'Executive Report to the Board of Directors',
        period: 'Q3 2024 Update',
        executiveSummary: `This quarter demonstrated strong organizational performance across all key metrics. Revenue exceeded projections by 12%, program participation reached record levels, and we maintained fiscal discipline while investing in strategic priorities. The leadership team has successfully navigated challenges including staff transitions and increased service demand. Board engagement remains high with 100% giving participation and active committee involvement.`,
        sections: [
          {
            title: 'Strategic Priority Progress',
            content: 'Significant advancement on all five strategic priorities adopted in January. Digital transformation initiative ahead of schedule with new systems improving efficiency.',
            dataPoints: [
              { label: 'Priority 1: Growth', value: 'On Track', context: '22% increase in services' },
              { label: 'Priority 2: Sustainability', value: 'Ahead', context: 'Reserves increased to 3.4 months' },
              { label: 'Priority 3: Quality', value: 'On Track', context: '91% satisfaction scores' },
              { label: 'Priority 4: Innovation', value: 'Ahead', context: '3 new programs launched' }
            ]
          },
          {
            title: 'Financial Dashboard',
            content: 'Strong financial position with diversified revenue and controlled expenses. Cash position healthy with positive trend.',
            dataPoints: [
              { label: 'YTD Revenue', value: '$2.4M', change: '+12% vs budget', context: 'Driven by major gifts' },
              { label: 'YTD Expenses', value: '$2.3M', change: '+8% vs budget', context: 'Planned program expansion' },
              { label: 'Cash on Hand', value: '$456K', change: '+$78K', context: '2.4 months operations' },
              { label: 'Accounts Receivable', value: '$234K', context: 'Government contracts current' }
            ]
          },
          {
            title: 'Risk Assessment',
            content: 'Overall risk profile remains moderate with active mitigation strategies in place. No critical issues identified.',
            dataPoints: [
              { label: 'Financial Risk', value: 'Low', context: 'Diversified revenue streams' },
              { label: 'Operational Risk', value: 'Moderate', context: 'Staff capacity constraints' },
              { label: 'Compliance Risk', value: 'Low', context: 'Clean audit, current filings' },
              { label: 'Reputational Risk', value: 'Low', context: 'Positive media coverage' }
            ]
          }
        ],
        conclusions: [
          'Organization performing above plan in most areas',
          'Financial position strong with improving trends',
          'Strategic priorities advancing on schedule',
          'Risk management effective with no critical issues',
          'Board governance and oversight functioning well'
        ],
        nextSteps: [
          'Review and approve FY2025 budget at November meeting',
          'Complete CEO performance review by December',
          'Launch board recruitment for 2 open positions',
          'Schedule strategic planning retreat for January',
          'Approve capital campaign feasibility study'
        ]
      })
    };

    const template = templates[reportType] || templates.annual_report;
    return template();
  };

  const downloadReport = () => {
    if (!report) return;
    
    let markdown = `# ${report.title}\n\n`;
    markdown += `**Period:** ${report.period}\n\n`;
    markdown += `## Executive Summary\n\n${report.executiveSummary}\n\n`;
    
    report.sections.forEach(section => {
      markdown += `## ${section.title}\n\n`;
      markdown += `${section.content}\n\n`;
      
      if (section.dataPoints && section.dataPoints.length > 0) {
        markdown += `### Key Metrics\n\n`;
        section.dataPoints.forEach(dp => {
          markdown += `- **${dp.label}:** ${dp.value}`;
          if (dp.change) markdown += ` (${dp.change})`;
          if (dp.context) markdown += ` - ${dp.context}`;
          markdown += '\n';
        });
        markdown += '\n';
      }
    });
    
    markdown += `## Conclusions\n\n`;
    report.conclusions.forEach(conclusion => {
      markdown += `- ${conclusion}\n`;
    });
    
    markdown += `\n## Next Steps\n\n`;
    report.nextSteps.forEach(step => {
      markdown += `- ${step}\n`;
    });
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    
    toast.success('Report downloaded!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Report Builder
          </CardTitle>
          <p className="text-sm text-gray-600">
            Create professional reports with data-driven insights
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Report Period</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Who will read this?" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience.value} value={audience.value}>
                      {audience.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Key Data & Highlights</label>
            <Textarea
              value={keyData}
              onChange={(e) => setKeyData(e.target.value)}
              placeholder="Enter key metrics, achievements, and data points to include. For example: 'Served 2,341 individuals, 89% program completion rate, $1.2M raised, 15 new partnerships formed...'"
              rows={4}
              className="resize-none"
            />
          </div>

          <Button 
            onClick={buildReport} 
            disabled={isBuilding || !reportType || !reportPeriod || !targetAudience || !keyData.trim()}
            className="w-full"
          >
            {isBuilding ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Building Report...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {report && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{report.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{report.period}</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <h3 className="text-lg font-medium mb-3">Executive Summary</h3>
                <p className="text-gray-700 leading-relaxed">{report.executiveSummary}</p>
              </div>
            </CardContent>
          </Card>

          {report.sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">{section.content}</p>
                
                {section.dataPoints && section.dataPoints.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.dataPoints.map((dp, dpIndex) => (
                      <div key={dpIndex} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">{dp.label}</p>
                            <p className="text-2xl font-bold text-blue-600 mt-1">{dp.value}</p>
                          </div>
                          {dp.change && (
                            <Badge className={dp.change.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                              {dp.change}
                            </Badge>
                          )}
                        </div>
                        {dp.context && (
                          <p className="text-xs text-gray-500 mt-2">{dp.context}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.visualSuggestion && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Visualization suggestion:</strong> {section.visualSuggestion}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Conclusions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.conclusions.map((conclusion, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm">{conclusion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {report.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">→</span>
                    <span className="text-sm">{step}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};