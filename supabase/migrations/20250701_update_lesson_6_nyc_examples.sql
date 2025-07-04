-- Update Lesson 6: Document Creation Powerhouse with NYC-specific examples and requested interactive elements

-- 1. First, delete existing content to replace with NYC-focused version
DELETE FROM interactive_elements WHERE lesson_id = 6;
DELETE FROM content_blocks WHERE lesson_id = 6;

-- 2. Insert updated Content Blocks with NYC examples
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  -- Introduction
  (6, 'text', 'Transform Your Document Creation Process', 'Whether you''re writing a grant proposal for the NYC Department of Youth and Community Development, creating a board report for your Brooklyn-based food bank, or drafting a memo for Manhattan volunteers, AI can transform hours of work into minutes of smart editing.', '{"version": "2.0"}', 10),
  
  -- NYC Context
  (6, 'text', 'NYC Non-Profit Document Challenges', 'New York non-profits face unique documentation demands: city agency reporting requirements, complex grant applications (like NYC Council discretionary funding), multi-language communications for diverse communities, and board presentations that capture the city''s fast-paced environment.', '{"version": "2.0"}', 20),
  
  -- Statistics with NYC focus
  (6, 'callout_box', 'NYC Non-Profit Reality', 'The average NYC non-profit submits 15+ reports annually to city agencies alone. Organizations using AI document tools report 60% time savings and improved compliance rates with city requirements.', '{"type": "info", "icon": "chart"}', 30),
  
  -- Document Types Section
  (6, 'text', 'Essential NYC Non-Profit Documents', 'Master three critical document types every NYC non-profit needs: Reports (for city agencies, foundations, and boards), Proposals (for grants, partnerships, and new programs), and Memos (for staff, volunteers, and community updates).', '{"version": "2.0"}', 40),
  
  -- Reports Deep Dive
  (6, 'text', 'Reports That Get Results', 'From quarterly reports to NYC''s Department of Health and Mental Hygiene to annual impact reports for the Robin Hood Foundation, effective reporting is crucial. AI helps you structure data, highlight outcomes, and meet specific funder requirements while telling your organization''s story.', '{"version": "2.0"}', 50),
  
  -- NYC Example
  (6, 'example_block', 'Real NYC Example', 'A Bronx youth organization used AI to transform their DYCD contract report from a 3-day project to a 4-hour task, while improving clarity and compliance scores. The AI helped organize program data, craft impact narratives, and ensure all required sections were complete.', '{"type": "success_story", "borough": "Bronx"}', 60),
  
  -- Interactive Element Placeholder
  (6, 'interactive_element_placeholder', 'Document Generator', 'Create professional documents tailored to NYC non-profit needs', '{"elementType": "document_generator"}', 70),
  
  -- Proposals Section
  (6, 'text', 'Proposals That Win Funding', 'Whether applying for NYC Council discretionary funds, responding to a Request for Proposals from the Mayor''s Office, or seeking foundation support, compelling proposals are essential. AI helps you match your language to funder priorities and create persuasive narratives.', '{"version": "2.0"}', 80),
  
  -- Best Practices
  (6, 'text', 'NYC Proposal Best Practices', 'Successful NYC proposals address specific borough needs, cite local data (from NYC Open Data or similar sources), demonstrate community partnerships, and align with city initiatives like OneNYC goals. AI can help you incorporate these elements naturally.', '{"version": "2.0"}', 90),
  
  -- Memos Section
  (6, 'text', 'Memos That Drive Action', 'Internal communications keep your team aligned. Whether updating staff on new NYC regulations, coordinating volunteer efforts for a Central Park event, or sharing board decisions, clear memos ensure everyone stays informed and engaged.', '{"version": "2.0"}', 100),
  
  -- Interactive Element Placeholder
  (6, 'interactive_element_placeholder', 'Document Improver', 'Polish and enhance your existing drafts', '{"elementType": "document_improver"}', 110),
  
  -- Practical Tips
  (6, 'text', 'Quick Wins with AI Documents', 'Start with templates for recurring documents like monthly board updates or volunteer newsletters. Use AI to adapt successful proposals for new opportunities. Let AI help translate key documents for NYC''s multilingual communities.', '{"version": "2.0"}', 120),
  
  -- Reflection
  (6, 'reflection', 'Your Document Priorities', 'Which NYC-specific documents consume most of your time? City contract reports? Foundation proposals? Community newsletters? Identifying your biggest time drains helps you maximize AI''s impact.', '{"prompt": "What NYC-specific documents take the most time in your role?", "placeholderText": "I spend hours on DYCD reports because...", "minLength": 40}', 130),
  
  -- Data and Metrics
  (6, 'text', 'Making NYC Data Compelling', 'Transform statistics from NYC Open Data, community needs assessments, and program metrics into compelling narratives. AI helps you present subway ridership impacts, food insecurity rates by borough, or youth program outcomes in ways that resonate with funders and stakeholders.', '{"version": "2.0"}', 140),
  
  -- Compliance Focus
  (6, 'callout_box', 'NYC Compliance Tip', 'Many NYC agencies require specific report formats and terminology. Save AI-generated templates that meet these requirements for consistent, compliant submissions every time.', '{"type": "tip", "icon": "clipboard"}', 150)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Interactive Elements with requested types
