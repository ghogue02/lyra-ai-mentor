import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Star, 
  Clock, 
  TrendingUp,
  Bookmark,
  Download,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useResponsive, useSwipeGestures } from '@/hooks/useResponsive';
import { cn } from '@/lib/utils';

interface ToolkitItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  progress?: number;
  isFavorite?: boolean;
  lastUsed?: string;
  color: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface MobileToolkitGridProps {
  items: ToolkitItem[];
  onItemClick?: (item: ToolkitItem) => void;
  layout?: 'grid' | 'list' | 'carousel';
  className?: string;
}

export const MobileToolkitGrid: React.FC<MobileToolkitGridProps> = ({
  items,
  onItemClick,
  layout = 'grid',
  className
}) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const { isMobile, isTablet, isLandscape } = useResponsive();
  
  // Enable swipe gestures for carousel layout
  useSwipeGestures({
    onSwipeLeft: () => {
      if (layout === 'carousel' && currentCarouselIndex < items.length - 1) {
        setCurrentCarouselIndex(prev => prev + 1);
      }
    },
    onSwipeRight: () => {
      if (layout === 'carousel' && currentCarouselIndex > 0) {
        setCurrentCarouselIndex(prev => prev - 1);
      }
    }
  });

  const toggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  const renderCard = (item: ToolkitItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "h-full",
        layout === 'carousel' && "w-full flex-shrink-0"
      )}
    >
      <Card 
        className={cn(
          "h-full cursor-pointer transition-all hover:shadow-lg",
          "border-l-4",
          item.color
        )}
        onClick={() => onItemClick?.(item)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className={cn(
              "p-2 rounded-lg text-white",
              `bg-gradient-to-r ${item.color}`
            )}>
              {item.icon}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(item.id);
                }}>
                  <Star className={cn(
                    "mr-2 h-4 w-4",
                    favorites.has(item.id) && "fill-current text-yellow-500"
                  )} />
                  {favorites.has(item.id) ? 'Remove from' : 'Add to'} favorites
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-3">
            <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
            <CardDescription className="text-sm line-clamp-2 mt-1">
              {item.description}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {item.category}
            </Badge>
            {item.lastUsed && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {item.lastUsed}
              </span>
            )}
          </div>
          
          {item.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-2" />
            </div>
          )}
          
          {item.metrics && (
            <div className="grid grid-cols-2 gap-2">
              {item.metrics.map((metric, idx) => (
                <div key={idx} className="text-center p-2 bg-muted/50 rounded">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="text-sm font-semibold">{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderListItem = (item: ToolkitItem, index: number) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className="cursor-pointer transition-all hover:shadow-md"
        onClick={() => onItemClick?.(item)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-lg text-white shrink-0",
              `bg-gradient-to-r ${item.color}`
            )}>
              {item.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
                {item.lastUsed && (
                  <span className="text-xs text-muted-foreground">
                    {item.lastUsed}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {favorites.has(item.id) && (
                <Star className="w-4 h-4 fill-current text-yellow-500" />
              )}
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          
          {item.progress !== undefined && (
            <Progress value={item.progress} className="h-1.5 mt-3" />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (layout === 'carousel') {
    return (
      <div className={cn("relative", className)}>
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-4"
            animate={{ x: `-${currentCarouselIndex * (isMobile ? 100 : 50)}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={cn(
                  "flex-shrink-0",
                  isMobile ? "w-full px-2" : "w-1/2"
                )}
              >
                {renderCard(item, index)}
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentCarouselIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                index === currentCarouselIndex 
                  ? "bg-primary w-6" 
                  : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  if (layout === 'list') {
    return (
      <div className={cn("space-y-3", className)}>
        {items.map((item, index) => renderListItem(item, index))}
      </div>
    );
  }

  // Grid layout (default)
  const gridCols = isMobile 
    ? "grid-cols-1" 
    : isTablet 
      ? "grid-cols-2" 
      : isLandscape 
        ? "grid-cols-3 lg:grid-cols-4" 
        : "grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cn(
      "grid gap-4",
      gridCols,
      className
    )}>
      {items.map((item, index) => renderCard(item, index))}
    </div>
  );
};