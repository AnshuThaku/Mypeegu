const mongoose = require('mongoose');

const MONGO_URI = "mongodb://localhost:27017/mypeegu";

// 🔒 SAFETY SWITCH
const DRY_RUN = false;

async function getClass(db, id) {
  return await db.collection("classrooms").findOne({ _id: id });
}

async function getMaxClass(db, schoolId) {
  const max = await db.collection("classrooms")
    .find({ school: schoolId })
    .sort({ classHierarchy: -1 })
    .limit(1)
    .toArray();

  return max[0];
}

async function run() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log("🚀 STARTING FINAL DB FIX (AUDIT BASED v7)");
  console.log("DRY RUN:", DRY_RUN);

  const students = await db.collection("students").find({}).toArray();

  let totalUpdated = 0;

  for (let student of students) {

    // ✅ ACTIVE SCHOOL ONLY
    if (!mongoose.Types.ObjectId.isValid(student.school)) continue;

    const school = await db.collection("schools").findOne({
      _id: new mongoose.Types.ObjectId(student.school),
      status: "Active"
    });

    if (!school) continue;

    let journey = student.studentsJourney || [];
    if (journey.length < 2) continue;

    // sort by date
    journey.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    // 🔥 GROUP BY ACADEMIC YEAR
    const grouped = {};
    for (let j of journey) {
      const key = j.academicYear?.toString() || "unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(j);
    }

    // 🔥 STEP 1: NORMALIZE (same year → latest section)
    let normalizedJourney = [];

    for (let year in grouped) {
      const records = grouped[year];

      records.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

      const latest = records[records.length - 1]; // last = latest

      for (let r of records) {
        normalizedJourney.push({
          ...r,
          classRoomId: latest.classRoomId
        });
      }
    }

    // 🔥 STEP 2: SORT AGAIN
    normalizedJourney.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    // 🔥 STEP 3: APPLY PROMOTION LOGIC
    let correctedJourney = [];
    let prevClass = null;
    let changed = false;

    const maxClass = await getMaxClass(db, student.school);

    for (let j of normalizedJourney) {

      const classData = await getClass(db, j.classRoomId);
      if (!classData) continue;

      let finalClassId = j.classRoomId;

      if (prevClass) {
        const prevClassData = await getClass(db, prevClass);

        // ❌ backward
        if (classData.classHierarchy < prevClassData.classHierarchy) {
          finalClassId = prevClass;
          changed = true;

          console.log("🔧 BACKWARD FIX:", {
            student: student.studentName,
            from: classData.className,
            to: prevClassData.className
          });
        }

        // ❌ same class → promote
        else if (classData.classHierarchy === prevClassData.classHierarchy) {
          const nextClass = await db.collection("classrooms").findOne({
            school: student.school,
            classHierarchy: prevClassData.classHierarchy + 1
          });

          if (nextClass) {
            finalClassId = nextClass._id;
            changed = true;

            console.log("🔧 PROMOTION FIX:", {
              student: student.studentName,
              from: prevClassData.className,
              to: nextClass.className
            });
          }
        }
      }

      // 🎓 GRADUATION CHECK
      if (maxClass && classData.classHierarchy >= maxClass.classHierarchy) {
        j.graduated = true;
      }

      if (finalClassId.toString() !== j.classRoomId.toString()) {
        changed = true;
      }

      correctedJourney.push({
        ...j,
        classRoomId: finalClassId
      });

      prevClass = finalClassId;
    }

    // 🔥 APPLY UPDATE
    if (changed) {
      totalUpdated++;

      console.log("🧑‍🎓 FIXING:", student.studentName);

      if (!DRY_RUN) {
        await db.collection("students").updateOne(
          { _id: student._id },
          { $set: { studentsJourney: correctedJourney } }
        );
      }
    }
  }

  console.log("=================================");
  console.log("✅ TOTAL STUDENTS UPDATED:", totalUpdated);
  console.log("=================================");

  process.exit();
}

run().catch(console.error);