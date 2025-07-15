import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle, Play, Pause, Target, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../components/character/RachelCharacter';
import PACEFramework from '../../components/lesson/PACEFramework';
import { RachelService } from '../../services/rachelService';

const LessonContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const LessonHeader = styled.section`
  background: ${({ theme }) => theme.colors.gradient.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="lesson1Pattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="15" cy="15" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="5" cy="5" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23lesson1Pattern)"/></svg>');
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

const LessonTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  }
`;

const LessonSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const LessonMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  background: rgba(255, 255, 255, 0.1);
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ObjectivesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ObjectiveCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MainContent = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.lg};
`;

const ContentCard = styled(motion.div)`
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

const StoryFramework = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const FrameworkCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
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
  border: 1px solid ${({ theme }) => theme.colors.background};
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const RachelInsight = styled(motion.div)`
  background: ${({ theme }) => theme.colors.pace.create};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border-left: 4px solid ${({ theme }) => theme.colors.creative.purple};
  position: relative;
  
  &::before {
    content: '"';
    position: absolute;
    top: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
    color: ${({ theme }) => theme.colors.creative.purple};
    opacity: 0.3;
    font-family: ${({ theme }) => theme.typography.fonts.creative};
  }
`;

const InsightText = styled.p`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  font-style: italic;
  line-height: 1.6;
  padding-left: ${({ theme }) => theme.spacing.lg};
`;

const InsightAuthor = styled.div`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.creative.purple};
  text-align: right;
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

const ProgressBar = styled.div`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  height: 4px;
  background: rgba(230, 57, 70, 0.1);
  z-index: 999;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 0 2px 2px 0;
`;

const Lesson1 = () => {
  const [lessonConfig] = useState(() => {
    const configs = RachelService.getLessonConfigs();
    return configs.find(config => config.id === 'lesson-1');
  });
  const [currentPhase, setCurrentPhase] = useState('preview');
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const storyFramework = RachelService.getStorytellingFramework();

  const handlePhaseClick = (phase) => {
    setCurrentPhase(phase);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <LessonContainer>
      <ProgressBar>
        <ProgressFill
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </ProgressBar>

      <LessonHeader>
        <HeaderContent>
          <LessonTitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {lessonConfig?.title}
          </LessonTitle>
          <LessonSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            {lessonConfig?.description}
          </LessonSubtitle>
          
          <LessonMeta>
            <MetaItem>
              <Clock />
              {lessonConfig?.duration}
            </MetaItem>
            <MetaItem>
              <Target />
              {lessonConfig?.difficulty}
            </MetaItem>
            <MetaItem>
              <Users />
              Interactive Learning
            </MetaItem>
          </LessonMeta>
          
          <ObjectivesGrid>
            {lessonConfig?.objectives.map((objective, index) => (
              <ObjectiveCard
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Target />
                {objective}
              </ObjectiveCard>
            ))}
          </ObjectivesGrid>
        </HeaderContent>
      </LessonHeader>

      <MainContent>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <RachelCharacter showInsight={true} topic="storytelling" />
          
          <ContentCard variants={itemVariants}>
            <SectionTitle>
              <BookOpen />
              Story Structure Framework
            </SectionTitle>
            <p>
              Every compelling story follows a proven structure that guides the audience through 
              an emotional journey. Rachel's storytelling framework breaks down the essential 
              elements that make stories memorable and impactful.
            </p>
            
            <StoryFramework>
              {storyFramework.structure.map((step, index) => (
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
                    {index + 1}. {step.split(' - ')[0]}
                  </FrameworkStep>
                  <FrameworkDescription>
                    {step.split(' - ')[1]}
                  </FrameworkDescription>
                  <FrameworkExample>
                    Example: {
                      index === 0 ? "Did you know that 78% of consumers wish brands would tell more stories?" :
                      index === 1 ? "Small business owner struggling with brand identity in crowded marketplace" :
                      index === 2 ? "Traditional marketing isn't working, budget constraints, need authentic connection" :
                      index === 3 ? "Discover authentic brand voice through storytelling framework" :
                      "Ready to transform your brand story? Let's begin your journey."
                    }
                  </FrameworkExample>
                </FrameworkCard>
              ))}
            </StoryFramework>
          </ContentCard>

          <RachelInsight
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <InsightText>
              {lessonConfig?.rachelInsights[0]}
            </InsightText>
            <InsightAuthor>— Rachel Thompson</InsightAuthor>
          </RachelInsight>

          <ContentCard variants={itemVariants}>
            <SectionTitle>
              <Play />
              Interactive PACE Learning
            </SectionTitle>
            <p>
              Experience Rachel's storytelling methodology through our interactive PACE framework. 
              Click each phase to explore activities, projects, and learning opportunities.
            </p>
            
            {lessonConfig?.pace && (
              <PACEFramework 
                config={lessonConfig.pace} 
                onPhaseClick={handlePhaseClick}
              />
            )}
          </ContentCard>

          <ContentCard variants={itemVariants}>
            <SectionTitle>
              <CheckCircle />
              Practical Applications
            </SectionTitle>
            <p>
              Apply your storytelling skills to real-world scenarios. These practical applications 
              help you understand how story structure works across different contexts and platforms.
            </p>
            
            <StoryFramework>
              {lessonConfig?.practicalApplications.map((application, index) => (
                <FrameworkCard
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <FrameworkStep>{application}</FrameworkStep>
                  <FrameworkDescription>
                    {
                      application.includes('About page') ? "Transform your about page from boring bio to compelling brand story" :
                      application.includes('Product launch') ? "Create anticipation and excitement around new product releases" :
                      application.includes('Customer success') ? "Turn customer wins into powerful social proof narratives" :
                      "Develop engaging content that builds audience connection and drives action"
                    }
                  </FrameworkDescription>
                </FrameworkCard>
              ))}
            </StoryFramework>
          </ContentCard>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/" className="secondary">
            <ArrowLeft />
            Back to Chapter
          </NavButton>
          <NavButton to="/lesson2">
            Next: Brand Voice Development
            <ArrowRight />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </LessonContainer>
  );
};

export default Lesson1;