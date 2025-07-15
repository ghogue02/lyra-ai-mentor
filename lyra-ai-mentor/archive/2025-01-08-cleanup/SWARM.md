# SWARM EXECUTION MANUAL
## Definitive Guide for 100% Reliable Task Completion

### VERSION: 2025-07-07
### PURPOSE: Operational playbook for Claude to ensure consistent, verifiable swarm execution

---

## 🎯 QUICK REFERENCE

### **EXECUTION HIERARCHY (Always follow this order)**
1. **TodoWrite** - Plan and track ALL multi-step tasks
2. **Task tool** - Parallel agent coordination for complex work
3. **Native tools** - Real file system operations (Bash, Grep, Read, Edit)
4. **Verification** - Confirm completion with concrete results

### **NEVER USE (Simulation only)**
- `mcp__ruv-swarm__*` tools (return placeholders)
- Any MCP swarm tools for production tasks

### **CRITICAL SUCCESS PATTERN**
```
TodoWrite → Task(parallel agents) → Native tools → Verify → TodoWrite(complete)
```

---

## 📋 TASK CLASSIFICATION & EXECUTION PATTERNS

### **SIMPLE TASKS (1-3 operations)**
**Definition**: Single file edits, basic searches, simple analysis
**Pattern**: Direct tool use, no swarm needed
```
Read → Edit → Verify
OR
Grep → Read → Edit
```
**Example**: Remove single UI element, fix typo, update configuration

### **MEDIUM TASKS (4-10 operations)**
**Definition**: Multi-file changes, feature modifications, component updates
**Pattern**: TodoWrite + selective Task tool use
```
TodoWrite(plan) → Task(research) → Native tools(implement) → TodoWrite(complete)
```
**Example**: Remove UI elements across multiple files, update related components

### **COMPLEX TASKS (10+ operations)**
**Definition**: Feature implementation, system refactoring, multi-phase projects
**Pattern**: Full swarm orchestration with phases
```
TodoWrite(phases) → Task(research) → Task(implement) → Task(test) → Verify → TodoWrite(complete)
```
**Example**: Implement new feature with tests, documentation, and integration

---

## 🚀 EXECUTION PATTERNS BY TASK TYPE

### **1. CODE SEARCH & ANALYSIS**
**When**: Finding patterns, understanding codebase, locating issues
**Tools**: `Bash`, `Grep`, `Task`
**Pattern**:
```javascript
// Phase 1: Broad search
const searchTask = Task("Code Scanner", `
Search entire codebase for: [PATTERN]
Use: find + rg for comprehensive results
Return: file paths, line numbers, context
Priority: Speed and completeness
`);

// Phase 2: Detailed analysis
const analysisTask = Task("Code Analyzer", `
Read and analyze files from search results
Identify: relationships, dependencies, patterns
Return: structured analysis with recommendations
`);
```
**Verification**: Confirm file paths are valid, line numbers are accurate

### **2. FILE MODIFICATIONS**
**When**: Editing code, removing features, updating configurations
**Tools**: `Read`, `Edit`, `MultiEdit`, `Task`
**Pattern**:
```javascript
TodoWrite([
  {id: "read_files", content: "Read all target files to understand structure"},
  {id: "plan_changes", content: "Plan modification strategy"},
  {id: "implement_changes", content: "Execute edits with verification"},
  {id: "test_changes", content: "Verify compilation and functionality"}
]);

// Execute with Task coordination
const modificationTask = Task("File Modifier", `
1. Read target files: [FILE_LIST]
2. Plan changes to avoid conflicts
3. Use Edit/MultiEdit for modifications
4. Verify each change compiles
5. Return summary of all changes made
`);
```
**Verification**: `npm run build`, `npm run typecheck`

