
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Star, AlertTriangle, CheckCircle } from 'lucide-react';

interface DataRow {
  name: string;
  amount: string;
  date: string;
  method: string;
  notes: string;
  donorType: 'Major' | 'Mid-level' | 'Regular';
  engagementScore: number;
  yearsActive: number;
  lifetimeGiving: string;
  lastContact: string;
  status: 'VIP' | 'At-Risk' | 'Active' | 'New';
  trend: 'up' | 'down' | 'stable';
}

interface AnimatedDataTableProps {
  title: string;
  data?: DataRow[];
  isVisible: boolean;
  onComplete?: () => void;
}

const defaultData: DataRow[] = [
  {
    name: "Patricia Martinez",
    amount: "$2,500",
    date: "12/15/24",
    method: "Online",
    notes: "Monthly donor, high engagement",
    donorType: "Major",
    engagementScore: 95,
    yearsActive: 4,
    lifetimeGiving: "$24,000",
    lastContact: "12/10/24",
    status: "VIP",
    trend: "up"
  },
  {
    name: "James Chen",
    amount: "$1,000",
    date: "11/22/24",
    method: "Check",
    notes: "Quarterly donor, consistent",
    donorType: "Mid-level",
    engagementScore: 78,
    yearsActive: 2,
    lifetimeGiving: "$8,000",
    lastContact: "11/20/24",
    status: "Active",
    trend: "stable"
  },
  {
    name: "Sarah Williams",
    amount: "$500",
    date: "10/30/24",
    method: "Online",
    notes: "Annual donor, declining",
    donorType: "Regular",
    engagementScore: 45,
    yearsActive: 6,
    lifetimeGiving: "$3,500",
    lastContact: "08/15/24",
    status: "At-Risk",
    trend: "down"
  },
  {
    name: "Michael Rodriguez",
    amount: "$5,000",
    date: "09/18/24",
    method: "Wire",
    notes: "Major donor, lapsed contact",
    donorType: "Major",
    engagementScore: 62,
    yearsActive: 8,
    lifetimeGiving: "$45,000",
    lastContact: "06/22/24",
    status: "At-Risk",
    trend: "down"
  },
  {
    name: "Lisa Thompson",
    amount: "$750",
    date: "12/12/24",
    method: "Online",
    notes: "Monthly donor, growing gifts",
    donorType: "Mid-level",
    engagementScore: 88,
    yearsActive: 3,
    lifetimeGiving: "$12,600",
    lastContact: "12/08/24",
    status: "Active",
    trend: "up"
  },
  {
    name: "David Kim",
    amount: "$150",
    date: "12/01/24",
    method: "Online",
    notes: "New donor, first gift",
    donorType: "Regular",
    engagementScore: 72,
    yearsActive: 0.2,
    lifetimeGiving: "$150",
    lastContact: "12/01/24",
    status: "New",
    trend: "up"
  },
  {
    name: "Jennifer Walsh",
    amount: "$3,200",
    date: "11/28/24",
    method: "Check",
    notes: "Board member, annual pledge",
    donorType: "Major",
    engagementScore: 92,
    yearsActive: 12,
    lifetimeGiving: "$78,000",
    lastContact: "11/25/24",
    status: "VIP",
    trend: "stable"
  },
  {
    name: "Robert Jackson",
    amount: "$425",
    date: "11/15/24",
    method: "Online",
    notes: "Quarterly donor, reliable",
    donorType: "Regular",
    engagementScore: 68,
    yearsActive: 5,
    lifetimeGiving: "$6,800",
    lastContact: "11/10/24",
    status: "Active",
    trend: "stable"
  },
  {
    name: "Amanda Foster",
    amount: "$1,800",
    date: "12/05/24",
    method: "Online",
    notes: "Corporate match, growing",
    donorType: "Mid-level",
    engagementScore: 84,
    yearsActive: 1.5,
    lifetimeGiving: "$5,400",
    lastContact: "12/03/24",
    status: "Active",
    trend: "up"
  },
  {
    name: "Thomas Brown",
    amount: "$95",
    date: "08/20/24",
    method: "Online",
    notes: "Small gifts, infrequent",
    donorType: "Regular",
    engagementScore: 38,
    yearsActive: 7,
    lifetimeGiving: "$1,200",
    lastContact: "05/12/24",
    status: "At-Risk",
    trend: "down"
  },
  {
    name: "Emily Carter",
    amount: "$2,800",
    date: "12/18/24",
    method: "Wire",
    notes: "Event sponsor, annual",
    donorType: "Major",
    engagementScore: 89,
    yearsActive: 6,
    lifetimeGiving: "$18,400",
    lastContact: "12/16/24",
    status: "VIP",
    trend: "up"
  },
  {
    name: "Carlos Mendez",
    amount: "$650",
    date: "11/30/24",
    method: "Check",
    notes: "Local business owner",
    donorType: "Mid-level",
    engagementScore: 75,
    yearsActive: 4,
    lifetimeGiving: "$9,200",
    lastContact: "11/28/24",
    status: "Active",
    trend: "stable"
  },
  {
    name: "Rachel Green",
    amount: "$180",
    date: "12/22/24",
    method: "Online",
    notes: "Young professional, growing",
    donorType: "Regular",
    engagementScore: 82,
    yearsActive: 1,
    lifetimeGiving: "$820",
    lastContact: "12/20/24",
    status: "New",
    trend: "up"
  },
  {
    name: "Daniel Wright",
    amount: "$4,500",
    date: "10/15/24",
    method: "Check",
    notes: "Legacy donor, family foundation",
    donorType: "Major",
    engagementScore: 67,
    yearsActive: 15,
    lifetimeGiving: "$89,000",
    lastContact: "09/30/24",
    status: "At-Risk",
    trend: "down"
  },
  {
    name: "Maria Gonzalez",
    amount: "$320",
    date: "12/14/24",
    method: "Online",
    notes: "Community volunteer",
    donorType: "Regular",
    engagementScore: 91,
    yearsActive: 3,
    lifetimeGiving: "$2,850",
    lastContact: "12/12/24",
    status: "Active",
    trend: "up"
  },
  {
    name: "Kevin O'Brien",
    amount: "$1,200",
    date: "11/08/24",
    method: "Online",
    notes: "Tech worker, monthly gifts",
    donorType: "Mid-level",
    engagementScore: 86,
    yearsActive: 2,
    lifetimeGiving: "$7,800",
    lastContact: "11/05/24",
    status: "Active",
    trend: "up"
  },
  {
    name: "Susan Lee",
    amount: "$75",
    date: "07/12/24",
    method: "Online",
    notes: "Retiree, fixed income",
    donorType: "Regular",
    engagementScore: 42,
    yearsActive: 9,
    lifetimeGiving: "$2,100",
    lastContact: "04/18/24",
    status: "At-Risk",
    trend: "down"
  },
  {
    name: "Jonathan Davis",
    amount: "$3,750",
    date: "12/20/24",
    method: "Wire",
    notes: "Year-end major gift",
    donorType: "Major",
    engagementScore: 94,
    yearsActive: 7,
    lifetimeGiving: "$28,500",
    lastContact: "12/18/24",
    status: "VIP",
    trend: "up"
  },
  {
    name: "Angela White",
    amount: "$890",
    date: "11/25/24",
    method: "Check",
    notes: "Healthcare professional",
    donorType: "Mid-level",
    engagementScore: 79,
    yearsActive: 5,
    lifetimeGiving: "$11,200",
    lastContact: "11/22/24",
    status: "Active",
    trend: "stable"
  },
  {
    name: "Brian Miller",
    amount: "$245",
    date: "12/02/24",
    method: "Online",
    notes: "College graduate, first job",
    donorType: "Regular",
    engagementScore: 76,
    yearsActive: 0.5,
    lifetimeGiving: "$395",
    lastContact: "12/01/24",
    status: "New",
    trend: "up"
  }
];

