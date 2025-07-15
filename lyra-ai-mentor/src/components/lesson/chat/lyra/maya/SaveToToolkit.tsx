import React, { useState } from 'react';
import { Package, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ToolkitService } from '@/services/toolkitService';
import { supabase } from '@/integrations/supabase/client';
import { type ChoicePath } from '@/types/dynamicPace';

interface SaveToToolkitProps {
  dynamicPath: ChoicePath | null;
  emailContent: string;
  promptBuilder: {
    purpose: string;
    audience: string;
    content: string;
    execute: string;
  };
}

export const SaveToToolkit: React.FC<SaveToToolkitProps> = ({
  dynamicPath,
  emailContent,
  promptBuilder
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveToToolkit = async () => {
    if (!user) {
      toast.error('Please sign in to save to your toolkit');
      navigate('/auth/login?redirect=/lyra-maya-demo');
      return;
    }

    if (!dynamicPath || !emailContent) {
      toast.error('Missing required data to save');
      return;
    }

    setIsSaving(true);

    try {
      // First, get the email category ID
      const { data: categories, error: catError } = await supabase
        .from('toolkit_categories')
        .select('id')
        .eq('category_key', 'email')
        .single();

      if (catError || !categories) {
        throw new Error('Could not find email category');
      }

      // Create a title based on purpose and audience
      const title = `${formatPurposeForDisplay(dynamicPath.purpose)} - ${dynamicPath.audience.label}`;
      
      // Build the complete prompt with proper structure
      const completePrompt = [
        promptBuilder.purpose ? `P - Purpose: ${promptBuilder.purpose}` : '',
        promptBuilder.audience ? `A - Audience: ${promptBuilder.audience}` : '',
        promptBuilder.content ? `C - Content: ${promptBuilder.content}` : '',
        promptBuilder.execute ? `E - Execute: ${promptBuilder.execute}` : ''
      ].filter(Boolean).join('\n\n');

      // Create the "Why This Works" section
      const frameworkName = dynamicPath.content.framework?.mayaFramework?.name || dynamicPath.content.name || 'PACE';
      // Remove duplicate "Framework" if it exists
      const cleanFrameworkName = frameworkName.replace(/\s+Framework\s+Framework/gi, ' Framework');
      
      // Get execution style from dynamic path or default
      const executionStyle = dynamicPath.execute?.executionType || 'balanced';
      const executionDescriptions: Record<string, string> = {
        'balanced': 'Professional yet personal tone',
        'professional': 'Formal and authoritative approach',
        'warm': 'Friendly and conversational style',
        'urgent': 'Direct with clear time sensitivity',
        'data_driven': 'Evidence-based with metrics',
        'collaborative': 'Partnership-focused approach'
      };
      
      const whyThisWorks = `
Purpose: ${formatPurposeForDisplay(dynamicPath.purpose)}
Audience: ${dynamicPath.audience.label}
Content: ${cleanFrameworkName}
Execute: ${executionDescriptions[executionStyle] || 'Concise, personal, and action-oriented'}
      `.trim();

      // Ensure we have the complete email content
      const fullEmailContent = emailContent || 'No email content available';
      
      // Add debugging information to help identify truncation issues
      console.log('SaveToToolkit Debug Info:', {
        promptLength: completePrompt.length,
        emailLength: fullEmailContent.length,
        promptPreview: completePrompt.substring(0, 100) + '...',
        emailPreview: fullEmailContent.substring(0, 100) + '...'
      });

      // Create the toolkit item with metadata as JSON string
      const metadata = {
        pace_data: {
          purpose: dynamicPath.purpose,
          audience: dynamicPath.audience,
          framework: dynamicPath.content.framework?.mayaFramework,
          prompt: completePrompt,
          email_content: fullEmailContent,
          why_this_works: whyThisWorks,
          created_at: new Date().toISOString(),
          // Add raw prompt builder data for debugging
          raw_prompt_builder: promptBuilder
        }
      };

      // Create the toolkit item
      const toolkitItem = {
        name: title,
        category_id: categories.id,
        description: `PACE email template: ${dynamicPath.purpose} for ${dynamicPath.audience.label}`,
        file_type: 'pace_email',
        is_new: true,
        metadata: JSON.stringify(metadata)
      };

      // Check if this item already exists for the user
      const { data: existingItems } = await supabase
        .from('toolkit_items')
        .select('id')
        .eq('name', title)
        .eq('category_id', categories.id);

      let itemId;

      if (existingItems && existingItems.length > 0) {
        // Item exists, just unlock it for the user
        itemId = existingItems[0].id;
      } else {
        // Create new item
        const { data: newItem, error: itemError } = await supabase
          .from('toolkit_items')
          .insert(toolkitItem)
          .select()
          .single();

        if (itemError || !newItem) {
          throw new Error('Failed to create toolkit item');
        }

        itemId = newItem.id;
      }

      // Unlock for the user
      await ToolkitService.unlockToolkitItem(user.id, itemId);

      setIsSaved(true);
      toast.success('Email saved to your toolkit!', {
        description: 'You can access it anytime from your dashboard',
        action: {
          label: 'View Toolkit',
          onClick: () => navigate('/dashboard?tab=toolkit')
        }
      });

      // Check for achievements
      const { data: achievements } = await supabase
        .from('user_toolkit_achievements')
        .select('*, achievement:toolkit_achievements(*)')
        .eq('user_id', user.id)
        .eq('is_unlocked', false);

      // Check if any achievements were just unlocked
      if (achievements) {
        for (const achievement of achievements) {
          if (achievement.achievement?.criteria_type === 'unlock_count' && 
              achievement.current_value + 1 >= achievement.target_value) {
            toast.success(`Achievement Unlocked: ${achievement.achievement.name}!`, {
              description: achievement.achievement.description,
              duration: 5000
            });
          }
        }
      }

    } catch (error) {
      console.error('Error saving to toolkit:', error);
      toast.error('Failed to save to toolkit');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      onClick={handleSaveToToolkit}
      disabled={isSaving || isSaved}
      className={`${
        isSaved 
          ? 'bg-green-600 hover:bg-green-700' 
          : 'bg-purple-600 hover:bg-purple-700'
      } text-white transition-all duration-200`}
    >
      {isSaving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Saving...
        </>
      ) : isSaved ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Saved to Toolkit
        </>
      ) : (
        <>
          <Package className="w-4 h-4 mr-2" />
          Save to MyToolkit
        </>
      )}
    </Button>
  );
};

// Helper function to format purpose for display
function formatPurposeForDisplay(purpose: string): string {
  const purposeMap: Record<string, string> = {
    'inform_educate': 'Share important news',
    'persuade_convince': 'Invite someone to support',
    'build_relationships': 'Build a stronger connection',
    'solve_problems': 'Help someone who\'s worried',
    'request_support': 'Ask for help you need',
    'inspire_motivate': 'Share exciting progress',
    'establish_authority': 'Establish expertise',
    'create_engagement': 'Create engagement'
  };
  
  return purposeMap[purpose] || purpose.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}