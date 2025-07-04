import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Trash2, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AgendaCreatorProps {
  onComplete?: () => void;
}

interface AgendaItem {
  id: string;
  title: string;
  timeMinutes: number;
  description: string;
  presenter: string;
}

export const AgendaCreator: React.FC<AgendaCreatorProps> = ({ onComplete }) => {
  const [meetingType, setMeetingType] = useState<string>('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [generatedAgenda, setGeneratedAgenda] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemTime, setNewItemTime] = useState(10);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [newItemPresenter, setNewItemPresenter] = useState('');

  const meetingTypes = [
    { value: 'team_meeting', label: 'Team Meeting', description: 'Weekly or monthly team check-ins' },
    { value: 'board_meeting', label: 'Board Meeting', description: 'Quarterly board meetings' },
    { value: 'volunteer_orientation', label: 'Volunteer Orientation', description: 'New volunteer training' }
  ];

  const addAgendaItem = () => {
    if (!newItemTitle.trim()) {
      toast.error('Please enter an agenda item title');
      return;
    }

    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: newItemTitle.trim(),
      timeMinutes: newItemTime,
      description: newItemDescription.trim(),
      presenter: newItemPresenter.trim()
    };

    setAgendaItems(prev => [...prev, newItem]);
    setNewItemTitle('');
    setNewItemTime(10);
    setNewItemDescription('');
    setNewItemPresenter('');
    toast.success('Agenda item added!');
  };

  const removeAgendaItem = (itemId: string) => {
    setAgendaItems(prev => prev.filter(item => item.id !== itemId));
  };

  const getTotalTime = () => {
    return agendaItems.reduce((total, item) => total + item.timeMinutes, 0);
  };

  const generateAgenda = async () => {
    if (!meetingType || !meetingTitle.trim() || agendaItems.length === 0) {
      toast.error('Please complete meeting details and add at least one agenda item');
      return;
    }

    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const agenda = createProfessionalAgenda();
      setGeneratedAgenda(agenda);
      
      toast.success('Professional agenda created!');
      onComplete?.();
    } catch (error) {
      toast.error('Failed to generate agenda. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const createProfessionalAgenda = (): string => {
    const selectedType = meetingTypes.find(t => t.value === meetingType);
    const totalTime = getTotalTime();
    
    let agenda = `# ${meetingTitle}

**Type:** ${selectedType?.label}
**Date:** ${meetingDate || '[Date]'}
**Duration:** ${totalTime} minutes
**Location:** [Location/Video Conference Link]

## Agenda Items

`;

    agendaItems.forEach((item, index) => {
      agenda += `### ${index + 1}. ${item.title}
**Time:** ${item.timeMinutes} minutes`;
      
      if (item.presenter) {
        agenda += `\n**Presenter:** ${item.presenter}`;
      }
      
      if (item.description) {
        agenda += `\n**Description:** ${item.description}`;
      }
      
      agenda += '\n\n';
    });

    agenda += `## Meeting Guidelines
- Please arrive on time and prepared
- Keep discussions focused and constructive
- Respect time allocations for each item

---
*Professional agenda created with AI assistance*`;

    return agenda;
  };

  const copyAgenda = () => {
    navigator.clipboard.writeText(generatedAgenda);
    toast.success('Agenda copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Meeting Agenda Creator
          </CardTitle>
          <p className="text-sm text-gray-600">
            Build structured, professional agendas for productive meetings
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Meeting Type</label>
              <Select value={meetingType} onValueChange={setMeetingType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  {meetingTypes.map((type) => (
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
              <label className="block text-sm font-medium mb-2">Meeting Title</label>
              <Input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="e.g., 'Monthly Team Check-in'"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meeting Date</label>
            <Input
              type="date"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Agenda Items</h3>
            
            <div className="space-y-3 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Input
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Agenda item title"
                  className="md:col-span-2"
                />
                <Input
                  type="number"
                  value={newItemTime}
                  onChange={(e) => setNewItemTime(Number(e.target.value))}
                  placeholder="Minutes"
                  min="5"
                  max="120"
                />
                <Button onClick={addAgendaItem} size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Input
                  value={newItemPresenter}
                  onChange={(e) => setNewItemPresenter(e.target.value)}
                  placeholder="Presenter (optional)"
                />
                <Input
                  value={newItemDescription}
                  onChange={(e) => setNewItemDescription(e.target.value)}
                  placeholder="Brief description (optional)"
                />
              </div>
            </div>

            {agendaItems.length > 0 && (
              <div className="space-y-2">
                {agendaItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{item.title}</span>
                        <Badge variant="secondary">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.timeMinutes}m
                        </Badge>
                      </div>
                      {item.presenter && (
                        <div className="text-sm text-gray-600 mt-1">Presenter: {item.presenter}</div>
                      )}
                      {item.description && (
                        <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAgendaItem(item.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
                  <strong>Total Time:</strong> {getTotalTime()} minutes
                </div>
              </div>
            )}
          </div>

          <Button 
            onClick={generateAgenda} 
            disabled={isGenerating || !meetingType || !meetingTitle.trim() || agendaItems.length === 0}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Creating Agenda...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Generate Professional Agenda
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedAgenda && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Professional Meeting Agenda</CardTitle>
              <Button variant="outline" size="sm" onClick={copyAgenda}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono overflow-auto max-h-96">
                {generatedAgenda}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};