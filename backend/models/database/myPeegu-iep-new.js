const mongoose = require('mongoose');

// Define sub-schema for AI-generated goals
const aiGeneratedGoalSchema = new mongoose.Schema({
  goalType: { type: String, enum: ['ShortTerm', 'LongTerm'], required: true },
  domain: { type: String, required: true },
  goalDescription: { type: String, required: true },
  interventions: [{ type: String }],
  status: { type: String, enum: ['Pending', 'In Progress', 'Achieved'], default: 'Pending' }
}, { _id: false });

const iepSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'students', required: true },
  schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'schools', required: true },
  academicYear: { type: String, required: true },

  // --- 🟢 NAYA: Evaluation Details (For Accordions) ---
  evaluationDetails: {
    studentProfile: { type: String, default: "" },
    diagnosis: { type: String, default: "" },
    cognitiveStrengths: { type: String, default: "" },
    strengthsWeaknesses: { type: String, default: "" },
    recommendations: { type: String, default: "" }
  },

  // --- 🟢 NAYA: PLOP Analysis (For Table) ---
  plopAnalysis: {
    physical: { type: String, default: "" },
    social: { type: String, default: "" },
    emotional: { type: String, default: "" },
    cognitive: { type: String, default: "" },
    language: { type: String, default: "" }
  },

  // Existing Fields
  Evolution: { type: String, enum: ['Yes', 'No'], default: 'No' },
  AccommodationFromBoard: { type: String, enum: ['Yes', 'No'], default: 'No' },
  AccommodationInternal: { type: String, enum: ['Yes', 'No'], default: 'No' },
  transitionPlanning: { type: String, enum: ['Yes', 'No'], default: 'No' },
  IndividualSession: { type: String, enum: ['Yes', 'No'], default: 'No' },
  GroupSession: { type: String, enum: ['Yes', 'No'], default: 'No' },
  ShortTermGoal: { type: Number, default: 0 },
  LongTermGoal: { type: Number, default: 0 },

  evaluationReportUrl: { type: String, default: "" },
  aiEvaluationSummary: { type: String, default: "" },
  aiGeneratedGoals: [aiGeneratedGoalSchema],
  
  baselineSnapshot: {
    tier: { type: String, default: "" },
    adjustedRisk: { type: Number, default: 0 },
    strengthScore: { type: Number, default: 0 }
  },

  supportNeeds: {
    accommodations: {
      specialEducationClasses: { type: String, default: 'No' },
      behavioralInterventions: { type: String, default: 'No' },
      oneOnOneHRT: { type: String, default: 'No' },
      focusClasses: { type: String, default: 'No' },
      accommodationsInSchool: { type: String, default: 'No' },
      assistiveTechnology: { type: String, default: 'No' }
    },
    transitionPlanning: {
      communityExperience: { type: String, default: 'No' },
      activitiesOfDailyLiving: { type: String, default: 'No' },
      functionalVocationalAssistance: { type: String, default: 'No' }
    },
    placement: {
      individualSessions: { type: String, default: 'No' },
      individualSessionCount: { type: String, default: '1 session' },
      groupSessions: { type: String, default: 'No' }
    }
  }

}, { timestamps: true });

module.exports = mongoose.model('IEP', iepSchema);