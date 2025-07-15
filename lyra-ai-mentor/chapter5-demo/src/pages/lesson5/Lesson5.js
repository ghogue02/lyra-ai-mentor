import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, Play, Clock, Users, Star, ChevronRight, Award, Target, Lightbulb, Palette } from 'lucide-react';
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="workshopPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/><rect x="0" y="0" width="2" height="2" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23workshopPattern)"/></svg>');
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
  font-size: ${({ theme }) => theme.typography.sizes['5xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(45deg, #FFFFFF, #FCBF49);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  }
`;

const LessonSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
`;

const WorkshopStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.md};
  opacity: 0.9;
`;

const MainContent = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing['4xl']} ${({ theme }) => theme.spacing.lg};
`;

const WorkshopsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const WorkshopCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.background};
  transition: ${({ theme }) => theme.animations.transition};
  position: relative;
  overflow: hidden;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.xl};
    transform: translateY(-4px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: ${({ workshopId }) => {
      switch (workshopId) {
        case 1: return 'linear-gradient(90deg, #E63946 0%, #F77F00 100%)';
        case 2: return 'linear-gradient(90deg, #6F42C1 0%, #20C997 100%)';
        case 3: return 'linear-gradient(90deg, #F77F00 0%, #FCBF49 100%)';
        case 4: return 'linear-gradient(90deg, #20C997 0%, #0D6EFD 100%)';
        default: return 'linear-gradient(90deg, #E63946 0%, #F77F00 100%)';
      }
    }};
  }
`;

const WorkshopHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const WorkshopIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ workshopId, theme }) => {
    switch (workshopId) {
      case 1: return theme.colors.pace.preview;
      case 2: return theme.colors.pace.analyze;
      case 3: return theme.colors.pace.create;
      case 4: return theme.colors.pace.evaluate;
      default: return theme.colors.background;
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ workshopId, theme }) => {
    switch (workshopId) {
      case 1: return theme.colors.creative.blue;
      case 2: return theme.colors.secondary;
      case 3: return theme.colors.creative.purple;
      case 4: return theme.colors.creative.green;
      default: return theme.colors.primary;
    }
  }};
  
  svg {
    width: 32px;
    height: 32px;
  }
`;

const WorkshopTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const WorkshopDifficulty = styled.span`
  background: ${({ level, theme }) => {
    switch (level) {
      case 'Beginner': return theme.colors.creative.green;
      case 'Intermediate': return theme.colors.secondary;
      case 'Advanced': return theme.colors.primary;
      default: return theme.colors.text.secondary;
    }
  }};
  color: white;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
`;

const WorkshopDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
`;

const WorkshopMeta = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const WorkshopFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.xs} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.creative.green};
  }
`;

const WorkshopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: ${({ theme }) => theme.animations.transition};
  width: 100%;
  justify-content: center;
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const IntroSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 32px;
    height: 32px;
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

const Lesson5 = () => {
  const workshops = [
    {
      id: 1,
      title: "Story Structure Mastery",
      description: "Deep dive into advanced storytelling frameworks and narrative techniques that captivate audiences across all platforms.",
      duration: "60 minutes",
      difficulty: "Intermediate",
      participants: "Individual + Group",
      icon: Award,
      features: [
        "Advanced story frameworks",
        "Narrative tension techniques",
        "Character development for brands",
        "Emotional arc construction",
        "Interactive story builder tool"
      ],
      link: "/lesson5/workshop1"
    },
    {
      id: 2,
      title: "Brand Voice Workshop",
      description: "Hands-on development of authentic brand personalities with voice guidelines and tone documentation.",
      duration: "75 minutes",
      difficulty: "Beginner",
      participants: "Collaborative",
      icon: Users,
      features: [
        "Voice personality assessment",
        "Tone variation exercises",
        "Brand voice guidelines creation",
        "Consistency framework",
        "Voice testing scenarios"
      ],
      link: "/lesson5/workshop2"
    },
    {
      id: 3,
      title: "Content Creation Studio",
      description: "Creative laboratory for producing compelling content across different formats and platforms.",
      duration: "90 minutes",
      difficulty: "Advanced",
      participants: "Individual",
      icon: Palette,
      features: [
        "Multi-format content creation",
        "Platform-specific optimization",
        "Creative ideation frameworks",
        "Content repurposing strategies",
        "Quality assessment tools"
      ],
      link: "/lesson5/workshop3"
    },
    {
      id: 4,
      title: "Campaign Development Lab",
      description: "End-to-end campaign creation using storytelling principles for maximum impact and engagement.",
      duration: "120 minutes",
      difficulty: "Advanced",
      participants: "Team-based",
      icon: Target,
      features: [
        "Campaign strategy development",
        "Cross-channel narrative planning",
        "Success metrics definition",
        "Creative brief templates",
        "Campaign timeline tools"
      ],
      link: "/lesson5/workshop4"
    }
  ];

  const workshopStats = [
    { number: "4", label: "Interactive Workshops" },
    { number: "5+", label: "Hours of Content" },
    { number: "15+", label: "Creative Exercises" },
    { number: "∞", label: "Practice Opportunities" }
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
            Creative Communication Workshops
          </LessonTitle>
          <LessonSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Hands-on workshops for mastering advanced storytelling techniques and creative communication strategies
          </LessonSubtitle>
          
          <WorkshopStats>
            {workshopStats.map((stat, index) => (
              <StatCard
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </WorkshopStats>
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
          <RachelCharacter showInsight={true} topic="workshops" />
          
          <IntroSection variants={itemVariants}>
            <SectionTitle>
              <Briefcase />
              Master Creative Communication
            </SectionTitle>
            <p style={{ fontSize: '1.125rem', color: '#6C757D', lineHeight: 1.6 }}>
              These intensive workshops combine Rachel's expertise with hands-on practice to help you 
              master the art of creative communication. Each workshop builds on previous learning while 
              introducing advanced techniques and real-world applications.
            </p>
          </IntroSection>
          
          <WorkshopsGrid>
            {workshops.map((workshop, index) => (
              <WorkshopCard
                key={workshop.id}
                workshopId={workshop.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <WorkshopHeader>
                  <WorkshopIcon workshopId={workshop.id}>
                    <workshop.icon />
                  </WorkshopIcon>
                  <div>
                    <WorkshopTitle>{workshop.title}</WorkshopTitle>
                    <WorkshopDifficulty level={workshop.difficulty}>
                      {workshop.difficulty}
                    </WorkshopDifficulty>
                  </div>
                </WorkshopHeader>
                
                <WorkshopDescription>
                  {workshop.description}
                </WorkshopDescription>
                
                <WorkshopMeta>
                  <MetaItem>
                    <Clock />
                    {workshop.duration}
                  </MetaItem>
                  <MetaItem>
                    <Users />
                    {workshop.participants}
                  </MetaItem>
                </WorkshopMeta>
                
                <WorkshopFeatures>
                  {workshop.features.map((feature, featureIndex) => (
                    <FeatureItem key={featureIndex}>
                      <Star />
                      {feature}
                    </FeatureItem>
                  ))}
                </WorkshopFeatures>
                
                <WorkshopButton to={workshop.link}>
                  <Play />
                  Start Workshop
                  <ChevronRight />
                </WorkshopButton>
              </WorkshopCard>
            ))}
          </WorkshopsGrid>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson4" className="secondary">
            <ArrowLeft />
            Previous: Multi-Platform
          </NavButton>
          <NavButton to="/">
            Complete Chapter
            <Award />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </LessonContainer>
  );
};

export default Lesson5;