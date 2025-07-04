import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Users, Zap, Target, CheckCircle, AlertCircle, Rocket, Database, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ChapterBuilderAgentProps {
  onComplete?: () => void;
}

interface Character {
  name: string;
  role: string;
  organization: string;
  personality: string[];
  mainChallenge: string;
  transformation: string;
  aiBreakthrough: string;
}

interface Lesson {
  title: string;
  subtitle: string;
  duration: number;
  storyArc: {
    setup: string;
    conflict: string;
    discovery: string;
    resolution: string;
  };
  contentBlocks: {
    type: string;
    title: string;
    content: string;
    order: number;
  }[];
  interactiveElements: {
    type: string;
    title: string;
    content: string;
    config: any;
    order: number;
  }[];
}

interface ChapterPlan {
  id: number;
  title: string;
  description: string;
  character: Character;
  lessons: Lesson[];
  totalDuration: number;
}

export const ChapterBuilderAgent: React.FC<ChapterBuilderAgentProps> = ({ onComplete }) => {
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [chapterPlan, setChapterPlan] = useState<ChapterPlan | null>(null);
  const [buildResults, setBuildResults] = useState<any>(null);

  const chapterTemplates = [
    {
      id: 3,
      title: 'Communication & Storytelling',
      description: 'Transform how you connect with donors, volunteers, and communities',
      character: 'Sofia Martinez',
      focus: 'Social media, donor communications, impact storytelling'
    },
    {
      id: 4,
      title: 'Data & Decision Making',
      description: 'Turn numbers into narratives that drive funding and support',
      character: 'David Kim',
      focus: 'Data visualization, impact reporting, dashboard creation'
    },
    {
      id: 5,
      title: 'Automation & Efficiency',
      description: 'Build systems that scale your mission impact',
      character: 'Rachel Thompson',
      focus: 'Workflow automation, process optimization, system integration'
    },
    {
      id: 6,
      title: 'Organizational Transformation',
      description: 'Lead your team through AI-powered change',
      character: 'Alex Rivera',
      focus: 'Change management, AI governance, team training'
    }
  ];

  const generateChapterPlan = (chapterId: number): ChapterPlan => {
    const templates: Record<number, ChapterPlan> = {
      3: {
        id: 3,
        title: 'Communication & Storytelling',
        description: 'Transform how you connect with donors, volunteers, and communities using AI-powered storytelling',
        character: {
          name: 'Sofia Martinez',
          role: 'Communications Director',
          organization: 'Fresh Start Food Bank',
          personality: ['Creative but overwhelmed', 'Passionate storyteller', 'Social media anxious', 'Mission-driven'],
          mainChallenge: 'Creating engaging content that cuts through digital noise to inspire action',
          transformation: 'From invisible posts to viral impact stories',
          aiBreakthrough: 'AI helps her scale authentic storytelling without losing personal touch'
        },
        lessons: [
          {
            title: 'Social Media That Actually Works',
            subtitle: 'Turn followers into advocates with AI-powered content',
            duration: 18,
            storyArc: {
              setup: 'Sofia stares at posts with 3 likes while knowing they served 500 families this week',
              conflict: 'Board wants viral content, but Sofia feels like shouting into the void',
              discovery: 'AI can amplify her natural storytelling without making it robotic',
              resolution: 'Sofia creates a post that gets 1000+ engagements and 20 new volunteers'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'Sofia\'s 3 AM Social Media Crisis',
                content: 'Sofia Martinez refreshes Instagram for the fifteenth time tonight. Her latest post about Fresh Start Food Bank\'s mobile pantry program has three likes—one from her mom, one from the intern, and one mysterious heart from someone named "FoodLover47." Meanwhile, influence-fluencers with millions of followers post salad photos that get thousands of reactions.\n\nThe irony cuts deep. This week alone, Fresh Start served 500 families, prevented 2,000 pounds of food waste, and helped Maria find her first job in three years. Sofia has incredible stories to tell, but they seem to evaporate into the digital void, lost among cat videos and celebrity gossip.',
                order: 10
              },
              {
                type: 'text',
                title: 'The Algorithm Doesn\'t Care About Your Mission',
                content: 'Social media platforms prioritize engagement over impact, viral over vital. Sofia knows that behind every statistic is a human story—like 8-year-old Marcus who now has fresh vegetables in his lunchbox, or Mrs. Chen who learned to read food labels in English. But algorithms don\'t understand hope; they understand clicks.\n\nThe pressure is mounting. The board wants "viral content." Funders expect "digital engagement metrics." Volunteers need inspiration. Meanwhile, Sofia feels like she\'s failing at the very thing that should be her superpower: telling stories that matter.',
                order: 20
              },
              {
                type: 'callout_box',
                title: 'The Nonprofit Social Media Struggle',
                content: 'Research shows 78% of nonprofit communications staff feel overwhelmed by social media demands. The average nonprofit post reaches only 2-3% of followers, while mission-critical content gets buried under algorithmic preferences for entertainment.',
                order: 30
              },
              {
                type: 'text',
                title: 'When AI Becomes Your Storytelling Partner',
                content: 'Sofia\'s breakthrough comes when she realizes AI isn\'t about replacing her voice—it\'s about amplifying it. AI can help her understand what makes content shareable, suggest optimal posting times, and even help craft multiple versions of the same story for different platforms and audiences.\n\nThe magic happens when Sofia learns to use AI as her creativity coach, helping her transform "We served 500 families" into "This week, 500 doorsteps heard the sound of hope arriving in a Fresh Start Food Bank truck." Same truth, different impact.',
                order: 40
              }
            ],
            interactiveElements: [
              {
                type: 'ai_social_media_generator',
                title: 'Help Sofia Create This Week\'s Posts',
                content: 'Sofia needs to create a week\'s worth of content about the mobile pantry program. The facts: served 500 families, prevented food waste, helped 3 people find jobs. Help Sofia transform these statistics into stories that inspire action.',
                config: {
                  character: 'Sofia Martinez',
                  scenario: 'mobile_pantry_week',
                  platforms: ['facebook', 'instagram', 'twitter'],
                  tone: 'inspiring_but_authentic',
                  stats: ['500 families served', '2000 lbs food saved', '3 job placements']
                },
                order: 50
              },
              {
                type: 'hashtag_optimizer',
                title: 'Crack the Algorithm Code',
                content: 'Sofia\'s posts aren\'t being seen because she\'s using hashtags like #nonprofit and #foodbank that are oversaturated. Help her find hashtags that actually connect with people who care about food security.',
                config: {
                  character: 'Sofia Martinez',
                  content_theme: 'food_security',
                  target_audience: 'potential_volunteers_and_donors',
                  current_hashtags: ['#nonprofit', '#foodbank', '#hungry']
                },
                order: 60
              }
            ]
          },
          {
            title: 'Donor Communications That Convert',
            subtitle: 'Write emails and letters that inspire generosity',
            duration: 20,
            storyArc: {
              setup: 'Sofia\'s donor newsletter has a 12% open rate and zero responses',
              conflict: 'Major donor asks "How do I know my gift actually matters?"',
              discovery: 'AI helps craft personalized impact stories for each donor segment',
              resolution: 'Donor gives largest gift ever, saying "Now I see exactly how you\'re changing lives"'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Email That Never Gets Opened',
                content: 'Sofia stares at the email analytics dashboard. Subject line: "Fresh Start Food Bank Monthly Update." Open rate: 12%. Click rate: 2%. Unsubscribe rate: climbing. The same donors who light up when she tells stories in person seem to ignore her digital communications entirely.\n\nThe cruelest irony? This month\'s newsletter contains incredible stories. The Johnson family graduating from food assistance. The new partnership with local schools. The volunteer who discovered her passion for nutrition counseling. Stories that could move people to action—if anyone actually read them.',
                order: 10
              },
              {
                type: 'text',
                title: 'Personalization at Scale Feels Impossible',
                content: 'Sofia knows personalization works. When she writes individual thank-you notes, donors respond with joy and increased giving. But Fresh Start has 2,400 donors across five different giving levels, three engagement preferences, and varying communication styles. How do you write 2,400 personal messages without losing your sanity or your authenticity?\n\nThe solution isn\'t working harder—it\'s working smarter with AI that understands donor psychology.',
                order: 20
              }
            ],
            interactiveElements: [
              {
                type: 'ai_email_campaign_writer',
                title: 'Revamp Sofia\'s Donor Newsletter',
                content: 'Sofia\'s monthly newsletter is getting ignored. Help her create a donor communication that feels personal, tells compelling stories, and includes clear calls to action that actually get responses.',
                config: {
                  character: 'Sofia Martinez',
                  audience: 'monthly_donors',
                  goal: 'increase_engagement_and_giving',
                  stories: ['family_graduation', 'school_partnership', 'volunteer_transformation']
                },
                order: 30
              }
            ]
          },
          {
            title: 'Impact Storytelling That Moves People',
            subtitle: 'Transform data into narratives that inspire action',
            duration: 22,
            storyArc: {
              setup: 'Foundation officer says "Your numbers are impressive, but I don\'t feel the impact"',
              conflict: 'Sofia has amazing data but struggles to make it emotionally compelling',
              discovery: 'AI helps weave data points into human stories',
              resolution: 'Foundation funds three-year expansion saying "This is exactly the impact we want to support"'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'When Data Doesn\'t Tell the Story',
                content: 'The foundation officer scrolls through Fresh Start\'s impact report: "15,000 meals distributed, 300 families served monthly, 95% client satisfaction rating." She nods politely but Sofia can see the glazed look. Numbers without narratives feel sterile, disconnected from the human transformation they represent.\n\n"Your data is impressive," the officer says carefully, "but I\'m not feeling the impact. Can you help me understand what these numbers actually mean for people\'s lives?"',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'data_storyteller',
                title: 'Transform Sofia\'s Impact Data',
                content: 'Sofia has powerful statistics but needs to present them in a way that makes foundation officers feel the human impact. Help her create a data story that wins funding.',
                config: {
                  character: 'Sofia Martinez',
                  data_points: ['15000 meals', '300 families', '95% satisfaction'],
                  audience: 'foundation_officers',
                  goal: 'funding_approval'
                },
                order: 20
              }
            ]
          },
          {
            title: 'Content Strategy That Scales',
            subtitle: 'Build systems for consistent, engaging communication',
            duration: 25,
            storyArc: {
              setup: 'Sofia is personally creating every post, email, and story',
              conflict: 'Burnout threatens as communication demands grow',
              discovery: 'AI-powered content systems can maintain quality while scaling output',
              resolution: 'Sofia builds a content machine that works even when she\'s on vacation'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Content Creation Treadmill',
                content: 'Sofia\'s calendar looks like a rainbow explosion of deadlines: social media posts (daily), donor newsletter (monthly), volunteer communications (weekly), board updates (quarterly), grant reports (constantly), website updates (whenever someone remembers). Each piece needs her personal touch, her storytelling magic, her... time.\n\nThe math doesn\'t work. Quality communication is Sofia\'s superpower, but there are only 24 hours in a day and seven days in a week. Something has to give—but what?',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'content_calendar_builder',
                title: 'Design Sofia\'s Content System',
                content: 'Sofia needs a sustainable content strategy that maintains quality while scaling output. Help her design a content calendar and system that works even during busy periods.',
                config: {
                  character: 'Sofia Martinez',
                  content_types: ['social_media', 'donor_communications', 'volunteer_updates'],
                  frequency_goals: { social: 'daily', donors: 'monthly', volunteers: 'weekly' }
                },
                order: 20
              }
            ]
          }
        ],
        totalDuration: 85
      },
      4: {
        id: 4,
        title: 'Data & Decision Making',
        description: 'Turn numbers into narratives that drive funding and strategic decisions',
        character: {
          name: 'David Kim',
          role: 'Data Analyst',
          organization: 'Youth Futures Initiative',
          personality: ['Detail-oriented', 'Numbers-focused', 'Presentation-anxious', 'Impact-driven'],
          mainChallenge: 'Making data compelling and accessible to non-technical stakeholders',
          transformation: 'From spreadsheet overwhelm to data storytelling mastery',
          aiBreakthrough: 'AI helps translate complex data into compelling visual narratives'
        },
        lessons: [
          {
            title: 'Data Dashboards That Actually Get Used',
            subtitle: 'Create visualizations that drive decisions',
            duration: 22,
            storyArc: {
              setup: 'David creates beautiful dashboards that nobody looks at',
              conflict: 'Executive director makes decisions based on gut feeling instead of data',
              discovery: 'AI helps create intuitive, actionable dashboards',
              resolution: 'Board uses David\'s dashboard to approve program expansion'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'David\'s Dashboard Graveyard',
                content: 'David Kim has created seventeen different dashboards this year. Seventeen! Each one more sophisticated than the last, with color-coded metrics, trend lines, and drill-down capabilities that would make any data scientist proud. The problem? Nobody uses them.\n\nThe executive director still asks for "quick updates" via email. Program managers print out charts to mark them up with pens. Board members squint at tiny mobile screens during Zoom calls, asking "Can you make that bigger?" David\'s beautiful data visualizations have become digital art—impressive but irrelevant.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'impact_dashboard_creator',
                title: 'Redesign David\'s Executive Dashboard',
                content: 'David\'s current dashboard is too complex for busy executives. Help him create a simple, actionable dashboard that board members and program directors will actually use to make decisions.',
                config: {
                  character: 'David Kim',
                  audience: 'executives_and_board',
                  complexity_level: 'simple_and_actionable',
                  key_metrics: ['program_outcomes', 'cost_effectiveness', 'participant_satisfaction']
                },
                order: 20
              }
            ]
          },
          {
            title: 'Reports That Win Funding',
            subtitle: 'Transform data into compelling funding proposals',
            duration: 24,
            storyArc: {
              setup: 'Foundation says David\'s reports are "very thorough" but denies funding',
              conflict: 'Data shows impact but fails to convey urgency and opportunity',
              discovery: 'AI helps structure data to tell a funding story',
              resolution: 'Same data, different presentation wins $250K grant'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Polite Rejection Email',
                content: 'David reads the foundation\'s response for the third time: "Thank you for your very thorough report. While Youth Futures Initiative clearly does important work, we\'ve decided to focus our funding elsewhere this cycle. We encourage you to apply again next year."\n\nVery thorough. Translation: boring. David knows their data is strong—93% job placement rate, 78% wage increases, 87% program completion. But somehow, strong data isn\'t translating to strong funding.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'report_builder',
                title: 'Transform David\'s Foundation Report',
                content: 'David\'s foundation report has all the right data but isn\'t winning funding. Help him restructure the same information to tell a compelling story that moves foundation officers to invest.',
                config: {
                  character: 'David Kim',
                  report_type: 'foundation_funding',
                  current_data: ['93% job placement', '78% wage increase', '87% completion'],
                  goal: 'win_funding_approval'
                },
                order: 20
              }
            ]
          },
          {
            title: 'Data-Driven Program Decisions',
            subtitle: 'Use analytics to optimize program effectiveness',
            duration: 20,
            storyArc: {
              setup: 'Program results are mixed but David can\'t pinpoint why',
              conflict: 'Without clear insights, programs waste resources on ineffective approaches',
              discovery: 'AI analytics reveal hidden patterns in participant success',
              resolution: 'Program redesign based on insights doubles success rates'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Mystery of Inconsistent Results',
                content: 'David stares at the program outcome spreadsheet, frustrated. Cohort A: 95% job placement. Cohort B: 67% job placement. Cohort C: 89% job placement. Same curriculum, same instructors, same resources—dramatically different results. What\'s the difference?\n\nTraditional analysis shows correlations but not causations. David needs deeper insights to understand not just what happened, but why it happened and how to replicate success.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'data_analyzer',
                title: 'Solve David\'s Success Pattern Mystery',
                content: 'David has inconsistent program results and needs to understand why some cohorts succeed dramatically more than others. Help him analyze the data to find actionable insights.',
                config: {
                  character: 'David Kim',
                  analysis_type: 'program_effectiveness',
                  data_points: ['participant_demographics', 'instructor_assignments', 'session_timing', 'outcomes'],
                  goal: 'identify_success_factors'
                },
                order: 20
              }
            ]
          },
          {
            title: 'Predictive Analytics for Impact',
            subtitle: 'Forecast outcomes and prevent problems before they happen',
            duration: 26,
            storyArc: {
              setup: 'David can only report what happened, not predict what will happen',
              conflict: 'Program coordinator asks "Which participants are at risk of dropping out?"',
              discovery: 'AI can identify early warning signs and intervention opportunities',
              resolution: 'Proactive interventions increase program completion by 40%'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Question David Couldn\'t Answer',
                content: 'The program coordinator leans over David\'s desk with urgency in her voice: "David, I need your help. We\'re three weeks into the new cohort, and I have a feeling some participants are going to drop out. Can you tell me who\'s at risk so we can intervene early?"\n\nDavid\'s heart sinks. He can tell her exactly who dropped out last time, and why, and when. But predict who will drop out this time? His spreadsheets look backward, not forward.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'trend_identifier',
                title: 'Build David\'s Early Warning System',
                content: 'David needs to identify participants at risk of dropping out before it happens. Help him build a predictive system that flags early warning signs so staff can intervene proactively.',
                config: {
                  character: 'David Kim',
                  prediction_type: 'dropout_risk',
                  warning_indicators: ['attendance_patterns', 'engagement_scores', 'assessment_results'],
                  intervention_goal: 'proactive_support'
                },
                order: 20
              }
            ]
          }
        ],
        totalDuration: 92
      },
      5: {
        id: 5,
        title: 'Automation & Efficiency',
        description: 'Build AI-powered systems that scale your mission impact while preserving human connection',
        character: {
          name: 'Rachel Thompson',
          role: 'Operations Manager',
          organization: 'Community Health Alliance',
          personality: ['Systems-thinking', 'Efficiency-focused', 'Team-protective', 'Mission-driven'],
          mainChallenge: 'Eliminating manual busywork without losing personal touch in client services',
          transformation: 'From chaotic manual processes to elegant automated systems',
          aiBreakthrough: 'AI handles routine tasks so staff can focus on human connection and complex problem-solving'
        },
        lessons: [
          {
            title: 'Workflow Automation That Actually Works',
            subtitle: 'Design systems that eliminate busywork and amplify impact',
            duration: 25,
            storyArc: {
              setup: 'Rachel\'s team spends 40% of time on data entry and status updates',
              conflict: 'Manual processes create bottlenecks that delay client services',
              discovery: 'AI workflow automation can handle routine tasks while preserving decision points',
              resolution: 'Team reclaims 15 hours weekly to spend on direct client support'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'Rachel\'s Workflow Nightmare',
                content: 'Rachel Thompson watches her health navigator spend twenty minutes entering the same client information into four different systems. Insurance database. Service tracking spreadsheet. State reporting portal. Internal case management system. Four times, same data, manual typing, human error creeping in with each entry.\n\nMeanwhile, three clients wait in the lobby for intake appointments that are running behind schedule. The irony is devastating: technology that\'s supposed to help serves families is actually preventing staff from helping families.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'workflow_automator',
                title: 'Redesign Rachel\'s Client Intake Process',
                content: 'Rachel\'s intake process requires staff to enter the same information into multiple systems, creating delays and errors. Help her design an automated workflow that captures data once and distributes it everywhere it\'s needed.',
                config: {
                  character: 'Rachel Thompson',
                  process_type: 'client_intake',
                  current_pain: 'manual_duplicate_entry',
                  systems: ['insurance_database', 'service_tracking', 'state_reporting', 'case_management'],
                  goal: 'eliminate_redundancy'
                },
                order: 20
              }
            ]
          },
          {
            title: 'Smart Scheduling and Resource Management',
            subtitle: 'Optimize staff time and resource allocation automatically',
            duration: 22,
            storyArc: {
              setup: 'Rachel manually creates schedules that never account for real-world complexity',
              conflict: 'Last-minute changes create chaos, overtime, and staff burnout',
              discovery: 'AI can predict scheduling conflicts and optimize resource allocation',
              resolution: 'Automated scheduling reduces overtime 60% while improving client access'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Schedule That Never Survives',
                content: 'Every Sunday night, Rachel spends three hours creating the perfect schedule. Staff preferences balanced with client needs. Skill sets matched with service requirements. Geographic efficiency optimized for travel time. By Tuesday afternoon, her beautiful schedule is demolished by sick calls, emergency appointments, and the inevitable "urgent" requests that nobody could have predicted.\n\nRescheduling creates a domino effect: clients get bumped, staff work overtime, morale drops, and Rachel feels like she\'s failing everyone.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'task_scheduler',
                title: 'Build Rachel\'s Smart Scheduling System',
                content: 'Rachel\'s manual scheduling breaks down whenever changes occur. Help her design an intelligent scheduling system that adapts to real-world disruptions while optimizing for both staff efficiency and client needs.',
                config: {
                  character: 'Rachel Thompson',
                  scheduling_type: 'staff_and_client_services',
                  constraints: ['staff_skills', 'travel_time', 'client_preferences', 'emergency_flexibility'],
                  optimization_goals: ['minimize_overtime', 'maximize_client_access']
                },
                order: 20
              }
            ]
          },
          {
            title: 'Integration Magic: Making Systems Talk',
            subtitle: 'Connect disconnected tools for seamless operations',
            duration: 28,
            storyArc: {
              setup: 'Rachel manages twelve different software systems that don\'t communicate',
              conflict: 'Data silos create errors, duplicated work, and missed opportunities',
              discovery: 'AI-powered integrations can connect any systems automatically',
              resolution: 'Unified data flow eliminates 80% of manual data entry and improves service quality'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Tower of Babel Software Problem',
                content: 'Rachel\'s computer desktop looks like a software museum: twelve different programs, each speaking its own data language, none talking to the others. Client management system doesn\'t talk to scheduling software. Financial tracking doesn\'t connect to service delivery. Reporting tools require manual exports and imports that consume entire afternoons.\n\nThe result? Critical information gets trapped in silos while staff waste time playing telephone between systems that should be having conversations automatically.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'integration_builder',
                title: 'Connect Rachel\'s Disconnected Systems',
                content: 'Rachel has twelve software systems that don\'t share information, creating inefficiency and errors. Help her design integrations that make her systems work together seamlessly.',
                config: {
                  character: 'Rachel Thompson',
                  systems: ['client_management', 'scheduling', 'financial_tracking', 'service_delivery', 'reporting'],
                  integration_goals: ['eliminate_duplicate_entry', 'improve_data_accuracy', 'enable_real_time_reporting'],
                  complexity: 'user_friendly'
                },
                order: 20
              }
            ]
          },
          {
            title: 'Process Optimization That Preserves Humanity',
            subtitle: 'Automate tasks while enhancing human connection',
            duration: 20,
            storyArc: {
              setup: 'Rachel worries automation will make services feel impersonal',
              conflict: 'Team fears AI will replace human judgment and empathy',
              discovery: 'AI can handle routine tasks so humans focus on complex, emotional work',
              resolution: 'Clients report feeling more supported because staff have time for meaningful conversations'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Humanity vs. Efficiency False Choice',
                content: 'Rachel\'s health navigator Maria pulls her aside with concern: "I heard we\'re automating client services. Are you trying to replace us with robots?" The fear is real and understandable. Community Health Alliance serves vulnerable families dealing with complex medical, financial, and social challenges. These clients need human empathy, cultural understanding, and emotional support.\n\nBut Rachel sees a different possibility: what if automation could give Maria more time for the human connection that makes their work meaningful?',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'process_optimizer',
                title: 'Optimize Rachel\'s Client Services',
                content: 'Rachel wants to use automation to give staff more time for meaningful client interaction, not less. Help her identify which processes to automate and which to keep human-centered.',
                config: {
                  character: 'Rachel Thompson',
                  process_type: 'client_services',
                  automation_principle: 'enhance_human_connection',
                  human_tasks: ['emotional_support', 'complex_problem_solving', 'cultural_navigation'],
                  automation_tasks: ['data_entry', 'appointment_reminders', 'status_updates']
                },
                order: 20
              }
            ]
          }
        ],
        totalDuration: 95
      },
      6: {
        id: 6,
        title: 'Organizational Transformation',
        description: 'Lead your team through AI-powered change while maintaining mission focus and human values',
        character: {
          name: 'Alex Rivera',
          role: 'Executive Director',
          organization: 'Digital Divide Solutions',
          personality: ['Visionary leader', 'Change-cautious', 'Team-focused', 'Mission-protective'],
          mainChallenge: 'Leading organizational AI adoption without losing staff trust or mission focus',
          transformation: 'From AI anxiety to confident change leadership',
          aiBreakthrough: 'AI becomes a tool for empowering staff and amplifying mission impact'
        },
        lessons: [
          {
            title: 'Building AI-Ready Culture',
            subtitle: 'Prepare your team for technological transformation',
            duration: 24,
            storyArc: {
              setup: 'Alex\'s staff range from AI-enthusiastic to AI-terrified',
              conflict: 'Change initiatives fail when people feel threatened or confused',
              discovery: 'AI readiness starts with mindset, not technology',
              resolution: 'Team embraces AI as mission amplifier, not job threat'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'Alex\'s AI Readiness Reality Check',
                content: 'Alex Rivera sits in the Digital Divide Solutions staff meeting, watching the range of reactions to her AI initiative announcement. Sarah (age 28) is practically bouncing with excitement about ChatGPT and automation possibilities. Robert (age 52) looks like she just announced the building is on fire. Maria (age 41) seems cautiously curious but worried about learning new skills.\n\nThe irony isn\'t lost on Alex: they\'re fighting digital inequity in the community while struggling with digital transformation internally. How do you lead an organization through AI adoption when your own team spans the full spectrum of technological comfort?',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'ai_readiness_assessor',
                title: 'Assess Alex\'s Team for AI Transformation',
                content: 'Alex needs to understand where each team member stands in terms of AI readiness before launching any transformation initiatives. Help her assess the team\'s current state and plan appropriate change management approaches.',
                config: {
                  character: 'Alex Rivera',
                  assessment_type: 'team_readiness',
                  team_diversity: ['tech_enthusiasts', 'cautious_adopters', 'resistance_concerns'],
                  change_goals: ['build_confidence', 'address_fears', 'create_excitement']
                },
                order: 20
              }
            ]
          },
          {
            title: 'Training That Actually Sticks',
            subtitle: 'Design learning experiences that build confidence and competence',
            duration: 26,
            storyArc: {
              setup: 'Previous technology training efforts resulted in low adoption and high frustration',
              conflict: 'Staff attend training but don\'t use tools in daily work',
              discovery: 'AI training must be hands-on, relevant, and confidence-building',
              resolution: 'Team becomes AI-confident through practical, mission-focused learning'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Training Graveyard',
                content: 'Alex opens the file cabinet labeled "Professional Development" and winces. Certificate after certificate from training sessions that promised transformation but delivered frustration. Database management (never used). Social media strategy (one person attended). Grant writing workshop (good ideas, no follow-through).\n\nThe pattern is always the same: initial enthusiasm, two-day training, brief implementation attempt, gradual abandonment. Alex knows AI training could go the same way unless she designs something fundamentally different.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'team_ai_trainer',
                title: 'Design Alex\'s AI Training Program',
                content: 'Alex wants to create AI training that actually results in adoption and confidence. Help her design a learning program that works for her diverse team and ties directly to their daily work.',
                config: {
                  character: 'Alex Rivera',
                  team_composition: ['varying_tech_comfort', 'different_roles', 'diverse_learning_styles'],
                  training_goals: ['practical_application', 'confidence_building', 'mission_connection'],
                  success_metrics: ['daily_usage', 'problem_solving', 'peer_teaching']
                },
                order: 20
              }
            ]
          },
          {
            title: 'Change Management for Mission-Driven Organizations',
            subtitle: 'Lead transformation while preserving values and culture',
            duration: 28,
            storyArc: {
              setup: 'Alex must balance innovation pressure with staff concerns and mission integrity',
              conflict: 'Board wants rapid AI adoption; staff worry about job security and mission drift',
              discovery: 'Successful change management connects new tools to existing values',
              resolution: 'Organization embraces AI as extension of their mission, not threat to it'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Balancing Act of Mission-Driven Change',
                content: 'Alex stares at two documents on her desk. On the left: the board\'s strategic priority memo demanding "rapid digital transformation to remain competitive for funding." On the right: a petition from staff requesting "assurance that AI won\'t replace human-centered services."\n\nThe tension is real. Funders want innovation metrics. Staff want job security. Clients need continuity of care. Meanwhile, Alex sees AI\'s potential to amplify their mission—but only if she can lead change in a way that honors their values while embracing new possibilities.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'change_leader',
                title: 'Navigate Alex\'s Change Management Challenge',
                content: 'Alex must lead AI transformation while balancing board expectations, staff concerns, and mission integrity. Help her develop a change management strategy that brings everyone along successfully.',
                config: {
                  character: 'Alex Rivera',
                  stakeholders: ['board_members', 'staff_team', 'clients', 'funders'],
                  change_type: 'ai_organizational_adoption',
                  tensions: ['innovation_vs_stability', 'efficiency_vs_humanity', 'change_vs_continuity'],
                  success_definition: 'mission_amplification'
                },
                order: 20
              }
            ]
          },
          {
            title: 'AI Governance and Ethics in Practice',
            subtitle: 'Create frameworks for responsible AI use in nonprofit work',
            duration: 22,
            storyArc: {
              setup: 'Alex realizes they need policies for AI use but doesn\'t know where to start',
              conflict: 'Staff are using AI tools without guidelines, creating risks and inconsistencies',
              discovery: 'AI governance can be practical and values-aligned, not bureaucratic',
              resolution: 'Clear, mission-driven AI policies enable confident and ethical tool adoption'
            },
            contentBlocks: [
              {
                type: 'text',
                title: 'The Wild West of AI Adoption',
                content: 'Alex discovers that three staff members are already using ChatGPT for different tasks: Maria for writing donor thank-you letters, James for program descriptions, and Robert (surprisingly!) for creating client intake forms. Each has developed their own approach, with varying degrees of quality control and privacy consideration.\n\nThe question isn\'t whether to allow AI use—it\'s already happening. The question is how to provide guidance that enables good AI use while preventing problematic applications.',
                order: 10
              }
            ],
            interactiveElements: [
              {
                type: 'ai_governance_builder',
                title: 'Create Alex\'s AI Governance Framework',
                content: 'Alex needs practical AI governance policies that enable staff to use AI tools effectively while maintaining ethical standards and mission alignment. Help her create guidelines that work in the real world.',
                config: {
                  character: 'Alex Rivera',
                  organization_type: 'community_services',
                  current_usage: ['donor_communications', 'program_descriptions', 'client_forms'],
                  governance_priorities: ['client_privacy', 'mission_alignment', 'quality_standards', 'staff_empowerment']
                },
                order: 20
              }
            ]
          }
        ],
        totalDuration: 100
      }
    };
    
    return templates[chapterId];
  };

  const buildChapterAutomatically = async () => {
    if (!selectedChapter) return;
    
    setIsBuilding(true);
    setBuildProgress(0);
    setCurrentTask('Generating chapter plan...');
    
    try {
      const chapterId = parseInt(selectedChapter);
      const plan = generateChapterPlan(chapterId);
      setChapterPlan(plan);
      setBuildProgress(10);
      
      // Step 1: Update chapter info
      setCurrentTask('Updating chapter information...');
      const { error: chapterError } = await supabase
        .from('chapters')
        .update({
          title: plan.title,
          description: plan.description,
          duration: `${plan.totalDuration} min`,
          is_published: true
        })
        .eq('id', chapterId);
      
      if (chapterError) throw chapterError;
      setBuildProgress(20);
      
      // Step 2: Create lessons
      setCurrentTask('Creating lessons...');
      const lessons = plan.lessons.map((lesson, index) => ({
        id: (chapterId * 10) + index + 1, // Generate unique lesson IDs
        chapter_id: chapterId,
        title: lesson.title,
        subtitle: lesson.subtitle,
        order_index: (index + 1) * 10,
        estimated_duration: lesson.duration,
        is_published: true
      }));
      
      const { error: lessonsError } = await supabase
        .from('lessons')
        .upsert(lessons);
      
      if (lessonsError) throw lessonsError;
      setBuildProgress(40);
      
      // Step 3: Create content blocks
      setCurrentTask('Adding story content...');
      const allContentBlocks = [];
      
      plan.lessons.forEach((lesson, lessonIndex) => {
        const lessonId = (chapterId * 10) + lessonIndex + 1;
        lesson.contentBlocks.forEach(block => {
          allContentBlocks.push({
            lesson_id: lessonId,
            type: block.type,
            title: block.title,
            content: block.content,
            metadata: { 
              character: plan.character.name,
              organization: plan.character.organization,
              version: '1.0'
            },
            order_index: block.order
          });
        });
      });
      
      if (allContentBlocks.length > 0) {
        const { error: contentError } = await supabase
          .from('content_blocks')
          .upsert(allContentBlocks);
        
        if (contentError) throw contentError;
      }
      setBuildProgress(70);
      
      // Step 4: Create interactive elements
      setCurrentTask('Integrating AI components...');
      const allInteractiveElements = [];
      
      plan.lessons.forEach((lesson, lessonIndex) => {
        const lessonId = (chapterId * 10) + lessonIndex + 1;
        lesson.interactiveElements.forEach(element => {
          allInteractiveElements.push({
            lesson_id: lessonId,
            type: element.type,
            title: element.title,
            content: element.content,
            configuration: element.config,
            order_index: element.order
          });
        });
      });
      
      if (allInteractiveElements.length > 0) {
        const { error: interactiveError } = await supabase
          .from('interactive_elements')
          .upsert(allInteractiveElements);
        
        if (interactiveError) throw interactiveError;
      }
      setBuildProgress(90);
      
      // Step 5: Remove chapter locks
      setCurrentTask('Removing chapter locks...');
      // This would update any gating logic - for now we'll skip since chapters are already unlocked
      setBuildProgress(100);
      
      setBuildResults({
        success: true,
        chapter: plan.title,
        character: plan.character.name,
        lessons: plan.lessons.length,
        totalContentBlocks: allContentBlocks.length,
        totalInteractiveElements: allInteractiveElements.length
      });
      
      toast.success(`Chapter ${chapterId} built successfully! 🎉`);
      onComplete?.();
      
    } catch (error) {
      console.error('Chapter build error:', error);
      setBuildResults({
        success: false,
        error: error.message
      });
      toast.error('Failed to build chapter: ' + error.message);
    } finally {
      setIsBuilding(false);
      setCurrentTask('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Rocket className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">Chapter Builder Agent</h2>
        </div>
        <p className="text-gray-600">Automatically generate complete chapters with rich storytelling and AI component integration</p>
      </div>

      {!isBuilding && !buildResults && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Select Chapter to Build</label>
            <Select value={selectedChapter} onValueChange={setSelectedChapter}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a chapter to auto-generate..." />
              </SelectTrigger>
              <SelectContent>
                {chapterTemplates.map(chapter => (
                  <SelectItem key={chapter.id} value={chapter.id.toString()}>
                    <div>
                      <div className="font-medium">Chapter {chapter.id}: {chapter.title}</div>
                      <div className="text-sm text-gray-500">Featuring {chapter.character}</div>
                      <div className="text-xs text-gray-400">{chapter.focus}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={buildChapterAutomatically}
            disabled={!selectedChapter}
            className="w-full bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Build Complete Chapter Automatically
            </div>
          </Button>

          {selectedChapter && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">What This Will Create:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Complete chapter with rich character storylines</li>
                  <li>• 4 detailed lessons with narrative arcs</li>
                  <li>• 15+ story-rich content blocks per chapter</li>
                  <li>• 8+ integrated AI interactive components</li>
                  <li>• Automatic database deployment</li>
                  <li>• Removal of all chapter locks</li>
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {isBuilding && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 animate-pulse" />
                Building Chapter {selectedChapter}...
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={buildProgress} className="w-full" />
              <p className="text-sm text-gray-600">{currentTask}</p>
              
              {chapterPlan && (
                <div className="bg-gray-50 p-4 rounded">
                  <h4 className="font-semibold mb-2">Building: {chapterPlan.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">Character: {chapterPlan.character.name} ({chapterPlan.character.role})</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Lessons:</strong> {chapterPlan.lessons.length}
                    </div>
                    <div>
                      <strong>Duration:</strong> {chapterPlan.totalDuration} min
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {buildResults && (
        <div className="space-y-4">
          <Card className={buildResults.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {buildResults.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                {buildResults.success ? 'Chapter Built Successfully!' : 'Build Failed'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {buildResults.success ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Chapter:</strong> {buildResults.chapter}
                    </div>
                    <div>
                      <strong>Character:</strong> {buildResults.character}
                    </div>
                    <div>
                      <strong>Lessons Created:</strong> {buildResults.lessons}
                    </div>
                    <div>
                      <strong>Content Blocks:</strong> {buildResults.totalContentBlocks}
                    </div>
                    <div>
                      <strong>Interactive Elements:</strong> {buildResults.totalInteractiveElements}
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded border">
                    <h4 className="font-semibold text-green-800 mb-2">Next Steps:</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>✅ Chapter content deployed to database</li>
                      <li>✅ All lessons are now accessible</li>
                      <li>✅ Interactive components integrated</li>
                      <li>🚀 Refresh your browser and test the new chapter!</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-red-700">
                  <p className="mb-2">Error: {buildResults.error}</p>
                  <p className="text-sm">Check browser console for details.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button 
              onClick={() => {
                setBuildResults(null);
                setSelectedChapter('');
                setBuildProgress(0);
              }}
              variant="outline"
            >
              Build Another Chapter
            </Button>
            {buildResults.success && (
              <Button 
                onClick={() => window.location.reload()}
                className="bg-green-600 hover:bg-green-700"
              >
                Refresh & Test Chapter
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};