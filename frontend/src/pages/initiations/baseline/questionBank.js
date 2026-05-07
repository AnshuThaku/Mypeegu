// questionBank.js

export const QUESTION_BANK = {
  "G6-8": {
    options: ["Never", "Sometimes", "Often", "Almost Always"],
    questions: [
      // EMOTIONAL REGULATION
      { 
        text: "When I feel worried or stressed, I don't always know why", 
        domain: "Emotional Regulation", 
        categoryLabel: "Feelings",
        introPrompt: "In the past 2–3 weeks, think about moments when you felt upset, worried, or unsure of your feelings.",
        reverseScored: false 
      },
      { 
        text: "When I feel upset or angry, it takes me time to calm down", 
        domain: "Emotional Regulation", 
        categoryLabel: "Feelings",
        introPrompt: "Think about a recent time when something made you feel angry or hurt — how long did it take to feel better?",
        reverseScored: false 
      },
      { 
        text: "I feel good about myself and what I can do", 
        domain: "Emotional Regulation", 
        categoryLabel: "Feelings",
        introPrompt: "Think about how you feel about yourself and the things you are able to do.",
        reverseScored: true 
      },

      // ATTENTION & WORKING MEMORY
      { 
        text: "When I am studying or doing homework, I get distracted easily", 
        domain: "Attention & Working Memory", 
        categoryLabel: "Focus",
        introPrompt: "In the past 2–3 weeks, think about when you were trying to study or finish schoolwork at home.",
        reverseScored: false 
      },
      { 
        text: "I forget instructions or what I was supposed to do", 
        domain: "Attention & Working Memory", 
        categoryLabel: "Focus",
        introPrompt: "Think about times when a teacher or parent gave you instructions for a task — how well did you remember?",
        reverseScored: false 
      },
      { 
        text: "I can stay focused on a task until I finish it", 
        domain: "Attention & Working Memory", 
        categoryLabel: "Focus",
        introPrompt: "Think about how you usually manage to complete a piece of work once you have started.",
        reverseScored: true 
      },

      // SOCIAL & PEER INTERACTION
      { 
        text: "I feel left out or not included sometimes", 
        domain: "Social & Peer Interaction", 
        categoryLabel: "Friends",
        introPrompt: "In the past 2–3 weeks, think about how you have been feeling with your classmates and friends.",
        reverseScored: false 
      },
      { 
        text: "I find it easy to make and keep friends", 
        domain: "Social & Peer Interaction", 
        categoryLabel: "Friends",
        introPrompt: "Think about how comfortable you feel starting or keeping friendships with people around you.",
        reverseScored: true 
      },
      { 
        text: "I feel shy or nervous when talking to classmates", 
        domain: "Social & Peer Interaction", 
        categoryLabel: "Friends",
        introPrompt: "Think about times when you needed to speak to a classmate or join a group conversation.",
        reverseScored: false 
      },

      // HELP-SEEKING
      { 
        text: "When I don't understand something I ask for help", 
        domain: "Help-Seeking", 
        categoryLabel: "Asking for Help",
        introPrompt: "In the past 2–3 weeks, think about times when you were stuck on a task — did you reach out for support?",
        reverseScored: true 
      },
      { 
        text: "I keep my problems to myself even when I need help", 
        domain: "Help-Seeking", 
        categoryLabel: "Asking for Help",
        introPrompt: "Think about how you usually deal with difficulties — do you prefer to handle them alone?",
        reverseScored: false 
      },
      { 
        text: "I know who I can go to when I need help", 
        domain: "Help-Seeking", 
        categoryLabel: "Asking for Help",
        introPrompt: "Think about the people around you — teachers, friends, or family — who you can trust when you need advice.",
        reverseScored: true 
      }
    ]
  },

  "G8-9": {
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
    questions: [
      // ORGANISATION & EXECUTION
      { 
        text: "I am able to plan and manage my schoolwork across subjects", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "In the past 2–3 weeks, think about how you have been managing your school assignments and deadlines.",
        reverseScored: true 
      },
      { 
        text: "I sometimes leave important work until the last minute", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "Think about a time when you had an important task or assignment — did you start it early or delay it?",
        reverseScored: false 
      },

      // ATTENTION & PERSISTENCE
      { 
        text: "When work becomes long or difficult, my attention shifts to other things", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Staying On Task",
        introPrompt: "In the past 2–3 weeks, think about how you manage to keep going when study feels hard or boring.",
        reverseScored: false 
      },
      { 
        text: "I can stay focused even when work is challenging", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Staying On Task",
        introPrompt: "Think about times when you were studying something difficult — were you able to keep at it?",
        reverseScored: true 
      },

      // WORKING MEMORY
      { 
        text: "When tasks have many steps, I sometimes forget what I need to do", 
        domain: "Working Memory", 
        categoryLabel: "Remembering & Keeping Track",
        introPrompt: "In the past 2–3 weeks, think about times when a task had many steps and you had to remember what to do next.",
        reverseScored: false 
      },

      // EMOTIONAL REGULATION
      { 
        text: "There are times when my emotions feel difficult to manage", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "In the past 2–3 weeks, think about times when your emotions felt strong or hard to control.",
        reverseScored: false 
      },
      { 
        text: "When I feel upset, I sometimes react quickly or strongly", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "Think about a recent situation where you felt upset — how quickly did you react?",
        reverseScored: false 
      },

      // INTERNAL DISTRESS
      { 
        text: "I feel stressed about schoolwork or expectations", 
        domain: "Internal Distress", 
        categoryLabel: "Stress & How You Feel Inside",
        introPrompt: "In the past 2–3 weeks, think about how schoolwork and expectations have been making you feel.",
        reverseScored: false 
      },
      { 
        text: "There are times when I feel low or less motivated", 
        domain: "Internal Distress", 
        categoryLabel: "Stress & How You Feel Inside",
        introPrompt: "Think about times this week or last week when you felt unmotivated or a little low.",
        reverseScored: false 
      },

      // SOCIAL & PEER INTERACTION
      { 
        text: "I feel like I belong in my friend group", 
        domain: "Social & Peer Interaction", 
        categoryLabel: "Friends & Belonging",
        introPrompt: "In the past 2–3 weeks, think about how connected you feel with your group of friends.",
        reverseScored: true 
      },
      { 
        text: "I sometimes feel left out or not included", 
        domain: "Social & Peer Interaction", 
        categoryLabel: "Friends & Belonging",
        introPrompt: "Think about times in class or at school when you felt on the outside of a group.",
        reverseScored: false 
      },

      // SOCIAL CONFIDENCE
      { 
        text: "I feel comfortable sharing my thoughts in class or with others", 
        domain: "Social Confidence", 
        categoryLabel: "Speaking Up",
        introPrompt: "In the past 2–3 weeks, think about how comfortable you felt sharing your ideas in class or with friends.",
        reverseScored: true 
      },
      { 
        text: "I feel judged or unsure when speaking in class", 
        domain: "Social Confidence", 
        categoryLabel: "Speaking Up",
        introPrompt: "Think about times when you had to speak in front of others — did you feel worried about being judged?",
        reverseScored: false 
      },

      // BEHAVIOURAL REGULATION
      { 
        text: "I sometimes act quickly without thinking", 
        domain: "Behavioural Regulation", 
        categoryLabel: "Acting Before Thinking",
        introPrompt: "In the past 2–3 weeks, think about moments when you did or said something without fully thinking it through first.",
        reverseScored: false 
      },

      // HELP-SEEKING
      { 
        text: "When I need help, I reach out to someone", 
        domain: "Help-Seeking", 
        categoryLabel: "Asking for Help",
        introPrompt: "In the past 2–3 weeks, think about times when things were difficult — did you reach out or stay quiet?",
        reverseScored: true 
      },
      { 
        text: "I try to handle problems on my own, even when it is difficult", 
        domain: "Help-Seeking", 
        categoryLabel: "Asking for Help",
        introPrompt: "Think about how you usually deal with problems — do you prefer to manage everything on your own?",
        reverseScored: false 
      }
    ]
  },

  "G10-12": {
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
    questions: [
      // ORGANISATION & EXECUTION
      { 
        text: "I am able to plan my study time when I have multiple subjects or deadlines", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "In the past 2–3 weeks, think about how you have been managing your study time across multiple subjects and deadlines.",
        reverseScored: true 
      },
      { 
        text: "I sometimes delay starting important tasks even when I know they matter", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "Think about an important task or assignment — did you find yourself putting it off even when you knew it mattered?",
        reverseScored: false 
      },
      { 
        text: "I can break big tasks into smaller steps and start working on them", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "Think about how you approach a large or complex piece of work — can you break it down and get started?",
        reverseScored: true 
      },
      { 
        text: "When deadlines are close, I often feel rushed to complete work", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "Think about the days just before a deadline — how much of a rush do you usually feel?",
        reverseScored: false 
      },
      { 
        text: "I am able to complete tasks within the time I planned", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "Think about tasks you planned to finish within a set time — how often did that actually happen?",
        reverseScored: true 
      },
      { 
        text: "I tend to postpone tasks until they become urgent", 
        domain: "Organisation & Execution", 
        categoryLabel: "Planning & Getting Things Done",
        introPrompt: "Think about whether you tend to start things only when they become urgent.",
        reverseScored: false 
      },

      // ATTENTION & PERSISTENCE
      { 
        text: "When work becomes difficult, my attention sometimes shifts to other things", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Persistence",
        introPrompt: "In the past 2–3 weeks, think about what happens to your attention when studying feels hard or uninteresting.",
        reverseScored: false 
      },
      { 
        text: "I can stay focused even when studying feels challenging", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Persistence",
        introPrompt: "Think about times when studying was genuinely challenging — were you able to stay with it?",
        reverseScored: true 
      },
      { 
        text: "I get distracted by thoughts, phone, or surroundings while studying", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Persistence",
        introPrompt: "Think about your study environment and what tends to pull your attention away from the work.",
        reverseScored: false 
      },
      { 
        text: "I am able to continue working even when I don't feel like it", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Persistence",
        introPrompt: "Think about times when motivation was low — could you still keep working anyway?",
        reverseScored: true 
      },
      { 
        text: "I lose interest if something takes too long to understand", 
        domain: "Attention & Persistence", 
        categoryLabel: "Focus & Persistence",
        introPrompt: "Think about a topic that took a long time to understand — did your interest hold or did it drop?",
        reverseScored: false 
      },

      // WORKING MEMORY
      { 
        text: "I can keep track of multiple instructions at the same time", 
        domain: "Working Memory", 
        categoryLabel: "Remembering & Keeping Track",
        introPrompt: "In the past 2–3 weeks, think about times when you had to follow multiple steps or keep several things in mind at once.",
        reverseScored: true 
      },
      { 
        text: "I sometimes forget what I was supposed to do while working on tasks", 
        domain: "Working Memory", 
        categoryLabel: "Remembering & Keeping Track",
        introPrompt: "Think about mid-task moments where you lost track of what you were supposed to do next.",
        reverseScored: false 
      },
      { 
        text: "I can connect different ideas while studying a topic", 
        domain: "Working Memory", 
        categoryLabel: "Remembering & Keeping Track",
        introPrompt: "Think about how you connect ideas across different topics or subjects while studying.",
        reverseScored: true 
      },
      { 
        text: "I feel mentally overloaded when handling too many things together", 
        domain: "Working Memory", 
        categoryLabel: "Remembering & Keeping Track",
        introPrompt: "Think about periods when many demands were happening at once — academic, personal, or both.",
        reverseScored: false 
      },

      // EMOTIONAL REGULATION
      { 
        text: "There are times when my emotions feel difficult to manage", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "In the past 2–3 weeks, think about moments when your emotions felt hard to control or manage.",
        reverseScored: false 
      },
      { 
        text: "I can stay calm even when I feel pressure from school or expectations", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "Think about high-pressure academic moments — were you able to stay calm?",
        reverseScored: true 
      },
      { 
        text: "I feel frustrated when things don't go as planned in studies", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "Think about times when something in your studies did not go the way you planned.",
        reverseScored: false 
      },
      { 
        text: "I am able to bring myself back to focus after feeling stressed", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "Think about after a stressful moment — how quickly can you bring your focus back?",
        reverseScored: true 
      },
      { 
        text: "My emotions sometimes affect my ability to study", 
        domain: "Emotional Regulation", 
        categoryLabel: "Managing Feelings",
        introPrompt: "Think about whether your emotional state has been getting in the way of your ability to study.",
        reverseScored: false 
      },

      // INTERNAL DISTRESS
      { 
        text: "I experience stress or worry during important academic periods", 
        domain: "Internal Distress", 
        categoryLabel: "Stress, Pressure & How You Feel Inside",
        introPrompt: "In the past 2–3 weeks, think about how stress or worry has been showing up during study or exam periods.",
        reverseScored: false 
      },
      { 
        text: "I find it hard to relax before exams or deadlines", 
        domain: "Internal Distress", 
        categoryLabel: "Stress, Pressure & How You Feel Inside",
        introPrompt: "Think about the nights or days before an exam or deadline — how easy was it to relax?",
        reverseScored: false 
      },
      { 
        text: "I think about studies or future even when I try to rest", 
        domain: "Internal Distress", 
        categoryLabel: "Stress, Pressure & How You Feel Inside",
        introPrompt: "Think about whether thoughts about studies or the future come to you even during rest or downtime.",
        reverseScored: false 
      },
      { 
        text: "There are times when I feel low or unmotivated", 
        domain: "Internal Distress", 
        categoryLabel: "Stress, Pressure & How You Feel Inside",
        introPrompt: "Think about times over the past few weeks when you felt low energy or found it hard to care about things.",
        reverseScored: false 
      },
      { 
        text: "I feel pressure about my future or expectations", 
        domain: "Internal Distress", 
        categoryLabel: "Stress, Pressure & How You Feel Inside",
        introPrompt: "Think about whether you have been feeling pressure around what people expect of you or what your future holds.",
        reverseScored: false 
      },
      { 
        text: "I tend to overthink situations related to school or performance", 
        domain: "Internal Distress", 
        categoryLabel: "Stress, Pressure & How You Feel Inside",
        introPrompt: "Think about whether your mind tends to go over and over school situations or performance even after they are done.",
        reverseScored: false 
      }
    ]
  }
};