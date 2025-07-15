import fs from 'fs/promises';

interface ContentForToneAnalysis {
  chapterInfo: {
    title: string;
    description: string;
  };
  lessonContent: {
    title: string;
    subtitle: string;
    contentBlocks: {
      type: string;
      title: string;
      content: string;
    }[];
    interactiveElements: {
      type: string;
      title: string;
      content: string;
      configuration?: any;
    }[];
  }[];
  toneIndicators: {
    conversationalPhrases: string[];
    emotionalAppeals: string[];
    personalPronouns: string[];
    nycSpecificReferences: string[];
    storiesAndExamples: string[];
  };
}

async function prepareToneAnalysis() {
  try {
    // Read the Chapter 1 data
    const rawData = await fs.readFile('chapter1-content-data.json', 'utf-8');
    const data = JSON.parse(rawData);

    // Extract all text content for tone analysis
    const analysis: ContentForToneAnalysis = {
      chapterInfo: {
        title: data.chapter.title,
        description: data.chapter.description
      },
      lessonContent: data.lessons.map((lesson: any) => {
        const lessonContentBlocks = data.contentBlocks
          .filter((cb: any) => cb.lesson_id === lesson.id)
          .map((cb: any) => ({
            type: cb.type,
            title: cb.title,
            content: cb.content
          }));

        const lessonInteractiveElements = data.interactiveElements
          .filter((ie: any) => ie.lesson_id === lesson.id)
          .map((ie: any) => ({
            type: ie.type,
            title: ie.title,
            content: ie.content,
            configuration: ie.configuration
          }));

        return {
          title: lesson.title,
          subtitle: lesson.subtitle,
          contentBlocks: lessonContentBlocks,
          interactiveElements: lessonInteractiveElements
        };
      }),
      toneIndicators: {
        conversationalPhrases: [],
        emotionalAppeals: [],
        personalPronouns: [],
        nycSpecificReferences: [],
        storiesAndExamples: []
      }
    };

    // Analyze tone indicators across all content
    const allText = JSON.stringify(analysis.lessonContent);
    
    // Find conversational phrases
    const conversationalPatterns = [
      /you're about to/gi,
      /think of this/gi,
      /imagine/gi,
      /here's something/gi,
      /remember when/gi,
      /let's explore/gi,
      /picture this/gi,
      /meet \w+/gi
    ];
    
    conversationalPatterns.forEach(pattern => {
      const matches = allText.match(pattern) || [];
      analysis.toneIndicators.conversationalPhrases.push(...matches);
    });

    // Find emotional appeals
    const emotionalPatterns = [
      /drowning in/gi,
      /overwhelmed/gi,
      /transformative journey/gi,
      /beautiful truth/gi,
      /magic happen/gi,
      /truly understood/gi,
      /can't afford to ignore/gi
    ];

    emotionalPatterns.forEach(pattern => {
      const matches = allText.match(pattern) || [];
      analysis.toneIndicators.emotionalAppeals.push(...matches);
    });

    // Find personal pronouns (indicating direct address)
    const pronounPatterns = [
      /\byou\b/gi,
      /\byour\b/gi,
      /\byou're\b/gi,
      /\byou've\b/gi
    ];

    pronounPatterns.forEach(pattern => {
      const matches = allText.match(pattern) || [];
      analysis.toneIndicators.personalPronouns = [...new Set(matches)]; // Unique only
    });

    // Find NYC-specific references
    const nycPatterns = [
      /\b(Queens|Brooklyn|Manhattan|Bronx|Harlem|Washington Heights)\b/gi,
      /New York City/gi,
      /NYC/gi,
      /subway/gi
    ];

    nycPatterns.forEach(pattern => {
      const matches = allText.match(pattern) || [];
      analysis.toneIndicators.nycSpecificReferences.push(...matches);
    });

    // Find stories and examples
    const storyPatterns = [
      /Meet \w+[^.]+\./gi,
      /Last month[^.]+\./gi,
      /Sarah[^.]+\./gi,
      /Maria[^.]+\./gi,
      /Carmen[^.]+\./gi,
      /DeShawn[^.]+\./gi
    ];

    storyPatterns.forEach(pattern => {
      const matches = allText.match(pattern) || [];
      analysis.toneIndicators.storiesAndExamples.push(...matches);
    });

    // Remove duplicates from arrays
    Object.keys(analysis.toneIndicators).forEach(key => {
      analysis.toneIndicators[key as keyof typeof analysis.toneIndicators] = 
        [...new Set(analysis.toneIndicators[key as keyof typeof analysis.toneIndicators])];
    });

    // Save the tone analysis
    await fs.writeFile(
      'chapter1-tone-analysis.json',
      JSON.stringify(analysis, null, 2)
    );

    // Generate tone summary
    const toneSummary = {
      overview: "Chapter 1 uses a highly conversational, empathetic tone that speaks directly to nonprofit professionals",
      keyCharacteristics: [
        `Personal address: ${analysis.toneIndicators.personalPronouns.length} uses of personal pronouns`,
        `Storytelling: ${analysis.toneIndicators.storiesAndExamples.length} specific stories/examples`,
        `Local relevance: ${analysis.toneIndicators.nycSpecificReferences.length} NYC-specific references`,
        `Conversational style: ${analysis.toneIndicators.conversationalPhrases.length} conversational phrases`,
        `Emotional connection: ${analysis.toneIndicators.emotionalAppeals.length} emotional appeals`
      ],
      writingStyle: {
        voice: "Warm, encouraging, peer-to-peer",
        perspective: "Second person (you/your)",
        complexity: "Accessible, avoiding technical jargon",
        structure: "Story-driven with practical examples"
      },
      targetAudience: {
        primary: "Nonprofit professionals in NYC",
        techLevel: "Beginners with limited AI knowledge",
        emotionalState: "Potentially overwhelmed or skeptical about AI"
      }
    };

    await fs.writeFile(
      'chapter1-tone-summary.json',
      JSON.stringify(toneSummary, null, 2)
    );

    console.log('✅ Tone analysis prepared successfully');
    console.log('\n📊 Tone Summary:');
    console.log(JSON.stringify(toneSummary, null, 2));

  } catch (error) {
    console.error('Error preparing tone analysis:', error);
  }
}

// Execute the analysis
prepareToneAnalysis();