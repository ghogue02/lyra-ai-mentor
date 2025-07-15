# PACE Content Analysis Report - MayaEmailComposer.tsx

## Executive Summary

This analysis identifies all content in MayaEmailComposer.tsx that needs rewriting to be more natural, warm, and human. The current implementation suffers from robotic AI phrasing, awkward concatenations, and repetitive structures that diminish Maya's character authenticity.

## 1. Awkward Concatenations

### Purpose Options
- **Current**: Generic, database-like labels
- **Issues**: Trying too hard to be poetic, losing clarity
- **Examples**:
  - "Calm a Worried Heart" → Sounds like a greeting card, not professional communication
  - "Show Deep Gratitude" → Overly formal, doesn't match Maya's warm style
  - "Create an Opportunity" → Vague and corporate-sounding

### Dynamic String Building Issues
- **Technical Cause**: Template literals and concatenation without proper connectors
- **Example**: "Execute Request Support for Maya Building Bridges" (appears to be concatenating action + purpose + context)
- **Solution**: Use proper sentence structure with natural connectors

## 2. Robotic Phrasing

### System Messages
- "Select both purpose and audience to see personalized tone recommendations"
- "Based on your purpose and audience, these are the most effective tone strategies"
- "Descriptions are customized for your specific purpose"

**Issue**: Sounds like database output, not helpful guidance from Maya

### Help Content
- "Clear purpose drives everything else: tone, content, and call-to-action"
- "The right audience selection ensures your message resonates"

**Issue**: Technical manual language, not Maya's experienced voice

### Recommendation Engine
- "Using all available tones for this audience"
- "Consider your relationship and communication goals"

**Issue**: Generic AI assistant language lacking personality

## 3. Repetitive Sentence Structures

### Maya's Experience Pattern
Every purpose option follows identical structure:
- "Maya remembers..."
- "Maya learned that..."
- "Maya discovered that..."
- "Maya knows that..."

**Issue**: Reads like a template was filled in, not natural storytelling

### Audience Descriptions
Every audience follows the pattern:
- "Like [Name], who [specific action]"
- Examples:
  - "Like Sarah, who called at 11 PM about her son's progress"
  - "Like Michael, who attended three events before deciding to give"
  - "Like Patricia, who gives $5,000 annually and expects detailed reports"

**Issue**: Formulaic and predictable, reduces emotional impact

### What You'll Write Pattern
Every option includes:
- "You'll write: [description]"
- "When to use: [scenario]"

**Issue**: Mechanical instruction manual feel

## 4. Missing Personality/Warmth

### Content Strategy Labels
Current tone options likely include generic labels like:
- "Professional & Respectful"
- "Warm & Understanding"
- "Urgent but Calm"

**Issue**: Sounds like dropdown menu options, not Maya's guidance

### Progressive Disclosure Messages
- "Ready to generate your perfectly crafted email using the PACE methodology!"
- "Your selection will filter recipients to show only the most relevant audiences"

**Issue**: System documentation language, not conversational guidance

### Smart Recommendations
- "AI Recommendation"
- "Smart filtering applied"
- "Intelligent tone recommendation based on purpose + audience combination"

**Issue**: Emphasizes AI/system rather than Maya's expertise

## 5. Technical Causes of Issues

### 1. Template Rigidity
- Fixed patterns for all content types
- No variation in sentence structure
- Database-like field population

### 2. Concatenation Problems
- Direct string joining without natural language connectors
- Missing articles, prepositions, and transitions
- No context-aware punctuation

### 3. AI Voice Dominance
- Generic AI-generated phrases
- No personality injection layer
- Missing character-specific vocabulary

### 4. Lack of Context Awareness
- Same phrases regardless of user progress
- No adaptation based on previous selections
- Static help content

## 6. Content Areas Requiring Complete Rewrite

### Priority 1: Core Navigation Content
1. Purpose option labels and descriptions
2. Audience labels and contextual descriptions
3. Content strategy/tone options
4. Step transition messages

### Priority 2: Help and Guidance
1. Tooltip content
2. Progressive disclosure previews
3. Recommendation explanations
4. Error/validation messages

### Priority 3: Dynamic Responses
1. Smart recommendation text
2. Contextual help adaptations
3. Success messages
4. Preview descriptions

## 7. Recommended Approach

### Voice Guidelines for Maya
- Warm, experienced nonprofit professional
- Practical wisdom from real situations
- Conversational but professional
- Empathetic and understanding

### Structure Improvements
- Vary sentence patterns
- Use natural transitions
- Include conversational asides
- Add personality quirks

### Technical Implementation
- Create a personality layer for all system messages
- Use template variations to avoid repetition
- Add contextual connectors for concatenation
- Implement Maya-specific vocabulary replacements

## 8. Specific Examples Needing Rewrite

### Current vs. Improved Examples

**Purpose Option**
- Current: "When someone needs reassurance about something that matters deeply to them"
- Better: "Those heart-dropping moments when someone reaches out, worried and needing your reassurance"

**Audience Description**
- Current: "Like Sarah, who called at 11 PM about her son's progress"
- Better: "Remember Sarah? Single mom, works downtown, called me at 11 PM worried sick about her son"

**Help Tooltip**
- Current: "Clear purpose drives everything else: tone, content, and call-to-action"
- Better: "Here's what I learned after 15 years: knowing exactly why you're writing makes everything else fall into place"

**Recommendation**
- Current: "Based on your purpose and audience, these are the most effective tone strategies"
- Better: "With worried parents like Sarah, I've found these approaches work best..."

## Next Steps

1. Create a comprehensive content rewrite guide with Maya's authentic voice
2. Implement a personality injection system for all dynamic content
3. Add variation templates to break repetitive patterns
4. Test with users to ensure warmth and authenticity come through

The goal is to make every piece of text sound like it's coming from Maya herself, not from a system or AI. Users should feel like they're learning from a wise, warm mentor who's been in their shoes.