import { sortEnum } from '../../../utils/utils';

export const selColumn = [
    { id: 'user_id', label: 'ID', name: 'user_id', width: 100, sort: sortEnum.asc },
    { id: 'academicYear', label: 'ACADEMIC YEAR', name: 'academicYear', width: 130 },
    { id: 'studentName', label: 'STUDENT NAME', name: 'studentName', width: 200, sort: sortEnum.asc },
    { id: 'createdAt', label: 'CREATED DATE', name: 'createdAt', width: 130, sort: sortEnum.desc },
    { id: 'SELF-AWARENESS', label: 'SELF-AWARENESS', name: 'SELF-AWARENESS', width: 150 },
    { id: 'SELF-MANAGEMENT', label: 'SELF-MANAGEMENT', name: 'SELF-MANAGEMENT', width: 160 },
    { id: 'SOCIAL AWARENESS', label: 'SOCIAL AWARENESS', name: 'SOCIAL AWARENESS', width: 160 },
    { id: 'RELATIONSHIP SKILLS', label: 'RELATIONSHIP', name: 'RELATIONSHIP SKILLS', width: 140 },
    { id: 'RESPONSIBLE DECISION-MAKING', label: 'DECISION-MAKING', name: 'RESPONSIBLE DECISION-MAKING', width: 160 },
    { id: 'ENGAGEMENT', label: 'ENGAGEMENT', name: 'ENGAGEMENT', width: 130 },
    { id: 'OPTIMISM', label: 'OPTIMISM', name: 'OPTIMISM', width: 120 },
    { id: 'CONNECTEDNESS', label: 'CONNECTEDNESS', name: 'CONNECTEDNESS', width: 150 },
    { id: 'HAPPINESS', label: 'HAPPINESS', name: 'HAPPINESS', width: 120 },
    { id: 'actions', label: 'ACTIONS', name: 'showCategoryActions', width: 100 }
];

export const selQns_vA = {
    'SELF-AWARENESS': [
        "1. I can tell what I am feeling (like happy, sad, or angry)",
        "2. I can tell why I am feeling upset",
        "3. I notice when my feelings start to change"
    ],
    'SELF-MANAGEMENT': [
        "4. I can calm down when I feel upset",
        "5. I keep trying even when work feels difficult",
        "6. I wait my turn, even when I feel excited",
        "7. I can finish my work without getting distracted",
        "8. I give up easily when things feel hard"
    ],
    'SOCIAL AWARENESS': [
        "9. I can tell when someone else is feeling upset",
        "10. I notice when someone is left out of a group",
        "11. I think about how others might feel"
    ],
    'RELATIONSHIP SKILLS': [
        "12. I can solve problems with friends without fighting",
        "13. I ask for help when I need it",
        "14. I listen when others are speaking to me",
        "15. I try to fix things after I hurt someone"
    ],
    'RESPONSIBLE DECISION-MAKING': [
        "16. I think before I act",
        "17. I think about what might happen next before I decide",
        "18. I try to make better choices after a mistake"
    ],
    'ENGAGEMENT': [
        "19. I feel interested in what I am learning",
        "20. I pay attention during class activities"
    ],
    'OPTIMISM': [
        "21. I believe things will get better when something goes wrong",
        "22. I feel positive about what will happen in the future"
    ],
    'CONNECTEDNESS': [
        "23. I feel like I belong in my class or school",
        "24. I have someone I can talk to when I feel upset",
        "25. I feel like I don't belong in school"
    ],
    'HAPPINESS': [
        "26. I feel happy most days"
    ]
};

export const selQns_vB = {
    'SELF-AWARENESS': [
        "1. I am aware of what I am feeling in different situations",
        "2. I understand why I feel the way I do",
        "3. I notice when my mood starts to change"
    ],
    'SELF-MANAGEMENT': [
        "4. I can manage my emotions when I feel stressed or upset",
        "5. I stay focused even when there are distractions",
        "6. I keep working towards my goals even when it feels difficult",
        "7. I can pause before reacting when I feel strong emotions",
        "8. I give up when things become too difficult"
    ],
    'SOCIAL AWARENESS': [
        "9. I think about how my actions affect others",
        "10. I try to understand others' feelings before I respond",
        "11. I am open to people who are different from me"
    ],
    'RELATIONSHIP SKILLS': [
        "12. I can handle disagreements without things getting worse",
        "13. I express my thoughts clearly and respectfully",
        "14. I ask for support when I need it",
        "15. I am able to maintain supportive friendships"
    ],
    'RESPONSIBLE DECISION-MAKING': [
        "16. I think about the consequences before making decisions",
        "17. I make decisions that I feel good about later",
        "18. I take responsibility when my actions affect others"
    ],
    'ENGAGEMENT': [
        "19. I feel interested and involved in my learning",
        "20. I put effort into my schoolwork even when I don't feel like it"
    ],
    'OPTIMISM': [
        "21. I feel hopeful about my future",
        "22. I believe I can handle challenges that come my way"
    ],
    'CONNECTEDNESS': [
        "23. I feel like I belong at my school",
        "24. I have at least one person I can rely on for support",
        "25. (R) I feel disconnected from people at school"
    ],
    'HAPPINESS': [
        "26. I feel satisfied with my life most of the time"
    ]
};

export const scoringOptions_vA = ["Often", "Sometimes", "Never"];
export const scoringOptions_vB = ["Very true", "Mostly true", "A little true", "Not true"];

export const selScoringMapping = {
    versionA: { "Often": 3, "Sometimes": 2, "Never": 1 },
    versionB: { "Very true": 4, "Mostly true": 3, "A little true": 2, "Not true": 1 }
};

// Returns Tier based on decimal average (out of 3 or 4)
export const getSELTier = (averageScore, version) => {
    const maxScore = version === 'versionA' ? 3 : 4;
    const percentage = (averageScore / maxScore) * 100;
    
    if (percentage >= 80) return { label: 'High Competency', color: '#43A047' };
    if (percentage >= 60) return { label: 'Developing', color: '#7CB342' };
    if (percentage >= 40) return { label: 'Emerging', color: '#FB8C00' };
    return { label: 'Needs Support', color: '#E53935' };
};