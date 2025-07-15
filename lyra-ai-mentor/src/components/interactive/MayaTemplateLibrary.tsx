import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Filter, Plus, Eye, Copy, Edit } from 'lucide-react';

interface EmailTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  subject: string;
  body: string;
  tags: string[];
  careElements: string[];
}

const MayaTemplateLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);

  const templates: EmailTemplate[] = [
    {
      id: '1',
      title: 'Project Status Update',
      category: 'status',
      description: 'Weekly project progress communication',
      subject: 'Weekly Project Update - [Project Name]',
      body: `Dear [Team/Stakeholder],

I wanted to provide you with a clear update on our project progress this week.

**Current Status:**
- [Specific accomplishments this week]
- [Key milestones reached]

**Next Week's Focus:**
- [Priority tasks and deliverables]
- [Any support needed]

**Potential Concerns:**
- [Any blockers or risks to address]

Please let me know if you have questions or need additional details on any aspect of the project.

Best regards,
[Your Name]`,
      tags: ['weekly', 'progress', 'team'],
      careElements: ['Clarity', 'Audience', 'Relevance', 'Engagement']
    },
    {
      id: '2',
      title: 'Meeting Request',
      category: 'meeting',
      description: 'Professional meeting scheduling template',
      subject: 'Meeting Request: [Purpose] - [Proposed Date]',
      body: `Dear [Name],

I hope this email finds you well. I would like to schedule a meeting to discuss [specific purpose/topic].

**Meeting Details:**
- Purpose: [Clear objective]
- Duration: [Time estimate]
- Proposed Date/Time: [Options]
- Format: [In-person/Virtual/Hybrid]

**Agenda Overview:**
- [Key topic 1]
- [Key topic 2]
- [Next steps discussion]

Please let me know your availability, and I'll send a calendar invitation.

Best regards,
[Your Name]`,
      tags: ['meeting', 'scheduling', 'agenda'],
      careElements: ['Clarity', 'Audience', 'Relevance', 'Engagement']
    },
    {
      id: '3',
      title: 'Follow-up After Meeting',
      category: 'followup',
      description: 'Post-meeting summary and action items',
      subject: 'Follow-up: [Meeting Topic] - Action Items',
      body: `Dear [Attendees],

Thank you for your time in today's meeting about [topic]. Here's a summary of our discussion and next steps.

**Key Decisions:**
- [Decision 1]
- [Decision 2]

**Action Items:**
- [Task] - [Owner] - [Due Date]
- [Task] - [Owner] - [Due Date]

**Next Meeting:**
- [Date/Time if applicable]
- [Purpose]

Please review and let me know if I missed anything or if you have questions.

Best regards,
[Your Name]`,
      tags: ['followup', 'action-items', 'summary'],
      careElements: ['Clarity', 'Audience', 'Relevance', 'Engagement']
    },
    {
      id: '4',
      title: 'Request for Information',
      category: 'request',
      description: 'Professional information request template',
      subject: 'Information Request: [Specific Topic]',
      body: `Dear [Name],

I hope you're doing well. I'm reaching out to request some information that would help me [specific purpose].

**What I Need:**
- [Specific item 1]
- [Specific item 2]
- [Specific item 3]

**Context:**
[Brief explanation of why you need this information and how it will be used]

**Timeline:**
I would appreciate receiving this by [date] to [reason for deadline].

Please let me know if you need any clarification or if there's a better person to contact for this information.

Thank you for your assistance.

Best regards,
[Your Name]`,
      tags: ['request', 'information', 'deadline'],
      careElements: ['Clarity', 'Audience', 'Relevance', 'Engagement']
    }
  ];

  const categories = ['all', 'status', 'meeting', 'followup', 'request', 'feedback'];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const copyTemplate = (template: EmailTemplate) => {
    const fullTemplate = `Subject: ${template.subject}\n\n${template.body}`;
    navigator.clipboard.writeText(fullTemplate);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl">Maya's Template Library</CardTitle>
              <CardDescription>
                Professional email templates built with CARE framework principles
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Filter className="w-5 h-5 text-gray-400 my-auto" />
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Templates ({filteredTemplates.length})</h3>
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-1" />
                  New Template
                </Button>
              </div>
              
              {filteredTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{template.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1">
                        {template.careElements.map((element, index) => (
                          <span 
                            key={index}
                            className="w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold"
                          >
                            {element[0]}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={(e) => {
                          e.stopPropagation();
                          copyTemplate(template);
                        }}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Template Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              {selectedTemplate ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{selectedTemplate.title}</CardTitle>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" onClick={() => copyTemplate(selectedTemplate)}>
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{selectedTemplate.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Subject Line */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject:</label>
                      <div className="mt-1 p-2 bg-gray-50 border rounded text-sm">
                        {selectedTemplate.subject}
                      </div>
                    </div>

                    {/* Email Body */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Body:</label>
                      <div className="mt-1 p-4 bg-gray-50 border rounded">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {selectedTemplate.body}
                        </pre>
                      </div>
                    </div>

                    {/* CARE Elements */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">CARE Elements:</label>
                      <div className="mt-2 flex gap-2">
                        {selectedTemplate.careElements.map((element, index) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">
                            {element}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tags:</label>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {selectedTemplate.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-64 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Select a template to preview</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MayaTemplateLibrary;