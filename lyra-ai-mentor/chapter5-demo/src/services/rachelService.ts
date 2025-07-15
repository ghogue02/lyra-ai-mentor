import { RachelPersonality, StorytellingFramework, BrandVoice, CreativeProject, RachelLessonConfig } from '../types/rachel';

export class RachelService {
  static getRachelPersonality(): RachelPersonality {
    return {
      name: "Rachel Thompson",
      role: "Creative Storytelling & Brand Voice Expert",
      expertise: [
        "Brand Storytelling",
        "Creative Writing",
        "Content Strategy",
        "Voice & Tone Development",
        "Multi-Platform Narratives",
        "Creative Campaign Development"
      ],
      background: "Former corporate communications manager turned authentic storyteller, with 8 years crafting compelling narratives for brands across industries.",
      currentFocus: "Helping brands discover their authentic voice and create meaningful connections through strategic storytelling.",
      communicationStyle: "Warm, inspiring, and creatively driven. Uses vivid examples and storytelling techniques to make concepts memorable.",
      creativePhilosophy: "Every brand has a unique story worth telling. The key is finding the authentic voice that resonates with your audience and drives meaningful engagement.",
      favoriteTools: [
        "StoryBrand Framework",
        "Content Calendars",
        "Brand Voice Guidelines",
        "Creative Briefs",
        "Narrative Archetypes",
        "Multi-Platform Templates"
      ],
      inspiration: [
        "Human-centered storytelling",
        "Authentic brand voices",
        "Creative campaign innovation",
        "Cross-cultural narratives",
        "Emotional connection strategies"
      ]
    };
  }

  static getStorytellingFramework(): StorytellingFramework {
    return {
      structure: [
        "Hook - Capture attention immediately",
        "Context - Set the scene and stakes",
        "Conflict - Introduce challenges and tension",
        "Resolution - Provide solutions and outcomes",
        "Call to Action - Guide next steps"
      ],
      elements: [
        "Compelling characters",
        "Relatable situations",
        "Emotional stakes",
        "Clear messaging",
        "Authentic voice",
        "Visual storytelling"
      ],
      techniques: [
        "Show, don't tell",
        "Use specific details",
        "Create emotional resonance",
        "Build narrative tension",
        "Include sensory descriptions",
        "End with impact"
      ],
      applications: [
        "Brand origin stories",
        "Customer success narratives",
        "Product launch campaigns",
        "Social media content",
        "Email marketing",
        "Website copy"
      ]
    };
  }

  static getBrandVoiceTemplate(): BrandVoice {
    return {
      tone: "Professional yet approachable",
      personality: [
        "Authentic",
        "Inspiring",
        "Knowledgeable",
        "Supportive",
        "Creative"
      ],
      values: [
        "Authenticity over perfection",
        "Connection over promotion",
        "Value over volume",
        "Story over statistics"
      ],
      audience: "Creative professionals and brand managers seeking authentic storytelling",
      messaging: [
        "Every brand has a story worth telling",
        "Authentic voices create lasting connections",
        "Creative strategy drives meaningful engagement",
        "Stories shape perceptions and drive action"
      ],
      examples: [
        "We believe in the power of authentic storytelling to transform brands",
        "Your story is unique - let's help you tell it with confidence",
        "Creative strategy isn't just about being different - it's about being memorable"
      ]
    };
  }

  static getCreativeProjectTemplate(): CreativeProject {
    return {
      id: "template-001",
      title: "Brand Story Development",
      type: "story",
      description: "Develop a compelling brand origin story that resonates with your target audience",
      objectives: [
        "Define brand personality and values",
        "Identify key story elements",
        "Create narrative structure",
        "Develop content variations",
        "Plan distribution strategy"
      ],
      targetAudience: "Potential customers and brand advocates",
      brandVoice: this.getBrandVoiceTemplate(),
      status: "planning",
      timeline: "2-3 weeks",
      deliverables: [
        "Brand story document",
        "Content variations",
        "Distribution plan",
        "Success metrics"
      ]
    };
  }

