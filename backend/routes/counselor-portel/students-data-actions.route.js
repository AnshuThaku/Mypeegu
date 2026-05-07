const express = require('express')
const router = express.Router()
const { authMyPeeguUser } = require('../../middleware/auth')
const asyncMiddleware = require('../../middleware/async')
const {
  editStudents,
  deleteStudents,
  canEditByTeacherOrHigherUser,
  viewStudents,
} = require('../../middleware/validate.counselorManagement')
const { observationServices } = require('../../services/observation/observation.service')
const { individualService } = require('../../services/individual/individual.service')
const { baselineService } = require('../../services/baseline/baseline-service')
const { selServices } = require('../../services/sel/sel-service')
const { sendChecklistService } = require('../../services/send-checklist/send-checklist-service')
const { iepService } = require('../../services/IEP/IEP-service')
const { Schools } = require('../../models/database/myPeegu-school')
const { FailureResponse, SuccessResponse } = require('../../models/response/globalResponse')
const utils = require('../../utility/utils')
const { IndividualRecord } = require('../../models/database/myPeegu-individual')
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
const { teacherIRIService } = require('../../services/assessments/teacher-iri/iriForTeachers.service')


// --------------- Observation starts ----------------
router.post(
  '/create-observation',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(observationServices.createObservationRecord.bind(observationServices)),
)

router.put(
  '/update-observation',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(observationServices.updateObservationRecord.bind(observationServices)),
)

router.post(
  '/delete-observation-record',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(observationServices.deleteObservationRecord.bind(observationServices)),
)

router.post(
  '/delete-multiple-observation-records',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(observationServices.deleteMultipleObservations.bind(observationServices)),
)

// --------------- Individual Case starts ----------------
router.post(
  '/create-individualcase',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(individualService.createIndividualCase.bind(individualService)),
)

router.put(
  '/update-individualcase',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(individualService.updateIndividualCase.bind(individualService)),
)

router.put(
  '/delete-individualcase-record',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(individualService.deleteIndividualCaseRecord.bind(individualService)),
)

router.post(
  '/delete-multiple-individualcase-records',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(individualService.deleteMultipleIndividualCases.bind(individualService)),
)

// --------------- Baseline starts ----------------

// 🟢 NEW: Submit Self-Assessment Baseline Route
router.post(
  '/submit-baseline',
  asyncMiddleware(baselineService.submitBaseline.bind(baselineService)),
)

router.post(
  '/create-baseline',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(baselineService.createBaselineRecord.bind(baselineService)),
)

router.post(
  '/create-multiple-baseline-records',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(baselineService.uploadBaselineRecords.bind(baselineService)),
)

router.put(
  '/update-baseline',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(baselineService.updateBaselineRecord.bind(baselineService)),
)

router.post(
  '/delete-baseline-record',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(baselineService.deleteBaselineRecord.bind(baselineService)),
)

router.post(
  '/delete-multiple-baseline-records',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(baselineService.deleteMultipleBaselineRecords.bind(baselineService)),
)

// --------------- SEL curriculum tracker starts ----------------
router.post(
  '/create-sel-curriculum-tracker',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(selServices.createSEL.bind(selServices)),
)

router.put(
  '/update-sel-curriculum-tracker',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(selServices.updateSEL.bind(selServices)),
)

router.put(
  '/delete-sel-curriculum-tracker',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(selServices.deleteSELRecord.bind(selServices)),
)

router.post(
  '/get-sel-module-presigned-urls',
  authMyPeeguUser,
  viewStudents,
  asyncMiddleware(selServices.generateAndSendPresignedUrls.bind(selServices)),
)

router.post(
  '/add-update-sel-module',
  authMyPeeguUser,
  viewStudents,
  asyncMiddleware(selServices.addUpdateSelModule.bind(selServices)),
)

router.post(
  '/verify-sel-module',
  authMyPeeguUser,
  viewStudents,
  asyncMiddleware(selServices.verifySelModule.bind(selServices)),
)

// --------------- Send Checklist Starts ----------------
router.post(
  '/create-send-checklist',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(sendChecklistService.addSendChecklist.bind(sendChecklistService)),
)

router.post(
  '/create-multiple-send-checklists',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(sendChecklistService.uploadSendCheckList.bind(sendChecklistService)),
)

router.put(
  '/update-send-checklist',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(sendChecklistService.updateSendChecklist.bind(sendChecklistService)),
)

router.post(
  '/delete-send-checklist-record',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(sendChecklistService.deleteSendChecklistRecord.bind(sendChecklistService)),
)

router.post(
  '/delete-multiple-send-checklist-records',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(
    sendChecklistService.deleteMultipleSendChecklistRecords.bind(sendChecklistService),
  ),
)

