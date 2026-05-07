// SELConstants.js

export const selDomains = [
    'SELF-AWARENESS', 'SELF-MANAGEMENT', 'SOCIAL AWARENESS', 
    'RELATIONSHIP SKILLS', 'RESPONSIBLE DECISION-MAKING', 
    'ENGAGEMENT', 'OPTIMISM', 'CONNECTEDNESS', 'HAPPINESS'
];

// GRADES 3-5 VERSION (26 Items)
export const selQns_vA = {
    'SELF-AWARENESS': [
        "I can tell what I am feeling (like happy, sad, or angry)",
        "I can tell why I am feeling upset",
        "I notice when my feelings start to change"
    ],
    'SELF-MANAGEMENT': [
        "I can calm down when I feel upset",
        "I keep trying even when work feels difficult",
        "I wait my turn, even when I feel excited",
        "I can finish my work without getting distracted",
        "(R) I give up easily when things feel hard"
    ],
    'SOCIAL AWARENESS': [
        "I can tell when someone else is feeling upset",
        "I notice when someone is left out of a group",
        "I think about how others might feel"
    ],
    'RELATIONSHIP SKILLS': [
        "I can solve problems with friends without fighting",
        "I ask for help when I need it",
        "I listen when others are speaking to me",
        "I try to fix things after I hurt someone"
    ],
    'RESPONSIBLE DECISION-MAKING': [
        "I think before I act",
        "I think about what might happen next before I decide",
        "I try to make better choices after a mistake"
    ],
    'ENGAGEMENT': [
        "I feel interested in what I am learning",
        "I pay attention during class activities"
    ],
    'OPTIMISM': [
        "I believe things will get better when something goes wrong",
        "I feel positive about what will happen in the future"
    ],
    'CONNECTEDNESS': [
        "I feel like I belong in my class or school",
        "I have someone I can talk to when I feel upset",
        "(R) I feel like I don't belong in school"
    ],
    'HAPPINESS': [
        "I feel happy most days"
    ]
};

// GRADES 6-12 VERSION (26 Items)
export const selQns_vB = {
    'SELF-AWARENESS': [
        "I am aware of what I am feeling in different situations",
        "I understand why I feel the way I do",
        "I notice when my mood starts to change"
    ],
    'SELF-MANAGEMENT': [
        "I can manage my emotions when I feel stressed or upset",
        "I stay focused even when there are distractions",
        "I keep working towards my goals even when it feels difficult",
        "I can pause before reacting when I feel strong emotions",
        "(R) I give up when things become too difficult"
    ],
    'SOCIAL AWARENESS': [
        "I think about how my actions affect others",
        "I try to understand others' feelings before I respond",
        "I am open to people who are different from me"
    ],
    'RELATIONSHIP SKILLS': [
        "I can handle disagreements without things getting worse",
        "I express my thoughts clearly and respectfully",
        "I ask for support when I need it",
        "I am able to maintain supportive friendships"
    ],
    'RESPONSIBLE DECISION-MAKING': [
        "I think about the consequences before making decisions",
        "I make decisions that I feel good about later",
        "I take responsibility when my actions affect others"
    ],
    'ENGAGEMENT': [
        "I feel interested and involved in my learning",
        "I put effort into my schoolwork even when I don't feel like it"
    ],
    'OPTIMISM': [
        "I feel hopeful about my future",
        "I believe I can handle challenges that come my way"
    ],
    'CONNECTEDNESS': [
        "I feel like I belong at my school",
        "I have at least one person I can rely on for support",
        "(R) I feel disconnected from people at school"
    ],
    'HAPPINESS': [
        "I feel satisfied with my life most of the time"
    ]
};

// Response Scales
export const selScoringMapping = {
    versionA: {
        "Never": 1,
        "Sometimes": 2,
        "Often": 3,
    },
    versionB: {
        "Not true": 1,
        "A little true": 2,
        "Mostly true": 3,
        "Very true": 4
    }
};

export const getSELTier = (score) => {
    if (score >= 80) return { label: 'High Competency', color: '#43A047' };
    if (score >= 60) return { label: 'Developing', color: '#7CB342' };
    if (score >= 40) return { label: 'Emerging', color: '#FB8C00' };
    return { label: 'Needs Support', color: '#E53935' };
};