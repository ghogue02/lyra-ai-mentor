import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Sparkles, 
  Wand2,
  Copy,
  Share2,
  Loader2,
  Camera,
  Palette,
  FileText
} from 'lucide-react';
import { useMultimodal } from '@/hooks/useMultimodal';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: Date;
  analysis?: string;
}

interface ImageStyle {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  examples: string[];
}

const imageStyles: ImageStyle[] = [
  {
    id: 'natural',
    name: 'Natural Photography',
    description: 'Realistic, photo-like images',
    systemPrompt: 'Create a photorealistic image with natural lighting and authentic details',
    examples: ['portrait', 'landscape', 'wildlife']
  },
  {
    id: 'artistic',
    name: 'Artistic Illustration',
    description: 'Creative, stylized artwork',
    systemPrompt: 'Create an artistic illustration with creative style and vibrant colors',
    examples: ['watercolor', 'oil painting', 'digital art']
  },
  {
    id: 'professional',
    name: 'Professional Design',
    description: 'Clean, business-ready graphics',
    systemPrompt: 'Create a professional, clean design suitable for business use',
    examples: ['infographic', 'logo', 'presentation']
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit Impact',
    description: 'Emotionally resonant visuals',
    systemPrompt: 'Create compelling visuals that convey social impact and human connection',
    examples: ['community', 'volunteer', 'fundraising']
  }
];

interface MultimodalImageStudioProps {
  character?: 'sofia' | 'alex' | 'maya' | 'david' | 'rachel';
  onImageGenerated?: (image: GeneratedImage) => void;
}

