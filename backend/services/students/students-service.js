const { Classrooms } = require('../../models/database/myPeegu-classroom')
const { Schools } = require('../../models/database/myPeegu-school')
const { Students, StudentsHistory } = require('../../models/database/myPeegu-student')
const { SuccessResponse, FailureResponse } = require('../../models/response/globalResponse')
const {
  validateS3File,
  sanitizeAndValidatePhoneNumber,
} = require('../../routes/myPeeguAdmin-portel/myPeeguFunctions')
const utils = require('../../utility/utils')
const mongooseErrorHandler = require('../../utility/mongooseErrorHandler')
const {
  deleteImageFromS3,
  listOfFiles,
  generatePreSignedUrl,
} = require('../../routes/AWSS3Manager')
const { COPEAssessment } = require('../../models/database/myPeegu-studentCOPEAssessment')
const { BaselineRecord } = require('../../models/database/myPeegu-baseline')
const { IndividualRecord } = require('../../models/database/myPeegu-individual')
const { ObservationRecord } = require('../../models/database/myPeegu-observation')
const { WellBeingAssessment } = require('../../models/database/myPeegu-StudentWellBeing')
const { StudentCheckList } = require('../../models/database/myPeegu-sendCheckList')
const { EducationPlanner } = require('../../models/database/myPeegu-studentPlanner')
const { ALL_FIELDS, STATUSES } = require('../../utility/localConstants')
const { ACTIONS } = require('../../utility/localConstants')
const { validateInputs } = require('../../reusableFunctions/validationFunction')
const { AcademicYears } = require('../../models/database/academic-years')
const { SchoolAcademicYears } = require('../../models/database/school-academic-years')
const { default: mongoose } = require('mongoose')
const { StudentHelperService } = require('./student-helper-service')
const { studentStatus } = require('../../utility/constants')
const { cacheService } = require('../../cache/cashe.service')

