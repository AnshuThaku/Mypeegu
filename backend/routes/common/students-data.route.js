// const express = require('express')
// const router = express.Router()
// const { authMyPeeguUser } = require('../../middleware/auth')
// const asyncMiddleware = require('../../middleware/async')
// const mongoose = require('mongoose');
// const {
// 	viewStudents,
// 	viewBaseline,
// 	canViewedByTeacherOrHigherUser,
// 	canViewIndividualCase,
// } = require('../../middleware/validate.counselorManagement')
// const { baselineAnalyticService } = require('../../services/baseline/baseline-analytics-service')
// const { baselineService } = require('../../services/baseline/baseline-service')
// const { observationServices } = require('../../services/observation/observation.service')
// const { individualService } = require('../../services/individual/individual.service')
// const { selServices } = require('../../services/sel/sel-service')
// const { sendChecklistService } = require('../../services/send-checklist/send-checklist-service')
// const { iepService } = require('../../services/IEP/IEP-service')
// const iep360Service = require('../../services/IEP/IEP-360-service')
// const aiEvaluatorService = require('../../services/IEP/AI-evaluator-service')
// const { Students: Student } = require('../../models/database/myPeegu-student')
// const { BaselineRecord } = require('../../models/database/myPeegu-baseline')
// const IEPRecord = require('../../models/database/myPeegu-iep-new')
// const multer = require('multer')

// // Configure multer with memory storage and strict 5MB limit
// const upload = multer({ 
// 	storage: multer.memoryStorage(),
// 	limits: { fileSize: 5 * 1024 * 1024 }
// })

// const {
// 	studentCopeService,
// } = require('../../services/assessments/student-cope/student-cope-service')
// const {
// 	studentWellBeingService,
// } = require('../../services/assessments/student-wellbeing/student-wellbeing-service')
// const {
// 	schoolProfilingService,
// } = require('../../services/assessments/teacher-profiling/profilingForSchools.service')
// const {
// 	teacherProfilingService,
// } = require('../../services/assessments/teacher-profiling/profilingForTeachers.service')
// const { schoolIRIService } = require('../../services/assessments/teacher-iri/iriForSchools.service')
// const {
// 	teacherIRIService,
// } = require('../../services/assessments/teacher-iri/iriForTeachers.service')

// // -------------------------------- Observation --------------------------------------
// router.post(
// 	'/observations-list',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(observationServices.fetchObservationsList.bind(observationServices)),
// )

// router.get(
// 	'/observation-record/:id',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(observationServices.fetchObservationDetails.bind(observationServices)),
// )

// // -------------------------------- IndividualCase --------------------------------------
// router.post(
// 	'/individualcase-list',
// 	authMyPeeguUser,
// 	canViewIndividualCase,
// 	asyncMiddleware(individualService.fetchIndividualCaseList.bind(individualService)),
// )

// router.get(
// 	'/individualcase-record/:id',
// 	authMyPeeguUser,
// 	canViewIndividualCase,
// 	asyncMiddleware(individualService.fetchIndividualCaseDetails.bind(individualService)),
// )

// // -------------------------------- Baseline --------------------------------------
// router.post(
// 	'/baseline-list',
// 	authMyPeeguUser,
// 	viewBaseline,
// 	asyncMiddleware(baselineService.fetchBaselineRecordsList.bind(baselineService)),
// )

// // -------------------------------- Baseline Analytics --------------------------------------
// router.post(
// 	'/single-record-baseline-analytics',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.singleStudentBaselineAnalytics.bind(baselineAnalyticService),
// 	),
// )

// router.post(
// 	'/baseline-analytics-all-schools',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.allSchoolsBaselineAnalytics.bind(baselineAnalyticService),
// 	),
// )

// router.post(
// 	'/baseline-analytics-one-school',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.singleSchoolsBaselineAnalytics.bind(baselineAnalyticService),
// 	),
// )

// router.post(
// 	'/baseline-students-by-screening-status',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.getStudentsByScreeningStatus.bind(baselineAnalyticService),
// 	),
// )

// router.post(
// 	'/baseline-risk-dashboard',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.getRiskDashboardData.bind(baselineAnalyticService),
// 	),
// )

// router.post(
// 	'/baseline-students-by-support-level',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.getStudentsBySupportLevel.bind(baselineAnalyticService),
// 	),
// )

