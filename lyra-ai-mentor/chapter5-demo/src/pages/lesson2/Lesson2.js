import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Users, Mic, Target, Heart, MessageSquare, Volume2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RachelCharacter from '../../components/character/RachelCharacter';
import { RachelService } from '../../services/rachelService';

const LessonContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: ${({ theme }) => theme.colors.background};
`;

const LessonHeader = styled.section`
  background: ${({ theme }) => theme.colors.gradient.secondary};
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

const BrandVoiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;
`;

const VoiceCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ theme }) => theme.colors.creative.teal};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.creative.teal} 0%, 
      ${({ theme }) => theme.colors.creative.blue} 100%
    );
  }
`;

const VoiceAttribute = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.creative.teal};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const VoiceDescription = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const VoiceExample = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.creative.teal};
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const InteractiveExercise = styled(motion.div)`
  background: ${({ theme }) => theme.colors.pace.analyze};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing.xl} 0;
  border: 2px solid ${({ theme }) => theme.colors.secondary};
`;

const ExerciseTitle = styled.h3`
  font-family: ${({ theme }) => theme.typography.fonts.creative};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.secondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ExerciseInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.secondary};
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
  background: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.animations.transition};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
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

const Lesson2 = () => {
  const [brandVoiceInput, setBrandVoiceInput] = useState('');
  const [voiceAnalysis, setVoiceAnalysis] = useState('');
  const brandVoiceTemplate = RachelService.getBrandVoiceTemplate();

  const voiceAttributes = [
    {
      name: 'Tone',
      icon: Volume2,
      description: 'The emotional inflection in your communication',
      example: 'Professional yet approachable, like a knowledgeable friend'
    },
    {
      name: 'Personality',
      icon: Heart,
      description: 'The human characteristics your brand embodies',
      example: 'Authentic, inspiring, supportive, and creative'
    },
    {
      name: 'Values',
      icon: Target,
      description: 'The core principles that guide your messaging',
      example: 'Authenticity over perfection, connection over promotion'
    },
    {
      name: 'Audience Connection',
      icon: Users,
      description: 'How you relate to and engage with your audience',
      example: 'Speaking as a peer, not a corporate entity'
    },
    {
      name: 'Messaging Style',
      icon: MessageSquare,
      description: 'The way you structure and deliver your content',
      example: 'Story-driven, conversational, and action-oriented'
    },
    {
      name: 'Voice Consistency',
      icon: Mic,
      description: 'Maintaining your brand voice across all touchpoints',
      example: 'Same personality whether in email, social media, or website'
    }
  ];

  const analyzeVoice = () => {
    if (brandVoiceInput.trim()) {
      setVoiceAnalysis(
        `Great start! Your brand voice shows elements of authenticity and connection. 
        Consider strengthening the emotional appeal and ensuring consistency across all platforms. 
        Remember: your voice should feel like a trusted friend, not a corporate announcement.`
      );
    }
  };

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
            Brand Voice Development
          </LessonTitle>
          <LessonSubtitle
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Develop authentic brand personalities that resonate with your audience
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
          <RachelCharacter showInsight={true} topic="brandvoice" />
          
          <ContentCard variants={itemVariants}>
            <SectionTitle>
              <Users />
              Brand Voice Fundamentals
            </SectionTitle>
            <p>
              Your brand voice is more than just how you write—it's how you make people feel. 
              It's the personality that comes through in every interaction, creating familiarity 
              and building trust with your audience.
            </p>
            
            <BrandVoiceGrid>
              {voiceAttributes.map((attribute, index) => (
                <VoiceCard
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <VoiceAttribute>
                    <attribute.icon />
                    {attribute.name}
                  </VoiceAttribute>
                  <VoiceDescription>
                    {attribute.description}
                  </VoiceDescription>
                  <VoiceExample>
                    {attribute.example}
                  </VoiceExample>
                </VoiceCard>
              ))}
            </BrandVoiceGrid>
          </ContentCard>

          <InteractiveExercise
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ExerciseTitle>
              <Mic />
              Brand Voice Exercise
            </ExerciseTitle>
            <p>
              Write a brief description of your brand as if it were a person. What personality 
              traits would they have? How would they speak to a friend? What values guide their actions?
            </p>
            <ExerciseInput
              placeholder="Describe your brand's personality in 2-3 sentences..."
              value={brandVoiceInput}
              onChange={(e) => setBrandVoiceInput(e.target.value)}
            />
            <ExerciseButton onClick={analyzeVoice}>
              Analyze My Brand Voice
            </ExerciseButton>
            
            {voiceAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  background: 'rgba(230, 57, 70, 0.1)',
                  borderRadius: '8px',
                  borderLeft: '4px solid #E63946'
                }}
              >
                <strong>Rachel's Feedback:</strong>
                <p style={{ margin: '0.5rem 0 0 0' }}>{voiceAnalysis}</p>
              </motion.div>
            )}
          </InteractiveExercise>

          <ContentCard variants={itemVariants}>
            <SectionTitle>
              <Target />
              Voice Consistency Framework
            </SectionTitle>
            <p>
              Consistency is key to building brand recognition. Your voice should feel familiar 
              whether someone encounters you on social media, your website, or in person.
            </p>
            
            <BrandVoiceGrid>
              {brandVoiceTemplate.messaging.map((message, index) => (
                <VoiceCard
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <VoiceAttribute>
                    <MessageSquare />
                    Core Message {index + 1}
                  </VoiceAttribute>
                  <VoiceDescription>
                    {message}
                  </VoiceDescription>
                  <VoiceExample>
                    Apply this message across all your communications for consistency
                  </VoiceExample>
                </VoiceCard>
              ))}
            </BrandVoiceGrid>
          </ContentCard>
        </motion.div>

        <NavigationButtons>
          <NavButton to="/lesson1" className="secondary">
            <ArrowLeft />
            Previous: Storytelling
          </NavButton>
          <NavButton to="/lesson3">
            Next: Content Strategy
            <ArrowRight />
          </NavButton>
        </NavigationButtons>
      </MainContent>
    </LessonContainer>
  );
};

export default Lesson2;