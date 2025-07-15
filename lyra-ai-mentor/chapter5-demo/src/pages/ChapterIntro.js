import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, BookOpen, Target, Users, Lightbulb, Award, Clock, Play } from 'lucide-react';
import RachelCharacter from '../components/character/RachelCharacter';
import { RachelService } from '../services/rachelService';

const ChapterContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, #F8F9FA 0%, #E9ECEF 100%);
`;

const HeroSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  text-align: center;
  background: ${({ theme }) => theme.colors.gradient.primary};
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
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="heroPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="0" cy="0" r="1" fill="rgba(255,255,255,0.05)"/><circle cx="40" cy="40" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23heroPattern)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  position: relative;
  z-index: 1;
`;

const ChapterTitle = styled(motion.h1)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['5xl']};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(45deg, #FFFFFF, #FCBF49);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  }
`;

const ChapterSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsGrid = styled.div`
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

const ContentSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const SectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled(motion.h2)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['3xl']};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.primary};
`;

const LessonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const LessonCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.md};
  border: 1px solid ${({ theme }) => theme.colors.background};
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-4px);
  }
`;

const LessonHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LessonIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.gradient.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const LessonTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin: 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const LessonDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  line-height: 1.6;
`;

const LessonMeta = styled.div`
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

const LessonLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  text-decoration: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
    transform: translateX(4px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const QuoteSection = styled.section`
  padding: ${({ theme }) => theme.spacing['4xl']} 0;
  background: ${({ theme }) => theme.colors.gradient.creative};
  color: white;
  text-align: center;
`;

const Quote = styled(motion.blockquote)`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes['2xl']};
  font-style: italic;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  line-height: 1.4;
  
  &::before {
    content: '"';
    font-size: ${({ theme }) => theme.typography.sizes['4xl']};
    opacity: 0.3;
  }
  
  &::after {
    content: '"';
    font-size: ${({ theme }) => theme.typography.sizes['4xl']};
    opacity: 0.3;
  }
`;

const QuoteAuthor = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  opacity: 0.9;
`;

const ChapterIntro = () => {
  const [rachel] = useState(RachelService.getRachelPersonality());
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    setCurrentQuote(RachelService.getRachelQuote());
  }, []);

  const lessons = [
    {
      id: 1,
      title: "Storytelling Fundamentals",
      description: "Master the essential elements of compelling storytelling for brand communication",
      icon: BookOpen,
      duration: "90 min",
      difficulty: "Beginner",
      link: "/lesson1"
    },
    {
      id: 2,
      title: "Brand Voice Development",
      description: "Develop authentic brand personalities that resonate with your audience",
      icon: Users,
      duration: "2 hours",
      difficulty: "Intermediate",
      link: "/lesson2"
    },
    {
      id: 3,
      title: "Creative Content Strategy",
      description: "Build strategic frameworks for consistent, engaging content creation",
      icon: Target,
      duration: "2.5 hours",
      difficulty: "Intermediate",
      link: "/lesson3"
    },
    {
      id: 4,
      title: "Multi-Platform Storytelling",
      description: "Adapt your narrative across different channels and touchpoints",
      icon: Lightbulb,
      duration: "2 hours",
      difficulty: "Advanced",
      link: "/lesson4"
    },
    {
      id: 5,
      title: "Creative Communication Workshops",
      description: "Hands-on workshops for mastering advanced storytelling techniques",
      icon: Award,
      duration: "4 hours",
      difficulty: "Advanced",
      link: "/lesson5"
    }
  ];

  const chapterStats = [
    { number: "5", label: "Comprehensive Lessons" },
    { number: "4", label: "Interactive Workshops" },
    { number: "12", label: "Creative Projects" },
    { number: "8+", label: "Hours of Learning" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <ChapterContainer>
      <HeroSection>
        <HeroContent>
          <ChapterTitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Chapter 5: Creative Storytelling
          </ChapterTitle>
          <ChapterSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Master the art of brand storytelling and authentic voice development with Rachel Thompson
          </ChapterSubtitle>
          
          <StatsGrid>
            {chapterStats.map((stat, index) => (
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
          </StatsGrid>
        </HeroContent>
      </HeroSection>

      <ContentSection>
        <SectionContainer>
          <RachelCharacter showInsight={true} topic="storytelling" />
          
          <SectionTitle
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Learning Journey
          </SectionTitle>
          
          <LessonsGrid>
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <LessonHeader>
                  <LessonIcon>
                    <lesson.icon />
                  </LessonIcon>
                  <LessonTitle>{lesson.title}</LessonTitle>
                </LessonHeader>
                
                <LessonDescription>
                  {lesson.description}
                </LessonDescription>
                
                <LessonMeta>
                  <MetaItem>
                    <Clock />
                    {lesson.duration}
                  </MetaItem>
                  <MetaItem>
                    <Target />
                    {lesson.difficulty}
                  </MetaItem>
                </LessonMeta>
                
                <LessonLink to={lesson.link}>
                  <Play />
                  Start Lesson
                  <ChevronRight />
                </LessonLink>
              </LessonCard>
            ))}
          </LessonsGrid>
        </SectionContainer>
      </ContentSection>

      <QuoteSection>
        <Quote
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {currentQuote}
        </Quote>
        <QuoteAuthor>— Rachel Thompson</QuoteAuthor>
      </QuoteSection>
    </ChapterContainer>
  );
};

export default ChapterIntro;