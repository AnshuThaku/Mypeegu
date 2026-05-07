import { localizationConstants } from '../../../resources/theme/localizationConstants'
import { hexaCodes } from '../../../utils/hexaColorCodes'
import { sortEnum } from '../../../utils/utils'

// ============================================================================
// ========================= OLD QUESTIONS (PRE-2026) =========================
// ============================================================================

export const grade_4_Attention_Qusetions = [
    { qns_no: 1, question: 'Has difficulty sustaining attention in work tasks or play activities.' },
    { qns_no: 2, question: 'Does not follow through on instructions.' },
    { qns_no: 3, question: 'Fails to finish schoolwork, chores, or duties in school.' },
    { qns_no: 4, question: 'Is quickly and easily distracted by outside influences.' },
]

export const grade_4_FMGMS_Qusetions = [
    { qns_no: 1, question: 'Confused between Left and Right in writing or in directions.' },
    { qns_no: 2, question: 'Appears awkward or clumsy, dropping, spilling, or knocking things over..' },
    { qns_no: 3, question: 'Demonstrates poor ability to color or write ‘within the lines’.' },
    { qns_no: 4, question: 'Grasps pencil awkwardly, resulting in poor handwriting.' },
]

export const grade_4_Cognitive_Qusetions = [
    { qns_no: 1, question: 'Confuses similar-looking letters and numbers.' },
    { qns_no: 2, question: 'Has difficulty recognizing and remembering sight words.' },
    { qns_no: 3, question: 'Confuses similar-looking words (e.g., beard/bread).' },
    { qns_no: 4, question: 'Reverses letter order in words (e.g., saw/was) and reversal of letters (e.g. d /b, /p, M /W).' },
    { qns_no: 5, question: 'Dislikes and avoids reading or reads reluctantly.' },
    { qns_no: 6, question: 'Has significant trouble in reading.' },
    { qns_no: 7, question: 'Dislikes and avoids writing and copying.' },
    { qns_no: 8, question: 'Writing is messy and incomplete, with many cross outs and erasure.' },
    { qns_no: 9, question: 'Has difficulty with simple counting and one-to-one correspondence between number symbols and items/ object.' },
    { qns_no: 10, question: 'Has difficulty with learning and memorizing basic addition and subtraction fact.' },
    { qns_no: 11, question: 'Has significant difficulty with numbers.' },
]

export const grade_4_Behavior_Qusetions = [
    { qns_no: 1, question: 'Has difficulty maintaining eye contact for prolonged periods.' },
    { qns_no: 2, question: 'Resists change in routin.' },
    { qns_no: 3, question: 'Difficulty mixing with other children, prefers to be alone most of the time.' },
    { qns_no: 4, question: 'Does the child try to avoid work (talks with friends, takes time to start tasks, asks to visit clinic etc).' },
    { qns_no: 5, question: 'Out of seat behavior.(Always moving around in class, not able to sit on his seat for a long time ).' },
    { qns_no: 6, question: 'Has trouble knowing how to share/express feelings.' },
    { qns_no: 7, question: 'Has difficulty with self-control when frustrated.(Hurts himself or others).' },
    { qns_no: 8, question: 'Hard to manage, has temper tantrums (e.g. stubborn behavior/fluctuations in mood).' },
    { qns_no: 9, question: 'May cry or have an emotional outburst easily/unnecessarily.' },
]

export const grade_9_AH_Qusetions = [
    { qns_no: 1, question: 'Easily Distracted :Has trouble sustaining attention in tasks or group activities.' },
    { qns_no: 2, question: 'Constant Fidgeting : Is apparent.' },
    { qns_no: 3, question: 'Staying Seated : Finds difficult to remain seated.' },
    { qns_no: 4, question: 'Running  and Climbing  : Does run/climb excessively.' },
    { qns_no: 5, question: 'Playing Quietly : Have difficulty in playing quietly.' },
    { qns_no: 6, question: 'Need 1:1 attention : Seems to  accomplish the tasks with 1:1 instructions.' },
    { qns_no: 7, question: 'Sustaining Attention : Finds difficult to pay attention unless he/she is really interested.' },
    { qns_no: 8, question: 'Boredom : Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort (such as homework).' },
    { qns_no: 9, question: 'Following Instructions:Does not seem to listen and/or able to follow through on instructions.' },
    { qns_no: 10, question: 'Dreaminess : Often Day dreaming and forgetful.' },
    { qns_no: 11, question: 'Leaves things unfinished : Fails to finish tasks & activities unless supervised.' },
]

export const grade_9_Memory_Qusetions = [
    { qns_no: 1, question: 'Auditory Working Memory: He/She is unable to retain information while working with it.' },
    { qns_no: 2, question: "Visual Working Memory : Cannot hold the information easily if it's not visual ." },
    { qns_no: 3, question: 'Sequential Memory : Cannot remember well when worked with information that is continuous or sequenced' },
    { qns_no: 4, question: 'Forgetting & Confusing: Can easily get confuse /forget on what people say.' },
]

export const grade_9_FMGMS_Qusetions = [
    { qns_no: 1, question: 'Poor balance: The child has difficulty doing the assigned task that requires balance.' },
    { qns_no: 2, question: 'Gait And Movements: There are noticeable Jerky or unusual movements ' },
    { qns_no: 3, question: 'Fine Motor difficulties and poor Eye/Hand coordination: Grasps pencil awkwardly, resulting in poor handwriting.' },
    { qns_no: 4, question: 'Posture When Reading : Sitting in an unusal way while reading ' },
    { qns_no: 5, question: 'Ball Games And Sports: Tends to avoid or poor at the PE activities.' },
    { qns_no: 6, question: 'Unusual Body Movements : Appears awkward and clumsy, dropping, spilling, or knocking things over or unusual movement of Hands .' },
]

export const grade_9_Cognive_RS_Qusetions = [
    { qns_no: 1, question: 'Difficulty in Oral Reading : Cannot Read out aloud with fluency as per his/her age' },
    { qns_no: 2, question: 'Difficulty in keeping place (i) while reading often jumps or repeat the lines .' },
    { qns_no: 3, question: 'Difficulty in keeping place (ii) often needs to Use finger or pointer while reading.' },
    { qns_no: 4, question: 'Difficulty in keeping place (iii) Often Misses out the words while reading  ' },
    { qns_no: 5, question: 'Difficulty with Sight Vocabulary : Finding the Prose reading as very Laborious .' },
    { qns_no: 6, question: 'Auditory discrimination and Phonological Awareness : Is not able to use the Phonics (Sounds of letters) and discriminate the Phonics which displays the Phonological awareness while reading ' },
    { qns_no: 7, question: 'Non Word Reading : Difficult to Read the words with no meaning and does not make proper word.' },
    { qns_no: 8, question: 'Reversals Of Letters or letter strings : confuses letter sequences frequently while reading a loud (e.g., soiled for solid; left for felt).' },
    { qns_no: 9, question: 'Good oral Reading With Poor Comprehension :Can decode words and read aloud with accuracy, fluency or speed, but has difficulty with  comprehending the meaning of the text which is expected . ' },
    { qns_no: 10, question: 'Spelling Inaccuracy : Spelling is inappropriate for age and general ability (e.g., spelling the same word differently on the same page, use of odd spelling patterns, frequent letter omissions, additions and transpositions)' },
    { qns_no: 11, question: 'Spelling Irregular Words: Sight Words are weaker than regular words.' },
    { qns_no: 12, question: 'Content of  writing: Content is relatively weak,even though spelling and technical accuracy are adequate . ' },
    { qns_no: 13, question: 'Difficulty with Visually Similar Numbers and Letters: Experiences language-related problems in math (e.g., when reading word problems and directions, confuses numbers and symbols)' },
    { qns_no: 14, question: 'Handwriting And Layout of work are inaapropriate' },
    { qns_no: 15, question: 'Quality of Copying: Cannot copy shapes effectively' },
    { qns_no: 16, question: 'Copying Prose: Cannot copy text accurately' },
    { qns_no: 17, question: 'Handwriting, page layout and presentation: Is not adequate' },
    { qns_no: 18, question: 'Pencil Grip and control is unusual or awkward-looking in any way' },
]

export const grade_9_Cognive_NS_Qusetions = [
    { qns_no: 1, question: 'Number Work: Does he/She have particular difficulty in counting and number bonds?.' },
    { qns_no: 2, question: 'Place Value: Does he/she find this specially hard?.' },
    { qns_no: 3, question: 'Money: Is understanding of money unusually poor?.' },
    { qns_no: 4, question: 'Counting: Does he/she tend to miscount more than might be expected?.' },
    { qns_no: 5, question: 'Mental Arithmatic at Speed: Is this a particular problem?.' },
    { qns_no: 6, question: 'Using Math Symbols: Does he/ she find it difficult to remember the common math symbols and what they mean?.' },
    { qns_no: 7, question: 'Space and Spatial Aspects of Math:Does he/she find this unusually difficult?.' },
    { qns_no: 8, question: 'Right thinking, wrong answers: Does he/she sometimes know how to do it, and have the right answer, but write down the wrong answer?.' },
    { qns_no: 9, question: 'Number Reversals: Is he/ she prone to this?.' },
]

export const grade_9_Cognive_SL_Qusetions = [
    { qns_no: 1, question: 'Talk excessively: Does he/ she do this?.' },
    { qns_no: 2, question: 'Repeating phrases or words out of context: Does he/she do this?.' },
    { qns_no: 3, question: '"Off Centre Answers": Do explanations and answers to questions seem somehow to miss the point, to go "round the point"without really dealing with it directly?.' },
    { qns_no: 4, question: 'Conversation: Does he/she have difficulty following the "Rules" of conversation and turn-taking?.' },
    { qns_no: 5, question: 'Distracted by background noises: Does he/she have difficulty in listening when there are other noises in the background?.' },
    { qns_no: 6, question: 'Needs repetition: Does he/she often ask for instructions or information to be repeated?.' },
    { qns_no: 7, question: 'Responding to own name: Does he/she often not react when his/her name is being called?.' },
    { qns_no: 8, question: 'Knowling direction of sounds: Does he/she have difficulty with this?-for example, looking round the room when called to, rather than turning in that direction.' },
    { qns_no: 9, question: 'Impulsive Answering: Does he/she blurt out answers, sometimes even before questions are asked?.' },
    { qns_no: 10, question: 'Speech: Is speech poorly articulated, slow, hesitant, confused or poorly constructed in any way?.' },
    { qns_no: 11, question: 'Word Finding and Fluency: Cannot quickly and easily think or articulate words' },
    { qns_no: 12, question: 'Unusual Speech: Is his/her speech odd or greenantic in any way or have unusual prosodic patterns or intonation?.' },
    { qns_no: 13, question: 'Stammer or Stutter: Is there evidence of this?.' },
    { qns_no: 14, question: 'Naming Speed: Cannot swiftly attach verbal labels to common objects' },
    { qns_no: 15, question: 'Slow or flatering speech: Is speech noticably slower or less fluent than in most other pupils the same age?.' },
]

export const grade_9_Cognive_SW_Qusetions = [
    { qns_no: 1, question: 'Losing or forgetting things: Does he/she often lose or forget things?.' },
    { qns_no: 2, question: 'Organisation: Is he/she personally disorganised and untidy, or poor at organising things, tasks and activities?.' },
    { qns_no: 3, question: 'Speed of Copying: Cannot copy quickly' },
    { qns_no: 4, question: 'Reaction Time: Is he/she noticably slow to react?.' },
]

export const grade_9_Social_Behavior_Qusetions = [
    { qns_no: 1, question: 'Interest in people: Does he/she seem more interested in objects, facts and information than in people?.' },
    { qns_no: 2, question: 'Social Awareness and aptitude: Does he/she seem unresponsive to social cues and signals that other children would respond to?.' },
    { qns_no: 3, question: 'Eccentricity: Does he/she seem odd or different in some way?.' },
    { qns_no: 4, question: 'Limited Body Language, Gesture and Expression: Are his/her non-verbal communication skills relatively limited?.' },
    { qns_no: 5, question: 'Recognising the feelings of others: Does he/she seem to find it hard to recognise and respond to the feelings of others?.' },
    { qns_no: 6, question: 'Social Demands: Does he/she become tense and distressed at approaches and demands of others?.' },
    { qns_no: 7, question: 'Tactlessness: Does he/she seem unusually tactless sometimes, or inappropriately honest, unaware of the need to conceal feelings sometimes?.' },
    { qns_no: 8, question: 'Self-Centred: Does he/she seem unusually self-centred, with no apparent understanding of or concern about how others view him/her?.' },
    { qns_no: 9, question: 'Turn-Taking: Does he/she find it unusually hard to wait for his/her turn?.' },
]

export const grade_9_Social_Visual_Qusetions = [
    { qns_no: 1, question: 'Visual Acuity and discrimination: Is not effective in noticing visual details' },
    { qns_no: 2, question: 'Visual discomfort when reading (i): Is there evidence of excessive blinking, eye rubbing and grimacing?.' },
    { qns_no: 3, question: 'Visual discomfort when reading (ii): Does he/she report sore eyes, watery eyes, or hot, dry eyes?.' },
    { qns_no: 4, question: "Blurring or moving text: Does he/she report letters and words that jump, move or blur, or speak of 'rivers and snakes of white' in the text?." },
    { qns_no: 5, question: 'Vergence and Visual Tracking: Does this appear to be a problem at all?.' },
    { qns_no: 6, question: 'Coping with Visual Information on the page (i): Does he/she find it hard to read maps?.' },
    { qns_no: 7, question: 'Coping with Visual Information on the page (ii): Does he/she have difficulty taking information odd diagrams?.' },
    { qns_no: 8, question: 'Coping with Visual Information on the page (iii): Does he/she have difficulty taking information from graphs and charts?.' },
]

// ============================================================================
// ===================== NEW QUESTIONS (2026-27 ONWARDS) ======================
// ============================================================================

export const grade_4_Attention_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty staying focused on tasks or activities.' },
    { qns_no: 2, question: 'Gets easily distracted by surroundings.' },
    { qns_no: 3, question: 'Leaves tasks incomplete or shifts between tasks frequently.' },
    { qns_no: 4, question: 'Finds it difficult to sit still when expected.' },
    { qns_no: 5, question: 'Acts without thinking (interrupts, blurts out) or has difficulty waiting for their turn.' },
];
export const grade_4_Memory_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty remembering recently taught information.' },
    { qns_no: 2, question: 'Forgets instructions or needs them repeated frequently.' },
    { qns_no: 3, question: 'Has difficulty recalling previously learned concepts.' },
    { qns_no: 4, question: 'Struggles to retain information from one day to the next.' },
];
export const grade_4_FMGMS_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty with writing, coloring, or using classroom tools.' },
    { qns_no: 2, question: 'Shows poor pencil grip or control.' },
    { qns_no: 3, question: 'Appears clumsy or uncoordinated.' },
    { qns_no: 4, question: 'Has difficulty with balance or physical activities.' },
];
export const grade_4_Cognitive_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty understanding new concepts.' },
    { qns_no: 2, question: 'Needs more time than peers to learn or complete work.' },
    { qns_no: 3, question: 'Struggles with basic problem-solving tasks.' },
    { qns_no: 4, question: 'Has difficulty identifying patterns, similarities, or differences.' },
];
export const grade_4_Language_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty understanding instructions.' },
    { qns_no: 2, question: 'Has difficulty expressing thoughts clearly.' },
    { qns_no: 3, question: 'Uses limited vocabulary for age.' },
    { qns_no: 4, question: 'Has difficulty participating in conversations appropriately.' },
];
export const grade_4_Executive_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty following multi-step instructions.' },
    { qns_no: 2, question: 'Struggles to begin or complete tasks independently.' },
    { qns_no: 3, question: 'Has difficulty organizing tasks or materials.' },
    { qns_no: 4, question: 'Requires frequent reminders to stay on task.' },
];
export const grade_4_Academic_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty reading age-appropriate text.' },
    { qns_no: 2, question: 'Makes frequent errors while reading (skipping/guessing words).' },
    { qns_no: 3, question: 'Has difficulty writing letters, words, or sentences.' },
    { qns_no: 4, question: 'Has difficulty with basic number concepts or calculations.' },
    { qns_no: 5, question: 'Has difficulty copying from a book or worksheet (near point).' },
    { qns_no: 6, question: 'Has difficulty copying from the board (far point).' },
];
export const grade_4_Social_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty interacting or playing with peers.' },
    { qns_no: 2, question: 'Has difficulty sharing or taking turns.' },
    { qns_no: 3, question: 'Prefers to play alone most of the time.' },
    { qns_no: 4, question: 'Has difficulty understanding social cues.' },
];
export const grade_4_Emotional_Questions_NEW = [
    { qns_no: 1, question: 'Shows strong emotional reactions to small/ daily situations.' },
    { qns_no: 2, question: 'Has difficulty calming down after becoming upset.' },
    { qns_no: 3, question: 'Shows frequent or unpredictable mood changes.' },
];
export const grade_4_Behavior_Questions_NEW = [
    { qns_no: 1, question: 'Shows oppositional or non-compliant behaviour.' },
    { qns_no: 2, question: 'Displays tantrums, aggression, or withdrawal.' },
];
export const grade_4_Adaptive_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty managing daily routines independently (Asking for help/ age-appropriate ADLs).' },
    { qns_no: 2, question: 'Needs frequent adult support for age-appropriate tasks (ADLs).' },
];

export const grade_9_Attention_Questions_NEW = [
    { qns_no: 1, question: 'Easily distracted by environmental stimuli (e.g., sounds, movement) during tasks or group activities, more than same-age peers.' },
    { qns_no: 2, question: 'Displays constant fidgeting or restless movement (e.g., tapping, squirming, shifting position) during lessons.' },
    { qns_no: 3, question: 'Finds it difficult to remain seated for age-appropriate periods during structured classroom activities.' },
    { qns_no: 4, question: 'Engages in physically excessive behaviour (e.g., running in corridors, climbing on furniture) in contexts where it is clearly inappropriate.' },
    { qns_no: 5, question: 'Struggles to engage in calm, quiet activities and tends to be louder or more physically active than peers in unstructured settings.' },
    { qns_no: 6, question: 'Requires direct one-to-one adult support to begin or complete tasks that peers manage independently.' },
    { qns_no: 7, question: 'Unable to sustain attention on assigned tasks unless personally motivated; attention is topic-dependent rather than consistent.' },
    { qns_no: 8, question: 'Avoids or is reluctant to engage in tasks requiring sustained cognitive effort (e.g., extended writing, revision) beyond what is expected for age.' },
    { qns_no: 9, question: 'Struggles to retain and follow multi-step instructions; often begins tasks incorrectly or abandons them partway through.' },
    { qns_no: 10, question: 'Frequently appears mentally absent or distracted during lessons; often forgets what was just said or loses track of tasks.' },
    { qns_no: 11, question: 'Often leaves tasks or activities incomplete without adult supervision or reminders.' },
];
export const grade_9_Memory_Questions_NEW = [
    { qns_no: 1, question: 'Struggles to hold and use verbal information in mind while completing a task (e.g., loses track of instructions mid-task).' },
    { qns_no: 2, question: 'Struggles to retain and use visually presented information (e.g., diagrams, written instructions) while simultaneously completing a task.' },
    { qns_no: 3, question: 'Frequently confuses or loses the order of sequenced information (e.g., steps in a procedure, days of the week, instructions).' },
    { qns_no: 4, question: 'Frequently forgets or misremembers verbal information soon after it is given, requiring repetition beyond what peers need.' },
];
export const grade_9_FMGMS_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty maintaining balance during physical tasks (e.g., standing on one foot, navigating obstacles) compared with same-age peers.' },
    { qns_no: 2, question: 'Displays unusual or irregular gait patterns (e.g., stiffness, uneven steps, exaggerated arm swing) that affect functional movement.' },
    { qns_no: 3, question: 'Shows poor hand-eye coordination affecting writing tasks; uses an atypical grip and produces inconsistent or illegible handwriting.' },
    { qns_no: 4, question: 'Adopts uncomfortable or unusual postures while reading (e.g., extreme head tilt, slumping) that suggest poor core stability or visual discomfort.' },
    { qns_no: 5, question: 'Avoids or significantly underperforms in ball skills or team sports during PE, beyond what is expected for age.' },
    { qns_no: 6, question: 'Displays uncoordinated or unusual body movements during daily tasks, frequently dropping, spilling, or knocking objects over compared with same-age peers.' },
];
export const grade_9_Cognitive_Questions_NEW = [
    { qns_no: 1, question: 'Reads aloud with notable disfluency (e.g., word-by-word reading, frequent errors, loss of pace) below what is expected for age.' },
    { qns_no: 2, question: 'While reading, frequently loses their place on the page, skipping or repeating lines.' },
    { qns_no: 3, question: 'Requires physical tracking aids (e.g., finger, ruler) to maintain their place while reading.' },
    { qns_no: 4, question: 'Frequently omits words or phrases while reading aloud, affecting the meaning of the text.' },
    { qns_no: 5, question: 'Reads prose slowly and with visible effort, suggesting limited automatic recognition of high-frequency words.' },
    { qns_no: 6, question: 'Has difficulty applying phonics rules to decode unfamiliar words, suggesting weak phonological awareness.' },
    { qns_no: 7, question: "Unable to decode non-words (e.g., 'blort', 'snid') using phonics, indicating difficulty applying letter–sound rules to unfamiliar text." },
    { qns_no: 8, question: 'Frequently confuses similar-looking letters or reverses letter sequences when reading aloud (e.g., soiled/solid, felt/left), beyond the age of 8.' },
    { qns_no: 9, question: 'Reads aloud accurately and fluently but demonstrates reading comprehension below expected levels for age.' },
    { qns_no: 10, question: 'Has difficulty reading aloud accurately and fluently but understands what is read when supported.' },
    { qns_no: 11, question: 'Produces spelling that is significantly below age expectation, with inconsistent or unusual patterns (e.g., omitting letters, reversing sequences, spelling the same word differently within one piece of work).' },
    { qns_no: 12, question: "Has greater difficulty spelling irregular sight words (e.g., 'enough', 'said') than phonetically regular words." },
    { qns_no: 13, question: 'Written work contains adequate spelling and punctuation but is weak in ideas, structure, or elaboration relative to age expectations.' },
    { qns_no: 14, question: 'Struggles to reproduce geometric shapes or complex figures accurately (e.g., cannot copy a diamond by age 7).' },
];
export const grade_9_Language_Questions_NEW = [
    { qns_no: 1, question: 'Talks excessively or at inappropriate times (e.g., during independent work, mid-instruction), making it difficult for others to focus.' },
    { qns_no: 2, question: 'Frequently repeats words or phrases from earlier conversations, media, or scripts in contexts where they are not relevant (echolalia).' },
    { qns_no: 3, question: 'Gives answers or explanations that are loosely related but do not directly address the question asked.' },
    { qns_no: 4, question: 'Has difficulty initiating, maintaining, or taking turns in conversation in a way that is appropriate for age and context.' },
    { qns_no: 5, question: 'Struggles to follow verbal instructions or conversations in the presence of background noise (e.g., classroom noise, assembly hall), more than same-age peers.' },
    { qns_no: 6, question: 'Regularly asks for instructions to be repeated or clarified, beyond what peers require, even in quiet settings.' },
    { qns_no: 7, question: 'Fails to respond reliably when their name is called in a quiet setting, even when not visibly distracted.' },
    { qns_no: 8, question: 'Has difficulty localising the source or direction of sounds in the environment (e.g., turns in the wrong direction when called).' },
    { qns_no: 9, question: 'Frequently blurts out answers or comments before a question has been completed, or interrupts others during discussions.' },
    { qns_no: 10, question: 'Speech is consistently difficult to understand due to poor articulation, unusual pacing, or poorly formed sentences, beyond what is expected for age.' },
    { qns_no: 11, question: 'Has difficulty retrieving words during conversation, often pausing, using filler words, or substituting an incorrect word for the intended one.' },
    { qns_no: 12, question: 'Uses unusually formal, pedantic, or monotone speech, or shows irregular intonation patterns (e.g., flat, robotic, exaggerated) that stand out among peers.' },
    { qns_no: 13, question: 'Shows signs of stuttering or stammering (e.g., repeating sounds or syllables, prolonging sounds, blocking) during verbal communication.' },
    { qns_no: 14, question: 'Takes noticeably longer than peers to name common objects, colours, or letters when asked, suggesting slow lexical retrieval.' },
    { qns_no: 15, question: 'Speaks noticeably more slowly or with more hesitation than same-age peers, requiring extra wait-time in conversations or class discussions.' },
];
export const grade_9_Executive_Questions_NEW = [
    { qns_no: 1, question: 'Has difficulty stopping an ongoing activity and shifting to the next task when instructed.' },
    { qns_no: 2, question: 'Has difficulty planning ahead or thinking through the steps needed to complete a multi-stage task (e.g., a project, a timed exam, a complex assignment).' },
    { qns_no: 3, question: 'Struggles to shift between tasks or activities flexibly; becomes rigid or distressed when required to stop one activity and move to another.' },
    { qns_no: 4, question: 'Frequently loses or forgets essential school items (e.g., homework, stationery, planner) despite reminders.' },
    { qns_no: 5, question: 'Consistently struggles to plan, sequence, or manage school tasks and materials in an organised way, despite prompting from adults.' },
    { qns_no: 6, question: 'Copies text significantly more slowly than peers, often failing to complete notes or tasks within the time allowed.' },
    { qns_no: 7, question: 'Responds to questions, instructions, or changes in activity noticeably more slowly than peers, beyond what can be explained by attentional difficulties.' },
];
export const grade_9_Academic_Questions_NEW = [
    { qns_no: 1, question: 'Struggles with maths word problems due to difficulty reading or interpreting symbolic notation (e.g., confusing +, ×, or misreading number orientation).' },
    { qns_no: 2, question: 'Copies text from the board or a page slowly and inaccurately, with frequent omissions or miscopied words.' },
    { qns_no: 3, question: 'Written work shows persistent difficulties with margins, letter sizing, line alignment, or spacing that affect readability.' },
    { qns_no: 4, question: 'Has difficulty recalling basic number bonds and counting sequences accurately without finger-counting or repeated starting-over.' },
    { qns_no: 5, question: 'Consistently confuses the value of digits based on their position (e.g., reads 304 as 34 or cannot regroup in addition).' },
    { qns_no: 6, question: 'Struggles to solve basic money problems (e.g., calculating change, comparing prices) beyond what is expected for age.' },
    { qns_no: 7, question: 'Makes frequent miscounting errors or needs to restart counts repeatedly, beyond what peers require.' },
    { qns_no: 8, question: 'Struggles to perform mental calculations within an age-appropriate time frame, often freezing or guessing rather than calculating.' },
    { qns_no: 9, question: 'Consistently has difficulty with spatial aspects of maths (e.g., estimating size, reading graphs, aligning columns in written arithmetic).' },
    { qns_no: 10, question: 'Sometimes demonstrates correct procedural understanding verbally but records an incorrect final answer, suggesting a transcription or monitoring difficulty.' },
    { qns_no: 11, question: 'Frequently reverses numbers when writing (e.g., writes 21 for 12, 9 for 6) beyond the age of 8.' },
];
export const grade_9_Social_Questions_NEW = [
    { qns_no: 1, question: 'Consistently appears unaware of or unresponsive to the emotional states of others, even when distress is obvious.' },
    { qns_no: 2, question: 'Appears largely unaware of how their behaviour affects others, consistently prioritising their own perspective without adjustment.' },
    { qns_no: 3, question: 'Frequently misses or misinterprets social cues (e.g., facial expressions, tone of voice, personal space) that peers respond to naturally.' },
    { qns_no: 4, question: 'Uses limited or poorly co-ordinated non-verbal communication (e.g., reduced gesturing, flat affect, limited eye contact, expression that does not match context).' },
    { qns_no: 5, question: 'Engages in unusual behaviours or demonstrates interests that are markedly atypical for their age group, attracting peer attention or comment.' },
    { qns_no: 6, question: 'Is often targeted or singled out by peers during interactions.' },
    { qns_no: 7, question: 'Shows noticeably greater interest in objects, topics, or facts than in social interaction with peers, often choosing solitary activities.' },
];
export const grade_9_Emotional_Questions_NEW = [
    { qns_no: 1, question: 'Becomes visibly tense, anxious, or avoidant when approached by peers or adults in social situations.' },
    { qns_no: 2, question: 'Has difficulty recovering from emotional upsets in a timely or proportionate way; remains dysregulated long after the triggering event has passed.' },
];
export const grade_9_Behavior_Questions_NEW = [
    { qns_no: 1, question: 'Interrupts the facilitator frequently by speaking or asking questions without waiting for turn.' },
    { qns_no: 2, question: 'Often makes blunt or socially inappropriate comments without awareness of their impact on others.' },
    { qns_no: 3, question: 'Struggles to wait for their turn during games, group discussions, or structured activities, more than same-age peers.' },
];
export const grade_9_Adaptive_Questions_NEW = [
    { qns_no: 1, question: 'Shows unusual sensitivity or reduced awareness of sensory input (e.g., covers ears to everyday sounds, avoids certain textures in clothing or food, seeks excessive sensory stimulation, appears unaware of pain or temperature).' },
    { qns_no: 2, question: 'Seeks excessive sensory stimulation (e.g., touching everything, needing to move constantly, making repetitive sounds) to the extent that it interferes with learning.' },
];

