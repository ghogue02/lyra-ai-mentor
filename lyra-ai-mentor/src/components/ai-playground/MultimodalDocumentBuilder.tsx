import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Mic, 
  Image, 
  Upload, 
  Plus, 
  Trash2, 
  Eye,
  Loader2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { useMultimodal } from '@/hooks/useMultimodal';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ExportData, ExportSection } from '@/services/exportService';

interface DocumentSection {
  id: string;
  type: 'text' | 'voice' | 'image' | 'table';
  title: string;
  content: any;
  metadata?: Record<string, any>;
}

interface MultimodalDocumentBuilderProps {
  defaultTitle?: string;
  onDocumentCreated?: (document: ExportData) => void;
}

export const MultimodalDocumentBuilder: React.FC<MultimodalDocumentBuilderProps> = ({
  defaultTitle = 'New Document',
  onDocumentCreated
}) => {
  const { toast } = useToast();
  const {
    isProcessing,
    transcribeAudio,
    synthesizeSpeech,
    generateImage,
    exportDocument,
    process
  } = useMultimodal({
    autoCreateSession: true
  });

  const [documentTitle, setDocumentTitle] = useState(defaultTitle);
  const [sections, setSections] = useState<DocumentSection[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'docx' | 'txt'>('pdf');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  // Add new section
  const addSection = (type: DocumentSection['type']) => {
    const newSection: DocumentSection = {
      id: Date.now().toString(),
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: type === 'table' ? [] : '',
      metadata: {}
    };
    
    setSections(prev => [...prev, newSection]);
    setActiveSection(newSection.id);
  };

  // Update section
  const updateSection = (id: string, updates: Partial<DocumentSection>) => {
    setSections(prev => prev.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  // Delete section
  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(section => section.id !== id));
    if (activeSection === id) {
      setActiveSection(null);
    }
  };

  // Process voice input for section
  const processVoiceForSection = async (sectionId: string, audioFile: File) => {
    try {
      const transcript = await transcribeAudio(audioFile);
      updateSection(sectionId, { content: transcript });
      
      toast({
        title: "Voice Transcribed",
        description: "Your audio has been converted to text.",
      });
    } catch (error) {
      console.error('Voice processing error:', error);
    }
  };

  // Generate image for section
  const generateImageForSection = async (sectionId: string, prompt: string) => {
    try {
      const imageUrl = await generateImage(prompt);
      updateSection(sectionId, { 
        content: imageUrl,
        metadata: { prompt, generatedAt: new Date().toISOString() }
      });
      
      toast({
        title: "Image Generated",
        description: "Your image has been created successfully.",
      });
    } catch (error) {
      console.error('Image generation error:', error);
    }
  };

  // AI enhance section content
  const enhanceSection = async (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section || section.type !== 'text') return;
    
    try {
      const enhanced = await process(
        {
          type: 'text',
          data: section.content,
          metadata: { title: section.title }
        },
        {
          inputType: 'text',
          outputType: 'text',
          aiEnhancement: true
        }
      );
      
      updateSection(sectionId, { content: enhanced.content });
      
      toast({
        title: "Content Enhanced",
        description: "Your content has been improved with AI.",
      });
    } catch (error) {
      console.error('Enhancement error:', error);
    }
  };

  // Build export data
  const buildExportData = (): ExportData => {
    const exportSections: ExportSection[] = sections.map(section => {
      let type: ExportSection['type'] = 'text';
      if (section.type === 'table') type = 'table';
      else if (section.type === 'image') type = 'image';
      
      return {
        title: section.title,
        content: section.content,
        type
      };
    });
    
    return {
      title: documentTitle,
      content: '',
      sections: exportSections,
      metadata: {
        createdAt: new Date().toISOString(),
        sectionCount: sections.length,
        hasVoice: sections.some(s => s.type === 'voice'),
        hasImages: sections.some(s => s.type === 'image')
      }
    };
  };

  // Export document
  const handleExport = async () => {
    try {
      const exportData = buildExportData();
      await exportDocument(exportData, exportFormat, documentTitle);
      
      onDocumentCreated?.(exportData);
      
      toast({
        title: "Document Exported",
        description: `Your document has been saved as ${exportFormat.toUpperCase()}.`,
      });
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  // Preview document as speech
  const previewAsSpeech = async () => {
    const textContent = sections
      .filter(s => s.type === 'text' || s.type === 'voice')
      .map(s => `${s.title}: ${s.content}`)
      .join('\n\n');
    
    if (!textContent) {
      toast({
        title: "No Text Content",
        description: "Add some text sections to preview as speech.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const audio = await synthesizeSpeech(textContent);
      await audio.play();
    } catch (error) {
      console.error('Speech preview error:', error);
    }
  };

  // Render section editor
  const renderSectionEditor = (section: DocumentSection) => {
    switch (section.type) {
      case 'text':
      case 'voice':
        return (
          <div className="space-y-3">
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter your content..."
              rows={8}
              className="w-full"
            />
            <div className="flex gap-2">
              <Button
                onClick={() => enhanceSection(section.id)}
                disabled={isProcessing || !section.content}
                size="sm"
                variant="outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Enhance with AI
              </Button>
              {section.type === 'voice' && (
                <>
                  <input
                    ref={audioInputRef}
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) processVoiceForSection(section.id, file);
                    }}
                  />
                  <Button
                    onClick={() => audioInputRef.current?.click()}
                    size="sm"
                    variant="outline"
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    Upload Audio
                  </Button>
                </>
              )}
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-3">
            {section.content ? (
              <div className="relative">
                <img 
                  src={section.content} 
                  alt={section.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Badge className="absolute top-2 right-2">
                  AI Generated
                </Badge>
              </div>
            ) : (
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image yet</p>
              </div>
            )}
            <div className="space-y-2">
              <Label>Image Prompt</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Describe the image you want..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      generateImageForSection(section.id, e.currentTarget.value);
                    }
                  }}
                />
                <Button
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    if (input.value) {
                      generateImageForSection(section.id, input.value);
                    }
                  }}
                  disabled={isProcessing}
                  size="icon"
                >
                  <Image className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'table':
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Table editor coming soon. For now, use text format with columns.
            </p>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(section.id, { content: e.target.value })}
              placeholder="Enter table data..."
              rows={6}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Multimodal Document Builder</CardTitle>
            <CardDescription>
              Create rich documents with text, voice, images, and more
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              variant="outline"
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button
              onClick={previewAsSpeech}
              variant="outline"
              size="sm"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Preview Speech
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Structure */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <Label>Document Title</Label>
              <Input
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                placeholder="Enter document title..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={(v: any) => setExportFormat(v)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="docx">Word Document</SelectItem>
                  <SelectItem value="txt">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Sections</Label>
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      activeSection === section.id ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => setActiveSection(section.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{section.type}</Badge>
                        <span className="text-sm font-medium">{section.title}</span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSection(section.id);
                        }}
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  onClick={() => addSection('text')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </Button>
                <Button
                  onClick={() => addSection('voice')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Mic className="h-4 w-4 mr-2" />
                  Voice
                </Button>
                <Button
                  onClick={() => addSection('image')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </Button>
                <Button
                  onClick={() => addSection('table')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>
            
            <Button
              onClick={handleExport}
              disabled={sections.length === 0 || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Document
            </Button>
          </div>
          
          {/* Content Editor */}
          <div className="lg:col-span-2">
            {isPreviewMode ? (
              <div className="space-y-6 p-6 bg-white dark:bg-gray-900 rounded-lg border">
                <h1 className="text-2xl font-bold">{documentTitle}</h1>
                {sections.map(section => (
                  <div key={section.id} className="space-y-2">
                    <h2 className="text-lg font-semibold">{section.title}</h2>
                    {section.type === 'image' && section.content ? (
                      <img 
                        src={section.content} 
                        alt={section.title}
                        className="w-full rounded-lg"
                      />
                    ) : (
                      <p className="whitespace-pre-wrap">{section.content}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : activeSection ? (
              <div className="space-y-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={sections.find(s => s.id === activeSection)?.title || ''}
                    onChange={(e) => updateSection(activeSection, { title: e.target.value })}
                    className="mt-1"
                  />
                </div>
                
                {renderSectionEditor(sections.find(s => s.id === activeSection)!)}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select a section to edit or add a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};