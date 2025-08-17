import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { X, Plus } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  hoursPerWeek: number;
  currentTasks: string[];
}

interface CapacityPreset {
  id: string;
  label: string;
  description: string;
  value: number;
}

interface TeamMemberCardProps {
  member: TeamMember;
  onUpdate: (id: string, field: keyof TeamMember, value: any) => void;
  onRemove: () => void;
  onAddTask: (memberId: string, task: string) => void;
  onRemoveTask: (memberId: string, taskIndex: number) => void;
  taskPresets: string[];
  capacityPresets: CapacityPreset[];
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onUpdate,
  onRemove,
  onAddTask,
  onRemoveTask,
  taskPresets,
  capacityPresets
}) => {
  return (
    <div className="p-4 rounded-lg nm-card-subtle border border-dashed border-secondary/30 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Team member name
            </label>
            <input
              value={member.name}
              onChange={(e) => onUpdate(member.id, 'name', e.target.value)}
              className="w-full px-3 py-2 text-lg font-medium bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              placeholder="Enter team member name"
            />
          </div>
          <div className="text-sm text-muted-foreground font-medium">{member.role}</div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      {/* Capacity Presets */}
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Weekly Availability</label>
          <p className="text-xs text-muted-foreground">
            How many hours per week can this person work on your project?
          </p>
        </div>
        <div className="flex gap-2">
          {capacityPresets.map((preset) => (
            <Button
              key={preset.id}
              variant={member.hoursPerWeek === preset.value ? "default" : "outline"}
              size="sm"
              onClick={() => onUpdate(member.id, 'hoursPerWeek', preset.value)}
              className="flex-1"
            >
              {preset.label}
            </Button>
          ))}
        </div>
        
        {/* Fine-tune Slider */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Fine-tune hours: {member.hoursPerWeek}h/week
          </label>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5h</span>
            <span>40h</span>
          </div>
          <Slider
            value={[member.hoursPerWeek]}
            onValueChange={([value]) => onUpdate(member.id, 'hoursPerWeek', value)}
            max={40}
            min={5}
            step={1}
            className="w-full"
          />
        </div>
      </div>

      {/* Current Tasks */}
      <div className="space-y-2">
        <span className="text-sm font-medium">Current Tasks</span>
        <div className="flex flex-wrap gap-2">
          {member.currentTasks.map((task, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => onRemoveTask(member.id, index)}
            >
              {task} <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
        </div>
        
        {/* Task Presets */}
        <div className="flex flex-wrap gap-1">
          {taskPresets.map((task) => (
            <Button
              key={task}
              variant="ghost"
              size="sm"
              onClick={() => !member.currentTasks.includes(task) && onAddTask(member.id, task)}
              className="text-xs h-6 px-2"
              disabled={member.currentTasks.includes(task)}
            >
              <Plus className="w-3 h-3 mr-1" />
              {task}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};