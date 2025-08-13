import React, { useState } from 'react';

// --- Icon Components (using inline SVG for simplicity) ---
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const LightbulbIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
    <path d="M10 2a1 1 0 011 1v1.172l1.414 1.414a1 1 0 01.293.707V10a4 4 0 11-8 0V5.293a1 1 0 01.293-.707L8 4.172V3a1 1 0 011-1zm0 14a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
);

const DocumentTextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6zm3 4a1 1 0 00-1 1v4a1 1 0 102 0v-4a1 1 0 00-1-1zm-2 0a1 1 0 100 2h.01a1 1 0 100-2H7zm5 0a1 1 0 100 2h.01a1 1 0 100-2H12z" clipRule="evenodd" />
    </svg>
);

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 11h16v2H2v-2zm2-4h12v2H4V7zm4-4h4v2H8V3z" />
    </svg>
);

const PresentationChartLineIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 inline" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L3.707 10.707a1 1 0 01-1.414-1.414l6-6z" />
    </svg>
);

const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1.158a3.994 3.994 0 002.28 3.54C9.49 8.29 10 9.103 10 10v1.158a3.995 3.995 0 002.28 3.541c.93.458 1.72.247 2.28-.541V14a1 1 0 112 0v-1.842a3.994 3.994 0 00-2.28-3.54C13.51 8.29 13 7.497 13 6.658V5.5a1 1 0 112 0v1.158c0 .84.49 1.642 1.22 2.092A5.994 5.994 0 0118 14.158V17a1 1 0 11-2 0v-2.842a5.995 5.995 0 01-1.22-2.092C14.01 11.608 14 10.897 14 10V8.842a5.995 5.995 0 01-1.22-2.092C12.01 6.342 12 5.603 12 5.5V4a1 1 0 011-1h1.5a1 1 0 110-2H12a3 3 0 00-3 3v1.158a3.995 3.995 0 00-2.28 3.541C5.79 9.15 5 9.953 5 10.842V12.5a1 1 0 11-2 0v-1.658c0-.84-.49-1.642-1.22-2.092A5.994 5.994 0 010 3.842V2a1 1 0 011-1h1.5a1 1 0 110 2H1a1 1 0 01-1-1V2a3 3 0 013-3h1zm0 2.5a1 1 0 100-2 1 1 0 000 2zM3 14a1 1 0 100 2 1 1 0 000-2zm13-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
    </svg>
);


// --- Gemini API Helper ---
const callGeminiAPI = async (prompt, jsonSchema = null) => {
    const apiKey = ""; // This will be handled by the execution environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    };

    if (jsonSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: jsonSchema,
        };
    }

    try {
        // Add a delay to simulate network latency for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`API request failed with status ${response.status}`);
        }

        const result = await response.json();
        
        const content = result?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!content) {
            console.error("Invalid response structure:", result);
            throw new Error("Failed to extract content from API response.");
        }

        return content;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error; // Re-throw the error to be caught by the component
    }
};


// --- App Components ---

