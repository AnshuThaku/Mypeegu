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
        {
            question: "When I am online, I usually know how much time has passed.",
            options: ["Always", "Most of the time", "Once in a while", "Rarely"],
            type: "single"
        },
        {
            question: "I continue using apps or games even when I planned to stop.",
            options: ["Never", "Once in a while", "Many times a week", "Almost every day"],
            type: "single"
        },
        {
            question: "If I can't go online when I want to, I feel:",
            options: ["Fine", "A little restless", "Irritated or anxious", "Very uncomfortable or angry"],
            type: "single"
        }
    ],
    'SECTION 2: Games & Online Fun': [
        {
            question: "Do you play online or video games?",
            options: ["Yes, often", "Yes, sometimes", "Rarely", "I don't play games"],
            type: "single"
        },
        {
            question: "During or after gaming, I feel:",
            options: ["Calm", "Excited", "Frustrated", "Angry", "Very competitive", "I don't notice much change", "I don't play games"],
            type: "multiple" // Note: PDF allows multiple answers here
        },
        {
            question: "When something annoys me online (during games or chats), I usually:",
            options: ["Ignore it", "Log off or take a break", "Argue or reply angrily", "Block or report", "Stay upset for a long time", "Not applicable to me"],
            type: "single"
        }
    ],
    'SECTION 3: People I Talk to Online': [
        {
            question: "I chat or play online with people I don't know in real life.",
            options: ["Never", "Sometimes", "Often"],
            type: "single"
        },
        {
            question: "People I interact with online are mostly:",
            options: ["My age", "Older teens", "Adults", "I'm not sure"],
            type: "single"
        },
        {
            question: "Someone online has asked me for:",
            options: ["Personal information", "Photos or videos", "Private chats", "To keep secrets", "None of these"],
            type: "multiple" // Note: PDF allows multiple answers here
        }
    ],
    'SECTION 4: Things I See Online': [
        {
            question: "I have come across online content that felt not meant for my age.",
            options: ["Never", "Once or twice", "Many times"],
            type: "single"
        },
        {
            question: "When I see content that feels like \"too much,\" I usually:",
            options: ["Scroll past", "Keep watching", "Share or talk about it with friends", "Block or report it", "I don't know what to do"],
            type: "single"
        }
    ],
    'SECTION 5: Social Media & Me': [
        {
            question: "After using social media, I usually feel:",
            options: ["Confident", "Inspired", "Pressured to look or act a certain way", "Less confident", "No change"],
            type: "single"
        },
        {
            question: "I compare myself to people I see online.",
            options: ["Never", "Once in a while", "Often", "Almost always"],
            type: "single"
        }
    ],
    'SECTION 6: Being Respectful Online': [
        {
            question: "Jokes or comments about gender online are:",
            options: ["Just for fun", "Sometimes hurtful", "Often offensive", "Not okay at all"],
            type: "single"
        },
        {
            question: "I have seen people treated differently online because of:",
            options: ["Gender", "Appearance", "Language or accent", "Interests or hobbies", "I haven't noticed this"],
            type: "multiple" // Note: PDF allows multiple answers here
        }
    ],
    'SECTION 7: Making Choices Online': [
        {
            question: "If something online feels wrong, I can say \"no\" or leave.",
            options: ["Always", "Most of the time", "Once in a while", "Rarely"],
            type: "single"
        },
        {
            question: "If someone shared my post, message, photo, or personal information without permission, I would:",
            options: ["Ignore it", "Feel upset but do nothing", "Ask them to remove it", "Tell a trusted adult", "Not know what to do"],
            type: "single"
        }
    ],
    'SECTION 8: Getting Help When Needed': [
        {
            question: "If something serious happened online, I would tell:",
            options: ["Parent", "Teacher", "School counsellor", "Friend", "I wouldn't tell anyone"],
            type: "single"
        },
        {
            question: "I know how to block or report unsafe behaviour online.",
            options: ["Yes", "Somewhat", "No"],
            type: "single"
        }
    ],
    'SECTION 9: A Little About Me': [
        {
            question: "I always follow rules, even when no one is watching.",
            options: ["Strongly agree", "Agree", "Disagree", "Strongly disagree"],
            type: "single"
        },
        {
            question: "I never feel angry or upset with others online.",
            options: ["Strongly agree", "Agree", "Disagree", "Strongly disagree"],
            type: "single"
        },
        {
            question: "I always tell an adult if something online feels wrong.",
            options: ["Strongly agree", "Agree", "Disagree", "Strongly disagree"],
            type: "single"
        },
        {
            question: "I have never posted or said anything online that I later regretted.",
            options: ["Strongly agree", "Agree", "Disagree", "Strongly disagree"],
            type: "single"
        }
    ],
    'SECTION 10: Your Thoughts': [
        {
            question: "What do you think is the hardest part of being online for students your age?",
            options: [],
            type: "text"
        },
        {
            question: "What helps you feel safe or confident online?",
            options: [],
            type: "text"
        }
    ]
};