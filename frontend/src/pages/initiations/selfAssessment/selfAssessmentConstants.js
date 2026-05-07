// selfAssessmentConstants.js

// 🟢 1. TIER LABELS & AI MESSAGES
export const TIER_INFO = {
  1: {
    id: 1,
    label: 'Tier 1 — On track',
    defaultAiMsg: 'These students are developing well. Continue SEL curriculum and preventive group activities. Peer mentoring roles can further strengthen their confidence and social skills.'
  },
  2: {
    id: 2,
    label: 'Tier 2 — Targeted support',
    defaultAiMsg: 'Primary concerns are internal distress and task execution gaps. Recommend bi-weekly small group sessions on stress management and planning skills. 4 students need parent communication within 2 weeks.'
  },
  3: {
    id: 3,
    label: 'Tier 3 — Intensive support',
    defaultAiMsg: 'All 4 students show combined distress + help-seeking risk flags. Immediate 1:1 counselling sessions required. 2 students are internalising — not expressing at home. Coordinate with parents this week.'
  }
};

// 🟢 2. COMMON AI STRATEGIES & INSIGHTS (Used across different reports)
export const AI_INSIGHTS = {
  classroomStrategies: [
    { domain: 'Distress (41%)', text: 'Transparent exam calendars, validate pressure explicitly, no surprise assessments' },
    { domain: 'Organisation (32%)', text: 'Chunked task sheets, weekly planner check-ins, visual deadlines on board' },
    { domain: 'Help-seeking (24%)', text: 'Anonymous Q boxes, exit tickets, normalise peer help in group tasks' }
  ],
  
  genderInsights: {
    alert: "Dahlia section worsening — Tier 3 up from 11% to 20%. Coordinator review recommended.",
    girlsDesc: "Internal distress and exam pressure dominant. Help-seeking is strong — girls are reaching out.",
    boysDesc: "Attention and impulsivity dominant. Help-seeking is lower — more silent internalisers."
  },
  
  schoolAlerts: {
    sltWarning: "Grades 10–12 worsening trend. Burnout and exam pressure dominant. Recommend school-wide stress programme before Term 3 exams.",
    counselorLoadInsight: "Sneha's session volume is highest and correlates with G11–12 worsening trend. Consider adding a second counsellor or group-based intervention to manage load."
  }
};

// 🟢 3. MOCK DATA FALLBACK (Jab tak API connect nahi hoti)
export const MOCK_BASELINE_HEADER = {
  schoolName: "ANPS Bengaluru",
  baselineCycle: "Baseline 2",
  dateStr: "Oct 2025"
};