// --------------- IEP Starts ----------------
router.post(
  '/create-iep',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(iepService.addIEPRecord.bind(iepService)),
)
router.put(
  '/update-iep',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(iepService.updateIEPRecord.bind(iepService)),
)
router.post(
  '/delete-iep',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(iepService.deleteIEPRecord.bind(iepService)),
)

// --------------- Students Cope ----------------
router.post(
  '/update-student-cope',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(studentCopeService.updateStudentCope.bind(studentCopeService)),
)

router.post(
  '/delete-student-cope',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(studentCopeService.deleteStudentCope.bind(studentCopeService)),
)

router.post(
  '/create-multiple-student-cope-records',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(studentCopeService.uploadStudentCopeRecords.bind(studentCopeService)),
)

// --------------- Students Well Being ----------------
router.post(
  '/update-student-wb',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(
    studentWellBeingService.updateStudentWellBeingRecord.bind(studentWellBeingService),
  ),
)

router.post(
  '/delete-student-wb',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(
    studentWellBeingService.deleteStudentWellBeingRecord.bind(studentWellBeingService),
  ),
)

router.post(
  '/create-multiple-student-wb-records',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(
    studentWellBeingService.uploadStudentWellBeingrecords.bind(studentWellBeingService),
  ),
)

// --------------- Profilings ----------------
router.post(
  '/add-school-profiling',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(schoolProfilingService.addSchoolProfiling.bind(schoolProfilingService)),
)

router.put(
  '/update-school-profiling/:id',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(schoolProfilingService.updateSchoolProfiling.bind(schoolProfilingService)),
)

router.post(
  '/upload-teacher-profiling',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(teacherProfilingService.uploadTeacherProfiling.bind(teacherProfilingService)),
)

router.post(
  '/submit-teacher-profiling',
  authMyPeeguUser,
  canEditByTeacherOrHigherUser,
  asyncMiddleware(teacherProfilingService.submitTeacherProfiling.bind(teacherProfilingService)),
)

router.delete(
  '/delete-teacher-profiling',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(teacherProfilingService.deleteTeacherProfiling.bind(teacherProfilingService)),
)

// --------------- IRIs ----------------
router.post(
  '/add-school-iri',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(schoolIRIService.addSchoolIRI.bind(schoolIRIService)),
)

router.put(
  '/update-school-iri/:id',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(schoolIRIService.updateSchoolIRI.bind(schoolIRIService)),
)

router.post(
  '/upload-teacher-iris',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(teacherIRIService.uploadTeacherIRI.bind(teacherIRIService)),
)

router.post(
  '/submit-teacher-iri',
  authMyPeeguUser,
  canEditByTeacherOrHigherUser,
  asyncMiddleware(teacherIRIService.submitTeacherIRIData.bind(teacherIRIService)),
)

router.delete(
  '/delete-teacher-iri',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(teacherIRIService.deleteTeacherIRI.bind(teacherIRIService)),
)

module.exports = router

// ------------------ SSE Counselor Toggle ------------------
router.put(
  '/toggle-sse-individualcase',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(async (req, res) => {
    const { schoolId, allow } = req.body || {}
    if (!utils.isMongooseObjectId(schoolId)) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.invalidId))
    }
    const isAssigned = (req.user.assignedSchools || [])
      .map((id) => id.toString())
      .includes(schoolId.toString())
    if (!isAssigned && !req.user.isAdmin) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.notAuthorised))
    }
    const school = await Schools.findById(schoolId)
    if (!school) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.notFound))
    }
    school.allow_sse_counselor_individualcase = Boolean(allow)
    await school.save()
    return res
      .status(200)
      .json(
        new SuccessResponse(
          `SSE Counselor access for Individual Cases ${allow ? 'enabled' : 'disabled'}`,
        ),
      )
  }),
)

// ------------------ SSE visibility per Individual Case record ------------------
router.put(
  '/individualcase/:id/toggle-sse-visibility',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(async (req, res) => {
    const { id } = req.params
    const { allow } = req.body || {}
    if (!utils.isMongooseObjectId(id)) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.invalidId))
    }
    const record = await IndividualRecord.findById(id)
    if (!record) {
      return res.status(404).json(new FailureResponse(globalConstants.messages.notFound))
    }
    // Must be assigned to the record's school or admin
    const isAssigned = (req.user.assignedSchools || [])
      .map((sid) => sid.toString())
      .includes(record.school?.toString())
    if (!isAssigned && !req.user.isAdmin) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.notAuthorised))
    }
    record.visibleToSSE = Boolean(allow)
    await record.save()
    return res
      .status(200)
      .json(
        new SuccessResponse(
          `Record visibility for SSE ${allow ? 'enabled' : 'disabled'}`,
        ),
      )
  }),
)