### **3. FEATURE IMPLEMENTATION**
**When**: Adding new functionality, creating components, building systems
**Tools**: `Task`, `Write`, `Edit`, `Bash`
**Pattern**:
```javascript
TodoWrite([
  {id: "research", content: "Research existing patterns and dependencies"},
  {id: "design", content: "Design component architecture and interfaces"},
  {id: "implement", content: "Build core functionality"},
  {id: "integrate", content: "Integrate with existing system"},
  {id: "test", content: "Create and run tests"},
  {id: "document", content: "Add documentation and examples"}
]);

// Phase 1: Research
const researchTask = Task("Feature Researcher", `
Research existing codebase for similar patterns
Identify: dependencies, conventions, integration points
Analyze: [SIMILAR_COMPONENTS] for consistency
Return: architecture recommendations and dependency list
`);

// Phase 2: Implementation
const implementTask = Task("Feature Developer", `
Build feature following established patterns
Create: component files, types, tests
Follow: coding standards from research phase
Integrate: with existing systems
Return: file list and integration summary
`);
```
**Verification**: Build passes, tests pass, integration works

### **4. TEST-DRIVEN DEVELOPMENT (TDD)**
**When**: Building with test-first approach
**Tools**: `Task`, `Write`, `Bash`
**Pattern**:
```javascript
TodoWrite([
  {id: "write_failing_tests", content: "Write comprehensive tests that fail"},
  {id: "implement_minimal", content: "Implement minimal code to pass tests"},
  {id: "refactor", content: "Refactor while keeping tests green"},
  {id: "add_edge_cases", content: "Add edge case tests and handle them"}
]);

const tddTask = Task("TDD Developer", `
1. Write failing tests for: [FEATURE_SPECS]
2. Run tests to confirm they fail
3. Implement minimal code to pass
4. Refactor for quality
5. Add edge cases and error handling
Testing framework: [JEST/VITEST/etc]
Return: test coverage and implementation summary
`);
```
**Verification**: All tests pass, coverage targets met

### **5. BEHAVIOR-DRIVEN DEVELOPMENT (BDD)**
**When**: Building features with stakeholder scenarios
**Tools**: `Task`, `Write`, `Read`
**Pattern**:
```javascript
TodoWrite([
  {id: "write_scenarios", content: "Write Given-When-Then scenarios"},
  {id: "implement_steps", content: "Implement step definitions"},
  {id: "build_feature", content: "Build feature to satisfy scenarios"},
  {id: "validate_behavior", content: "Verify all scenarios pass"}
]);

const bddTask = Task("BDD Developer", `
1. Convert requirements to Given-When-Then scenarios
2. Implement step definitions using [TESTING_FRAMEWORK]
3. Build feature to satisfy all scenarios
4. Validate user experience matches expectations
Scenarios to implement: [SCENARIO_LIST]
Return: scenario coverage and user journey validation
`);
```
**Verification**: All scenarios pass, user journeys work end-to-end

### **6. DATABASE OPERATIONS**
**When**: Updating schemas, modifying data, migrations
**Tools**: `Task`, `Bash`, `Read`
**Pattern**:
```javascript
TodoWrite([
  {id: "backup_data", content: "Create backup before changes"},
  {id: "plan_migration", content: "Plan migration strategy"},
  {id: "test_locally", content: "Test migration on local copy"},
  {id: "execute_migration", content: "Execute on target database"},
  {id: "verify_integrity", content: "Verify data integrity post-migration"}
]);

const dbTask = Task("Database Administrator", `
1. Analyze current schema: [DATABASE_URL/FILE]
2. Plan migration strategy for: [CHANGES]
3. Create backup procedures
4. Write migration scripts with rollback
5. Test on development copy
6. Validate data integrity
Return: migration plan and verification results
`);
```
**Verification**: Data integrity checks pass, rollback tested

