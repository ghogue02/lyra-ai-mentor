import React from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Volume2, Mic, Zap, Play } from 'lucide-react';
import { VoiceSettings as VoiceSettingsType } from '@/services/voiceService';

interface VoiceSettingsProps {
  settings: VoiceSettingsType;
  onSettingsChange: (updates: Partial<VoiceSettingsType>) => void;
}

const VOICE_OPTIONS = [
  { value: 'alloy', label: 'Alloy (Neutral)' },
  { value: 'echo', label: 'Echo (Male)' },
  { value: 'fable', label: 'Fable (British)' },
  { value: 'onyx', label: 'Onyx (Deep)' },
  { value: 'nova', label: 'Nova (Female)' },
  { value: 'shimmer', label: 'Shimmer (Soft)' },
];

export const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Volume2 className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold">Voice Settings</h3>
      </div>

      <Separator />

      {/* Default Input Mode */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-gray-500" />
            <Label htmlFor="input-mode">Default Input Mode</Label>
          </div>
          <Select
            value={settings.inputMode}
            onValueChange={(value: 'text' | 'voice') => 
              onSettingsChange({ inputMode: value })
            }
          >
            <SelectTrigger id="input-mode" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="voice">Voice</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-gray-500">
          Choose your preferred input method
        </p>
      </div>

      <Separator />

      {/* Auto-play Responses */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-gray-500" />
            <Label htmlFor="auto-play">Auto-play AI Responses</Label>
          </div>
          <Switch
            id="auto-play"
            checked={settings.autoPlayResponses}
            onCheckedChange={(checked) => 
              onSettingsChange({ autoPlayResponses: checked })
            }
          />
        </div>
        <p className="text-xs text-gray-500">
          Automatically play Lyra's responses as audio
        </p>
      </div>

      <Separator />

      {/* Voice Selection */}
      <div className="space-y-2">
        <Label htmlFor="voice-select">AI Voice</Label>
        <Select
          value={settings.selectedVoice}
          onValueChange={(value) => onSettingsChange({ selectedVoice: value })}
        >
          <SelectTrigger id="voice-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {VOICE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          Choose Lyra's voice personality
        </p>
      </div>

      <Separator />

      {/* Speech Speed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-gray-500" />
            <Label htmlFor="speed-slider">Speech Speed</Label>
          </div>
          <span className="text-sm text-gray-600">
            {settings.voiceSpeed.toFixed(1)}x
          </span>
        </div>
        <Slider
          id="speed-slider"
          min={0.5}
          max={2.0}
          step={0.1}
          value={[settings.voiceSpeed]}
          onValueChange={([value]) => onSettingsChange({ voiceSpeed: value })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Slower</span>
          <span>Normal</span>
          <span>Faster</span>
        </div>
      </div>

      <Separator />

      {/* Volume Control */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-500" />
            <Label htmlFor="volume-slider">Volume</Label>
          </div>
          <span className="text-sm text-gray-600">
            {Math.round(settings.voiceVolume * 100)}%
          </span>
        </div>
        <Slider
          id="volume-slider"
          min={0}
          max={1}
          step={0.05}
          value={[settings.voiceVolume]}
          onValueChange={([value]) => onSettingsChange({ voiceVolume: value })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Mute</span>
          <span>50%</span>
          <span>Max</span>
        </div>
      </div>

      <Separator />

      {/* Test Voice Button */}
      <div className="pt-2">
        <button
          onClick={() => {
            // This will be handled by the parent component
            const event = new CustomEvent('test-voice', {
              detail: { 
                text: "Hi! I'm Lyra, your AI mentor. This is how I sound with your current settings.",
                voice: settings.selectedVoice,
                speed: settings.voiceSpeed,
                volume: settings.voiceVolume
              }
            });
            window.dispatchEvent(event);
          }}
          className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Test Voice Settings
        </button>
      </div>
    </Card>
  );
};