// router.post(
// 	'/baseline-analytics-export',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		baselineAnalyticService.getDetailedExportData.bind(baselineAnalyticService),
// 	),
// )

// // -------------------------------- SEL Curriculum Trackers --------------------------------------
// router.post(
// 	'/sel-curriculum-tracker-list',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(selServices.fetchSELList.bind(selServices)),
// )

// router.get(
// 	'/sel-curriculum-tracker/:id',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(selServices.fetchSELCurriculumTrackerDetails.bind(selServices)),
// )

// // -------------------------------- Send Checklist --------------------------------------
// router.post(
// 	'/checklist-records',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(sendChecklistService.fetchSendChecklistRecords.bind(sendChecklistService)),
// )

// router.post(
// 	'/all-schools-send-checklist-analytics',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		sendChecklistService.getAllSchoolsSendChecklistAnalytics.bind(sendChecklistService),
// 	),
// )

// router.post(
// 	'/single-school-send-checklist-analytics',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		sendChecklistService.getOneSchoolsSendChecklistAnalytics.bind(sendChecklistService),
// 	),
// )

// // -------------------------------- IEP Education planner --------------------------------------
// router.post(
// 	'
// -ai-evaluate/:studentId',
// 	authMyPeeguUser,
// 	upload.single('diagnosticReport'),
// 	asyncMiddleware(async (req, res) => {
// 		// 1. Validate the presence of the uploaded file
// 		if (!req.file) {
// 			return res.status(400).json({ success: false, message: 'Diagnostic report PDF is required.' })
// 		}

// 		const { studentId } = req.params

// 		// 2. Fetch the Student profile securely resolving non-objectId custom strings if they exist
// 		let query = { user_id: studentId }
// 		if (mongoose.Types.ObjectId.isValid(studentId)) {
// 			query = { $or: [{ _id: studentId }, { user_id: studentId }] }
// 		}

// 		const student = await Student.findOne(query).lean()
// 		if (!student) {
// 			return res.status(404).json({ success: false, message: 'Student not found.' })
// 		}

// 		const pureObjectId = student._id

// 		// 3. Fetch the latest BaselineRecord for this student
// 		const latestBaseline = await BaselineRecord.findOne({
// 			$or: [{ studentId: pureObjectId }, { user_id: student.user_id }]
// 		}).sort({ createdAt: -1 }).lean()

// 		// 4. Call the AI service to generate IEP goals from the PDF buffer
// 		const aiResult = await aiEvaluatorService.generateIEPGoalsFromPDF(req.file.buffer, latestBaseline)

// 		// 5. Update the student's IEPRecord with the AI-generated results
// 		const updatedIEP = await IEPRecord.findOneAndUpdate(
// 			{ studentId: pureObjectId },
// 			{ 
// 				$set: { 
// 					aiEvaluationSummary: aiResult.aiEvaluationSummary,
// 					aiGeneratedGoals: aiResult.aiGeneratedGoals 
// 				} 
// 			},
// 			{ new: true, upsert: true }
// 		)

// 		// 6. Return a successful 200 JSON response with updated IEP data
// 		res.status(200).json({ success: true, data: updatedIEP })
// 	})
// )

// router.post(
// 	'/iep-student-360',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(async (req, res) => {
// 		// Extract studentId and academicYear from the request body
// 		const { studentId, academicYear } = req.body;
		
// 		// Call the newly created IEP 360 service
// 		const data = await iep360Service.getStudent360Profile(studentId, academicYear);
		
// 		// Return the successful response
// 		res.status(200).json({ success: true, data: data });
// 	})
// )

// router.post(
// 	'/iep-records',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(iepService.fetchIEPRecords.bind(iepService)),
// )

// router.post(
// 	'/iep-record',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(iepService.fetchIEPRecord.bind(iepService)),
// )

// router.post(
// 	'/get-pre-signed-url',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(iepService.getPresignedUrlForIep.bind(iepService)),
// )

// router.post(
// 	'/baseline-performance',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(iepService.fetchBaselinePerformance.bind(iepService)),
// )

// router.post(
// 	'/verify-checklist-data',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(iepService.verifyChecklistData.bind(iepService)),
// )

// // -------------------------------- Students Cope --------------------------------------
// router.post(
// 	'/student-cope-records',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(studentCopeService.fetchStudentCopeList.bind(studentCopeService)),
// )