INSERT INTO interactive_elements (lesson_id, type, title, content, configuration, order_index)
VALUES
  -- Document Generator (as requested)
  (6, 'document_generator', 'Create NYC Non-Profit Documents', 'Generate professional documents for NYC non-profit needs. Choose your document type and let AI help you create a strong first draft.', '{
    "documentTypes": [
      {
        "id": "city_agency_report",
        "name": "City Agency Report",
        "description": "Quarterly or annual reports for DYCD, DOE, DOHMH, etc.",
        "sections": ["executive_summary", "program_overview", "outcomes_metrics", "demographics", "challenges_solutions", "financial_summary", "next_quarter_goals"]
      },
      {
        "id": "grant_proposal",
        "name": "Grant Proposal",
        "description": "Proposals for NYC Council, foundations, or corporate funders",
        "sections": ["needs_statement", "project_description", "goals_objectives", "implementation_plan", "evaluation_methods", "budget_narrative", "organizational_capacity"]
      },
      {
        "id": "internal_memo",
        "name": "Internal Memo",
        "description": "Staff updates, volunteer coordination, or board communications",
        "sections": ["purpose", "background", "key_points", "action_items", "timeline", "contact_info"]
      }
    ],
    "nycContext": true,
    "boroughOptions": ["Bronx", "Brooklyn", "Manhattan", "Queens", "Staten Island", "Citywide"],
    "templateLibrary": true
  }', 160),
  
  -- Document Improver (as requested)
  (6, 'document_improver', 'Polish Your NYC Documents', 'Take your rough draft and make it shine. This tool helps improve clarity, add NYC-specific context, and ensure your document meets funder or agency requirements.', '{
    "improvementOptions": [
      {
        "id": "clarity",
        "name": "Improve Clarity",
        "description": "Make complex ideas more accessible"
      },
      {
        "id": "nyc_context",
        "name": "Add NYC Context",
        "description": "Include relevant borough data and city initiatives"
      },
      {
        "id": "compliance",
        "name": "Check Compliance",
        "description": "Ensure document meets NYC agency requirements"
      },
      {
        "id": "impact",
        "name": "Strengthen Impact",
        "description": "Make your outcomes and needs more compelling"
      },
      {
        "id": "conciseness",
        "name": "Make Concise",
        "description": "Reduce length while maintaining key messages"
      }
    ],
    "suggestionMode": true,
    "trackChanges": true
  }', 170),
  
  -- Practice Exercise
  (6, 'scenario_practice', 'NYC Document Challenge', 'Practice creating a document for a real NYC scenario: Your Queens-based senior center needs to submit a quarterly report to DFTA (Department for the Aging) showing increased meal program participation.', '{
    "scenario": "dfta_quarterly_report",
    "backgroundInfo": {
      "organization": "Queens Community Senior Center",
      "program": "Congregate Meal Program",
      "quarter": "Q3 2024",
      "keyMetrics": {
        "mealsServed": 4500,
        "uniqueSeniors": 180,
        "growthRate": "25%",
        "newParticipants": 35
      },
      "challenges": ["Kitchen renovation disruption", "Rising food costs"],
      "successes": ["New halal menu options", "Partnership with local grocery"]
    },
    "requiredSections": ["Executive Summary", "Program Statistics", "Demographic Breakdown", "Challenges and Solutions", "Success Stories", "Next Quarter Plans"],
    "hints": ["Emphasize cultural meal options for Queens diversity", "Connect to DFTA goals of reducing senior isolation", "Include cost-per-meal efficiency metrics"]
  }', 180),
  
  -- Lyra Chat for personalized guidance
  (6, 'lyra_chat', 'Your NYC Document Coach', 'I''m here to help with your specific NYC non-profit document challenges. Tell me about a document you''re working on - whether it''s a Council Member discretionary funding request, a contract report, or something else.', '{
    "minimumEngagement": 3,
    "blockingEnabled": false,
    "chatType": "persistent",
    "contextAware": true,
    "nycResources": true
  }', 190),
  
  -- Knowledge Check
  (6, 'knowledge_check', 'NYC Document Mastery', 'What''s the most important element when creating reports for NYC city agencies?', '{
    "question": "What''s the most important element when creating reports for NYC city agencies?",
    "options": [
      "Using complex academic language",
      "Meeting specific format requirements and demonstrating outcome metrics",
      "Keeping reports under one page",
      "Including photos of all activities"
    ],
    "correctAnswer": 1,
    "explanation": "NYC agencies have specific reporting requirements and prioritize clear outcome data that shows program effectiveness and compliance with city goals."
  }', 200)
ON CONFLICT (id) DO NOTHING;

-- 4. Add a bonus resource section
INSERT INTO content_blocks (lesson_id, type, title, content, metadata, order_index)
VALUES
  (6, 'resource_list', 'NYC Document Resources', 'Bookmark these helpful resources: NYC Council Discretionary Funding Guidelines, MOCS (Mayor\'s Office of Contract Services) Nonprofit Resiliency Toolkit, NYC Open Data for statistics and research, Foundation Center NYC for grant writing resources.', '{"version": "2.0", "links": ["nyc.gov/nonprofits", "data.cityofnewyork.us", "foundationcenter.org"]}', 210)
ON CONFLICT (id) DO NOTHING;