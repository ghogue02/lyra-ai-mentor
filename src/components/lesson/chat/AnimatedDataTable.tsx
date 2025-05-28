
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

interface DataRow {
  name: string;
  amount: string;
  date: string;
  method: string;
  notes: string;
}

interface AnimatedDataTableProps {
  title: string;
  data: DataRow[];
  isVisible: boolean;
  onComplete?: () => void;
}

export const AnimatedDataTable: React.FC<AnimatedDataTableProps> = ({
  title,
  data,
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
        await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
      }
      
      setIsProcessing(false);
      onComplete?.();
    };

    animateRows();
  }, [isVisible, data.length, onComplete]);

  if (!isVisible) return null;

  return (
    <Card className="p-4 bg-gray-50 border border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        <span className="text-gray-700 font-medium text-sm">{title}</span>
        {isProcessing && (
          <div className="flex gap-1 ml-auto">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
      </div>
      
      <div className="border border-gray-300 rounded bg-white">
        <div className="grid grid-cols-5 gap-3 p-3 bg-gray-100 border-b border-gray-300 text-xs font-semibold text-gray-700">
          <span>Donor Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Method</span>
          <span>Notes</span>
        </div>
        
        {data.slice(0, visibleRows).map((row, index) => (
          <div 
            key={index}
            className="grid grid-cols-5 gap-3 p-3 border-b border-gray-200 text-xs opacity-0 animate-fade-in"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          >
            <span className="truncate text-gray-900">{row.name}</span>
            <span className="text-green-600 font-medium">{row.amount}</span>
            <span className="text-gray-600">{row.date}</span>
            <span className="text-gray-600">{row.method}</span>
            <span className="truncate text-gray-500">{row.notes}</span>
          </div>
        ))}
        
        {isProcessing && visibleRows < data.length && (
          <div className="p-3 text-center text-gray-500">
            <span className="animate-pulse text-xs">Loading records...</span>
          </div>
        )}
      </div>
      
      {!isProcessing && (
        <div className="mt-2 text-xs text-gray-500">
          Processed {data.length} donor records
        </div>
      )}
    </Card>
  );
};
