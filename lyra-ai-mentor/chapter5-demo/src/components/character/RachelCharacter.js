import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Pen, Heart, MessageCircle, Lightbulb, Target } from 'lucide-react';
import { RachelService } from '../../services/rachelService';

const CharacterContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.gradient.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  color: white;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="creativeDots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23creativeDots)"/></svg>');
    opacity: 0.3;
  }
`;

const CharacterAvatar = styled(motion.div)`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, #FCBF49 0%, #F77F00 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 4px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: linear-gradient(45deg, rgba(255,255,255,0.3), transparent);
    border-radius: ${({ theme }) => theme.borderRadius.full};
    z-index: -1;
  }
`;

const CharacterName = styled(motion.h2)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.sm};
  text-align: center;
  position: relative;
  z-index: 1;
`;

const CharacterRole = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  opacity: 0.9;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const InsightBubble = styled(motion.div)`
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid rgba(255, 255, 255, 0.15);
  }
`;

const ExpertiseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  width: 100%;
  position: relative;
  z-index: 1;
`;

const ExpertiseCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 24px;
    height: 24px;
    opacity: 0.8;
  }
`;

const CreativeIcons = [Sparkles, Pen, Heart, MessageCircle, Lightbulb, Target];

const RachelCharacter = ({ showInsight = false, topic = "storytelling" }) => {
  const [rachel] = useState(RachelService.getRachelPersonality());
  const [currentInsight, setCurrentInsight] = useState("");
  const [showExpertise, setShowExpertise] = useState(false);

  useEffect(() => {
    if (showInsight) {
      setCurrentInsight(RachelService.getRachelInsight(topic));
    }
  }, [showInsight, topic]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const avatarVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <CharacterContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <CharacterAvatar
        variants={avatarVariants}
        whileHover={{ scale: 1.05 }}
        onClick={() => setShowExpertise(!showExpertise)}
      >
        RT
      </CharacterAvatar>
      
      <CharacterName variants={itemVariants}>
        {rachel.name}
      </CharacterName>
      
      <CharacterRole variants={itemVariants}>
        {rachel.role}
      </CharacterRole>

      <AnimatePresence>
        {showInsight && currentInsight && (
          <InsightBubble
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              "{currentInsight}"
            </motion.div>
          </InsightBubble>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showExpertise && (
          <ExpertiseGrid>
            {rachel.expertise.map((skill, index) => (
              <ExpertiseCard
                key={skill}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <IconWrapper>
                  {React.createElement(CreativeIcons[index] || Sparkles)}
                </IconWrapper>
                <div>{skill}</div>
              </ExpertiseCard>
            ))}
          </ExpertiseGrid>
        )}
      </AnimatePresence>
    </CharacterContainer>
  );
};

export default RachelCharacter;