// Lesson 1: Decision Matrix
const CriteriaGenerator = () => {
    const [decision, setDecision] = useState('Which new fundraising platform should we adopt for our annual giving campaign?');
    const [goals, setGoals] = useState('Our goal is to increase online donations by 25% and improve the donor experience to encourage recurring gifts.');
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!decision.trim() || !goals.trim()) {
            setOutput({ error: "Please fill out both fields." });
            return;
        }
        setIsLoading(true);
        setOutput(null);

        const prompt = `For a non-profit organization, generate a list of 5 weighted evaluation criteria for making the following strategic decision: "${decision}". The organization's primary goal is: "${goals}". The criteria should be relevant to a non-profit context. Provide a brief justification for each criterion. The weights should be percentages and must add up to 100%.`;
        
        const schema = {
            type: "OBJECT",
            properties: {
                criteria: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            name: { type: "STRING" },
                            weight: { type: "STRING" },
                            justification: { type: "STRING" }
                        },
                        required: ["name", "weight", "justification"]
                    }
                }
            },
            required: ["criteria"]
        };

        try {
            const response = await callGeminiAPI(prompt, schema);
            const parsedResponse = JSON.parse(response);
            setOutput(parsedResponse);
        } catch (error) {
            setOutput({ error: "Sorry, I couldn't generate criteria. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Criteria Generator</h2>
            <p className="text-gray-600 mb-6">Input a strategic choice and your organization's goals. The AI will suggest and weight relevant evaluation criteria.</p>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="decision" className="block text-sm font-medium text-gray-700">Strategic Decision</label>
                    <input type="text" id="decision" value={decision} onChange={e => setDecision(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., Which grant to pursue?" />
                </div>
                <div>
                    <label htmlFor="goals" className="block text-sm font-medium text-gray-700">Organization's Mission/Goals</label>
                    <textarea id="goals" value={goals} onChange={e => setGoals(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="e.g., To expand youth literacy programs in our community."></textarea>
                </div>
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading ? 'Generating...' : <><SparklesIcon/> Generate with AI</>}
                </button>
            </div>

            {output && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI-Generated Evaluation Criteria</h3>
                    {output.error ? <p className="text-red-600">{output.error}</p> : (
                        <ul className="space-y-3">
                            {output.criteria?.map((item, index) => (
                                <li key={index} className="p-3 bg-white rounded-md shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold text-gray-800">{item.name}</span>
                                        <span className="text-indigo-600 font-bold text-lg">{item.weight}</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{item.justification}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

const RiskMitigationPlanner = () => {
    const [strategy, setStrategy] = useState("We plan to launch a new after-school tutoring program in partnership with the local library. This involves recruiting 20 volunteer tutors, developing a curriculum for 50 elementary school students, and securing a grant to cover material costs.");
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!strategy.trim()) {
            setOutput({ error: "Please describe the strategy." });
            return;
        }
        setIsLoading(true);
        setOutput(null);

        const prompt = `Analyze the following proposed strategy for a non-profit and identify 3-4 potential risks. For each risk, categorize it (e.g., Financial, Operational, Reputational), describe the risk, estimate its likelihood (Low, Medium, High) and impact (Low, Medium, High), and propose a concise, actionable mitigation strategy. Strategy: "${strategy}"`;

        const schema = {
            type: "OBJECT",
            properties: {
                risks: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            category: { type: "STRING" },
                            risk: { type: "STRING" },
                            likelihood: { type: "STRING" },
                            impact: { type: "STRING" },
                            mitigation: { type: "STRING" }
                        },
                        required: ["category", "risk", "likelihood", "impact", "mitigation"]
                    }
                }
            },
            required: ["risks"]
        };

        try {
            const response = await callGeminiAPI(prompt, schema);
            const parsedResponse = JSON.parse(response);
            setOutput(parsedResponse);
        } catch (error) {
            setOutput({ error: "Sorry, I couldn't analyze risks. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Risk & Mitigation Planner</h2>
            <p className="text-gray-600 mb-6">Input a chosen strategy. The AI will generate potential risk scenarios and corresponding mitigation plans.</p>
            
            <div className="space-y-4">
                <div>
                    <label htmlFor="strategy" className="block text-sm font-medium text-gray-700">Proposed Strategy / Project Plan</label>
                    <textarea id="strategy" value={strategy} onChange={e => setStrategy(e.target.value)} rows="4" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="Describe the project, its goals, and key activities..."></textarea>
                </div>
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading ? 'Analyzing...' : <><SparklesIcon/> Analyze Risks with AI</>}
                </button>
            </div>

            {output && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Potential Risk Analysis</h3>
                    {output.error ? <p className="text-red-600">{output.error}</p> : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-md">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Category</th>
                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Risk</th>
                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Likelihood/Impact</th>
                                        <th className="text-left py-2 px-4 text-sm font-semibold text-gray-600">Mitigation Strategy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {output.risks?.map((r, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-3 px-4 text-sm text-gray-700 font-medium">{r.category}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{r.risk}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{r.likelihood} / {r.impact}</td>
                                            <td className="py-3 px-4 text-sm text-gray-600">{r.mitigation}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const DecisionMatrixMemo = () => {
    // This component remains largely unchanged as its core is calculation.
    // The Gemini enhancement is on the memo generation part.
    const [memo, setMemo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const data = {
        options: ["Grant A", "Grant B", "Grant C"],
        criteria: [
            { name: "Alignment", weight: 30 },
            { name: "Impact", weight: 25 },
            { name: "Feasibility", weight: 20 },
            { name: "Budget", weight: 25 },
        ],
        scores: [
            [8, 7, 9, 6], // Scores for Grant A
            [9, 9, 6, 8], // Scores for Grant B
            [6, 8, 7, 7], // Scores for Grant C
        ]
    };

    const calculatedScores = data.options.map((option, optionIndex) => {
        const totalScore = data.criteria.reduce((acc, criterion, critIndex) => {
            return acc + (data.scores[optionIndex][critIndex] * (criterion.weight / 100));
        }, 0);
        return { name: option, score: totalScore.toFixed(2) };
    }).sort((a, b) => b.score - a.score);

    const winner = calculatedScores[0];

    const handleGenerateMemo = async () => {
        setIsLoading(true);
        setMemo('');

        const prompt = `Write a professional justification memo for a non-profit's board of directors. The memo should recommend pursuing a specific grant based on a decision matrix analysis.

        **Decision Matrix Data:**
        - **Options Considered:** ${data.options.join(', ')}
        - **Evaluation Criteria:** ${data.criteria.map(c => `${c.name} (${c.weight}%)`).join(', ')}
        - **Winning Option:** ${winner.name}
        - **Winning Score:** ${winner.score}
        
        The memo should be concise and clearly state the recommendation, the process followed, and the primary reasons for the choice based on the data. Highlight the winner's strengths.`;

        try {
            const response = await callGeminiAPI(prompt);
            setMemo(response);
        } catch (error) {
            setMemo("Error generating memo. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Interactive Decision Matrix & Memo Generator</h2>
            <p className="text-gray-600 mb-6">The AI analyzes scores and generates a narrative justification memo for your board.</p>
            
            <div className="overflow-x-auto bg-white p-4 rounded-lg border shadow-sm">
                {/* Table remains the same */}
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="text-left py-2 px-3 font-semibold text-gray-700">Criteria (Weight)</th>
                            {data.options.map(opt => <th key={opt} className="text-center py-2 px-3 font-semibold text-gray-700">{opt}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {data.criteria.map((crit, critIndex) => (
                            <tr key={crit.name} className="border-t">
                                <td className="py-2 px-3 text-sm text-gray-600">{crit.name} ({crit.weight}%)</td>
                                {data.options.map((opt, optIndex) => (
                                    <td key={opt} className="text-center py-2 px-3 text-sm text-gray-800">{data.scores[optIndex][critIndex]}</td>
                                ))}
                            </tr>
                        ))}
                        <tr className="border-t-2 border-gray-300 bg-gray-50">
                            <td className="py-3 px-3 font-bold text-gray-800">Weighted Score</td>
                            {calculatedScores.map(res => (
                                <td key={res.name} className={`text-center py-3 px-3 font-bold text-lg ${res.name === winner.name ? 'text-green-600' : 'text-gray-800'}`}>
                                    {res.score}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-6 text-center">
                <div className={`inline-block p-4 rounded-lg bg-green-100 border border-green-300`}>
                    <h3 className="text-lg font-semibold text-gray-900">Highest-Scoring Option: <span className="text-green-700 font-bold">{winner.name}</span></h3>
                </div>
            </div>

            <div className="mt-6">
                <button onClick={handleGenerateMemo} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                    {isLoading ? 'Generating...' : <><SparklesIcon/> Generate Justification Memo with AI</>}
                </button>
            </div>

            {memo && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Board Memo: Recommendation for Grant Pursuit</h3>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">{memo}</pre>
                </div>
            )}
        </div>
    );
};


// Lesson 2: Project Planning
const ProjectCharterBuilder = () => {
    const [details, setDetails] = useState({ 
        objective: "Launch a 'Healthy Seniors' weekly meal delivery service.", 
        impact: "Improve the nutrition and reduce social isolation for 100 homebound seniors in our community.", 
        deliverables: "A volunteer recruitment and training program, a partnership with a local commercial kitchen, a weekly menu plan, and a delivery logistics system.", 
        budget: "$75,000 - $90,000" 
    });
    const [charter, setCharter] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        if (Object.values(details).some(v => !v.trim())) {
            setCharter({ error: "Please fill out all fields." });
            return;
        }
        setIsLoading(true);
        setCharter(null);

        const prompt = `Create a formal project charter for a non-profit. Use the following details to structure the document. Elaborate on each section to create a professional, funder-ready document. Suggest appropriate success metrics.
        - Main Objective: ${details.objective}
        - Desired Impact: ${details.impact}
        - Key Deliverables: ${details.deliverables}
        - Estimated Budget Range: ${details.budget}`;

        const schema = {
            type: "OBJECT",
            properties: {
                title: { type: "STRING" },
                sections: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            title: { type: "STRING" },
                            content: { type: "STRING" }
                        },
                        required: ["title", "content"]
                    }
                }
            },
            required: ["title", "sections"]
        };

        try {
            const response = await callGeminiAPI(prompt, schema);
            const parsedResponse = JSON.parse(response);
            setCharter(parsedResponse);
        } catch (error) {
            setCharter({ error: "Sorry, I couldn't generate the charter. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Automated Project Charter Builder</h2>
            <p className="text-gray-600 mb-6">Input high-level goals. The AI will structure a formal, funder-ready document.</p>
            
            <div className="space-y-4">
                <input name="objective" value={details.objective} onChange={handleChange} placeholder="Main Objective" className="w-full p-2 border rounded"/>
                <input name="impact" value={details.impact} onChange={handleChange} placeholder="Desired Impact" className="w-full p-2 border rounded"/>
                <input name="deliverables" value={details.deliverables} onChange={handleChange} placeholder="Key Deliverables" className="w-full p-2 border rounded"/>
                <input name="budget" value={details.budget} onChange={handleChange} placeholder="Estimated Budget Range" className="w-full p-2 border rounded"/>
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                    {isLoading ? 'Generating...' : <><SparklesIcon/> Generate Charter with AI</>}
                </button>
            </div>

            {charter && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                    {charter.error ? <p className="text-red-600">{charter.error}</p> : (
                        <div>
                            <h3 className="text-xl font-bold text-center text-gray-900 mb-4">{charter.title}</h3>
                            <div className="space-y-4">
                                {charter.sections?.map(sec => (
                                    <div key={sec.title}>
                                        <h4 className="font-semibold text-gray-800">{sec.title}</h4>
                                        <p className="text-gray-600 text-sm mt-1">{sec.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const BudgetEstimator = () => {
    const [scope, setScope] = useState("Project Charter for 'Community Tech Hub': The objective is to convert our spare conference room into a free-to-use computer lab for the community. Key deliverables include purchasing 10 desktop computers, installing high-speed internet, recruiting volunteer tech support, and offering weekly 'Digital Literacy 101' workshops. The project will run for one year.");
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!scope.trim()) {
            setOutput({ error: "Please provide the project scope." });
            return;
        }
        setIsLoading(true);
        setOutput(null);

        const prompt = `Based on the following project scope for a non-profit, generate a categorized draft budget. Include likely expense line items under standard categories (Personnel, Materials, Overhead, etc.). For each item, provide an estimated cost and a brief justification. Calculate a total estimated cost.
        
        Project Scope: "${scope}"`;

        const schema = {
            type: "OBJECT",
            properties: {
                budget: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            category: { type: "STRING" },
                            item: { type: "STRING" },
                            cost: { type: "STRING" },
                            justification: { type: "STRING" }
                        },
                        required: ["category", "item", "cost", "justification"]
                    }
                },
                total: { type: "STRING" }
            },
            required: ["budget", "total"]
        };

        try {
            const response = await callGeminiAPI(prompt, schema);
            setOutput(JSON.parse(response));
        } catch (error) {
            setOutput({ error: "Sorry, I couldn't estimate the budget. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Budget Estimator Tool</h2>
            <p className="text-gray-600 mb-6">The AI analyzes the project scope and generates a categorized list of likely expenses.</p>
            
            <div className="space-y-4">
                <textarea value={scope} onChange={e => setScope(e.target.value)} rows="4" placeholder="Paste project charter or scope document here..." className="w-full p-2 border rounded"/>
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                    {isLoading ? 'Estimating...' : <><SparklesIcon/> Estimate Budget with AI</>}
                </button>
            </div>

            {output && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Draft Budget Estimate</h3>
                    {output.error ? <p className="text-red-600">{output.error}</p> : (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left py-2 px-4">Category</th>
                                            <th className="text-left py-2 px-4">Line Item</th>
                                            <th className="text-right py-2 px-4">Estimated Cost</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {output.budget?.map((item, i) => (
                                            <tr key={i} className="border-b">
                                                <td className="py-2 px-4 font-medium">{item.category}</td>
                                                <td className="py-2 px-4">{item.item}<p className="text-xs text-gray-500">{item.justification}</p></td>
                                                <td className="py-2 px-4 text-right font-semibold">{item.cost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-100">
                                        <tr>
                                            <td colSpan="2" className="text-right py-2 px-4 font-bold">Total Estimated Budget:</td>
                                            <td className="text-right py-2 px-4 font-bold text-lg">{output.total}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const CommunicationPlanGenerator = () => {
    const [stakeholders, setStakeholders] = useState('Board of Directors, Anytown Community Foundation (Funder), Program Staff, Local News Media');
    const [output, setOutput] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!stakeholders.trim()) {
            setOutput({ error: "Please list the stakeholders." });
            return;
        }
        setIsLoading(true);
        setOutput(null);

        const prompt = `For a typical non-profit project, create a stakeholder communication plan for the following groups: ${stakeholders}. For each stakeholder, recommend a communication frequency, medium (e.g., email, meeting), and the key message focus.`;

        const schema = {
            type: "OBJECT",
            properties: {
                plan: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            stakeholder: { type: "STRING" },
                            frequency: { type: "STRING" },
                            medium: { type: "STRING" },
                            message: { type: "STRING" }
                        },
                        required: ["stakeholder", "frequency", "medium", "message"]
                    }
                }
            },
            required: ["plan"]
        };

        try {
            const response = await callGeminiAPI(prompt, schema);
            setOutput(JSON.parse(response));
        } catch (error) {
            setOutput({ error: "Sorry, I couldn't generate the plan. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Stakeholder Communication Plan Generator</h2>
            <p className="text-gray-600 mb-6">Input stakeholders and the AI will generate a tailored communication plan.</p>
            
            <div className="space-y-4">
                <input value={stakeholders} onChange={e => setStakeholders(e.target.value)} placeholder="Enter stakeholders, separated by commas" className="w-full p-2 border rounded"/>
                <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                    {isLoading ? 'Generating...' : <><SparklesIcon/> Generate Plan with AI</>}
                </button>
            </div>

            {output && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Stakeholder Communication Plan</h3>
                    {output.error ? <p className="text-red-600">{output.error}</p> : (
                         <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left py-2 px-4">Stakeholder</th>
                                        <th className="text-left py-2 px-4">Frequency</th>
                                        <th className="text-left py-2 px-4">Medium</th>
                                        <th className="text-left py-2 px-4">Key Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {output.plan?.map((item, i) => (
                                        <tr key={i} className="border-b">
                                            <td className="py-3 px-4 font-medium">{item.stakeholder}</td>
                                            <td className="py-3 px-4">{item.frequency}</td>
                                            <td className="py-3 px-4">{item.medium}</td>
                                            <td className="py-3 px-4 text-sm">{item.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Lesson 3: Resource Allocation
const WorkloadBalancer = () => {
    // This component's core logic is algorithmic, so Gemini is not used here.
    // It remains as a prototype of a different kind of tool.
    const [tasks, setTasks] = useState([
        { id: 1, name: 'Draft Grant Proposal', hours: 16, priority: 'High', assigned: null },
        { id: 2, name: 'Organize Volunteer Event', hours: 20, priority: 'High', assigned: null },
        { id: 3, name: 'Update Donor Database', hours: 8, priority: 'Medium', assigned: null },
        { id: 4, name: 'Create Social Media Content', hours: 10, priority: 'Medium', assigned: null },
        { id: 5, name: 'Prepare Board Report', hours: 12, priority: 'High', assigned: null },
    ]);
    const [staff, setStaff] = useState([
        { name: 'Alex', capacity: 40, assignedTasks: [], currentLoad: 0 },
        { name: 'Brenda', capacity: 40, assignedTasks: [], currentLoad: 0 },
        { name: 'Charles', capacity: 20, assignedTasks: [], currentLoad: 0 },
    ]);
    const [isBalanced, setIsBalanced] = useState(false);

    const handleBalance = () => {
        const sortedTasks = [...tasks].sort((a,b) => (b.priority === 'High' ? 1 : -1) - (a.priority === 'High' ? 1 : -1));
        const newStaff = staff.map(s => ({...s, assignedTasks: [], currentLoad: 0}));

        sortedTasks.forEach(task => {
            newStaff.sort((a,b) => (a.capacity - a.currentLoad) - (b.capacity - b.currentLoad));
            if(newStaff[0].currentLoad + task.hours <= newStaff[0].capacity){
                newStaff[0].assignedTasks.push(task);
                newStaff[0].currentLoad += task.hours;
            } else {
                 const leastLoaded = newStaff.sort((a,b) => a.currentLoad - b.currentLoad)[0];
                 leastLoaded.assignedTasks.push(task);
                 leastLoaded.currentLoad += task.hours;
            }
        });
        
        setStaff(newStaff.sort((a,b) => a.name.localeCompare(b.name)));
        setIsBalanced(true);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Workload Balancing Simulator</h2>
            <p className="text-gray-600 mb-6">Input tasks and staff availability, and the system proposes an optimized assignment schedule.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="font-semibold mb-2">Prioritized Tasks</h3>
                    <ul className="space-y-2">
                        {tasks.map(t => <li key={t.id} className="p-2 bg-white border rounded-md text-sm">{t.name} ({t.hours}hrs) - {t.priority}</li>)}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Staff Availability</h3>
                    <ul className="space-y-2">
                        {staff.map(s => <li key={s.name} className="p-2 bg-white border rounded-md text-sm">{s.name} ({s.capacity} hrs/week)</li>)}
                    </ul>
                </div>
            </div>
            
            <button onClick={handleBalance} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Balance Workload</button>

            {isBalanced && (
                 <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimized Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {staff.map(person => (
                            <div key={person.name} className="bg-gray-100 p-4 rounded-lg">
                                <h4 className="font-bold">{person.name}</h4>
                                <p className={`text-sm mb-2 ${person.currentLoad > person.capacity ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                                    Load: {person.currentLoad} / {person.capacity} hrs
                                </p>
                                <div className="space-y-2">
                                    {person.assignedTasks.map(task => (
                                        <div key={task.id} className="bg-white p-3 rounded-md shadow-sm">
                                            <p className="font-semibold text-sm">{task.name}</p>
                                            <p className="text-xs text-gray-500">{task.hours} hrs - {task.priority}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            )}
        </div>
    );
};

const SkillsGapAnalyzer = () => {
    const [projectSkills, setProjectSkills] = useState('Grant Writing, Data Analysis, Community Outreach, Spanish Language');
    const [staffSkills, setStaffSkills] = useState('Alex: Grant Writing, Public Speaking\nBrenda: Community Outreach, Event Planning\nCharles: Data Entry, Social Media');
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        setIsLoading(true);
        setAnalysis(null);

        const prompt = `Analyze the skills gap for a non-profit.
        
        **Required Skills for Upcoming Projects:**
        ${projectSkills}
        
        **Current Staff Competencies:**
        ${staffSkills}
        
        Identify the specific skills that are missing or underdeveloped on the current team. Then, provide actionable recommendations for how to address these gaps, such as through targeted training or new hires.`;

        const schema = {
            type: "OBJECT",
            properties: {
                gaps: {
                    type: "ARRAY",
                    items: {
                        type: "OBJECT",
                        properties: {
                            skill: { type: "STRING" },
                            note: { type: "STRING" }
                        },
                        required: ["skill", "note"]
                    }
                },
                recommendations: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                }
            },
            required: ["gaps", "recommendations"]
        };

        try {
            const response = await callGeminiAPI(prompt, schema);
            setAnalysis(JSON.parse(response));
        } catch (error) {
            setAnalysis({ error: "Sorry, I couldn't analyze the skills gap. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills Gap Analyzer</h2>
            <p className="text-gray-600 mb-6">AI compares project requirements against a staff inventory to identify training or hiring needs.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Upcoming Project Skills</label>
                    <textarea rows="4" value={projectSkills} onChange={e => setProjectSkills(e.target.value)} className="mt-1 w-full p-2 border rounded"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Current Staff Competencies</label>
                    <textarea rows="4" value={staffSkills} onChange={e => setStaffSkills(e.target.value)} className="mt-1 w-full p-2 border rounded"/>
                </div>
            </div>
            <button onClick={handleAnalyze} disabled={isLoading} className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                {isLoading ? 'Analyzing...' : <><SparklesIcon/> Analyze Gaps with AI</>}
            </button>

            {analysis && (
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {analysis.error ? <p className="text-red-600 col-span-2">{analysis.error}</p> : <>
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h3 className="font-semibold text-red-800">Identified Skill Gaps</h3>
                            <ul className="list-disc list-inside mt-2 text-red-700">
                                {analysis.gaps?.map(gap => <li key={gap.skill}><strong>{gap.skill}:</strong> {gap.note}</li>)}
                            </ul>
                        </div>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-semibold text-green-800">Recommendations</h3>
                            <ul className="list-disc list-inside mt-2 text-green-700">
                                {analysis.recommendations?.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </>}
                </div>
            )}
        </div>
    );
};

const ProjectPrioritizer = () => {
    // Core logic is mathematical, so this remains a non-Gemini prototype.
    const [projects, setProjects] = useState([
        { name: 'Youth Mentorship Program', impact: 8, cost: 6 },
        { name: 'Community Garden Initiative', impact: 7, cost: 3 },
        { name: 'Digital Literacy Workshops', impact: 9, cost: 8 },
    ]);
    const [results, setResults] = useState(null);

    const handlePrioritize = () => {
        const scoredProjects = projects.map(p => ({
            ...p,
            score: ((p.impact / 10) * 0.6 + ((10 - p.cost) / 10) * 0.4) * 100
        })).sort((a, b) => b.score - a.score);
        setResults(scoredProjects);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Prioritization Tool</h2>
            <p className="text-gray-600 mb-6">The system scores competing initiatives based on user-defined impact metrics and resource constraints.</p>
            
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-semibold">Potential Projects (Rated 1-10)</h3>
                {projects.map(p => (
                    <div key={p.name} className="flex justify-between items-center mt-2 text-sm">
                        <span>{p.name}</span>
                        <span className="text-gray-600">Impact: {p.impact}, Cost: {p.cost}</span>
                    </div>
                ))}
            </div>
            <button onClick={handlePrioritize} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">Prioritize Projects</button>

            {results && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Prioritized Project List</h3>
                    <ul className="space-y-3">
                        {results.map((p, i) => (
                            <li key={p.name} className={`p-4 rounded-lg border flex items-center ${i === 0 ? 'bg-green-50 border-green-300' : 'bg-white'}`}>
                                <span className="text-2xl font-bold text-indigo-600 mr-4">{i + 1}</span>
                                <div>
                                    <h4 className="font-semibold">{p.name}</h4>
                                    <p className="text-sm text-gray-600">Strategic Value Score: {p.score.toFixed(0)}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


// Lesson 4: Automated Tracking
const NarrativeReportGenerator = () => {
    const [data, setData] = useState("Q3 Progress for 'Youth Mentorship Program': KPIs: 85% of enrolled youth met with their mentor weekly (target was 80%). Milestones: Mentor recruitment drive completed, 22 new mentors onboarded. Mid-program survey deployed. Budget: 70% of annual budget spent, which is slightly ahead of schedule due to early purchase of event supplies.");
    const [audience, setAudience] = useState('Funder');
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setReport(null);

        const prompt = `Write a concise, narrative progress update email.
        
        **Target Audience:** ${audience}
        **Raw Data:** ${data}
        
        Tailor the tone and content appropriately for the selected audience. For a Funder, be more formal and focus on impact. For Internal Staff, be more direct and action-oriented.`;

        try {
            const response = await callGeminiAPI(prompt);
            setReport(response);
        } catch (error) {
            setReport("Error generating report. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Narrative Report Generator</h2>
            <p className="text-gray-600 mb-6">AI summarizes raw project data into a stakeholder-specific update email.</p>
            
            <div className="space-y-4">
                <textarea rows="3" value={data} onChange={e => setData(e.target.value)} className="w-full p-2 border rounded" placeholder="Enter raw data: KPIs, milestones, budget..."/>
                <select value={audience} onChange={e => setAudience(e.target.value)} className="w-full p-2 border rounded bg-white">
                    <option>Funder</option>
                    <option>Internal Staff</option>
                </select>
                <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                    {isLoading ? 'Generating...' : <><SparklesIcon/> Generate Report with AI</>}
                </button>
            </div>

            {report && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Generated Email Draft for: {audience}</h3>
                    <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 bg-white p-4 rounded-md">{report}</pre>
                </div>
            )}
        </div>
    );
};

const CheckinSummarizer = () => {
    const [notes, setNotes] = useState("Brenda's update: The community event was a huge success, over 50 attendees. We need to book a venue for the next one ASAP. Alex's notes: Finished the grant draft. I'm blocked by needing final budget numbers from Charles. Charles: Database is updated but the software is slow.");
    const [summary, setSummary] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSummarize = async () => {
        setIsLoading(true);
        setSummary(null);

        const prompt = `Analyze the following unstructured text from a team's weekly check-in notes. Extract and categorize the key information into three lists: Accomplishments, Challenges/Roadblocks, and Action Items.
        
        **Check-in Notes:**
        "${notes}"`;

        const schema = {
            type: "OBJECT",
            properties: {
                accomplishments: { type: "ARRAY", items: { type: "STRING" } },
                challenges: { type: "ARRAY", items: { type: "STRING" } },
                actions: { type: "ARRAY", items: { type: "STRING" } }
            },
            required: ["accomplishments", "challenges", "actions"]
        };
        
        try {
            const response = await callGeminiAPI(prompt, schema);
            setSummary(JSON.parse(response));
        } catch (error) {
            setSummary({ error: "Sorry, I couldn't summarize the notes. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Check-in Summarizer</h2>
            <p className="text-gray-600 mb-6">AI summarizes key achievements and challenges from unstructured weekly team check-in notes.</p>
            
            <textarea rows="5" value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Paste unstructured notes from emails, meetings, etc."/>
            <button onClick={handleSummarize} disabled={isLoading} className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex justify-center items-center">
                {isLoading ? 'Summarizing...' : <><SparklesIcon/> Summarize with AI</>}
            </button>

            {summary && (
                <div className="mt-8 space-y-4">
                    {summary.error ? <p className="text-red-600">{summary.error}</p> : <>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h3 className="font-semibold text-green-800">Key Accomplishments</h3>
                            <ul className="list-disc list-inside mt-2 text-sm text-green-700">{summary.accomplishments?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                        </div>
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h3 className="font-semibold text-yellow-800">Challenges & Roadblocks</h3>
                            <ul className="list-disc list-inside mt-2 text-sm text-yellow-700">{summary.challenges?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                        </div>
                         <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="font-semibold text-blue-800">Action Items</h3>
                            <ul className="list-disc list-inside mt-2 text-sm text-blue-700">{summary.actions?.map((item, i) => <li key={i}>{item}</li>)}</ul>
                        </div>
                    </>}
                </div>
            )}
        </div>
    );
};

const EarlyWarningSystem = () => {
    // This component remains non-Gemini as its core logic is rule-based for the prototype.
    const projects = [
        { name: 'Community Garden', status: 'Green', trend: 'stable', note: 'On track and on budget.' },
        { name: 'Youth Mentorship', status: 'Yellow', trend: 'down', note: 'Slight delay in mentor recruitment. Budget spend is 5% higher than projected.' },
        { name: 'Digital Literacy', status: 'Green', trend: 'up', note: 'Ahead of schedule. Participant enrollment is exceeding goals.' },
        { name: 'Annual Gala', status: 'Red', trend: 'down', note: 'Venue contract delayed. Keynote speaker has not confirmed. At risk of missing deadline.' },
    ];
    
    const statusColors = {
        Green: 'bg-green-500',
        Yellow: 'bg-yellow-500',
        Red: 'bg-red-500',
    };

    const alerts = projects.filter(p => p.status === 'Red' || p.status === 'Yellow');

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Early Warning System</h2>
            <p className="text-gray-600 mb-6">The system analyzes progress updates and flags projects showing signs of risk or delay.</p>
            
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Project Health Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {projects.map(p => (
                        <div key={p.name} className="p-4 rounded-lg border bg-white shadow-sm">
                            <div className="flex justify-between items-center">
                                <h4 className="font-semibold">{p.name}</h4>
                                <div className={`w-4 h-4 rounded-full ${statusColors[p.status]}`}></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{p.note}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Automated Alerts</h3>
                {alerts.length > 0 ? (
                    <div className="space-y-3">
                        {alerts.map(p => (
                             <div key={p.name} className={`p-4 rounded-lg border-l-4 ${p.status === 'Red' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'}`}>
                                <h4 className={`font-bold ${p.status === 'Red' ? 'text-red-800' : 'text-yellow-800'}`}>
                                    ALERT: {p.name} is {p.status === 'Red' ? 'Off-Track' : 'At Risk'}
                                </h4>
                                <p className={`text-sm mt-1 ${p.status === 'Red' ? 'text-red-700' : 'text-yellow-700'}`}>{p.note}</p>
                             </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">All projects are on track. No alerts.</p>
                )}
            </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
    const [activeApp, setActiveApp] = useState('CriteriaGenerator');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const apps = {
        'Lesson 1: Decision Matrix': [
            { id: 'CriteriaGenerator', name: 'Criteria Generator', icon: <LightbulbIcon /> },
            { id: 'RiskMitigationPlanner', name: 'Risk & Mitigation Planner', icon: <LightbulbIcon /> },
            { id: 'DecisionMatrixMemo', name: 'Decision Matrix & Memo', icon: <LightbulbIcon /> },
        ],
        'Lesson 2: Project Planning': [
            { id: 'ProjectCharterBuilder', name: 'Project Charter Builder', icon: <DocumentTextIcon /> },
            { id: 'BudgetEstimator', name: 'Budget Estimator', icon: <DocumentTextIcon /> },
            { id: 'CommunicationPlanGenerator', name: 'Communication Plan', icon: <DocumentTextIcon /> },
        ],
        'Lesson 3: Resource Allocation': [
            { id: 'WorkloadBalancer', name: 'Workload Balancer', icon: <ChartBarIcon /> },
            { id: 'SkillsGapAnalyzer', name: 'Skills Gap Analyzer', icon: <ChartBarIcon /> },
            { id: 'ProjectPrioritizer', name: 'Project Prioritizer', icon: <ChartBarIcon /> },
        ],
        'Lesson 4: Automated Tracking': [
            { id: 'NarrativeReportGenerator', name: 'Narrative Report Generator', icon: <PresentationChartLineIcon /> },
            { id: 'CheckinSummarizer', name: 'Check-in Summarizer', icon: <PresentationChartLineIcon /> },
            { id: 'EarlyWarningSystem', name: 'Early Warning System', icon: <PresentationChartLineIcon /> },
        ],
    };

    const renderApp = () => {
        switch (activeApp) {
            case 'CriteriaGenerator': return <CriteriaGenerator />;
            case 'RiskMitigationPlanner': return <RiskMitigationPlanner />;
            case 'DecisionMatrixMemo': return <DecisionMatrixMemo />;
            case 'ProjectCharterBuilder': return <ProjectCharterBuilder />;
            case 'BudgetEstimator': return <BudgetEstimator />;
            case 'CommunicationPlanGenerator': return <CommunicationPlanGenerator />;
            case 'WorkloadBalancer': return <WorkloadBalancer />;
            case 'SkillsGapAnalyzer': return <SkillsGapAnalyzer />;
            case 'ProjectPrioritizer': return <ProjectPrioritizer />;
            case 'NarrativeReportGenerator': return <NarrativeReportGenerator />;
            case 'CheckinSummarizer': return <CheckinSummarizer />;
            case 'EarlyWarningSystem': return <EarlyWarningSystem />;
            default: return <CriteriaGenerator />;
        }
    };
    
    const handleNavClick = (appId) => {
        setActiveApp(appId);
        if (window.innerWidth < 768) { // md breakpoint
            setIsSidebarOpen(false);
        }
    };

    const SidebarContent = () => (
        <nav className="p-4">
            <h1 className="text-xl font-bold text-white mb-6">AI Nonprofit Tools</h1>
            {Object.entries(apps).map(([lesson, appItems]) => (
                <div key={lesson} className="mb-6">
                    <h2 className="text-xs font-semibold text-indigo-200 uppercase tracking-wider mb-2">{lesson}</h2>
                    <ul className="space-y-1">
                        {appItems.map(app => (
                            <li key={app.id}>
                                <a href="#" onClick={(e) => {e.preventDefault(); handleNavClick(app.id);}}
                                   className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeApp === app.id ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}>
                                    {app.icon}
                                    <span>{app.name}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Mobile header */}
            <div className="md:hidden flex justify-between items-center w-full bg-indigo-600 text-white p-4 fixed top-0 left-0 z-20">
                <h1 className="text-lg font-bold">AI Nonprofit Tools</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <XIcon /> : <MenuIcon />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-200 ease-in-out bg-indigo-600 w-64 z-30 md:z-auto md:pt-0 pt-16`}>
                <SidebarContent />
            </div>

            {/* Main content */}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto mt-16 md:mt-0">
                <div className="max-w-4xl mx-auto">
                    {renderApp()}
                </div>
            </main>
        </div>
    );
};

export default App;
