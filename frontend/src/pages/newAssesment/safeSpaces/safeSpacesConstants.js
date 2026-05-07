import { localizationConstants } from '../../../resources/theme/localizationConstants';

export const safeSpacesColumn = [
    { id: 'user_id', label: 'ID', name: 'user_id', width: 100, sort: true },
    { id: 'academicYear', label: 'ACADEMIC YEAR', name: 'academicYear', width: 150, sort: true },
    { id: 'studentName', label: 'STUDENT NAME', name: 'studentName', width: 220, sort: true },
    { id: 'createdAt', label: 'CREATED DATE', name: 'createdAt', width: 150, sort: true },
    { id: 'Emotional', label: 'EMOTIONAL', name: 'Emotional', width: 120 },
    { id: 'Physical', label: 'PHYSICAL', name: 'Physical', width: 120 },
    { id: 'Social', label: 'SOCIAL', name: 'Social', width: 120 },
    { id: 'AdultSupport', label: 'ADULT SUPPORT', name: 'AdultSupport', width: 140 },
    { id: 'SystemResp', label: 'SYSTEM RESP.', name: 'SystemResp', width: 140 },
    { id: 'Agency', label: 'AGENCY', name: 'Agency', width: 120 },
    { id: 'actions', label: 'ACTIONS', name: 'showCategoryActions', width: 100 }
];

// Helper to get color based on Tier (like getBackgroundColor in baseline)
export const getTierColor = (score) => {
    if (score >= 80) return '#43A047'; // Green (Safe)
    if (score >= 60) return '#7CB342'; // Light Green (Monitor)
    if (score >= 40) return '#FB8C00'; // Orange (At Risk)
    return '#E53935'; // Red (High Risk)
};

// 1. CORE DOMAINS (BOTH VERSIONS)
export const safeSpacesDomains = [
    'Emotional Safety',
    'Social Belonging',
    'Experiences of Harm',
    'Environmental Safety',
    'Physical Safety Climate',
    'Adult Support',
    'System Responsiveness',
    'Student Agency',
    'Student Voice'
];

// 2. VERSION A: GRADES 3-5 QUESTIONS[cite: 1]
export const safeSpacesQns_vA = {
    'Emotional Safety': [
        "I feel happy and calm when I am at school.",
        "I feel safe in my classroom."
    ],
    'Social Belonging': [
        "I feel included and accepted by other students.",
        "I have at least one friend I can talk to."
    ],
    'Experiences of Harm': [
        "In the past few weeks, has anyone at school hit, pushed, or hurt you; said mean things; or left you out on purpose?"
    ],
    'Physical Safety': [
        "I feel safe in different places at school (class, playground, washroom)."
    ],
    'Adult Support': [
        "There is at least one adult at school I can go to if I feel upset or unsafe."
    ],
    'System Responsiveness': [
        "When someone gets hurt or bullied, teachers help and stop it."
    ],
    'Student Agency': [
        "When something upsets me at school, I tell someone I trust.",
        "If I see someone being hurt, I try to help or tell an adult."
    ],
    'Student Voice': [
        "Is there anything you want to share about how you feel at school? (Optional)"
    ]
};

// 3. VERSION B: GRADES 6-12 QUESTIONS[cite: 1]
export const safeSpacesQns_vB = {
    'Emotional Safety': [
        "I feel safe in my classroom.",
        "I feel safe in school overall."
    ],
    'Social Belonging': [
        "I feel included and accepted by other students.",
        "I feel like I belong in this school."
    ],
    'Experiences of Harm': [
        "In the past 4 weeks, how often have you personally experienced physical/verbal harm, social exclusion, or online bullying?",
        "In the past 4 weeks, how often have you seen others being bullied?"
    ],
    'Environmental Safety': [
        "Which areas feel unsafe? (Select all that apply or 'I feel safe in all areas')"
    ],
    'Physical Safety Climate': [
        "I see physical fights happening between students.",
        "I have personally felt physically unsafe at school."
    ],
    'Adult Support': [
        "I feel safe approaching teachers or school staff.",
        "I have at least one trusted adult at school."
    ],
    'System Responsiveness': [
        "When unsafe situations happen, staff respond effectively."
    ],
    'Student Agency': [
        "When something concerns me, I report it or seek help.",
        "I feel comfortable speaking up about safety concerns."
    ],
    'Student Voice': [
        "What would help you feel safer at school?"
    ]
};

// 4. SCORING NUMERICAL MAPPING[cite: 1]
export const scoringMapping = {
    versionA: {
        "Most of the time": 3,
        "Sometimes": 2,
        "Hardly ever": 1,
    },
    versionB: {
        "Always": 4,
        "Often": 3,
        "Sometimes": 2,
        "Never": 1
    }
};

// 5. TIERING SYSTEM (MTSS ALIGNED)[cite: 1]
export const safeSpacesTiers = [
    {
        tier: 'Tier 1',
        range: '80-100%',
        label: 'Safe & Supported',
        color: '#43A047' // Green
    },
    {
        tier: 'Tier 1-Monitor',
        range: '60-79%',
        label: 'Emerging Concerns',
        color: '#7CB342' // Light Green
    },
    {
        tier: 'Tier 2',
        range: '40-59%',
        label: 'At Risk',
        color: '#FB8C00' // Orange
    },
    {
        tier: 'Tier 3',
        range: '<40%',
        label: 'High Risk',
        color: '#E53935' // Red
    }
];

// 6. TRIGGER ENGINE FLAGS[cite: 1]
// Inko aap table row ya drawer me highlight karne ke liye use kar sakte hain
export const autoFlags = [
    "Reports frequent harm (Many times / Often)",
    "No trusted adult",
    "Does not seek help",
    "Feels unsafe often"
];

// 7. ARCHETYPES (ADVANCED INSIGHT)[cite: 1]
export const studentArchetypes = [
    'Secure & Supported',
    'Quietly Disengaged',
    'At-Risk but Silent',
    'Actively Unsafe',
    'Empathetic Bystander'
];

// Helper to get Tier details based on percentage
export const getTierByScore = (scorePercentage) => {
    if (scorePercentage >= 80) return safeSpacesTiers[0];
    if (scorePercentage >= 60) return safeSpacesTiers[1];
    if (scorePercentage >= 40) return safeSpacesTiers[2];
    return safeSpacesTiers[3];
};