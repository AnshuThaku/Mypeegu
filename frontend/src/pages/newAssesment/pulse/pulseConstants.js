export const pulseColumn = [
    { id: 'user_id', label: 'ID', name: 'user_id', width: 100, sort: true },
    { id: 'academicYear', label: 'ACADEMIC YEAR', name: 'academicYear', width: 140 },
    { id: 'studentName', label: 'STUDENT NAME', name: 'studentName', width: 220, sort: true },
    { id: 'createdAt', label: 'CREATED DATE', name: 'createdAt', width: 140, sort: true },
    { id: 'OnlineTime', label: 'ONLINE TIME', name: 'OnlineTime', width: 130 },
    { id: 'GamesFun', label: 'GAMES & FUN', name: 'GamesFun', width: 130 },
    { id: 'PeopleOnline', label: 'PEOPLE ONLINE', name: 'PeopleOnline', width: 140 },
    { id: 'ThingsISee', label: 'THINGS I SEE', name: 'ThingsISee', width: 130 },
    { id: 'SocialMedia', label: 'SOCIAL MEDIA', name: 'SocialMedia', width: 130 },
    { id: 'Respectful', label: 'RESPECT ONLINE', name: 'Respectful', width: 150 },
    { id: 'MakingChoices', label: 'MAKING CHOICES', name: 'MakingChoices', width: 150 },
    { id: 'GettingHelp', label: 'GETTING HELP', name: 'GettingHelp', width: 140 },
    { id: 'AboutMe', label: 'ABOUT ME', name: 'AboutMe', width: 120 },
    { id: 'actions', label: 'ACTIONS', name: 'showCategoryActions', width: 100 }
];

export const pulseQuestions = {
    'SECTION 1: My Online Time': [
        "When I am online, I usually know how much time has passed.",
        "I continue using apps or games even when I planned to stop.",
        "If I can't go online when I want to, I feel:"
    ],
    'SECTION 2: Games & Online Fun': [
        "Do you play online or video games?",
        "During or after gaming, I feel:",
        "When something annoys me online (during games or chats), I usually:"
    ],
    'SECTION 3: People I Talk to Online': [
        "I chat or play online with people I don't know in real life.",
        "People I interact with online are mostly:",
        "Someone online has asked me for:"
    ],
    'SECTION 4: Things I See Online': [
        "I have come across online content that felt not meant for my age.",
        "When I see content that feels like \"too much,\" I usually:"
    ],
    'SECTION 5: Social Media & Me': [
        "After using social media, I usually feel:",
        "I compare myself to people I see online."
    ],
    'SECTION 6: Being Respectful Online': [
        "Jokes or comments about gender online are:",
        "I have seen people treated differently online because of:"
    ],
    'SECTION 7: Making Choices Online': [
        "If something online feels wrong, I can say \"no\" or leave.",
        "If someone shared my post, message, photo, or personal information without permission, I would:"
    ],
    'SECTION 8: Getting Help When Needed': [
        "If something serious happened online, I would tell:",
        "I know how to block or report unsafe behaviour online."
    ],
    'SECTION 9: A Little About Me': [
        "I always follow rules, even when no one is watching.",
        "I never feel angry or upset with others online.",
        "I always tell an adult if something online feels wrong.",
        "I have never posted or said anything online that I later regretted."
    ],
    'SECTION 10: Your Thoughts': [
        "What do you think is the hardest part of being online for students your age?",
        "What helps you feel safe or confident online?"
    ]
};

export const pulseOptions = ["Always", "Often", "Sometimes", "Never"];