// router.get(
// 	'/student-cope-record/:id',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(studentCopeService.fetchStudentCope.bind(studentCopeService)),
// )

// router.post(
// 	'/student-cope-analytics-schools',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		studentCopeService.fetchStudentCopeAnalyticsForSchools.bind(studentCopeService),
// 	),
// )

// router.post(
// 	'/student-cope-analytics-classrooms',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		studentCopeService.fetchStudentCopeAnalyticsForClassrooms.bind(studentCopeService),
// 	),
// )

// // -------------------------------- Students WellBeing --------------------------------------
// router.post(
// 	'/student-wb-records',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		studentWellBeingService.fetchStudentWellBeingRecords.bind(studentWellBeingService),
// 	),
// )

// router.get(
// 	'/student-wb-record/:id',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(studentWellBeingService.fetchStudentWB.bind(studentWellBeingService)),
// )

// router.post(
// 	'/student-wb-analytics-schools',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		studentWellBeingService.fetchStudentWellBeingAnalyticsForSchools.bind(
// 			studentWellBeingService,
// 		),
// 	),
// )

// router.post(
// 	'/student-wb-analytics-classrooms',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		studentWellBeingService.fetchStudentWellBeingAnalyticsForClassrooms.bind(
// 			studentWellBeingService,
// 		),
// 	),
// )

// // -------------------------------- Teacher Profilings --------------------------------------
// router.post(
// 	'/profilings-for-schools',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		schoolProfilingService.fetchAllProfilingsForSchools.bind(schoolProfilingService),
// 	),
// )

// router.post(
// 	'/fetch-teacher-profiling',
// 	authMyPeeguUser,
// 	canViewedByTeacherOrHigherUser,
// 	asyncMiddleware(
// 		teacherProfilingService.fetchSingleTeacherProfiling.bind(schoolProfilingService),
// 	),
// )

// router.post(
// 	'/profilings-for-teachers',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		teacherProfilingService.fetchAllProfilingsForTeacher.bind(teacherProfilingService),
// 	),
// )

// router.post(
// 	'/fetch-profiling-analytics',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(
// 		teacherProfilingService.fetchProfilingAnalytics.bind(teacherProfilingService),
// 	),
// )

// // -------------------------------- Teacher IRI --------------------------------------
// router.post(
// 	'/iri-for-schools',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(schoolIRIService.fetchAllIRIsForSchools.bind(schoolIRIService)),
// )

// router.post(
// 	'/iris-for-teachers',
// 	authMyPeeguUser,
// 	viewStudents,
// 	asyncMiddleware(teacherIRIService.fetchAllIRIsForTeacher.bind(teacherIRIService)),
// )

// router.post(
// 	'/fetch-teacher-iri',
// 	authMyPeeguUser,
// 	canViewedByTeacherOrHigherUser,
// 	asyncMiddleware(teacherIRIService.fetchSingleTeacherIRI.bind(teacherIRIService)),
// )

// module.exports = router


const express = require('express')
const router = express.Router()
const { authMyPeeguUser } = require('../../middleware/auth')
const asyncMiddleware = require('../../middleware/async')
const mongoose = require('mongoose')
const {
    viewStudents,
    viewBaseline,
    canViewedByTeacherOrHigherUser,
    canViewIndividualCase,
} = require('../../middleware/validate.counselorManagement')
const { baselineAnalyticService } = require('../../services/baseline/baseline-analytics-service')
const { baselineService } = require('../../services/baseline/baseline-service')
const { observationServices } = require('../../services/observation/observation.service')
const { individualService } = require('../../services/individual/individual.service')
const { selServices } = require('../../services/sel/sel-service')
const { sendChecklistService } = require('../../services/send-checklist/send-checklist-service')
const { iepService } = require('../../services/IEP/IEP-service')
const iep360Service = require('../../services/IEP/IEP-360-service')
const aiEvaluatorService = require('../../services/IEP/AI-evaluator-service')

// Models
const { Students: Student } = require('../../models/database/myPeegu-student')
const { BaselineRecord } = require('../../models/database/myPeegu-baseline')
const IEPRecord = require('../../models/database/myPeegu-iep-new')
const { StudentCheckList } = require('../../models/database/myPeegu-sendCheckList')
const { ObservationRecord: Observation } = require('../../models/database/myPeegu-observation')