class StudentService extends StudentHelperService {
  async uploadStudents(req, res) {
    const { error, message, school, SAY, academicYear } =
      await this.validateUserSchoolAndAY(req)
    if (error) {
      return res.status(400).json(new FailureResponse(message))
    }

    if (academicYear._id.toString() !== school.lastPromotionAcademicYear.toString()) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.promoteToCurAY))
    }

    const allClassrooms = await Classrooms.find(
      {
        SAY: SAY._id,
        status: globalConstants.schoolStatus.Active,
      },
      {
        school: 1,
        className: 1,
        section: 1,
        __v: -1,
        SAY: 1,
        academicYear: 1,
      },
    ).lean()

    const studentsData = req.body?.students || []
    let recordsToInsert = []
    const studentsMissingFields = []
    const user_ids = studentsData.map((stData) => stData['Student ID'])
    const studentsExist = await Students.find(
      { user_id: { $in: user_ids } },
      { user_id: 1 },
    ).exec()
    const schoolExists = await Schools.find({
      _id: school,
      status: 'Active',
    }).exec()

    let mappedData,
      uniqueStudents = []

    for (let i = 0; i < studentsData.length; i++) {
      const student = studentsData[i]
      const missing = globalConstants.missingFields.filter((field) => !student[field])
      if (missing.length > 0) {
        studentsMissingFields.push(
          `Row number ${i + 2} has invalid ${missing.join(', ')} field`,
        )
      }
    }

    for (let i = 0; i < studentsData.length; i++) {
      const student = studentsData[i]
      mappedData = this.mapStudentDataToSchema(student)
      const errors = []

      if (!uniqueStudents.includes(student['Student ID'])) {
        uniqueStudents.push(student['Student ID'])
      } else {
        errors.push(`Row number ${i + 2} has duplicate Student ID field`)
      }

      if (mappedData.email && !utils.isValidEmailFormat(mappedData.email)) {
        errors.push(`Row number ${i + 2} has invalid Email format`)
      }
      if (!mappedData.gender) {
        errors.push(`Row number ${i + 2} has invalid Gender Value`)
      } else {
        if (mappedData.gender) {
          let gender = mappedData.gender.toLowerCase()
          if (gender === 'm' || gender === 'male') {
            mappedData.gender = 'Male'
          } else if (gender === 'f' || gender === 'female') {
            mappedData.gender = 'Female'
          } else {
            errors.push(`Row number ${i + 2} has invalid Gender Value`)
          }
        }
      }
      if (mappedData.dob && !utils.isValidDate(mappedData.dob)) {
        errors.push(`Row number ${i + 2} has invalid DOB`)
      }
      if (
        mappedData.phoneNo !== undefined &&
        mappedData.phoneNo &&
        !sanitizeAndValidatePhoneNumber(mappedData.phoneNo)
      ) {
        errors.push(`Row number ${i + 2} has invalid Phone_no`)
      }

      if (
        mappedData.bloodGrp &&
        !globalConstants.validBloodGroups.includes(mappedData.bloodGrp)
      ) {
        errors.push(`Row number ${i + 2} has invalid Blood Group value`)
      }
      if (student['Student ID'].length > 25) {
        errors.push(globalConstants.messages.studentIdCantExc25Char)
      }

      const studentExists = studentsExist.find(
        (stData) => stData.user_id === mappedData.user_id,
      )
      if (studentExists) {
        errors.push(globalConstants.messages.recordExists)
      }

      if (
        mappedData.school &&
        req.user.assignedSchools.map((id) => id.toString()).includes(mappedData.school)
      ) {
        const isSchoolExist = schoolExists.find(
          (scData) => scData._id.toString() === mappedData.school,
        )
        if (!isSchoolExist) {
          errors.push(globalConstants.messages.invalidSchool)
        }
      }

      if (mappedData?.gender === 'M' || mappedData?.gender?.toLowerCase() === 'male') {
        mappedData.gender = 'Male'
      } else if (
        mappedData?.gender === 'F' ||
        mappedData?.gender?.toLowerCase() === 'female'
      ) {
        mappedData.gender = 'Female'
      }

      let studentsJourney
      const recordExists = allClassrooms.find(
        (classData) =>
          classData.className === mappedData.className &&
          classData.section === mappedData.section,
      )
      if (!recordExists) {
        errors.push(
          `Uploaded ClassRoom or Section ${mappedData.className} ${mappedData.section} does not exist at Row number ${i + 2}`,
        )
      } else {
        mappedData.classRoomId = recordExists?._id
        studentsJourney = [
          {
            classRoomId: recordExists?._id,
            SAY: recordExists?.SAY,
            academicYear: recordExists?.academicYear,
            dateTime: new Date(),
          },
        ]
      }

      mappedData.school = school._id
      mappedData.studentsJourney = studentsJourney
      mappedData.graduated = false
      mappedData.exited = false

      if (errors.length > 0) {
        studentsMissingFields.push(...errors)
      } else {
        recordsToInsert.push(mappedData)
      }
    }

    if (studentsMissingFields.length > 0) {
      return res.status(400).json({
        message: globalConstants.messages.invalidFileCheckError,
        validationErrors: studentsMissingFields,
        fileContainsError: true,
      })
    }

    const insertedStudents = await Students.insertMany(recordsToInsert)

    const studentDataForUpdateCount = insertedStudents.map((obj) => ({
      _id: obj._id,
      studentsJourney: [],
      fromClassroom: {},
      toClassroom: {
        _id: obj.classRoomId,
        SAY: SAY._id,
      },
    }))

    const insertedStudentsDocs = insertedStudents.map((doc) => doc.toObject())
    const allStudents = await cacheService.students
    allStudents.push(...insertedStudentsDocs)
    await cacheService.setStudents(allStudents)

    this.modifyStudentsCountInClassAndSAY(studentDataForUpdateCount, ACTIONS.ADD)

    return res.json(
      new SuccessResponse(globalConstants.messages.studentsCreated, insertedStudents),
    )
  }

  async updateStudent(req, res) {
    const student = req.body || {}
    const errorResponses = []
    const errors = {}

    if (
      (student.regNo && !utils.isAValidString(student.regNo)) ||
      !student.id ||
      !student.classRoomId
    ) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.missingParameters))
    }

    if (
      student.school &&
      !req.user.assignedSchools.map((id) => id.toString()).includes(student.school)
    ) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.invalidSchool))
    }

    const studentRecord = await Students.findOne({
      _id: student.id,
      school: { $in: req.user.assignedSchools },
    })

    if (!studentRecord) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.notFound))
    }

    if (!student.classRoomId) {
      errors.className = globalConstants.messages.invalidClassroom
    }

    if (student?.classRoomId[0]?.toString() !== studentRecord.classRoomId?.toString()) {
      const curAY = await this.getCurrentAcademicYear()
      const school = await Schools.findOne({
        _id: studentRecord.school,
        status: STATUSES.ACTIVE,
      })

      if (
        curAY &&
        school &&
        curAY._id.toString() !== school.lastPromotionAcademicYear._id.toString()
      ) {
        return res
          .status(400)
          .json(
            new FailureResponse(
              globalConstants.messages.notAllowedToUpdateClassOrSection,
            ),
          )
      }

      const classIntendedToChangeTo = await Classrooms.findOne({
        _id: student.classRoomId[0],
      })

      if (classIntendedToChangeTo !== undefined && classIntendedToChangeTo !== null) {
        const currentClass = await Classrooms.findOne({
          _id: studentRecord.classRoomId,
        })

        const currentClassHierarchy = currentClass.classHierarchy
        const isPromotion = classIntendedToChangeTo.classHierarchy > currentClassHierarchy
        const isDemotion = classIntendedToChangeTo.classHierarchy < currentClassHierarchy

        if (isDemotion) {
          studentRecord.lastDemotionDate = new Date()
        } else if (isPromotion) {
          studentRecord.lastPromotionDate = new Date()
        }

        studentRecord.classRoomId = classIntendedToChangeTo?._id
        studentRecord.studentsJourney?.push({
          classRoomId: classIntendedToChangeTo?._id,
          SAY: classIntendedToChangeTo?.SAY,
          academicYear: classIntendedToChangeTo?.academicYear,
          dateTime: new Date(),
        })

        const studentDataForUpdateCount = [
          {
            _id: studentRecord._id,
            studentsJourney: studentRecord.studentsJourney,
            fromClassroom: {
              _id: currentClass._id,
              SAY: currentClass.SAY,
            },
            toClassroom: {
              _id: classIntendedToChangeTo._id,
              SAY: classIntendedToChangeTo.SAY,
            },
          },
        ]

        this.modifyStudentsCountInClassAndSAY(studentDataForUpdateCount, ACTIONS.UPDATE)
      } else {
        errors.className = globalConstants.messages.invalidClassroom
      }
    }

    if (student.dob && !utils.isValidDate(student.dob)) {
      errors.dob = globalConstants.messages.invalidDate
    }

    if (student.phone && !sanitizeAndValidatePhoneNumber(student.phone)) {
      errors.phone = globalConstants.messages.invalidNumber
    }

    if (Object.keys(errors).length > 0) {
      errorResponses.push({ id: student.id, errors })
    }

    if (errorResponses.length > 0) {
      return res.status(400).json(new FailureResponse(errorResponses))
    }

    let profilePicture = null
    if (
      utils.isAValidString(student.profilePicture) &&
      studentRecord.profilePicture !== student.profilePicture
    ) {
      profilePicture = utils.fetchUrlSafeString(student.profilePicture)
    }

    if (req.query.saveStudent === globalConstants.booleanString.true) {
      if (profilePicture) {
        let files = await listOfFiles(globalConstants.studentProfilePic)
        files = files?.Contents?.map((item) => item.Key) ?? []

        if (studentRecord.profilePicture) {
          deleteImageFromS3(
            globalConstants.studentProfilePic,
            studentRecord.profilePicture,
          )
        }

        if (
          validateS3File(files, `${globalConstants.studentProfilePic}${profilePicture}`)
        ) {
          studentRecord.profilePicUrl = `${miscellaneous.resourceBaseurl}${globalConstants.studentProfilePic}${profilePicture}`
          studentRecord.profilePicture = profilePicture
        } else {
          return res
            .status(400)
            .json(new FailureResponse(globalConstants.messages.invalidImage))
        }
      }
    } else if (
      !req.query.saveStudent ||
      req.query.saveStudent === globalConstants.booleanString.false
    ) {
      if (profilePicture) {
        const s3link = await generatePreSignedUrl(
          globalConstants.studentProfilePic,
          profilePicture,
          globalConstants.PngImageType,
        )
        return res.json({ s3link })
      } else {
        res.status(200)
        return res.end()
      }
    }

    // Update fields
    studentRecord.school = student.school ?? studentRecord.school
    studentRecord.studentName = student.studentName ?? studentRecord.studentName
    studentRecord.regNo = student.regNo ?? studentRecord.regNo
    studentRecord.regDate = student.regDate ?? studentRecord.regDate
    studentRecord.nationality = student.nationality ?? studentRecord.nationality
    studentRecord.dob = student.dob ?? studentRecord.dob
    studentRecord.gender = student?.gender === 'F' ? 'Female' : ('Male' ?? studentRecord.gender)
    studentRecord.bloodGrp = student.bloodGrp ?? studentRecord.bloodGrp
    studentRecord.fatherName = student.fatherName ?? studentRecord.fatherName
    studentRecord.motherName = student.motherName ?? studentRecord.motherName
    studentRecord.phone = student.phone ?? studentRecord.phone

    // Save and respond
    studentRecord
      .save()
      .then(async (savedDoc) => {
        const studentObj = savedDoc.toObject()
        let allStudents = await cacheService.students
        allStudents = allStudents.filter(
          (obj) => obj._id.toString() !== studentObj._id.toString(),
        )
        allStudents.push(studentObj)
        await cacheService.setStudents(allStudents)
        await utils.delay(2000)
        return res.json(new SuccessResponse(globalConstants.messages.studentUpdated))
      })
      .catch((error) => {
        const failureResponse = mongooseErrorHandler.handleError(error)
        return res.status(400).json(failureResponse)
      })
  }

  async deleteStudent(req, res) {
    const { id } = req.body || {}

    if (!utils.isMongooseObjectId(id)) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.notFound))
    }

    const studentRecord = await Students.findOne({
      _id: id,
      school: { $in: req.user.assignedSchools },
    }).lean()
    

    if (!studentRecord) {
      return res.status(404).json(new FailureResponse(globalConstants.messages.notFound))
    }

    const studentDataForUpdateCount = [
      {
        _id: studentRecord._id,
        studentsJourney: studentRecord.studentsJourney,
        fromClassroom: {
          _id: studentRecord.classRoomId,
          SAY: studentRecord.studentsJourney?.at(-1)?.SAY,
        },
        toClassroom: null,
      },
    ]

    this.modifyStudentsCountInClassAndSAY(studentDataForUpdateCount, ACTIONS.DELETE)

    const backup = { ...studentRecord }
    delete backup._id
    delete backup.__v
    delete backup.createdAt
    delete backup.updatedAt

    await Students.findOneAndDelete({ _id: id })
    await StudentsHistory.create([backup])

    let allStudents = await cacheService.students
    allStudents = allStudents.filter((obj) => obj._id.toString() !== id.toString())
    await cacheService.setStudents(allStudents)

    await utils.delay(2000)

    await Promise.all([
      BaselineRecord.deleteMany({ studentId: id }),
      IndividualRecord.deleteMany({ studentId: id }),
      ObservationRecord.deleteMany({ studentId: id }),
      COPEAssessment.deleteMany({ studentId: id }),
      WellBeingAssessment.deleteMany({ studentId: id }),
      StudentCheckList.deleteMany({ studentId: id }),
      EducationPlanner.deleteMany({ studentId: id }),
    ])

    res.json(new SuccessResponse(globalConstants.messages.recordDeleted))
  }

  async deleteStudentsBulk(req, res) {
    const { studentIds } = req.body
    const isValidObjectId = mongoose.Types.ObjectId.isValid

    if (!Array.isArray(studentIds) || !studentIds.every(isValidObjectId)) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.invalidStudentIdsProvided))
    }

    const students = await Students.find({ _id: { $in: studentIds } })

    if (!students.length) {
      return res
        .status(404)
        .json(new FailureResponse(globalConstants.messages.NoStudFoundWithProvidedIds))
    }

    const studentDataForUpdateCount = students.map((obj) => ({
      _id: obj._id,
      studentsJourney: obj.studentsJourney,
      fromClassroom: {
        _id: obj.classRoomId,
        SAY: obj.studentsJourney?.at(-1)?.SAY,
      },
      toClassroom: null,
    }))

    this.modifyStudentsCountInClassAndSAY(studentDataForUpdateCount, ACTIONS.DELETE)

    await Students.deleteMany({ _id: { $in: studentIds } })

    await Promise.all([
      BaselineRecord.deleteMany({ studentId: { $in: studentIds } }),
      IndividualRecord.deleteMany({ studentId: { $in: studentIds } }),
      ObservationRecord.deleteMany({ studentId: { $in: studentIds } }),
      COPEAssessment.deleteMany({ studentId: { $in: studentIds } }),
      WellBeingAssessment.deleteMany({ studentId: { $in: studentIds } }),
      StudentCheckList.deleteMany({ studentId: { $in: studentIds } }),
      EducationPlanner.deleteMany({ studentId: { $in: studentIds } }),
    ])

    let allStudents = await cacheService.students
    allStudents = allStudents.filter((obj) => !studentIds.includes(obj._id.toString()))
    await cacheService.setStudents(allStudents)

    res.json(new SuccessResponse(`${students.length} students deleted successfully`))
  }

