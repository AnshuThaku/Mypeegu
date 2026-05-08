import { localizationConstants } from '../../../resources/theme/localizationConstants';

export const safeSpacesColumn = [
    { id: 'user_id', label: 'ID', name: 'user_id', width: 100, sort: true },
    { id: 'academicYear', label: 'ACADEMIC YEAR', name: 'academicYear', width: 150 },
    { id: 'studentName', label: 'STUDENT NAME', name: 'studentName', width: 220, sort: true },
    { id: 'createdAt', label: 'CREATED DATE', name: 'createdAt', width: 150, sort: true },
    { id: 'Emotional', label: 'EMOTIONAL', name: 'Emotional', width: 120 },
    { id: 'Social', label: 'SOCIAL', name: 'Social', width: 120 },
    { id: 'Harm', label: 'EXP OF SCHOOL.', name: 'Harm', width: 120 },
    { id: 'Physical', label: 'PHYSICAL', name: 'Physical', width: 120 },
    { id: 'AdultSupport', label: 'ADULT SUPPORT', name: 'AdultSupport', width: 140 },
    { id: 'SystemResp', label: 'SYSTEM RESP.', name: 'SystemResp', width: 140 },
    { id: 'Agency', label: 'AGENCY', name: 'Agency', width: 120 },
    { id: 'actions', label: 'ACTIONS', name: 'showCategoryActions', width: 100 }
];

// MTSS Tiers Logic 
export const getTierByScore = (scorePercentage) => {
    if (scorePercentage >= 80) return { label: 'Safe & Supported', color: '#43A047' }; // Tier 1
    if (scorePercentage >= 60) return { label: 'Emerging Concerns', color: '#7CB342' }; // Tier 1-Monitor
    if (scorePercentage >= 40) return { label: 'At Risk', color: '#FB8C00' }; // Tier 2
    return { label: 'High Risk', color: '#E53935' }; // Tier 3
};

// VERSION A: GRADES 3-5 [cite: 492, 501, 506, 513]
export const safeSpacesQns_vA = {
    'Emotional': [
        "I feel happy and calm when I am at school.",
        "I feel safe in my classroom."
    ],
    'Social': [
        "I feel included and accepted by other students.",
        "I have at least one friend I can talk to."
    ],
    'Experiences Of School': [
    {
        question: "In the past few weeks, has anyone at school:",
        options: [
              "Hit, pushed, or  hurt you",
      "Said mean or hurtful things ",
      "Left you out on purpose "
        ],
        responseScale: ["Never", "Once or twice", "Many times"]
    }
],
    'Physical': [
        "I feel safe in different places at school (class, playground, washroom)."
    ],
    'AdultSupport': [
        "There is at least one adult at school I can go to if I feel upset or unsafe."
    ],
    'SystemResp': [
        "When someone gets hurt or bullied, teachers help and stop it."
    ],
    'Agency': [
        "When something upsets me at school, I tell someone I trust.",
        "If I see someone being hurt, I try to help or tell an adult."
    ]
};

// VERSION B: GRADES 6-12 [cite: 543, 552, 555, 558]
export const safeSpacesQns_vB = {
    'Emotional': [
        "I feel safe in my classroom.",
        "I feel safe in school overall."
    ],
    'Social': [
        "I feel included and accepted by other students.",
        "I feel like I belong in this school."
    ],
    'Experiences Of School': [
        "In the past 4 weeks, how often have you personally experienced physical/verbal harm, social exclusion, or online bullying?",
        "In the past 4 weeks, how often have you seen others being bullied?"
    ],
    'Physical': [
        "Which areas feel unsafe? (Select all that apply or 'I feel safe in all areas')",
        "I see physical fights happening between students.",
        "I have personally felt physically unsafe at school."
    ],
    'AdultSupport': [
        "I feel safe approaching teachers or school staff.",
        "I have at least one trusted adult at school."
    ],
    'SystemResp': [
        "When unsafe situations happen, staff respond effectively."
    ],
    'Agency': [
        "When something concerns me, I report it or seek help.",
        "I feel comfortable speaking up about safety concerns."
    ]
};

// SCORING OPTIONS [cite: 587, 591]
export const scoringOptions_vA = ["Most of the time", "Sometimes", "Hardly ever"];
export const scoringOptions_vB = ["Always", "Often", "Sometimes", "Never"];

export const scoringMapping = {
    versionA: { "Most of the time": 3, "Sometimes": 2, "Hardly ever": 1 },
    versionB: { "Always": 4, "Often": 3, "Sometimes": 2, "Never": 1 }
};