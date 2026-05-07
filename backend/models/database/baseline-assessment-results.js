// models/database/baseline-assessment-results.js

const mongoose = require('mongoose');

const questionResponseSchema = new mongoose.Schema({
  questionText: { type: String, required: true }, // Sawal kya tha (e.g., "I get distracted easily")
  domain: { type: String, required: true },       // Kis category ka hai (e.g., "Cognitive")
  categoryLabel: { type: String },                // Naya client label (e.g., "Focus")
  selectedOption: { type: String, required: true }, // Bache ne kya chuna (e.g., "Sometimes")
  rawScore: { type: Number, required: true },       // 0, 1, 2, ya 3
  isReversed: { type: Boolean, default: false },    // Reverse formula laga ya nahi
  finalScore: { type: Number, required: true }      // Calculation ke baad ka aakhri score
}, { _id: false }); // _id false rakha taaki har array item ki extra ID na bane

const domainScoreSchema = new mongoose.Schema({
  domainName: { type: String, required: true },   // "Cognitive"
  totalScore: { type: Number, required: true },   // Domain ka sum
  questionCount: { type: Number, required: true }, // Kitne sawal the
  averageScore: { type: Number, required: true }, // Sum / Count
  percentage: { type: Number, required: true }    // (Average / MaxScore) * 100
}, { _id: false });

const baselineAssessmentResultSchema = new mongoose.Schema({
  student: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student', // Aapke student model ka naam
    required: true 
  },
  school: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: true 
  },
  academicYear: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AcademicYear', 
    required: true 
  },
  
  // Test Details
  gradeBand: { type: String, required: true }, // "G6-8", "G8-9", ya "G10-12"
  assessmentType: { type: String, enum: ['Baseline 1', 'Baseline 2', 'Baseline 3'], default: 'Baseline 1' },
  maxScorePerQuestion: { type: Number, required: true }, // 3 (G6-8 ke liye) ya 4 (G8-12 ke liye)
  
  // The Core Data
  responses: [questionResponseSchema], // Upar banaya hua schema (saare 12-26 sawal yahan aayenge)
  domainScores: [domainScoreSchema],   // Upar banaya hua schema (har domain ki percentage)
  
  // Final Result
  overallPercentage: { type: Number, required: true }, 
  tierPlacement: { type: String, required: true }, // "Tier 1 (Typical)", etc.
  
  submittedAt: { type: Date, default: Date.now }
}, {
  timestamps: true // createdAt, updatedAt apne aap ban jayenge
});

module.exports = mongoose.model('BaselineAssessmentResult', baselineAssessmentResultSchema);