### **7. SYSTEM INTEGRATION**
**When**: Connecting components, API integration, service coordination
**Tools**: `Task`, `Read`, `Edit`, `Bash`
**Pattern**:
```javascript
TodoWrite([
  {id: "map_interfaces", content: "Map all integration points"},
  {id: "design_contracts", content: "Design interface contracts"},
  {id: "implement_adapters", content: "Build integration adapters"},
  {id: "test_integration", content: "Test end-to-end integration"},
  {id: "monitor_performance", content: "Monitor integration performance"}
]);

const integrationTask = Task("Integration Engineer", `
1. Map existing integration points in: [SYSTEM_COMPONENTS]
2. Design interface contracts for: [NEW_INTEGRATIONS]
3. Implement adapters and middleware
4. Create integration tests
5. Set up monitoring and error handling
Return: integration map and test results
`);
```
**Verification**: Integration tests pass, error handling works

### **8. DEBUGGING & ISSUE RESOLUTION**
**When**: Fixing bugs, resolving errors, performance issues
**Tools**: `Task`, `Bash`, `Read`, `Grep`
**Pattern**:
```javascript
TodoWrite([
  {id: "reproduce_issue", content: "Reproduce issue consistently"},
  {id: "isolate_cause", content: "Isolate root cause through analysis"},
  {id: "design_fix", content: "Design fix strategy"},
  {id: "implement_fix", content: "Implement and test fix"},
  {id: "prevent_regression", content: "Add tests to prevent regression"}
]);

const debugTask = Task("Debug Engineer", `
1. Reproduce issue: [ISSUE_DESCRIPTION]
2. Analyze error logs and stack traces
3. Use debugging tools: [BROWSER_DEVTOOLS/NODE_DEBUGGER]
4. Isolate root cause
5. Design minimal fix
6. Add regression tests
Return: root cause analysis and fix verification
`);
```
**Verification**: Issue resolved, regression tests added

---

## ⚡ PARALLEL EXECUTION PATTERNS

### **RESEARCH COORDINATION**
```javascript
// Launch multiple research streams simultaneously
const researchTasks = [
  Task("API Research", "Analyze external API documentation and examples"),
  Task("Pattern Research", "Find similar implementations in codebase"),
  Task("Dependency Research", "Research required packages and versions"),
  Task("Performance Research", "Analyze performance implications")
];
```

### **IMPLEMENTATION COORDINATION**
```javascript
// Coordinate parallel development streams
const implementTasks = [
  Task("Frontend Dev", "Build React components and interfaces"),
  Task("Backend Dev", "Implement API endpoints and business logic"),
  Task("Database Dev", "Create schema changes and migrations"),
  Task("Test Dev", "Create comprehensive test suites")
];
```

### **VALIDATION COORDINATION**
```javascript
// Parallel testing and validation
const validationTasks = [
  Task("Unit Tester", "Run and validate unit tests"),
  Task("Integration Tester", "Run integration test suites"),
  Task("Performance Tester", "Run performance benchmarks"),
  Task("Security Tester", "Run security and vulnerability scans")
];
```

---

## 🔧 TOOL SELECTION MATRIX

### **File Operations**
| Operation | Tool | When to Use |
|-----------|------|-------------|
| Read single file | `Read` | Known file path, < 2000 lines |
| Read large file | `Read` with offset/limit | Known file path, > 2000 lines |
| Search files | `Grep` | Pattern search, content matching |
| Find files | `Bash` with find | File name patterns, directory search |
| Edit single file | `Edit` | One change, simple replacement |
| Edit multiple changes | `MultiEdit` | Multiple changes, same file |
| Create new file | `Write` | New file creation |

### **Search Operations**
| Search Type | Tool | Pattern |
|-------------|------|---------|
| Content search | `Grep` | `Grep(pattern="regex", include="*.tsx")` |
| File name search | `Bash` | `find . -name "pattern" -type f` |
| Combined search | `Task` | Coordinate multiple search strategies |
| Deep analysis | `Task` + `Read` | Search → Read → Analyze |

