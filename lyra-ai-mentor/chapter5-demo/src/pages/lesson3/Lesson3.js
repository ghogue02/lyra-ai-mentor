import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Lightbulb, Target, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../components/character/RachelCharacter';

const LessonContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const LessonHeader = styled.section`
  background: ${({ theme }) => theme.colors.gradient.creative};
  color: white;
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const LessonTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LessonSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
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
  text-align: center;
`;

const ComingSoon = styled.div`
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  text-align: center;
  
  h2 {
    font-family: ${({ theme }) => theme.typography.fonts.creative};
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  p {
    font-size: ${({ theme }) => theme.typography.sizes.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
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

const Lesson3 = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <LessonContainer>
      <LessonHeader>
        <HeaderContent>
          <LessonTitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Creative Content Strategy
          </LessonTitle>
          <LessonSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Build strategic frameworks for consistent, engaging content creation
          </LessonSubtitle>
        </HeaderContent>
      </LessonHeader>

      <MainContent>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <RachelCharacter showInsight={true} topic="content" />
          
          <ContentCard variants={itemVariants}>
            <ComingSoon>
              <h2>Creative Content Strategy</h2>
              <p>
                This comprehensive lesson will cover strategic content planning, editorial calendars, 
                content pillars, and cross-platform content optimization. Rachel will guide you through 
                building a sustainable content strategy that aligns with your brand voice and storytelling goals.
              </p>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{ display: 'inline-block', marginBottom: '2rem' }}
              >
                <Lightbulb size={48} color="#E63946" />
              </motion.div>
              <p>
                <strong>Coming Soon:</strong> Interactive content planning tools, strategy templates, 
                and practical exercises for building your content ecosystem.
              </p>
            </ComingSoon>
          </ContentCard>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson2" className="secondary">
            <ArrowLeft />
            Previous: Brand Voice
          </NavButton>
          <NavButton to="/lesson4">
            Next: Multi-Platform Storytelling
            <ArrowRight />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </LessonContainer>
  );
};

export default Lesson3;