import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CarmenTalentAcquisitionTest: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 to-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="border-8 border-red-500 bg-yellow-100">
          <CardHeader>
            <CardTitle className="text-4xl text-center text-red-600">
              🚨 TEST COMPONENT IS LOADING! 🚨
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center p-8">
            <div className="bg-green-200 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                SUCCESS: Changes Are Being Applied!
              </h2>
              <p className="text-lg text-gray-700">
                If you can see this bright test component, it means our code changes 
                are working and the route is correctly loading our component.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-xl font-semibold">
                The original interface improvements should be working.
              </p>
              <p className="text-gray-600">
                This confirms the routing and component loading is functional.
              </p>
            </div>
            
            <Button 
              onClick={() => navigate('/chapter/7')}
              className="mt-8 bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg"
            >
              Back to Chapter 7
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarmenTalentAcquisitionTest;