const express = require('express')
const router = express.Router()

const counselor = require('./counselor')
const classroomsRoute = require('./classrooms.route')
const teacherRoute = require('./teacher.route')
const studentRoute = require('./students.route')
const studentsDataActionsRoute = require('./students-data-actions.route')
const selfAssessmentRoute = require('./self-assessment.route');
const gandtRoute = require('./gandt.route')

router.use(counselor)
router.use(classroomsRoute)
router.use(teacherRoute)
router.use(studentRoute)
router.use(studentsDataActionsRoute)
router.use('/self-assessment', selfAssessmentRoute);
router.use(gandtRoute)

module.exports = router
