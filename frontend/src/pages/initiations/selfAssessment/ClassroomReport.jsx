import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Paper, Grid, Chip, LinearProgress, CircularProgress 
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk';

const ClassroomReport = ({ selectedSchool, selectedYear, selectedPhase, selectedClass }) => {
  const dispatch = useDispatch();
  const baselineState = useSelector((state) => state.baselineAnalytics || {});

  // Fetch data if params change (Optional, as Dashboard already fetches it, but good for safety)
  useEffect(() => {
    if (selectedSchool && selectedYear) {
      dispatch(fetchSchoolWideBaseline({
        schoolId: selectedSchool,
        academicYearId: selectedYear,
        baselineCategory: selectedPhase === 'all' ? 'Baseline 1' : selectedPhase,
        classRoomId: selectedClass !== 'all' ? selectedClass : undefined // Backend support required
      }));
    }
  }, [selectedSchool, selectedYear, selectedPhase, selectedClass, dispatch]);

  const rawData = baselineState?.schoolData || {};
  const kpi = rawData.kpi || { total: 0, t1: 0, t1Pct: 0, t2: 0, t2Pct: 0, t3: 0, t3Pct: 0 };
  const domains = rawData.domainAnalysis?.chartData || [];
  const riskPredictors = rawData.domainAnalysis?.riskPredictors || [];
  const protectiveFactors = rawData.domainAnalysis?.protectiveFactors || [];

  if (baselineState.isSchoolLoading || baselineState.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: '#1A5276' }} />
      </Box>
    );
  }

  // 🟢 DYNAMIC CALCULATIONS
  const totalStudents = kpi.total || 0;
  const tiers = {
    1: { count: kpi.t1, percent: kpi.t1Pct, color: '#1E8449' },
    2: { count: kpi.t2, percent: kpi.t2Pct, color: '#E67E22' },
    3: { count: kpi.t3, percent: kpi.t3Pct, color: '#C0392B' }
  };

  const t1End = tiers[1].percent || 0;
  const t2End = t1End + (tiers[2].percent || 0);
  const conicGradient = totalStudents > 0 
    ? `conic-gradient(${tiers[1].color} 0% ${t1End}%, ${tiers[2].color} ${t1End}% ${t2End}%, ${tiers[3].color} ${t2End}% 100%)`
    : '#eee'; // Gray fallback if no students

  return (
    <Box className="fade-in">
      {/* 🟢 HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1C2833', mb: 0.5 }}>
          Classroom report {selectedClass !== 'all' ? '— Selected Class' : '— All Classes'}
        </Typography>
        <Typography sx={{ fontSize: '13px', color: '#666' }}>
          {selectedPhase === 'all' ? 'All Phases' : selectedPhase} · {totalStudents} students assessed
        </Typography>
      </Box>

      {/* 🟢 KPI CARDS */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', bgcolor: '#f5f7f9', border: '1px solid #eef2f5' }}>
            <Typography sx={{ fontSize: '12px', color: '#666', mb: 0.5 }}>Total students</Typography>
            <Typography sx={{ fontSize: '22px', fontWeight: 600, color: '#1C2833' }}>{totalStudents}</Typography>
          </Paper>
        </Grid>
        {[1, 2, 3].map(tier => (
          <Grid item xs={6} md={3} key={tier}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: '8px', bgcolor: '#f5f7f9', border: '1px solid #eef2f5' }}>
              <Typography sx={{ fontSize: '12px', color: '#666', mb: 0.5 }}>Tier {tier}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography sx={{ fontSize: '22px', fontWeight: 600, color: tiers[tier].color }}>{tiers[tier].count}</Typography>
                <Typography sx={{ fontSize: '13px', color: tiers[tier].color, fontWeight: 500 }}>{tiers[tier].percent}%</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {/* 🟢 LEFT: TIER DONUT CHART */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e8e8e8', bgcolor: '#fff', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1C2833', mb: 3, width: '100%' }}>Tier distribution</Typography>
            
            <Box sx={{ position: 'relative', width: '160px', height: '160px', borderRadius: '50%', background: conicGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
              <Box sx={{ width: '100px', height: '100px', bgcolor: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#1A5276' }}>{totalStudents} total</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4, flexWrap: 'wrap', width: '100%' }}>
              {[1, 2, 3].map(tier => (
                <Box key={tier} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: tiers[tier].color }} />
                  <Typography sx={{ fontSize: '12px', color: '#555', fontWeight: 500 }}>Tier {tier} — {tiers[tier].count}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* 🟢 RIGHT: FLAGS & DOMAIN BARS */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #e8e8e8', bgcolor: '#fff', height: '100%' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1C2833', mb: 2 }}>Active Risk Flags</Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {riskPredictors.length > 0 ? riskPredictors.map((flag, idx) => (
                <Chip key={idx} label={`${flag.label} — High Risk`} size="small" sx={{ bgcolor: '#FADBD8', color: '#C0392B', fontWeight: 500, borderRadius: '6px', fontSize: '12px' }} />
              )) : <Typography variant="caption" color="textSecondary">No critical active flags.</Typography>}
            </Box>

            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1C2833', mb: 2 }}>Domain Risk Severity</Typography>
            {domains.length > 0 ? domains.map((dom, idx) => {
              const riskPercent = Math.round((dom.risk / 5) * 100);
              const riskColor = riskPercent > 60 ? '#C0392B' : riskPercent > 40 ? '#E67E22' : '#1E8449';
              return (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '12px', color: '#555', width: '150px', flexShrink: 0 }}>{dom.label}</Typography>
                  <Box sx={{ flex: 1, mx: 1.5 }}>
                    <LinearProgress variant="determinate" value={riskPercent} sx={{ height: 8, borderRadius: 4, bgcolor: '#eceff1', '& .MuiLinearProgress-bar': { bgcolor: riskColor } }} />
                  </Box>
                  <Typography sx={{ fontSize: '12px', fontWeight: 600, color: riskColor, width: '40px', textAlign: 'right' }}>{riskPercent}%</Typography>
                </Box>
              )
            }) : <Typography variant="caption" color="textSecondary">No domain data available.</Typography>}
          </Paper>
        </Grid>
      </Grid>

      {/* 🟢 STRENGTHS BOX */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', bgcolor: '#F0FBF4', border: '1px solid #A9DFBF', mb: 2 }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1E8449', mb: 1.5 }}>
          ⭐ Class strengths — Protective factors to leverage
        </Typography>
        <Grid container spacing={3}>
          {protectiveFactors.length > 0 ? protectiveFactors.slice(0, 4).map((str, idx) => (
            <Grid item xs={12} md={6} key={idx}>
              <Chip label={`${str.label} — ${str.value}%`} size="small" sx={{ bgcolor: '#D5F5E3', color: '#1E8449', fontWeight: 600, borderRadius: '6px', mb: 1 }} />
              <Typography sx={{ fontSize: '12px', color: '#555', lineHeight: 1.5 }}>
                Leverage this strength to support students. Encourage group activities and peer-to-peer mentoring related to {str.label.toLowerCase()}.
              </Typography>
            </Grid>
          )) : <Typography sx={{ pl: 3, pt: 1, fontSize: '12px', color: '#555' }}>No significant strengths calculated yet.</Typography>}
        </Grid>
      </Paper>

      {/* 🟢 AI CLASSROOM STRATEGIES (Dynamic based on Risks) */}
      {riskPredictors.length > 0 && (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '10px', background: 'linear-gradient(135deg, #EBF5FB, #E8F8F5)', border: '1px solid #AED6F1' }}>
          <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#1A5276', display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <AutoAwesomeRoundedIcon fontSize="small" /> AI recommended classroom strategies for teachers
          </Typography>
          <Box sx={{ pl: 3.5 }}>
            {riskPredictors.slice(0, 3).map((strat, idx) => (
              <Typography key={idx} sx={{ fontSize: '13px', color: '#1C2833', mb: 1, lineHeight: 1.6 }}>
                <span style={{ color: '#C0392B', fontWeight: 700, marginRight: '6px' }}>Targeting {strat.label}:</span>
                Provide structured check-ins, validate pressure explicitly, and ensure classroom expectations are visually clear and chunked.
              </Typography>
            ))}
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default ClassroomReport;