const multer = require('multer')

// Configure multer with memory storage and strict 5MB limit
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
})

const {
    studentCopeService,
} = require('../../services/assessments/student-cope/student-cope-service')
const {
    studentWellBeingService,
} = require('../../services/assessments/student-wellbeing/student-wellbeing-service')
const {
    schoolProfilingService,
} = require('../../services/assessments/teacher-profiling/profilingForSchools.service')
const {
    teacherProfilingService,
} = require('../../services/assessments/teacher-profiling/profilingForTeachers.service')
const { schoolIRIService } = require('../../services/assessments/teacher-iri/iriForSchools.service')
const {
    teacherIRIService,
} = require('../../services/assessments/teacher-iri/iriForTeachers.service')

// -------------------------------- Observation --------------------------------------
router.post(
    '/observations-list',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(observationServices.fetchObservationsList.bind(observationServices)),
)

router.get(
    '/observation-record/:id',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(observationServices.fetchObservationDetails.bind(observationServices)),
)

// -------------------------------- IndividualCase --------------------------------------
router.post(
    '/individualcase-list',
    authMyPeeguUser,
    canViewIndividualCase,
    asyncMiddleware(individualService.fetchIndividualCaseList.bind(individualService)),
)

router.get(
    '/individualcase-record/:id',
    authMyPeeguUser,
    canViewIndividualCase,
    asyncMiddleware(individualService.fetchIndividualCaseDetails.bind(individualService)),
)

// -------------------------------- Baseline --------------------------------------
router.post(
    '/baseline-list',
    authMyPeeguUser,
    viewBaseline,
    asyncMiddleware(baselineService.fetchBaselineRecordsList.bind(baselineService)),
)

// -------------------------------- Baseline Analytics --------------------------------------
router.post(
    '/single-record-baseline-analytics',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.singleStudentBaselineAnalytics.bind(baselineAnalyticService),
    ),
)

router.post(
    '/baseline-analytics-all-schools',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.allSchoolsBaselineAnalytics.bind(baselineAnalyticService),
    ),
)

router.post(
    '/baseline-analytics-one-school',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.singleSchoolsBaselineAnalytics.bind(baselineAnalyticService),
    ),
)

router.post(
    '/baseline-students-by-screening-status',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.getStudentsByScreeningStatus.bind(baselineAnalyticService),
    ),
)

router.post(
    '/baseline-risk-dashboard',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.getRiskDashboardData.bind(baselineAnalyticService),
    ),
)

router.post(
    '/baseline-students-by-support-level',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.getStudentsBySupportLevel.bind(baselineAnalyticService),
    ),
)

router.post(
    '/baseline-analytics-export',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        baselineAnalyticService.getDetailedExportData.bind(baselineAnalyticService),
    ),
)

// -------------------------------- SEL Curriculum Trackers --------------------------------------
router.post(
    '/sel-curriculum-tracker-list',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(selServices.fetchSELList.bind(selServices)),
)

router.get(
    '/sel-curriculum-tracker/:id',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(selServices.fetchSELCurriculumTrackerDetails.bind(selServices)),
)

// -------------------------------- Send Checklist --------------------------------------
router.post(
    '/checklist-records',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(sendChecklistService.fetchSendChecklistRecords.bind(sendChecklistService)),
)

router.post(
    '/all-schools-send-checklist-analytics',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        sendChecklistService.getAllSchoolsSendChecklistAnalytics.bind(sendChecklistService),
    ),
)

router.post(
    '/single-school-send-checklist-analytics',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        sendChecklistService.getOneSchoolsSendChecklistAnalytics.bind(sendChecklistService),
    ),
)

// -------------------------------- IEP Education planner (AI Integration) --------------------------------------

