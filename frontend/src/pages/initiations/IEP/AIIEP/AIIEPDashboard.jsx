import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom'; // 🟢 useNavigate import kiya
import { Box, Grid, Paper, Avatar, Typography, Button, Tabs, Tab, IconButton, Chip, Snackbar, Alert } from '@mui/material';
import { 
  VisibilityOutlined, AssignmentOutlined, InsertChartOutlined, TrackChangesOutlined, 
  SettingsSuggestOutlined, AutoAwesome, Close, School, Check, PriorityHigh, GroupAddOutlined 
} from '@mui/icons-material';
import { keyframes } from '@mui/system';

// Imports from our Refactored structure
import { fetchStudent360Data, uploadIEPEvaluationPDF, generateIEPWithAI, saveIEPData } from './aiIepThunks';
import SidebarProfile from './tabs/SidebarProfile';
import EvaluationTab from './tabs/EvaluationTab';
import PLOPTab from './tabs/PLOPTab';
import ICPGoalsTab from './tabs/ICPGoalsTab';
import SupportTab from './tabs/SupportTab';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ width: '100%' }}>
    {value === index && <Box sx={{ p: { xs: 2, md: 3 } }}>{children}</Box>}
  </div>
);

const defaultSupportState = {
  accommodations: { specialEducationClasses: 'No', behavioralInterventions: 'No', oneOnOneHRT: 'No', focusClasses: 'No', accommodationsInSchool: 'No', assistiveTechnology: 'No' },
  transitionPlanning: { communityExperience: 'No', activitiesOfDailyLiving: 'No', functionalVocationalAssistance: 'No' },
  placement: { individualSessions: 'No', individualSessionCount: '1 session', groupSessions: 'No' }
};

// 🟢 PREMIUM AI LOADER ANIMATIONS
const gradientMove = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: -200% 50%; }
`;

const pulseEffect = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4); }
  70% { transform: scale(1); box-shadow: 0 0 0 15px rgba(66, 133, 244, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(66, 133, 244, 0); }
`;

