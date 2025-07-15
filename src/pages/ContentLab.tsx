import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MayaAnalyzer } from "@/components/content-lab/MayaAnalyzer";
import { CharacterGenerator } from "@/components/content-lab/CharacterGenerator";
import { PrototypeStudio } from "@/components/content-lab/PrototypeStudio";
import { ContentScaler } from "@/components/content-lab/ContentScaler";
import { Beaker, Brain, Users, Zap } from "lucide-react";

const ContentLab = () => {
  const [activeTab, setActiveTab] = useState("maya-analyzer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Beaker className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Content Lab
            </h1>
            <Badge variant="secondary" className="ml-2">Testing Environment</Badge>
          </div>
          <p className="text-muted-foreground text-lg">
            AI-powered content creation and scaling tools for educational experiences
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="maya-analyzer" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Maya Analyzer
            </TabsTrigger>
            <TabsTrigger value="character-generator" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Character Generator
            </TabsTrigger>
            <TabsTrigger value="prototype-studio" className="flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Prototype Studio
            </TabsTrigger>
            <TabsTrigger value="content-scaler" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Content Scaler
            </TabsTrigger>
          </TabsList>

          <TabsContent value="maya-analyzer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Maya Pattern Analysis
                </CardTitle>
                <CardDescription>
                  Analyze successful Maya Chapter 2 interactions to extract patterns and frameworks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MayaAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="character-generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Character-Based Content Generation
                </CardTitle>
                <CardDescription>
                  Generate content for different characters using Maya's proven patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CharacterGenerator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prototype-studio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5" />
                  Interactive Element Testing
                </CardTitle>
                <CardDescription>
                  Test new interactive elements and lesson structures before production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PrototypeStudio />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content-scaler" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Content Scaling Automation
                </CardTitle>
                <CardDescription>
                  Apply successful patterns across multiple chapters and characters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentScaler />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ContentLab;