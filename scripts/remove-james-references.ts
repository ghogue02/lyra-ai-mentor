/**
 * Remove James References from Chapter 2
 * 
 * This script removes all James references from Chapter 2 since it's
 * confirmed to be Maya's complete journey (all 4 lessons)
 */

// Actions needed once database connection is established:

const actionsToTake = {
  // 1. Update interactive elements that mention James
  updateInteractiveElements: [
    {
      action: "UPDATE interactive_elements",
      set: "configuration = jsonb_set(configuration, '{character}', '\"Maya Rodriguez\"')",
      where: "lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 2) AND configuration::text LIKE '%James%'"
    }
  ],

  // 2. Update content blocks that mention James
  updateContentBlocks: [
    {
      action: "Search for James mentions in Chapter 2 content blocks",
      query: `
        SELECT id, content, lesson_id 
        FROM content_blocks 
        WHERE lesson_id IN (SELECT id FROM lessons WHERE chapter_id = 2)
        AND content LIKE '%James%'
      `
    }
  ],

  // 3. Component updates needed
  componentUpdates: [
    "Remove any James-specific imports from InteractiveElementRenderer",
    "Update any conditional logic checking for James in Chapter 2",
    "Ensure all Chapter 2 elements use Maya components"
  ],

  // 4. Create missing Maya components for document creation
  createMayaComponents: [
    "MayaDocumentCreator - For general document creation",
    "MayaReportBuilder - For annual reports and impact stories",
    "MayaTemplateDesigner - For creating reusable templates"
  ]
};

// Time metrics to add for Maya's document journey
const mayaDocumentMetrics = {
  grantProposal: {
    before: "3 weeks of rewrites",
    after: "2 hours to compelling draft",
    savings: "90% time reduction"
  },
  annualReport: {
    before: "40 hours over 2 weeks",
    after: "4 hours of focused work",
    savings: "90% time saved"
  },
  donorLetters: {
    before: "30 minutes per letter",
    after: "5 minutes per personalized letter",
    savings: "83% efficiency gain"
  },
  templates: {
    before: "Starting from scratch each time",
    after: "2-minute customization",
    savings: "95% faster document creation"
  }
};

export { actionsToTake, mayaDocumentMetrics };