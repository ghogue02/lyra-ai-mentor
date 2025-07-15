/**
 * Chapter Architecture Design
 * 
 * This defines the structure for multi-lesson chapters with proper navigation
 * and character-based storytelling.
 */

interface ChapterArchitecture {
  chapterId: number
  title: string
  description: string
  character: CharacterProfile
  lessons: LessonDesign[]
  narrativeArc: NarrativeArc
  navigationFlow: NavigationFlow
}

interface CharacterProfile {
  name: string
  role: string
  organization: string
  challenges: string[]
  transformation: string
}

interface LessonDesign {
  id: number
  title: string
  storyPhase: 'problem' | 'discovery' | 'practice' | 'mastery'
  contentFocus: string
  interactiveElements: InteractiveElementDesign[]
  narrativeHooks: {
    fromPrevious?: string
    toNext?: string
  }
}

interface InteractiveElementDesign {
  type: string
  title: string
  storyIntegration: string
  successMetrics: string[]
}

interface NarrativeArc {
  overallJourney: string
  lessonProgression: string[]
  emotionalBeats: string[]
  transformationMilestones: string[]
}

interface NavigationFlow {
  lessonNavigation: 'sequential' | 'hub-spoke' | 'flexible'
  progressIndicators: string[]
  continuityElements: string[]
}

// Chapter 2 Redesign: Maya's Complete Journey
export const chapter2Architecture: ChapterArchitecture = {
  chapterId: 2,
  title: "AI for Your Daily Work",
  description: "Follow Maya Rodriguez as she transforms her daily workflow with AI tools",
  character: {
    name: "Maya Rodriguez",
    role: "Program Director",
    organization: "Hope Gardens Community Center",
    challenges: [
      "Email overwhelm (47+ daily emails)",
      "Document creation anxiety",
      "Meeting preparation chaos",
      "Research disorganization"
    ],
    transformation: "From overwhelmed administrator to confident AI-powered leader"
  },
  lessons: [
    {
      id: 5,
      title: "Maya's Email Revolution",
      storyPhase: 'problem',
      contentFocus: "Email management and communication",
      interactiveElements: [
        {
          type: "ai_email_composer",
          title: "Turn Maya's Email Anxiety into Connection",
          storyIntegration: "Help Maya respond to Sarah's urgent parent concern",
          successMetrics: ["Time saved: 27 minutes", "Sarah's relief", "Board confidence"]
        },
        {
          type: "email_template_builder",
          title: "Maya's Smart Template System",
          storyIntegration: "Create reusable templates from Maya's successful emails",
          successMetrics: ["3 templates created", "Future time saved", "Consistency achieved"]
        },
        {
          type: "lyra_chat",
          title: "Maya's Communication Strategy Session",
          storyIntegration: "Explore advanced email strategies with Lyra",
          successMetrics: ["Volunteer retention plan", "Board prep tips"]
        }
      ],
      narrativeHooks: {
        toNext: "With email mastered, Maya faces her next challenge: the blank page..."
      }
    },
    {
      id: 6,
      title: "Maya's Document Breakthrough",
      storyPhase: 'discovery',
      contentFocus: "Document creation and improvement",
      interactiveElements: [
        {
          type: "document_generator",
          title: "Maya's Grant Proposal Crisis",
          storyIntegration: "Help Maya create the youth program grant proposal",
          successMetrics: ["$50K grant application completed", "Board impressed", "Template saved"]
        },
        {
          type: "document_improver",
          title: "Polish Maya's Board Report",
          storyIntegration: "Transform Maya's rough notes into executive summary",
          successMetrics: ["Clarity improved 80%", "Patricia's praise", "Confidence boosted"]
        },
        {
          type: "template_creator",
          title: "Maya's Document Template Library",
          storyIntegration: "Build Maya's go-to document templates",
          successMetrics: ["5 templates created", "Team adoption", "Time savings tracked"]
        }
      ],
      narrativeHooks: {
        fromPrevious: "Fresh from email victory, Maya opens a blank document...",
        toNext: "Documents flowing smoothly, but Maya's calendar tells a different story..."
      }
    },
    {
      id: 7,
      title: "Maya's Meeting Mastery",
      storyPhase: 'practice',
      contentFocus: "Meeting preparation and management",
      interactiveElements: [
        {
          type: "agenda_creator",
          title: "Maya's Emergency Board Meeting Prep",
          storyIntegration: "Create agenda for crisis budget meeting",
          successMetrics: ["Agenda completed in 10 min", "All topics covered", "Board focused"]
        },
        {
          type: "meeting_prep_assistant",
          title: "Maya's Staff Meeting Transformation",
          storyIntegration: "Prepare Maya's first AI-powered team meeting",
          successMetrics: ["Materials ready", "Team engaged", "Decisions documented"]
        },
        {
          type: "summary_generator",
          title: "Maya's Meeting Notes Magic",
          storyIntegration: "Transform Maya's chaotic notes into actionable summaries",
          successMetrics: ["Clear action items", "Follow-ups scheduled", "Team aligned"]
        }
      ],
      narrativeHooks: {
        fromPrevious: "Email and documents conquered, Maya faces back-to-back meetings...",
        toNext: "Meetings under control, but Maya needs better information..."
      }
    },
    {
      id: 8,
      title: "Maya's Research Revolution",
      storyPhase: 'mastery',
      contentFocus: "Research and information management",
      interactiveElements: [
        {
          type: "research_assistant",
          title: "Maya's New Program Research",
          storyIntegration: "Help Maya research youth mentorship best practices",
          successMetrics: ["10 sources synthesized", "Key insights found", "Proposal strengthened"]
        },
        {
          type: "information_summarizer",
          title: "Maya's Grant Report Synthesis",
          storyIntegration: "Distill 50 pages of requirements into actionable plan",
          successMetrics: ["50→5 pages", "Clear requirements", "Timeline created"]
        },
        {
          type: "project_planner",
          title: "Maya's Program Launch Plan",
          storyIntegration: "Create comprehensive plan for new youth program",
          successMetrics: ["Full timeline", "Resource allocation", "Board approval"]
        }
      ],
      narrativeHooks: {
        fromPrevious: "With communication flowing, Maya tackles information overload...",
        toNext: "Maya's transformation complete, she's ready to lead others..."
      }
    }
  ],
  narrativeArc: {
    overallJourney: "Maya transforms from overwhelmed administrator to confident AI-powered leader",
    lessonProgression: [
      "Lesson 5: Drowning in email → Email mastery",
      "Lesson 6: Document paralysis → Creation confidence", 
      "Lesson 7: Meeting chaos → Organized leadership",
      "Lesson 8: Information overload → Strategic insights"
    ],
    emotionalBeats: [
      "Opening: Monday morning despair",
      "Lesson 5: First success euphoria (Sarah's email)",
      "Lesson 6: Grant proposal triumph",
      "Lesson 7: Board meeting confidence",
      "Lesson 8: Full transformation realization"
    ],
    transformationMilestones: [
      "First successful AI-assisted email",
      "Grant proposal submitted on time",
      "Leading productive team meeting",
      "Presenting new program with confidence"
    ]
  },
  navigationFlow: {
    lessonNavigation: 'sequential',
    progressIndicators: [
      "Maya's Journey Progress Bar",
      "Skills Unlocked badges",
      "Time Saved Counter",
      "Impact Metrics Dashboard"
    ],
    continuityElements: [
      "Maya's ongoing story thread",
      "Callbacks to previous victories",
      "Building complexity of challenges",
      "Cumulative time savings display"
    ]
  }
}

