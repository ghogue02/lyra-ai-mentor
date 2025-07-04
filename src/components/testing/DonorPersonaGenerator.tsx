
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

export const DonorPersonaGenerator = () => {
  const [donorInterests, setDonorInterests] = useState('');
  const [givingLevel, setGivingLevel] = useState('');
  const [generatedPersona, setGeneratedPersona] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!donorInterests || !givingLevel) return;
    setIsLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      const persona = {
        name: 'Alex Chen',
        role: 'Mid-Career Professional',
        motivation: `Interested in ${donorInterests}. They are looking for long-term impact and are likely to become a recurring donor if engaged with personalized stories and clear outcomes.`,
        communication: 'Prefers email updates and annual impact reports. Engages with social media content that showcases success stories.',
        givingPattern: `A ${givingLevel} donor, they are likely to give during annual campaigns and in response to specific, compelling appeals.`
      };
      setGeneratedPersona(persona);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Donor Persona Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="donor-interests" className="block text-sm font-medium text-gray-700 mb-1">Primary Interest</label>
            <Input
              id="donor-interests"
              placeholder="e.g., Environmental conservation"
              value={donorInterests}
              onChange={(e) => setDonorInterests(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="giving-level" className="block text-sm font-medium text-gray-700 mb-1">Typical Giving Level</label>
            <Select onValueChange={setGivingLevel} value={givingLevel}>
              <SelectTrigger id="giving-level">
                <SelectValue placeholder="Select a level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small ($50-$250)</SelectItem>
                <SelectItem value="medium">Medium ($250-$1,000)</SelectItem>
                <SelectItem value="large">Large ($1,000+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading || !donorInterests || !givingLevel}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Donor Persona
        </Button>
        {generatedPersona && (
          <div className="p-4 bg-gray-50 rounded-md border space-y-2">
            <h4 className="font-semibold">Generated Persona: {generatedPersona.name}</h4>
            <p><strong>Role:</strong> {generatedPersona.role}</p>
            <p><strong>Motivation:</strong> {generatedPersona.motivation}</p>
            <p><strong>Communication Style:</strong> {generatedPersona.communication}</p>
            <p><strong>Giving Pattern:</strong> {generatedPersona.givingPattern}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
