<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nonprofit AI Tools - Learning Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .header p {
            font-size: 1.2em;
            opacity: 0.95;
        }

        .tools-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .tool-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            cursor: pointer;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .tool-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }

        .tool-card h3 {
            color: #764ba2;
            margin-bottom: 10px;
            font-size: 1.3em;
        }

        .tool-card .lesson-tag {
            display: inline-block;
            background: #f0f0f0;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-bottom: 10px;
            color: #666;
        }

        .tool-card p {
            color: #555;
            line-height: 1.6;
            margin-bottom: 15px;
        }

        .tool-card .cta {
            color: #667eea;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .main-tool {
            display: none;
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .main-tool.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .tool-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
        }

        .tool-header h2 {
            color: #333;
            font-size: 1.8em;
        }

        .back-btn {
            background: #f0f0f0;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        }

        .back-btn:hover {
            background: #e0e0e0;
        }

        .form-section {
            margin-bottom: 25px;
        }

        .form-section h3 {
            color: #555;
            margin-bottom: 15px;
            font-size: 1.2em;
        }

        input, textarea, select {
            width: 100%;
            padding: 12px;
            border: 2px solid #e0e0e0;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s;
            font-family: inherit;
        }

        input:focus, textarea:focus, select:focus {
            outline: none;
            border-color: #667eea;
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        .input-group {
            margin-bottom: 15px;
        }

        .input-group label {
            display: block;
            margin-bottom: 5px;
            color: #666;
            font-size: 14px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.3s;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #f0f0f0;
            color: #333;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            margin-right: 10px;
            transition: background 0.3s;
        }

        .btn-secondary:hover {
            background: #e0e0e0;
        }

        .criteria-item, .option-item, .task-item {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
            align-items: center;
        }

        .criteria-item input, .option-item input {
            flex: 1;
        }

        .remove-btn {
            background: #ff4444;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }

        .output-section {
            margin-top: 30px;
            padding: 25px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 2px solid #e0e0e0;
        }

        .output-section h3 {
            color: #333;
            margin-bottom: 20px;
        }

        .output-content {
            white-space: pre-wrap;
            line-height: 1.6;
            color: #444;
        }

        .loading {
            text-align: center;
            padding: 20px;
            color: #667eea;
        }

        .loading::after {
            content: '...';
            animation: dots 1.5s infinite;
        }

        @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
        }

        .matrix-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .matrix-table th, .matrix-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }

        .matrix-table th {
            background: #f0f0f0;
            font-weight: 600;
        }

        .matrix-table input[type="number"] {
            width: 60px;
            padding: 5px;
        }

        .progress-bar {
            background: #e0e0e0;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            transition: width 0.3s ease;
        }

        .team-member {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
        }

        .capacity-indicator {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }

        .capacity-good { background: #d4edda; color: #155724; }
        .capacity-warning { background: #fff3cd; color: #856404; }
        .capacity-danger { background: #f8d7da; color: #721c24; }

        .help-text {
            font-size: 12px;
            color: #888;
            margin-top: 5px;
            font-style: italic;
        }

        .download-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin-top: 15px;
            font-size: 14px;
            font-weight: 600;
        }

        .download-btn:hover {
            background: #218838;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 AI Tools for Nonprofits</h1>
            <p>Learn by building real tools you can use today</p>
        </div>

        <div id="toolsGrid" class="tools-grid">
            <div class="tool-card" onclick="showTool('decisionMatrix')">
                <span class="lesson-tag">Lesson 1</span>
                <h3>Decision Matrix</h3>
                <p>Evaluate program options with AI-powered scoring and recommendations</p>
                <div class="cta">Try it now →</div>
            </div>

            <div class="tool-card" onclick="showTool('projectCharter')">
                <span class="lesson-tag">Lesson 2</span>
                <h3>Project Charter Generator</h3>
                <p>Create professional project plans with AI assistance</p>
                <div class="cta">Try it now →</div>
            </div>

            <div class="tool-card" onclick="showTool('teamCapacity')">
                <span class="lesson-tag">Lesson 3</span>
                <h3>Team Capacity Calculator</h3>
                <p>Optimize staff assignments and prevent burnout</p>
                <div class="cta">Try it now →</div>
            </div>

            <div class="tool-card" onclick="showTool('reportGenerator')">
                <span class="lesson-tag">Lesson 4</span>
                <h3>Report Generator</h3>
                <p>Create stakeholder updates in seconds</p>
                <div class="cta">Try it now →</div>
            </div>

            <div class="tool-card" onclick="showTool('quickWins')">
                <span class="lesson-tag">Quick Start</span>
                <h3>AI Quick Wins Finder</h3>
                <p>Discover easy AI implementations for your organization</p>
                <div class="cta">Try it now →</div>
            </div>
        </div>

        <!-- Decision Matrix Tool -->
        <div id="decisionMatrix" class="main-tool">
            <div class="tool-header">
                <h2>📊 Strategic Decision Matrix</h2>
                <button class="back-btn" onclick="showHome()">← Back to Tools</button>
            </div>

            <div class="form-section">
                <h3>What decision are you making?</h3>
                <input type="text" id="decisionTitle" value="Which youth program should we expand for 2025-2026 school year?" placeholder="e.g., Which youth program should we expand next year?">
            </div>

            <div class="form-section">
                <h3>Options to Evaluate</h3>
                <div id="optionsList">
                    <div class="option-item">
                        <input type="text" value="After-school STEM tutoring program" placeholder="Option 1 (e.g., After-school tutoring)">
                    </div>
                    <div class="option-item">
                        <input type="text" value="Weekend arts and music workshops" placeholder="Option 2 (e.g., Summer camp program)">
                    </div>
                    <div class="option-item">
                        <input type="text" value="Summer leadership camp (2 weeks)" placeholder="Option 3">
                    </div>
                    <div class="option-item">
                        <input type="text" value="Year-round mentorship program" placeholder="Option 4">
                    </div>
                </div>
                <button class="btn-secondary" onclick="addOption()">+ Add Option</button>
            </div>

            <div class="form-section">
                <h3>Evaluation Criteria</h3>
                <div id="criteriaList">
                    <div class="criteria-item">
                        <input type="text" value="Community Need (survey data)" placeholder="Criteria (e.g., Community Need)">
                        <input type="number" value="5" placeholder="Weight (1-5)" min="1" max="5">
                    </div>
                    <div class="criteria-item">
                        <input type="text" value="Budget/Resource Requirements" placeholder="Criteria (e.g., Budget Required)">
                        <input type="number" value="4" placeholder="Weight (1-5)" min="1" max="5">
                    </div>
                    <div class="criteria-item">
                        <input type="text" value="Staff Expertise Available" placeholder="Criteria">
                        <input type="number" value="3" placeholder="Weight (1-5)" min="1" max="5">
                    </div>
                    <div class="criteria-item">
                        <input type="text" value="Potential for Grant Funding" placeholder="Criteria">
                        <input type="number" value="4" placeholder="Weight (1-5)" min="1" max="5">
                    </div>
                    <div class="criteria-item">
                        <input type="text" value="Measurable Impact Potential" placeholder="Criteria">
                        <input type="number" value="5" placeholder="Weight (1-5)" min="1" max="5">
                    </div>
                </div>
                <button class="btn-secondary" onclick="addCriteria()">+ Add Criteria</button>
            </div>

            <button class="btn-primary" onclick="generateMatrix()">Generate AI Analysis</button>

            <div id="matrixOutput" class="output-section" style="display: none;">
                <h3>AI-Powered Decision Analysis</h3>
                <div id="matrixResults"></div>
                <button class="download-btn" onclick="downloadResults('matrix')">📥 Download Report</button>
            </div>
        </div>

        <!-- Project Charter Generator -->
        <div id="projectCharter" class="main-tool">
            <div class="tool-header">
                <h2>📋 Project Charter Generator</h2>
                <button class="back-btn" onclick="showHome()">← Back to Tools</button>
            </div>

            <div class="form-section">
                <h3>Project Basics</h3>
                <div class="input-group">
                    <label>Project Name</label>
                    <input type="text" id="projectName" value="Bridge to Success: Adult Digital Literacy Initiative" placeholder="e.g., Community Health Initiative 2025">
                </div>
                <div class="input-group">
                    <label>Project Duration</label>
                    <select id="projectDuration">
                        <option>3 months</option>
                        <option>6 months</option>
                        <option selected>12 months</option>
                        <option>18 months</option>
                        <option>24 months</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Estimated Budget</label>
                    <input type="text" id="projectBudget" value="$75,000" placeholder="e.g., $50,000">
                </div>
            </div>

            <div class="form-section">
                <h3>Project Description</h3>
                <textarea id="projectDescription" placeholder="Briefly describe what this project aims to accomplish and why it's important...">This project will provide free digital literacy training to 300 unemployed and underemployed adults in our community, focusing on essential computer skills, online job searching, and basic office software proficiency. The program addresses the growing digital divide that prevents many community members from accessing employment opportunities, government services, and educational resources. We'll offer both in-person and hybrid classes with loaner laptops available.</textarea>
            </div>

            <div class="form-section">
                <h3>Target Beneficiaries</h3>
                <input type="text" id="projectBeneficiaries" value="Unemployed adults 25-65, residents of low-income neighborhoods, English language learners, and individuals reentering the workforce" placeholder="e.g., Low-income families with children under 5">
            </div>

            <div class="form-section">
                <h3>Key Stakeholders</h3>
                <input type="text" id="projectStakeholders" value="City Workforce Development Board, Public Library System, Local Community Colleges, Major employers (Target, Healthcare Network, City Government), United Way, Chamber of Commerce" placeholder="e.g., Board, major donors, partner organizations, community leaders">
            </div>

            <button class="btn-primary" onclick="generateCharter()">Generate Project Charter</button>

            <div id="charterOutput" class="output-section" style="display: none;">
                <h3>Your AI-Generated Project Charter</h3>
                <div id="charterResults"></div>
                <button class="download-btn" onclick="downloadResults('charter')">📥 Download Charter</button>
            </div>
        </div>

        <!-- Team Capacity Calculator -->
        <div id="teamCapacity" class="main-tool">
            <div class="tool-header">
                <h2>👥 Team Capacity Calculator</h2>
                <button class="back-btn" onclick="showHome()">← Back to Tools</button>
            </div>

            <div class="form-section">
                <h3>Current Team Members</h3>
                <div id="teamList">
                    <div class="team-member">
                        <div class="input-group">
                            <label>Name & Role</label>
                            <input type="text" value="Maria Rodriguez - Executive Director" placeholder="e.g., Sarah Johnson - Program Manager">
                        </div>
                        <div class="input-group">
                            <label>Current Workload (%)</label>
                            <input type="number" value="95" placeholder="80" min="0" max="100">
                            <div class="help-text">100% = fully booked, 80% = some capacity</div>
                        </div>
                        <div class="input-group">
                            <label>Key Skills</label>
                            <input type="text" value="Strategic planning, fundraising, board relations, public speaking, partnership development" placeholder="e.g., Grant writing, community outreach, data analysis">
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="input-group">
                            <label>Name & Role</label>
                            <input type="text" value="James Chen - Program Manager" placeholder="e.g., Name - Role">
                        </div>
                        <div class="input-group">
                            <label>Current Workload (%)</label>
                            <input type="number" value="85" placeholder="80" min="0" max="100">
                            <div class="help-text">100% = fully booked, 80% = some capacity</div>
                        </div>
                        <div class="input-group">
                            <label>Key Skills</label>
                            <input type="text" value="Program design, volunteer management, data analysis, grant writing, youth engagement" placeholder="e.g., Grant writing, community outreach">
                        </div>
                    </div>
                    <div class="team-member">
                        <div class="input-group">
                            <label>Name & Role</label>
                            <input type="text" value="Aisha Patel - Development Coordinator" placeholder="e.g., Name - Role">
                        </div>
                        <div class="input-group">
                            <label>Current Workload (%)</label>
                            <input type="number" value="75" placeholder="80" min="0" max="100">
                            <div class="help-text">100% = fully booked, 80% = some capacity</div>
                        </div>
                        <div class="input-group">
                            <label>Key Skills</label>
                            <input type="text" value="Donor relations, event planning, social media, grant writing, database management" placeholder="e.g., Grant writing, community outreach">
                        </div>
                    </div>
                </div>
                <button class="btn-secondary" onclick="addTeamMember()">+ Add Team Member</button>
            </div>

            <div class="form-section">
                <h3>New Project Requirements</h3>
                <div id="taskList">
                    <div class="task-item">
                        <input type="text" value="Write federal grant proposal for youth programs" placeholder="Task (e.g., Write grant proposal)">
                        <input type="number" value="15" placeholder="Hours/week" min="1">
                        <input type="text" value="Grant writing, program knowledge, budget development" placeholder="Skills needed">
                    </div>
                    <div class="task-item">
                        <input type="text" value="Launch and manage volunteer recruitment campaign" placeholder="Task">
                        <input type="number" value="10" placeholder="Hours/week" min="1">
                        <input type="text" value="Volunteer management, marketing, community outreach" placeholder="Skills needed">
                    </div>
                    <div class="task-item">
                        <input type="text" value="Develop new donor stewardship program" placeholder="Task">
                        <input type="number" value="8" placeholder="Hours/week" min="1">
                        <input type="text" value="Donor relations, event planning, communication" placeholder="Skills needed">
                    </div>
                </div>
                <button class="btn-secondary" onclick="addTask()">+ Add Task</button>
            </div>

            <button class="btn-primary" onclick="calculateCapacity()">Analyze & Optimize</button>

            <div id="capacityOutput" class="output-section" style="display: none;">
                <h3>AI Resource Optimization</h3>
                <div id="capacityResults"></div>
                <button class="download-btn" onclick="downloadResults('capacity')">📥 Download Plan</button>
            </div>
        </div>

        <!-- Report Generator -->
        <div id="reportGenerator" class="main-tool">
            <div class="tool-header">
                <h2>📝 Automated Report Generator</h2>
                <button class="back-btn" onclick="showHome()">← Back to Tools</button>
            </div>

            <div class="form-section">
                <h3>Report Type</h3>
                <select id="reportType">
                    <option selected>Monthly Board Update</option>
                    <option>Funder Progress Report</option>
                    <option>Team Status Update</option>
                    <option>Community Newsletter</option>
                </select>
            </div>

            <div class="form-section">
                <h3>Reporting Period</h3>
                <input type="text" id="reportPeriod" value="January 2025" placeholder="e.g., January 2025">
            </div>

            <div class="form-section">
                <h3>Key Metrics</h3>
                <div class="input-group">
                    <label>People Served</label>
                    <input type="number" id="peopleServed" value="247" placeholder="e.g., 150">
                </div>
                <div class="input-group">
                    <label>Programs Delivered</label>
                    <input type="number" id="programsDelivered" value="18" placeholder="e.g., 12">
                </div>
                <div class="input-group">
                    <label>Budget Utilized (%)</label>
                    <input type="number" id="budgetUsed" value="72" placeholder="e.g., 65" min="0" max="100">
                </div>
            </div>

            <div class="form-section">
                <h3>Highlights & Achievements</h3>
                <textarea id="reportHighlights" placeholder="List key wins, milestones reached, success stories...">- Launched new after-school STEM program serving 45 middle school students
- Received $50,000 grant from Smith Foundation for youth mental health initiative  
- Volunteer hours increased 30% compared to last January (312 total hours)
- Partnership with City Library established for homework help program
- 3 program graduates accepted to college with full scholarships
- Featured in local news for innovative approach to youth mentorship</textarea>
            </div>

            <div class="form-section">
                <h3>Challenges & Solutions</h3>
                <textarea id="reportChallenges" placeholder="What obstacles did you face? How are you addressing them?">- Transportation remains a barrier for 40% of families - implementing ride-share voucher program and exploring bus route partnership
- Staff capacity stretched with increased demand - actively recruiting 2 part-time program assistants
- Winter weather caused 3 program cancellations - developed virtual backup plans for all programs
- Database migration delayed by vendor issues - working with IT consultant to complete by February 15</textarea>
            </div>

            <button class="btn-primary" onclick="generateReport()">Generate Report</button>

            <div id="reportOutput" class="output-section" style="display: none;">
                <h3>Your Customized Report</h3>
                <div id="reportResults"></div>
                <button class="download-btn" onclick="downloadResults('report')">📥 Download Report</button>
            </div>
        </div>

        <!-- Quick Wins Finder -->
        <div id="quickWins" class="main-tool">
            <div class="tool-header">
                <h2>⚡ AI Quick Wins Finder</h2>
                <button class="back-btn" onclick="showHome()">← Back to Tools</button>
            </div>

            <div class="form-section">
                <h3>Tell us about your organization</h3>
                <div class="input-group">
                    <label>Organization Type</label>
                    <select id="orgType">
                        <option>Direct Service Provider</option>
                        <option>Advocacy Organization</option>
                        <option>Grantmaking Foundation</option>
                        <option>Community Development</option>
                        <option selected>Education/Youth Services</option>
                        <option>Health & Human Services</option>
                        <option>Arts & Culture</option>
                        <option>Environmental</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Team Size</label>
                    <select id="teamSize">
                        <option>1-5 staff</option>
                        <option selected>6-15 staff</option>
                        <option>16-50 staff</option>
                        <option>50+ staff</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Current Tech Comfort Level</label>
                    <select id="techLevel">
                        <option>Beginner (just email and basic tools)</option>
                        <option selected>Intermediate (using some cloud tools)</option>
                        <option>Advanced (multiple integrated systems)</option>
                    </select>
                </div>
            </div>

            <div class="form-section">
                <h3>What's your biggest pain point?</h3>
                <textarea id="painPoint" placeholder="e.g., We spend hours every week creating reports for different funders, or We struggle to keep track of all our volunteer applications...">We spend 15-20 hours per month writing similar grant proposals and customizing them for different funders. Each grant requires slightly different information but the core content is 80% the same. We also struggle with tracking outcomes across multiple programs - each funder wants different metrics reported in different formats, and compiling this takes our program staff away from actual service delivery.</textarea>
            </div>

            <div class="form-section">
                <h3>Available Time for Implementation</h3>
                <select id="timeAvailable">
                    <option>Less than 2 hours/week</option>
                    <option selected>2-5 hours/week</option>
                    <option>5-10 hours/week</option>
                    <option>More than 10 hours/week</option>
                </select>
            </div>

            <button class="btn-primary" onclick="findQuickWins()">Find My Quick Wins</button>

            <div id="quickWinsOutput" class="output-section" style="display: none;">
                <h3>Your Personalized AI Quick Wins</h3>
                <div id="quickWinsResults"></div>
                <button class="download-btn" onclick="downloadResults('quickwins')">📥 Download Action Plan</button>
            </div>
        </div>
    </div>

    <script>
        let currentTool = null;

        function showHome() {
            document.querySelectorAll('.main-tool').forEach(tool => {
                tool.classList.remove('active');
            });
            document.getElementById('toolsGrid').style.display = 'grid';
            currentTool = null;
        }

        function showTool(toolId) {
            document.getElementById('toolsGrid').style.display = 'none';
            document.querySelectorAll('.main-tool').forEach(tool => {
                tool.classList.remove('active');
            });
            document.getElementById(toolId).classList.add('active');
            currentTool = toolId;
        }

        function addOption() {
            const optionsList = document.getElementById('optionsList');
            const newOption = document.createElement('div');
            newOption.className = 'option-item';
            newOption.innerHTML = `
                <input type="text" placeholder="Option ${optionsList.children.length + 1}">
                <button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
            `;
            optionsList.appendChild(newOption);
        }

        function addCriteria() {
            const criteriaList = document.getElementById('criteriaList');
            const newCriteria = document.createElement('div');
            newCriteria.className = 'criteria-item';
            newCriteria.innerHTML = `
                <input type="text" placeholder="Criteria">
                <input type="number" placeholder="Weight (1-5)" min="1" max="5">
                <button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
            `;
            criteriaList.appendChild(newCriteria);
        }

        function addTeamMember() {
            const teamList = document.getElementById('teamList');
            const newMember = document.createElement('div');
            newMember.className = 'team-member';
            newMember.innerHTML = `
                <div class="input-group">
                    <label>Name & Role</label>
                    <input type="text" placeholder="e.g., Name - Role">
                </div>
                <div class="input-group">
                    <label>Current Workload (%)</label>
                    <input type="number" placeholder="80" min="0" max="100">
                    <div class="help-text">100% = fully booked, 80% = some capacity</div>
                </div>
                <div class="input-group">
                    <label>Key Skills</label>
                    <input type="text" placeholder="e.g., Grant writing, community outreach">
                </div>
                <button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
            `;
            teamList.appendChild(newMember);
        }

        function addTask() {
            const taskList = document.getElementById('taskList');
            const newTask = document.createElement('div');
            newTask.className = 'task-item';
            newTask.innerHTML = `
                <input type="text" placeholder="Task">
                <input type="number" placeholder="Hours/week" min="1">
                <input type="text" placeholder="Skills needed">
                <button class="remove-btn" onclick="this.parentElement.remove()">Remove</button>
            `;
            taskList.appendChild(newTask);
        }

        async function generateMatrix() {
            const output = document.getElementById('matrixOutput');
            const results = document.getElementById('matrixResults');
            const decisionTitle = document.getElementById('decisionTitle').value;
            
            output.style.display = 'block';
            results.innerHTML = '<div class="loading">Analyzing your options with AI</div>';
            
            // Simulate AI processing
            setTimeout(() => {
                results.innerHTML = `
                    <h4>Decision: ${decisionTitle || 'Which youth program should we expand for 2025-2026 school year?'}</h4>
                    
                    <table class="matrix-table">
                        <thead>
                            <tr>
                                <th>Option</th>
                                <th>Community Need (5)</th>
                                <th>Budget Req. (4)</th>
                                <th>Staff Expertise (3)</th>
                                <th>Grant Potential (4)</th>
                                <th>Impact (5)</th>
                                <th>Total Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="background: #e8f5e9;">
                                <td><strong>After-school STEM tutoring</strong></td>
                                <td>9.2/10</td>
                                <td>7.5/10</td>
                                <td>8.0/10</td>
                                <td>9.0/10</td>
                                <td>8.8/10</td>
                                <td><strong>8.6</strong> ⭐</td>
                            </tr>
                            <tr>
                                <td><strong>Weekend arts workshops</strong></td>
                                <td>7.0/10</td>
                                <td>8.5/10</td>
                                <td>6.5/10</td>
                                <td>6.0/10</td>
                                <td>7.5/10</td>
                                <td><strong>7.1</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Summer leadership camp</strong></td>
                                <td>8.0/10</td>
                                <td>4.0/10</td>
                                <td>7.0/10</td>
                                <td>7.5/10</td>
                                <td>8.0/10</td>
                                <td><strong>6.9</strong></td>
                            </tr>
                            <tr>
                                <td><strong>Year-round mentorship</strong></td>
                                <td>8.5/10</td>
                                <td>5.5/10</td>
                                <td>9.0/10</td>
                                <td>8.0/10</td>
                                <td>9.2/10</td>
                                <td><strong>8.1</strong></td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h4 style="margin-top: 25px;">🎯 AI Recommendation</h4>
                    <p><strong>Recommended Option: After-school STEM tutoring program (Score: 8.6/10)</strong></p>
                    
                    <p>Based on your weighted criteria analysis, the STEM tutoring program emerges as the clear winner. Here's the strategic rationale:</p>
                    
                    <p><strong>Why STEM Tutoring Wins:</strong></p>
                    <ul>
                        <li><strong>Highest Community Need (9.2/10):</strong> 73% of local middle schools report math/science achievement gaps</li>
                        <li><strong>Exceptional Grant Potential (9.0/10):</strong> Aligns with NSF, Department of Ed, and tech company funding priorities</li>
                        <li><strong>Strong Impact Metrics (8.8/10):</strong> Measurable academic improvements easily tracked and reported</li>
                        <li><strong>Sustainable Budget (7.5/10):</strong> $45,000 annual cost with potential for fee-for-service model</li>
                    </ul>
                    
                    <p><strong>Runner-Up Consideration:</strong></p>
                    <p>Year-round mentorship (8.1/10) scored second and could be integrated INTO the STEM program for maximum impact. Consider a hybrid approach.</p>
                    
                    <p><strong>Implementation Roadmap:</strong></p>
                    <ul>
                        <li><strong>Month 1:</strong> Apply for Microsoft TEALS grant (deadline Feb 15) and local STEM foundation grant</li>
                        <li><strong>Month 2:</strong> Recruit 3 part-time tutors from nearby university's education program</li>
                        <li><strong>Month 3:</strong> Pilot with 20 students at Madison Middle School (highest need area)</li>
                        <li><strong>Month 6:</strong> Scale to 60 students across 3 schools based on pilot results</li>
                    </ul>
                    
                    <p><strong>Risk Mitigation Strategies:</strong></p>
                    <ul>
                        <li><strong>Staff expertise gap:</strong> Partner with local community college for curriculum and training</li>
                        <li><strong>Transportation barrier:</strong> Implement program during existing after-school hours</li>
                        <li><strong>Sustainability concern:</strong> Build corporate sponsorship package targeting tech companies</li>
                    </ul>
                    
                    <p><strong>Success Metrics to Track:</strong></p>
                    <ul>
                        <li>Pre/post math and science assessment scores (target: 25% improvement)</li>
                        <li>School attendance rates for participating students</li>
                        <li>High school STEM course enrollment rates</li>
                        <li>Student and parent satisfaction surveys (target: 85% satisfaction)</li>
                    </ul>
                `;
            }, 2000);
        }

        async function generateCharter() {
            const output = document.getElementById('charterOutput');
            const results = document.getElementById('charterResults');
            const projectName = document.getElementById('projectName').value;
            const projectBudget = document.getElementById('projectBudget').value;
            
            output.style.display = 'block';
            results.innerHTML = '<div class="loading">Creating your project charter</div>';
            
            setTimeout(() => {
                results.innerHTML = `
                    <h4>PROJECT CHARTER</h4>
                    <h5>${projectName || 'Bridge to Success: Adult Digital Literacy Initiative'}</h5>
                    
                    <p><strong>Executive Summary</strong></p>
                    <p>The Bridge to Success Digital Literacy Initiative is a comprehensive 12-month program designed to eliminate digital barriers for unemployed and underemployed adults in our community. With a budget of ${projectBudget || '$75,000'}, this initiative will provide free, culturally-responsive digital skills training to 300 participants, directly addressing the technology gap that prevents access to modern employment opportunities, essential services, and educational advancement.</p>
                    
                    <p><strong>Strategic Alignment</strong></p>
                    <p>This project directly supports our organization's mission to create pathways to economic mobility and aligns with the City's 2025 Digital Equity Plan. It addresses the critical finding that 68% of job postings require basic digital skills, yet 45% of our target population lacks these competencies.</p>
                    
                    <p><strong>SMART Objectives</strong></p>
                    <ul>
                        <li>Train 300 adults in essential digital skills by December 2025 (25 participants/month)</li>
                        <li>Achieve 80% completion rate for enrolled participants</li>
                        <li>Ensure 60% of graduates secure employment or enroll in further education within 90 days</li>
                        <li>Increase participants' digital literacy scores by minimum 50% (pre/post assessment)</li>
                        <li>Provide loaner laptops to 100 participants lacking home computer access</li>
                    </ul>
                    
                    <p><strong>Scope & Key Deliverables</strong></p>
                    <ul>
                        <li><strong>Core Training Modules:</strong> Computer basics, internet navigation, email, Microsoft Office suite, online job applications, digital safety</li>
                        <li><strong>Support Services:</strong> 1-on-1 tech coaching, multilingual instruction (Spanish, Mandarin, Arabic), childcare during classes</li>
                        <li><strong>Equipment Program:</strong> Laptop lending library with 50 devices, WiFi hotspot checkout system</li>
                        <li><strong>Employer Partnerships:</strong> Job placement assistance with 10+ local employers</li>
                        <li><strong>Locations:</strong> Main library (primary), Eastside Community Center, Mobile lab for rural areas</li>
                    </ul>
                    
                    <p><strong>Implementation Timeline</strong></p>
                    <ul>
                        <li><strong>Phase 1 (Months 1-2):</strong> Instructor recruitment, curriculum finalization, equipment procurement, partnership agreements</li>
                        <li><strong>Phase 2 (Month 3):</strong> Soft launch with first cohort of 25 participants, gather feedback</li>
                        <li><strong>Phase 3 (Months 4-6):</strong> Full program launch, 3 cohorts running simultaneously</li>
                        <li><strong>Phase 4 (Month 7):</strong> Mid-program evaluation and curriculum adjustments</li>
                        <li><strong>Phase 5 (Months 8-11):</strong> Scaled operations, employer engagement events</li>
                        <li><strong>Phase 6 (Month 12):</strong> Final evaluation, sustainability planning, transition to ongoing funding</li>
                    </ul>
                    
                    <p><strong>Budget Breakdown</strong></p>
                    <table class="matrix-table">
                        <tr><td>Personnel (1.0 FTE Coordinator, 0.5 FTE Instructors)</td><td>$42,000</td><td>56%</td></tr>
                        <tr><td>Equipment (laptops, software licenses, hotspots)</td><td>$15,000</td><td>20%</td></tr>
                        <tr><td>Curriculum & Materials</td><td>$5,000</td><td>7%</td></tr>
                        <tr><td>Childcare Support</td><td>$6,000</td><td>8%</td></tr>
                        <tr><td>Marketing & Outreach</td><td>$3,000</td><td>4%</td></tr>
                        <tr><td>Evaluation & Reporting</td><td>$4,000</td><td>5%</td></tr>
                        <tr><td><strong>Total</strong></td><td><strong>$75,000</strong></td><td><strong>100%</strong></td></tr>
                    </table>
                    
                    <p><strong>Success Metrics & KPIs</strong></p>
                    <ul>
                        <li><strong>Output Metrics:</strong> # enrolled, # completed, training hours delivered, devices loaned</li>
                        <li><strong>Outcome Metrics:</strong> Employment rate, wage increases, digital skill assessment scores</li>
                        <li><strong>Impact Metrics:</strong> Economic mobility improvement, reduced digital divide index</li>
                        <li><strong>Quality Metrics:</strong> Participant satisfaction (target 90%), employer satisfaction with graduates</li>
                    </ul>
                    
                    <p><strong>Risk Management Matrix</strong></p>
                    <ul>
                        <li><strong>Risk:</strong> Low enrollment | <strong>Mitigation:</strong> Partner with workforce centers, faith organizations, offer transportation vouchers</li>
                        <li><strong>Risk:</strong> Language barriers | <strong>Mitigation:</strong> Multilingual instructors, translated materials, interpretation services</li>
                        <li><strong>Risk:</strong> Technology failures | <strong>Mitigation:</strong> IT support contract, backup equipment, hybrid delivery model</li>
                        <li><strong>Risk:</strong> Participant retention | <strong>Mitigation:</strong> Flexible scheduling, make-up classes, peer support groups</li>
                        <li><strong>Risk:</strong> Funding shortfall | <strong>Mitigation:</strong> Diversified funding sources, corporate sponsorships, fee-for-service contracts</li>
                    </ul>
                    
                    <p><strong>Stakeholder Engagement Plan</strong></p>
                    <ul>
                        <li><strong>Workforce Development Board:</strong> Monthly progress reports, quarterly in-person updates</li>
                        <li><strong>Library System:</strong> Bi-weekly coordination meetings, shared resource planning</li>
                        <li><strong>Employer Partners:</strong> Quarterly advisory meetings, graduate showcases</li>
                        <li><strong>Participants:</strong> Weekly check-ins, alumni network, success story documentation</li>
                        <li><strong>Funders:</strong> Monthly dashboards, site visits, impact reports</li>
                    </ul>
                    
                    <p><strong>Sustainability Strategy</strong></p>
                    <p>Year 2 funding secured through: workforce development grants (40%), corporate partnerships (30%), fee-for-service contracts with employers (20%), and individual donations (10%). Program designed for integration into existing adult education infrastructure.</p>
                `;
            }, 2000);
        }

        async function calculateCapacity() {
            const output = document.getElementById('capacityOutput');
            const results = document.getElementById('capacityResults');
            
            output.style.display = 'block';
            results.innerHTML = '<div class="loading">Optimizing team assignments with AI</div>';
            
            setTimeout(() => {
                results.innerHTML = `
                    <h4>Team Capacity Analysis & Optimization Plan</h4>
                    
                    <p><strong>Current Team Utilization Overview</strong></p>
                    <div class="team-member" style="border-left: 4px solid #dc3545;">
                        <strong>Maria Rodriguez - Executive Director</strong>
                        <span class="capacity-indicator capacity-danger">95% Utilized - CRITICAL</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 95%; background: linear-gradient(90deg, #dc3545, #c82333);"></div>
                        </div>
                        <p>⚠️ Only 2 hours/week available - at risk of burnout</p>
                    </div>
                    
                    <div class="team-member" style="border-left: 4px solid #ffc107;">
                        <strong>James Chen - Program Manager</strong>
                        <span class="capacity-indicator capacity-warning">85% Utilized - CAUTION</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 85%; background: linear-gradient(90deg, #ffc107, #e0a800);"></div>
                        </div>
                        <p>6 hours/week available - limited capacity for new tasks</p>
                    </div>
                    
                    <div class="team-member" style="border-left: 4px solid #28a745;">
                        <strong>Aisha Patel - Development Coordinator</strong>
                        <span class="capacity-indicator capacity-good">75% Utilized - HEALTHY</span>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 75%;"></div>
                        </div>
                        <p>10 hours/week available - best positioned for new responsibilities</p>
                    </div>
                    
                    <h4 style="margin-top: 25px;">🎯 AI-Optimized Task Allocation Plan</h4>
                    
                    <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>🔴 Federal Grant Proposal (15 hrs/week)</strong><br>
                        <strong>Current Problem:</strong> No single team member has 15 hours available<br>
                        <strong>AI Solution:</strong> Split between James (5 hrs - program content) and Aisha (10 hrs - writing/budget)<br>
                        <strong>Why This Works:</strong> Leverages James's program expertise and Aisha's grant writing skills<br>
                        <strong>Timeline:</strong> Complete draft in 3 weeks with this split approach
                    </div>
                    
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>⚠️ Volunteer Recruitment Campaign (10 hrs/week)</strong><br>
                        <strong>AI Recommendation:</strong> Delegate to Aisha (has capacity and relevant skills)<br>
                        <strong>Alternative:</strong> Recruit volunteer coordinator intern from local university<br>
                        <strong>Automation Opportunity:</strong> Use scheduling software to save 3 hrs/week<br>
                        <strong>Budget Impact:</strong> $500 for recruitment tools, potential $2,000/month for part-time help
                    </div>
                    
                    <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 15px 0;">
                        <strong>✅ Donor Stewardship Program (8 hrs/week)</strong><br>
                        <strong>Perfect Fit:</strong> Assign entirely to Aisha<br>
                        <strong>Rationale:</strong> Within her capacity, aligns with current donor relations role<br>
                        <strong>Quick Win:</strong> Implement donor CRM to automate thank you notes (saves 2 hrs/week)<br>
                        <strong>Expected Impact:</strong> 20% increase in donor retention
                    </div>
                    
                    <h4 style="margin-top: 25px;">⚡ Critical Recommendations</h4>
                    
                    <p><strong>Immediate Actions Required:</strong></p>
                    <ul style="background: #ffebee; padding: 15px; border-radius: 8px;">
                        <li><strong>Maria needs immediate relief:</strong> Delegate board meeting prep to James, move 2 committees to quarterly schedule</li>
                        <li><strong>Hire part-time admin assistant:</strong> 20 hrs/week at $18/hr = $1,440/month to handle data entry, scheduling, basic communications</li>
                        <li><strong>Postpone non-critical initiatives:</strong> Delay newsletter redesign and alumni program launch</li>
                    </ul>
                    
                    <p><strong>Efficiency Improvements (Quick Wins):</strong></p>
                    <ul>
                        <li><strong>Automate reports:</strong> Use dashboard tools to save 5 hrs/week across team</li>
                        <li><strong>Batch meetings:</strong> Consolidate to 2 days/week, save 3 hrs/week</li>
                        <li><strong>Template library:</strong> Create reusable templates for grants, reports, emails (4 hrs/week saved)</li>
                        <li><strong>Volunteer support:</strong> Recruit skilled volunteers for data entry, social media (6 hrs/week freed)</li>
                    </ul>
                    
                    <p><strong>3-Month Capacity Projection:</strong></p>
                    <table class="matrix-table">
                        <tr><th>Team Member</th><th>Current</th><th>With Changes</th><th>Status</th></tr>
                        <tr><td>Maria Rodriguez</td><td style="color: red;">95%</td><td style="color: green;">75%</td><td>✅ Sustainable</td></tr>
                        <tr><td>James Chen</td><td style="color: orange;">85%</td><td style="color: green;">80%</td><td>✅ Manageable</td></tr>
                        <tr><td>Aisha Patel</td><td style="color: green;">75%</td><td style="color: orange;">85%</td><td>⚠️ Monitor</td></tr>
                        <tr><td>New Admin (PT)</td><td>-</td><td style="color: green;">70%</td><td>✅ Good hire</td></tr>
                    </table>
                    
                    <p><strong>Investment Required:</strong></p>
                    <ul>
                        <li>Part-time admin: $4,320 for 3 months</li>
                        <li>Automation tools: $150/month ($450 total)</li>
                        <li>Total: $4,770 to prevent team burnout and maintain productivity</li>
                        <li><strong>ROI:</strong> Retain key staff (replacement cost: $30,000+), complete federal grant (potential $150,000)</li>
                    </ul>
                `;
            }, 2000);
        }

        async function generateReport() {
            const output = document.getElementById('reportOutput');
            const results = document.getElementById('reportResults');
            const reportType = document.getElementById('reportType').value;
            const reportPeriod = document.getElementById('reportPeriod').value;
            const peopleServed = document.getElementById('peopleServed').value;
            const programsDelivered = document.getElementById('programsDelivered').value;
            const budgetUsed = document.getElementById('budgetUsed').value;
            
            output.style.display = 'block';
            results.innerHTML = '<div class="loading">Crafting your report with AI</div>';
            
            setTimeout(() => {
                results.innerHTML = `
                    <h4>${reportType} - ${reportPeriod}</h4>
                    
                    <p>Dear Board Members,</p>
                    
                    <p>I'm pleased to share our ${reportPeriod} progress report, demonstrating exceptional program growth and community impact despite ongoing economic challenges in our service area.</p>
                    
                    <p><strong>Executive Summary</strong></p>
                    <p>January 2025 marked a significant milestone for our organization as we exceeded our quarterly service targets by 23% while maintaining fiscal discipline. Our strategic focus on STEM education and youth development continues to yield measurable results, with ${peopleServed} individuals directly benefiting from our ${programsDelivered} program sessions this month.</p>
                    
                    <p><strong>Impact Metrics & Performance</strong></p>
                    <ul>
                        <li><strong>Individuals Served:</strong> ${peopleServed} (123% of monthly target)</li>
                        <li><strong>Programs Delivered:</strong> ${programsDelivered} sessions across 4 sites</li>
                        <li><strong>Budget Utilization:</strong> ${budgetUsed}% - on track with projections</li>
                        <li><strong>Volunteer Engagement:</strong> 312 hours contributed (30% increase YoY)</li>
                        <li><strong>Program Completion Rate:</strong> 89% (industry benchmark: 75%)</li>
                    </ul>
                    
                    <p><strong>Strategic Achievements This Month</strong></p>
                    
                    <p>The launch of our after-school STEM tutoring program has exceeded all expectations, with 45 middle school students enrolled in the first cohort - 50% above our initial target. Early assessment data shows participating students improved their math scores by an average of 18% after just four weeks. One parent shared: "My daughter went from dreading math homework to teaching her younger brother. This program has transformed not just her grades, but her confidence."</p>
                    
                    <p>Our successful application to the Smith Foundation resulted in a $50,000 grant for youth mental health initiatives, enabling us to embed counseling support within our existing programs. This integrated approach addresses the whole child and removes barriers to mental health access.</p>
                    
                    <p>The new partnership with the City Library System provides our programs with free meeting spaces and access to their digital learning resources, saving approximately $2,000 monthly in facility costs. This collaboration also expands our reach into underserved neighborhoods where the library has established trust.</p>
                    
                    <p><strong>Notable Successes</strong></p>
                    <ul>
                        <li>Three program participants received full college scholarships totaling $180,000 in education funding</li>
                        <li>Featured in Channel 7 news segment reaching 50,000+ viewers, resulting in 15 new volunteer applications</li>
                        <li>Youth mentorship program achieved 100% retention rate for third consecutive month</li>
                        <li>Corporate partnership with TechCorp established, including $25,000 sponsorship and employee volunteers</li>
                    </ul>
                    
                    <p><strong>Challenges & Adaptive Strategies</strong></p>
                    
                    <p>Transportation remains our most significant barrier, affecting 40% of enrolled families. In response, we've launched a three-pronged approach: negotiating ride-share vouchers with Lyft for Good, coordinating with the public transit authority for a youth pass program, and organizing parent carpools through our new mobile app. Initial results show a 25% improvement in attendance rates.</p>
                    
                    <p>Staff capacity concerns have been addressed through strategic delegation and process improvements. We're actively recruiting two part-time program assistants and have implemented automation tools that save 8 hours weekly on administrative tasks. The board's approval of the emergency staffing fund has been instrumental in preventing burnout.</p>
                    
                    <p>The vendor delays in our database migration have pushed our timeline to February 15th. However, our IT consultant has developed a workaround ensuring no data loss and minimal service disruption. The new system will ultimately save 10 hours weekly in reporting time.</p>
                    
                    <p><strong>Financial Stewardship & Sustainability</strong></p>
                    
                    <p>Our conservative spending approach continues to serve us well, with ${budgetUsed}% budget utilization aligning perfectly with our strategic plan. Key financial highlights include:</p>
                    <ul>
                        <li>Program revenue up 15% through expanded fee-for-service contracts</li>
                        <li>Administrative costs reduced by 8% through process improvements</li>
                        <li>Reserve fund maintained at 4 months operating expenses</li>
                        <li>Zero findings in recent financial audit</li>
                    </ul>
                    
                    <p><strong>Looking Ahead: February Priorities</strong></p>
                    <ol>
                        <li>Launch second cohort of STEM program with waitlisted students</li>
                        <li>Submit federal grant application for $150,000 workforce development funding</li>
                        <li>Host community stakeholder forum to gather program feedback</li>
                        <li>Complete staff hiring for critical positions</li>
                        <li>Finalize spring fundraising gala details (target: $75,000)</li>
                    </ol>
                    
                    <p><strong>Board Action Required</strong></p>
                    <ul>
                        <li><strong>VOTE NEEDED:</strong> Approve revised personnel budget for two part-time positions ($3,200/month)</li>
                        <li><strong>REVIEW:</strong> Draft strategic plan update reflecting STEM program expansion</li>
                        <li><strong>DECISION:</strong> Facilities committee recommendation for satellite location lease</li>
                        <li><strong>RSVP:</strong> March 15th site visit to new STEM program (3:30-5:00 PM)</li>
                    </ul>
                    
                    <p><strong>Recognition & Gratitude</strong></p>
                    <p>Special recognition to board member Jennifer Walsh for securing the TechCorp partnership and to our program team for managing 23% growth without additional resources. Your strategic guidance and unwavering support enable us to transform lives daily.</p>
                    
                    <p>Respectfully submitted,<br>
                    Maria Rodriguez<br>
                    Executive Director</p>
                    
                    <p style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                    <em>Attachments: Detailed financial statements, program metrics dashboard, participant success stories, media coverage portfolio</em>
                    </p>
                `;
            }, 2000);
        }

        async function findQuickWins() {
            const output = document.getElementById('quickWinsOutput');
            const results = document.getElementById('quickWinsResults');
            
            output.style.display = 'block';
            results.innerHTML = '<div class="loading">Analyzing your organization</div>';
            
            setTimeout(() => {
                results.innerHTML = `
                    <h4>Your Top 3 AI Quick Wins</h4>
                    
                    <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h5>🏆 Quick Win #1: Automated Grant Proposal First Drafts</h5>
                        <p><strong>Time Saved: 10 hours/month</strong></p>
                        <p><strong>Difficulty: Easy (2 hours to set up)</strong></p>
                        
                        <p><strong>The Problem It Solves:</strong><br>
                        You're writing similar grant proposals repeatedly, spending hours on initial drafts.</p>
                        
                        <p><strong>How to Implement:</strong></p>
                        <ol>
                            <li>Create a simple template with your organization's standard information</li>
                            <li>Use ChatGPT or Claude to generate first drafts by providing program details</li>
                            <li>Edit and refine the AI output with specific funder requirements</li>
                        </ol>
                        
                        <p><strong>Specific Prompt to Use:</strong><br>
                        <em>"Write a grant proposal for [FOUNDATION NAME] requesting $[AMOUNT] to support our [PROGRAM NAME]. We serve [TARGET POPULATION] in [LOCATION]. The program provides [KEY SERVICES]. Include sections for: need statement, objectives, methods, evaluation, and budget narrative."</em></p>
                        
                        <p><strong>Expected Outcome:</strong><br>
                        Reduce grant writing time by 50% while maintaining quality and increasing application volume.</p>
                    </div>
                    
                    <div style="background: #fff8e1; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h5>🥈 Quick Win #2: Donor Thank You Note Generator</h5>
                        <p><strong>Time Saved: 5 hours/month</strong></p>
                        <p><strong>Difficulty: Very Easy (30 minutes to set up)</strong></p>
                        
                        <p><strong>The Problem It Solves:</strong><br>
                        Personalizing thank you notes for dozens of donors is time-consuming but critical.</p>
                        
                        <p><strong>How to Implement:</strong></p>
                        <ol>
                            <li>Create a spreadsheet with donor names, amounts, and designation</li>
                            <li>Use AI to generate personalized thank you messages</li>
                            <li>Review and add personal touches before sending</li>
                        </ol>
                        
                        <p><strong>Specific Prompt to Use:</strong><br>
                        <em>"Write a warm, personal thank you note to [DONOR NAME] who gave $[AMOUNT] to support our [PROGRAM]. Mention the specific impact their gift will have. Keep it to 3 paragraphs."</em></p>
                        
                        <p><strong>Expected Outcome:</strong><br>
                        Send timely, personalized thank you notes to 100% of donors within 48 hours of receipt.</p>
                    </div>
                    
                    <div style="background: #fce4ec; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h5>🥉 Quick Win #3: Social Media Content Calendar</h5>
                        <p><strong>Time Saved: 8 hours/month</strong></p>
                        <p><strong>Difficulty: Easy (1 hour to set up)</strong></p>
                        
                        <p><strong>The Problem It Solves:</strong><br>
                        Maintaining consistent social media presence while juggling other priorities.</p>
                        
                        <p><strong>How to Implement:</strong></p>
                        <ol>
                            <li>Use AI to generate a month of post ideas based on your mission</li>
                            <li>Create variations for different platforms (Facebook, Instagram, LinkedIn)</li>
                            <li>Schedule posts in advance using free tools like Buffer or Hootsuite</li>
                        </ol>
                        
                        <p><strong>Specific Prompt to Use:</strong><br>
                        <em>"Create 20 social media posts for a [YOUR ORG TYPE] that serves [YOUR BENEFICIARIES]. Include: 5 impact stories, 5 volunteer spotlights, 5 educational posts about [YOUR ISSUE], and 5 calls-to-action. Make them engaging and include relevant hashtags."</em></p>
                        
                        <p><strong>Expected Outcome:</strong><br>
                        Maintain daily social media presence with 75% less time investment.</p>
                    </div>
                    
                    <h4>📋 Your Implementation Roadmap</h4>
                    <p><strong>Week 1:</strong> Implement Quick Win #2 (Donor Thank Yous) - easiest and immediate impact</p>
                    <p><strong>Week 2:</strong> Set up Quick Win #3 (Social Media) - build momentum with visible results</p>
                    <p><strong>Week 3-4:</strong> Tackle Quick Win #1 (Grant Proposals) - biggest time savings</p>
                    
                    <h4>💡 Pro Tips for Success</h4>
                    <ul>
                        <li>Start small - implement one tool at a time</li>
                        <li>Always review and edit AI output - it's a first draft, not final</li>
                        <li>Save your best prompts for reuse</li>
                        <li>Track time saved to demonstrate ROI to your board</li>
                        <li>Share successes with your team to build buy-in</li>
                    </ul>
                `;
            }, 2000);
        }

        function downloadResults(type) {
            // In a real implementation, this would generate a PDF or Word doc
            alert(`Your ${type} report would download here. In the full version, this generates a formatted PDF document you can share with stakeholders.`);
        }
    </script>
</body>
</html>
