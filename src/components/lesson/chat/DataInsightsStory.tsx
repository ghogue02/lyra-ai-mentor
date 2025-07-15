
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataInsightsStoryProps {
  onAnalyzeData: () => void;
  isVisible: boolean;
}

export const DataInsightsStory: React.FC<DataInsightsStoryProps> = ({
  onAnalyzeData,
  isVisible
}) => {
  const [showCheckMark, setShowCheckMark] = useState(false);

  React.useEffect(() => {
    if (isVisible) {
      // Show the check mark after the story has had time to render
      const timer = setTimeout(() => {
        setShowCheckMark(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setShowCheckMark(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const storyText = `Picture a bustling nonprofit city where spreadsheets roam like unruly dragons: every day these data-beasts cough up half-chewed numbers, mismatched names, and gold coins scattered across campaigns—until our unlikely hero, a bright-eyed Programs Manager named Lyra, volunteers to tame them. Armed only with curiosity and a chat-bot sidekick that thinks in punch lines, Lyra discovers that each messy row hides a donor's heartfelt story waiting to be told. When a looming Year-End Gala threatens to flop without clear totals, Lyra and the bot embark on a comedic quest—dodging duplicate donors, rescuing lost emails, and piecing together amounts that sparkle like treasure. In the end, the once-chaotic ledger transforms into a triumphant tapestry of generosity, proving to the staff (and to every future user) that cracking messy data isn't about crunching numbers—it's about unleashing the epic narrative of impact that's already there. Click the check mark to see how it works.`;

  return (
    <div className="relative p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border-2 border-blue-200 mb-4">
      <div className="text-gray-800 leading-relaxed text-sm">
        {storyText}
      </div>
      
      {showCheckMark && (
        <Button
          onClick={onAnalyzeData}
          className={cn(
            "absolute -bottom-2 -right-2 w-12 h-12 rounded-full",
            "bg-gradient-to-r from-green-500 to-blue-500",
            "hover:from-green-600 hover:to-blue-600",
            "text-white shadow-lg hover:shadow-xl",
            "transform hover:scale-110 transition-all duration-200",
            "animate-bounce"
          )}
        >
          <Check className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
};
