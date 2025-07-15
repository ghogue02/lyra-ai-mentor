import { HelpContent } from '@/components/ui/HelpTooltip';

// General AI Concepts
export const aiHelpContent = {
  // Prompts
  prompt: {
    title: 'What is a Prompt?',
    quickHelp: 'A prompt is your instruction to AI - like asking a helpful assistant a question.',
    detailedHelp: {
      whatIs: 'A prompt is the text you provide to an AI to get a response. Think of it as giving instructions to a very capable assistant who needs clear direction.',
      whyItMatters: 'The quality of your prompt directly affects the quality of AI responses. Clear, specific prompts lead to better, more useful results.',
      howToUse: [
        'Be specific about what you want',
        'Provide context when needed',
        'Use examples to clarify expectations',
        'Break complex requests into steps'
      ],
      examples: [
        {
          input: 'Write an email',
          output: 'Generic, unclear response',
          description: 'Too vague - AI doesn\'t know the purpose or audience'
        },
        {
          input: 'Write a friendly email to parents about our upcoming fundraiser, emphasizing community impact',
          output: 'Targeted, useful email draft',
          description: 'Clear audience, tone, and purpose'
        }
      ],
      commonMistakes: [
        'Being too vague or general',
        'Asking multiple unrelated questions at once',
        'Not providing enough context',
        'Using unclear or ambiguous language'
      ],
      proTips: [
        'Start with your end goal in mind',
        'Use the "persona-task-format" structure',
        'Iterate and refine based on responses',
        'Save successful prompts as templates'
      ]
    }
  },

  // AI Responses
  aiResponse: {
    title: 'Understanding AI Responses',
    quickHelp: 'AI generates responses based on patterns in data - always review and verify important information.',
    detailedHelp: {
      whatIs: 'AI responses are generated text based on your prompt and the AI\'s training. They\'re predictions of helpful content, not guaranteed facts.',
      whyItMatters: 'Understanding how AI generates responses helps you use it effectively and recognize when to verify information or add your expertise.',
      howToUse: [
        'Read responses critically',
        'Verify facts and figures',
        'Edit to match your voice and style',
        'Use as a starting point, not final product'
      ],
      commonMistakes: [
        'Accepting everything without review',
        'Not fact-checking important claims',
        'Using AI tone instead of your own',
        'Ignoring context-specific needs'
      ],
      proTips: [
        'AI is best for first drafts and ideas',
        'Always add your personal expertise',
        'Use AI to overcome writer\'s block',
        'Combine AI help with your knowledge'
      ]
    }
  },

  // Temperature/Creativity
  temperature: {
    title: 'AI Temperature/Creativity',
    quickHelp: 'Controls how creative vs. predictable AI responses are. Higher = more creative, Lower = more focused.',
    detailedHelp: {
      whatIs: 'Temperature is a setting that controls randomness in AI responses. Low temperature (0-0.3) gives consistent, focused answers. High temperature (0.7-1) gives creative, varied responses.',
      whyItMatters: 'Different tasks need different levels of creativity. Financial reports need low temperature for accuracy, while brainstorming needs high temperature for variety.',
      howToUse: [
        'Use low (0-0.3) for factual, consistent content',
        'Use medium (0.4-0.6) for balanced responses',
        'Use high (0.7-1) for creative brainstorming',
        'Adjust based on your needs'
      ],
      examples: [
        {
          description: 'Low temp (0.2): "Dear donor, thank you for your contribution..."',
        },
        {
          description: 'High temp (0.8): "Wow! Your generosity just lit up our whole community..."'
        }
      ]
    }
  }
};

