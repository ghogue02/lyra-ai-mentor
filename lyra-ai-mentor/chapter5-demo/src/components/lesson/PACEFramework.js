import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, Palette, CheckCircle, Clock, Target, Users, Lightbulb } from 'lucide-react';

const PACEContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const PACECard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  border-left: 4px solid ${({ phase, theme }) => {
    switch (phase) {
      case 'preview': return theme.colors.creative.blue;
      case 'analyze': return theme.colors.secondary;
      case 'create': return theme.colors.creative.purple;
      case 'evaluate': return theme.colors.creative.green;
      default: return theme.colors.primary;
    }
  }};
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: ${({ theme }) => theme.animations.transition};
  cursor: pointer;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

const PACEHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PACEIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ phase, theme }) => {
    switch (phase) {
      case 'preview': return theme.colors.pace.preview;
      case 'analyze': return theme.colors.pace.analyze;
      case 'create': return theme.colors.pace.create;
      case 'evaluate': return theme.colors.pace.evaluate;
      default: return theme.colors.background;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ phase, theme }) => {
    switch (phase) {
      case 'preview': return theme.colors.creative.blue;
      case 'analyze': return theme.colors.secondary;
      case 'create': return theme.colors.creative.purple;
      case 'evaluate': return theme.colors.creative.green;
      default: return theme.colors.primary;
    }
  }};
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const PACETitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const PACEDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
`;

const PACEContent = styled(motion.div)`
  overflow: hidden;
`;

const ObjectivesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ObjectiveItem = styled(motion.li)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.creative.green};
  }
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.background};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ActivityGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const ActivityCard = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.text.secondary + '20'};
`;

const ActivityTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.sizes.md};
`;

const ActivityMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const PACEFramework = ({ config, onPhaseClick }) => {
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      key: 'preview',
      title: 'Preview',
      icon: Eye,
      data: config.preview
    },
    {
      key: 'analyze',
      title: 'Analyze',
      icon: Search,
      data: config.analyze
    },
    {
      key: 'create',
      title: 'Create',
      icon: Palette,
      data: config.create
    },
    {
      key: 'evaluate',
      title: 'Evaluate',
      icon: CheckCircle,
      data: config.evaluate
    }
  ];

  const handlePhaseClick = (phase) => {
    if (expandedPhase === phase.key) {
      setExpandedPhase(null);
    } else {
      setExpandedPhase(phase.key);
      if (onPhaseClick) {
        onPhaseClick(phase.key);
      }
    }
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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <PACEContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {phases.map((phase) => (
          <PACECard
            key={phase.key}
            phase={phase.key}
            variants={cardVariants}
            onClick={() => handlePhaseClick(phase)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PACEHeader>
              <PACEIcon phase={phase.key}>
                <phase.icon />
              </PACEIcon>
              <div>
                <PACETitle>{phase.title}</PACETitle>
                <PACEDescription>{phase.data.description}</PACEDescription>
              </div>
            </PACEHeader>

            <AnimatePresence>
              {expandedPhase === phase.key && (
                <PACEContent
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {phase.data.objectives && (
                    <ObjectivesList>
                      {phase.data.objectives.map((objective, index) => (
                        <ObjectiveItem
                          key={index}
                          variants={itemVariants}
                        >
                          <Target />
                          {objective}
                        </ObjectiveItem>
                      ))}
                    </ObjectivesList>
                  )}

                  {phase.data.activities && (
                    <ActivityGrid>
                      {phase.data.activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          variants={itemVariants}
                        >
                          <ActivityCard>
                            <ActivityTitle>{activity.title}</ActivityTitle>
                            <ActivityMeta>
                              <span>Type: {activity.type}</span>
                              <span>Duration: {activity.duration}</span>
                            </ActivityMeta>
                            <p>{activity.description}</p>
                          </ActivityCard>
                        </motion.div>
                      ))}
                    </ActivityGrid>
                  )}

                  {phase.data.projects && (
                    <ActivityGrid>
                      {phase.data.projects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          variants={itemVariants}
                        >
                          <ActivityCard>
                            <ActivityTitle>{project.title}</ActivityTitle>
                            <ActivityMeta>
                              <span>Type: {project.type}</span>
                              <span>Timeline: {project.timeline}</span>
                            </ActivityMeta>
                            <p>{project.description}</p>
                          </ActivityCard>
                        </motion.div>
                      ))}
                    </ActivityGrid>
                  )}

                  {phase.data.criteria && (
                    <ObjectivesList>
                      {phase.data.criteria.map((criterion, index) => (
                        <ObjectiveItem
                          key={index}
                          variants={itemVariants}
                        >
                          <CheckCircle />
                          {criterion}
                        </ObjectiveItem>
                      ))}
                    </ObjectivesList>
                  )}

                  <MetaInfo>
                    {phase.data.estimatedTime && (
                      <MetaItem>
                        <Clock />
                        {phase.data.estimatedTime}
                      </MetaItem>
                    )}
                    {phase.data.reflectionQuestions && (
                      <MetaItem>
                        <Lightbulb />
                        {phase.data.reflectionQuestions.length} reflection questions
                      </MetaItem>
                    )}
                    {phase.data.feedbackMethods && (
                      <MetaItem>
                        <Users />
                        {phase.data.feedbackMethods.length} feedback methods
                      </MetaItem>
                    )}
                  </MetaInfo>
                </PACEContent>
              )}
            </AnimatePresence>
          </PACECard>
        ))}
      </motion.div>
    </PACEContainer>
  );
};

export default PACEFramework;