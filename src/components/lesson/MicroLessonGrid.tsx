import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Filter, Search, SortAsc } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { MicroLessonCard } from './MicroLessonCard';
import { OptimizedVideoAnimation } from '../performance/OptimizedVideoAnimation';
import { getAnimationUrl } from '@/utils/supabaseIcons';

interface MicroLesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  locked: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  iconType: 'learning' | 'achievement' | 'growth' | 'mission' | 'network' | 'communication' | 'data' | 'workflow';
  characterName?: string;
  progress?: number;
  category: string;
  tags: string[];
}

interface MicroLessonGridProps {
  lessons: MicroLesson[];
  onLessonClick: (lesson: MicroLesson) => void;
  showAnimation?: boolean;
  title?: string;
  subtitle?: string;
}

type ViewMode = 'grid' | 'list';
type SortMode = 'default' | 'difficulty' | 'duration' | 'progress';
type FilterMode = 'all' | 'completed' | 'in-progress' | 'not-started';

export const MicroLessonGrid: React.FC<MicroLessonGridProps> = ({
  lessons,
  onLessonClick,
  showAnimation = true,
  title = "Micro-Lessons",
  subtitle = "Bite-sized learning experiences"
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortMode, setSortMode] = useState<SortMode>('default');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter and sort lessons
  const filteredAndSortedLessons = React.useMemo(() => {
    let filtered = lessons;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(lesson =>
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    switch (filterMode) {
      case 'completed':
        filtered = filtered.filter(lesson => lesson.completed);
        break;
      case 'in-progress':
        filtered = filtered.filter(lesson => !lesson.completed && (lesson.progress || 0) > 0);
        break;
      case 'not-started':
        filtered = filtered.filter(lesson => !lesson.completed && (lesson.progress || 0) === 0);
        break;
    }

    // Apply sorting
    switch (sortMode) {
      case 'difficulty':
        filtered.sort((a, b) => {
          const order = { beginner: 1, intermediate: 2, advanced: 3 };
          return order[a.difficulty] - order[b.difficulty];
        });
        break;
      case 'duration':
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case 'progress':
        filtered.sort((a, b) => (b.progress || 0) - (a.progress || 0));
        break;
    }

    return filtered;
  }, [lessons, searchQuery, filterMode, sortMode]);

  const stats = React.useMemo(() => {
    const completed = lessons.filter(l => l.completed).length;
    const inProgress = lessons.filter(l => !l.completed && (l.progress || 0) > 0).length;
    const total = lessons.length;
    
    return { completed, inProgress, total };
  }, [lessons]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-3">
          {showAnimation && (
            <div className="w-8 h-8">
              <OptimizedVideoAnimation
                src={getAnimationUrl('micro-lessons-icon.mp4')}
                fallbackIcon={<Grid className="w-8 h-8 text-primary" />}
                className="w-full h-full"
              />
            </div>
          )}
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-cyan bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Progress Stats */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            {stats.completed} Completed
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            {stats.inProgress} In Progress
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            {stats.total - stats.completed - stats.inProgress} Not Started
          </Badge>
        </div>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-center justify-between"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Filter */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value as FilterMode)}
            className="px-3 py-2 text-sm border border-input bg-background rounded-md"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="in-progress">In Progress</option>
            <option value="not-started">Not Started</option>
          </select>

          {/* Sort */}
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="px-3 py-2 text-sm border border-input bg-background rounded-md"
          >
            <option value="default">Default</option>
            <option value="difficulty">Difficulty</option>
            <option value="duration">Duration</option>
            <option value="progress">Progress</option>
          </select>

          {/* View Mode */}
          <div className="flex border border-input rounded-md overflow-hidden">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Lessons Grid/List */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${viewMode}-${filterMode}-${sortMode}-${searchQuery}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}
        >
          {filteredAndSortedLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                viewMode === 'list' && "max-w-full"
              )}
            >
              <MicroLessonCard
                {...lesson}
                onClick={() => onLessonClick(lesson)}
                showAnimation={showAnimation}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredAndSortedLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 space-y-4"
        >
          <div className="w-16 h-16 mx-auto opacity-50">
            <Search className="w-full h-full text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground">No lessons found</h3>
            <p className="text-muted-foreground mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setFilterMode('all');
              setSortMode('default');
            }}
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </div>
  );
};