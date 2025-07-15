import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit, Trash2, Play, Save, Share, Camera, Mic } from 'lucide-react';

interface StoryCard {
  id: string;
  title: string;
  content: string;
  type: 'scene' | 'emotion' | 'dialogue' | 'reflection';
  timestamp: Date;
  order: number;
}

interface StoryProject {
  id: string;
  title: string;
  cards: StoryCard[];
  lastModified: Date;
}

const SofiaMobileStoryboard: React.FC = () => {
  const [currentProject, setCurrentProject] = useState<StoryProject | null>(null);
  const [projects, setProjects] = useState<StoryProject[]>([]);
  const [editingCard, setEditingCard] = useState<StoryCard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newCardType, setNewCardType] = useState<'scene' | 'emotion' | 'dialogue' | 'reflection'>('scene');

  const cardTypes = [
    { id: 'scene', label: 'Scene', description: 'What happened', color: 'bg-blue-100 text-blue-800' },
    { id: 'emotion', label: 'Emotion', description: 'How it felt', color: 'bg-red-100 text-red-800' },
    { id: 'dialogue', label: 'Dialogue', description: 'What was said', color: 'bg-green-100 text-green-800' },
    { id: 'reflection', label: 'Reflection', description: 'What it means', color: 'bg-purple-100 text-purple-800' }
  ];

  const createNewProject = () => {
    const newProject: StoryProject = {
      id: Date.now().toString(),
      title: 'New Story',
      cards: [],
      lastModified: new Date()
    };
    setProjects(prev => [newProject, ...prev]);
    setCurrentProject(newProject);
  };

  const addCard = (type: StoryCard['type']) => {
    if (!currentProject) return;
    
    const newCard: StoryCard = {
      id: Date.now().toString(),
      title: '',
      content: '',
      type,
      timestamp: new Date(),
      order: currentProject.cards.length
    };
    
    const updatedProject = {
      ...currentProject,
      cards: [...currentProject.cards, newCard],
      lastModified: new Date()
    };
    
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
    setEditingCard(newCard);
  };

  const updateCard = (cardId: string, updates: Partial<StoryCard>) => {
    if (!currentProject) return;
    
    const updatedCards = currentProject.cards.map(card =>
      card.id === cardId ? { ...card, ...updates } : card
    );
    
    const updatedProject = {
      ...currentProject,
      cards: updatedCards,
      lastModified: new Date()
    };
    
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const deleteCard = (cardId: string) => {
    if (!currentProject) return;
    
    const updatedCards = currentProject.cards.filter(card => card.id !== cardId);
    const updatedProject = {
      ...currentProject,
      cards: updatedCards,
      lastModified: new Date()
    };
    
    setCurrentProject(updatedProject);
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const getCardTypeInfo = (type: string) => {
    return cardTypes.find(t => t.id === type) || cardTypes[0];
  };

  const generateStory = () => {
    if (!currentProject || currentProject.cards.length === 0) return '';
    
    return currentProject.cards
      .sort((a, b) => a.order - b.order)
      .map(card => card.content)
      .filter(content => content.trim())
      .join('\n\n');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Sofia's Storyboard</h1>
          {currentProject ? (
            <Button size="sm" onClick={() => setCurrentProject(null)}>
              Back
            </Button>
          ) : (
            <Button size="sm" onClick={createNewProject} className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-1" />
              New
            </Button>
          )}
        </div>
        {currentProject && (
          <p className="text-sm text-gray-600 mt-1">{currentProject.title}</p>
        )}
      </div>

      {!currentProject ? (
        /* Project List */
        <div className="p-4 space-y-4">
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-lg font-semibold mb-2">Mobile Story Creation</h2>
            <p className="text-sm text-gray-600 mb-4">
              Build stories card by card, anywhere you are
            </p>
            <Button onClick={createNewProject} className="bg-yellow-600 hover:bg-yellow-700">
              <Plus className="w-4 h-4 mr-2" />
              Start Your First Story
            </Button>
          </div>

          {projects.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Your Stories</h3>
              <div className="space-y-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setCurrentProject(project)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-600">
                            {project.cards.length} cards • {project.lastModified.toLocaleDateString()}
                          </p>
                        </div>
                        <BookOpen className="w-5 h-5 text-yellow-600" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Story Builder */
        <div className="space-y-4">
          {/* Project Title */}
          <div className="p-4 border-b">
            <Input
              value={currentProject.title}
              onChange={(e) => {
                const updatedProject = { ...currentProject, title: e.target.value };
                setCurrentProject(updatedProject);
                setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
              }}
              className="text-lg font-semibold border-none p-0 focus:ring-0"
              placeholder="Story title..."
            />
          </div>

          {/* Card Type Selector */}
          <div className="px-4">
            <div className="grid grid-cols-2 gap-2">
              {cardTypes.map((type) => (
                <Button
                  key={type.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addCard(type.id as any)}
                  className="h-auto p-3 flex flex-col items-center"
                >
                  <span className="font-medium">{type.label}</span>
                  <span className="text-xs text-gray-600">{type.description}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Story Cards */}
          <div className="px-4 space-y-3">
            {currentProject.cards.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No cards yet</p>
                <p className="text-xs">Add your first story element above</p>
              </div>
            ) : (
              currentProject.cards
                .sort((a, b) => a.order - b.order)
                .map((card, index) => {
                  const typeInfo = getCardTypeInfo(card.type);
                  const isEditing = editingCard?.id === card.id;
                  
                  return (
                    <Card key={card.id} className="border-l-4 border-l-yellow-500">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={typeInfo.color} variant="secondary">
                            {typeInfo.label}
                          </Badge>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingCard(isEditing ? null : card)}
                              className="h-6 w-6 p-0"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteCard(card.id)}
                              className="h-6 w-6 p-0 text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        {isEditing ? (
                          <div className="space-y-2">
                            <Input
                              placeholder="Card title..."
                              value={card.title}
                              onChange={(e) => updateCard(card.id, { title: e.target.value })}
                              className="text-sm"
                            />
                            <Textarea
                              placeholder="What happened in this part of your story..."
                              value={card.content}
                              onChange={(e) => updateCard(card.id, { content: e.target.value })}
                              rows={3}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setEditingCard(null)}
                                className="bg-yellow-600 hover:bg-yellow-700"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline">
                                <Mic className="w-3 h-3 mr-1" />
                                Voice
                              </Button>
                              <Button size="sm" variant="outline">
                                <Camera className="w-3 h-3 mr-1" />
                                Photo
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {card.title && (
                              <h4 className="font-medium text-sm mb-1">{card.title}</h4>
                            )}
                            <p className="text-sm text-gray-700">
                              {card.content || (
                                <span className="italic text-gray-400">Tap to add content...</span>
                              )}
                            </p>
                          </div>
                        )}

                        <div className="text-xs text-gray-500 mt-2">
                          Card {index + 1} • {typeInfo.description}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            )}
          </div>

          {/* Story Preview & Actions */}
          {currentProject.cards.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    const story = generateStory();
                    if (story) {
                      navigator.clipboard.writeText(story);
                    }
                  }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Preview Full Story
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="w-3 h-3 mr-1" />
                    Share
                  </Button>
                </div>

                <div className="text-center text-xs text-gray-600">
                  {currentProject.cards.length} cards • Last edited {currentProject.lastModified.toLocaleTimeString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Tips */}
      <div className="p-4 bg-blue-50 border-t">
        <h4 className="font-medium text-blue-800 mb-2">Sofia's Mobile Tips:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Use Scene cards for what happened</li>
          <li>• Use Emotion cards for how it felt</li>
          <li>• Use Dialogue for important conversations</li>
          <li>• Use Reflection for what it all means</li>
        </ul>
      </div>
    </div>
  );
};

export default SofiaMobileStoryboard;