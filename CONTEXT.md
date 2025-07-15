# AI Learning Hub - Claude Code Context

**IMPORTANT: Update this context file every time with new information and edit or remove outdated information.**

## 🎯 Project Overview
AI Learning Hub is an educational platform empowering non-profits with AI tools. Target audience: Non-profit workers with low-to-average AI knowledge. The system uses a database-driven content model with no chapter-specific React components, enabling rapid content scaling.

## 📝 CRITICAL: Session Logging Protocol
**FIRST ACTION EVERY SESSION**: Create a session log file before any other actions.

```bash
# Session log format: /claude-sessions/YYYY-MM/DD/session-HH-MM-SS.md
# Example: /claude-sessions/2025-07/03/session-16-30-00.md
```

Each session log must include:
- Session start time and context
- Initial state assessment
- All actions taken with outcomes
- Tests run and results
- Guidelines updated
- Files created/modified/archived
- Session end summary

## 🤖 Agent Management System

### Agent Usage Protocol
1. **Assess Task**: Determine if existing agent fits the need
2. **Create if Needed**: If no suitable agent exists, create a specific one
3. **Optimize Continuously**: If an agent underperforms, create improved version
4. **Archive Old Versions**: Move outdated agents to `/archive/agents/YYYY-MM-DD/`

### Agent Creation Template
```typescript
// Agent Name: [Specific Purpose Agent]
// Created: [Date]
// Purpose: [Specific task description]
// Optimization Notes: [What this improves over previous versions]
```

### Available Core Agents
- Use `./claude-flow agent list` to see current agents
- Prefer creating specific agents over using generic ones
- Document each new agent in `/agents/AGENT_INDEX.md`

## 📋 Guidelines & Recursive System

### Active Guidelines
1. **Tone & Style**: `/documentation/guides/tone-style-guide.md`
2. **Structure**: `/documentation/guides/structure-guide.md`
3. **Interactive Elements**: `/documentation/interactive-elements/`
   - **Engagement Excellence**: `/documentation/interactive-elements/engagement-excellence-guidelines.md` ✨NEW
   - **Improvement System**: `/documentation/guides/interactive-element-improvement-system.md` ✨NEW
   - **Storyline Evolution**: `/documentation/interactive-elements/storyline-evolution-guidelines.md` ✨NEW
4. **User Experience**: `/documentation/guides/ux-guide.md`
5. **Gamification**: `/documentation/interactive-elements/gamification-guidelines.md`
6. **Testing Standards**: `/documentation/guides/testing-standards.md`
7. **MCP Database Connection**: `/documentation/guides/mcp-database-connection-guide.md` ✨NEW
8. **Component Loading**: `/documentation/guides/component-loading-guide.md` ✨NEW

### Recursive Update Protocol
When ANY guideline changes:
1. Update the master guideline file
2. Run consistency checker: `./claude-flow sparc run analyzer "Check all files for guideline compliance"`
3. Auto-update non-compliant files
4. Document changes in session log
5. Create audit report in `/audits/guideline-compliance-YYYY-MM-DD.json`

## 🧪 Testing Requirements

### Mandatory Tests After Changes
```bash
# 0. Database content sync (CRITICAL for content work)
npm run test:run tests/database-content-sync.test.ts

# 1. Type checking
npm run typecheck

# 2. Linting
npm run lint

# 3. Build test
npm run build

# 4. Component tests with Vitest
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:coverage  # With coverage

# 5. Guideline compliance
./claude-flow sparc run tester "Verify guideline compliance for changed files"
```

### Testing Infrastructure
- **Test Runner**: Vitest (configured with React Testing Library)
- **Config**: `/vitest.config.ts`
- **Setup**: `/src/test/setup.ts`

### TDD/BDD Workflow
1. Write test first (use `/src/components/interactive/__tests__/` as reference)
2. Implement feature
3. Verify test passes
4. Check guideline compliance
5. Update documentation

## 🗄️ Archive Management

### Archive Structure
```
/archive/
  /YYYY-MM-DD/
    /components/     # Archived React components
    /scripts/        # Old scripts
    /agents/         # Outdated agents
    /docs/           # Superseded documentation
    /manifest.json   # What was archived and why
```

### Archive Protocol
1. Create dated folder: `/archive/YYYY-MM-DD/category/`
2. Move files with clear naming: `original-name.archived.ext`
3. Update manifest with reason for archival
4. Update any references in active code

