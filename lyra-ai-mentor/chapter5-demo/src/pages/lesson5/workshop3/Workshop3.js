import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../../components/character/RachelCharacter';

const WorkshopContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const WorkshopHeader = styled.section`
  background: linear-gradient(135deg, #F77F00 0%, #FCBF49 100%);
  color: white;
  padding: ${({ theme }) => theme.spacing['3xl']} 0;
  text-align: center;
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const WorkshopTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const WorkshopSubtitle = styled(motion.p)`
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

const WorkshopSection = styled(motion.div)`
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
    color: ${({ theme }) => theme.colors.secondary};
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

const Workshop3 = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
            Content Creation Studio
          </WorkshopTitle>
          <WorkshopSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Creative laboratory for producing compelling content across different formats and platforms
          </WorkshopSubtitle>
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
          <RachelCharacter showInsight={true} topic="content" />
          
          <WorkshopSection variants={itemVariants}>
            <ComingSoon>
              <h2>Content Creation Studio</h2>
              <p>
                Enter Rachel's creative laboratory where you'll produce compelling content across multiple 
                formats and platforms. This hands-on studio focuses on practical content creation with 
                real-time feedback and optimization strategies.
              </p>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ display: 'inline-block', marginBottom: '2rem' }}
              >
                <Palette size={48} color="#F77F00" />
              </motion.div>
              <p>
                <strong>Coming Soon:</strong> Multi-format content creation tools, platform optimization 
                strategies, creative ideation frameworks, and content repurposing techniques.
              </p>
            </ComingSoon>
          </WorkshopSection>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson5/workshop2" className="secondary">
            <ArrowLeft />
            Previous: Brand Voice
          </NavButton>
          <NavButton to="/lesson5/workshop4">
            Next: Campaign Development Lab
            <ArrowRight />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </WorkshopContainer>
  );
};

export default Workshop3;