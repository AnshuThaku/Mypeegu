const mongoose = require('mongoose')
const { collections } = require('../../utility/databaseConstants')
const { buildComboKey } = require('../../utility/common-utility-functions')

const baselineCategorySchema = new mongoose.Schema({
    status: { type: String, trim: true },
    question: { type: String, trim: true },
    _id: false,
})

const baselineSchema = new mongoose.Schema(
    {
        user_id: { type: String, trim: true },
        studentName: { type: String, trim: true },
        school: { type: mongoose.Schema.Types.ObjectId, ref: collections.schools },
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: collections.students },
        classRoomId: { type: mongoose.Schema.Types.ObjectId, ref: collections.classrooms },
        baselineForm: { type: String, trim: true },
        baselineCategory: {
            type: String,
            enum: ['Baseline 1', 'Baseline 2', 'Baseline 3'],
        },
        
        // 👇 DOMAINS UPDATED WITH STRENGTH FIELDS 👇
        Physical: {
            data: [baselineCategorySchema],
            total: { type: String, trim: true },
            adjustedRisk: { type: Number },
            isFlagged: { type: Boolean, default: false },
            strengthScore: { type: Number, default: 0 }, // NAYA FIELD
            protectiveLevel: { type: String, default: 'Low' } // NAYA FIELD
        },
        Social: {
            data: [baselineCategorySchema],
            total: { type: String, trim: true },
            adjustedRisk: { type: Number },
            isFlagged: { type: Boolean, default: false },
            strengthScore: { type: Number, default: 0 }, // NAYA FIELD
            protectiveLevel: { type: String, default: 'Low' } // NAYA FIELD
        },
        Emotional: {
            data: [baselineCategorySchema],
            total: { type: String, trim: true },
            adjustedRisk: { type: Number },
            isFlagged: { type: Boolean, default: false },
            strengthScore: { type: Number, default: 0 }, // NAYA FIELD
            protectiveLevel: { type: String, default: 'Low' } // NAYA FIELD
        },
        Cognitive: {
            data: [baselineCategorySchema],
            total: { type: String, trim: true },
            adjustedRisk: { type: Number },
            isFlagged: { type: Boolean, default: false },
            strengthScore: { type: Number, default: 0 }, // NAYA FIELD
            protectiveLevel: { type: String, default: 'Low' } // NAYA FIELD
        },
        Language: {
            data: [baselineCategorySchema],
            total: { type: String, trim: true },
            adjustedRisk: { type: Number },
            isFlagged: { type: Boolean, default: false },
            strengthScore: { type: Number, default: 0 }, // NAYA FIELD
            protectiveLevel: { type: String, default: 'Low' } // NAYA FIELD
        },

        // --- NAYE OVERALL SCORING FIELDS ---
        overallAdjustedRisk: { type: Number },
        overallStrengthScore: { type: Number, default: 0 }, // 🌟 NAYA FIELD (Total Strength ke liye)
        overallTier: {
            type: String,
            enum: [
                'Tier 1 (Universal Support)', 
                'Tier 1 Monitoring', 
                'Tier 2 (Targeted Monitoring)', 
                'Tier 3 (Intensive Support)'
            ],
            default: 'Tier 1 (Universal Support)'
        },
        totalFlaggedDomains: { type: Number, default: 0 },
        systemAlerts: [{ type: String }],
        influenceSeverity: { type: String },
        // ------------------------------------

        status: { type: String, default: 'Active', trim: true },
        SAY: { type: mongoose.Schema.Types.ObjectId, ref: collections.schoolAcademicYears },
        academicYear: { type: mongoose.Schema.Types.ObjectId, ref: collections.academicYears },
        graduated: { type: Boolean, default: false },
        exited: { type: Boolean, default: false },
        createdByName: { type: String, trim: true },
        updatedByName: { type: String, trim: true },
        createdById: { type: String, trim: true },
        updatedById: { type: String, trim: true },
        comboKey: { type: String, default: null },
    },
    { timestamps: true },
)

// Automatically build comboKey
baselineSchema.pre('save', function (next) {
    if (
        this.isNew ||
        this.isModified('studentId') ||
        this.isModified('classRoomId') ||
        this.isModified('academicYear')
    ) {
        this.comboKey = buildComboKey(this.studentId, this.classRoomId, this.academicYear)
    }
    next()
}) 

baselineSchema.pre('insertMany', function (next, docs) {
    for (const doc of docs) {
        doc.comboKey = buildComboKey(doc.studentId, doc.classRoomId, doc.academicYear)
    }
    next()
}) 

baselineSchema.index({ comboKey: 1 })
baselineSchema.index({ studentId: 1, classRoomId: 1, academicYear: 1 })

const BaselineRecord = mongoose.model(collections.baselineRecords, baselineSchema)
module.exports.BaselineRecord = BaselineRecord