## 🚫 Critical Files - DO NOT MODIFY WITHOUT PERMISSION
1. `/supabase/config.toml` - Database configuration
2. `/.env*` files - Environment variables (NEVER commit passwords)
3. `/src/integrations/supabase/client.ts` - Database client
4. Production migrations in `/supabase/migrations/`

## 🔐 Database Connection
- **MCP Server**: Supabase MCP server configured and ready
- **Tools Available**: `mcp_supabase` tools for database operations
- **Credentials**: Stored securely in `.env.local` (NEVER commit this file)
- **Project ID**: hfkzwjnlxrwynactcmpe (safe to reference)
- Test connection before content updates: Use MCP tools to verify access

## 🎯 Current Development Focus

### Primary Objectives
1. **System Architecture**: Building robust, scalable architecture
2. **Testing Infrastructure**: TDD/BDD implementation
3. **Guidelines System**: Comprehensive guidelines with automatic enforcement
4. **Chapter 2 Development**: AI in Fundraising content
5. **Performance Optimization**: Address chunk size warnings

### Active Tasks
- ✅ Fixed build chunk size warnings (reduced to 701KB)
- ✅ Added time metrics to Chapter 2 elements (100% coverage)
- ✅ Verified Chapter 2 is all Maya's journey (no James)
- ✅ Set up Vitest test runner with database sync tests
- ✅ Fixed critical React hooks violations
- ✅ Fixed character consistency in Chapters 4-6 (removed all cross-character references)
- ✅ Implemented variety in element phase lengths (6 elements updated in Chapter 2)
- ✅ Set up automatic guideline compliance checking (script created and run)
- ✅ Implemented time metrics across all chapters (28 elements updated)
  - Chapter 2: 100% coverage (9/9 elements)
  - Chapter 3: 84.6% coverage (11/13 elements)
  - Chapter 4: 61.5% coverage (8/13 elements)
  - Chapter 5: 61.5% coverage (8/13 elements)
  - Chapter 6: 7.7% coverage (1/13 elements - intentionally low due to strategic content)
- ✅ Implemented progressive phase variety across chapters 3-6 (8 elements updated)
  - Chapter 3 (Sofia): 2-phase + 4-phase narrative-driven elements
  - Chapter 4 (David): 2-phase + 4-phase analytical elements  
  - Chapter 5 (Rachel): 2-phase + 5-phase systematic elements
  - Chapter 6 (Alex): 2-phase + 5-phase transformational elements
- ✅ Fixed critical interactive element loading errors (multiple issues resolved)
  - Database query column name mismatch (element_id vs interactive_element_id)
  - Object-to-string conversion issues in component rendering
  - Enhanced error handling and type safety throughout
- ✅ Implemented Structure Guide automated compliance checking
  - Deep analysis across 4 categories: Content Structure, Navigation Flow, Lesson Progression, Chapter Consistency
  - Baseline score: 6% overall (establishes improvement target)
  - Integrated into main compliance checking system
- ✅ Resolved Critical Performance Issues (Console Log Analysis) - COMPLETE ✅
  - Fixed infinite re-render loops in useLessonData (user?.id instead of user object)
  - Optimized StoryContentRenderer with proper useCallback and IntersectionObserver cleanup
  - Enhanced component loader type safety to prevent object-to-primitive errors
  - Added comprehensive caching to prevent icon URL spam (95% reduction in requests)
  - **FINAL FIX**: Resolved object-to-primitive errors in ALL components (COMPLETE ✅)
    - Root cause: React's internal lazy loading error handling tries to convert objects to strings
    - Initially found with Maya's components, expanded to all character components, then found additional lazy-loaded components
    - Solution: Direct imports for 35 total components (bypassing React.lazy entirely)
      - 23 character-specific components (Maya, Sofia, David, Rachel, Alex)
      - 5 core renderer components (CalloutBox, LyraChat, KnowledgeCheck, Reflection, SequenceSorter)
      - 7 AI/testing components (DifficultConversationHelper, AIContentGenerator, etc.)
    - Fixed React.lazy usage in InteractiveElementRenderer.tsx
    - Created comprehensive debugging tools and logging system
    - All components now load without errors - verified in production
  - Created comprehensive debugging, integration tests, and verification scripts
  - **ALL** performance and loading issues completely resolved