// 🟢 BULLETPROOF IMPORT FIX
// Route 1: PDF Upload ke saath AI Evaluation (ADVANCED)
// 🟢 Route 1: PDF Upload ke saath AI Evaluation (DIRECT TO GEMINI)
router.post(
    '/iep-ai-evaluate/:studentId',
    authMyPeeguUser,
    upload.single('diagnosticReport'),
    asyncMiddleware(async (req, res) => {
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Diagnostic report PDF is required.' });
        }

        const { studentId } = req.params;
        let query = { user_id: studentId };
        if (mongoose.Types.ObjectId.isValid(studentId)) {
            query = { $or: [{ _id: studentId }, { user_id: studentId }] };
        }

        const student = await Student.findOne(query).lean();
        if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });
        const pureObjectId = student._id;

        // ❌ Yahan se pdf-parse ka code poori tarah hata diya gaya hai!

        const [latestBaseline, checklistRecords, observationRecords] = await Promise.all([
            BaselineRecord.findOne({ $or: [{ studentId: pureObjectId }, { user_id: student.user_id }] }).sort({ createdAt: -1 }).lean(),
            StudentCheckList.find({ studentId: pureObjectId }).lean(),
            Observation.find({ studentId: pureObjectId }).lean()
        ]);

        const studentData = { 
            baseline: latestBaseline, 
            checklist: checklistRecords, 
            observations: observationRecords,
            studentProfile: student 
        };

        // 🟢 THE FIX: Gemini ko text ke bajaye direct PDF ka 'buffer' aur 'mimetype' bhej rahe hain
        const pdfBuffer = req.file.buffer;
        const mimeType = req.file.mimetype; // ye 'application/pdf' hoga

        const aiResult = await aiEvaluatorService.generateIEPAIContent(studentData, pdfBuffer, mimeType);

        if (!aiResult) {
             return res.status(500).json({ success: false, message: 'AI failed to process the evaluation. Please try again.' });
        }

        // --- UPSERT RECORD ---
        const updatedIEP = await IEPRecord.findOneAndUpdate(
            { studentId: pureObjectId },
            { 
                $set: { 
                    evaluationDetails: aiResult.evaluationData,
                    plopAnalysis: aiResult.plopAnalysis,        
                    supportNeeds: aiResult.supportNeeds,        
                    aiEvaluationSummary: aiResult.aiEvaluationSummary,
                    aiGeneratedGoals: aiResult.aiGeneratedGoals 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedIEP });
    })
);

// Route 2: Generate IEP AI (Bina PDF) (UPDATED)
router.post(
    '/generate-iep-ai',
    authMyPeeguUser,
    asyncMiddleware(async (req, res) => {
        const { studentId } = req.body;
        let query = { user_id: studentId };
        if (mongoose.Types.ObjectId.isValid(studentId)) {
            query = { $or: [{ _id: studentId }, { user_id: studentId }] };
        }

        const student = await Student.findOne(query).lean();
        if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

        const pureObjectId = student._id;
        const latestBaseline = await BaselineRecord.findOne({ $or: [{ studentId: pureObjectId }, { user_id: student.user_id }] }).sort({ createdAt: -1 }).lean();
        const checklistRecords = await StudentCheckList.find({ studentId: pureObjectId }).lean();
        const observationRecords = await Observation.find({ studentId: pureObjectId }).lean();

        const studentData = { baseline: latestBaseline, checklist: checklistRecords, observations: observationRecords };

        const aiResult = await aiEvaluatorService.generateIEPAIContent(studentData, null);

        // 🟢 FIXED: Saare fields yahan bhi update honge
        const updatedIEP = await IEPRecord.findOneAndUpdate(
            { studentId: pureObjectId },
            { 
                $set: { 
                    evaluationDetails: aiResult.evaluationData,
                    plopAnalysis: aiResult.plopAnalysis,
                    supportNeeds: aiResult.supportNeeds,
                    aiEvaluationSummary: aiResult.aiEvaluationSummary,
                    aiGeneratedGoals: aiResult.aiGeneratedGoals 
                } 
            },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: updatedIEP });
    })
)

router.post(
    '/iep-student-360',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(async (req, res) => {
        const { studentId, academicYear } = req.body;
        const data = await iep360Service.getStudent360Profile(studentId, academicYear);
        res.status(200).json({ success: true, data: data });
    })
)

router.post(
    '/iep-records',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(iepService.fetchIEPRecords.bind(iepService)),
)

router.post(
    '/iep-record',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(iepService.fetchIEPRecord.bind(iepService)),
)

router.post(
    '/get-pre-signed-url',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(iepService.getPresignedUrlForIep.bind(iepService)),
)

router.post(
    '/baseline-performance',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(iepService.fetchBaselinePerformance.bind(iepService)),
)

router.post(
    '/verify-checklist-data',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(iepService.verifyChecklistData.bind(iepService)),
)

