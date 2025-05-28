
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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      for (let i = 0; i <= data.length; i++) {
        setVisibleRows(i);
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 150));
      }
      
      setIsProcessing(false);
      onComplete?.();
    };

    animateRows();
  }, [isVisible, data.length, onComplete]);

  if (!isVisible) return null;

  const getDonorTypeBadge = (type: string) => {
    const variants = {
      'Major': 'bg-purple-100 text-purple-800 border-purple-300',
      'Mid-level': 'bg-blue-100 text-blue-800 border-blue-300',
      'Regular': 'bg-green-100 text-green-800 border-green-300'
    };
    return variants[type as keyof typeof variants] || variants.Regular;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VIP': return <Star className="w-3 h-3 text-yellow-500" />;
      case 'At-Risk': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'New': return <CheckCircle className="w-3 h-3 text-green-500" />;
      default: return <CheckCircle className="w-3 h-3 text-blue-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-green-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-red-500" />;
      default: return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  const getAmountColor = (amount: string) => {
    const value = parseInt(amount.replace(/[$,]/g, ''));
    if (value >= 2000) return 'text-green-600 font-semibold';
    if (value >= 500) return 'text-blue-600 font-medium';
    return 'text-gray-600';
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="p-4 bg-white border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-gray-700 font-semibold text-sm">{title}</span>
        {isProcessing && (
          <div className="flex gap-1 ml-auto">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
      </div>
      
      <div className="border border-gray-200 rounded-lg bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 border-b">
              <TableHead className="text-xs font-semibold text-gray-700 w-[140px]">Donor</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 w-[80px]">Type</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 w-[90px]">Last Gift</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 w-[100px]">Engagement</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 w-[90px]">Lifetime</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 w-[80px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, visibleRows).map((row, index) => (
              <TableRow 
                key={index}
                className="opacity-0 animate-fade-in hover:bg-gray-50 transition-colors border-b border-gray-100"
                style={{
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: 'forwards'
                }}
              >
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(row.status)}
                    <div>
                      <div className="font-medium text-gray-900 text-xs">{row.name}</div>
                      <div className="text-xs text-gray-500">{row.yearsActive} yr{row.yearsActive !== 1 ? 's' : ''} active</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge className={`text-xs px-2 py-1 border ${getDonorTypeBadge(row.donorType)}`}>
                    {row.donorType}
                  </Badge>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <span className={`text-xs ${getAmountColor(row.amount)}`}>{row.amount}</span>
                    {getTrendIcon(row.trend)}
                  </div>
                  <div className="text-xs text-gray-500">{row.date}</div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${getEngagementColor(row.engagementScore)}`}
                        style={{ width: `${row.engagementScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-700">{row.engagementScore}%</span>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="text-xs font-medium text-gray-900">{row.lifetimeGiving}</div>
                  <div className="text-xs text-gray-500">{row.method}</div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      row.status === 'VIP' ? 'bg-yellow-400' :
                      row.status === 'At-Risk' ? 'bg-red-400' :
                      row.status === 'New' ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <span className="text-xs text-gray-700">{row.status}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {isProcessing && visibleRows < data.length && (
          <div className="p-4 text-center border-t border-gray-200">
            <span className="animate-pulse text-xs text-gray-500">Loading donor records...</span>
          </div>
        )}
      </div>
      
      {!isProcessing && (
        <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
          <span>Processed {data.length} donor records</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>High Value</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>At Risk</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-500" />
              <span>VIP</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