### **Coordination Operations**
| Complexity | Tool | Pattern |
|------------|------|---------|
| Single task | Direct tool | `Read` → `Edit` → verify |
| 2-3 parallel | `Task` calls | Multiple Task() in same message |
| Complex flow | `TodoWrite` + `Task` | Plan → Execute → Track |

---

## 📊 VERIFICATION PROTOCOLS

### **BUILD VERIFICATION**
```bash
# Standard verification sequence
npm run typecheck  # TypeScript compilation
npm run lint       # Code quality
npm run build      # Production build
npm run test       # Test suite
```

### **FUNCTIONAL VERIFICATION**
```javascript
// Verify specific functionality works
const verifyTask = Task("Function Verifier", `
1. Test modified functionality: [FEATURE_LIST]
2. Verify integration points work
3. Check error handling
4. Validate user experience
5. Confirm no regressions
Return: verification results with specific test cases
`);
```

### **DATA VERIFICATION**
```javascript
// For database and data operations
const dataVerifyTask = Task("Data Verifier", `
1. Check data integrity constraints
2. Verify migration completeness
3. Test rollback procedures
4. Validate performance impact
5. Confirm backup procedures
Return: data integrity report
`);
```

---

## 🚨 ERROR HANDLING & RECOVERY

### **COMMON ERROR PATTERNS**

#### **Build Failures**
**Symptoms**: TypeScript errors, import failures, syntax errors
**Recovery Pattern**:
```javascript
TodoWrite([
  {id: "identify_errors", content: "Run typecheck and identify all errors"},
  {id: "categorize_errors", content: "Group errors by type and severity"},
  {id: "fix_systematically", content: "Fix errors in dependency order"},
  {id: "verify_fixes", content: "Verify each fix doesn't create new errors"}
]);
```

#### **Integration Failures**
**Symptoms**: Components don't work together, API failures, data inconsistencies
**Recovery Pattern**:
```javascript
const troubleshootTask = Task("Integration Troubleshooter", `
1. Isolate integration point: [FAILING_INTEGRATION]
2. Test each component independently
3. Identify interface mismatches
4. Design compatibility layer if needed
5. Test integration incrementally
Return: integration fix plan with test results
`);
```

#### **Performance Issues**
**Symptoms**: Slow builds, runtime performance, memory issues
**Recovery Pattern**:
```javascript
const performanceTask = Task("Performance Analyst", `
1. Profile current performance: [PERFORMANCE_METRICS]
2. Identify bottlenecks using tools: [PROFILING_TOOLS]
3. Analyze bundle size and dependencies
4. Recommend optimization strategies
5. Implement highest-impact optimizations
Return: performance improvement plan and results
`);
```

### **RECOVERY STRATEGIES**

#### **Rollback Protocol**
```javascript
TodoWrite([
  {id: "assess_damage", content: "Assess scope of issues from changes"},
  {id: "identify_rollback", content: "Identify what needs to be rolled back"},
  {id: "execute_rollback", content: "Execute rollback systematically"},
  {id: "verify_stability", content: "Verify system stability post-rollback"},
  {id: "plan_retry", content: "Plan improved approach for retry"}
]);
```

#### **Incremental Recovery**
```javascript
const recoveryTask = Task("Incremental Fixer", `
1. Break down failed changes into smallest units
2. Test each unit independently
3. Identify which units work and which fail
4. Fix failing units one at a time
5. Rebuild incrementally with verification
Return: recovery progress and remaining issues
`);
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### **TASK PARALLELIZATION**
- **Always** launch independent tasks in same message
- **Coordinate** dependent tasks with TodoWrite
- **Batch** similar operations (multiple file reads)
- **Sequence** operations that depend on each other

### **TOOL EFFICIENCY**
```javascript
// ✅ Efficient: Batch operations
const files = ["file1.tsx", "file2.tsx", "file3.tsx"];
const batchTask = Task("Batch Reader", `
Read and analyze these files in batch: ${files.join(", ")}
Return: combined analysis with file-specific findings
`);

