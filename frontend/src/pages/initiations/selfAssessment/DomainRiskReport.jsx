import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Paper, Grid, CircularProgress, Button, ButtonGroup, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Tooltip } from '@mui/material';
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk';

const COLORS = {
  risk: '#E67E22',      // Orange
  protective: '#1E8449',  // Green
  critical: '#C0392B',    // Dark Red
  concern: '#F1948A',     // Light Red
  monitor: '#F7DC6F',     // Yellow
  strength: '#ABEBC6',    // Light Green
  primary: '#1A5276'      // Deep Blue
};

// Heatmap Color Logic
const getHeatmapColor = (score) => {
  if (score >= 4.3) return COLORS.critical;
  if (score >= 3.6) return COLORS.concern;
  if (score >= 2.6) return COLORS.monitor;
  return COLORS.strength;
};

const DomainRiskReport = ({ selectedSchool, selectedYear, selectedPhase }) => {
  const [viewAs, setViewAs] = useState('counselor');
  const dispatch = useDispatch();
  const baselineState = useSelector((state) => state.baselineAnalytics || {});

  const domainData = baselineState?.schoolData?.domainAnalysis || {
    riskPredictors: [],
    protectiveFactors: [],
    chartData: [],
    heatmap: []
  };

  useEffect(() => {
    if (selectedSchool && selectedYear) {
      dispatch(fetchSchoolWideBaseline({
        schoolId: selectedSchool,
        academicYearId: selectedYear,
        baselineCategory: selectedPhase === 'all' ? 'Baseline 1' : selectedPhase
      }));
    }
  }, [selectedSchool, selectedYear, selectedPhase, dispatch]);

  if (baselineState.isSchoolLoading || baselineState.isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress sx={{ color: COLORS.primary }} />
      </Box>
    );
  }

  // Extract all unique section names for table headers
  const sectionNames = [...new Set(domainData.heatmap?.flatMap(h => h.sections.map(s => s.name)))].sort();

  return (
    <Box className="fade-in" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* 🔵 TOP HEADER & VIEW TOGGLE */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1C2833' }}>Domain & risk analysis</Typography>
          <Typography variant="caption" color="textSecondary">
            {selectedPhase === 'all' ? 'All Phases' : selectedPhase} • April 2026
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>View as:</Typography>
          <ButtonGroup size="small" variant="outlined">
            <Button 
              onClick={() => setViewAs('counselor')}
              sx={{ 
                bgcolor: viewAs === 'counselor' ? COLORS.primary : 'transparent', 
                color: viewAs === 'counselor' ? '#fff' : COLORS.primary,
                borderColor: COLORS.primary,
                '&:hover': { bgcolor: viewAs === 'counselor' ? COLORS.primary : 'rgba(26, 82, 118, 0.04)', borderColor: COLORS.primary }
              }}
            >School counsellor</Button>
            <Button 
              onClick={() => setViewAs('backend')}
              sx={{ 
                bgcolor: viewAs === 'backend' ? COLORS.primary : 'transparent', 
                color: viewAs === 'backend' ? '#fff' : COLORS.primary,
                borderColor: COLORS.primary,
                '&:hover': { bgcolor: viewAs === 'backend' ? COLORS.primary : 'rgba(26, 82, 118, 0.04)', borderColor: COLORS.primary }
              }}
            >Backend counsellor</Button>
          </ButtonGroup>
        </Box>
      </Box>

      {/* 🔴 HEATMAP (Only for Backend View) */}
      {viewAs === 'backend' && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>Domain risk heatmap — all sections</Typography>
            <Chip label="Backend only" size="small" sx={{ fontSize: '10px', height: '18px', bgcolor: '#E8F6F3', color: '#16A085' }} />
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: '12px' }}>Domain</TableCell>
                  {sectionNames.map(name => (
                    <TableCell key={name} align="center" sx={{ fontWeight: 600, fontSize: '12px' }}>{name}</TableCell>
                  ))}
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '12px', bgcolor: '#f9f9f9' }}>Avg</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domainData.heatmap?.map((row) => (
                  <TableRow key={row.domain}>
                    <TableCell sx={{ fontSize: '12px', color: '#555' }}>{row.domain}</TableCell>
                    {sectionNames.map(name => {
                      const sectionScore = row.sections.find(s => s.name === name)?.score || 0;
                      return (
                        <TableCell key={name} align="center">
                          <Box sx={{ 
                            width: '40px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '4px', bgcolor: getHeatmapColor(sectionScore),
                            fontSize: '11px', fontWeight: 700, color: sectionScore >= 4.3 ? '#fff' : '#333', m: 'auto'
                          }}>
                            {sectionScore}
                          </Box>
                        </TableCell>
                      );
                    })}
                    <TableCell align="center" sx={{ bgcolor: '#f9f9f9' }}>
                      <Box sx={{ 
                        width: '40px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '4px', bgcolor: getHeatmapColor(row.avg),
                        fontSize: '11px', fontWeight: 700, m: 'auto', opacity: 0.8
                      }}>
                        {row.avg}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: COLORS.strength, borderRadius: '2px' }} />
              <Typography sx={{ fontSize: '11px' }}>1.0-2.5 Strength</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: COLORS.monitor, borderRadius: '2px' }} />
              <Typography sx={{ fontSize: '11px' }}>2.6-3.5 Monitor</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: COLORS.concern, borderRadius: '2px' }} />
              <Typography sx={{ fontSize: '11px' }}>3.6-4.2 Concern</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, bgcolor: COLORS.critical, borderRadius: '2px' }} />
              <Typography sx={{ fontSize: '11px', color: COLORS.critical, fontWeight: 700 }}>4.3+ Critical</Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* 🔵 RISK PREDICTORS & PROTECTIVE FACTORS */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee' }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 600, mb: 2 }}>Top risk predictors</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {domainData.riskPredictors.length > 0 ? domainData.riskPredictors.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '14px', color: '#555' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#E53935' }}>{item.value}%</Typography>
                </Box>
              )) : <Typography color="textSecondary" variant="caption">No risk data available.</Typography>}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee' }}>
            <Typography sx={{ fontSize: '15px', fontWeight: 600, mb: 2 }}>Top protective factors</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {domainData.protectiveFactors.length > 0 ? domainData.protectiveFactors.map((item, i) => (
                <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '14px', color: '#555' }}>{item.label}</Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: COLORS.protective }}>{item.value}%</Typography>
                </Box>
              )) : <Typography color="textSecondary" variant="caption">No protective data available.</Typography>}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 🔵 CHART: RISK vs PROTECTIVE BALANCE */}
      {/* 🔵 CHART: RISK vs PROTECTIVE BALANCE */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee' }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, mb: 4 }}>Risk vs protective balance — domain view</Typography>
        
        <Box sx={{ height: '320px', display: 'flex', position: 'relative' }}>
          {/* Y-Axis Grid Lines (Background mein rahengi) */}
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', pb: '40px', position: 'absolute', left: 0, width: '100%', zIndex: 0 }}>
            {[5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5, 0].map(val => (
              <Box key={val} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '11px', color: '#999', width: '30px' }}>{val.toFixed(1)}</Typography>
                <Box sx={{ flex: 1, borderBottom: '1px solid #f5f5f5' }} />
              </Box>
            ))}
          </Box>

          {/* Actual Grouped Bars (Z-index 1 taaki lines ke upar dikhen) */}
          <Box sx={{ display: 'flex', flex: 1, ml: '40px', height: '100%', alignItems: 'flex-end', justifyContent: 'space-around', zIndex: 1, pb: '40px' }}>
            {domainData.chartData.length > 0 ? domainData.chartData.map((domain, i) => (
              <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '120px' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '280px' }}>
                  
                  {/* 🟠 Risk Bar (Orange) with Black Tooltip */}
                  <Tooltip 
                    placement="top" 
                    arrow 
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>{domain.label}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, bgcolor: COLORS.risk, border: '1px solid #fff' }} />
                          <Typography sx={{ fontSize: '12px' }}>Risk: {domain.risk}</Typography>
                        </Box>
                      </Box>
                    }
                    componentsProps={{
                      tooltip: { sx: { bgcolor: '#1C1C1C', color: '#fff', borderRadius: '6px', p: 1 } },
                      arrow: { sx: { color: '#1C1C1C' } }
                    }}
                  >
                    <Box sx={{ 
                      width: '45px', 
                      bgcolor: COLORS.risk, 
                      height: `${(domain.risk / 5) * 100}%`, 
                      borderRadius: '2px 2px 0 0',
                      transition: 'height 0.5s ease',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.9 }
                    }} />
                  </Tooltip>

                  {/* 🟢 Protective Bar (Green) with Black Tooltip */}
                  <Tooltip 
                    placement="top" 
                    arrow 
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 600, mb: 0.5 }}>{domain.label}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 10, height: 10, bgcolor: COLORS.protective, border: '1px solid #fff' }} />
                          <Typography sx={{ fontSize: '12px' }}>Protective: {domain.protective}</Typography>
                        </Box>
                      </Box>
                    }
                    componentsProps={{
                      tooltip: { sx: { bgcolor: '#1C1C1C', color: '#fff', borderRadius: '6px', p: 1 } },
                      arrow: { sx: { color: '#1C1C1C' } }
                    }}
                  >
                    <Box sx={{ 
                      width: '45px', 
                      bgcolor: COLORS.protective, 
                      height: `${(domain.protective / 5) * 100}%`, 
                      borderRadius: '2px 2px 0 0',
                      transition: 'height 0.5s ease',
                      cursor: 'pointer',
                      '&:hover': { opacity: 0.9 }
                    }} />
                  </Tooltip>

                </Box>
                {/* Domain Label at bottom */}
                <Typography sx={{ fontSize: '12px', mt: 1.5, color: '#555', fontWeight: 600, textAlign: 'center' }}>{domain.label}</Typography>
              </Box>
            )) : <Typography color="textSecondary">No chart data found.</Typography>}
          </Box>
        </Box>

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2, ml: '40px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, bgcolor: COLORS.risk, borderRadius: '3px' }} />
            <Typography sx={{ fontSize: '12px', color: '#333' }}>Risk score</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 14, height: 14, bgcolor: COLORS.protective, borderRadius: '3px' }} />
            <Typography sx={{ fontSize: '12px', color: '#333' }}>Protective score</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DomainRiskReport;