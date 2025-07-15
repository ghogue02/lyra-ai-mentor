import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, AlertTriangle, CheckCircle, RefreshCw, Target, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ContentAuditAgentProps {
  onComplete?: () => void;
}

interface AuditResult {
  table: string;
  id: number;
  field: string;
  originalText: string;
  suggestedText: string;
  issue: string;
}

export const ContentAuditAgent: React.FC<ContentAuditAgentProps> = ({ onComplete }) => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [auditResults, setAuditResults] = useState<AuditResult[]>([]);
  const [isFixing, setIsFixing] = useState(false);

  // Problematic terms and their replacements
  const auditRules = [
    {
      pattern: /DreamWorks/gi,
      replacement: 'professional storytelling',
      issue: 'External brand reference - should focus on nonprofit transformation'
    },
    {
      pattern: /DreamWorks[- ]style/gi,
      replacement: 'engaging',
      issue: 'External brand reference in style description'
    },
    {
      pattern: /Use the DreamWorks storytelling framework/gi,
      replacement: 'Use professional storytelling techniques',
      issue: 'External framework reference'
    },
    {
      pattern: /Design Maya's.*?Arc/gi,
      replacement: (match: string) => match.replace(/DreamWorks/gi, 'professional storytelling'),
      issue: 'Framework reference in interactive elements'
    }
  ];

  const runContentAudit = async () => {
    setIsAuditing(true);
    setAuditProgress(0);
    setAuditResults([]);
    setCurrentTask('Starting content audit...');

    try {
      const results: AuditResult[] = [];

      // Audit content_blocks
      setCurrentTask('Auditing lesson content...');
      const { data: contentBlocks } = await supabase
        .from('content_blocks')
        .select('*');

      if (contentBlocks) {
        contentBlocks.forEach(block => {
          auditRules.forEach(rule => {
            ['title', 'content'].forEach(field => {
              const text = block[field];
              if (text && typeof text === 'string') {
                const matches = text.match(rule.pattern);
                if (matches) {
                  const newText = typeof rule.replacement === 'function' 
                    ? rule.replacement(text) 
                    : text.replace(rule.pattern, rule.replacement);
                  
                  results.push({
                    table: 'content_blocks',
                    id: block.id,
                    field,
                    originalText: text,
                    suggestedText: newText,
                    issue: rule.issue
                  });
                }
              }
            });
          });
        });
      }
      setAuditProgress(33);

      // Audit interactive_elements
      setCurrentTask('Auditing interactive components...');
      const { data: interactiveElements } = await supabase
        .from('interactive_elements')
        .select('*');

      if (interactiveElements) {
        interactiveElements.forEach(element => {
          auditRules.forEach(rule => {
            ['title', 'content'].forEach(field => {
              const text = element[field];
              if (text && typeof text === 'string') {
                const matches = text.match(rule.pattern);
                if (matches) {
                  const newText = typeof rule.replacement === 'function' 
                    ? rule.replacement(text) 
                    : text.replace(rule.pattern, rule.replacement);
                  
                  results.push({
                    table: 'interactive_elements',
                    id: element.id,
                    field,
                    originalText: text,
                    suggestedText: newText,
                    issue: rule.issue
                  });
                }
              }
            });
          });
        });
      }
      setAuditProgress(66);

      // Audit chapters
      setCurrentTask('Auditing chapter information...');
      const { data: chapters } = await supabase
        .from('chapters')
        .select('*');

      if (chapters) {
        chapters.forEach(chapter => {
          auditRules.forEach(rule => {
            ['title', 'description'].forEach(field => {
              const text = chapter[field];
              if (text && typeof text === 'string') {
                const matches = text.match(rule.pattern);
                if (matches) {
                  const newText = typeof rule.replacement === 'function' 
                    ? rule.replacement(text) 
                    : text.replace(rule.pattern, rule.replacement);
                  
                  results.push({
                    table: 'chapters',
                    id: chapter.id,
                    field,
                    originalText: text,
                    suggestedText: newText,
                    issue: rule.issue
                  });
                }
              }
            });
          });
        });
      }
      setAuditProgress(100);

      setAuditResults(results);
      setCurrentTask(`Audit complete: ${results.length} issues found`);

      if (results.length === 0) {
        toast.success('No content issues found! All content is properly focused on nonprofit transformation.');
      } else {
        toast.warning(`Found ${results.length} content issues that need attention.`);
      }

    } catch (error) {
      console.error('Audit error:', error);
      toast.error('Audit failed: ' + error.message);
    } finally {
      setIsAuditing(false);
    }
  };

  const fixAllIssues = async () => {
    if (auditResults.length === 0) return;

    setIsFixing(true);
    setCurrentTask('Applying content fixes...');

    try {
      let fixCount = 0;

      for (const result of auditResults) {
        try {
          const updateData = { [result.field]: result.suggestedText };
          
          const { error } = await supabase
            .from(result.table)
            .update(updateData)
            .eq('id', result.id);

          if (!error) {
            fixCount++;
          }
        } catch (error) {
          console.error(`Failed to fix ${result.table}:${result.id}`, error);
        }
      }

      setCurrentTask(`Fixed ${fixCount} of ${auditResults.length} issues`);
      toast.success(`Successfully updated ${fixCount} content items!`);

      // Re-run audit to confirm fixes
      setTimeout(() => {
        runContentAudit();
      }, 1000);

    } catch (error) {
      console.error('Fix error:', error);
      toast.error('Failed to apply fixes: ' + error.message);
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Search className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Content Audit Agent</h2>
        </div>
        <p className="text-gray-600">Ensure all content focuses on nonprofit transformation and learning outcomes</p>
      </div>

      {!isAuditing && auditResults.length === 0 && (
        <div className="text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <Target className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Content Quality Audit</h3>
              <p className="text-blue-700 mb-4">
                This agent will scan all lesson content, interactive elements, and chapter information to ensure everything is focused on nonprofit transformation and learning outcomes.
              </p>
              <ul className="text-sm text-blue-600 text-left space-y-1 mb-4">
                <li>• Remove inappropriate external references</li>
                <li>• Ensure nonprofit-focused language</li>
                <li>• Verify learning-oriented tone</li>
                <li>• Maintain professional messaging</li>
              </ul>
              <Button 
                onClick={runContentAudit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                Start Content Audit
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {isAuditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Running Content Audit...
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={auditProgress} className="w-full" />
            <p className="text-sm text-gray-600">{currentTask}</p>
          </CardContent>
        </Card>
      )}

      {auditResults.length > 0 && (
        <div className="space-y-4">
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Content Issues Found ({auditResults.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-orange-700">
                    Found {auditResults.length} content items that need updating to focus on nonprofit transformation.
                  </p>
                  <Button 
                    onClick={fixAllIssues}
                    disabled={isFixing}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isFixing ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Edit className="w-4 h-4 mr-2" />
                    )}
                    Fix All Issues
                  </Button>
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {auditResults.map((result, index) => (
                    <div key={index} className="bg-white p-3 rounded border border-orange-200">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {result.table} #{result.id}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {result.field}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{result.issue}</p>
                      <div className="space-y-2 text-xs">
                        <div>
                          <strong className="text-red-600">Current:</strong>
                          <p className="bg-red-50 p-2 rounded mt-1 line-through">
                            {result.originalText.length > 100 
                              ? result.originalText.substring(0, 100) + '...' 
                              : result.originalText
                            }
                          </p>
                        </div>
                        <div>
                          <strong className="text-green-600">Suggested:</strong>
                          <p className="bg-green-50 p-2 rounded mt-1">
                            {result.suggestedText.length > 100 
                              ? result.suggestedText.substring(0, 100) + '...' 
                              : result.suggestedText
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isAuditing && auditResults.length === 0 && currentTask && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800">Content Audit Complete</h3>
            <p className="text-sm text-green-700 mt-1">{currentTask}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};