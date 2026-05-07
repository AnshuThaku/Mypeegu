const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { BaselineRecord } = require('../../models/database/myPeegu-baseline'); 

router.get('/school', async (req, res) => {
  try {
    const { schoolId, academicYearId, baselineCategory, classRoomId } = req.query;

    // 🟢 BASE MATCH: Sirf Active aur SelfAssessment true hona chahiye
    const matchStage = {
      isSelfAssessment: true,
      status: 'Active'
    };

    // 🟢 PROGRESSIVE FILTERS (Agar 'all' nahi hai, tabhi filter apply karo)
   if (schoolId && schoolId !== 'all' && schoolId !== 'undefined') {
      matchStage.school = new mongoose.Types.ObjectId(schoolId);
    }
    if (academicYearId && academicYearId !== 'all' && academicYearId !== 'undefined') {
      matchStage.academicYear = new mongoose.Types.ObjectId(academicYearId);
    }
    if (baselineCategory && baselineCategory !== 'all' && baselineCategory !== 'undefined') {
      matchStage.baselineCategory = baselineCategory;
    }
    if (classRoomId && classRoomId !== 'all' && classRoomId !== 'undefined') {
      matchStage.classRoomId = new mongoose.Types.ObjectId(classRoomId);
    }

    const analyticsData = await BaselineRecord.aggregate([
      { $match: matchStage },
      // Student Lookup
      {
        $lookup: {
          from: 'students', 
          localField: 'studentId', 
          foreignField: '_id',
          as: 'studentDetail'
        }
      },
      { $unwind: { path: '$studentDetail', preserveNullAndEmptyArrays: true } },
      // Classroom Lookup
      {
        $lookup: {
          from: 'classrooms', 
          localField: 'classRoomId',
          foreignField: '_id',
          as: 'classInfo'
        }
      },
      { $unwind: { path: '$classInfo', preserveNullAndEmptyArrays: true } },

      {
        $facet: {
          kpis: [
            {
              $group: {
                _id: null,
                totalAssessed: { $sum: 1 },
                t1Count: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 1/i } }, 1, 0] } },
                t2Count: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 2/i } }, 1, 0] } },
                t3Count: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 3/i } }, 1, 0] } },
                totalOverallPercentage: { $sum: "$overallPercentage" }
              }
            }
          ],
          gradeBandDistribution: [
            {
              $group: {
                _id: { $ifNull: ["$classInfo.className", "$gradeBand"] },
                totalStudents: { $sum: 1 },
                t1: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 1/i } }, 1, 0] } },
                t2: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 2/i } }, 1, 0] } },
                t3: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 3/i } }, 1, 0] } }
              }
            },
            { $sort: { _id: 1 } }
          ],
          genderDistribution: [
            {
              $group: {
                _id: { $ifNull: ["$studentDetail.gender", "Other"] },
                total: { $sum: 1 },
                t1: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 1/i } }, 1, 0] } },
                t2: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 2/i } }, 1, 0] } },
                t3: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 3/i } }, 1, 0] } }
              }
            }
          ],
          sectionDistribution: [
            {
              $group: {
                _id: { $ifNull: ["$classInfo.section", "General"] },
                total: { $sum: 1 },
                t1: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 1/i } }, 1, 0] } },
                t2: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 2/i } }, 1, 0] } },
                t3: { $sum: { $cond: [{ $regexMatch: { input: "$tierPlacement", regex: /Tier 3/i } }, 1, 0] } }
              }
            },
            { $sort: { _id: 1 } }
          ],
          domainAnalysisRaw: [
            { $unwind: "$responses" },
            {
              $group: {
                _id: {
                  domain: "$responses.domain",
                  gender: { $ifNull: ["$studentDetail.gender", "Other"] },
                  section: { $ifNull: ["$classInfo.section", "General"] }
                },
                avgScore: { $avg: "$responses.finalScore" },
                categories: { $push: { label: "$responses.categoryLabel", score: "$responses.finalScore" } }
              }
            }
          ],
          studentsList: [
            {
              $project: {
                _id: 1,
                studentName: { $ifNull: ["$studentDetail.studentName", "Unknown"] },
                tierPlacement: 1,
                overallPercentage: 1,
                responses: 1
              }
            }
          ]
        }
      }
    ]);

    const result = analyticsData[0] || {};
    const kpiData = (result.kpis && result.kpis[0]) || { totalAssessed: 0, t1Count: 0, t2Count: 0, t3Count: 0, totalOverallPercentage: 0 };
    const total = kpiData.totalAssessed || 1;

    const processedDomainAnalysis = { riskPredictors: [], protectiveFactors: [], chartData: [], heatmap: [] };
    const domainMap = {};

    (result.domainAnalysisRaw || []).forEach(d => {
      const domainName = d._id.domain;
      if (!domainMap[domainName]) domainMap[domainName] = { scores: [], sections: {}, categories: [], genders: {} };
      domainMap[domainName].scores.push(d.avgScore);
      
      if (!domainMap[domainName].sections[d._id.section]) domainMap[domainName].sections[d._id.section] = { sum: 0, count: 0 };
      domainMap[domainName].sections[d._id.section].sum += d.avgScore;
      domainMap[domainName].sections[d._id.section].count += 1;
      
      if (!domainMap[domainName].genders[d._id.gender]) domainMap[domainName].genders[d._id.gender] = { sum: 0, count: 0 };
      domainMap[domainName].genders[d._id.gender].sum += d.avgScore;
      domainMap[domainName].genders[d._id.gender].count += 1;
    });

    Object.keys(domainMap).forEach(domain => {
      const avg = domainMap[domain].scores.reduce((a, b) => a + b, 0) / domainMap[domain].scores.length;
      const genderResults = Object.keys(domainMap[domain].genders).map(g => ({
        gender: g, score: Number((domainMap[domain].genders[g].sum / domainMap[domain].genders[g].count).toFixed(1))
      }));
      processedDomainAnalysis.chartData.push({ label: domain, risk: Number((5 - avg).toFixed(1)), protective: Number(avg.toFixed(1)), genders: genderResults });
      
      const sectionResults = Object.keys(domainMap[domain].sections).map(s => ({
        name: s, score: Number((domainMap[domain].sections[s].sum / domainMap[domain].sections[s].count).toFixed(1))
      }));
      processedDomainAnalysis.heatmap.push({ domain, sections: sectionResults, avg: Number(avg.toFixed(1)) });
    });

    const processedStudents = (result.studentsList || []).map(stu => {
      const dMap = {};
      let tRisk = 0, tProt = 0;

      (stu.responses || []).forEach(r => {
        if (!dMap[r.domain]) dMap[r.domain] = { risk: 0, protective: 0, count: 0 };
        dMap[r.domain].protective += r.finalScore;
        dMap[r.domain].risk += (5 - r.finalScore); 
        dMap[r.domain].count += 1;
        tProt += r.finalScore;
        tRisk += (5 - r.finalScore);
      });

      const domains = Object.keys(dMap).map(d => {
        // Safe division to avoid NaN if count is 0
        const avgRisk = dMap[d].count > 0 ? Number((dMap[d].risk / dMap[d].count).toFixed(1)) : 0;
        const avgProt = dMap[d].count > 0 ? Number((dMap[d].protective / dMap[d].count).toFixed(1)) : 0;
        const adjusted = Number((avgRisk - (avgProt * 0.3)).toFixed(1)); 

        let band = 'On track', bandColor = { bg: '#D5F5E3', text: '#1E8449' }, trend = '▲', trendColor = '#1E8449';
        if (avgRisk > 3.0) { band = 'Concern'; bandColor = { bg: '#FADBD8', text: '#C0392B' }; trend = '▼'; trendColor = '#C0392B'; }
        else if (avgRisk > 2.0) { band = 'Monitor'; bandColor = { bg: '#FDEBD0', text: '#E67E22' }; trend = '—'; trendColor = '#E67E22'; }
        else { band = 'Strength'; }

        return { name: d, risk: avgRisk, protective: avgProt, adjusted, band, bandColor, trend, trendColor };
      });

      const flags = [];
      const aiActions = [];
      const strengthClusters = [];

      domains.filter(d => d.risk > 3.0).forEach(d => {
        flags.push({ label: `${d.name} risk`, color: { bg: '#FADBD8', text: '#C0392B' } });
        aiActions.push(`Explore triggers related to ${d.name.toLowerCase()} in a 1:1 session.`);
      });

      domains.filter(d => d.protective > 3.0).forEach(d => {
        flags.push({ label: `${d.name} strong`, color: { bg: '#D5F5E3', text: '#1E8449' } });
        strengthClusters.push({ label: d.name, desc: `Leverage ${d.name.toLowerCase()} strength.` });
      });

      if (flags.length === 0) flags.push({ label: 'Stable profile', color: { bg: '#D5F5E3', text: '#1E8449' } });
      if (aiActions.length === 0) aiActions.push('Maintain regular check-ins to ensure continued stability.');

      let tierColor = { bg: '#D5F5E3', text: '#1E8449' };
      if (stu.tierPlacement && stu.tierPlacement.includes('2')) tierColor = { bg: '#FDEBD0', text: '#E67E22' };
      if (stu.tierPlacement && stu.tierPlacement.includes('3')) tierColor = { bg: '#FADBD8', text: '#C0392B' };

      // 🟢 SAFETY NET: Bulletproof initials logic so server never crashes on weird names
      const safeName = stu.studentName && typeof stu.studentName === 'string' ? stu.studentName.trim() : "Unknown";
      const initials = safeName.split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase() || "U";

      return {
        id: stu._id,
        name: safeName,
        initials: initials,
        tier: stu.tierPlacement || 'Tier 1',
        tierLabel: `${stu.tierPlacement || 'Tier 1'} — Analysis`,
        tierColor,
        kpi: {
          risk: Number((tRisk / (stu.responses?.length || 1)).toFixed(1)),
          protective: Number((tProt / (stu.responses?.length || 1)).toFixed(1)),
          adjusted: Number(((tRisk - (tProt * 0.3)) / (stu.responses?.length || 1)).toFixed(1)),
          trend: 'Stable'
        },
        domains, flags, aiActions, strengthClusters,
        comparisons: [
          { type: 'risk', title: 'Parent input pending', desc1: `Self-reported risk: ${Number((tRisk / (stu.responses?.length || 1)).toFixed(1))}`, desc2: 'Awaiting cross-informant data', color: { bg: '#FDEDEC', text: '#C0392B' } }
        ]
      };
    });

    res.status(200).json({
      success: true,
      data: {
        healthScore: Math.round(kpiData.totalOverallPercentage / total) || 0,
        kpi: {
          total: kpiData.totalAssessed,
          t1: kpiData.t1Count, t1Pct: Math.round((kpiData.t1Count / total) * 100) || 0,
          t2: kpiData.t2Count, t2Pct: Math.round((kpiData.t2Count / total) * 100) || 0,
          t3: kpiData.t3Count, t3Pct: Math.round((kpiData.t3Count / total) * 100) || 0,
        },
        gradeBands: (result.gradeBandDistribution || []).map(gb => ({
          band: gb._id, count: gb.totalStudents,
          t1Pct: Math.round((gb.t1 / gb.totalStudents) * 100),
          t2Pct: Math.round((gb.t2 / gb.totalStudents) * 100),
          t3Pct: Math.round((gb.t3 / gb.totalStudents) * 100),
        })),
        completionData: (result.gradeBandDistribution || []).map((gb, i) => ({
          label: gb._id,
          value: Math.min(100, Math.round((gb.totalStudents / (gb.totalStudents + 2)) * 100)),
          color: ["#1E8449", "#2874A6", "#D35400", "#8E44AD", "#C0392B"][i % 5]
        })),
        genderDistribution: result.genderDistribution || [],
        sectionDistribution: result.sectionDistribution || [],
        domainAnalysis: processedDomainAnalysis,
        studentsList: processedStudents 
      }
    });

  } catch (error) { 
    console.error("Aggregation Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' }); 
  }
});

module.exports = router;