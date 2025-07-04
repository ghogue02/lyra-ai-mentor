
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from 'lucide-react';

export const AISocialMediaPostGenerator = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = () => {
    if (!topic || !tone) return;
    setIsLoading(true);
    // Simulate AI generation
    setTimeout(() => {
      const post = `📣 We're excited to share an update on our work with ${topic}! Thanks to your support, we're making a real difference. #nonprofit #impact #${topic.replace(/\s+/g, '').toLowerCase()}`;
      const inspirationalPost = `✨ Inspired by the passion of our community, we're pushing forward on our mission to support ${topic}. Every bit of help counts! ❤️ #inspiration #community #makeadifference`;
      const urgentPost = `🚨 We need your help! We're so close to our goal for ${topic}, but we can't do it without you. Donate today to make an immediate impact. #urgent #donate #nonprofit`;

      let selectedPost = post;
      if (tone === 'inspirational') {
        selectedPost = inspirationalPost;
      }
      if (tone === 'urgent') {
        selectedPost = urgentPost;
      }

      setGeneratedPost(selectedPost);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>AI Social Media Post Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Post Topic</label>
            <Input
              id="topic"
              placeholder="e.g., our annual fundraising gala"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="tone" className="block text-sm font-medium text-gray-700 mb-1">Desired Tone</label>
            <Select onValueChange={setTone} value={tone}>
              <SelectTrigger id="tone">
                <SelectValue placeholder="Select a tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="informative">Informative</SelectItem>
                <SelectItem value="inspirational">Inspirational</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={isLoading || !topic || !tone}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Generate Social Media Post
        </Button>
        {generatedPost && (
          <div className="p-4 bg-gray-50 rounded-md border">
            <h4 className="font-semibold mb-2">Generated Post:</h4>
            <p className="text-gray-700">{generatedPost}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
