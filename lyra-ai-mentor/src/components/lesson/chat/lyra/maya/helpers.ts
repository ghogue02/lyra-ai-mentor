import { MayaJourneyState } from './types';

/**
 * Generate PACE Framework email templates
 */
export function generatePACEEmail(journey: MayaJourneyState): string {
  const templates = {
    'Thank a volunteer parent': `Subject: Thank you for making magic happen! ✨

Hi there!

I just had to reach out and say THANK YOU for volunteering with us! Your help made such a difference for our kids and families.

Seeing you jump in and support our community means the world to all of us at Hope Gardens. We couldn't do what we do without amazing people like you.

With heartfelt gratitude,
Maya Rodriguez
Program Director, Hope Gardens Community Center`,
    
    'Request program feedback': `Subject: Your thoughts would mean so much to us 💭

Hi there!

I hope you and your family are doing well! As we continue growing our programs at Hope Gardens, I'd love to hear your thoughts.

What's working well? What could we improve? Any ideas you'd like to share?

Your perspective helps us serve our community better, and we truly value your input.

Thank you for being part of the Hope Gardens family!

Warmly,
Maya`,
    
    'Invite to fundraising event': `Subject: You're Invited! Special Event at Hope Gardens 🎉

Hi Friend!

I'm thrilled to personally invite you to something special!

Event: Annual Hope Gardens Fundraising Dinner
When: [Date and time]
Where: Hope Gardens Community Center
Why: Celebrating our community and supporting our mission

This gathering means so much to our community, and having you there would make it even more meaningful.

Please RSVP by [date] - we're saving a special spot just for you!

Looking forward to celebrating together,
Maya`,
    
    'Update about program changes': `Subject: Important Update About Hope Gardens Programs

Hi Friend,

I wanted to personally reach out to share some important updates about our programs at Hope Gardens Community Center.

[Update details would go here - Maya always explains the 'why' behind changes]

We're committed to keeping you informed about any changes that might affect your family. If you have any questions or concerns, please don't hesitate to reach out.

Thank you for your understanding and continued support!

Best regards,
Maya Rodriguez
Program Director`
  };

  const key = journey.purpose as keyof typeof templates;
  return templates[key] || "Complete your PACE selections to see Maya's email...";
}

/**
 * Get current stage title by index
 */
export function getStageTitle(stageIndex: number): string {
  const stageTitles = [
    'Meeting Maya Rodriguez',
    'P - Purpose Foundation',
    'A - Audience Intelligence',
    'C - Context (Tone)',
    'E - Execute with AI',
    'Tone Mastery Workshop',
    'Template Library System',
    'Difficult Conversations Guide',
    'Subject Line Excellence'
  ];
  
  return stageTitles[stageIndex] || 'Loading...';
}

/**
 * Calculate journey completion percentage
 */
export function calculateJourneyProgress(currentStage: number, totalStages: number): number {
  return ((currentStage + 1) / totalStages) * 100;
}

/**
 * Get message styling classes based on context
 */
export function getMessageStyles(context?: string) {
  const baseClasses = "rounded-lg p-4 border-l-4 transition-all duration-300";
  
  switch (context) {
    case 'story':
      return `${baseClasses} bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-400`;
    case 'guidance':
      return `${baseClasses} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-400`;
    case 'celebration':
      return `${baseClasses} bg-gradient-to-r from-green-50 to-emerald-50 border-green-400`;
    case 'reflection':
      return `${baseClasses} bg-gradient-to-r from-amber-50 to-orange-50 border-amber-400`;
    default:
      return `${baseClasses} bg-gradient-to-r from-purple-50 to-cyan-50 border-purple-400`;
  }
}

/**
 * Get text color classes based on context
 */
export function getTextStyles(context?: string) {
  const baseClasses = "storytelling-text whitespace-pre-wrap";
  
  switch (context) {
    case 'celebration':
      return `${baseClasses} font-medium text-green-800`;
    case 'guidance':
      return `${baseClasses} text-blue-800`;
    case 'reflection':
      return `${baseClasses} text-amber-800`;
    default:
      return `${baseClasses} text-gray-700`;
  }
}

/**
 * Get cursor color classes based on context
 */
export function getCursorStyles(context?: string) {
  const baseClasses = "inline-block w-0.5 h-5 ml-1 animate-pulse";
  
  switch (context) {
    case 'celebration':
      return `${baseClasses} bg-green-500`;
    case 'guidance':
      return `${baseClasses} bg-blue-500`;
    case 'reflection':
      return `${baseClasses} bg-amber-500`;
    default:
      return `${baseClasses} bg-purple-500`;
  }
}