// -------------------------------- Students Cope --------------------------------------
router.post(
    '/student-cope-records',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(studentCopeService.fetchStudentCopeList.bind(studentCopeService)),
)

router.get(
    '/student-cope-record/:id',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(studentCopeService.fetchStudentCope.bind(studentCopeService)),
)

router.post(
    '/student-cope-analytics-schools',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        studentCopeService.fetchStudentCopeAnalyticsForSchools.bind(studentCopeService),
    ),
)

router.post(
    '/student-cope-analytics-classrooms',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        studentCopeService.fetchStudentCopeAnalyticsForClassrooms.bind(studentCopeService),
    ),
)

// -------------------------------- Students WellBeing --------------------------------------
router.post(
    '/student-wb-records',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        studentWellBeingService.fetchStudentWellBeingRecords.bind(studentWellBeingService),
    ),
)

router.get(
    '/student-wb-record/:id',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(studentWellBeingService.fetchStudentWB.bind(studentWellBeingService)),
)

router.post(
    '/student-wb-analytics-schools',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        studentWellBeingService.fetchStudentWellBeingAnalyticsForSchools.bind(
            studentWellBeingService,
        ),
    ),
)

router.post(
    '/student-wb-analytics-classrooms',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        studentWellBeingService.fetchStudentWellBeingAnalyticsForClassrooms.bind(
            studentWellBeingService,
        ),
    ),
)

// -------------------------------- Teacher Profilings --------------------------------------
router.post(
    '/profilings-for-schools',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        schoolProfilingService.fetchAllProfilingsForSchools.bind(schoolProfilingService),
    ),
)

router.post(
    '/fetch-teacher-profiling',
    authMyPeeguUser,
    canViewedByTeacherOrHigherUser,
    asyncMiddleware(
        teacherProfilingService.fetchSingleTeacherProfiling.bind(schoolProfilingService),
    ),
)

router.post(
    '/profilings-for-teachers',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        teacherProfilingService.fetchAllProfilingsForTeacher.bind(teacherProfilingService),
    ),
)

router.post(
    '/fetch-profiling-analytics',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(
        teacherProfilingService.fetchProfilingAnalytics.bind(teacherProfilingService),
    ),
)

// -------------------------------- Teacher IRI --------------------------------------
router.post(
    '/iri-for-schools',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(schoolIRIService.fetchAllIRIsForSchools.bind(schoolIRIService)),
)

router.post(
    '/iris-for-teachers',
    authMyPeeguUser,
    viewStudents,
    asyncMiddleware(teacherIRIService.fetchAllIRIsForTeacher.bind(teacherIRIService)),
)

router.post(
    '/fetch-teacher-iri',
    authMyPeeguUser,
    canViewedByTeacherOrHigherUser,
    asyncMiddleware(teacherIRIService.fetchSingleTeacherIRI.bind(teacherIRIService)),
)
// POST route to save/update the final approved IEP data
router.post('/save-iep-data/:studentId', authMyPeeguUser, asyncMiddleware(async (req, res) => {
    const { studentId: rawIdentifier } = req.params;
    const { plopAnalysis, aiGeneratedGoals, evaluationData, supportNeeds, academicYear } = req.body; 

    // 🟢 1. Pehle asli Student fetch karein taaki humein asli ObjectId mil sake
    // Hum dono possibilities check karenge: _id (asli) ya user_id (abc-143 wala)
    const student = await Student.findOne({ 
        $or: [
            { user_id: rawIdentifier }, 
            { _id: mongoose.Types.ObjectId.isValid(rawIdentifier) ? rawIdentifier : null }
        ] 
    }).select('_id').lean();

    if (!student) {
        return res.status(404).json({ success: false, message: "Student record not found in database." });
    }

    const pureObjectId = student._id; // Mil gayi asli 24 characters wali ID!

    // 🟢 2. Ab asli ObjectId ke sath save/update operation karein
    const updatedIEP = await IEPRecord.findOneAndUpdate(
        { studentId: pureObjectId, academicYear }, // 👈 Query me asli ID use ki
        { 
            $set: { 
                studentId: pureObjectId, // 👈 Update me bhi asli ID set karein (upsert ke liye zaroori hai)
                plopAnalysis, 
                aiGeneratedGoals, 
                evaluationDetails: evaluationData, 
                supportNeeds,
                lastUpdated: new Date() 
            } 
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: updatedIEP });
}));

module.exports = router
