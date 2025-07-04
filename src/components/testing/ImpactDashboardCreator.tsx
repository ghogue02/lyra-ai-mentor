import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { LayoutDashboard, Clock, Download, Eye, Users, DollarSign, Heart, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface ImpactDashboardCreatorProps {
  onComplete?: () => void;
}

interface DashboardSection {
  title: string;
  metrics: Metric[];
  visualType: string;
  narrative: string;
}

interface Metric {
  name: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

interface Dashboard {
  title: string;
  period: string;
  sections: DashboardSection[];
  keyTakeaways: string[];
  callToAction: string;
}

export const ImpactDashboardCreator: React.FC<ImpactDashboardCreatorProps> = ({ onComplete }) => {
  const [dashboardType, setDashboardType] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<string>('');
  const [organizationName, setOrganizationName] = useState('');
  const [focusArea, setFocusArea] = useState<string>('');
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const dashboardTypes = [
    { value: 'annual_impact', label: 'Annual Impact Report', description: 'Year-end comprehensive view' },
    { value: 'quarterly_update', label: 'Quarterly Update', description: 'Q1-Q4 progress report' },
    { value: 'program_specific', label: 'Program Dashboard', description: 'Single program deep dive' },
    { value: 'donor_impact', label: 'Donor Impact Report', description: 'Show donor contributions' },
    { value: 'board_presentation', label: 'Board Dashboard', description: 'Executive-level metrics' },
    { value: 'grant_report', label: 'Grant Report', description: 'Funder-specific outcomes' }
  ];

  const timePeriods = [
    { value: 'last_month', label: 'Last Month' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'year_to_date', label: 'Year to Date' },
    { value: 'last_year', label: 'Last Year' },
    { value: 'custom', label: 'Custom Period' }
  ];

  const focusAreas = [
    { value: 'education', label: 'Education & Literacy' },
    { value: 'health', label: 'Health & Wellness' },
    { value: 'youth', label: 'Youth Development' },
    { value: 'hunger', label: 'Food Security' },
    { value: 'housing', label: 'Housing & Shelter' },
    { value: 'environment', label: 'Environment' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'general', label: 'Multiple Programs' }
  ];

  const createDashboard = async () => {
    if (!dashboardType || !timePeriod || !organizationName.trim() || !focusArea) {
      toast.error('Please complete all fields');
      return;
    }

    setIsCreating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateDashboard();
      setDashboard(result);
      
      toast.success('Impact dashboard created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to create dashboard. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const generateDashboard = (): Dashboard => {
    const periodLabel = timePeriods.find(p => p.value === timePeriod)?.label || 'This Period';
    
    // Generate different dashboard content based on type
    const dashboardTemplates: Record<string, () => Dashboard> = {
      annual_impact: () => ({
        title: `${organizationName} - 2024 Annual Impact Report`,
        period: 'January 1 - December 31, 2024',
        sections: [
          {
            title: 'Lives Transformed',
            metrics: [
              { 
                name: 'Total Individuals Served', 
                value: '12,847', 
                change: '+22%',
                icon: <Users className="h-5 w-5" />,
                color: 'text-blue-600'
              },
              { 
                name: 'Families Supported', 
                value: '3,421', 
                change: '+18%',
                icon: <Heart className="h-5 w-5" />,
                color: 'text-purple-600'
              },
              { 
                name: 'Communities Reached', 
                value: '47', 
                change: '+8',
                icon: <LayoutDashboard className="h-5 w-5" />,
                color: 'text-green-600'
              },
              { 
                name: 'Volunteer Hours', 
                value: '28,934', 
                change: '+31%',
                icon: <Clock className="h-5 w-5" />,
                color: 'text-orange-600'
              }
            ],
            visualType: 'metric_cards',
            narrative: 'This year, we expanded our reach across all five NYC boroughs, with particularly strong growth in underserved communities in Queens and the Bronx.'
          },
          {
            title: 'Program Outcomes',
            metrics: [
              { name: 'Youth in After-School Programs', value: '892', change: '+145', icon: <Users className="h-5 w-5" />, color: 'text-blue-600' },
              { name: 'Adults in Job Training', value: '456', change: '+89', icon: <TrendingUp className="h-5 w-5" />, color: 'text-green-600' },
              { name: 'Meals Distributed', value: '156,789', change: '+34,521', icon: <Heart className="h-5 w-5" />, color: 'text-red-600' },
              { name: 'Housing Placements', value: '234', change: '+67', icon: <LayoutDashboard className="h-5 w-5" />, color: 'text-purple-600' }
            ],
            visualType: 'bar_chart',
            narrative: 'Our programs showed consistent growth, with youth services seeing the highest increase due to expanded partnerships with NYC schools.'
          },
          {
            title: 'Financial Stewardship',
            metrics: [
              { name: 'Total Revenue', value: '$3.2M', change: '+24%', icon: <DollarSign className="h-5 w-5" />, color: 'text-green-600' },
              { name: 'Program Expenses', value: '78%', change: '+3%', icon: <TrendingUp className="h-5 w-5" />, color: 'text-blue-600' },
              { name: 'Cost per Beneficiary', value: '$198', change: '-12%', icon: <DollarSign className="h-5 w-5" />, color: 'text-purple-600' },
              { name: 'Donor Retention', value: '68%', change: '+5%', icon: <Heart className="h-5 w-5" />, color: 'text-orange-600' }
            ],
            visualType: 'pie_chart',
            narrative: 'Strong financial management allowed us to reduce costs while expanding services, with 78 cents of every dollar going directly to programs.'
          }
        ],
        keyTakeaways: [
          'Record number of individuals served with 22% year-over-year growth',
          'Successful expansion into 8 new NYC neighborhoods',
          'Improved efficiency reduced cost per beneficiary by 12%',
          'Strong donor retention indicates high satisfaction with impact',
          'Youth programs showed exceptional growth with 145 new participants'
        ],
        callToAction: 'Your support made this possible. Help us reach even more New Yorkers in 2025.'
      }),

      quarterly_update: () => ({
        title: `${organizationName} - Q3 2024 Impact Update`,
        period: 'July 1 - September 30, 2024',
        sections: [
          {
            title: 'Quarter at a Glance',
            metrics: [
              { name: 'People Served', value: '3,421', change: '+15% vs Q2', icon: <Users className="h-5 w-5" />, color: 'text-blue-600' },
              { name: 'Programs Active', value: '12', change: 'Stable', icon: <LayoutDashboard className="h-5 w-5" />, color: 'text-green-600' },
              { name: 'Funds Raised', value: '$847K', change: '+28% vs Q2', icon: <DollarSign className="h-5 w-5" />, color: 'text-purple-600' },
              { name: 'New Partnerships', value: '7', change: '+4', icon: <Heart className="h-5 w-5" />, color: 'text-orange-600' }
            ],
            visualType: 'metric_cards',
            narrative: 'Q3 showed strong momentum with our summer programs at full capacity and successful back-to-school initiatives.'
          },
          {
            title: 'Program Highlights',
            metrics: [
              { name: 'Summer Camp Attendees', value: '234', icon: <Users className="h-5 w-5" />, color: 'text-blue-600' },
              { name: 'Back-to-School Kits', value: '1,856', icon: <Heart className="h-5 w-5" />, color: 'text-green-600' },
              { name: 'Job Placements', value: '67', icon: <TrendingUp className="h-5 w-5" />, color: 'text-purple-600' },
              { name: 'Volunteer Hours', value: '4,234', icon: <Clock className="h-5 w-5" />, color: 'text-orange-600' }
            ],
            visualType: 'progress_bars',
            narrative: 'Our summer youth employment program achieved 95% placement rate, while back-to-school drives served every registered family.'
          }
        ],
        keyTakeaways: [
          'Summer programs operated at 98% capacity',
          'Successful launch of new corporate partnership program',
          'Back-to-school initiative served 1,856 students',
          'Volunteer engagement increased 32% over Q2',
          'Set stage for strong Q4 fundraising season'
        ],
        callToAction: 'Join us for our Q4 initiatives and year-end giving campaign.'
      }),

      donor_impact: () => ({
        title: `Your Impact Report - ${organizationName}`,
        period: periodLabel,
        sections: [
          {
            title: 'Your Generosity at Work',
            metrics: [
              { name: 'Your Total Giving', value: '$2,500', icon: <DollarSign className="h-5 w-5" />, color: 'text-green-600' },
              { name: 'Lives You\'ve Touched', value: '127', icon: <Heart className="h-5 w-5" />, color: 'text-red-600' },
              { name: 'Programs Supported', value: '4', icon: <LayoutDashboard className="h-5 w-5" />, color: 'text-blue-600' },
              { name: 'Meals Provided', value: '625', icon: <Users className="h-5 w-5" />, color: 'text-purple-600' }
            ],
            visualType: 'metric_cards',
            narrative: 'Your continued support has made a profound difference in the lives of NYC families. Here\'s how your donations created lasting change.'
          },
          {
            title: 'Stories of Transformation',
            metrics: [
              { name: 'Maria\'s Story', value: 'Housing secured after 6 months homeless', icon: <Heart className="h-5 w-5" />, color: 'text-blue-600' },
              { name: 'James\'s Journey', value: 'Graduated job training, now employed', icon: <TrendingUp className="h-5 w-5" />, color: 'text-green-600' },
              { name: 'Sofia\'s Success', value: 'First in family to attend college', icon: <Users className="h-5 w-5" />, color: 'text-purple-600' }
            ],
            visualType: 'story_cards',
            narrative: 'These are just three of the 127 individuals whose lives you\'ve directly impacted through your generosity.'
          }
        ],
        keyTakeaways: [
          'Your donations provided 625 nutritious meals',
          'You helped 12 families avoid eviction',
          'Your support funded 150 hours of tutoring',
          'You\'re among our top 15% most loyal donors',
          'Together with 1,243 other donors, you created community-wide change'
        ],
        callToAction: 'Continue your impact with a monthly gift to provide steady support year-round.'
      })
    };

    // Get template or use default
    const template = dashboardTemplates[dashboardType] || dashboardTemplates.annual_impact;
    return template();
  };

  const exportDashboard = () => {
    if (!dashboard) return;
    
    // Create a simple HTML export
    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>${dashboard.title}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 1200px; margin: auto; }
    h1 { color: #1e40af; }
    h2 { color: #1f2937; margin-top: 30px; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-value { font-size: 24px; font-weight: bold; color: #1e40af; }
    .metric-label { color: #6b7280; }
    .section { margin: 30px 0; padding: 20px; background: #f9fafb; border-radius: 8px; }
    .takeaway { margin: 10px 0; padding-left: 20px; }
    .cta { background: #3b82f6; color: white; padding: 15px 30px; border-radius: 8px; text-align: center; margin-top: 30px; }
  </style>
</head>
<body>
  <h1>${dashboard.title}</h1>
  <p><strong>Period:</strong> ${dashboard.period}</p>
  
  ${dashboard.sections.map(section => `
    <div class="section">
      <h2>${section.title}</h2>
      <p>${section.narrative}</p>
      ${section.metrics.map(metric => `
        <div class="metric">
          <div class="metric-value">${metric.value}</div>
          <div class="metric-label">${metric.name}</div>
        </div>
      `).join('')}
    </div>
  `).join('')}
  
  <h2>Key Takeaways</h2>
  ${dashboard.keyTakeaways.map(takeaway => `
    <div class="takeaway">• ${takeaway}</div>
  `).join('')}
  
  <div class="cta">
    <p>${dashboard.callToAction}</p>
  </div>
</body>
</html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `impact-dashboard-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    
    toast.success('Dashboard exported!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-indigo-600" />
            Impact Dashboard Creator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Build beautiful dashboards to showcase your impact
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Dashboard Type</label>
              <Select value={dashboardType} onValueChange={setDashboardType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dashboard type" />
                </SelectTrigger>
                <SelectContent>
                  {dashboardTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Time Period</label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  {timePeriods.map((period) => (
                    <SelectItem key={period.value} value={period.value}>
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <Input
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="Your Nonprofit Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Focus Area</label>
              <Select value={focusArea} onValueChange={setFocusArea}>
                <SelectTrigger>
                  <SelectValue placeholder="Primary focus area" />
                </SelectTrigger>
                <SelectContent>
                  {focusAreas.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={createDashboard} 
            disabled={isCreating || !dashboardType || !timePeriod || !organizationName.trim() || !focusArea}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Dashboard...
              </>
            ) : (
              <>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Create Impact Dashboard
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {dashboard && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{dashboard.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{dashboard.period}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" onClick={exportDashboard}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {dashboard.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <p className="text-sm text-gray-600">{section.narrative}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {section.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className={`${metric.color} mb-2 flex justify-center`}>
                        {metric.icon}
                      </div>
                      <div className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}
                      </div>
                      {metric.change && (
                        <div className="text-sm text-green-600 font-medium">
                          {metric.change}
                        </div>
                      )}
                      <div className="text-sm text-gray-600 mt-1">
                        {metric.name}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Badge variant="outline">
                    Suggested Visual: {section.visualType.replace(/_/g, ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Takeaways</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dashboard.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span className="text-sm">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="pt-6 text-center">
              <p className="text-lg font-medium text-indigo-900 mb-2">
                {dashboard.callToAction}
              </p>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Take Action
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};