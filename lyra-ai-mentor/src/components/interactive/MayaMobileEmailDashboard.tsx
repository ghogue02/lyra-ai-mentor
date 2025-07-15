import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, Clock, Users, Search, Filter, Send, Archive, Star, MoreVertical } from 'lucide-react';

interface EmailItem {
  id: string;
  from: string;
  subject: string;
  preview: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  status: 'unread' | 'read' | 'replied';
  category: 'parent' | 'staff' | 'board' | 'community';
}

const MayaMobileEmailDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);

  const mockEmails: EmailItem[] = [
    {
      id: '1',
      from: 'Sarah Chen',
      subject: 'Pickup procedure concerns',
      preview: 'Hi Maya, I wanted to discuss the new pickup procedures...',
      timestamp: '2 min ago',
      priority: 'high',
      status: 'unread',
      category: 'parent'
    },
    {
      id: '2',
      from: 'Board Meeting',
      subject: 'Monthly board meeting agenda',
      preview: 'Please review the attached agenda for next week...',
      timestamp: '1 hour ago',
      priority: 'medium',
      status: 'read',
      category: 'board'
    },
    {
      id: '3',
      from: 'Tom Rodriguez',
      subject: 'Staff scheduling update',
      preview: 'Changes to next week\'s schedule due to...',
      timestamp: '3 hours ago',
      priority: 'medium',
      status: 'replied',
      category: 'staff'
    },
    {
      id: '4',
      from: 'Community Center',
      subject: 'Partnership opportunity',
      preview: 'We\'d love to explore a collaboration for...',
      timestamp: 'Yesterday',
      priority: 'low',
      status: 'read',
      category: 'community'
    },
    {
      id: '5',
      from: 'Jennifer Park',
      subject: 'Thank you for the program',
      preview: 'My daughter has been so excited about the activities...',
      timestamp: '2 days ago',
      priority: 'low',
      status: 'read',
      category: 'parent'
    }
  ];

  const filters = [
    { id: 'all', label: 'All', count: mockEmails.length },
    { id: 'unread', label: 'Unread', count: mockEmails.filter(e => e.status === 'unread').length },
    { id: 'parent', label: 'Parents', count: mockEmails.filter(e => e.category === 'parent').length },
    { id: 'staff', label: 'Staff', count: mockEmails.filter(e => e.category === 'staff').length },
    { id: 'board', label: 'Board', count: mockEmails.filter(e => e.category === 'board').length }
  ];

  const filteredEmails = mockEmails.filter(email => {
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && email.status === 'unread') ||
                         email.category === selectedFilter;
    const matchesSearch = email.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'unread': return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case 'replied': return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      default: return null;
    }
  };

  const quickResponses = [
    'Thank you for reaching out. I\'ll review this and get back to you by...',
    'I understand your concern. Let me look into this and provide an update...',
    'Great question! Here\'s what I can share about this situation...',
    'I appreciate you bringing this to my attention. We can definitely work on...'
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Maya's Email</h1>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Send className="w-4 h-4 mr-1" />
            Compose
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={selectedFilter === filter.id ? "default" : "outline"}
              size="sm"
              className={`whitespace-nowrap ${
                selectedFilter === filter.id 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700'
              }`}
              onClick={() => setSelectedFilter(filter.id)}
            >
              {filter.label}
              {filter.count > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {filter.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={`p-4 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
              email.status === 'unread' ? 'bg-blue-50' : ''
            }`}
            onClick={() => setSelectedEmail(email)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getStatusIcon(email.status)}
                <span className={`font-medium truncate ${
                  email.status === 'unread' ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {email.from}
                </span>
                <Badge className={getPriorityColor(email.priority)} variant="secondary">
                  {email.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                <Clock className="w-3 h-3" />
                {email.timestamp}
              </div>
            </div>
            
            <h3 className={`text-sm mb-1 truncate ${
              email.status === 'unread' ? 'font-semibold' : 'font-medium'
            }`}>
              {email.subject}
            </h3>
            
            <p className="text-sm text-gray-600 truncate mb-2">
              {email.preview}
            </p>
            
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {email.category}
              </Badge>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Archive className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <Star className="w-3 h-3" />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                  <MoreVertical className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-purple-600">
              {mockEmails.filter(e => e.status === 'unread').length}
            </div>
            <div className="text-xs text-gray-600">Unread</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              {mockEmails.filter(e => e.status === 'replied').length}
            </div>
            <div className="text-xs text-gray-600">Replied</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">
              {mockEmails.filter(e => e.priority === 'high').length}
            </div>
            <div className="text-xs text-gray-600">Priority</div>
          </div>
        </div>
      </div>

      {/* Email Detail Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Modal Header */}
          <div className="border-b p-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedEmail(null)}
            >
              ← Back
            </Button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Archive className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline">
                <Star className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{selectedEmail.from}</span>
                <Badge className={getPriorityColor(selectedEmail.priority)}>
                  {selectedEmail.priority}
                </Badge>
              </div>
              <h2 className="text-lg font-bold mb-2">{selectedEmail.subject}</h2>
              <div className="text-sm text-gray-600 mb-4">{selectedEmail.timestamp}</div>
            </div>

            <div className="prose prose-sm">
              <p>
                Hi Maya,
              </p>
              <p>
                I hope this email finds you well. I wanted to reach out about the new pickup procedures that were implemented last week. While I understand the need for better security, I have some concerns about how this is affecting families.
              </p>
              <p>
                The new system seems to be causing longer wait times, and with multiple children, it's becoming quite challenging to coordinate. I've noticed other parents are experiencing similar difficulties.
              </p>
              <p>
                Would it be possible to discuss some modifications that might address the security concerns while making the process smoother for families?
              </p>
              <p>
                Thank you for all you do for our community.
              </p>
              <p>
                Best regards,<br />
                {selectedEmail.from}
              </p>
            </div>
          </div>

          {/* Quick Response Options */}
          <div className="border-t p-4 space-y-3">
            <h3 className="font-medium text-sm">Quick Responses:</h3>
            <div className="space-y-2">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full text-left h-auto p-3 justify-start"
                >
                  <span className="text-xs">{response}</span>
                </Button>
              ))}
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Send className="w-4 h-4 mr-2" />
              Compose Full Reply
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEmails.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">No emails found</p>
          <p className="text-sm text-gray-500">
            {searchTerm ? 'Try a different search term' : 'All caught up!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default MayaMobileEmailDashboard;