// selfAssessmentFunctions.js

/**
 * 🟢 1. GET GRADE BAND
 * Maps the student's class to the appropriate question bank category.
 */
export const getGradeBand = (classString) => {
  if (!classString) return 'NOT_ELIGIBLE';
  const str = classString.toString().toUpperCase();
  let gradeNum = 0;
  
  const match = str.match(/\d+/);
  if (match) {
    gradeNum = parseInt(match[0], 10);
  } else {
    if (str.includes('XII')) gradeNum = 12; 
    else if (str.includes('XI')) gradeNum = 11;
    else if (str.includes('X')) gradeNum = 10; 
    else if (str.includes('IX')) gradeNum = 9;
    else if (str.includes('VIII')) gradeNum = 8; 
    else if (str.includes('VII')) gradeNum = 7;
    else if (str.includes('VI')) gradeNum = 6;
    else return 'NOT_ELIGIBLE'; 
  }

  if (gradeNum >= 10 && gradeNum <= 12) return 'G10-12';
  if (gradeNum >= 8 && gradeNum <= 9) return 'G8-9';
  if (gradeNum >= 6 && gradeNum <= 7) return 'G6-8';
  return 'NOT_ELIGIBLE'; 
};

/**
 * 🟢 2. GET CURRENT BASELINE CATEGORY
 * Auto-detects whether we are in Term 1, 2, or 3 based on the current month.
 */
export const getCurrentBaselineCategory = () => {
  const month = new Date().getMonth() + 1; // 1-12
  
  // April (4) to August (8) -> Baseline 1
  if (month >= 4 && month <= 8) return 'Baseline 1';
  
  // September (9) to December (12) -> Baseline 2
  if (month >= 9 && month <= 12) return 'Baseline 2';
  
  // January (1) to March (3) -> Baseline 3
  return 'Baseline 3';
};

/**
 * 🟢 3. CALCULATE FINAL SCORES & TIER
 * Processes raw student answers into domain percentages and final Tier placement.
 * * @param {Object} answers - e.g., { 0: "Often", 1: "Never" }
 * @param {Object} examData - The specific QUESTION_BANK object for the grade band
 * @returns {Object} { domainResults, overallPercentage, tier, maxScore }
 */
export const calculateFinalScores = (answers, examData) => {
  const domainStats = {};
  const maxScore = examData.options.length - 1; 

  Object.keys(answers).forEach(qIndex => {
    const questionDef = examData.questions[qIndex];
    const selectedOption = answers[qIndex];
    const rawScore = examData.options.indexOf(selectedOption); 

    let isReversed = false;
    let finalScore = rawScore;

    // Handle reverse scoring (e.g., if "Never" is actually the highest score for a positive question)
    if (questionDef.reverseScored) {
      finalScore = (maxScore + 1) - rawScore; 
      isReversed = true;
    }

    const domain = questionDef.domain;
    if (!domainStats[domain]) {
      domainStats[domain] = { total: 0, count: 0, details: [] };
    }
    
    domainStats[domain].total += finalScore;
    domainStats[domain].count += 1;
    
    domainStats[domain].details.push({
      qNo: parseInt(qIndex) + 1,
      response: selectedOption,
      raw: rawScore,
      reversed: isReversed,
      final: finalScore
    });
  });

  let totalPercentageSum = 0;
  const domainResults = [];

  Object.keys(domainStats).forEach(domain => {
    const stats = domainStats[domain];
    const average = stats.total / stats.count;
    const percentage = (average / maxScore) * 100;

    domainResults.push({
      domain, 
      details: stats.details, 
      sum: stats.total, 
      count: stats.count,
      average: average.toFixed(2), 
      percentage: Math.round(percentage), 
      maxScore: maxScore
    });
    totalPercentageSum += percentage;
  });

  // Calculate Overall Average and determine Tier
  const overallPercentage = Math.round(totalPercentageSum / domainResults.length) || 0;

  let tier = "Tier 1 (Typical)";
  if (overallPercentage >= 51) tier = "Tier 3 (High Support)";
  else if (overallPercentage >= 26) tier = "Tier 2 (Emerging)";

  return { 
    domainResults, 
    overallPercentage, 
    tier, 
    maxScore 
  };
};