export const AnimatedDataTable: React.FC<AnimatedDataTableProps> = ({
  title,
  data = defaultData,
  isVisible,
  onComplete
}) => {
  const [visibleRows, setVisibleRows] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setVisibleRows(0);
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    
    const animateRows = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      for (let i = 0; i <= data.length; i++) {
        setVisibleRows(i);
        await new Promise(resolve => setTimeout(resolve, 120));
      }
      
      setIsProcessing(false);
      onComplete?.();
    };

    animateRows();
  }, [isVisible, data.length, onComplete]);

  if (!isVisible) return null;

  const getDonorTypeBadge = (type: string) => {
    const variants = {
      'Major': 'bg-purple-50 text-purple-700 border border-purple-200',
      'Mid-level': 'bg-blue-50 text-blue-700 border border-blue-200',
      'Regular': 'bg-green-50 text-green-700 border border-green-200'
    };
    return variants[type as keyof typeof variants] || variants.Regular;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VIP': return <Star className="w-3 h-3 text-amber-500" />;
      case 'At-Risk': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'New': return <CheckCircle className="w-3 h-3 text-green-500" />;
      default: return <CheckCircle className="w-3 h-3 text-blue-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-600" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-600" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getAmountColor = (amount: string) => {
    const value = parseInt(amount.replace(/[$,]/g, ''));
    if (value >= 2000) return 'text-green-700 font-semibold';
    if (value >= 500) return 'text-blue-700 font-medium';
    return 'text-gray-700';
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VIP': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'At-Risk': return 'bg-red-100 text-red-800 border-red-200';
      case 'New': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="p-6 bg-white border border-gray-300 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-gray-800 font-semibold text-base">{title}</span>
        {isProcessing && (
          <div className="flex gap-1 ml-auto">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
      </div>
      
      <div className="border border-gray-300 rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b-2 border-gray-200 hover:bg-gray-50">
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4 border-r border-gray-200">Donor Name</TableHead>
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4 border-r border-gray-200">Type</TableHead>
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4 border-r border-gray-200">Last Gift</TableHead>
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4 border-r border-gray-200">Date</TableHead>
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4 border-r border-gray-200">Engagement</TableHead>
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4 border-r border-gray-200">Lifetime Value</TableHead>
              <TableHead className="text-sm font-semibold text-gray-700 h-12 px-4">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, visibleRows).map((row, index) => (
              <TableRow 
                key={index}
                className={`opacity-0 animate-fade-in hover:bg-gray-50 transition-colors border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                }`}
                style={{
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <TableCell className="py-4 px-4 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(row.status)}
                    <div>
                      <div className="font-medium text-gray-900 text-sm">{row.name}</div>
                      <div className="text-xs text-gray-500">{row.yearsActive} yr{row.yearsActive !== 1 ? 's' : ''} active</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 border-r border-gray-200">
                  <Badge className={`text-xs px-3 py-1 font-medium ${getDonorTypeBadge(row.donorType)}`}>
                    {row.donorType}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 px-4 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getAmountColor(row.amount)}`}>{row.amount}</span>
                    {getTrendIcon(row.trend)}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 border-r border-gray-200">
                  <div className="text-sm text-gray-700">{row.date}</div>
                  <div className="text-xs text-gray-500">{row.method}</div>
                </TableCell>
                <TableCell className="py-4 px-4 border-r border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 ${getEngagementColor(row.engagementScore)}`}
                        style={{ width: `${row.engagementScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 min-w-[35px]">{row.engagementScore}%</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4 border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900">{row.lifetimeGiving}</div>
                  <div className="text-xs text-gray-500">Total donated</div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <Badge className={`text-xs px-3 py-1 font-medium ${getStatusColor(row.status)}`}>
                    {row.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {isProcessing && visibleRows < data.length && (
          <div className="p-4 text-center border-t border-gray-200 bg-gray-50">
            <span className="animate-pulse text-sm text-gray-600">Loading donor records... ({visibleRows}/{data.length})</span>
          </div>
        )}
      </div>
      
      {!isProcessing && (
        <div className="mt-4 flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">Processed {data.length} donor records</span>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <span>High Engagement (80%+)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
              <span>Medium (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
              <span>Low (&lt;60%)</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 text-amber-500" />
              <span>VIP Donors</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