- ✅ Rectified Chapters 3-6 Interactive Elements
  - Tested all 16 character-specific components - all now use direct imports
  - Object-to-primitive errors affected all character components, not just Maya's
  - Activated 20 inactive elements (lyra_chat and difficult_conversation_helper)
  - Verified character consistency and proper component mappings
  - All 72 interactive elements across chapters 3-6 now fully functional
  - Preventive fix applied: all 23 character components use direct imports

## 🔄 Recursive Improvement Workflow

1. **Change Detection**: Monitor for any code/content changes
2. **Guideline Check**: Verify compliance with all active guidelines
3. **Auto-Update**: Fix non-compliant code automatically
4. **Test Suite**: Run all applicable tests
5. **Documentation**: Update relevant docs
6. **Audit Trail**: Log all changes in session file

## 🎭 Creative Authority

### Storyline Evolution Rights
Claude Code may suggest storyline changes to enhance interactive elements:
- **Update**: Modify narratives for better engagement
- **Remove**: Eliminate stories that don't support learning
- **Add**: Create new scenarios for innovative elements

### Approval Process
1. Thoroughly vet changes with testing and metrics
2. Document quantitative & qualitative reasoning
3. Present concise proposal for user approval
4. Never implement major story changes without permission

## 🛣️ Route Structure (CRITICAL)
**Application Navigation Routes:**
- Chapter/Lesson: `/chapter/:chapterId/lesson/:lessonId`
- Example: `/chapter/2/lesson/5` (NOT `/lesson/2/5`)
- Dashboard: `/dashboard`
- Profile: `/profile`
- Auth: `/auth`

**Testing URLs:**
- Chapter 2, Lesson 5: `http://localhost:8080/chapter/2/lesson/5`
- Always use correct route structure in documentation and testing

## 🛠️ Maintenance Tasks

### Daily Cleanup Checklist
- Archive files older than 30 days in `/scripts/archive/`
- Remove unused imports from components
- Check for duplicate code patterns
- Verify all interactive elements are registered
- Update agent efficiency metrics

### Weekly Optimization
- Review agent performance and create optimized versions
- Consolidate similar components
- Update guideline compliance reports
- Clean up test files
- Archive completed development artifacts

## 📊 Key Metrics to Track
- Build size (target: <500KB per chunk)
- Test coverage (target: >80%)
- Guideline compliance (target: 100%)
- Agent efficiency (execution time, accuracy)
- User engagement rates

## 🚀 Quick Commands Reference
```bash
# Start new feature with TDD
./claude-flow sparc tdd "Feature description"

# Check guideline compliance
./claude-flow sparc run analyzer "Check guideline compliance"

# Create new agent
./claude-flow agent spawn [type] --name "Specific Purpose Agent"

# Run full test suite
npm run test && npm run lint && npm run typecheck

# Archive old files
./claude-flow sparc run maintenance "Archive files older than 30 days"
```

## 🔍 File Organization Test
To verify proper file organization, run:
```bash
# Check for files that should be archived
find . -name "*.archived.*" -o -name "*old*" -o -name "*deprecated*" | grep -v archive/

# Verify no test files in production
find ./src -name "*.test.*" -o -name "*.spec.*" | grep -v __tests__
```

---

**Remember**: This context file is your source of truth. Update it with every significant change, discovery, or decision. Always check this file at the start of each session and update it before ending.

## 📌 Session Continuity
- **Handoff Document**: Check `/SESSION_HANDOFF.md` for detailed pickup instructions
- **Session Logs**: All in `/claude-sessions/YYYY-MM/DD/`
- **Latest Audit**: `/audits/compliance-summary-2025-07-03.md` (Structure Guide analysis included)

## 🎭 Character Assignments (CRITICAL)
Each chapter follows ONE character's complete journey:
- **Chapter 1**: Introduction (Multiple characters)
- **Chapter 2**: Maya Rodriguez - AI in Fundraising ✅
- **Chapter 3**: Sofia Martinez - Communication & Storytelling ✅
- **Chapter 4**: David Kim - Data & Decision Making ✅
- **Chapter 5**: Rachel Thompson - Automation & Efficiency ✅
- **Chapter 6**: Alex Rivera - Organizational Transformation ✅

**Status**: All chapters now follow single character journeys (fixed 2025-07-03)