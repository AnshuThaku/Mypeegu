const mongoose = require('mongoose');
const fs = require('fs');

const MONGO_URI = "mongodb://localhost:27017/mypeegu";

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

  console.log("🔍 Generating FINAL AUDIT REPORT v5...");

  const students = await db.collection("students").find({}).toArray();

  let rows = "";
  let totalIssues = 0;
  let totalActiveStudents = 0;
for (let student of students) {

    // ✅ SCHOOL HANDLING (ObjectId + string)
    let schoolName = "-";

    if (mongoose.Types.ObjectId.isValid(student.school)) {
      const school = await db.collection("schools").findOne({
        _id: new mongoose.Types.ObjectId(student.school),
        status: "Active"
      });

      if (!school) continue;

      schoolName =
        school.school ||
        school.name ||
        school.schoolName ||
        "Unknown School";
    } else {
      schoolName = student.school || "Unknown School";
    }

    totalActiveStudents++;

    let journey = student.studentsJourney || [];
    if (journey.length < 2) continue;

    journey.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    const maxClass = await getMaxClass(db, student.school);

    let prev = null;
    let issue = false;
    let issueType = "";

    let before = "";
    let after = "";
    let finalJourney = "";

    // 🔥 GROUP BY YEAR
    const grouped = {};

    for (let j of journey) {
      const key = j.academicYear?.toString() || "unknown";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(j);
      }

    // 🔥 NORMALIZATION MAP
    const normalizedMap = {};

    for (let year in grouped) {
      const records = grouped[year];

      const uniqueClasses = new Set(
        records.map(r => r.classRoomId.toString())
      );

      if (uniqueClasses.size > 1) {
        records.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        const latest = records[0];

        for (let r of records) {
          normalizedMap[r._id || r.dateTime] = latest.classRoomId;
        }
      } else {
        for (let r of records) {
          normalizedMap[r._id || r.dateTime] = r.classRoomId;
        }
      }
    }

    let graduated = false;

    for (let i = 0; i < journey.length; i++) {
      const j = journey[i];

      const classData = await getClass(db, j.classRoomId);
      if (!classData) continue;

      const correctedId = normalizedMap[j._id || j.dateTime];
      const correctedClass = await getClass(db, correctedId);

      const currDate = new Date(j.dateTime);
      const date = currDate.toISOString().split("T")[0];

      const className = `Class ${classData.className} ${classData.section}`;
      const correctedName = `Class ${correctedClass?.className} ${correctedClass?.section}`;

      let isWrong = false;
      if (prev) {
        const prevClass = await getClass(db, prev.classRoomId);

        const sameYear =
          j.academicYear?.toString() === prev.academicYear?.toString();

        const classDrop =
          classData.classHierarchy < prevClass.classHierarchy;

        const classIncrease =
          classData.classHierarchy > prevClass.classHierarchy;

        if (sameYear && classDrop) {
          issue = true;
          isWrong = true;
          issueType = "Class Downgrade";
        }
        else if (!sameYear && classDrop) {
          issue = true;
          isWrong = true;
          issueType = "Cross-Year Downgrade";
        }
        else if (!sameYear && !classIncrease) {
          issue = true;
          isWrong = true;
          issueType = "Promotion Missing";
        }
      }

      // 🎓 Graduation
      if (classData.classHierarchy === maxClass?.classHierarchy) {
        graduated = true;
      }

      // CURRENT
      if (isWrong) {
        before += `<span class="red">🔴 ${date} → ${className}</span><br>`;
      } else {
        before += `➡️ ${date} → ${className}<br>`;
      }
// CORRECTED
      if (j.classRoomId.toString() !== correctedId.toString()) {
        after += `<span class="green">➡️ ${date} → ${correctedName} (Normalized)</span><br>`;
      } else {
        after += `➡️ ${date} → ${correctedName}<br>`;
      }

      // FINAL DB STATE
      finalJourney += `➡️ ${date} → ${correctedName}<br>`;

      prev = {
        ...j,
        classRoomId: correctedId
      };
    }

    if (!issue) continue;

    totalIssues++;

    rows += `
    <tr>
      <td>${totalIssues}</td>
      <td>${student.user_id}</td>
      <td>${student.studentName}</td>
      <td>${schoolName}</td>
      <td>Class ${maxClass?.className}</td>
      <td>${journey.length}</td>
      <td>${before}</td>
      <td>${after}</td>
      <td>${finalJourney}</td>
      <td class="red">${issueType}</td>
      <td>${graduated ? "🎓 Yes" : "No"}</td>
    </tr>
    `;
  }

  const impact = ((totalIssues / totalActiveStudents) * 100).toFixed(2);
const html = `
  <html>
  <head>
    <style>
      body { font-family: Arial; padding: 20px; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ccc; padding: 10px; }
      th { background: #f4f4f4; }
      .red { color: red; font-weight: bold; }
      .green { color: green; font-weight: bold; }
    </style>
  </head>
  <body>

    <h1>📊 Student Data Audit Report (Final v5)</h1>

    <p><b>Total Active Students:</b> ${totalActiveStudents}</p>
    <p><b>Affected Students:</b> ${totalIssues}</p>
    <p><b>Impact:</b> ${impact}%</p>
    <p><b>Generated At:</b> ${new Date().toLocaleString()}</p>

    <table>
      <tr>
        <th>#</th>
        <th>Student ID</th>
        <th>Name</th>
        <th>School</th>
        <th>Max Class</th>
        <th>Steps</th>
        <th>Current Journey</th>
        <th>Corrected Journey</th>
        <th>Final DB State</th>
        <th>Issue</th>
        <th>Graduated</th>
      </tr>
      ${rows}
    </table>

  </body>
  </html>
  `;

  fs.writeFileSync("FINAL_AUDIT_REPORT_v5.html", html);

  console.log("✅ FINAL_AUDIT_REPORT_v5.html generated");
  process.exit();
  }

run().catch(console.error);