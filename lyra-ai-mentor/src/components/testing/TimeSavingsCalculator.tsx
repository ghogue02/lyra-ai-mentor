
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from 'lucide-react';

export const TimeSavingsCalculator = () => {
  const [inputs, setInputs] = useState({
    emailHours: '',
    dataEntryHours: '',
    schedulingHours: '',
    reportingHours: ''
  });
  const [results, setResults] = useState<any>(null);

  const calculateSavings = () => {
    const total = Object.values(inputs).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    const aiSavings = total * 0.3; // Assume 30% time savings
    const weeklySavings = aiSavings;
    const monthlySavings = weeklySavings * 4;
    const yearlySavings = monthlySavings * 12;
    const costSavings = yearlySavings * 25; // $25/hour average

    setResults({
      totalHours: total,
      weeklySavings,
      monthlySavings,
      yearlySavings,
      costSavings
    });
  };

  const hasData = Object.values(inputs).some(val => val !== '');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Time Savings Calculator</h3>
        <p className="text-sm text-gray-600">See how much time AI could save your team</p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Email management (hours/week):</label>
          <input
            type="number"
            value={inputs.emailHours}
            onChange={(e) => setInputs(prev => ({ ...prev, emailHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 10"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Data entry (hours/week):</label>
          <input
            type="number"
            value={inputs.dataEntryHours}
            onChange={(e) => setInputs(prev => ({ ...prev, dataEntryHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 8"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Scheduling (hours/week):</label>
          <input
            type="number"
            value={inputs.schedulingHours}
            onChange={(e) => setInputs(prev => ({ ...prev, schedulingHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 5"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Reporting (hours/week):</label>
          <input
            type="number"
            value={inputs.reportingHours}
            onChange={(e) => setInputs(prev => ({ ...prev, reportingHours: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
            placeholder="e.g., 6"
          />
        </div>
      </div>

      <Button 
        onClick={calculateSavings} 
        disabled={!hasData}
        className="w-full"
        size="sm"
      >
        <Calculator className="w-3 h-3 mr-1" />
        Calculate Savings
      </Button>

      {results && (
        <Card className="border border-green-200">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 text-green-700">Your Potential Savings</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{results.weeklySavings.toFixed(1)}</div>
                <div className="text-xs text-gray-600">Hours/Week</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{results.monthlySavings.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Hours/Month</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">{results.yearlySavings.toFixed(0)}</div>
                <div className="text-xs text-gray-600">Hours/Year</div>
              </div>
              <div className="text-center p-2 bg-green-50 rounded">
                <div className="text-lg font-bold text-green-600">${results.costSavings.toLocaleString()}</div>
                <div className="text-xs text-gray-600">Annual Savings</div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              *Based on 30% efficiency gains and $25/hour average cost
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