// Component Architecture for Multi-Lesson Chapters
export const componentArchitecture = {
  routing: {
    pattern: "/chapter/:chapterId",
    subRoutes: {
      overview: "/chapter/:chapterId/overview",
      lesson: "/chapter/:chapterId/lesson/:lessonId",
      progress: "/chapter/:chapterId/progress"
    }
  },
  
  components: {
    ChapterOverview: {
      purpose: "Show all lessons in chapter with Maya's journey",
      features: [
        "Character introduction",
        "Lesson cards with story preview",
        "Overall progress visualization",
        "Journey timeline"
      ]
    },
    
    LessonNavigator: {
      purpose: "Navigate between lessons within chapter",
      features: [
        "Previous/Next lesson buttons",
        "Chapter progress breadcrumb",
        "Quick jump to any lesson",
        "Story continuity hints"
      ]
    },
    
    CharacterProgress: {
      purpose: "Show Maya's transformation progress",
      features: [
        "Skills acquired",
        "Time saved tracker",
        "Milestones achieved",
        "Next challenge preview"
      ]
    }
  },
  
  naming: {
    components: {
      pattern: "[Character][Feature][Element]",
      examples: [
        "MayaEmailResponse",
        "MayaGrantProposal", 
        "MayaAgendaBuilder"
      ]
    },
    files: {
      structure: {
        "src/chapters/chapter2-maya/": "Chapter-specific components",
        "src/chapters/chapter2-maya/lessons/": "Lesson-specific content",
        "src/chapters/chapter2-maya/elements/": "Interactive elements"
      }
    }
  }
}

// Data cleanup actions needed
export const cleanupActions = [
  {
    action: "Remove James content from Lesson 6",
    reason: "Consolidate to Maya's story",
    replacement: "Maya's grant proposal journey"
  },
  {
    action: "Hide all admin tools",
    targets: [
      "interactive_element_auditor",
      "database_debugger",
      "element_workflow_coordinator",
      "chapter_builder_agent"
    ]
  },
  {
    action: "Delete empty lessons 7-8 content",
    reason: "Replace with Maya's journey",
    newContent: "Meeting mastery and research revolution"
  },
  {
    action: "Move misplaced character content",
    moves: [
      "James → Chapter 3 or delete",
      "Other character mentions → Their respective chapters"
    ]
  }
]

export default {
  chapter2Architecture,
  componentArchitecture,
  cleanupActions
}