// ============================================================================
// ==================== SHARED CONSTANTS & HELPERS ====================
// ============================================================================
export const initModal = { edit: false, upload: false, filter: false, delete: false }
export const addOptions = ['Manual', 'Bulk Upload']
export const checklistOptions = ['Upper KG - Grade 4', 'Grade 5 - Grade 12']
export const studentStatusArray = [localizationConstants.active, localizationConstants.graduated, localizationConstants.exited, localizationConstants.all];

//old

// const safeFilterTotal = (dataArray) => {
//     if (Array.isArray(dataArray)) {
//         return dataArray.filter((data) => data?.answer === 'yes' || data?.answer === 'Often' || data?.answer === 'Sometimes').length;
//     }
//     return 0;
// };
const safeFilterTotal = (dataArray) => {
    if (Array.isArray(dataArray)) {
        return dataArray.reduce((total, data) => {
            const ans = typeof data?.answer === 'string' ? data.answer.toLowerCase() : data?.answer;
            
            // Often = 1, Yes = 1, Achieved = 1
            if (ans === 'often' || ans === 'yes' || ans === 'achieved' || ans === true) {
                return total + 1;
            }
            // Sometimes = 0.5, Emerging = 0.5
            if (ans === 'sometimes' || ans === 'emerging') {
                return total + 0.5;
            }
            // No = 0, Not Achieved = 0 (Total wahi rahega)
            return total;
        }, 0); // 0 se start hoga
    }
    return 0;
};

const safeGetSelection = (dataArray) => {
    if (Array.isArray(dataArray)) return dataArray;
    return [];
};

// ============================================================================
// ==================== CONDITIONAL QUESTIONS MAPPING ====================
// ============================================================================

export const Grade_4_Questions = (Grade_4_Marks, isNewFormat = false) => {
    if (isNewFormat) {
        return {
            [localizationConstants.attention]: { title: localizationConstants.attention, localKey: 'attention', qusetions: grade_4_Attention_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.attention]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.attention]), totalQuestions: grade_4_Attention_Questions_NEW.length },
            [localizationConstants.memory]: { title: localizationConstants.memory, localKey: 'memory', qusetions: grade_4_Memory_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.memory]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.memory]), totalQuestions: grade_4_Memory_Questions_NEW.length },
            [localizationConstants.fineMotorGrossMotorSkill]: { title: localizationConstants.fineMotorGrossMotorSkill, localKey: 'fineMotorGrossMotorSkill', qusetions: grade_4_FMGMS_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.fineMotorGrossMotorSkill]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.fineMotorGrossMotorSkill]), totalQuestions: grade_4_FMGMS_Questions_NEW.length },
            [localizationConstants.cognitive]: { title: localizationConstants.cognitive, localKey: 'cognitive', qusetions: grade_4_Cognitive_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.cognitive]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.cognitive]), totalQuestions: grade_4_Cognitive_Questions_NEW.length },
            ['Language & Communication']: { title: 'Language & Communication', localKey: 'languageAndCommunication', qusetions: grade_4_Language_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.['Language & Communication']), total: safeFilterTotal(Grade_4_Marks?.['Language & Communication']), totalQuestions: grade_4_Language_Questions_NEW.length },
            ['Executive Function']: { title: 'Executive Function', localKey: 'executiveFunction', qusetions: grade_4_Executive_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.['Executive Function']), total: safeFilterTotal(Grade_4_Marks?.['Executive Function']), totalQuestions: grade_4_Executive_Questions_NEW.length },
            ['Academic Skills']: { title: 'Academic Skills', localKey: 'academicSkills', qusetions: grade_4_Academic_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.['Academic Skills']), total: safeFilterTotal(Grade_4_Marks?.['Academic Skills']), totalQuestions: grade_4_Academic_Questions_NEW.length },
            [localizationConstants.socialSkills]: { title: localizationConstants.socialSkills, localKey: 'socialSkills', qusetions: grade_4_Social_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.socialSkills]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.socialSkills]), totalQuestions: grade_4_Social_Questions_NEW.length },
            ['Emotional Regulation']: { title: 'Emotional Regulation', localKey: 'emotionalRegulation', qusetions: grade_4_Emotional_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.['Emotional Regulation']), total: safeFilterTotal(Grade_4_Marks?.['Emotional Regulation']), totalQuestions: grade_4_Emotional_Questions_NEW.length },
            [localizationConstants.behavior]: { title: localizationConstants.behavior, localKey: 'behavior', qusetions: grade_4_Behavior_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.behavior]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.behavior]), totalQuestions: grade_4_Behavior_Questions_NEW.length },
            ['Adaptive Skills']: { title: 'Adaptive Skills', localKey: 'adaptiveSkills', qusetions: grade_4_Adaptive_Questions_NEW, selection: safeGetSelection(Grade_4_Marks?.['Adaptive Skills']), total: safeFilterTotal(Grade_4_Marks?.['Adaptive Skills']), totalQuestions: grade_4_Adaptive_Questions_NEW.length },
        };
    } else {
        return {
            [localizationConstants.attention]: { title: localizationConstants.attention, localKey: 'attention', qusetions: grade_4_Attention_Qusetions, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.attention]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.attention]), totalQuestions: 4 },
            [localizationConstants.fineMotorGrossMotorSkill]: { title: localizationConstants.fineMotorGrossMotorSkill, localKey: 'fineMotorGrossMotorSkill', qusetions: grade_4_FMGMS_Qusetions, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.fineMotorGrossMotorSkill]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.fineMotorGrossMotorSkill]), totalQuestions: 4 },
            [localizationConstants.cognitive]: { title: localizationConstants.cognitive, localKey: 'cognitive', qusetions: grade_4_Cognitive_Qusetions, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.cognitive]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.cognitive]), totalQuestions: 11 },
            [localizationConstants.behavior]: { title: localizationConstants.behavior, localKey: 'behavior', qusetions: grade_4_Behavior_Qusetions, selection: safeGetSelection(Grade_4_Marks?.[localizationConstants.behavior]), total: safeFilterTotal(Grade_4_Marks?.[localizationConstants.behavior]), totalQuestions: 9 },
        };
    }
};