// Character-specific help content
export const characterHelpContent = {
  // Maya's Tools
  maya: {
    emailRecipe: {
      title: 'Email Recipe Builder',
      quickHelp: 'Combine tone, recipient, and purpose to create perfect emails quickly.',
      detailedHelp: {
        whatIs: 'The Email Recipe Builder is a structured approach to email writing that breaks down the process into three key components: emotional tone, recipient context, and communication purpose.',
        whyItMatters: 'Instead of staring at a blank screen, you build emails layer by layer, ensuring you hit the right tone and include all necessary elements. This reduces email writing time from 30+ minutes to under 5 minutes.',
        howToUse: [
          'Select your emotional tone (how you want to sound)',
          'Choose your recipient type (who you\'re writing to)',
          'Pick your purpose (what you want to achieve)',
          'Review and customize the generated email'
        ],
        examples: [
          {
            description: 'Warm tone + Concerned Parent + Address Concern = Empathetic response acknowledging worries'
          },
          {
            description: 'Professional tone + Board Member + Share Update = Formal progress report with metrics'
          }
        ],
        commonMistakes: [
          'Skipping customization of generated emails',
          'Using wrong tone for the recipient',
          'Being too vague about purpose',
          'Not adding specific details'
        ],
        proTips: [
          'Save successful combinations as templates',
          'Always add specific details after generation',
          'Use preview to ensure tone matches intent',
          'Build a library of go-to recipes'
        ]
      }
    },
    
    confidenceMeter: {
      title: 'Communication Confidence Meter',
      quickHelp: 'Track your confidence as you build emails - watch it grow with each decision!',
      detailedHelp: {
        whatIs: 'A visual indicator that shows your growing confidence as you make communication decisions. It reflects how each choice builds toward a complete, effective message.',
        whyItMatters: 'Many people second-guess their communication. The confidence meter shows that good communication is built step-by-step, and each decision moves you forward.',
        howToUse: [
          'Watch the meter grow as you make choices',
          'Notice which decisions boost confidence most',
          'Use full meter as validation to send',
          'Track improvement over time'
        ],
        proTips: [
          'Screenshot high confidence moments',
          'Notice patterns in what builds confidence',
          'Celebrate reaching 100%',
          'Use as motivation to keep practicing'
        ]
      }
    }
  },

  // David's Tools
  david: {
    dataStoryFinder: {
      title: 'Data Story Finder',
      quickHelp: 'Transform raw numbers into compelling narratives that inspire action.',
      detailedHelp: {
        whatIs: 'A tool that helps you identify meaningful patterns and stories hidden in your data. It guides you from numbers to insights to action-inspiring narratives.',
        whyItMatters: 'Data without story is just numbers. Stories without data lack credibility. This tool helps you combine both for maximum impact on donors and stakeholders.',
        howToUse: [
          'Input your raw data or metrics',
          'Identify key patterns or changes',
          'Select your audience',
          'Craft a narrative around the insight'
        ],
        examples: [
          {
            input: '45% increase in program attendance',
            output: 'Our after-school programs are experiencing unprecedented growth, with nearly half more students finding a safe haven here compared to last year.',
          }
        ],
        commonMistakes: [
          'Leading with numbers instead of impact',
          'Forgetting to connect data to mission',
          'Using too many statistics at once',
          'Not providing context for changes'
        ],
        proTips: [
          'Start with the human impact',
          'Use numbers to support, not lead',
          'Create visual metaphors for scale',
          'Always answer "So what?"'
        ]
      }
    },
    
    insightGenerator: {
      title: 'Insight Generator',
      quickHelp: 'Discover hidden patterns and actionable insights in your data.',
      detailedHelp: {
        whatIs: 'An AI-powered analyzer that examines your data from multiple angles to surface insights you might miss. It looks for trends, anomalies, and opportunities.',
        whyItMatters: 'We often get too close to our data to see patterns. This tool provides fresh perspectives and catches important trends that drive better decisions.',
        howToUse: [
          'Upload or paste your data',
          'Select the type of analysis needed',
          'Review generated insights',
          'Prioritize by potential impact'
        ],
        proTips: [
          'Compare different time periods',
          'Look for unexpected correlations',
          'Question surprising insights',
          'Share insights with your team'
        ]
      }
    }
  },

  // Rachel's Tools
  rachel: {
    automationVision: {
      title: 'Automation Vision Scanner',
      quickHelp: 'Identify repetitive tasks that technology can handle, freeing you for meaningful work.',
      detailedHelp: {
        whatIs: 'A systematic approach to identifying tasks in your workflow that can be automated. It helps you spot patterns and repetitive work that drains your time.',
        whyItMatters: 'The average nonprofit worker spends 40% of their time on repetitive tasks. Automation can reclaim this time for mission-critical work that requires human creativity and connection.',
        howToUse: [
          'List your daily/weekly tasks',
          'Identify repetitive patterns',
          'Estimate time spent on each',
          'Prioritize by time saved and ease'
        ],
        examples: [
          {
            description: 'Weekly donor thank you emails → Automated personalized templates save 3 hours/week'
          },
          {
            description: 'Manual data entry from forms → Automated integration saves 5 hours/week'
          }
        ],
        commonMistakes: [
          'Trying to automate everything at once',
          'Automating without documenting process',
          'Ignoring the human touch needed',
          'Not training team on new systems'
        ],
        proTips: [
          'Start with highest time-impact tasks',
          'Keep the personal touch where it matters',
          'Document before you automate',
          'Measure time saved regularly'
        ]
      }
    },
    
    workflowOptimizer: {
      title: 'Workflow Optimizer',
      quickHelp: 'Streamline your processes by identifying bottlenecks and inefficiencies.',
      detailedHelp: {
        whatIs: 'A tool that maps your current workflows and suggests optimizations. It identifies bottlenecks, redundancies, and opportunities for improvement.',
        whyItMatters: 'Small inefficiencies compound over time. Optimizing workflows can save hours each week and reduce frustration for your entire team.',
        howToUse: [
          'Map your current process step-by-step',
          'Identify pain points and delays',
          'Apply suggested optimizations',
          'Test and refine the new workflow'
        ],
        proTips: [
          'Involve the people doing the work',
          'Test changes on small scale first',
          'Document the improved process',
          'Regular reviews keep workflows fresh'
        ]
      }
    }
  },

  // Sofia's Tools
  sofia: {
    voiceDiscovery: {
      title: 'Authentic Voice Discoverer',
      quickHelp: 'Find and refine your unique communication style that connects with others.',
      detailedHelp: {
        whatIs: 'A guided process that helps you identify your natural communication strengths and develop them into a consistent, authentic voice across all channels.',
        whyItMatters: 'Authentic communication builds trust and connection. When you speak in your true voice, people respond more positively and remember your message.',
        howToUse: [
          'Complete voice assessment exercises',
          'Identify your core values and style',
          'Practice in safe environment',
          'Refine based on feedback'
        ],
        examples: [
          {
            description: 'Discovering you naturally use stories → Incorporating more narratives in all communications'
          },
          {
            description: 'Realizing your humor connects → Adding appropriate lightness to serious topics'
          }
        ],
        commonMistakes: [
          'Trying to copy someone else\'s style',
          'Being too formal when natural is better',
          'Ignoring your unique perspective',
          'Not practicing new approaches'
        ],
        proTips: [
          'Record yourself speaking naturally',
          'Notice when communication feels easy',
          'Ask trusted colleagues for feedback',
          'Build on natural strengths'
        ]
      }
    },
    
    storyBuilder: {
      title: 'Impact Story Builder',
      quickHelp: 'Create compelling narratives that showcase your organization\'s impact.',
      detailedHelp: {
        whatIs: 'A structured approach to crafting stories that combine emotional connection with concrete impact. It guides you through the elements of effective nonprofit storytelling.',
        whyItMatters: 'Stories are 22 times more memorable than facts alone. They create emotional connections that inspire action and support.',
        howToUse: [
          'Choose your story subject',
          'Identify the transformation',
          'Add specific details and emotions',
          'Connect to broader mission'
        ],
        proTips: [
          'Use specific names and details',
          'Show transformation, not just need',
          'Include donor as part of story',
          'Keep it concise but complete'
        ]
      }
    }
  },

  // Alex's Tools
  alex: {
    changeStrategy: {
      title: 'Change Leadership Toolkit',
      quickHelp: 'Navigate organizational change with strategies that bring everyone along.',
      detailedHelp: {
        whatIs: 'A comprehensive framework for planning and implementing organizational change. It addresses both technical and human aspects of transformation.',
        whyItMatters: '70% of change initiatives fail due to poor implementation. This toolkit helps you beat those odds by addressing resistance and building buy-in.',
        howToUse: [
          'Assess current state and readiness',
          'Define clear vision and benefits',
          'Identify and address resistance',
          'Create phased implementation plan'
        ],
        commonMistakes: [
          'Moving too fast without buy-in',
          'Ignoring emotional responses',
          'Unclear communication about why',
          'Not celebrating small wins'
        ],
        proTips: [
          'Start with influential early adopters',
          'Over-communicate the vision',
          'Address fears directly',
          'Show quick wins early'
        ]
      }
    },
    
    leadershipDevelopment: {
      title: 'Leadership Development Planner',
      quickHelp: 'Build leadership skills strategically with personalized development plans.',
      detailedHelp: {
        whatIs: 'A tool for creating personalized leadership development plans based on current skills, goals, and organizational needs.',
        whyItMatters: 'Leadership isn\'t just for executives. Developing leadership at all levels creates stronger, more resilient organizations.',
        howToUse: [
          'Assess current leadership skills',
          'Identify growth priorities',
          'Create actionable development plan',
          'Track progress and adjust'
        ],
        proTips: [
          'Focus on 2-3 skills at a time',
          'Find mentors and role models',
          'Practice in low-stakes settings',
          'Seek regular feedback'
        ]
      }
    }
  }
};

