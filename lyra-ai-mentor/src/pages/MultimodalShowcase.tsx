import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  FileText, 
  Image, 
  Brain, 
  Sparkles,
  ArrowRight,
  Volume2,
  Camera,
  Download
} from 'lucide-react';
import { 
  MultimodalVoiceChat,
  MultimodalDocumentBuilder,
  MultimodalImageStudio
} from '@/components/ai-playground/multimodal';

const MultimodalShowcase = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCharacter, setSelectedCharacter] = useState<'sofia' | 'alex' | 'maya' | 'david' | 'rachel'>('sofia');

  const features = [
    {
      icon: Mic,
      title: 'Voice Integration',
      description: 'Speech-to-text and text-to-speech with OpenAI Whisper and Web Speech API',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: FileText,
      title: 'Document Generation',
      description: 'Create rich documents with multimodal content and export to PDF/DOCX',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Image,
      title: 'Image Processing',
      description: 'Generate and analyze images with DALL-E 3 and vision capabilities',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Brain,
      title: 'AI Enhancement',
      description: 'Enhance all content types with context-aware AI processing',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const characters = [
    { id: 'sofia', name: 'Sofia', role: 'Voice & Story', color: 'purple' },
    { id: 'alex', name: 'Alex', role: 'Strategy', color: 'blue' },
    { id: 'maya', name: 'Maya', role: 'Communication', color: 'green' },
    { id: 'david', name: 'David', role: 'Data & Analytics', color: 'orange' },
    { id: 'rachel', name: 'Rachel', role: 'Automation', color: 'pink' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Multimodal AI Features
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the power of integrated voice, document, and image AI capabilities
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="voice">Voice Chat</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Character Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Choose Your AI Assistant</CardTitle>
                <CardDescription>
                  Each character brings unique expertise to multimodal interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {characters.map(char => (
                    <Button
                      key={char.id}
                      variant={selectedCharacter === char.id ? 'default' : 'outline'}
                      onClick={() => setSelectedCharacter(char.id as any)}
                      className="flex flex-col h-auto py-4"
                    >
                      <span className="font-medium">{char.name}</span>
                      <span className="text-xs text-muted-foreground">{char.role}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Integration Examples */}
            <Card>
              <CardHeader>
                <CardTitle>Integration Examples</CardTitle>
                <CardDescription>
                  See how multimodal features work together
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-purple-600" />
                    <ArrowRight className="h-4 w-4" />
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Voice to Document</h4>
                    <p className="text-sm text-muted-foreground">
                      Record your thoughts and automatically transcribe them into formatted documents
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <ArrowRight className="h-4 w-4" />
                    <Volume2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Document to Speech</h4>
                    <p className="text-sm text-muted-foreground">
                      Convert any document into natural speech for accessibility or review
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-green-600" />
                    <ArrowRight className="h-4 w-4" />
                    <Brain className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">Image Analysis</h4>
                    <p className="text-sm text-muted-foreground">
                      Upload images for AI analysis and receive detailed descriptions and insights
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Example */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Start Code</CardTitle>
                <CardDescription>
                  Get started with multimodal features in your components
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">{`import { useMultimodal } from '@/hooks/useMultimodal';

function MyComponent() {
  const {
    transcribeAudio,
    synthesizeSpeech,
    generateImage,
    exportDocument
  } = useMultimodal();

  // Transcribe audio
  const text = await transcribeAudio(audioBlob);
  
  // Generate speech
  const audio = await synthesizeSpeech("Hello world");
  
  // Generate image
  const imageUrl = await generateImage("A beautiful sunset");
  
  // Export document
  await exportDocument(content, 'pdf', 'My Document');
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="voice">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MultimodalVoiceChat 
                character={selectedCharacter}
                systemPrompt={`You are ${selectedCharacter}, a helpful AI assistant specializing in nonprofit work.`}
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="documents">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MultimodalDocumentBuilder 
                defaultTitle="AI-Enhanced Document"
              />
            </motion.div>
          </TabsContent>

          <TabsContent value="images">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <MultimodalImageStudio 
                character={selectedCharacter}
              />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* API Documentation Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Card className="inline-block">
            <CardContent className="flex items-center gap-4 p-6">
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="text-left">
                <h3 className="font-semibold">Ready to build?</h3>
                <p className="text-sm text-muted-foreground">
                  Check out our documentation for detailed API references
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Docs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MultimodalShowcase;