import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Paper, Grid, Chip, LinearProgress, 
  Avatar, Button, CircularProgress 
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LightbulbCircleRoundedIcon from '@mui/icons-material/LightbulbCircleRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk';

const SchoolCounselorReport = ({ selectedSchool, selectedYear, selectedPhase, selectedClass }) => {
  const dispatch = useDispatch();
  const baselineState = useSelector((state) => state.baselineAnalytics || {});
  
  const [drillDownTier, setDrillDownTier] = useState(null);

  // 🟢 Fetch Data on Filter Change
  useEffect(() => {
    if (selectedSchool && selectedYear) {
      dispatch(fetchSchoolWideBaseline({
        schoolId: selectedSchool,
        academicYearId: selectedYear,
        baselineCategory: selectedPhase === 'all' ? 'Baseline 1' : selectedPhase,
        classRoomId: selectedClass !== 'all' ? selectedClass : undefined
      }));
    }
  }, [selectedSchool, selectedYear, selectedPhase, selectedClass, dispatch]);

  const rawData = baselineState?.schoolData || {};
  const kpi = rawData.kpi || { total: 0, t1: 0, t1Pct: 0, t2: 0, t2Pct: 0, t3: 0, t3Pct: 0 };
  const studentsList = rawData.studentsList || [];
  const domainData = rawData.domainAnalysis?.chartData || [];

  if (baselineState.isSchoolLoading || baselineState.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#1A5276' }} />
      </Box>
    );
  }

  // 🟢 DYNAMIC DATA PROCESSING
  const t1Students = studentsList.filter(s => s.tier?.includes('1'));
  const t2Students = studentsList.filter(s => s.tier?.includes('2'));
  const t3Students = studentsList.filter(s => s.tier?.includes('3'));

  const tiers = {
    1: { 
      id: 1, count: kpi.t1, percent: kpi.t1Pct, color: '#1E8449', bg: '#F0FBF4', borderColor: '#A9DFBF', 
      label: 'Tier 1 — On track', 
      aiMsg: 'These students are developing well. Continue SEL curriculum and preventive group activities. Peer mentoring roles can further strengthen their confidence.',
      students: t1Students
    },
    2: { 
      id: 2, count: kpi.t2, percent: kpi.t2Pct, color: '#E67E22', bg: '#FEF9F0', borderColor: '#F5CBA7', 
      label: 'Tier 2 — Targeted support', 
      aiMsg: `Primary concerns are emerging. Recommend targeted small group sessions for these ${kpi.t2} students. Monitor closely for the next 4 weeks.`,
      students: t2Students
    },
    3: { 
      id: 3, count: kpi.t3, percent: kpi.t3Pct, color: '#C0392B', bg: '#FEF0F0', borderColor: '#F5B7B1', 
      label: 'Tier 3 — Intensive support', 
      aiMsg: `Immediate 1:1 counselling required. These ${kpi.t3} students show combined distress flags. Coordinate with parents and subject teachers this week.`,
      students: t3Students
    }
  };

  // Aggregate Flags from all students
  const flagCounts = {};
  studentsList.forEach(stu => {
    stu.flags?.forEach(f => {
      flagCounts[f.label] = (flagCounts[f.label] || 0) + 1;
    });
  });

  const activeFlags = Object.keys(flagCounts).map(label => {
    let type = 'success';
    if (label.toLowerCase().includes('risk') || label.toLowerCase().includes('distress') || label.toLowerCase().includes('concern')) {
      type = 'error';
    } else if (label.toLowerCase().includes('gap') || label.toLowerCase().includes('monitor')) {
      type = 'warning';
    }
    return { label: `${label} — ${flagCounts[label]} students`, type, count: flagCounts[label] };
  }).sort((a, b) => b.count - a.count).slice(0, 8); // Top 8 active flags

  // Process Domains for Snapshot
  const processedDomains = domainData.map(d => {
    const percent = Math.round((d.risk / 5) * 100);
    return {
      label: d.label,
      percent,
      color: percent > 60 ? '#C0392B' : percent > 40 ? '#E67E22' : '#1E8449',
      protPercent: Math.round((d.protective / 5) * 100)
    };
  }).sort((a, b) => b.percent - a.percent);

  // Top Strengths based on protective factors
  const topStrengths = [...processedDomains].sort((a, b) => b.protPercent - a.protPercent).slice(0, 2);


  // 🟢 DRILL-DOWN VIEW (Showing Students for a specific Tier)
  if (drillDownTier) {
    const tierData = tiers[drillDownTier];
    return (
      <Box className="fade-in">
        <Button 
          startIcon={<ArrowBackRoundedIcon />} 
          onClick={() => setDrillDownTier(null)}
          sx={{ mb: 2, textTransform: 'none', color: '#1A5276', fontWeight: 600, bgcolor: '#fff', border: '1px solid #1A5276', px: 2, py: 0.5, borderRadius: '8px' }}
        >
          Back to dashboard
        </Button>
        
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: tierData.color, mb: 2 }}>
          {tierData.label} — {tierData.count} students
        </Typography>

        <Paper elevation={0} sx={{ p: 2, mb: 3, bgcolor: tierData.bg, border: `1px solid ${tierData.borderColor}`, borderRadius: '10px' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: tierData.color, display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AutoAwesomeRoundedIcon fontSize="small" /> AI support recommendation
          </Typography>
          <Typography sx={{ fontSize: '13px', color: '#333', lineHeight: 1.5 }}>
            {tierData.aiMsg}
          </Typography>
        </Paper>

        <Paper elevation={0} sx={{ border: '1px solid #e8e8e8', borderRadius: '12px', bgcolor: '#fff' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>Students in this tier</Typography>
          </Box>
          <Box sx={{ p: 1 }}>
            {tierData.students.length > 0 ? tierData.students.map((student, idx) => {
              return (
                <Box key={student.id || idx} sx={{ 
                  display: 'flex', alignItems: 'center', gap: 2, p: 1.5, 
                  borderBottom: idx !== tierData.students.length - 1 ? '1px solid #f0f0f0' : 'none',
                  '&:hover': { bgcolor: '#f9f9f9', borderRadius: '8px' }, cursor: 'pointer', transition: '0.2s'
                }}>
                  <Avatar sx={{ bgcolor: tierData.bg, color: tierData.color, width: 36, height: 36, fontSize: '13px', fontWeight: 600 }}>
                    {student.initials}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#1C2833' }}>{student.name}</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#666', mt: 0.5 }}>
                      {student.flags?.map(f => f.label).join(' · ') || 'No specific flags'}
                    </Typography>
                  </Box>
                </Box>
              );
            }) : (
              <Typography sx={{ p: 3, textAlign: 'center', color: '#999', fontSize: '13px' }}>No students found in this tier for the selected filter.</Typography>
            )}
          </Box>
        </Paper>
      </Box>
    );
  }

  // 🟢 MAIN DASHBOARD VIEW
  return (
    <Box className="fade-in">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1C2833', mb: 0.5 }}>School counsellor dashboard</Typography>
          <Typography sx={{ fontSize: '13px', color: '#666' }}>
            {selectedClass === 'all' ? 'All Classes' : 'Selected Class'} · {selectedPhase === 'all' ? 'All Phases' : selectedPhase}
          </Typography>
        </Box>
        <Chip label={`${kpi.total} students assessed`} sx={{ bgcolor: '#EBF5FB', color: '#1A5276', fontWeight: 600, borderRadius: '20px', fontSize: '12px' }} />
      </Box>

      {/* TIER CARDS GRID */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[1, 2, 3].map((tierKey) => {
          const tier = tiers[tierKey];
          return (
            <Grid item xs={12} md={4} key={tierKey}>
              <Paper 
                elevation={0} onClick={() => setDrillDownTier(tierKey)}
                sx={{ 
                  p: 2, borderRadius: '12px', bgcolor: tier.bg, border: `1.5px solid ${tier.borderColor}`,
                  cursor: 'pointer', transition: 'all 0.2s ease', 
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }
                }}
              >
                <Typography sx={{ fontSize: '12px', color: tier.color, fontWeight: 600, mb: 1 }}>{tier.label}</Typography>
                <Typography sx={{ fontSize: '28px', fontWeight: 600, color: tier.color, lineHeight: 1 }}>{tier.count}</Typography>
                <Typography sx={{ fontSize: '13px', color: tier.color, opacity: 0.8, mt: 0.5, mb: 1 }}>{tier.percent}% of class</Typography>
                <Typography sx={{ fontSize: '11px', color: tier.color, fontWeight: 500, mb: 2 }}>Click to see students ›</Typography>
                
                <Box sx={{ 
                  bgcolor: tierKey === 1 ? '#E8F8F5' : tierKey === 2 ? 'linear-gradient(135deg,#FEF9F0,#FEF3E2)' : 'linear-gradient(135deg,#FEF0F0,#FADBD8)', 
                  p: 1.5, borderRadius: '8px', border: `1px solid ${tier.borderColor}`
                }}>
                  <Typography sx={{ fontSize: '11px', fontWeight: 600, color: tier.color, display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                    <LightbulbCircleRoundedIcon sx={{ fontSize: '14px' }} /> AI support summary
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#333', lineHeight: 1.4 }}>{tier.aiMsg}</Typography>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* ACTIVE FLAGS */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e8e8e8', mb: 2, bgcolor: '#fff' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 2, color: '#1C2833' }}>Active aggregated flags</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {activeFlags.length > 0 ? activeFlags.map((flag, idx) => {
            const bg = flag.type === 'error' ? '#FADBD8' : flag.type === 'warning' ? '#FDEBD0' : '#D5F5E3';
            const color = flag.type === 'error' ? '#C0392B' : flag.type === 'warning' ? '#E67E22' : '#1E8449';
            return <Chip key={idx} label={flag.label} size="small" sx={{ bgcolor: bg, color: color, fontWeight: 500, borderRadius: '6px', fontSize: '12px' }} />;
          }) : <Typography variant="caption" color="textSecondary">No active flags found.</Typography>}
        </Box>
      </Paper>

      {/* STRENGTHS AI BOX */}
      {topStrengths.length > 0 && (
        <Paper elevation={0} sx={{ p: 2, borderRadius: '10px', bgcolor: '#F0FBF4', border: '1px solid #A9DFBF', mb: 2 }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1E8449', mb: 1.5 }}>
            ⭐ Class strengths — how to leverage them
          </Typography>
          <Grid container spacing={2}>
            {topStrengths.map((str, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Chip label={`${str.label} — Strong`} size="small" sx={{ bgcolor: '#D5F5E3', color: '#1E8449', fontWeight: 600, borderRadius: '6px', mb: 1 }} />
                <Typography sx={{ fontSize: '13px', color: '#555', lineHeight: 1.5 }}>
                  Use {str.label.toLowerCase()} as an anchor for intervention. Assign peer support roles and structured cooperative tasks based on this strength.
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* DOMAIN SNAPSHOT */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #e8e8e8', bgcolor: '#fff' }}>
        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 2, color: '#1C2833' }}>Domain snapshot — risk percentage</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            {processedDomains.slice(0, 3).map((dom, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#555', width: '130px', flexShrink: 0 }}>{dom.label}</Typography>
                <Box sx={{ flex: 1, mx: 1.5 }}>
                  <LinearProgress variant="determinate" value={dom.percent} sx={{ height: 8, borderRadius: 4, bgcolor: '#eceff1', '& .MuiLinearProgress-bar': { bgcolor: dom.color } }} />
                </Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: dom.color, width: '35px', textAlign: 'right' }}>{dom.percent}%</Typography>
              </Box>
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            {processedDomains.slice(3).map((dom, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <Typography sx={{ fontSize: '13px', color: '#555', width: '130px', flexShrink: 0 }}>{dom.label}</Typography>
                <Box sx={{ flex: 1, mx: 1.5 }}>
                  <LinearProgress variant="determinate" value={dom.percent} sx={{ height: 8, borderRadius: 4, bgcolor: '#eceff1', '& .MuiLinearProgress-bar': { bgcolor: dom.color } }} />
                </Box>
                <Typography sx={{ fontSize: '12px', fontWeight: 600, color: dom.color, width: '35px', textAlign: 'right' }}>{dom.percent}%</Typography>
              </Box>
            ))}
            <Typography sx={{ fontSize: '11px', color: '#888', mt: 2, fontStyle: 'italic' }}>
              * Calculated as average risk severity across selected students.
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SchoolCounselorReport;