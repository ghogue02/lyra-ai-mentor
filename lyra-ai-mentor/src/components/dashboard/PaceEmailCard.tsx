import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Copy, Share2, Download, Calendar, Target, Users, FileText, Check, Eye, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface PaceEmailCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    metadata?: string;
    created_at: string;
    download_count: number;
    average_rating: number;
    user_unlock?: {
      unlocked_at: string;
      download_count: number;
    };
  };
  isGridView: boolean;
}

export const PaceEmailCard: React.FC<PaceEmailCardProps> = ({ item, isGridView }) => {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // Parse metadata
  let paceData: any = null;
  try {
    if (item.metadata) {
      const parsed = JSON.parse(item.metadata);
      paceData = parsed.pace_data;
    }
  } catch (error) {
    console.error('Error parsing metadata:', error);
  }

  const handleCopyPrompt = async () => {
    if (!paceData?.prompt) {
      toast.error('No prompt available to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(paceData.prompt);
      setCopiedPrompt(true);
      toast.success(`Full prompt copied! (${paceData.prompt.length} characters)`);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const handleCopyEmail = async () => {
    if (!paceData?.email_content) {
      toast.error('No email content available to copy');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(paceData.email_content);
      setCopiedEmail(true);
      toast.success(`Full email copied! (${paceData.email_content.length} characters)`);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (error) {
      toast.error('Failed to copy email');
    }
  };

  const handleShare = async () => {
    if (!paceData) return;

    const shareText = `Check out this PACE email template I created!\n\nPurpose: ${formatPurposeForDisplay(paceData.purpose)}\nAudience: ${paceData.audience?.label || 'Unknown'}\n\nPrompt: ${paceData.prompt}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PACE Email Template',
          text: shareText,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback to copying
      await navigator.clipboard.writeText(shareText);
      toast.success('Template copied to clipboard for sharing!');
    }
  };

  const handleDownload = () => {
    if (!paceData) return;

    const content = `PACE Email Template
Created: ${format(new Date(paceData.created_at), 'MMMM d, yyyy')}

${paceData.why_this_works}

---
AI PROMPT:
${paceData.prompt}

---
GENERATED EMAIL:
${paceData.email_content}

---
Created with Lyra AI Mentor - PACE Email Framework`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pace-email-${paceData.purpose}-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template downloaded!');
  };

  const handleViewEmail = () => {
    setShowEmailModal(true);
  };

  if (!paceData) {
    return null; // Don't render if no PACE data
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full hover:shadow-lg transition-all duration-200 border-purple-200 overflow-hidden">
        <CardHeader className="pb-3 bg-gradient-to-br from-purple-50 to-indigo-50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 line-clamp-1">
                  {formatPurposeForDisplay(paceData.purpose)}
                </h3>
                <p className="text-sm text-gray-600">
                  {paceData.audience?.label || 'Unknown Audience'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(item.user_unlock?.unlocked_at || item.created_at), 'MMM d')}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              {item.user_unlock?.download_count || 0} uses
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {/* Why This Works Preview */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-600" />
              Why This Works
            </h4>
            <div className="space-y-1 text-xs text-gray-600">
              {paceData.why_this_works && (
                <div className="text-xs text-gray-600 whitespace-pre-wrap line-clamp-4">
                  {paceData.why_this_works.replace(/^Approach:/gm, 'Execute:')}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleViewEmail}
                  className="flex-1"
                >
                  <Eye className="w-4 h-4" />
                  <span className="ml-1">View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>View full email</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPrompt}
                  className="flex-1"
                >
                  {copiedPrompt ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="ml-1 hidden sm:inline">Prompt</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy AI prompt</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyEmail}
                  className="flex-1"
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                  <span className="ml-1 hidden sm:inline">Copy</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Copy email content</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleShare}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share template</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download template</TooltipContent>
            </Tooltip>
          </div>

          {/* Email Preview (if grid view) */}
          {isGridView && paceData.email_content && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                 onClick={handleViewEmail}>
              <p className="text-xs text-gray-600 line-clamp-3">
                {paceData.email_content}
              </p>
              <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Click to view full email
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Email View Modal */}
      <Dialog open={showEmailModal} onOpenChange={setShowEmailModal}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {formatPurposeForDisplay(paceData.purpose)}
            </DialogTitle>
            <DialogDescription className="space-y-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {paceData.audience?.label || 'Unknown Audience'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(paceData.created_at), 'MMMM d, yyyy')}
                </span>
              </div>
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Why This Works Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Why This Email Works
                </h3>
                <div className="bg-purple-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {paceData.why_this_works?.replace(/^Approach:/gm, 'Execute:')}
                  </p>
                  {paceData.framework && (
                    <div className="pt-2 border-t border-purple-100 flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                        <FileText className="w-3 h-3 mr-1" />
                        {paceData.framework.name}
                      </Badge>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <HelpCircle className="w-4 h-4 text-purple-600" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-semibold text-sm">{paceData.framework.name}</h4>
                            <p className="text-sm text-gray-600">
                              {getFrameworkDescription(paceData.framework.name)}
                            </p>
                            {paceData.framework.elements && (
                              <div className="mt-3 space-y-2">
                                <p className="text-xs font-medium text-gray-700">Key Elements:</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                  {paceData.framework.elements.map((element: any, idx: number) => (
                                    <li key={idx} className="flex items-start gap-1">
                                      <span className="text-purple-600 mt-0.5">•</span>
                                      <span><strong>{element.name}:</strong> {element.description}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* AI Prompt Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Copy className="w-5 h-5 text-blue-600" />
                  Complete AI Prompt
                </h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {paceData.prompt || 'No prompt data available'}
                  </p>
                  {paceData.prompt && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <p className="text-xs text-blue-600">
                        ✓ Full prompt ({paceData.prompt.length} characters)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Generated Email Section */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5 text-green-600" />
                  Complete Generated Email
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {paceData.email_content || 'No email content available'}
                  </p>
                  {paceData.email_content && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        ✓ Full email ({paceData.email_content.length} characters)
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleCopyPrompt}
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied Prompt
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Prompt
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopyEmail}
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied Email
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Copy Email
                </>
              )}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

// Helper function to format purpose for display
function formatPurposeForDisplay(purpose: string): string {
  const purposeMap: Record<string, string> = {
    'inform_educate': 'Share important news',
    'persuade_convince': 'Invite someone to support',
    'build_relationships': 'Build a stronger connection',
    'solve_problems': 'Help someone who\'s worried',
    'request_support': 'Ask for help you need',
    'inspire_motivate': 'Share exciting progress',
    'establish_authority': 'Establish expertise',
    'create_engagement': 'Create engagement'
  };
  
  return purposeMap[purpose] || purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Helper function to get framework descriptions
function getFrameworkDescription(frameworkName: string): string {
  const descriptions: Record<string, string> = {
    'Teaching Moment Framework': 'A structured approach to share knowledge and insights. Start with a relatable hook, present the key lesson, explain why it matters, and end with a clear action step.',
    'Story Arc Framework': 'A narrative structure that engages through storytelling. Set the scene, introduce conflict or challenge, show the journey, and reveal the transformation or outcome.',
    'Invitation Framework': 'A persuasive structure for making requests or invitations. Start with context, explain the opportunity, show the value, and make a clear ask with next steps.'
  };
  
  return descriptions[frameworkName] || 'A structured approach to crafting effective email communication.';
}