async promoteStudents(req, res) {
    const { schoolId } = req.body
    const school = await Schools.findOne({
      _id: schoolId,
      status: globalConstants.studentStatus.Active,
    })

    if (!school) {
      return res.status(400).json(new FailureResponse(globalConstants.messages.schoolNotFound))
    }

    const today = new Date();

    const curSAY = await this.fetchCurSAYbySchool(schoolId)
    if (!curSAY) {
      return res.status(400).json(
          new FailureResponse(
            globalConstants.messages.fieldNotFound.replaceField(ALL_FIELDS.SCHOOL_ACADEMIC_YEAR),
          ),
        )
    }

    const academicYears = await AcademicYears.find({})
    const lastPromotionAcademicYear = academicYears.find(
      (obj) => obj._id.toString() === school.lastPromotionAcademicYear.toString(),
    )

    const promotingAY = academicYears.find(
      (obj) => obj.order === lastPromotionAcademicYear.order + 1,
    )

    if (!promotingAY) {
       return res.status(400).json(new FailureResponse("Please create the next Academic Year in the system before promoting."));
    }

    // 🚀 SMART AUTO-CREATE SCHOOL ACADEMIC YEAR (SAY) 🚀
    let promotingSAY = await SchoolAcademicYears.findOne({
      academicYear: promotingAY._id,
      school: schoolId,
    });

    if (!promotingSAY) {
      let nextStartDate = new Date();
      let nextEndDate = new Date();
      
      if (curSAY.startDate && curSAY.endDate) {
        nextStartDate = new Date(curSAY.startDate);
        nextStartDate.setFullYear(nextStartDate.getFullYear() + 1);
        
        nextEndDate = new Date(curSAY.endDate);
        nextEndDate.setFullYear(nextEndDate.getFullYear() + 1);
      }

      promotingSAY = await SchoolAcademicYears.create({
        school: schoolId,
        academicYear: promotingAY._id,
        startDate: nextStartDate,
        endDate: nextEndDate
      });
      console.log(`Auto-created new School Academic Year for school: ${schoolId}`);
    }
    // 🚀===============================================🚀

    // ✅ UI UPDATE LOGIC ✅
    const updatedSchoolLastpromoted = async () => {
      await Schools.updateOne(
        { _id: school._id.toString() },
        {
          $set: {
            lastPromotionDate: today,
            lastPromotionAcademicYear: promotingAY._id,
            currentAcademicYear: promotingAY._id,     
            lastActiveAcademicYear: promotingAY._id,  
            academicYear: promotingAY._id             
          },
        },
      )
    }

    const lastPromoteAYclasses = await Classrooms.find({
      school: school._id.toString(),
      academicYear: school.lastPromotionAcademicYear,
    })
      .sort({ classHierarchy: 1 })
      .lean()

    if (lastPromoteAYclasses.length <= 0) {
      await updatedSchoolLastpromoted()
      return res.json(
        new SuccessResponse(globalConstants.messages.promoted.replaceField(`${ALL_FIELDS.STUDENT}s`)),
      )
    }

    let promotingAYClasses = await Classrooms.find({
      school: school._id.toString(),
      academicYear: promotingAY._id,
    })
      .sort({ classHierarchy: 1 })
      .lean()

    // 🚀 SMART AUTO-CLONE CLASSROOMS LOGIC 🚀
    if (promotingAYClasses.length === 0 && lastPromoteAYclasses.length > 0) {
      console.log("Naye saal ki classes nahi mili. Auto-cloning classes...");
      const newClassesToInsert = lastPromoteAYclasses.map((oldClass) => {
        const newClass = { ...oldClass };
        
        delete newClass._id;
        delete newClass.__v;
        delete newClass.createdAt;
        delete newClass.updatedAt;
        
        newClass.academicYear = promotingAY._id;
        newClass.SAY = promotingSAY._id;
        newClass.totalStudents = 0; 
        newClass.activeStudentsCount = 0; 
        
        return newClass;
      });

      await Classrooms.insertMany(newClassesToInsert);
      
      promotingAYClasses = await Classrooms.find({
        school: school._id.toString(),
        academicYear: promotingAY._id,
      })
        .sort({ classHierarchy: 1 })
        .lean()
    }
    // 🚀===================================================🚀

    const allStudents = await Students.find({
      school: school._id.toString(),
      status: globalConstants.studentStatus.Active,
      graduated: false,
      exited: false,
    }).lean()

    if (allStudents.length <= 0) {
      await updatedSchoolLastpromoted()
      return res.json(
        new SuccessResponse(globalConstants.messages.promoted.replaceField(`${ALL_FIELDS.STUDENT}s`)),
      )
    }

    const bulkOperations = []
    const studentDataForUpdateCount = []
    const graduatedBulkOperations = []
    const graduatedStudentsIds = []

    for (let i = 0; i < lastPromoteAYclasses.length; i++) {
      const currentClass = lastPromoteAYclasses[i]
      
      const nextClassWithSameSection = promotingAYClasses.find(
        (obj) =>
          obj.classHierarchy === currentClass.classHierarchy + 1 &&
          obj.sectionHierarchy === currentClass.sectionHierarchy,
      )

      const nextClassWithDifferentSection = promotingAYClasses
        .filter((obj) => obj.classHierarchy === currentClass.classHierarchy + 1)
        .sort(
          (a, b) =>
            Math.abs(a.sectionHierarchy - currentClass.sectionHierarchy) -
            Math.abs(b.sectionHierarchy - currentClass.sectionHierarchy),
        )[0]

      let nextClass = nextClassWithSameSection
      if (!nextClass) {
        nextClass = nextClassWithDifferentSection
      }

      if (nextClass) {
        const studentsToPromoteIds = []
        for (const student of allStudents) {
          if (student.classRoomId._id.toString() === currentClass._id.toString()) {
            studentsToPromoteIds.push(student._id)
            studentDataForUpdateCount.push({
              _id: student._id,
              studentsJourney: [],
              fromClassroom: {},
              toClassroom: { _id: nextClass._id, SAY: promotingSAY._id },
            })
          }
        }

        const journeyData = {
          classRoomId: nextClass._id,
          SAY: promotingSAY._id,
          academicYear: promotingSAY.academicYear,
          dateTime: today,
        }

        bulkOperations.push({
          updateMany: {
            filter: { _id: { $in: studentsToPromoteIds } },
            update: {
              $set: {
                classRoomId: nextClass._id,
                lastPromotionDate: today,
                lastPromotionAcademicYear: promotingSAY.academicYear,
              },
              $push: { studentsJourney: journeyData },
            },
          },
        })
      } else {
        graduatedBulkOperations.push({
          updateMany: {
            filter: {
              school: school._id.toString(),
              classRoomId: currentClass._id,
              graduated: false,
              exited: false,
            },
            update: {
              $set: {
                graduated: true,
                graduatedAcademicYear: lastPromotionAcademicYear._id,
              },
            },
          },
        })

        for (const student of allStudents) {
          if (
            student.school.toString() === school._id.toString() &&
            student.classRoomId.toString() === currentClass._id.toString() &&
            !student.graduated &&
            !student.exited
          ) {
            graduatedStudentsIds.push(student._id)
          }
        }
      }
    }

    if (graduatedBulkOperations.length > 0) {
      await Students.bulkWrite(graduatedBulkOperations)
      this.updateGraduateExitInStudentData(
        graduatedStudentsIds,
        ACTIONS.GRADUATE,
        lastPromotionAcademicYear._id,
      )

      if (bulkOperations.length === 0) {
        await updatedSchoolLastpromoted()
        return res.json(
          new SuccessResponse(
            globalConstants.messages.promoted.replaceField(`${ALL_FIELDS.STUDENT}s`),
            graduatedStudentsIds,
          ),
        )
      }
    }

    if (bulkOperations.length > 0) {
      await Students.bulkWrite(bulkOperations)
    }

    if (studentDataForUpdateCount.length > 0) {
      this.modifyStudentsCountInClassAndSAY(studentDataForUpdateCount, ACTIONS.ADD)
    }

    await updatedSchoolLastpromoted()
    return res.json(
      new SuccessResponse(
        globalConstants.messages.promoted.replaceField(`${ALL_FIELDS.STUDENT}s`),
      ),
    )
  }

  async shiftSectionsOfStudents(req, res) {
    const { school, selectedClass, toSection, studentIds, classroomIds, academicYear } =
      req.body

    if (!school || !selectedClass || !toSection || !Array.isArray(studentIds)) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.missingOrInvalidParameter))
    }

    const errors = await validateInputs(school, selectedClass, studentIds, academicYear)
    if (errors.length > 0) {
      return res.status(400).json(new FailureResponse(errors[0]))
    }

    const toClassroom = await Classrooms.findOne({
      school,
      academicYear: academicYear,
      className: selectedClass,
      section: toSection,
      status: STATUSES.ACTIVE,
    })

    if (!toClassroom) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.toSectionNotFound))
    }

    const students = await Students.find({
      _id: { $in: studentIds },
      graduated: false,
      exited: false,
    }).populate('classRoomId')

    const studentDataForUpdateCount = students.map((obj) => ({
      _id: obj._id,
      studentsJourney: obj.studentsJourney,
      fromClassroom: {
        _id: obj.classRoomId._id,
        SAY: obj.classRoomId.SAY,
      },
      toClassroom: {
        _id: toClassroom._id,
        SAY: toClassroom.SAY,
      },
    }))

    const result = await Students.updateMany(
      { _id: { $in: studentIds }, graduated: false, exited: false },
      {
        $set: { classRoomId: toClassroom._id },
        $push: {
          studentsJourney: {
            classRoomId: toClassroom._id,
            academicYear: academicYear,
            SAY: toClassroom.SAY,
            dateTime: new Date(),
          },
        },
      },
    )

    if (result?.modifiedCount === 0) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.selectedStudentsNotFound))
    }

    this.modifyStudentsCountInClassAndSAY(studentDataForUpdateCount, ACTIONS.UPDATE)

    return res.json(new SuccessResponse(globalConstants.messages.studentsSectionUpdated))
  }

  async markStudentsAsGraduated(req, res) {
    const { school, selectedClass, studentIds, academicYear } = req.body

    if (!school || !Array.isArray(studentIds) || studentIds.length === 0 || !academicYear) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.missingOrInvalidParameter))
    }

    if (selectedClass) {
      const errors = await validateInputs(school, selectedClass, studentIds, academicYear)
      if (errors.length > 0) {
        return res.status(400).json(new FailureResponse(errors[0]))
      }
    } else {
      const isValidObjectId = mongoose.Types.ObjectId.isValid
      if (!studentIds.every((id) => isValidObjectId(id))) {
        return res
          .status(400)
          .json(new FailureResponse(globalConstants.messages.missingOrInvalidParameter))
      }
    }

    const result = await Students.updateMany(
      { _id: { $in: studentIds }, school, graduated: false, exited: false },
      { $set: { graduated: true, graduatedAcademicYear: academicYear } },
    )

    if (result?.modifiedCount === 0) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.selectedStudentsNotFound))
    }

    // Here this method will update all students data in all section as graduated = true
    this.updateGraduateExitInStudentData(studentIds, ACTIONS.GRADUATE, academicYear)

    return res.json(
      new SuccessResponse(globalConstants.messages.selectedStudentMarkedAsGraduated),
    )
  }

  async markStudentsAsExited(req, res) {
    const { school, selectedClass, studentIds, academicYear } = req.body

    if (!school || !Array.isArray(studentIds) || studentIds.length === 0 || !academicYear) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.missingOrInvalidParameter))
    }

    if (selectedClass) {
      const errors = await validateInputs(school, selectedClass, studentIds, academicYear)
      if (errors.length > 0) {
        return res.status(400).json(new FailureResponse(errors[0]))
      }
    } else {
      const isValidObjectId = mongoose.Types.ObjectId.isValid
      if (!studentIds.every((id) => isValidObjectId(id))) {
        return res
          .status(400)
          .json(new FailureResponse(globalConstants.messages.missingOrInvalidParameter))
      }
    }

    const result = await Students.updateMany(
      { _id: { $in: studentIds }, school, graduated: false, exited: false },
      { $set: { exited: true, exitedAcademicYear: academicYear } },
    )

    // Here this method will update all students data in all section as graduated = true

    if (result?.modifiedCount === 0) {
      return res
        .status(400)
        .json(new FailureResponse(globalConstants.messages.selectedStudentsNotFound))
    }
    this.updateGraduateExitInStudentData(studentIds, ACTIONS.EXIT, academicYear)
    return res.json(new SuccessResponse(globalConstants.messages.selectedStudentMarkedAsExited))
  }


  async fetchAllStudents(req, res) {
    console.log('fetch students list started')
    console.log('Validate and get AYs and pagination data started')
    const { error, page, PAGE_SIZE, downloadAndFilter, skip, emptyData, academicYears } =
      await this.validateAndGetAYsAndPaginationData(req)

    if (error) {
      // Early exit if validation fails or no academic years match
      console.log('got error while validating and get AYs and pagination data', error)
      return res.status(200).json(emptyData)
    }
    console.log('Validate and get AYs and pagination data completed')
    const filterBody = req.body.filter

    console.log('getFilteredStudentsSingleJourney() started')
    const filterAndMappedStudents = await this.getFilteredStudentsSingleJourney({
      schoolIds: filterBody?.schoolIds,
      classroomIds: filterBody?.classroomIds,
      theStudentStatus: filterBody?.studentStatus,
      academicYears: academicYears,
      userAssignedSchools: req.user.assignedSchools,
      isAdmin: req.user.isAdmin,
      searchText: req.body.searchText,
    })
    console.log('getFilteredStudentsSingleJourney() competed')
    console.log('filterAndMappedStudents count: ', filterAndMappedStudents.length)

    // ---------- Sorting ----------
    let sortedStudents = [...filterAndMappedStudents]
    const sortFields = globalConstants.studentsSortFields
    if (req.body.sortKeys) {
      const sortOptions = utils.buildSortOptions(req.body, sortFields)
      sortedStudents.sort((a, b) => {
        for (const key in sortOptions) {
          const dir = sortOptions[key]
          const aVal = a[key]
          const bVal = b[key]
          if (aVal !== bVal) {
            return dir === 1 ? (aVal > bVal ? 1 : -1) : aVal < bVal ? 1 : -1
          }
        }
        return 0
      })
    }

    // ---------- Pagination + Response ----------
    const totalCount = sortedStudents.length
    const paginated = sortedStudents.slice(skip, skip + PAGE_SIZE)

    // Optional download formatting
    if (downloadAndFilter) {
      const formatted = paginated.map((s) => utils.formatStudentData(s, true))
      return res.json(formatted)
    }

    console.log('fetch students list completed')

    return res.json({
      data: paginated,
      page,
      pageSize: PAGE_SIZE,
      totalCount,
    })
  }

 async verifyStudentByRegNo(req, res) {
    try {
      const { regNo } = req.params;
      const { pin } = req.query; // 🟢 FRONTEND SE AANE WALA PIN

      // 1. Check if PIN is provided
      if (!pin) {
        return res.status(400).json({ success: false, message: "Lab PIN is required to access the test." });
      }

      const student = await Students.findOne({ 
        regNo: regNo, 
        status: 'Active', 
        graduated: false, 
        exited: false 
      })
      .populate('school') 
      .populate('classRoomId', 'className section');

      if (!student) {
        return res.status(404).json({ success: false, message: "Student not found with this Registration Number." });
      }

      // 🟢 2. LAB PIN VALIDATION (The Core Security Check)
      // Agar kisi wajah se school me pin nahi hai, to fallback '654321' use karega
      const dbSchoolPin = student.school?.labPin || '654321'; 
      
      if (pin !== dbSchoolPin) {
        return res.status(403).json({ 
          success: false, 
          message: "Access Denied: Incorrect Lab PIN." 
        });
      }

      // 3. SMART LOGIC: Current Baseline Month ke hisaab se nikalo
      const month = new Date().getMonth() + 1;
      let currentBaseline = 'Baseline 3';
      if (month >= 4 && month <= 8) currentBaseline = 'Baseline 1';
      else if (month >= 9 && month <= 12) currentBaseline = 'Baseline 2';

      // 4. EARLY CHECK: Kya isne pehle hi submit kar diya hai?
      const curAcademicYear = await this.getCurrentAcademicYear();
      let hasCompleted = false;

      if (curAcademicYear) {
        const existingRecord = await BaselineRecord.findOne({
          studentId: student._id,
          academicYear: curAcademicYear._id,
          baselineCategory: currentBaseline,
          isSelfAssessment: true
        });
        
        if (existingRecord) hasCompleted = true;
      }

      const studentData = {
        _id: student._id,
        schoolId: student.school ? student.school._id : null,
        name: student.studentName || "N/A",
        class: student.classRoomId ? student.classRoomId.className : "N/A",
        section: student.classRoomId ? student.classRoomId.section : "N/A",
        schoolName: student.school ? student.school.school : "N/A", 
        regNo: student.regNo,
        hasCompletedCurrentBaseline: hasCompleted, 
        currentBaseline: currentBaseline 
      };

      return res.status(200).json({ success: true, message: "Verified", data: studentData });

    } catch (error) {
      console.error("Verification Error:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
}

module.exports.studentService = new StudentService()