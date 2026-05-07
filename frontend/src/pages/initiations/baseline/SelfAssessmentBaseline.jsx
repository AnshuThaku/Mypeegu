// SelfAssessmentBaseline.jsx

import React, { useState, useEffect, useRef } from 'react'
import {
  Box, Typography, Button, Paper, Divider, TextField, CircularProgress,
  Radio, RadioGroup, FormControlLabel, FormControl, Snackbar, Alert, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Checkbox,
  Grid, Avatar, Chip, Drawer, IconButton, Switch, Slider, Tooltip, Backdrop
} from '@mui/material'
import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded'
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

import { QUESTION_BANK } from './questionBank'

// 🟢 DYNAMIC THEME ENGINE FOR ACCESSIBILITY
const getTheme = (a11y) => {
  const isHC = a11y.highContrast;
  const isCB = a11y.colorBlind;

  return {
    headerBg: isHC ? '#000000' : '#1e68b5',
    answered: isCB ? '#0072B2' : (isHC ? '#00FF00' : '#28a745'), 
    notAnswered: isCB ? '#D55E00' : (isHC ? '#FF0000' : '#dc3545'), 
    review: isCB ? '#F0E442' : (isHC ? '#00FFFF' : '#6f42c1'), 
    notVisited: isHC ? '#333333' : '#e2e8f0',
    textMain: isHC ? '#FFFFFF' : '#212529',
    textMuted: isHC ? '#AAAAAA' : '#6c757d',
    bgMain: isHC ? '#121212' : '#f4f5f7',
    paperBg: isHC ? '#1E1E1E' : '#ffffff',
    border: isHC ? '#444444' : '#dee2e6'
  }
}

const getGradeBand = (classString) => {
  if (!classString) return 'NOT_ELIGIBLE';
  const str = classString.toString().toUpperCase();
  let gradeNum = 0;
  
  const match = str.match(/\d+/);
  if (match) gradeNum = parseInt(match[0], 10);
  else {
    if (str.includes('XII')) gradeNum = 12; else if (str.includes('XI')) gradeNum = 11;
    else if (str.includes('X')) gradeNum = 10; else if (str.includes('IX')) gradeNum = 9;
    else if (str.includes('VIII')) gradeNum = 8; else if (str.includes('VII')) gradeNum = 7;
    else if (str.includes('VI')) gradeNum = 6;
    else return 'NOT_ELIGIBLE'; 
  }

  if (gradeNum >= 10 && gradeNum <= 12) return 'G10-12';
  if (gradeNum >= 8 && gradeNum <= 9) return 'G8-9';
  if (gradeNum >= 6 && gradeNum <= 7) return 'G6-8';
  return 'NOT_ELIGIBLE'; 
}

const getCurrentBaselineCategory = () => {
  const month = new Date().getMonth() + 1; 
  if (month >= 4 && month <= 8) return 'Baseline 1';
  if (month >= 9 && month <= 12) return 'Baseline 2';
  return 'Baseline 3';
}

const enterFullScreen = () => {
  const elem = document.documentElement;
  try {
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen(); 
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen(); 
  } catch (e) { console.warn("Fullscreen request failed", e); }
};

// 🟢 TOUR GUIDE CONFIGURATION (UPDATED WITH A11Y)
const TOUR_STEPS = [
  { title: "Need Reading Help?", text: "Click this Accessibility icon anytime to change text size, enable High Contrast, or use a Dyslexia-friendly font." },
  { title: "The Question Area", text: "Read the questions carefully here. Some questions may have special hints or instructions in italics." },
  { title: "Your Options", text: "Select the option that best describes you. There are no right or wrong answers, just be honest!" },
  { title: "Navigation Controls", text: "Click 'Save & Next' to move forward. Unsure? Use 'Review & Next' to mark it purple and revisit it later." },
  { title: "Question Palette", text: "Track your progress here. Green means answered, Red means skipped. Click any number to jump directly to that question." }
];

