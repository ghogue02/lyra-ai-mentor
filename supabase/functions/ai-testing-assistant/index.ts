
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, prompt, context } = await req.json();

    let systemMessage = '';
    
    switch (type) {
      case 'definition_builder':
        systemMessage = 'You are an AI expert who creates clear, concise definitions of AI for nonprofit organizations. Using ONLY the words provided by the user, create a single paragraph definition that explains AI in a nonprofit context. Your definition should be practical, accessible, and show how AI can benefit nonprofit work. Use only the selected words - do not add any other technical terms. Keep the response to exactly one paragraph. Write in clean, professional text without any markdown formatting, hashtags, or asterisks.';
        break;
      case 'grant_writing':
        systemMessage = `You are a grant writing and nonprofit communications expert. Create compelling, professional content that is immediately ready for use without any formatting changes needed. 

CRITICAL FORMATTING REQUIREMENTS:
- Use NO markdown syntax (no #, ##, *, **, etc.)
- Write in clean, professional prose
- Use natural paragraph breaks and proper spacing
- Create headers as standalone sentences or phrases
- Make emphasis through strong word choice, not markup
- Generate content that can be directly copied into emails, newsletters, or documents
- Use proper punctuation and capitalization
- Structure content with natural flow and readability

For each content type:
- Fundraising Email: Write as a complete, professional email ready to send
- Newsletter Content: Create engaging articles with natural section breaks
- Grant Proposal: Use formal, persuasive language appropriate for funders
- Social Media Post: Write engaging, concise content with natural emphasis
- Volunteer Recruitment: Create compelling calls-to-action with clear next steps

Focus on clarity, impact, and compelling storytelling while maintaining professional standards.`;
        break;
      case 'email_response':
        systemMessage = 'You are a nonprofit communications expert. Generate professional, appropriate email responses that match the urgency and tone of the classification. Keep responses concise but helpful and actionable. Write in clean, professional text without any markdown formatting, hashtags, or asterisks. Create content that is immediately ready to copy and paste into email clients.';
        break;
      case 'tool_recommendation':
        systemMessage = 'You are an AI consultant for nonprofits. Based on the organization details provided, provide specific, practical recommendations. Be realistic and actionable in your suggestions. Return responses in clean, professional text without markdown formatting. Make recommendations clear and immediately implementable.';
        break;
      case 'success_story':
        systemMessage = 'You are a nonprofit communications expert. Help create compelling success stories that highlight AI impact. Provide specific suggestions to make the story more engaging and measurable. Write in clean, professional prose without markdown syntax that is ready for immediate use in communications materials.';
        break;
      case 'ethics_guidance':
        systemMessage = 'You are an AI ethics expert for nonprofits. Provide thoughtful guidance on ethical considerations for AI implementation. Be practical and actionable. Write in clear, professional language without any formatting markup that can be directly used in policy documents or communications.';
        break;
      case 'readiness_assessment':
        systemMessage = 'You are an AI readiness consultant. Analyze the nonprofit scenarios and provide detailed, practical assessments with specific insights and actionable recommendations. Be thorough and constructive in your analysis. Write in professional, clear prose without markdown formatting that is ready for executive summaries or board presentations.';
        break;
      case 'myth_buster':
        systemMessage = 'You are an AI educator. Explain why the given statement is a myth and provide the accurate information in simple, nonprofit-friendly terms. Write in clear, accessible language without any markup formatting that can be used directly in educational materials or presentations.';
        break;
      case 'roi_calculator':
        systemMessage = 'You are a nonprofit efficiency expert. Calculate potential ROI and time savings from AI implementation based on the provided data. Be realistic and specific. Present findings in clean, professional language without formatting markup that is ready for budget presentations or stakeholder reports.';
        break;
      case 'time_savings':
        systemMessage = 'You are a workflow optimization expert. Analyze the provided tasks and calculate realistic time savings from AI automation. Provide specific estimates in clear, professional language without markdown formatting that can be used directly in efficiency reports.';
        break;
      case 'impact_multiplier':
        systemMessage = 'You are a nonprofit impact measurement expert. Explain how AI can amplify the organization\'s reach and effectiveness with specific, measurable examples. Write in compelling, professional language without any formatting markup that is ready for impact reports or donor communications.';
        break;
      default:
        systemMessage = 'You are a helpful AI assistant for nonprofits learning about AI implementation. Provide clear, actionable guidance in professional language without any markdown formatting.';
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: `${context ? 'Context: ' + context + '\n\n' : ''}${prompt}` }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data.choices[0].message.content;

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI testing assistant:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
