// Constants based on HEART Model-Psychological Safety for Educators (1).pdf[cite: 1]
export const heartDomains = [
    'Honesty',
    'Empathy',
    'Autonomy',
    'Respect',
    'Trust'
];

export const heartQuestions = {
    'Honesty': [
        "I feel comfortable expressing my ideas or opinions in staff meetings without fear of negative consequences.",
        "I can admit mistakes or ask questions without feeling embarrassed or punished.",
        "I feel included in decisions that affect my teaching or work environment.",
        "I believe it is safe to challenge ideas or suggest alternative approaches in my school."
    ],
    'Empathy': [
        "My mental health and wellbeing are acknowledged and supported at school.",
        "I feel safe sharing when I am struggling or stressed at work.",
        "I feel supported by my colleagues in both teaching and professional challenges."
    ],
    'Autonomy': [
        "I have freedom and agency in making decisions related to teaching and classroom management.",
        "Leadership encourages open discussion and respects diverse opinions.",
        "I am involved in policy or curriculum decisions that affect my work."
    ],
    'Respect': [
        "I feel respected by colleagues regardless of experience, role, or background.",
        "Mistakes or failures are treated as learning opportunities rather than reasons for blame.",
        "Dignity and recognition are provided for all staff members."
    ],
    'Trust': [
        "I trust the school leadership to treat staff fairly.",
        "School leadership listens to teachers' concerns and acts on them appropriately.",
        "Conflicts among staff are resolved in a fair and respectful manner."
    ]
};

export const heartScoringMapping = {
    'Strongly Agree': 5,
    'Agree': 4,
    'Neutral': 3,
    'Disagree': 2,
    'Strongly Disagree': 1
};

// Interpretation based on 15-75 score range[cite: 1]
export const getHeartTier = (score) => {
    if (score >= 61) return { label: 'High', color: '#43A047' };
    if (score >= 46) return { label: 'Moderate', color: '#7CB342' };
    if (score >= 31) return { label: 'Low', color: '#FB8C00' };
    return { label: 'Very Low', color: '#E53935' };
};