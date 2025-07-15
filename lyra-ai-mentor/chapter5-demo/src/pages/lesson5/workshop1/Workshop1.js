import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Award, Play, Pause, CheckCircle, Clock, Target, Book, Edit3, Lightbulb, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../../components/character/RachelCharacter';
import PACEFramework from '../../../components/lesson/PACEFramework';

const WorkshopContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const WorkshopHeader = styled.section`
  background: linear-gradient(135deg, #E63946 0%, #F77F00 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="workshop1Pattern" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><circle cx="12.5" cy="12.5" r="1.5" fill="rgba(255,255,255,0.1)"/><polygon points="5,5 10,5 7.5,10" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23workshop1Pattern)"/></svg>');
    opacity: 0.3;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const WorkshopTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  }
`;

const WorkshopSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ProgressIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ProgressStep = styled(motion.div)`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: ${({ active, completed, theme }) => 
    completed ? theme.colors.creative.green :
    active ? theme.colors.accent :
    'rgba(255, 255, 255, 0.3)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ active, completed }) => 
    (active || completed) ? 'white' : 'rgba(255, 255, 255, 0.7)'
  };
  cursor: pointer;
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    transform: scale(1.1);
  }
`;

const MainContent = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.lg};
`;

const WorkshopSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 28px;
    height: 28px;
  }
`;

const StoryFrameworkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const FrameworkCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary} 0%, 
      ${({ theme }) => theme.colors.secondary} 100%
    );
  }
`;

const FrameworkStep = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FrameworkDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FrameworkExample = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.accent};
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const InteractiveExercise = styled(motion.div)`
  background: ${({ theme }) => theme.colors.pace.create};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border: 2px solid ${({ theme }) => theme.colors.creative.purple};
`;

const ExerciseTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.creative.purple};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ExerciseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

const ExerciseCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.creative.purple};
`;

const ExerciseInput = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.creative.purple};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: ${({ theme }) => theme.typography.fonts.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
  resize: vertical;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(230, 57, 70, 0.1);
  }
`;

const ExerciseButton = styled.button`
  background: ${({ theme }) => theme.colors.creative.purple};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ProgressControls = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const ControlButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.primary : theme.colors.text.secondary
  };
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    background: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.secondary : theme.colors.text.primary
    };
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing['2xl']};
  gap: ${({ theme }) => theme.spacing.md};
