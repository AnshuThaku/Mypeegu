const express = require('express')
const router = express.Router()
const { authMyPeeguUser } = require('../../middleware/auth')
const asyncMiddleware = require('../../middleware/async')
const {
  editStudents,
  deleteStudents,
  viewStudents,
  canPromoteStudents,
} = require('../../middleware/validate.counselorManagement')
const { studentService } = require('../../services/students/students-service')

// 👇 NAYA PUBLIC ROUTE (For Student Self Assessment) 👇
router.get(
  '/verify/:regNo', 
  studentService.verifyStudentByRegNo.bind(studentService)
)

router.post(
  '/createmultiplestudents',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(studentService.uploadStudents.bind(studentService)),
)

router.put(
  '/updatestudent',
  authMyPeeguUser,
  editStudents,
  asyncMiddleware(studentService.updateStudent.bind(studentService)),
)

router.post(
  '/deletestudent',
  authMyPeeguUser,
  deleteStudents,
  asyncMiddleware(studentService.deleteStudent.bind(studentService)),
)

router.post(
    '/bulkDeleteStudents',
    authMyPeeguUser,
    deleteStudents,
    asyncMiddleware(studentService.deleteStudentsBulk.bind(studentService)),
)

router.post(
  '/promoteStudentsToNextClass',
  authMyPeeguUser,
  canPromoteStudents,
  asyncMiddleware(studentService.promoteStudents.bind(studentService)),
)

router.post(
  '/shiftSectionsOfStudents',
  authMyPeeguUser,
  viewStudents,
  asyncMiddleware(studentService.shiftSectionsOfStudents.bind(studentService)),
)

router.post(
  '/markStudentAsGraduated',
  authMyPeeguUser,
  viewStudents,
  asyncMiddleware(studentService.markStudentsAsGraduated.bind(studentService)),
)

router.post(
  '/markStudentAsExited',
  authMyPeeguUser,
  viewStudents,
  asyncMiddleware(studentService.markStudentsAsExited.bind(studentService)),
)

module.exports = router