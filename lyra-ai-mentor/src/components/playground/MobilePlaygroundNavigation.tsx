import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home,
  MessageCircle,
  Mic,
  BarChart3,
  Mail,
  Zap,
  Users,
  Brain,
  Menu,
  X,
  ChevronRight,
  Search,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResponsive, useSwipeGestures } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  color?: string;
  description?: string;
  category: 'challenges' | 'tools' | 'resources';
}

const navigationItems: NavigationItem[] = [
  // Challenges
  {
    id: 'sofia',
    label: "Sofia's Voice Finder",
    icon: <Mic className="w-5 h-5" />,
    category: 'challenges',
    color: 'from-purple-500 to-pink-500',
    description: 'Discover your authentic communication style'
  },
  {
    id: 'david',
    label: "David's Data Storyteller",
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'challenges',
    color: 'from-green-500 to-emerald-500',
    description: 'Transform data into compelling narratives'
  },
  {
    id: 'alex',
    label: "Alex's Change Navigator",
    icon: <Users className="w-5 h-5" />,
    category: 'challenges',
    color: 'from-blue-500 to-cyan-500',
    description: 'Lead organizational transformation'
  },
  {
    id: 'rachel',
    label: "Rachel's Automation Builder",
    icon: <Zap className="w-5 h-5" />,
    category: 'challenges',
    color: 'from-yellow-500 to-orange-500',
    description: 'Streamline workflows with AI'
  },
  {
    id: 'maya',
    label: "Maya's Email Wizard",
    icon: <Mail className="w-5 h-5" />,
    category: 'challenges',
    color: 'from-indigo-500 to-purple-500',
    description: 'Craft personalized donor communications'
  },
  // Tools
  {
    id: 'chat',
    label: 'Lyra Chat',
    icon: <MessageCircle className="w-5 h-5" />,
    category: 'tools',
    badge: 'Online'
  },
  {
    id: 'toolkit',
    label: 'My Toolkit',
    icon: <Brain className="w-5 h-5" />,
    category: 'tools',
    badge: '5 saved'
  },
  // Resources
  {
    id: 'help',
    label: 'Help Center',
    icon: <HelpCircle className="w-5 h-5" />,
    category: 'resources'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    category: 'resources'
  }
];

interface MobilePlaygroundNavigationProps {
  onNavigate?: (itemId: string) => void;
  currentItemId?: string;
}

export const MobilePlaygroundNavigation: React.FC<MobilePlaygroundNavigationProps> = ({
  onNavigate,
  currentItemId
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'challenges' | 'tools' | 'resources'>('all');
  const { isMobile, isTablet } = useResponsive();
  
  // Enable swipe to open navigation
  useSwipeGestures({
    onSwipeRight: () => {
      if (isMobile && !isOpen) {
        setIsOpen(true);
      }
    },
    onSwipeLeft: () => {
      if (isMobile && isOpen) {
        setIsOpen(false);
      }
    }
  });
  
  const filteredItems = navigationItems.filter(item => {
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
    setIsOpen(false);
  };
  
  const renderNavigationItem = (item: NavigationItem) => (
    <motion.div
      key={item.id}
      whileTap={{ scale: 0.98 }}
      className="mb-2"
    >
      <Button
        variant={currentItemId === item.id ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start text-left h-auto py-3",
          currentItemId === item.id && "bg-primary/10"
        )}
        onClick={() => handleItemClick(item.id)}
      >
        <div className="flex items-center gap-3 w-full">
          <div className={cn(
            "p-2 rounded-lg",
            item.color ? `bg-gradient-to-r ${item.color} text-white` : "bg-muted"
          )}>
            {item.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium truncate">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {item.description}
              </p>
            )}
          </div>
          
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </div>
      </Button>
    </motion.div>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      
      {/* Navigation Sheet for Mobile */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[85%] max-w-[350px] p-0">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="text-xl">AI Playground</SheetTitle>
          </SheetHeader>
          
          {/* Search */}
          <div className="px-6 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search features..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          {/* Category Tabs */}
          <div className="px-6 pb-4">
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                <TabsTrigger value="challenges" className="text-xs">Challenges</TabsTrigger>
                <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
                <TabsTrigger value="resources" className="text-xs">Resources</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Navigation Items */}
          <ScrollArea className="flex-1 px-6">
            <AnimatePresence>
              {selectedCategory === 'all' ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">CHALLENGES</h3>
                    {filteredItems
                      .filter(item => item.category === 'challenges')
                      .map(renderNavigationItem)}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">TOOLS</h3>
                    {filteredItems
                      .filter(item => item.category === 'tools')
                      .map(renderNavigationItem)}
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">RESOURCES</h3>
                    {filteredItems
                      .filter(item => item.category === 'resources')
                      .map(renderNavigationItem)}
                  </div>
                </>
              ) : (
                <div className="mb-6">
                  {filteredItems.map(renderNavigationItem)}
                </div>
              )}
            </AnimatePresence>
            
            {filteredItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items found</p>
              </div>
            )}
          </ScrollArea>
          
          {/* Footer */}
          <div className="p-6 border-t">
            <Button variant="outline" className="w-full" onClick={() => handleItemClick('home')}>
              <Home className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Tablet/Desktop Sidebar */}
      {!isMobile && isTablet && (
        <aside className="fixed left-0 top-0 h-full w-64 border-r bg-background p-6 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6">AI Playground</h2>
          
          <div className="space-y-4 mb-6">
            <Input
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as any)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="challenges">Challenges</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-4">
            {filteredItems.map(renderNavigationItem)}
          </div>
        </aside>
      )}
    </>
  );
};