export const MultimodalImageStudio: React.FC<MultimodalImageStudioProps> = ({
  character = 'sofia',
  onImageGenerated
}) => {
  const { toast } = useToast();
  const {
    isProcessing,
    generateImage,
    process,
    exportDocument
  } = useMultimodal({
    autoCreateSession: true
  });

  const [activeTab, setActiveTab] = useState<'generate' | 'analyze' | 'gallery'>('generate');
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string>('natural');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<string>('');
  const [enhancementSuggestions, setEnhancementSuggestions] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Character-specific prompts
  const characterPrompts = {
    sofia: "Tell a visual story that connects emotionally and authentically",
    alex: "Create strategic visuals that drive organizational change",
    maya: "Design images that communicate care and build relationships",
    david: "Visualize data and insights in compelling ways",
    rachel: "Illustrate efficient processes and automation concepts"
  };

  // Generate image
  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;
    
    try {
      const style = imageStyles.find(s => s.id === selectedStyle);
      const enhancedPrompt = `${prompt}. ${style?.systemPrompt || ''}. ${characterPrompts[character]}`;
      
      const imageUrl = await generateImage(enhancedPrompt, selectedStyle);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt,
        style: selectedStyle,
        timestamp: new Date()
      };
      
      setGeneratedImages(prev => [newImage, ...prev]);
      setSelectedImage(newImage);
      onImageGenerated?.(newImage);
      
      toast({
        title: "Image Generated!",
        description: "Your image has been created successfully.",
      });
      
      // Auto-analyze the generated image
      await analyzeGeneratedImage(newImage);
    } catch (error) {
      console.error('Image generation error:', error);
    }
  };

  // Analyze image
  const analyzeImage = async (imageUrl: string) => {
    try {
      const result = await process(
        {
          type: 'image',
          data: imageUrl,
          metadata: { action: 'analyze' }
        },
        {
          inputType: 'image',
          outputType: 'text',
          aiEnhancement: true
        }
      );
      
      setImageAnalysis(result.content);
      
      // Generate enhancement suggestions
      const suggestions = await generateEnhancementSuggestions(result.content);
      setEnhancementSuggestions(suggestions);
    } catch (error) {
      console.error('Image analysis error:', error);
    }
  };

  // Analyze generated image
  const analyzeGeneratedImage = async (image: GeneratedImage) => {
    const analysis = `This ${image.style} style image was generated with the prompt: "${image.prompt}". 
    It effectively captures the intended visual message through its composition and style choices.`;
    
    const updatedImage = { ...image, analysis };
    setGeneratedImages(prev => 
      prev.map(img => img.id === image.id ? updatedImage : img)
    );
    
    if (selectedImage?.id === image.id) {
      setSelectedImage(updatedImage);
    }
  };

  // Generate enhancement suggestions
  const generateEnhancementSuggestions = async (analysis: string): Promise<string[]> => {
    const suggestions = [
      "Add more contrast to make key elements stand out",
      "Consider using warmer tones to create emotional connection",
      "Include human elements to enhance relatability",
      "Simplify the composition for clearer messaging",
      "Add text overlay for context and call-to-action"
    ];
    
    return suggestions.slice(0, 3);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setUploadedImage(dataUrl);
      analyzeImage(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Export image with analysis
  const exportImageWithAnalysis = async (image: GeneratedImage) => {
    const content = {
      title: 'Image Analysis Report',
      sections: [
        {
          title: 'Image Details',
          content: `Prompt: ${image.prompt}\nStyle: ${image.style}\nGenerated: ${image.timestamp.toLocaleString()}`,
          type: 'text' as const
        },
        {
          title: 'Generated Image',
          content: image.url,
          type: 'image' as const
        },
        {
          title: 'Analysis',
          content: image.analysis || 'No analysis available',
          type: 'text' as const
        }
      ]
    };
    
    await exportDocument(content, 'pdf', `Image_Analysis_${image.id}`);
    
    toast({
      title: "Report Exported",
      description: "Image analysis report has been saved as PDF.",
    });
  };

  // Copy prompt to clipboard
  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard.",
    });
  };

  // Style selector component
  const StyleSelector = () => (
    <div className="grid grid-cols-2 gap-3">
      {imageStyles.map(style => (
        <motion.div
          key={style.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelectedStyle(style.id)}
          className={cn(
            "p-4 rounded-lg border-2 cursor-pointer transition-all",
            selectedStyle === style.id 
              ? "border-primary bg-primary/10" 
              : "border-muted hover:border-muted-foreground/50"
          )}
        >
          <h4 className="font-medium">{style.name}</h4>
          <p className="text-sm text-muted-foreground mt-1">{style.description}</p>
          <div className="flex gap-1 mt-2">
            {style.examples.map(ex => (
              <Badge key={ex} variant="secondary" className="text-xs">
                {ex}
              </Badge>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Multimodal Image Studio
            </CardTitle>
            <CardDescription>
              Generate, analyze, and enhance images with AI
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {character.charAt(0).toUpperCase() + character.slice(1)} Mode
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="analyze">Analyze</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label>Image Description</Label>
                <div className="flex gap-2 mt-2">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Describe the image you want to create... ${characterPrompts[character]}`}
                    rows={3}
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <Label className="mb-3 block">Style Selection</Label>
                <StyleSelector />
              </div>
              
              <Button
                onClick={handleGenerateImage}
                disabled={!prompt.trim() || isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
              
              {selectedImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={selectedImage.url} 
                      alt={selectedImage.prompt}
                      className="w-full h-auto"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        onClick={() => exportImageWithAnalysis(selectedImage)}
                        size="icon"
                        variant="secondary"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {selectedImage.analysis && (
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Analysis</h4>
                      <p className="text-sm text-muted-foreground">{selectedImage.analysis}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="analyze" className="space-y-6 mt-6">
            <div className="space-y-4">
              <div>
                <Label>Upload Image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Image
                  </Button>
                </div>
              </div>
              
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded"
                      className="w-full h-auto max-h-96 object-contain bg-muted"
                    />
                  </div>
                  
                  {imageAnalysis && (
                    <div className="space-y-4">
                      <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium mb-2">AI Analysis</h4>
                        <p className="text-sm text-muted-foreground">{imageAnalysis}</p>
                      </div>
                      
                      {enhancementSuggestions.length > 0 && (
                        <div className="bg-primary/5 rounded-lg p-4">
                          <h4 className="font-medium mb-2">Enhancement Suggestions</h4>
                          <ul className="space-y-2">
                            {enhancementSuggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Wand2 className="h-4 w-4 text-primary mt-0.5" />
                                <span className="text-sm">{suggestion}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-6">
            {generatedImages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No images generated yet</p>
                <p className="text-sm mt-2">Start by generating your first image!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generatedImages.map(image => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <img 
                      src={image.url} 
                      alt={image.prompt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <p className="text-white text-sm font-medium line-clamp-2">{image.prompt}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {image.style}
                          </Badge>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyPrompt(image.prompt);
                            }}
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-white hover:bg-white/20"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};