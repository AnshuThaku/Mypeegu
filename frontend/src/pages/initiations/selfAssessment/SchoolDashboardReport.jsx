import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Paper, CircularProgress, Grid, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, LinearProgress, Tooltip, Divider, Card, CardContent
} from '@mui/material';
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk';

// 🔥 my Peegü Logo Based Theme Colors
const COLORS = {
  primary: '#1976d2',     // Logo Blue
  secondary: '#FFB81C',   // Logo Yellow
  accent: '#E1251B',      // Logo Red
  textDark: '#212121',    // Professional Dark Text
  textMuted: '#6E6E6E',
  // Tier colors mapped to logo vibe + educational standards
  tier1: '#2E7D32',       // Professional Green for Tier 1 (Good)
  tier2: '#FFB81C',       // Logo Yellow for Tier 2 (Warning/Monitor)
  tier3: '#E1251B',       // Logo Red for Tier 3 (Danger/Action needed)
  bgLight: '#F8F9FA'
};

const SchoolDashboardReport = ({ selectedSchool, selectedYear, selectedPhase }) => {
  const dispatch = useDispatch();
  const baselineState = useSelector((state) => state.baselineAnalytics || {});

  useEffect(() => {
    if (selectedSchool && selectedYear) {
      dispatch(fetchSchoolWideBaseline({
        schoolId: selectedSchool,
        academicYearId: selectedYear,
        baselineCategory: selectedPhase === 'all' ? 'Baseline 1' : selectedPhase 
      }));
    }
  }, [selectedSchool, selectedYear, selectedPhase, dispatch]);

  if (!selectedSchool || !selectedYear) {
    return (
      <Box sx={{ p: 5, textAlign: 'center', border: '1px dashed #BDBDBD', borderRadius: '12px', bgcolor: COLORS.bgLight }}>
        <Typography color="textSecondary" variant="h6" fontWeight={500}>
          Please select a School and Academic Year from the top filters.
        </Typography>
      </Box>
    );
  }

  if (baselineState.isSchoolLoading || baselineState.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: COLORS.primary }} size={48} thickness={4} />
      </Box>
    );
  }

  const findData = (obj, key) => {
    if (!obj || typeof obj !== 'object') return null;
    if (obj[key] !== undefined) return obj[key];
    for (let k in obj) {
      const result = findData(obj[k], key);
      if (result !== null) return result;
    }
    return null;
  };

  const kpiData = findData(baselineState, 'kpi') || { total: 0, t1: 0, t1Pct: 0, t2: 0, t2Pct: 0, t3: 0, t3Pct: 0 };
  const gradeBands = findData(baselineState, 'gradeBands') || [];
  const healthScore = findData(baselineState, 'healthScore') || 0;
  const completionData = findData(baselineState, 'completionData') || [];

  return (
    <Box className="fade-in" sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 4 }}>
      
      {/* 🔴 HEADER & KPIs */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: COLORS.textDark, mb: 0.5 }}>
                School Dashboard Overview
              </Typography>
              <Typography variant="body2" sx={{ color: COLORS.textMuted, fontWeight: 500 }}>
                {selectedPhase} • {kpiData.total} students assessed
              </Typography>
            </Box>
            <Box sx={{ bgcolor: '#F1F8E9', p: 2, borderRadius: '10px', textAlign: 'center', minWidth: '140px', border: `1px solid #C8E6C9` }}>
              <Typography sx={{ fontSize: '12px', fontWeight: 700, color: COLORS.tier1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Health Score
              </Typography>
              <Typography sx={{ fontSize: '32px', fontWeight: 800, color: COLORS.tier1, lineHeight: 1.2 }}>
                {healthScore} <span style={{ fontSize:'16px', fontWeight: 600, opacity:0.6 }}>/ 100</span>
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#EEEEEE' }} />

          <Grid container spacing={4}>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: '14px', color: COLORS.textMuted, mb: 1, fontWeight: 500 }}>Total Assessed</Typography>
              <Typography sx={{ fontSize: '36px', fontWeight: 700, color: COLORS.textDark }}>{kpiData.total}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: '14px', color: COLORS.textMuted, mb: 1, fontWeight: 500 }}>Tier 1 (Good)</Typography>
              <Typography sx={{ fontSize: '36px', fontWeight: 700, color: COLORS.tier1 }}>
                {kpiData.t1} <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.8 }}>({kpiData.t1Pct}%)</span>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: '14px', color: COLORS.textMuted, mb: 1, fontWeight: 500 }}>Tier 2 (Monitor)</Typography>
              <Typography sx={{ fontSize: '36px', fontWeight: 700, color: COLORS.tier2 }}>
                {kpiData.t2} <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.8 }}>({kpiData.t2Pct}%)</span>
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography sx={{ fontSize: '14px', color: COLORS.textMuted, mb: 1, fontWeight: 500 }}>Tier 3 (Risk)</Typography>
              <Typography sx={{ fontSize: '36px', fontWeight: 700, color: COLORS.tier3 }}>
                {kpiData.t3} <span style={{ fontSize: '18px', fontWeight: 600, opacity: 0.8 }}>({kpiData.t3Pct}%)</span>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 🔴 GRADE-WISE BAR CHART WITH TOOLTIPS */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.textDark, mb: 5 }}>
            Grade-wise Tier Distribution
          </Typography>

          <Box sx={{ position: 'relative', height: '320px', display: 'flex', pr: 2 }}>
            {/* Y-Axis Labels & Background Grid Lines */}
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, bottom: '30px', left: 0, zIndex: 0 }}>
              {[100, 80, 60, 40, 20, 0].map(val => (
                <Box key={val} sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ fontSize: '12px', color: '#9E9E9E', width: '45px', textAlign: 'right', pr: 2, fontWeight: 500 }}>{val}%</Typography>
                  <Box sx={{ flex: 1, borderBottom: '1px dashed #E0E0E0' }} />
                </Box>
              ))}
            </Box>

            {/* Actual Stacked Bars */}
            <Box sx={{ display: 'flex', flex: 1, ml: '45px', pb: '30px', zIndex: 1, justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' }}>
              {gradeBands.length > 0 ? gradeBands.map((band, i) => {
                const t1 = band.t1Pct || 0;
                const t2 = band.t2Pct || 0;
                const t3 = band.t3Pct || 0;
                const shortBandName = band.band.replace('Grade ', 'G');

                return (
                  <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: '60px' }}>
                    <Box sx={{ width: '100%', height: 'calc(100% - 8px)', display: 'flex', flexDirection: 'column-reverse', borderRadius: '4px', overflow: 'hidden' }}>
                      
                      {/* Tier 1 Bar */}
                      <Tooltip placement="top" arrow title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>{shortBandName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, bgcolor: COLORS.tier1, borderRadius: '2px' }} />
                            <Typography sx={{ fontSize: '13px' }}>Tier 1: {t1}%</Typography>
                          </Box>
                        </Box>
                      }>
                        <Box sx={{ height: `${t1}%`, bgcolor: COLORS.tier1, transition: 'height 0.4s ease', cursor: 'pointer', '&:hover': { filter: 'brightness(1.1)' } }} />
                      </Tooltip>

                      {/* Tier 2 Bar */}
                      <Tooltip placement="top" arrow title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>{shortBandName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, bgcolor: COLORS.tier2, borderRadius: '2px' }} />
                            <Typography sx={{ fontSize: '13px' }}>Tier 2: {t2}%</Typography>
                          </Box>
                        </Box>
                      }>
                        <Box sx={{ height: `${t2}%`, bgcolor: COLORS.tier2, transition: 'height 0.4s ease', cursor: 'pointer', '&:hover': { filter: 'brightness(1.1)' } }} />
                      </Tooltip>

                      {/* Tier 3 Bar */}
                      <Tooltip placement="top" arrow title={
                        <Box sx={{ p: 0.5 }}>
                          <Typography sx={{ fontSize: '13px', fontWeight: 700, mb: 0.5 }}>{shortBandName}</Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 10, height: 10, bgcolor: COLORS.tier3, borderRadius: '2px' }} />
                            <Typography sx={{ fontSize: '13px' }}>Tier 3: {t3}%</Typography>
                          </Box>
                        </Box>
                      }>
                        <Box sx={{ height: `${t3}%`, bgcolor: COLORS.tier3, transition: 'height 0.4s ease', cursor: 'pointer', '&:hover': { filter: 'brightness(1.1)' } }} />
                      </Tooltip>

                    </Box>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: COLORS.textDark, mt: 1.5 }}>{shortBandName}</Typography>
                  </Box>
                );
              }) : (
                <Typography color="textSecondary" sx={{ alignSelf: 'center', fontWeight: 500 }}>No data available for chart</Typography>
              )}
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ display: 'flex', gap: 4, mt: 3, ml: '45px', pt: 2, borderTop: '1px solid #EEEEEE' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: COLORS.tier1, borderRadius: '4px' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: COLORS.textDark }}>Tier 1</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: COLORS.tier2, borderRadius: '4px' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: COLORS.textDark }}>Tier 2</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: COLORS.tier3, borderRadius: '4px' }} />
              <Typography sx={{ fontSize: '14px', fontWeight: 500, color: COLORS.textDark }}>Tier 3</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 🔴 GRADE-WISE SUMMARY TABLE */}
      <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.textDark, mb: 3 }}>
            Grade-wise Summary
          </Typography>
          <TableContainer sx={{ border: '1px solid #E0E0E0', borderRadius: '8px' }}>
            <Table size="medium">
              <TableHead>
                <TableRow sx={{ bgcolor: COLORS.primary }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>Grade</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>Students</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>T1 (%)</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>T2 (%)</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>T3 (%)</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>Top Risk Domain</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 600, py: 2 }}>Trend</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {gradeBands.length > 0 ? gradeBands.map((row, index) => (
                  <TableRow key={index} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell sx={{ fontWeight: 600, color: COLORS.textDark }}>{row.band}</TableCell>
                    <TableCell>{row.count}</TableCell>
                    <TableCell sx={{ color: COLORS.tier1, fontWeight: 500 }}>{row.t1Pct}%</TableCell>
                    <TableCell sx={{ color: COLORS.tier2, fontWeight: 500 }}>{row.t2Pct}%</TableCell>
                    <TableCell sx={{ fontWeight: row.t3Pct > 50 ? 700 : 500, color: row.t3Pct > 50 ? COLORS.tier3 : 'inherit' }}>
                      {row.t3Pct}%
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textMuted }}>{row.topRiskDomain}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: row.trend === 'down' ? COLORS.tier3 : COLORS.tier1 }}>
                      {row.trend === 'down' ? '▼ Worsening' : '▲ Improving'}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3, color: COLORS.textMuted }}>No grade data found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {kpiData.t3Pct > 20 && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#FFEBEE', color: '#C62828', borderRadius: '8px', fontSize: '14px', border: '1px solid #FFCDD2', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography fontWeight={700}>SLT Alert:</Typography> 
              <Typography>Overall High Support (Tier 3) is at <strong>{kpiData.t3Pct}%</strong>. Recommend school-wide review before next term.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* 🔴 COMPLETION RATE */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={6}>
          <Card elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E0E0E0', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)', height: '100%' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLORS.textDark, mb: 4 }}>
                Completion Rate by Grade
              </Typography>
              
              {completionData.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {completionData.map((item, idx) => (
                    <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Typography sx={{ fontSize: '14px', fontWeight: 600, color: COLORS.textDark, width: '100px' }}>
                        {item.label}
                      </Typography>
                      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={item.value} 
                          sx={{ 
                            flex: 1, 
                            height: 10, 
                            borderRadius: 5, 
                            bgcolor: '#E0E0E0',
                            // Fallback to theme primary color if item.color is not specified
                            '& .MuiLinearProgress-bar': { bgcolor: item.color || COLORS.primary, borderRadius: 5 }
                          }} 
                        />
                        <Typography sx={{ fontSize: '14px', fontWeight: 700, color: COLORS.textDark, minWidth: '45px', textAlign: 'right' }}>
                          {item.value}%
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography color="textSecondary" sx={{ fontStyle: 'italic', fontSize: '14px', py: 2 }}>
                  No completion data available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

    </Box>
  );
};

export default SchoolDashboardReport;