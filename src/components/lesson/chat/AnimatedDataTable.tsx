
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
      // Start with header
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Add rows one by one with realistic timing
      for (let i = 0; i <= data.length; i++) {
        setVisibleRows(i);
        await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      }
      
      setIsProcessing(false);
      onComplete?.();
    };

    animateRows();
  }, [isVisible, data.length, onComplete]);

  if (!isVisible) return null;

  return (
    <Card className="p-4 bg-gray-900 text-green-400 font-mono text-sm border-green-500/30">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-green-300">{title}</span>
        {isProcessing && (
          <div className="flex gap-1 ml-auto">
            <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce"></div>
            <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        )}
      </div>
      
      <div className="border border-green-500/30 rounded">
        {/* Header */}
        <div className="grid grid-cols-5 gap-2 p-2 bg-green-500/10 border-b border-green-500/30 text-xs font-semibold">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Method</span>
          <span>Notes</span>
        </div>
        
        {/* Data Rows */}
        {data.slice(0, visibleRows).map((row, index) => (
          <div 
            key={index}
            className="grid grid-cols-5 gap-2 p-2 border-b border-green-500/20 text-xs opacity-0 animate-fade-in"
            style={{
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'forwards'
            }}
          >
            <span className="truncate">{row.name}</span>
            <span className="text-yellow-400">{row.amount}</span>
            <span>{row.date}</span>
            <span>{row.method}</span>
            <span className="truncate text-gray-400">{row.notes}</span>
          </div>
        ))}
        
        {isProcessing && visibleRows < data.length && (
          <div className="p-2 text-center text-green-300/70">
            <span className="animate-pulse">Loading records...</span>
          </div>
        )}
      </div>
      
      {!isProcessing && (
        <div className="mt-2 text-xs text-green-300/70">
          ✓ Processed {data.length} records
        </div>
      )}
    </Card>
  );
};