const MyPeeguAILoader = ({ message, isOverlay }) => (
  <Box sx={{
    position: isOverlay ? 'absolute' : 'flex',
    top: 0, left: 0, right: 0, bottom: 0,
    height: isOverlay ? '100%' : '60vh',
    bgcolor: isOverlay ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
    backdropFilter: isOverlay ? 'blur(8px)' : 'none',
    zIndex: 9999,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    borderRadius: isOverlay ? '24px' : '0px'
  }}>
    <svg width={0} height={0}>
      <linearGradient id="aiGradient" x1={1} y1={0} x2={1} y2={1}>
        <stop offset={0} stopColor="#4285F4" />
        <stop offset={1} stopColor="#FBBC05" />
      </linearGradient>
    </svg>
    <Box sx={{ width: 90, height: 90, borderRadius: '50%', bgcolor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3, border: '2px solid #F8FAFC', animation: `${pulseEffect} 2s infinite` }}>
      <AutoAwesome sx={{ fontSize: 44, fill: "url(#aiGradient)" }} />
    </Box>
    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#1E293B', display: 'flex', alignItems: 'center', gap: 0.8, letterSpacing: '-0.5px' }}>
      MyPeegu 
      <Box component="span" sx={{ background: 'linear-gradient(90deg, #EA4335, #FBBC05, #34A853, #4285F4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 900 }}>AI</Box>
    </Typography>
    <Typography variant="body2" sx={{ mb: 4, fontWeight: 600, color: '#64748B' }}>{message}</Typography>
    <Box sx={{ width: '240px', height: '4px', borderRadius: '4px', background: 'repeating-linear-gradient(90deg, #EA4335 0%, #FBBC05 25%, #34A853 50%, #4285F4 75%, #EA4335 100%)', backgroundSize: '200% 100%', animation: `${gradientMove} 2.5s infinite linear` }} />
  </Box>
);

const AIIEPDashboard = ({ studentId: propStudentId, academicYear = '2025-2026', onClose }) => {
  const { studentId: paramStudentId } = useParams();
  const studentId = propStudentId || paramStudentId;
  const dispatch = useDispatch();
  const navigate = useNavigate(); // 🟢 Router Navigation Add kiya
  const [tabIndex, setTabIndex] = useState(0); 

  const { student360Data, is360Loading, isUploadingPDF } = useSelector((state) => state.iep360);
  const apiData = student360Data?.data?.data || student360Data?.data || student360Data || {};
  const { studentProfile, plopBaseline, checklistData, observationData, iepData } = apiData;

  const [selectedFile, setSelectedFile] = useState(null);
  const [editablePlop, setEditablePlop] = useState({}); 
  const [editableGoals, setEditableGoals] = useState([]);
  const [editableSupport, setEditableSupport] = useState(defaultSupportState);
  
  const [isIepGenerated, setIsIepGenerated] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

  // 🟢 NAYA FUNCTION: Dashboard band karne ke liye
  const handleCloseDashboard = () => {
    if (onClose) {
      onClose(); // Agar modal me khula hai
    } else {
      navigate('/dashboard/ai-iep'); // Agar full page me khula hai toh wapas list pe jao
    }
  };

  useEffect(() => {
    if (studentId) dispatch(fetchStudent360Data({ studentId, academicYear }));
  }, [studentId, academicYear, dispatch]);

  useEffect(() => {
    let generated = false;
    if (iepData?.aiGeneratedGoals && iepData.aiGeneratedGoals.length > 0) {
      setEditableGoals(JSON.parse(JSON.stringify(iepData.aiGeneratedGoals)));
      generated = true;
    }
    if (iepData?.plopAnalysis && Object.keys(iepData.plopAnalysis).length > 0) {
       setEditablePlop((prev) => ({ ...prev, ...iepData.plopAnalysis }));
       generated = true;
    }
    if (iepData?.supportNeeds && Object.keys(iepData.supportNeeds).length > 0) {
       setEditableSupport(iepData.supportNeeds);
       generated = true;
    }
    if(generated) setIsIepGenerated(true);
  }, [iepData]);

  const handleFileChange = (e) => { if (e.target.files && e.target.files.length > 0) setSelectedFile(e.target.files[0]); };
  
  const handleUpload = () => {
    if (!selectedFile) return;
    const formData = new FormData();
    formData.append('diagnosticReport', selectedFile);
    dispatch(uploadIEPEvaluationPDF({ studentId, formData }));
  };
  
  const handleGenerateIEP = () => { setTabIndex(2); dispatch(generateIEPWithAI({ studentId })); };
  const handleGoalChange = (index, field, value) => {
    const updatedGoals = [...editableGoals];
    updatedGoals[index] = { ...updatedGoals[index], [field]: value };
    setEditableGoals(updatedGoals);
  };
  const handleSupportChange = (category, field, value) => {
    setEditableSupport(prev => ({ ...prev, [category]: { ...prev[category], [field]: value } }));
  };
  const handleCloseToast = () => setToast({ ...toast, open: false });
  const handleSaveIEP = async () => {
    try {
      await dispatch(saveIEPData({ studentId, academicYear, plopAnalysis: editablePlop, aiGeneratedGoals: editableGoals, supportNeeds: editableSupport })).unwrap();
      setToast({ open: true, message: 'Awesome! IEP Data saved successfully! 🎉', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: 'Oops! Failed to save data. Please try again.', severity: 'error' });
    }
  };

  // 🟢 EMPTY STATE: If no studentId is present in URL or props, show a clean message.
  if (!studentId) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', p: 4 }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: '#F1F5F9', color: '#64748B', mb: 3 }}>
          <GroupAddOutlined sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>Select a Student</Typography>
        <Typography variant="body1" sx={{ color: '#475569', textAlign: 'center', maxWidth: 400 }}>
          Please navigate to the Students Directory and launch the AI IEP from a specific student's profile.
        </Typography>
      </Box>
    );
  }

  if (is360Loading && !student360Data) {
    return <MyPeeguAILoader message="Loading Student 360° Profile..." isOverlay={false} />;
  }

  const isAIGenerating = isUploadingPDF || (is360Loading && student360Data && false);
  let aiMessage = "Processing...";
  if (isUploadingPDF) aiMessage = "Extracting clinical insights from PDF...";

  const student = {
    name: studentProfile?.studentName || "Unknown Student", id: studentId,
    age: studentProfile?.dob ? new Date().getFullYear() - new Date(studentProfile.dob).getFullYear() : "N/A",
    initials: (studentProfile?.studentName || "ST").substring(0, 2).toUpperCase()
  };

  const generateBtnText = isIepGenerated ? "Regenerate IEP AI" : "Generate IEP AI";

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100%', position: 'relative', fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      
      {isUploadingPDF && <MyPeeguAILoader message={aiMessage} isOverlay={true} />}

      <Box sx={{ position: 'absolute', right: 16, top: 16, zIndex: 10 }}>
        {/* 🟢 CLOSE BUTTON UPDATED */}
        <IconButton onClick={handleCloseDashboard} sx={{ bgcolor: '#FFFFFF', '&:hover': { bgcolor: '#F1F5F9' }, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}><Close /></IconButton>
      </Box>

      <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <SidebarProfile student={student} activeChecklistScores={checklistData?.[0]?.categories || []} />
          </Grid>

          <Grid item xs={12} md={9}>
            <Paper sx={{ p: 2, borderRadius: '20px', mb: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <Avatar variant="rounded" sx={{ width: 56, height: 56, bgcolor: '#EFF6FF', color: '#3B82F6', borderRadius: '16px' }}><School /></Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>{student.name.toLowerCase()}</Typography>
                <Chip label={`ID: ${student.id}`} size="small" sx={{ mr: 1, borderRadius: '6px', bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }} />
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button variant="contained" startIcon={<AutoAwesome />} onClick={handleGenerateIEP} disabled={isAIGenerating} sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 700, bgcolor: '#3B82F6', boxShadow: 'none' }}>
                  {generateBtnText}
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
              <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)} variant="scrollable" sx={{ bgcolor: '#FFFFFF', px: 1, borderBottom: '1px solid #E2E8F0', '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
                <Tab icon={<VisibilityOutlined fontSize="small" />} label="Observations" iconPosition="start" />
                <Tab icon={<AssignmentOutlined fontSize="small" />} label="Evaluation" iconPosition="start" />
                <Tab icon={<InsertChartOutlined fontSize="small" />} label="PLOP" iconPosition="start" />
                <Tab icon={<TrackChangesOutlined fontSize="small" />} label="ICP Goals" iconPosition="start" />
                <Tab icon={<SettingsSuggestOutlined fontSize="small" />} label="Support" iconPosition="start" />
              </Tabs>

              {/* 🟢 TAB 0: OBSERVATIONS (Medical-Grade Dashboard) */}
              <TabPanel value={tabIndex} index={0}>
                {(!observationData || observationData.length === 0) ? (
                  <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
                    <VisibilityOutlined sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                    <Typography variant="subtitle1" fontWeight="600" color="#475569">No Observation Records</Typography>
                    <Typography variant="body2" color="textSecondary">Teacher observations will appear here once submitted.</Typography>
                  </Box>
                ) : (
                  <Box>
                    <Paper sx={{ p: 2, bgcolor: '#EFF6FF', borderRadius: '12px', mb: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #BFDBFE', boxShadow: 'none' }}>
                      <Avatar sx={{ bgcolor: '#93C5FD', color: '#1D4ED8', width: 32, height: 32 }}><VisibilityOutlined fontSize="small" /></Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="800" color="#1E3A8A">Clinical & Classroom Observations</Typography>
                        <Typography variant="caption" color="#1E40AF">Micro-details mapped from behavioral logs</Typography>
                      </Box>
                    </Paper>

                    {observationData.map((obs, idx) => {
                      
                      // Helper Function: Generates the Badges dynamically based on exact backend string
                      const getStatusBadge = (statusObj) => {
                        if (!statusObj || !statusObj.status) return null;
                        const status = statusObj.status;
                        let config = { color: '#64748B', bgcolor: '#F8FAFC', icon: null, text: 'N/A' };
                        
                        if (status === 'Present') {
                          config = { color: '#2563EB', bgcolor: '#EFF6FF', icon: <Check sx={{fontSize: 14, mr: 0.5}}/>, text: 'Present' };
                        } else if (status === 'NeedImprovement' || status === 'Need Improvements') {
                          config = { color: '#D97706', bgcolor: '#FFFBEB', icon: <PriorityHigh sx={{fontSize: 14, mr: 0.5}}/>, text: 'Need Improvements' };
                        } else if (status === 'NotPresent' || status === 'Not Present') {
                          config = { color: '#DC2626', bgcolor: '#FEF2F2', icon: <Close sx={{fontSize: 14, mr: 0.5}}/>, text: 'Not Present' };
                        }

                        return (
                          <Chip size="small" label={<Box sx={{display:'flex', alignItems:'center'}}>{config.icon}{config.text}</Box>} sx={{ bgcolor: config.bgcolor, color: config.color, fontWeight: 700, borderRadius: '6px', height: '24px' }} />
                        );
                      };

                      // Helper Component: Renders each individual metric card
                      const MetricCard = ({ title, data }) => {
                        if (!data) return null;
                        return (
                          <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', height: '100%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                <Typography variant="subtitle2" fontWeight="700" color="#1E293B">{title}</Typography>
                                {getStatusBadge(data)}
                              </Box>
                              <Typography variant="body2" color="#64748B" sx={{ lineHeight: 1.6 }}>
                                {data.comments || "No specific comments provided."}
                              </Typography>
                            </Paper>
                          </Grid>
                        );
                      };

                      const SectionHeader = ({ title }) => (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
                          <Box sx={{ width: 4, height: 18, bgcolor: '#3B82F6', borderRadius: '4px', mr: 1.5 }} />
                          <Typography variant="subtitle2" fontWeight="800" color="#64748B" sx={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            {title}
                          </Typography>
                        </Box>
                      );

                      return (
                        <Box key={idx} sx={{ mb: 6 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="caption" fontWeight="bold" color="textSecondary">
                              Observation Date: {new Date(obs.doo).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" fontWeight="bold" color="textSecondary">
                              Duration: {obs.duration} mins
                            </Typography>
                          </Box>

                          {/* SECTION 1: CLASSROOM PRESENCE & TASK PERFORMANCE */}
                          <SectionHeader title="Classroom Presence & Tasks" />
                          <Grid container spacing={2}>
                            <MetricCard title="Punctuality" data={obs.punctuality} />
                            <MetricCard title="Ability To Follow Guidelines" data={obs.abilityToFollowGuidelines} />
                            <MetricCard title="Ability To Follow Instructions" data={obs.abilityToFollowInstructions} />
                            <MetricCard title="Participation" data={obs.participation} />
                            <MetricCard title="Completion Of Tasks" data={obs.completionOfTasks} />
                            <MetricCard title="Ability To Work Independently" data={obs.abilityToWorkIndependently} />
                          </Grid>

                          {/* SECTION 2: BEHAVIOR & SPEECH */}
                          <SectionHeader title="Behavior & Speech" />
                          <Grid container spacing={2}>
                            <MetricCard title="Appearance" data={obs.appearance} />
                            <MetricCard title="Attitude" data={obs.attitude} />
                            <MetricCard title="Behaviour" data={obs.behaviour} />
                            <MetricCard title="Speech" data={obs.speech} />
                          </Grid>

                          {/* SECTION 3: EMOTIONAL STATUS */}
                          <SectionHeader title="Emotional Status" />
                          <Grid container spacing={2}>
                            <MetricCard title="Affect / Mood" data={obs.affetcOrMood} />
                            <MetricCard title="Thought Process" data={obs.thoughtProcessOrForm} />
                          </Grid>

                          {/* SECTION 4: INCIDENTAL NOTE */}
                          <SectionHeader title="Incidental Note" />
                          <Grid container spacing={2}>
                            <MetricCard title="Incidental / Additional Note" data={obs.incedentalOrAdditionalNote} />
                            <MetricCard title="Additional Comment" data={obs.additionalCommentOrNote} />
                          </Grid>
                        </Box>
                      )
                    })}
                  </Box>
                )}
              </TabPanel>

              {/* 🟢 EVALUATION TAB */}
              <TabPanel value={tabIndex} index={1}>
                <EvaluationTab selectedFile={selectedFile} handleFileChange={handleFileChange} handleUpload={handleUpload} isUploadingPDF={isUploadingPDF} aiEvaluationSummary={iepData} iepData={iepData} />
              </TabPanel>

              <TabPanel value={tabIndex} index={2}>
                <PLOPTab isIepGenerated={isIepGenerated} plopBaseline={plopBaseline} editablePlop={editablePlop} setEditablePlop={setEditablePlop} />
              </TabPanel>

              <TabPanel value={tabIndex} index={3}>
                <ICPGoalsTab isIepGenerated={isIepGenerated} editableGoals={editableGoals} handleGoalChange={handleGoalChange} />
              </TabPanel>

              <TabPanel value={tabIndex} index={4}>
                <SupportTab isIepGenerated={isIepGenerated} editableSupport={editableSupport} handleSupportChange={handleSupportChange} />
              </TabPanel>
            </Paper>

            {isIepGenerated && (
               <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button variant="contained" onClick={handleSaveIEP} sx={{ bgcolor: '#10B981', '&:hover': {bgcolor: '#059669'}, borderRadius: '10px', fontWeight: 700, px: 5, py: 1.5, boxShadow: 'none' }}>
                    Save All IEP Data
                  </Button>
               </Box>
            )}
          </Grid>
        </Grid>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%', borderRadius: '12px', fontWeight: 'bold' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AIIEPDashboard;