export const Grade_9_Questions = (Grade_9_Marks, isNewFormat = false) => {
    if (isNewFormat) {
        return {
            [localizationConstants.attentionHyperactivity]: { title: localizationConstants.attentionHyperactivity, localKey: 'attentionHyperactivity', qusetions: grade_9_Attention_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.attentionHyperactivity]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.attentionHyperactivity]), totalQuestions: grade_9_Attention_Questions_NEW.length },
            [localizationConstants.memory]: { title: localizationConstants.memory, localKey: 'memory', qusetions: grade_9_Memory_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.memory]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.memory]), totalQuestions: grade_9_Memory_Questions_NEW.length },
            [localizationConstants.fineMotorGrossMotorSkillPGC]: { title: localizationConstants.fineMotorGrossMotorSkillPGC, localKey: 'fineMotorGrossMotorSkillPGC', qusetions: grade_9_FMGMS_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.fineMotorGrossMotorSkillPGC]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.fineMotorGrossMotorSkillPGC]), totalQuestions: grade_9_FMGMS_Questions_NEW.length },
            [localizationConstants.cognitive]: { title: localizationConstants.cognitive, localKey: 'cognitive', qusetions: grade_9_Cognitive_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.cognitive]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]), totalQuestions: grade_9_Cognitive_Questions_NEW.length },
            ['Language & Communication']: { title: 'Language & Communication', localKey: 'languageAndCommunication', qusetions: grade_9_Language_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.['Language & Communication']), total: safeFilterTotal(Grade_9_Marks?.['Language & Communication']), totalQuestions: grade_9_Language_Questions_NEW.length },
            ['Executive Function']: { title: 'Executive Function', localKey: 'executiveFunction', qusetions: grade_9_Executive_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.['Executive Function']), total: safeFilterTotal(Grade_9_Marks?.['Executive Function']), totalQuestions: grade_9_Executive_Questions_NEW.length },
            ['Academic Skills']: { title: 'Academic Skills', localKey: 'academicSkills', qusetions: grade_9_Academic_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.['Academic Skills']), total: safeFilterTotal(Grade_9_Marks?.['Academic Skills']), totalQuestions: grade_9_Academic_Questions_NEW.length },
            [localizationConstants.socialSkills]: { title: localizationConstants.socialSkills, localKey: 'socialSkills', qusetions: grade_9_Social_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.socialSkills]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.socialSkills]), totalQuestions: grade_9_Social_Questions_NEW.length },
            ['Emotional Regulation']: { title: 'Emotional Regulation', localKey: 'emotionalRegulation', qusetions: grade_9_Emotional_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.['Emotional Regulation']), total: safeFilterTotal(Grade_9_Marks?.['Emotional Regulation']), totalQuestions: grade_9_Emotional_Questions_NEW.length },
            [localizationConstants.behavior]: { title: localizationConstants.behavior, localKey: 'behavior', qusetions: grade_9_Behavior_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.behavior]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.behavior]), totalQuestions: grade_9_Behavior_Questions_NEW.length },
            ['Adaptive Skills']: { title: 'Adaptive Skills', localKey: 'adaptiveSkills', qusetions: grade_9_Adaptive_Questions_NEW, selection: safeGetSelection(Grade_9_Marks?.['Adaptive Skills']), total: safeFilterTotal(Grade_9_Marks?.['Adaptive Skills']), totalQuestions: grade_9_Adaptive_Questions_NEW.length },
        };
    } else {
        return {
            [localizationConstants.attentionHyperactivity]: { title: localizationConstants.attentionHyperactivity, localKey: 'attentionHyperactivity', qusetions: grade_9_AH_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.attentionHyperactivity]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.attentionHyperactivity]), totalQuestions: 12 },
            [localizationConstants.fineMotorGrossMotorSkillPGC]: { title: localizationConstants.fineMotorGrossMotorSkillPGC, localKey: 'fineMotorGrossMotorSkillPGC', qusetions: grade_9_FMGMS_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.fineMotorGrossMotorSkillPGC]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.fineMotorGrossMotorSkillPGC]), totalQuestions: 6 },
            [localizationConstants.memory]: { title: localizationConstants.memory, localKey: 'memory', qusetions: grade_9_Memory_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.memory]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.memory]), totalQuestions: 4 },
            [localizationConstants.cognitive]: {
                title: localizationConstants.cognitive, localKey: 'cognitive',
                subQuestions: [
                    { title: localizationConstants.readingAndSpelling, localKey: 'readingAndSpelling', qusetions: grade_9_Cognive_RS_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.readingAndSpelling]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.readingAndSpelling]), totalQuestions: 18 },
                    { title: localizationConstants.numeracySkills, localKey: 'numeracySkills', qusetions: grade_9_Cognive_NS_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.numeracySkills]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.numeracySkills]), totalQuestions: 9 },
                    { title: localizationConstants.speakingAndListening, localKey: 'speakingAndListening', qusetions: grade_9_Cognive_SL_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.speakingAndListening]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.speakingAndListening]), totalQuestions: 15 },
                    { title: localizationConstants.styleofWorking, localKey: 'styleofWorking', qusetions: grade_9_Cognive_SW_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.styleofWorking]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.styleofWorking]), totalQuestions: 4 },
                ],
                total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.styleofWorking]) + safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.speakingAndListening]) + safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.numeracySkills]) + safeFilterTotal(Grade_9_Marks?.[localizationConstants.cognitive]?.[localizationConstants.readingAndSpelling]),
                totalQuestions: 46,
            },
            [localizationConstants.socialSkills]: {
                title: localizationConstants.socialSkills, localKey: 'socialSkills',
                subQuestions: [
                    { title: localizationConstants.behavior, localKey: 'behavior', qusetions: grade_9_Social_Behavior_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.socialSkills]?.[localizationConstants.behavior]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.socialSkills]?.[localizationConstants.behavior]), totalQuestions: 9 },
                    { title: localizationConstants.visualAndPerceptualAbility, localKey: 'visualAndPerceptualAbility', qusetions: grade_9_Social_Visual_Qusetions, selection: safeGetSelection(Grade_9_Marks?.[localizationConstants.socialSkills]?.[localizationConstants.visualAndPerceptualAbility]), total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.socialSkills]?.[localizationConstants.visualAndPerceptualAbility]), totalQuestions: 8 },
                ],
                total: safeFilterTotal(Grade_9_Marks?.[localizationConstants.socialSkills]?.[localizationConstants.behavior]) + safeFilterTotal(Grade_9_Marks?.[localizationConstants.socialSkills]?.[localizationConstants.visualAndPerceptualAbility]),
                totalQuestions: 17,
            },
        };
    }
};