  static getLessonConfigs(): RachelLessonConfig[] {
    return [
      {
        id: "lesson-1",
        title: "Storytelling Fundamentals",
        description: "Master the essential elements of compelling storytelling for brand communication",
        objectives: [
          "Understand story structure and elements",
          "Learn storytelling techniques",
          "Practice narrative development",
          "Apply storytelling to brand contexts"
        ],
        duration: "90 minutes",
        difficulty: "beginner",
        prerequisites: ["Basic understanding of marketing concepts"],
        materials: ["Story examples", "Framework templates", "Practice exercises"],
        pace: {
          preview: {
            title: "Story Structure Overview",
            description: "Explore the fundamental elements that make stories compelling and memorable",
            objectives: [
              "Identify key story components",
              "Understand narrative flow",
              "Recognize story patterns"
            ],
            estimatedTime: "15 minutes"
          },
          analyze: {
            title: "Deconstruct Great Stories",
            description: "Analyze successful brand stories to understand what makes them effective",
            activities: [
              {
                id: "analyze-1",
                title: "Story Breakdown Exercise",
                type: "individual",
                duration: "20 minutes",
                description: "Analyze 3 successful brand stories using the story framework",
                materials: ["Story examples", "Analysis template"],
                steps: [
                  "Select brand story examples",
                  "Identify story elements",
                  "Note emotional hooks",
                  "Analyze structure effectiveness"
                ],
                outcomes: ["Completed story analysis", "Framework understanding"]
              }
            ],
            reflectionQuestions: [
              "What makes these stories memorable?",
              "How do they connect emotionally?",
              "What techniques create engagement?"
            ]
          },
          create: {
            title: "Craft Your Story",
            description: "Develop your own compelling brand story using proven frameworks",
            projects: [this.getCreativeProjectTemplate()],
            templates: ["Story outline", "Character development", "Conflict mapping"]
          },
          evaluate: {
            title: "Story Impact Assessment",
            description: "Evaluate story effectiveness and refine for maximum impact",
            criteria: [
              "Clarity of message",
              "Emotional resonance",
              "Audience relevance",
              "Call to action strength"
            ],
            feedbackMethods: ["Peer review", "Audience testing", "Metrics analysis"]
          }
        },
        rachelInsights: [
          "The best brand stories feel personal even when they're about products",
          "Every story needs a clear protagonist your audience can relate to",
          "Conflict creates tension - and tension keeps people engaged",
          "The most powerful stories show transformation, not just information"
        ],
        practicalApplications: [
          "About page storytelling",
          "Product launch narratives",
          "Customer success stories",
          "Social media content"
        ],
        successMetrics: [
          "Completed story framework",
          "Peer feedback scores",
          "Audience engagement metrics",
          "Story clarity assessment"
        ]
      }
    ];
  }

  static getRachelQuote(): string {
    const quotes = [
      "Every brand has a story worth telling - the magic happens when you find the authentic voice to tell it.",
      "Great storytelling isn't about perfect prose - it's about genuine connection.",
      "Your brand voice should feel like a trusted friend, not a corporate announcement.",
      "The best creative campaigns don't just sell products - they build relationships.",
      "Stories shape perceptions, and perceptions drive actions. Choose your narrative wisely."
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }

  static getRachelInsight(topic: string): string {
    const insights = {
      storytelling: "Remember, every great story starts with a character your audience cares about. In brand storytelling, that character is often your customer, not your product.",
      brandvoice: "Your brand voice isn't just how you sound - it's how you make people feel. Consistency in tone creates familiarity, and familiarity builds trust.",
      content: "Content without strategy is just noise. Every piece should serve a purpose in your larger narrative and move your audience closer to connection.",
      creative: "The most creative campaigns aren't just clever - they're memorable. And memorable content is what drives real business results.",
      workshops: "Learning by doing is the most effective way to master storytelling. Practice, get feedback, iterate, and watch your skills transform."
    };
    return insights[topic] || "Creative storytelling is about finding the perfect balance between authenticity and strategy.";
  }
}