// Tool-specific help content
export const toolHelpContent = {
  // Email tools
  emailComposer: characterHelpContent.maya.emailRecipe,
  subjectLineWorkshop: {
    title: 'Subject Line Workshop',
    quickHelp: 'Craft email subject lines that get opened and drive action.',
    detailedHelp: {
      whatIs: 'An interactive workshop that teaches you the psychology and best practices of effective subject lines.',
      whyItMatters: '47% of email recipients open based on subject line alone. A great subject line can double your open rates.',
      howToUse: [
        'Start with your email\'s main purpose',
        'Apply proven formulas',
        'Test different variations',
        'Track what works for your audience'
      ],
      examples: [
        {
          input: 'Newsletter Update',
          output: 'You made this possible: Jamie\'s story inside',
          description: 'Personal, specific, and shows impact'
        }
      ],
      proTips: [
        'Use recipient\'s name when appropriate',
        'Create urgency without being pushy',
        'Ask questions to spark curiosity',
        'Keep under 50 characters'
      ]
    }
  },

  // Data tools  
  dataVisualizer: characterHelpContent.david.dataStoryFinder,
  metricsAnalyzer: {
    title: 'Metrics That Matter Analyzer',
    quickHelp: 'Focus on the metrics that actually drive your mission forward.',
    detailedHelp: {
      whatIs: 'A tool that helps you identify which metrics truly indicate progress toward your mission versus vanity metrics that just look good.',
      whyItMatters: 'It\'s easy to get lost in data. This tool helps you focus on what actually matters for your impact and sustainability.',
      howToUse: [
        'List all metrics you currently track',
        'Map each to mission outcomes',
        'Identify leading vs lagging indicators',
        'Create focused dashboard'
      ],
      proTips: [
        'Quality over quantity in metrics',
        'Connect every metric to mission',
        'Balance output and outcome metrics',
        'Review and refine quarterly'
      ]
    }
  }
};