// ============================================================================
// ==================== TABLE COLUMNS (OLD & NEW) ====================
// ============================================================================
export const Grade_4_TableColumns_OLD = [
    { id: localizationConstants.id, name: 'user_id', label: localizationConstants.id, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 70 },
    { id: localizationConstants.academicYear, name: 'academicYear', label: localizationConstants.academicYear, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 90 },
    { id: localizationConstants.studentsName, name: 'studentName', label: localizationConstants.studentsName, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 150 },
    { id: 'createdAt', name: 'createdAt', label: 'Created Date', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.asc, align: localizationConstants.left, width: 100 },
    { id: localizationConstants.attention, name: 'Attention', label: localizationConstants.attention, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: localizationConstants.fineMotorGrossMotorSkill, name: 'Fine Motor and Gross Motor Skill', label: localizationConstants.fineMotorGrossMotorSkill, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 180 },
    { id: localizationConstants.cognitive, name: 'Cognitive', label: localizationConstants.cognitive, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: localizationConstants.behavior, name: 'Behavior', label: localizationConstants.behavior, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
];
export const Grade_4_TableColumns_NEW = [
    { id: localizationConstants.id, name: 'user_id', label: localizationConstants.id, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 90 },
    { id: localizationConstants.academicYear, name: 'academicYear', label: localizationConstants.academicYear, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 140 },
    { id: localizationConstants.studentsName, name: 'studentName', label: localizationConstants.studentsName, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 170 },
    { id: 'createdAt', name: 'createdAt', label: 'Created Date', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.asc, align: localizationConstants.left, width: 130 },
    { id: localizationConstants.attention, name: 'Attention', label: localizationConstants.attention, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: localizationConstants.memory, name: 'Memory', label: localizationConstants.memory, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: localizationConstants.fineMotorGrossMotorSkill, name: 'Fine Motor and Gross Motor Skill', label: localizationConstants.fineMotorGrossMotorSkill, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 250 },
    { id: localizationConstants.cognitive, name: 'Cognitive', label: localizationConstants.cognitive, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 130 },
    { id: 'Language & Communication', name: 'Language & Communication', label: 'Language & Comm.', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 170 },
    { id: 'Executive Function', name: 'Executive Function', label: 'Executive Function', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 170 },
    { id: 'Academic Skills', name: 'Academic Skills', label: 'Academic Skills', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 150 },
    { id: localizationConstants.socialSkills, name: 'Social Skills', label: localizationConstants.socialSkills, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 130 },
    { id: 'Emotional Regulation', name: 'Emotional Regulation', label: 'Emotional Reg.', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 150 },
    { id: localizationConstants.behavior, name: 'Behavior', label: localizationConstants.behavior, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 130 },
    { id: 'Adaptive Skills', name: 'Adaptive Skills', label: 'Adaptive Skills', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 150 },
];
export const Grade_9_TableColumns_OLD = [
    { id: localizationConstants.id, name: 'user_id', label: localizationConstants.id, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 70 },
    { id: localizationConstants.academicYear, name: 'academicYear', label: localizationConstants.academicYear, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 90 },
    { id: localizationConstants.studentsName, name: 'studentName', label: localizationConstants.studentsName, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 150 },
    { id: 'createdAt', name: 'createdAt', label: 'Created Date', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.asc, align: localizationConstants.left, width: 100 },
    { id: localizationConstants.attentionHyperactivity, name: 'Attention and Hyperactivity', label: localizationConstants.attentionHyperactivity, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 180 },
    { id: localizationConstants.memory, name: 'Memory', label: localizationConstants.memory, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: localizationConstants.fineMotorGrossMotorSkillPGC, name: 'Fine Motor and Gross Motor Skill', label: localizationConstants.fineMotorGrossMotorSkillPGC, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 200 },
    { id: localizationConstants.cognitive, name: 'Cognitive', label: localizationConstants.cognitive, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: `${localizationConstants.social} Skills`, name: 'Social Skill', label: `${localizationConstants.social} Skills`, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120 },
    { id: localizationConstants.showCategoryActions, name: 'actions', label: '', width: 50 },
];
export const Grade_9_TableColumns_NEW = [
    { id: localizationConstants.id, name: 'user_id', label: localizationConstants.id, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 70 },
    { id: localizationConstants.academicYear, name: 'academicYear', label: localizationConstants.academicYear, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 90 },
    { id: localizationConstants.studentsName, name: 'studentName', label: localizationConstants.studentsName, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 150 },
    { id: 'createdAt', name: 'createdAt', label: 'Created Date', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.asc, align: localizationConstants.left, width: 100 },
    { id: localizationConstants.attentionHyperactivity, name: 'Attention and Hyperactivity', label: localizationConstants.attentionHyperactivity, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 180 },
    { id: localizationConstants.memory, name: 'Memory', label: localizationConstants.memory, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: localizationConstants.fineMotorGrossMotorSkillPGC, name: 'Fine Motor and Gross Motor Skill', label: localizationConstants.fineMotorGrossMotorSkillPGC, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 200 },
    { id: localizationConstants.cognitive, name: 'Cognitive', label: localizationConstants.cognitive, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: 'Language & Communication', name: 'Language & Communication', label: 'Language & Comm.', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 140 },
    { id: 'Executive Function', name: 'Executive Function', label: 'Executive Function', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 140 },
    { id: 'Academic Skills', name: 'Academic Skills', label: 'Academic Skills', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120 },
    { id: `${localizationConstants.social} Skills`, name: 'Social Skill', label: `${localizationConstants.social} Skills`, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120 },
    { id: 'Emotional Regulation', name: 'Emotional Regulation', label: 'Emotional Reg.', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120 },
    { id: localizationConstants.behavior, name: 'Behavior', label: localizationConstants.behavior, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 100 },
    { id: 'Adaptive Skills', name: 'Adaptive Skills', label: 'Adaptive Skills', numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120 },
    { id: localizationConstants.showCategoryActions, name: 'actions', label: '', width: 50 },
];

export const TableColumnsAnalytics = [
    { id: localizationConstants.domain, name: 'user_id', label: localizationConstants.domain, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 150 },
    { id: localizationConstants.percentage, name: 'studentName', label: localizationConstants.percentage, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.left, width: 100 },
    { id: localizationConstants.green, name: 'schoolName', label: `${localizationConstants.green} (0-50%)`, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120, bgColor: 'globalElementColors.green2' },
    { id: localizationConstants.orange, name: 'className', label: `${localizationConstants.orange} (50-75%)`, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 130, bgColor: 'globalElementColors.yellow' },
    { id: localizationConstants.red, name: 'section', label: `${localizationConstants.red} (75-100%)`, numeric: false, dataCount: false, disablePadding: false, sort: sortEnum.desc, align: localizationConstants.center, width: 120, bgColor: 'globalElementColors.red' },
];

// ============================================================================
// ==================== RE-ADDED ANALYTICS FUNCTIONS ====================
// ============================================================================

export const Grade_4_AData = (data) => {
    const domains = [
        { key: 'Attention', label: localizationConstants.attention },
        { key: 'Memory', label: localizationConstants.memory },
        { key: 'fineMotorAndGrossMotorSkills', label: localizationConstants.fineMotorGrossMotorSkill },
        { key: 'Cognitive', label: localizationConstants.cognitive },
        { key: 'Language & Communication', label: 'Language & Communication' },
        { key: 'Executive Function', label: 'Executive Function' },
        { key: 'Academic Skills', label: 'Academic Skills' },
        { key: 'SocialSkill', label: localizationConstants.socialSkills },
        { key: 'Emotional Regulation', label: 'Emotional Regulation' },
        { key: 'Behavior', label: localizationConstants.behavior },
        { key: 'Adaptive Skills', label: 'Adaptive Skills' },
    ];
    return domains.map(d => ({
        domain: d.label,
        per: data?.[d.key]?.percentage || 0,
        green: data?.[d.key]?.['0-50%'] || 0,
        orange: data?.[d.key]?.['50-75%'] || 0,
        red: data?.[d.key]?.['75-100%'] || 0,
    }));
}

export const Grade_9_AData = (data) => {
    const domains = [
        { key: 'AttentionAndHyperactivity', label: localizationConstants.attentionHyperactivity },
        { key: 'Memory', label: localizationConstants.memory },
        { key: 'fineMotorAndGrossMotorSkills', label: localizationConstants.fineMotorGrossMotorSkillPGC },
        { key: 'Cognitive', label: localizationConstants.cognitive },
        { key: 'Language & Communication', label: 'Language & Communication' },
        { key: 'Executive Function', label: 'Executive Function' },
        { key: 'Academic Skills', label: 'Academic Skills' },
        { key: 'SocialSkill', label: localizationConstants.socialSkills },
        { key: 'Emotional Regulation', label: 'Emotional Regulation' },
        { key: 'Behavior', label: localizationConstants.behavior },
        { key: 'Adaptive Skills', label: 'Adaptive Skills' },
    ];
    return domains.map(d => ({
        domain: d.label,
        per: data?.[d.key]?.percentage || 0,
        green: data?.[d.key]?.['0-50%'] || 0,
        orange: data?.[d.key]?.['50-75%'] || 0,
        red: data?.[d.key]?.['75-100%'] || 0,
    }));
}

export const analyticsbarData = (data) => [
    { title: `${localizationConstants.overviewOfStudentInGreen} (0-50%)`, data: data?.map((d) => d?.green) ?? [], color: hexaCodes?.green },
    { title: `${localizationConstants.overviewOfStudentInOrange} (50-75%)`, data: data?.map((d) => d?.orange) ?? [], color: hexaCodes?.orange },
    { title: `${localizationConstants.overviewOfStudentInRed} (75-100%)`, data: data?.map((d) => d?.red) ?? [], color: hexaCodes?.red },
]

export const analyticsBarChartData = (data, isGrade_4, color) => {
    return {
        labels: isGrade_4
            ? [localizationConstants.attention, localizationConstants.memory, localizationConstants.fineMotorGrossMotorSkill, localizationConstants.cognitive, 'Language & Communication', 'Executive Function', 'Academic Skills', localizationConstants.socialSkills, 'Emotional Regulation', localizationConstants.behavior, 'Adaptive Skills']
            : [localizationConstants.attentionHyperactivity, localizationConstants.memory, localizationConstants.fineMotorGrossMotorSkillPGC, localizationConstants.cognitive, 'Language & Communication', 'Executive Function', 'Academic Skills', localizationConstants.socialSkills, 'Emotional Regulation', localizationConstants.behavior, 'Adaptive Skills'],
        datasets: [{ data: data, backgroundColor: [color], borderWidth: 0, barThickness: 40, borderRadius: 5 }],
    }
}

export const generateGrade_4_data = (labels, ...domainDatasets) => {
    const labelsWithRank = labels;
    const colors = [hexaCodes?.blue1, hexaCodes?.green, hexaCodes?.yellow1, hexaCodes?.red, hexaCodes?.orange, '#9C27B0', '#00BCD4', '#E91E63', '#3F51B5', '#009688', '#FF9800'];
    const domainNames = [localizationConstants.attention, localizationConstants.memory, localizationConstants.fineMotorGrossMotorSkill, localizationConstants.cognitive, 'Language & Communication', 'Executive Function', 'Academic Skills', localizationConstants.socialSkills, 'Emotional Regulation', localizationConstants.behavior, 'Adaptive Skills'];
    const datasets = domainNames.map((name, index) => ({ label: [name], data: domainDatasets[index] || [], backgroundColor: [colors[index % colors.length]], borderRadius: 3, barPercentage: 0.5, categoryPercentage: 0.8, borderWidth: 0 }));
    return { labels: labelsWithRank, datasets: datasets }
}

export const generateGrade_9_data = (labels, ...domainDatasets) => {
    const labelsWithRank = labels;
    const colors = [hexaCodes?.blue1, hexaCodes?.green, hexaCodes?.yellow1, hexaCodes?.red, hexaCodes?.orange, '#9C27B0', '#00BCD4', '#E91E63', '#3F51B5', '#009688', '#FF9800'];
    const domainNames = [localizationConstants.attentionHyperactivity, localizationConstants.memory, localizationConstants.fineMotorGrossMotorSkillPGC, localizationConstants.cognitive, 'Language & Communication', 'Executive Function', 'Academic Skills', localizationConstants.socialSkills, 'Emotional Regulation', localizationConstants.behavior, 'Adaptive Skills'];
    const datasets = domainNames.map((name, index) => ({ label: [name], data: domainDatasets[index] || [], backgroundColor: [colors[index % colors.length]], borderRadius: 3, barPercentage: 0.5, categoryPercentage: 0.8, borderWidth: 0 }));
    return { labels: labelsWithRank, datasets: datasets }
}

export const categoriesNames = {
    attention: 'Attention',
    fineMotorGrossMotorSkill: 'Fine Motor and Gross Motor Skill',
    cognitive: 'Cognitive',
    behavior: 'Behavior',
    attentionHyperactivity: 'Attention and Hyperactivity',
    memory: 'Memory',
    fineMotorGrossMotorSkillPGC: 'Fine Motor and Gross Motor Skill',
    socialSkills: 'Social Skill',
    language: 'Language & Communication',
    executiveFunction: 'Executive Function',
    academicSkills: 'Academic Skills',
    emotionalRegulation: 'Emotional Regulation',
    adaptiveSkills: 'Adaptive Skills',
    readingAndSpelling: 'Reading & Spelling',
    numeracySkills: 'Numeracy Skills',
    speakingAndListening: 'Speaking And Listening',
    styleofWorking: 'Style of Working',
    visualAndPerceptualAbility: 'Visual And Perceptual Ability',
};

export const HeadersData = [
    categoriesNames.attention, categoriesNames.fineMotorGrossMotorSkill, categoriesNames.cognitive, categoriesNames.behavior,
    categoriesNames.attentionHyperactivity, categoriesNames.memory, localizationConstants.fineMotorGrossMotorSkillPGC, categoriesNames.socialSkills,
    categoriesNames.language, categoriesNames.executiveFunction, categoriesNames.academicSkills, categoriesNames.emotionalRegulation, categoriesNames.adaptiveSkills
];

export const subHeadersData = [];