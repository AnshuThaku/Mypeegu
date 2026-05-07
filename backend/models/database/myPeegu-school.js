const mongoose = require('mongoose')
const { collections } = require('../../utility/databaseConstants')

const schoolSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      minlength: 1,
      maxlength: 60,
      required: true,
      trim: true,
    },
    allow_sse_counselor_individualcase: {
      type: Boolean,
      default: false,
    },
    // ── NAYA FIELD: SEL Tracker ke liye assigned years ──
    assignedSELYears: [{
      type: String,
      trim: true,
    }],
    scCode: {
      type: String,
      unique: true,
      required: true,
      maxlength: 20,
      trim: true,
    },
    address: {
      type: String,
      maxlength: 255,
      trim: true,
    },
    lastPromotionDate: {
      type: Date,
      default: null,
    },
    studentCountInSchool: { type: Number, default: 0 },
    COPEScore: { type: Number, default: 0 },
    schoolMeanForSTReg: { type: Number, default: 0 },
    schoolMeanForLTReg: { type: Number, default: 0 },
    noOfstudentsFilledCOPEForm: { type: Number, default: 0 },
    city: {
      type: String,
      maxlength: 100,
      required: true,
      trim: true,
    },
    // state2: {
    //  type: mongoose.Types.ObjectId ,
    //  ref: collections.states,
    //  required: true,
    // },
    state: {
      type: mongoose.Types.ObjectId ,
      ref: collections.states,
      required: true,
    },
    country: {
      type: mongoose.Types.ObjectId,
      ref: collections.countries,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
    },
    scLogo: {
      type: String,
      maxlength: 200,
      trim: true,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    webSite: {
      type: String,
      trim: true,
    },
    onboardDate: {
      type: Date,
    },
    establishedYear: {
      type: Date,
    },
    principalName: {
      type: String,
      required: true,
      trim: true,
    },
    principalEmail: {
      type: String,
      trim: true,
    },
    principalPhone: {
      type: String,
      trim: true,
    },
    about: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      // default: globalConstants.schoolStatus.Active,
      default: 'Active',

      trim: true,
    },
    labPin: {
    type: String,
    default: '654321', // Default pin jo naye schools ko automatic milega
    trim: true
  },
    lastPromotionAcademicYear: {
      type: mongoose.Types.ObjectId ,
      ref: collections.academicYears,
    },
    createdByName: {
      type: String,
      trim: true,
    },
    updatedByName: {
      type: String,
      trim: true,
    },
    createdById: {
      type: String,
      trim: true,
    },
    updatedById: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
)

const Schools = mongoose.model(collections.schools, schoolSchema)
module.exports.Schools = Schools