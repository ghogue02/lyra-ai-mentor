
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target } from 'lucide-react';

export const AIToolRecommendationEngine = () => {
  const [orgProfile, setOrgProfile] = useState({
    size: '',
    budget: '',
    focus: '',
    techLevel: ''
  });
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const generateRecommendations = () => {
    const tools = [
      {
        name: "Mailchimp AI",
        category: "Email Marketing",
        price: "Free - $299/month",
        fit: "Small to Medium Organizations",
        description: "AI-powered email optimization and audience insights"
      },
      {
        name: "Salesforce Nonprofit Cloud",
        category: "Donor Management", 
        price: "Free for qualifying nonprofits",
        fit: "All sizes",
        description: "Comprehensive CRM with AI-powered donor insights"
      },
      {
        name: "Microsoft Dynamics 365",
        category: "Operations",
        price: "$20-95/user/month",
        fit: "Medium to Large Organizations",
        description: "AI-enhanced operations and volunteer management"
      }
    ];

    const filtered = tools.filter(() => Math.random() > 0.3);
    setRecommendations(filtered);
  };

  const hasProfile = Object.values(orgProfile).every(value => value !== '');

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-gray-800 mb-2">AI Tool Recommendations</h3>
        <p className="text-sm text-gray-600">Find the right AI tools for your organization</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Organization Size</label>
          <select
            value={orgProfile.size}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, size: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select size</option>
            <option value="small">Small (1-10 staff)</option>
            <option value="medium">Medium (11-50 staff)</option>
            <option value="large">Large (50+ staff)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Monthly Budget</label>
          <select
            value={orgProfile.budget}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, budget: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select budget</option>
            <option value="low">Under $100</option>
            <option value="medium">$100-500</option>
            <option value="high">$500+</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Primary Focus</label>
          <select
            value={orgProfile.focus}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, focus: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select focus</option>
            <option value="fundraising">Fundraising</option>
            <option value="programs">Program Delivery</option>
            <option value="operations">Operations</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-gray-700 block mb-1">Tech Comfort</label>
          <select
            value={orgProfile.techLevel}
            onChange={(e) => setOrgProfile(prev => ({ ...prev, techLevel: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded text-sm"
          >
            <option value="">Select level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      <Button 
        onClick={generateRecommendations} 
        disabled={!hasProfile}
        className="w-full"
        size="sm"
      >
        <Target className="w-3 h-3 mr-1" />
        Get Recommendations
      </Button>

      {recommendations.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800">Recommended Tools:</h4>
          {recommendations.map((tool, index) => (
            <Card key={index} className="border border-blue-200">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-medium text-sm">{tool.name}</h5>
                  <Badge variant="outline" className="text-xs">{tool.category}</Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{tool.description}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Fit: {tool.fit}</span>
                  <span className="font-medium">{tool.price}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