`;

const NavButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  &.secondary {
    background: ${({ theme }) => theme.colors.text.secondary};
    
    &:hover {
      background: ${({ theme }) => theme.colors.text.primary};
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Workshop1 = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [exerciseInputs, setExerciseInputs] = useState({
    hook: '',
    context: '',
    conflict: '',
    resolution: '',
    action: ''
  });

  const workshopSteps = [
    { id: 1, title: 'Introduction', icon: Book },
    { id: 2, title: 'Framework', icon: Target },
    { id: 3, title: 'Practice', icon: Edit3 },
    { id: 4, title: 'Review', icon: CheckCircle }
  ];

  const storyElements = [
    {
      title: "Hook",
      description: "Capture attention immediately with a compelling opening",
      icon: Lightbulb,
      prompt: "Create an attention-grabbing opening for your brand story:",
      placeholder: "e.g., Did you know that 73% of millennials are willing to pay more for sustainable products?"
    },
    {
      title: "Context", 
      description: "Set the scene and establish the stakes",
      icon: Users,
      prompt: "Establish the setting and introduce your main character:",
      placeholder: "e.g., Meet Sarah, a busy working mom who cares about her family's health but struggles with meal planning..."
    },
    {
      title: "Conflict",
      description: "Introduce challenges and tension that need resolution",
      icon: Target,
      prompt: "What challenge or problem creates tension in your story:",
      placeholder: "e.g., Traditional meal planning apps are too complex and time-consuming for busy parents..."
    },
    {
      title: "Resolution",
      description: "Provide solutions and positive outcomes",
      icon: CheckCircle,
      prompt: "How is the conflict resolved? What's the solution:",
      placeholder: "e.g., Our AI-powered meal planner creates personalized, healthy meal plans in under 2 minutes..."
    },
    {
      title: "Call to Action",
      description: "Guide readers toward the next step",
      icon: ArrowRight,
      prompt: "What action do you want your audience to take:",
      placeholder: "e.g., Join thousands of parents who've simplified their meal planning. Try it free for 14 days..."
    }
  ];

  const paceConfig = {
    preview: {
      title: "Story Structure Overview",
      description: "Explore the five essential elements of compelling brand storytelling",
      objectives: [
        "Understand each story element's purpose",
        "See how elements work together",
        "Identify story patterns in successful brands"
      ],
      estimatedTime: "15 minutes"
    },
    analyze: {
      title: "Deconstruct Great Stories", 
      description: "Analyze successful brand stories to understand effectiveness",
      activities: [
        {
          id: "analyze-1",
          title: "Brand Story Analysis",
          type: "individual",
          duration: "20 minutes",
          description: "Break down 3 successful brand stories using our framework",
          materials: ["Story examples", "Analysis worksheet"],
          steps: [
            "Choose 3 brand stories from different industries",
            "Identify the hook, context, conflict, resolution, and CTA",
            "Note emotional engagement techniques",
            "Assess story effectiveness"
          ],
          outcomes: ["Completed analysis worksheets", "Framework understanding"]
        }
      ],
      reflectionQuestions: [
        "What makes these stories memorable?",
        "How do they create emotional connection?",
        "Which story techniques work best?"
      ]
    },
    create: {
      title: "Build Your Story",
      description: "Create your own compelling brand story using the framework",
      projects: [
        {
          id: "story-project",
          title: "Brand Story Development",
          type: "story",
          description: "Develop a complete brand story using the five-element framework",
          objectives: [
            "Create compelling hook",
            "Establish clear context",
            "Define meaningful conflict",
            "Provide satisfying resolution",
            "Include strong call to action"
          ],
          targetAudience: "Your ideal customer",
          status: "planning",
          timeline: "30 minutes",
          deliverables: ["Complete brand story", "Story effectiveness assessment"]
        }
      ],
      templates: ["Story outline", "Character profile", "Conflict mapping"]
    },
    evaluate: {
      title: "Story Assessment",
      description: "Evaluate story effectiveness and refine for maximum impact",
      criteria: [
        "Hook captures attention immediately",
        "Context establishes clear setting",
        "Conflict creates compelling tension",
        "Resolution provides satisfying outcome",
        "Call to action guides next steps"
      ],
      feedbackMethods: ["Self-assessment", "Peer review", "Rachel's feedback"]
    }
  };

  const nextStep = () => {
    if (currentStep < workshopSteps.length) {
      setCompletedSteps([...completedSteps, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateExerciseInput = (element, value) => {
    setExerciseInputs(prev => ({ ...prev, [element]: value }));
  };

  const generateFeedback = (element) => {
    const feedbacks = {
      hook: "Great start! Your hook has strong attention-grabbing potential. Consider adding a surprising statistic or question to increase engagement.",
      context: "Nice context setting! You've established the scene well. Make sure your audience can clearly identify with the main character.",
      conflict: "Excellent conflict identification! This creates good tension. Consider emphasizing the emotional impact of this problem.",
      resolution: "Strong resolution! Your solution clearly addresses the conflict. Highlight the benefits and transformation.",
      action: "Compelling call to action! It's clear and actionable. Consider adding urgency or limited-time elements if appropriate."
    };
    return feedbacks[element] || "Good work! Keep refining your story element for maximum impact.";
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WorkshopSection variants={itemVariants}>
            <SectionTitle>
              <Book />
              Workshop Introduction
            </SectionTitle>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Welcome to the Story Structure Mastery workshop! In this hands-on session, you'll learn 
              Rachel's proven five-element framework for creating compelling brand stories that capture 
              attention, build connection, and drive action.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#E63946', marginBottom: '0.5rem' }}>Duration</h4>
                <p style={{ margin: 0 }}>60 minutes of interactive learning</p>
              </div>
              <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#E63946', marginBottom: '0.5rem' }}>Format</h4>
                <p style={{ margin: 0 }}>Individual exercises + group discussion</p>
              </div>
              <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '8px' }}>
                <h4 style={{ color: '#E63946', marginBottom: '0.5rem' }}>Outcome</h4>
                <p style={{ margin: 0 }}>Complete brand story framework</p>
              </div>
            </div>
          </WorkshopSection>
        );

      case 2:
        return (
          <WorkshopSection variants={itemVariants}>
            <SectionTitle>
              <Target />
              Story Framework Deep Dive
            </SectionTitle>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Rachel's five-element story framework transforms complex narratives into engaging, 
              memorable experiences. Each element serves a specific purpose in guiding your audience 
              through an emotional journey.
            </p>
            <StoryFrameworkGrid>
              {storyElements.map((element, index) => (
                <FrameworkCard
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FrameworkStep>
                    <element.icon />
                    {index + 1}. {element.title}
                  </FrameworkStep>
                  <FrameworkDescription>
                    {element.description}
                  </FrameworkDescription>
                  <FrameworkExample>
                    Example: {element.placeholder}
                  </FrameworkExample>
                </FrameworkCard>
              ))}
            </StoryFrameworkGrid>
          </WorkshopSection>
        );

      case 3:
        return (
          <>
            <WorkshopSection variants={itemVariants}>
              <SectionTitle>
                <Edit3 />
                Hands-On Story Building
              </SectionTitle>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                Now it's time to create your own brand story! Use the prompts below to develop each 
                element of your narrative. Rachel will provide feedback as you build your story.
              </p>
            </WorkshopSection>

            <InteractiveExercise variants={itemVariants}>
              <ExerciseTitle>
                <Edit3 />
                Build Your Brand Story
              </ExerciseTitle>
              <ExerciseGrid>
                {storyElements.map((element, index) => (
                  <ExerciseCard key={index}>
                    <h4 style={{ color: '#6F42C1', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <element.icon size={20} />
                      {element.title}
                    </h4>
                    <p style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>{element.prompt}</p>
                    <ExerciseInput
                      placeholder={element.placeholder}
                      value={exerciseInputs[element.title.toLowerCase()] || ''}
                      onChange={(e) => updateExerciseInput(element.title.toLowerCase(), e.target.value)}
                    />
                    <ExerciseButton onClick={() => {
                      if (exerciseInputs[element.title.toLowerCase()]) {
                        alert(`Rachel's Feedback: ${generateFeedback(element.title.toLowerCase())}`);
                      }
                    }}>
                      Get Rachel's Feedback
                    </ExerciseButton>
                  </ExerciseCard>
                ))}
              </ExerciseGrid>
            </InteractiveExercise>
          </>
        );

      case 4:
        return (
          <WorkshopSection variants={itemVariants}>
            <SectionTitle>
              <CheckCircle />
              Story Review & Assessment
            </SectionTitle>
            <p style={{ fontSize: '1.125rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              Congratulations! You've completed your brand story using Rachel's framework. 
              Let's review your work and assess its effectiveness using our evaluation criteria.
            </p>
            
            <div style={{ background: '#E8F5E8', padding: '2rem', borderRadius: '12px', border: '2px solid #198754' }}>
              <h3 style={{ color: '#198754', marginBottom: '1rem' }}>Your Story Assessment</h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {Object.entries(exerciseInputs).map(([key, value]) => (
                  value && (
                    <div key={key} style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                      <strong style={{ textTransform: 'capitalize', color: '#198754' }}>{key}:</strong>
                      <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>{value}</p>
                    </div>
                  )
                ))}
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(25, 135, 84, 0.1)', borderRadius: '8px' }}>
                <strong style={{ color: '#198754' }}>Rachel's Overall Assessment:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                  Excellent work! Your story demonstrates strong understanding of the framework. 
                  Focus on strengthening emotional connections and ensuring each element flows 
                  naturally into the next. Your narrative has great potential for audience engagement.
                </p>
              </div>
            </div>
            
            <PACEFramework config={paceConfig} />
          </WorkshopSection>
        );

      default:
        return null;
    }
  };

  return (
    <WorkshopContainer>
      <WorkshopHeader>
        <HeaderContent>
          <WorkshopTitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Story Structure Mastery Workshop
          </WorkshopTitle>
          <WorkshopSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Master advanced storytelling frameworks and narrative techniques that captivate audiences across all platforms
          </WorkshopSubtitle>
          
          <ProgressIndicator>
            {workshopSteps.map((step) => (
              <ProgressStep
                key={step.id}
                active={currentStep === step.id}
                completed={completedSteps.includes(step.id)}
                onClick={() => setCurrentStep(step.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {completedSteps.includes(step.id) ? <CheckCircle size={20} /> : step.id}
              </ProgressStep>
            ))}
          </ProgressIndicator>
        </HeaderContent>
      </WorkshopHeader>

      <MainContent>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <RachelCharacter showInsight={true} topic="storytelling" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {renderCurrentStep()}
            </motion.div>
          </AnimatePresence>

          <ProgressControls>
            <ControlButton 
              onClick={prevStep} 
              disabled={currentStep === 1}
              variant="secondary"
            >
              <ArrowLeft />
              Previous
            </ControlButton>
            
            <ControlButton onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause /> : <Play />}
              {isPlaying ? 'Pause' : 'Continue'}
            </ControlButton>
            
            <ControlButton 
              onClick={nextStep} 
              disabled={currentStep === workshopSteps.length}
              variant="primary"
            >
              Next
              <ArrowRight />
            </ControlButton>
          </ProgressControls>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson5" className="secondary">
            <ArrowLeft />
            Back to Workshops
          </NavButton>
          <NavButton to="/lesson5/workshop2">
            Next Workshop: Brand Voice
            <ArrowRight />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </WorkshopContainer>
  );
};

export default Workshop1;