// Context-aware help suggestions
export const getContextualHelp = (
  userProgress: { completedTools: string[], currentTool: string },
  toolCategory: string
): string => {
  const suggestions: Record<string, Record<string, string>> = {
    beginner: {
      email: 'Start with the Email Recipe Builder - it\'s the fastest way to see results!',
      data: 'Try the Data Story Finder first - turn one number into a compelling narrative.',
      automation: 'Begin with the Task Scanner - identify your biggest time wasters.',
      storytelling: 'Start with Voice Discovery - find your authentic style first.',
      leadership: 'Try the Change Readiness Assessment - know where you stand.'
    },
    intermediate: {
      email: 'You\'re ready for the Template Library - build your personal collection.',
      data: 'Time to try the Insight Generator - find patterns you\'re missing.',
      automation: 'Ready for Workflow Optimization - streamline entire processes.',
      storytelling: 'Try the Story Builder - create your impact narrative.',
      leadership: 'Explore the Strategy Toolkit - level up your planning.'
    },
    advanced: {
      email: 'Master the Communication Metrics - track what truly works.',
      data: 'Dive into Predictive Analytics - anticipate future trends.',
      automation: 'Build Complex Automations - connect multiple systems.',
      storytelling: 'Create Multi-Channel Campaigns - consistent voice everywhere.',
      leadership: 'Design Organization-Wide Change - transform your culture.'
    }
  };

  const level = userProgress.completedTools.length < 3 ? 'beginner' :
               userProgress.completedTools.length < 10 ? 'intermediate' : 'advanced';
  
  return suggestions[level][toolCategory] || 'Explore any tool that interests you!';
};

// Smart tip generator based on usage patterns
export const getSmartTips = (
  toolId: string,
  usageCount: number,
  lastUsed: Date | null
): string[] => {
  const daysSinceUse = lastUsed ? 
    Math.floor((Date.now() - lastUsed.getTime()) / (1000 * 60 * 60 * 24)) : null;

  const tips: string[] = [];

  // First-time user tips
  if (usageCount === 0) {
    tips.push('First time? Take 30 seconds to read the quick help - it\'ll save you time!');
    tips.push('This tool typically takes 5-10 minutes first time, 2-3 minutes once you\'re familiar.');
  }

  // Returning user tips
  if (usageCount > 0 && usageCount < 5) {
    tips.push('Pro tip: Save successful outputs as templates for next time.');
    tips.push('Try experimenting with different approaches - there\'s no wrong way!');
  }

  // Power user tips
  if (usageCount >= 5) {
    tips.push('Power user tip: Combine this with other tools for compound benefits.');
    tips.push('You\'ve used this ' + usageCount + ' times - consider sharing tips with teammates!');
  }

  // Re-engagement tips
  if (daysSinceUse && daysSinceUse > 7) {
    tips.push('Welcome back! The tool has some new features since your last visit.');
    tips.push('Quick refresher: ' + getQuickRefresher(toolId));
  }

  return tips;
};

// Quick refresher content
const getQuickRefresher = (toolId: string): string => {
  const refreshers: Record<string, string> = {
    emailComposer: 'Select tone → choose recipient → define purpose → customize result',
    dataStoryFinder: 'Input data → identify pattern → craft narrative → add context',
    automationVision: 'List tasks → spot patterns → estimate time → prioritize',
    voiceDiscovery: 'Assess style → identify strengths → practice → refine',
    changeStrategy: 'Assess readiness → build vision → address resistance → implement'
  };

  return refreshers[toolId] || 'Jump right in - the tool will guide you!';
};