// ============================================================
// H.E.A.R.T. Model - Psychological Safety for Educators
// ============================================================

export const heartColumn = [
    { id: 'code_name', label: 'CODE NAME', name: 'code_name', width: 180, sort: true },
    { id: 'grades_taught', label: 'GRADES TAUGHT', name: 'grades_taught', width: 150 },
    { id: 'createdAt', label: 'DATE', name: 'createdAt', width: 130, sort: true },
    { id: 'Honesty', label: 'HONESTY', name: 'Honesty', width: 120 },
    { id: 'Empathy', label: 'EMPATHY', name: 'Empathy', width: 120 },
    { id: 'Autonomy', label: 'AUTONOMY', name: 'Autonomy', width: 120 },
    { id: 'Respect', label: 'RESPECT', name: 'Respect', width: 120 },
    { id: 'Trust', label: 'TRUST', name: 'Trust', width: 120 },
    { id: 'overallScore', label: 'OVERALL', name: 'overallScore', width: 110 },
    { id: 'actions', label: 'ACTIONS', name: 'showCategoryActions', width: 100 },
];

// ---------------------------------------------------------------
// SAFETY BAND based on score percentage 
// PDF Step 3 maps 61-75 (out of 75) as High, which is >= 81%
// ---------------------------------------------------------------
export const getSafetyBandByScore = (scorePercentage) => {
    if (scorePercentage >= 81) return { label: 'High Psychological Safety', color: '#43A047', band: 'High' };
    if (scorePercentage >= 61) return { label: 'Moderate Psychological Safety', color: '#7CB342', band: 'Moderate' };
    if (scorePercentage >= 41) return { label: 'Low Psychological Safety', color: '#FB8C00', band: 'Low' };
    return { label: 'Very Low Psychological Safety', color: '#E53935', band: 'Very Low' };
};

// ---------------------------------------------------------------
// SCORING OPTIONS — Likert 5-point
// ---------------------------------------------------------------
export const heartScoringOptions = [
    'Strongly Agree',
    'Agree',
    'Neutral',
    'Disagree',
    'Strongly Disagree',
];

export const heartScoringMapping = {
    'Strongly Agree': 5,
    'Agree': 4,
    'Neutral': 3,
    'Disagree': 2,
    'Strongly Disagree': 1,
};

export const MAX_SCORE_PER_QUESTION = 5;

// ---------------------------------------------------------------
// SURVEY QUESTIONS — Mapped exactly to PDF Sections 1-4
// ---------------------------------------------------------------
export const heartQuestions = {
    'Section 1: General Psychological Safety': [
        { id: 'q1', text: 'I feel comfortable expressing my ideas or opinions in staff meetings without fear of negative consequences.' },
        { id: 'q2', text: 'I can admit mistakes or ask questions without feeling embarrassed or punished.' },
        { id: 'q3', text: 'I feel included in decisions that affect my teaching or work environment.' },
        { id: 'q4', text: 'I believe it is safe to challenge ideas or suggest alternative approaches in my school.' }
    ],
    'Section 2: Leadership Support & Trust': [
        { id: 'q5', text: 'School leadership listens to teachers\' concerns and acts on them appropriately.' },
        { id: 'q6', text: 'I trust the school leadership to treat staff fairly.' },
        { id: 'q7', text: 'Feedback from leadership is constructive and helps me improve my work.' },
        { id: 'q8', text: 'Leadership encourages open discussion and respects diverse opinions.' }
    ],
    'Section 3: Peer Support & Collaboration': [
        { id: 'q9', text: 'I feel supported by my colleagues in both teaching and professional challenges.' },
        { id: 'q10', text: 'Collaboration and sharing ideas among teachers is encouraged in my school.' },
        { id: 'q11', text: 'Conflicts among staff are resolved in a fair and respectful manner.' }
    ],
    'Section 4: Emotional Wellbeing & Respect': [
        { id: 'q12', text: 'My mental health and wellbeing are acknowledged and supported at school.' },
        { id: 'q13', text: 'I feel respected by colleagues regardless of experience, role, or background.' },
        { id: 'q14', text: 'I feel safe sharing when I am struggling or stressed at work.' },
        { id: 'q15', text: 'Mistakes or failures are treated as learning opportunities rather than reasons for blame.' }
    ]
};

// ---------------------------------------------------------------
// OPEN-ENDED QUESTIONS — Section 5 (Q16–Q18)
// ---------------------------------------------------------------
export const heartOpenEndedQuestions = [
    'What makes you feel most supported at school?',
    'What situations make you feel unsafe or hesitant to speak up?',
    'What suggestions do you have for improving psychological safety among teachers?'
];

// ---------------------------------------------------------------
// DOMAIN INFO
// ---------------------------------------------------------------
export const heartDomainInfo = {
    'Honesty':  { color: '#E53935' },
    'Empathy':  { color: '#FB8C00' },
    'Autonomy': { color: '#7CB342' },
    'Respect':  { color: '#0267D9' },
    'Trust':    { color: '#7B1FA2' },
};