const SelfAssessmentBaseline = () => {
  const [step, setStep] = useState(0) 
  const [regNo, setRegNo] = useState('')
  const [labPin, setLabPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' })
  const [dialog, setDialog] = useState({ open: false, type: '', title: '', message: '' })
  
  const [studentDetails, setStudentDetails] = useState(null)
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [examData, setExamData] = useState({ questions: [], options: [] })
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [answers, setAnswers] = useState({}) 
  const [visited, setVisited] = useState(new Set([0])) 
  const [review, setReview] = useState(new Set()) 

  const [a11y, setA11y] = useState({ menuOpen: false, scale: 1, highContrast: false, colorBlind: false, dyslexic: false });
  const THEME = getTheme(a11y);

  // TOUR GUIDE STATE & REFS
  const [tourStep, setTourStep] = useState(0);
  const a11yRef = useRef(null); // Naya Ref
  const qRef = useRef(null);
  const optRef = useRef(null);
  const navRef = useRef(null);
  const palRef = useRef(null);

  // AUTO-SAVE DRAFT
  useEffect(() => {
    if (studentDetails && step === 2) {
      const draft = { answers, visited: Array.from(visited), review: Array.from(review), currentQIndex };
      localStorage.setItem(`baseline_draft_${studentDetails.regNo}`, JSON.stringify(draft));
    }
  }, [answers, visited, review, currentQIndex, studentDetails, step]);


  const handleFetchStudent = async () => {
    if (!regNo.trim() || !labPin.trim()) { 
      setError("Both Registration Number and Lab PIN are required."); 
      return; 
    }
    setError(''); setIsLoading(true);
    try {
     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/counselor/v1/verify/${regNo}?pin=${labPin}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        const student = result.data;

        if (student.hasCompletedCurrentBaseline) {
           setError(`Notice: You have already submitted ${student.currentBaseline} for this academic year.`);
           setIsLoading(false);
           return; 
        }

        const band = getGradeBand(student.class);

        if (band === 'NOT_ELIGIBLE') {
          setError(`Self-assessment is restricted to Grades 6-12. It is currently not available for Class ${student.class}.`);
          setIsLoading(false); return;
        }

        const savedDraft = localStorage.getItem(`baseline_draft_${student.regNo}`);
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            setAnswers(parsed.answers || {});
            setVisited(new Set(parsed.visited || [0]));
            setReview(new Set(parsed.review || []));
            setCurrentQIndex(parsed.currentQIndex || 0);
          } catch (e) {
            setAnswers({}); setVisited(new Set([0])); setReview(new Set()); setCurrentQIndex(0);
          }
        } else {
          setAnswers({}); setVisited(new Set([0])); setReview(new Set()); setCurrentQIndex(0);
        }

        setStudentDetails(student);
        setExamData(QUESTION_BANK[band]);
        setStep(1);
      } else setError(result.message || "Invalid Registration Number.");
    } catch (err) { setError("Server error! Failed to connect."); } 
    finally { setIsLoading(false); }
  }

  const handleOptionSelect = (val) => setAnswers(prev => ({ ...prev, [currentQIndex]: val }))
  const moveToQuestion = (nextIndex) => { setCurrentQIndex(nextIndex); setVisited(prev => new Set(prev).add(nextIndex)); }

  const handleSaveAndNext = () => {
    if (answers[currentQIndex]) { const newReview = new Set(review); newReview.delete(currentQIndex); setReview(newReview); }
    if (currentQIndex < examData.questions.length - 1) moveToQuestion(currentQIndex + 1);
  }

  const handleMarkForReview = () => {
    setReview(prev => new Set(prev).add(currentQIndex));
    if (currentQIndex < examData.questions.length - 1) moveToQuestion(currentQIndex + 1);
  }

  const handleClearResponse = () => {
    const newAnswers = { ...answers }; delete newAnswers[currentQIndex]; setAnswers(newAnswers);
    const newReview = new Set(review); newReview.delete(currentQIndex); setReview(newReview);
  }

  const getQuestionStatus = (index) => {
    if (review.has(index)) return 'review';
    if (answers[index]) return 'answered';
    if (visited.has(index)) return 'not_answered';
    return 'not_visited';
  }

  const calculateFinalScores = () => {
    const domainStats = {};
    const maxScore = examData.options.length - 1; 

    Object.keys(answers).forEach(qIndex => {
      const questionDef = examData.questions[qIndex];
      const selectedOption = answers[qIndex];
      const rawScore = examData.options.indexOf(selectedOption); 

      let isReversed = false;
      let finalScore = rawScore;

      if (questionDef.reverseScored) { finalScore = (maxScore + 1) - rawScore; isReversed = true; }

      const domain = questionDef.domain;
      if (!domainStats[domain]) domainStats[domain] = { total: 0, count: 0, details: [] };
      
      domainStats[domain].total += finalScore;
      domainStats[domain].count += 1;
      
      domainStats[domain].details.push({ qNo: parseInt(qIndex) + 1, response: selectedOption, raw: rawScore, reversed: isReversed, final: finalScore });
    });

    let totalPercentageSum = 0;
    const domainResults = [];

    Object.keys(domainStats).forEach(domain => {
      const stats = domainStats[domain];
      const average = stats.total / stats.count;
      const percentage = (average / maxScore) * 100;
      domainResults.push({ domain, details: stats.details, sum: stats.total, count: stats.count, average: average.toFixed(2), percentage: Math.round(percentage), maxScore: maxScore });
      totalPercentageSum += percentage;
    });

    const overallPercentage = Math.round(totalPercentageSum / domainResults.length);
    let tier = "Tier 1 (Typical)";
    if (overallPercentage >= 51) tier = "Tier 3 (High Support)";
    else if (overallPercentage >= 26) tier = "Tier 2 (Emerging)";

    return { domainResults, overallPercentage, tier, maxScore };
  }

  const handleAttemptSubmit = () => {
    const pending = examData.questions.length - Object.keys(answers).length;
    if (pending > 0) setDialog({ open: true, type: 'error', title: 'Incomplete', message: `${pending} unanswered questions remain. Please complete all questions before submitting.` });
    else setDialog({ open: true, type: 'confirm', title: 'Submit Assessment', message: 'Are you sure you want to submit? No changes can be made after submission.' });
  }

  const executeFinalSubmit = async () => {
    setDialog({ open: true, type: 'loading', title: 'Submitting...', message: 'Saving your responses securely...' });
    
    const results = calculateFinalScores();
    const currentBaseline = getCurrentBaselineCategory();

    const payload = {
      studentId: studentDetails._id || studentDetails.id || studentDetails.user_id, 
      schoolId: studentDetails.school || studentDetails.schoolId || studentDetails.school_id,
      gradeBand: getGradeBand(studentDetails.class),
      maxScorePerQuestion: results.maxScore, overallPercentage: results.overallPercentage, tierPlacement: results.tier,
      baselineCategory: currentBaseline, 
      domainScores: results.domainResults.map(d => ({
        domainName: d.domain, totalScore: d.sum, questionCount: d.count, averageScore: parseFloat(d.average), percentage: d.percentage
      })),
      responses: []
    };

    results.domainResults.forEach(domainData => {
       domainData.details.forEach(q => {
          const actualQuestion = examData.questions[q.qNo - 1]; 
          payload.responses.push({
            questionText: actualQuestion.text, domain: actualQuestion.domain, categoryLabel: actualQuestion.categoryLabel || "",
            selectedOption: q.response, rawScore: q.raw, isReversed: q.reversed, finalScore: q.final
          });
       });
    });

    try {
       const response = await fetch(`${process.env.REACT_APP_BASE_URL}/counselor/v1/submit-baseline`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
         body: JSON.stringify(payload)
       });
       const resData = await response.json();

       if(response.ok) { 
          localStorage.removeItem(`baseline_draft_${studentDetails.regNo}`);
          setTimeout(() => setDialog({ 
            open: true, type: 'success', title: 'Submission Successful!', 
            message: resData.message || 'Your assessment has been recorded securely. Thank you for participating.' 
          }), 500);
       } else {
          const errorMessage = resData.error || resData.message || 'Could not save data.';
          setDialog({ open: true, type: 'error', title: 'Notice', message: errorMessage });
       }
    } catch (error) {
       setDialog({ open: true, type: 'error', title: 'Network Error', message: 'Failed to connect to the server.' });
    }
  }

  const closeSuccessAndReset = () => {
    setDialog({ ...dialog, open: false });
    setTimeout(() => {
      setStep(0); setRegNo(''); setAnswers({}); setVisited(new Set([0])); setReview(new Set());
      setStudentDetails(null); setTermsAccepted(false); setExamData({ questions: [], options: [] });
    }, 300);
  }

  const a11yStyles = { letterSpacing: a11y.dyslexic ? '0.15em' : 'normal', wordSpacing: a11y.dyslexic ? '0.25em' : 'normal', lineHeight: a11y.dyslexic ? '1.8' : '1.5', color: THEME.textMain };

  // 🟢 TOUR GUIDE STYLING
  const startTour = () => setTourStep(1);
  const nextTourStep = () => {
    if (tourStep === 5) { setTourStep(0); localStorage.setItem(`tour_seen_${studentDetails?.regNo}`, 'true'); } 
    else setTourStep(prev => prev + 1);
  };
  const skipTour = () => { setTourStep(0); localStorage.setItem(`tour_seen_${studentDetails?.regNo}`, 'true'); };

  const getTourStyle = (stepNum) => ({
    ...(tourStep === stepNum && {
      position: 'relative',
      zIndex: 10000,
      backgroundColor: stepNum === 1 ? 'rgba(255,255,255,0.1)' : THEME.paperBg, // Header ke hisaab se bg change
      boxShadow: `0px 0px 0px 4px ${THEME.headerBg}, 0px 10px 40px rgba(0,0,0,0.6)`,
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      pointerEvents: 'none' 
    })
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: THEME.bgMain, transition: 'all 0.3s', position: 'relative' }}>
      
      {/* 🟢 PROFESSIONAL FLOATING TOUR WIDGET */}
      <Backdrop open={tourStep > 0} sx={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.8)' }} />
      
      {tourStep > 0 && (
        <Paper elevation={24} sx={{
          position: 'fixed', bottom: { xs: 20, md: 40 }, right: { xs: '50%', md: 40 }, 
          transform: { xs: 'translateX(50%)', md: 'none' },
          zIndex: 10005, width: '100%', maxWidth: 360, borderRadius: '12px', overflow: 'hidden', 
          border: `1px solid ${THEME.border}`, bgcolor: THEME.paperBg, animation: 'fadeIn 0.3s ease-out'
        }}>
          <Box sx={{ bgcolor: THEME.headerBg, p: 2, color: '#fff', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <AutoAwesomeRoundedIcon />
            <Typography sx={{ fontWeight: 800, fontSize: '16px', letterSpacing: '0.5px' }}>
              {TOUR_STEPS[tourStep - 1].title}
            </Typography>
          </Box>
          <Box sx={{ p: 3 }}>
            <Typography sx={{ color: THEME.textMain, fontSize: '15px', lineHeight: 1.6, mb: 4, fontWeight: 500 }}>
              {TOUR_STEPS[tourStep - 1].text}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={skipTour} sx={{ textTransform: 'none', color: THEME.textMuted, fontWeight: 600 }}>Skip Tour</Button>
              <Typography sx={{ fontSize: '13px', color: THEME.textMuted, fontWeight: 800 }}>{tourStep} / 5</Typography>
              <Button onClick={nextTourStep} variant="contained" sx={{ textTransform: 'none', bgcolor: THEME.headerBg, borderRadius: '6px', fontWeight: 700, px: 3 }}>
                {tourStep === 5 ? "Got it!" : "Next"}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* 🟢 APP CONTAINER (Pointer events disabled during tour) */}
      <Box sx={{ pointerEvents: tourStep > 0 ? 'none' : 'auto' }}>
        <Snackbar sx={{ zIndex: 10000 }} open={toast.open} autoHideDuration={4000} onClose={() => setToast({...toast, open: false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
          <Alert onClose={() => setToast({...toast, open: false})} severity={toast.severity} sx={{ width: '100%', fontWeight: 600 }}>{toast.message}</Alert>
        </Snackbar>

        <Drawer anchor="right" open={a11y.menuOpen} onClose={() => setA11y({...a11y, menuOpen: false})} PaperProps={{ sx: { width: {xs: '300px', sm: '350px'}, p: 3, bgcolor: THEME.paperBg, color: THEME.textMain } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography sx={{ fontWeight: 700, fontSize: '18px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessibilityNewRoundedIcon /> Accessibility
            </Typography>
            <IconButton onClick={() => setA11y({...a11y, menuOpen: false})} sx={{ color: THEME.textMain }}><CloseRoundedIcon /></IconButton>
          </Box>
          <Divider sx={{ mb: 3, borderColor: THEME.border }} />
          <Typography sx={{ fontWeight: 600, mb: 1, fontSize: '14px' }}>Text Size</Typography>
          <Slider value={a11y.scale} min={0.9} max={1.4} step={0.1} marks onChange={(e, val) => setA11y({...a11y, scale: val})} valueLabelDisplay="auto" sx={{ color: THEME.headerBg, mb: 3 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box><Typography sx={{ fontWeight: 600, fontSize: '14px' }}>High Contrast</Typography><Typography sx={{ fontSize: '12px', color: THEME.textMuted }}>Dark background, bright text</Typography></Box>
            <Switch checked={a11y.highContrast} onChange={(e) => setA11y({...a11y, highContrast: e.target.checked})} color="primary" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box><Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Color-Blind Safe</Typography><Typography sx={{ fontSize: '12px', color: THEME.textMuted }}>Replaces Red/Green with Orange/Blue</Typography></Box>
            <Switch checked={a11y.colorBlind} onChange={(e) => setA11y({...a11y, colorBlind: e.target.checked})} color="primary" />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box><Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Reading Aid (Dyslexia)</Typography><Typography sx={{ fontSize: '12px', color: THEME.textMuted }}>Increases letter & word spacing</Typography></Box>
            <Switch checked={a11y.dyslexic} onChange={(e) => setA11y({...a11y, dyslexic: e.target.checked})} color="primary" />
          </Box>
          <Button fullWidth variant="outlined" onClick={() => setA11y({ menuOpen: false, scale: 1, highContrast: false, colorBlind: false, dyslexic: false })} sx={{ mt: 4, borderColor: THEME.border, color: THEME.textMain }}>Reset to Default</Button>
        </Drawer>

        <Dialog open={dialog.open} sx={{ zIndex: 10000 }} PaperProps={{ sx: { maxWidth: '350px', width: '100%', borderRadius: '8px', bgcolor: THEME.paperBg, color: THEME.textMain, m: 2 } }}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, fontWeight: 700, bgcolor: dialog.type === 'success' ? THEME.answered : (dialog.type === 'error' ? THEME.notAnswered : 'transparent'), color: (dialog.type === 'success' || dialog.type === 'error') ? '#fff' : THEME.textMain }}>
            {dialog.type === 'error' && <WarningRoundedIcon />}
            {dialog.type === 'success' && <CheckCircleRoundedIcon />}
            {dialog.type === 'loading' && <CircularProgress size={24} />}
            {dialog.title}
          </DialogTitle>
          <DialogContent sx={{ p: 3, textAlign: 'center' }}>
            <DialogContentText sx={{ color: THEME.textMain, fontSize: '15px', fontWeight: 500, mt: dialog.type === 'loading' ? 2 : 1 }}>
              {dialog.message}
            </DialogContentText>
          </DialogContent>
          {dialog.type !== 'loading' && (
            <DialogActions sx={{ p: 2, bgcolor: a11y.highContrast ? '#222' : '#f8f9fa', justifyContent: 'center' }}>
              {dialog.type === 'error' && <Button onClick={() => setDialog({ ...dialog, open: false })} variant="contained" sx={{ bgcolor: THEME.textMuted, borderRadius: '4px', textTransform: 'none', px: 4 }}>Close</Button>}
              {dialog.type === 'confirm' && (
                <><Button onClick={() => setDialog({ ...dialog, open: false })} sx={{ textTransform: 'none', color: THEME.textMain }}>Cancel</Button><Button variant="contained" onClick={executeFinalSubmit} sx={{ bgcolor: THEME.answered, borderRadius: '4px', textTransform: 'none' }}>Submit</Button></>
              )}
              {dialog.type === 'success' && <Button variant="contained" onClick={closeSuccessAndReset} sx={{ bgcolor: THEME.headerBg, py: 1, px: 4, fontWeight: 700, borderRadius: '4px', textTransform: 'none' }}>Done</Button>}
            </DialogActions>
          )}
        </Dialog>

        <Box sx={{ backgroundColor: THEME.headerBg, py: 1.5, px: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ color: (a11y.highContrast && THEME.headerBg === '#000000') ? '#fff' : '#fff', fontWeight: 700, fontSize: { xs: '14px', md: `${18 * a11y.scale}px` }, letterSpacing: '1px' }}>BASELINE ASSESSMENT SYSTEM</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {step === 2 && (
              <Tooltip title="Show Interactive Tour">
                <IconButton onClick={startTour} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <HelpOutlineRoundedIcon />
                </IconButton>
              </Tooltip>
            )}
            {/* 🟢 TOUR TARGET 1: ACCESSIBILITY ICON */}
            <Box ref={a11yRef} sx={{ p: 0.5, ...getTourStyle(1) }}>
              <Tooltip title="Accessibility Options">
                <IconButton onClick={() => setA11y({...a11y, menuOpen: true})} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.2)' }}>
                  <AccessibilityNewRoundedIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ backgroundColor: '#fff', px: 2, py: 0.5, borderRadius: '4px', display: {xs: 'none', sm: 'block'} }}><img src="https://www.mypeegu.com/assets/logo-DYLSSaku.png" alt="Logo" style={{ height: '24px' }} /></Box>
          </Box>
        </Box>

       {step === 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 2 }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: '400px', borderRadius: '4px', borderTop: `4px solid ${THEME.headerBg}`, bgcolor: THEME.paperBg }}>
              <Typography sx={{ fontWeight: 700, fontSize: `${20 * a11y.scale}px`, mb: 3, textAlign: 'center', color: THEME.textMain }}>System Login</Typography>
              
              <TextField fullWidth label="Registration Number" variant="outlined" 
                value={regNo} onChange={(e) => { setRegNo(e.target.value); setError(''); }} 
                sx={{ mb: 2, input: { color: THEME.textMain }, '& label': { color: THEME.textMuted }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: THEME.border } } }} 
              />
              
              {/* 🟢 NAYA LAB PIN INPUT */}
              <TextField fullWidth label="Lab PIN (4-6 digits)" variant="outlined" type="password"
                value={labPin} onChange={(e) => { setLabPin(e.target.value); setError(''); }} 
                onKeyPress={(e) => { if (e.key === 'Enter') handleFetchStudent() }} 
                error={!!error} helperText={error} 
                sx={{ mb: 3, input: { color: THEME.textMain, letterSpacing: '4px', fontWeight: 800 }, '& label': { color: THEME.textMuted }, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: THEME.border } } }} 
              />

              <Button fullWidth variant="contained" onClick={handleFetchStudent} disabled={isLoading} sx={{ bgcolor: THEME.headerBg, py: 1.2, borderRadius: '4px', fontWeight: 600, fontSize: `${15 * a11y.scale}px` }}>{isLoading ? 'Authenticating...' : 'Login to Test'}</Button>
            </Paper>
          </Box>
        )}

        {step === 1 && studentDetails && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, p: 2, gap: 2, height: { xs: 'auto', md: 'calc(100vh - 64px)' } }}>
            <Paper sx={{ flex: 1, p: { xs: 2, md: 3 }, borderRadius: '0', border: `1px solid ${THEME.border}`, overflowY: 'auto', bgcolor: THEME.paperBg }}>
              <Typography sx={{ fontWeight: 700, fontSize: `${20 * a11y.scale}px`, color: THEME.notAnswered, mb: 2, textTransform: 'uppercase' }}>Please read the instructions carefully</Typography>
              <Typography sx={{ fontWeight: 600, mb: 1, color: THEME.textMain, fontSize: `${16 * a11y.scale}px` }}>General Instructions:</Typography>
              <ol style={{ paddingLeft: '20px', color: THEME.textMain, fontSize: `${14 * a11y.scale}px`, ...a11yStyles }}>
                <li>Current Active Test: <strong>{getCurrentBaselineCategory()}</strong>.</li>
                <li>Total duration of the examination is 30 minutes.</li>
                <li>All questions are mandatory. You cannot submit the test until all questions are answered.</li>
              </ol>
              <Divider sx={{ my: 3, borderColor: THEME.border }} />
              <Box sx={{ display: 'flex', alignItems: 'flex-start', bgcolor: a11y.highContrast ? '#333' : '#e9ecef', p: 2, borderLeft: `4px solid ${THEME.headerBg}` }}>
                <Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} sx={{ p: 0, mr: 1, mt: 0.5, color: THEME.textMain }} />
                <Typography sx={{ fontSize: `${14 * a11y.scale}px`, fontWeight: 600, color: THEME.textMain, ...a11yStyles }}>I have read and understood the instructions.</Typography>
              </Box>
            </Paper>
            <Paper sx={{ width: { xs: '100%', md: '300px' }, p: 3, borderRadius: '0', border: `1px solid ${THEME.border}`, display: 'flex', flexDirection: 'column', alignItems: 'center', bgcolor: THEME.paperBg }}>
              <Avatar sx={{ width: 100, height: 100, mb: 2, bgcolor: THEME.headerBg, fontSize: '36px', fontWeight: 700, color: '#fff' }}>{studentDetails.name.charAt(0)}</Avatar>
              <Typography sx={{ fontWeight: 700, fontSize: `${18 * a11y.scale}px`, textAlign: 'center', mb: 1, color: THEME.textMain }}>{studentDetails.name}</Typography>
              <Box sx={{ width: '100%', mt: 2 }}>
                <Typography sx={{ fontSize: `${13 * a11y.scale}px`, color: THEME.textMuted }}>Registration No:</Typography>
                <Typography sx={{ fontWeight: 600, mb: 1.5, color: THEME.textMain, fontSize: `${15 * a11y.scale}px` }}>{studentDetails.regNo}</Typography>
                <Typography sx={{ fontSize: `${13 * a11y.scale}px`, color: THEME.textMuted }}>Class & Section:</Typography>
                <Typography sx={{ fontWeight: 600, mb: 3, color: THEME.textMain, fontSize: `${15 * a11y.scale}px` }}>
                  {studentDetails.class} {studentDetails.section ? `- ${studentDetails.section}` : ''}
                </Typography>
              </Box>
              <Button variant="contained" disabled={!termsAccepted} onClick={() => { 
                setStep(2); enterFullScreen(); 
                if (!localStorage.getItem(`tour_seen_${studentDetails.regNo}`)) {
                   setTimeout(() => setTourStep(1), 500);
                }
              }} sx={{ width: '100%', bgcolor: THEME.headerBg, py: 1.5, borderRadius: '4px', fontWeight: 700, fontSize: `${15 * a11y.scale}px` }}>Proceed</Button>
            </Paper>
          </Box>
        )}

        {step === 2 && examData.questions.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, p: 1, gap: 1, height: { xs: 'auto', md: 'calc(100vh - 64px)' } }}>
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: '0', border: `1px solid ${THEME.border}`, minHeight: { xs: '60vh', md: 'auto' }, bgcolor: THEME.paperBg }}>
              
              {/* 🟢 TOUR TARGET 2: QUESTION AREA */}
              <Box ref={qRef} sx={{ px: { xs: 2, md: 3 }, py: 2, borderBottom: `1px solid ${THEME.border}`, bgcolor: a11y.highContrast ? '#2A2A2A' : '#f8f9fa', ...getTourStyle(2) }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography sx={{ fontWeight: 700, color: THEME.textMain, fontSize: `${16 * a11y.scale}px` }}>Question No. {currentQIndex + 1}</Typography>
                  {examData.questions[currentQIndex].categoryLabel && (
                    <Chip label={examData.questions[currentQIndex].categoryLabel} size="small" sx={{ bgcolor: THEME.headerBg, color: '#fff', fontWeight: 600, letterSpacing: '0.5px', fontSize: `${12 * a11y.scale}px` }} />
                  )}
                </Box>
                {examData.questions[currentQIndex].introPrompt && (
                  <Typography sx={{ fontSize: `${14 * a11y.scale}px`, color: THEME.textMuted, fontStyle: 'italic', mb: 2 }}>
                    {examData.questions[currentQIndex].introPrompt}
                  </Typography>
                )}
                <Typography sx={{ fontSize: { xs: `${16 * a11y.scale}px`, md: `${18 * a11y.scale}px` }, color: THEME.textMain, fontWeight: 600 }}>
                  {examData.questions[currentQIndex].text}
                </Typography>
              </Box>

              {/* 🟢 TOUR TARGET 3: OPTIONS AREA */}
              <Box ref={optRef} sx={{ p: { xs: 2, md: 4 }, flex: 1, overflowY: 'auto', ...a11yStyles, ...getTourStyle(3) }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <RadioGroup value={answers[currentQIndex] || ''} onChange={(e) => handleOptionSelect(e.target.value)}>
                    {examData.options.map((opt, i) => (
                      <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2, p: 1, borderRadius: '8px', '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' } }}>
                        <Typography sx={{ mr: 2, fontWeight: 600, color: THEME.textMain, fontSize: `${16 * a11y.scale}px` }}>({String.fromCharCode(65 + i)})</Typography>
                        <FormControlLabel value={opt} control={<Radio sx={{color: THEME.textMain}} />} label={<span style={{fontSize: `${16 * a11y.scale}px`}}>{opt}</span>} sx={{ m: 0, color: THEME.textMain, width: '100%' }} />
                      </Box>
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>

              {/* 🟢 TOUR TARGET 4: NAV CONTROLS */}
              <Box ref={navRef} sx={{ p: 2, borderTop: `1px solid ${THEME.border}`, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'space-between', bgcolor: a11y.highContrast ? '#2A2A2A' : '#f8f9fa', ...getTourStyle(4) }}>
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <Button variant="contained" onClick={handleMarkForReview} sx={{ flex: { xs: 1, sm: 'auto' }, bgcolor: THEME.review, borderRadius: '4px', textTransform: 'none', color: '#fff', fontWeight: 600, fontSize: `${14 * a11y.scale}px` }}>Review & Next</Button>
                  <Button variant="outlined" onClick={handleClearResponse} sx={{ flex: { xs: 1, sm: 'auto' }, borderRadius: '4px', textTransform: 'none', color: THEME.textMain, borderColor: THEME.border, fontSize: `${14 * a11y.scale}px` }}>Clear</Button>
                </Box>
                <Button variant="contained" onClick={handleSaveAndNext} sx={{ width: { xs: '100%', sm: 'auto' }, bgcolor: THEME.answered, borderRadius: '4px', textTransform: 'none', px: 4, color: '#fff', fontSize: `${14 * a11y.scale}px` }}>Save & Next</Button>
              </Box>
            </Paper>

            {/* 🟢 TOUR TARGET 5: QUESTION PALETTE */}
            <Paper ref={palRef} sx={{ width: { xs: '100%', md: '280px' }, borderRadius: '0', border: `1px solid ${THEME.border}`, display: 'flex', flexDirection: 'column', bgcolor: THEME.paperBg, ...getTourStyle(5) }}>
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: `1px solid ${THEME.border}` }}>
                <Avatar sx={{ width: 50, height: 50, bgcolor: THEME.headerBg, fontWeight: 700, borderRadius: '4px', color: '#fff' }}>{studentDetails?.name?.charAt(0)}</Avatar>
                <Typography sx={{ fontWeight: 700, fontSize: `${14 * a11y.scale}px`, color: THEME.textMain, lineHeight: 1.2 }}>{studentDetails?.name}</Typography>
              </Box>
              <Box sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
                <Typography sx={{ fontWeight: 800, mb: 2, color: THEME.headerBg, fontSize: `${16 * a11y.scale}px`, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {getCurrentBaselineCategory()}
                </Typography>
                <Grid container spacing={1}>
                  {examData.questions.map((_, i) => {
                    const status = getQuestionStatus(i);
                    let bgColor = THEME.notVisited; let color = THEME.textMain; let border = `1px solid ${THEME.border}`;
                    if (status === 'answered') { bgColor = THEME.answered; color = '#fff'; border = 'none'; }
                    else if (status === 'not_answered') { bgColor = THEME.notAnswered; color = '#fff'; border = 'none'; }
                    else if (status === 'review') { bgColor = THEME.review; color = '#000'; border = 'none'; }
                    
                    return (
                      <Grid item xs={2.4} sm={2} md={3} key={i}>
                        <Box onClick={() => moveToQuestion(i)} sx={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontWeight: 700, fontSize: `${14 * a11y.scale}px`, backgroundColor: bgColor, color: color, border: border, borderRadius: '4px', opacity: currentQIndex === i ? 0.6 : 1, transition: '0.2s', '&:hover': { opacity: 0.8 } }}>{i + 1}</Box>
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
              <Box sx={{ p: 1, borderTop: `1px solid ${THEME.border}`, bgcolor: a11y.highContrast ? '#2A2A2A' : '#e9ecef' }}>
                <Button fullWidth variant="contained" onClick={handleAttemptSubmit} sx={{ bgcolor: THEME.headerBg, borderRadius: '4px', fontWeight: 700, py: 1.5, fontSize: `${15 * a11y.scale}px` }}>Submit Assessment</Button>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default SelfAssessmentBaseline