// ❌ Inefficient: Sequential operations
// Read file1, then Read file2, then Read file3...
```

### **RESOURCE MANAGEMENT**
- **Limit** Task calls to 3-5 per message for optimal performance
- **Combine** related operations in single Task
- **Reuse** analysis results across operations
- **Cache** expensive operations when possible

---

## 📝 TEMPLATE LIBRARY

### **STANDARD SWARM DEPLOYMENT**
```javascript
// Template for most common swarm operations
TodoWrite([
  {id: "research_phase", content: "Research existing patterns and requirements", status: "in_progress", priority: "high"},
  {id: "implementation_phase", content: "Implement solution following research", status: "pending", priority: "high"},
  {id: "testing_phase", content: "Test implementation thoroughly", status: "pending", priority: "medium"},
  {id: "integration_phase", content: "Integrate with existing system", status: "pending", priority: "medium"},
  {id: "verification_phase", content: "Verify complete functionality", status: "pending", priority: "low"}
]);

// Research Phase
const researchTask = Task("Research Coordinator", `
Research: [SPECIFIC_REQUIREMENTS]
Analyze: existing codebase patterns
Identify: dependencies and integration points
Plan: implementation strategy
Return: comprehensive research report with recommendations
`);
```

### **FEATURE DEVELOPMENT TEMPLATE**
```javascript
TodoWrite([
  {id: "analyze_requirements", content: "Analyze feature requirements and acceptance criteria"},
  {id: "design_architecture", content: "Design component architecture and data flow"},
  {id: "create_tests", content: "Create comprehensive test suite (TDD)"},
  {id: "implement_feature", content: "Implement feature following design"},
  {id: "integrate_system", content: "Integrate feature with existing system"},
  {id: "optimize_performance", content: "Optimize performance and bundle size"},
  {id: "document_feature", content: "Create documentation and examples"}
]);

// Parallel development streams
const developmentTasks = [
  Task("Frontend Developer", "Build React components and user interface"),
  Task("Backend Developer", "Implement API endpoints and business logic"),
  Task("Test Engineer", "Create comprehensive test coverage"),
  Task("Integration Engineer", "Handle system integration and compatibility")
];
```

### **BUG FIX TEMPLATE**
```javascript
TodoWrite([
  {id: "reproduce_bug", content: "Reproduce bug consistently in development"},
  {id: "isolate_cause", content: "Isolate root cause through debugging"},
  {id: "design_fix", content: "Design minimal fix with maximum safety"},
  {id: "implement_fix", content: "Implement fix with error handling"},
  {id: "test_fix", content: "Test fix thoroughly including edge cases"},
  {id: "add_regression_tests", content: "Add tests to prevent regression"},
  {id: "verify_no_side_effects", content: "Verify fix doesn't break other functionality"}
]);

const bugFixTask = Task("Bug Investigator", `
1. Reproduce issue: [BUG_DESCRIPTION]
2. Gather debugging information
3. Trace execution flow to identify root cause
4. Design minimal fix strategy
5. Consider potential side effects
Return: root cause analysis and fix plan
`);
```

### **DATABASE UPDATE TEMPLATE**
```javascript
TodoWrite([
  {id: "backup_current_state", content: "Create complete backup of current database state"},
  {id: "plan_migration", content: "Plan migration strategy with rollback procedures"},
  {id: "test_migration_local", content: "Test migration on local development copy"},
  {id: "validate_data_integrity", content: "Validate data integrity pre and post migration"},
  {id: "execute_migration", content: "Execute migration with monitoring"},
  {id: "verify_application_compatibility", content: "Verify application works with new schema"},
  {id: "monitor_performance", content: "Monitor performance impact post-migration"}
]);

