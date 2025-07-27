export function buildNaturalSystemMessage(
  userProfile: any,
  lessonContext: any,
  isDataInsights?: boolean,
  useCleanFormatting?: boolean,
  character?: string,
  originalSystemMessage?: string
): string {
  // For model comparison, preserve the original simple system message
  if (lessonContext?.modelComparison && originalSystemMessage) {
    return originalSystemMessage;
  }

  // Base character personality
  let systemMessage = `You are Lyra, an AI mentor who is enthusiastic, supportive, and deeply knowledgeable about AI. You help users learn and apply AI concepts in practical ways.

Your personality:
- Warm and encouraging, but never condescending
- Uses conversational language that feels natural and engaging
- Asks thoughtful questions to encourage deeper thinking
- Provides concrete examples and actionable advice
- Adapts your communication style to the user's experience level`;

  // Add user context if available
  if (userProfile) {
    systemMessage += `\n\nUser Context:`;
    if (userProfile.first_name) {
      systemMessage += `\n- Name: ${userProfile.first_name}`;
    }
    if (userProfile.organization_name) {
      systemMessage += `\n- Organization: ${userProfile.organization_name}`;
    }
    if (userProfile.role) {
      systemMessage += `\n- Role: ${userProfile.role}`;
    }
    if (userProfile.ai_experience) {
      systemMessage += `\n- AI Experience: ${userProfile.ai_experience}`;
    }
    if (userProfile.tech_comfort) {
      systemMessage += `\n- Tech Comfort: ${userProfile.tech_comfort}`;
    }
  }

  // Add lesson context
  if (lessonContext) {
    systemMessage += `\n\nCurrent Lesson Context:`;
    if (lessonContext.chapterTitle) {
      systemMessage += `\n- Chapter: ${lessonContext.chapterTitle}`;
    }
    if (lessonContext.lessonTitle) {
      systemMessage += `\n- Lesson: ${lessonContext.lessonTitle}`;
    }
    if (lessonContext.content) {
      systemMessage += `\n- Topic Focus: ${lessonContext.content}`;
    }
  }

  // Add specialized instructions for data insights
  if (isDataInsights) {
    systemMessage += `\n\nData Insights Mode: You're helping with data analysis and visualization. Focus on practical data insights, clear explanations of trends, and actionable recommendations.`;
  }

  // Add formatting instructions
  if (useCleanFormatting) {
    systemMessage += `\n\nFormatting: Use clean, professional formatting. Break up longer responses with bullet points, numbered lists, or short paragraphs for better readability.`;
  }

  systemMessage += `\n\nRemember: Your goal is to be genuinely helpful while keeping the conversation engaging and personalized to this specific user and their learning journey.`;

  return systemMessage;
}