import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Target, Smartphone, Monitor, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../components/character/RachelCharacter';

const LessonContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const LessonHeader = styled.section`
  background: linear-gradient(135deg, #6F42C1 0%, #20C997 100%);
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

const PlatformGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const PlatformCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
  border: 2px solid ${({ theme }) => theme.colors.creative.teal};
  
  svg {
    width: 48px;
    height: 48px;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    color: ${({ theme }) => theme.colors.creative.teal};
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

const Lesson4 = () => {
  const platforms = [
    { name: 'Social Media', icon: Share2, description: 'Instagram, Twitter, LinkedIn' },
    { name: 'Website', icon: Monitor, description: 'Homepage, about, blog' },
    { name: 'Mobile', icon: Smartphone, description: 'Apps, mobile-first content' },
    { name: 'Email', icon: Target, description: 'Newsletters, campaigns' }
  ];

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
            Multi-Platform Storytelling
          </LessonTitle>
          <LessonSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Adapt your narrative across different channels and touchpoints
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
          <RachelCharacter showInsight={true} topic="creative" />
          
          <ContentCard variants={itemVariants}>
            <ComingSoon>
              <h2>Multi-Platform Storytelling</h2>
              <p>
                Learn how to adapt your core brand story across different platforms while maintaining 
                consistency and maximizing engagement. Rachel will show you how to tailor your narrative 
                for various audiences and channel requirements.
              </p>
              
              <PlatformGrid>
                {platforms.map((platform, index) => (
                  <PlatformCard
                    key={index}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <platform.icon />
                    <h4>{platform.name}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#6C757D', margin: 0 }}>
                      {platform.description}
                    </p>
                  </PlatformCard>
                ))}
              </PlatformGrid>
              
              <p>
                <strong>Coming Soon:</strong> Platform-specific storytelling strategies, content adaptation 
                frameworks, and cross-channel narrative consistency tools.
              </p>
            </ComingSoon>
          </ContentCard>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson3" className="secondary">
            <ArrowLeft />
            Previous: Content Strategy
          </NavButton>
          <NavButton to="/lesson5">
            Next: Creative Workshops
            <ArrowRight />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </LessonContainer>
  );
};

export default Lesson4;