const dbMigrationTask = Task("Database Migration Specialist", `
1. Analyze current schema: [DATABASE_DETAILS]
2. Plan migration for: [SCHEMA_CHANGES]
3. Create rollback procedures
4. Test on development database
5. Create validation scripts
6. Plan execution timeline
Return: migration plan with safety procedures
`);
```

---

## 🎯 SUCCESS METRICS & KPIs

### **COMPLETION CRITERIA**
- **All TodoWrite items** marked as completed
- **Build passes** (typecheck, lint, build, test)
- **Functionality verified** with concrete tests
- **Integration confirmed** with existing system
- **Documentation updated** where applicable

### **QUALITY METRICS**
- **Zero regressions** in existing functionality
- **Test coverage maintained** or improved
- **Performance impact** within acceptable limits
- **Code quality** meets or exceeds existing standards
- **Security considerations** addressed

### **VERIFICATION CHECKLIST**
```javascript
const verificationTask = Task("Quality Assurance Verifier", `
Complete final verification:
□ All TodoWrite items completed
□ TypeScript compilation clean
□ All tests passing
□ Build successful
□ No console errors
□ Integration points working
□ Performance acceptable
□ Documentation updated
□ Security reviewed
Return: complete verification report with pass/fail for each item
`);
```

---

## 🔄 CONTINUOUS IMPROVEMENT

### **POST-EXECUTION ANALYSIS**
After each swarm deployment, analyze:
- **Efficiency**: Were there unnecessary steps?
- **Accuracy**: Did results match expectations?
- **Reliability**: Were there any failures or errors?
- **Speed**: Could parallelization be improved?

### **PATTERN REFINEMENT**
Update this document based on:
- **Recurring issues** and their solutions
- **Successful patterns** that should be standardized
- **New tool capabilities** and optimizations
- **Performance improvements** discovered

---

## 📞 EMERGENCY PROCEDURES

### **CRITICAL FAILURE RESPONSE**
1. **STOP** all current operations
2. **ASSESS** damage and scope
3. **ROLLBACK** to last known good state
4. **ANALYZE** failure cause
5. **PLAN** recovery strategy
6. **EXECUTE** recovery with verification
7. **DOCUMENT** lessons learned

### **SYSTEM RECOVERY**
```javascript
const emergencyRecovery = Task("Emergency Recovery Specialist", `
CRITICAL SYSTEM RECOVERY:
1. Assess current system state
2. Identify safe rollback point
3. Execute rollback procedures
4. Verify system stability
5. Plan incident post-mortem
6. Implement prevention measures
Return: recovery status and prevention plan
`);
```

---

## 🏁 EXECUTION CHECKLIST

### **PRE-EXECUTION**
- [ ] Task clearly defined and scoped
- [ ] Complexity level identified
- [ ] Appropriate pattern selected
- [ ] TodoWrite plan created (if needed)
- [ ] Success criteria established

### **DURING EXECUTION**
- [ ] Using native tools for real operations
- [ ] Avoiding MCP swarm simulation tools
- [ ] Parallel tasks launched simultaneously
- [ ] Progress tracked in TodoWrite
- [ ] Intermediate verification performed

### **POST-EXECUTION**
- [ ] All TodoWrite items completed
- [ ] Build verification passed
- [ ] Functionality verified
- [ ] Integration confirmed
- [ ] Documentation updated
- [ ] Success metrics achieved

---

## 📖 QUICK DECISION TREE

```
Task Request Received
├── Simple (1-3 ops)?
│   ├── YES → Direct tool use → Verify → Done
│   └── NO ↓
├── Medium (4-10 ops)?
│   ├── YES → TodoWrite(plan) → Task(selective) → Native tools → Verify → Done
│   └── NO ↓
└── Complex (10+ ops)?
    └── YES → TodoWrite(phases) → Task(research) → Task(implement) → Task(test) → Verify → Done
```

**Remember**: This document is your execution playbook. Follow it precisely for 100% reliable swarm deployment and task completion.