import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../../components/character/RachelCharacter';

const WorkshopContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const WorkshopHeader = styled.section`
  background: linear-gradient(135deg, #20C997 0%, #0D6EFD 100%);
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
    color: ${({ theme }) => theme.colors.creative.teal};
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

const Workshop4 = () => {
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
            Campaign Development Lab
          </WorkshopTitle>
          <WorkshopSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            End-to-end campaign creation using storytelling principles for maximum impact and engagement
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
          <RachelCharacter showInsight={true} topic="creative" />
          
          <WorkshopSection variants={itemVariants}>
            <ComingSoon>
              <h2>Campaign Development Lab</h2>
              <p>
                The capstone workshop where you'll develop complete marketing campaigns using all of 
                Rachel's storytelling frameworks. This collaborative lab focuses on strategy development, 
                cross-channel planning, and campaign execution for real business results.
              </p>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'inline-block', marginBottom: '2rem' }}
              >
                <Target size={48} color="#20C997" />
              </motion.div>
              <p>
                <strong>Coming Soon:</strong> Campaign strategy frameworks, cross-channel narrative 
                planning, success metrics definition, and team collaboration tools.
              </p>
            </ComingSoon>
          </WorkshopSection>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson5/workshop3" className="secondary">
            <ArrowLeft />
            Previous: Content Studio
          </NavButton>
          <NavButton to="/">
            Complete All Workshops
            <Award />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </WorkshopContainer>
  );
};

export default Workshop4;