import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Beaker, Play, Eye, Save, MessageSquare, CheckCircle, Users, BarChart3 } from "lucide-react";
import { toast } from "sonner";

interface PrototypeElement {
  id: string;
  type: string;
  title: string;
  content: string;
  isActive: boolean;
  configuration: any;
}

interface TestSession {
  id: string;
  name: string;
  elements: PrototypeElement[];
  feedback: string[];
  metrics: {
    engagement: number;
    completion: number;
    satisfaction: number;
  };
}

const elementTypes = [
  { id: "chat", name: "Interactive Chat", icon: MessageSquare },
  { id: "quiz", name: "Knowledge Check", icon: CheckCircle },
  { id: "simulation", name: "Scenario Simulation", icon: Play },
  { id: "collaboration", name: "Peer Exercise", icon: Users },
  { id: "analytics", name: "Progress Tracker", icon: BarChart3 },
];

export const PrototypeStudio = () => {
  const [activeSession, setActiveSession] = useState<TestSession | null>(null);
  const [newElement, setNewElement] = useState<Partial<PrototypeElement>>({
    type: "",
    title: "",
    content: "",
    isActive: true,
  });
  const [sessionName, setSessionName] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [testFeedback, setTestFeedback] = useState("");

  const createSession = () => {
    if (!sessionName.trim()) {
      toast.error("Please enter a session name");
      return;
    }

    const session: TestSession = {
      id: Date.now().toString(),
      name: sessionName,
      elements: [],
      feedback: [],
      metrics: {
        engagement: 0,
        completion: 0,
        satisfaction: 0,
      },
    };

    setActiveSession(session);
    setSessionName("");
    toast.success("New prototype session created!");
  };

  const addElement = () => {
    if (!activeSession || !newElement.type || !newElement.title) {
      toast.error("Please select element type and enter a title");
      return;
    }

    const element: PrototypeElement = {
      id: Date.now().toString(),
      type: newElement.type,
      title: newElement.title,
      content: newElement.content || "",
      isActive: newElement.isActive || true,
      configuration: {},
    };

    setActiveSession({
      ...activeSession,
      elements: [...activeSession.elements, element],
    });

    setNewElement({
      type: "",
      title: "",
      content: "",
      isActive: true,
    });

    toast.success("Element added to prototype!");
  };

  const toggleElementActive = (elementId: string) => {
    if (!activeSession) return;

    setActiveSession({
      ...activeSession,
      elements: activeSession.elements.map(el =>
        el.id === elementId ? { ...el, isActive: !el.isActive } : el
      ),
    });
  };

  const submitFeedback = () => {
    if (!activeSession || !testFeedback.trim()) {
      toast.error("Please enter feedback");
      return;
    }

    setActiveSession({
      ...activeSession,
      feedback: [...activeSession.feedback, testFeedback],
    });

    setTestFeedback("");
    toast.success("Feedback recorded!");
  };

  const runSimulation = () => {
    if (!activeSession || activeSession.elements.length === 0) {
      toast.error("Please add elements to test");
      return;
    }

    // Simulate metrics - in real implementation, this would track actual user interactions
    const metrics = {
      engagement: Math.round(Math.random() * 30 + 70),
      completion: Math.round(Math.random() * 20 + 80),
      satisfaction: Math.round(Math.random() * 15 + 85),
    };

    setActiveSession({
      ...activeSession,
      metrics,
    });

    toast.success("Simulation completed! Check the metrics tab.");
  };

  const ElementIcon = ({ type }: { type: string }) => {
    const elementType = elementTypes.find(et => et.id === type);
    const IconComponent = elementType?.icon || Beaker;
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {!activeSession ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5" />
              Create New Prototype Session
            </CardTitle>
            <CardDescription>
              Start a new testing session to prototype interactive elements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Session name (e.g., Maya Chapter 3 Prototype)"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createSession}>Create Session</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{activeSession.name}</h3>
              <p className="text-sm text-muted-foreground">
                {activeSession.elements.length} elements • {activeSession.feedback.length} feedback items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit Mode" : "Preview Mode"}
              </Button>
              <Button onClick={runSimulation}>
                <Play className="h-4 w-4 mr-2" />
                Run Simulation
              </Button>
            </div>
          </div>

          <Tabs defaultValue="elements" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="elements">Elements</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="elements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add New Element</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Element Type</label>
                        <Select 
                          value={newElement.type} 
                          onValueChange={(value) => setNewElement({...newElement, type: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select element type..." />
                          </SelectTrigger>
                          <SelectContent>
                            {elementTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Title</label>
                        <Input
                          placeholder="Element title..."
                          value={newElement.title}
                          onChange={(e) => setNewElement({...newElement, title: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Content</label>
                      <Textarea
                        placeholder="Element content or configuration..."
                        value={newElement.content}
                        onChange={(e) => setNewElement({...newElement, content: e.target.value})}
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button onClick={addElement} className="w-fit">
                      <Save className="h-4 w-4 mr-2" />
                      Add Element
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prototype Elements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {activeSession.elements.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No elements added yet. Create your first element above.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {activeSession.elements.map((element) => (
                          <div key={element.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <ElementIcon type={element.type} />
                              <div>
                                <div className="font-medium">{element.title}</div>
                                <div className="text-sm text-muted-foreground">
                                  {elementTypes.find(et => et.id === element.type)?.name}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={element.isActive ? "default" : "secondary"}>
                                {element.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Switch
                                checked={element.isActive}
                                onCheckedChange={() => toggleElementActive(element.id)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Prototype Preview</CardTitle>
                  <CardDescription>
                    Preview how your prototype will look to users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 bg-background border rounded-lg p-4">
                    {activeSession.elements.filter(el => el.isActive).map((element) => (
                      <div key={element.id} className="p-4 border border-dashed rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ElementIcon type={element.type} />
                          <span className="font-medium">{element.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {element.content || "No content provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Test Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Enter feedback about this prototype..."
                        value={testFeedback}
                        onChange={(e) => setTestFeedback(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <Button onClick={submitFeedback} className="self-end">
                        Submit
                      </Button>
                    </div>

                    <Separator />

                    <ScrollArea className="h-[300px]">
                      {activeSession.feedback.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          No feedback yet. Add your first feedback above.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {activeSession.feedback.map((feedback, index) => (
                            <div key={index} className="p-3 bg-muted/50 rounded-lg">
                              <p className="text-sm">{feedback}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600">
                      {activeSession.metrics.engagement}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      User interaction rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-600">
                      {activeSession.metrics.completion}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Task completion rate
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Satisfaction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-600">
                      {activeSession.metrics.satisfaction}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      User satisfaction score
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};