const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIEvaluatorService {
    // 🟢 UPDATE: Added mimeType parameter (defaults to PDF)
    async generateIEPAIContent(studentData, pdfBuffer = null, mimeType = "application/pdf") {
        try {
            // 🟢 1. Context & Safety Extraction
            const profile = studentData?.studentProfile || {};
            const studentName = profile.studentName ? profile.studentName.trim() : "the student";
            const studentAge = profile.dob ? (new Date().getFullYear() - new Date(profile.dob).getFullYear()) : "N/A";

            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            
            // 🟢 2. Model Configuration: Gemini 1.5 Series (Natively reads PDFs!)
            const model = genAI.getGenerativeModel({ 
                model: "gemini-flash-latest", // Use "gemini-1.5-pro" if you want even deeper clinical reasoning
                generationConfig: {
                    responseMimeType: "application/json", 
                    temperature: 0.1 // Low temp for absolute precision and zero hallucination
                }
            });

            // 🟢 3. THE GOD-LEVEL CLINICAL PROMPT
            // Notice: Removed extractedText. Now instructing the model to look at the attached file.
            const prompt = `
            You are a world-class Neurodevelopmental Psychologist and Special Educator. 
            Synthesize a comprehensive Individualized Education Program (IEP) for the student: "${studentName}".

            [SOURCE DATA TO ANALYZE]
            1. Target Student: ${studentName} (Age: ${studentAge})
            2. Clinical/Diagnostic Report: [See the attached PDF document. If no PDF is attached, rely purely on the other data below].
            3. Teacher Classroom Observations: ${JSON.stringify(studentData?.observations || [])}
            4. Skill Baseline (0-7 scale): ${JSON.stringify(studentData?.baseline || {})}
            5. Behavioral Checklist Flags: ${JSON.stringify(studentData?.checklist || [])}

            [CRITICAL DIRECTIVES]
            - IDENTITY: You MUST use the name "${studentName}" in every single goal, summary, and analysis. Never use placeholders.
            - TRIANGULATION: If the Clinical Report diagnoses ADHD, find supporting evidence in the Teacher Observations (e.g., "lack of focus") and link them in your analysis.
            - REAL DATA ONLY: Extract actual IQ scores, percentiles, and exact medical diagnoses from the Clinical Report. Do not guess.
            - SMART GOALS: Write goals that are Highly Specific, Measurable, Achievable, Relevant, and Time-bound (e.g., "Within 3 months...").

            [REQUIRED JSON OUTPUT STRUCTURE]
            Return ONLY valid JSON matching this exact structure:
            {
              "evaluationData": {
                "studentProfile": "Name: ${studentName} | Age: ${studentAge} | Summary: [1-2 line powerful synthesis]",
                "diagnosis": "[Exact medical/clinical diagnosis extracted from the report. If none, state findings based on checklists]",
                "cognitiveStrengths": "[List specific cognitive or academic assets]",
                "strengthsWeaknesses": "Strengths: [list]. Weaknesses: [list].",
                "recommendations": "[List exact accommodations and interventions suggested by the doctor or teacher]"
              },
              "plopAnalysis": {
                "physical": "[Synthesize physical/motor skills based on data]", 
                "social": "[Synthesize social interactions and peer behavior]", 
                "emotional": "[Synthesize emotional regulation and mood]", 
                "cognitive": "[Synthesize academic and IQ data]", 
                "language": "[Synthesize speech, communication, and verbal expression]"
              },
              "aiGeneratedGoals": [
                { "goalType": "ShortTerm", "domain": "Attention & Focus", "goalDescription": "Within 3 months, ${studentName} will..." },
                { "goalType": "LongTerm", "domain": "Attention & Focus", "goalDescription": "Within 1 year, ${studentName} will..." },
                { "goalType": "ShortTerm", "domain": "Social Skills", "goalDescription": "..." },
                { "goalType": "LongTerm", "domain": "Social Skills", "goalDescription": "..." },
                { "goalType": "ShortTerm", "domain": "Emotional Regulation", "goalDescription": "..." },
                { "goalType": "LongTerm", "domain": "Emotional Regulation", "goalDescription": "..." },
                { "goalType": "ShortTerm", "domain": "Academic/Cognitive", "goalDescription": "..." },
                { "goalType": "LongTerm", "domain": "Academic/Cognitive", "goalDescription": "..." }
              ],
              "supportNeeds": {
                "accommodations": {
                  "specialEducationClasses": "Yes/No",
                  "behavioralInterventions": "Yes/No",
                  "oneOnOneHRT": "Yes/No",
                  "focusClasses": "Yes/No",
                  "accommodationsInSchool": "Yes/No",
                  "assistiveTechnology": "Yes/No"
                },
                "transitionPlanning": {
                  "communityExperience": "Yes/No",
                  "activitiesOfDailyLiving": "Yes/No",
                  "functionalVocationalAssistance": "Yes/No"
                },
                "placement": {
                  "individualSessions": "Yes/No",
                  "individualSessionCount": "1 session/2 sessions/Daily/No",
                  "groupSessions": "Yes/No"
                }
              }
            }`;

            // 🟢 4. PREPARE MULTIMODAL PAYLOAD (Prompt + PDF Document)
            const contentParts = [prompt];
            
            if (pdfBuffer) {
                // If a PDF is provided, convert to Base64 and attach it inline for Gemini to read natively
                contentParts.push({
                    inlineData: {
                        data: pdfBuffer.toString("base64"),
                        mimeType: mimeType
                    }
                });
                console.log("🚀 PDF Document successfully attached to Gemini request!");
            }

            // Generate Content (Passing the array of prompt + PDF)
            const result = await model.generateContent(contentParts);
            let textResponse = result.response.text();

            // 🟢 5. Bulletproof JSON Parser
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("AI did not return a valid JSON object.");
            
            let parsedResult;
            try {
                parsedResult = JSON.parse(jsonMatch[0]);
            } catch (parseError) {
                console.error("❌ JSON Parse Error. Raw Output:", textResponse);
                throw new Error("Failed to parse AI response into JSON.");
            }

            // 🟢 6. Aggressive Post-Processing Safety Net
            const genericNamesRegex = new RegExp("the student|the client|Hridhaan", "gi"); 
            
            if (parsedResult.aiGeneratedGoals && Array.isArray(parsedResult.aiGeneratedGoals)) {
                parsedResult.aiGeneratedGoals = parsedResult.aiGeneratedGoals.map(goal => ({
                    ...goal,
                    goalDescription: goal.goalDescription.replace(genericNamesRegex, studentName)
                }));
            }

            return parsedResult;

        } catch (error) {
            console.error('❌ Critical Error in AI Evaluation Service:', error);
            throw error;
        }
    }
}

module.exports = new AIEvaluatorService();