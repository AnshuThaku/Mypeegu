import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Paper, Grid, CircularProgress, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Tooltip 
} from '@mui/material';
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk';

const COLORS = {
  girls: '#1F4E79', boys: '#388E75', other: '#7D3C98',
  tableHeader: '#1A5276', tier3: '#E53935'
};

const GenderSectionReport = ({ selectedSchool, selectedYear, selectedPhase }) => {
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

  const rawData = baselineState?.schoolData || {};
  const domainAnalysis = rawData.domainAnalysis?.chartData || []; 
  const sectionTableData = rawData.sectionDistribution || [];

  if (baselineState.isSchoolLoading || baselineState.isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>Gender & section comparison</Typography>

      {/* Grouped Bar Chart */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee' }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, mb: 4 }}>Gender-wise domain risk</Typography>
        <Box sx={{ height: '320px', display: 'flex', position: 'relative' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', pb: '40px', position: 'absolute', width: '100%', zIndex: 0 }}>
            {[5.0, 4.0, 3.0, 2.0, 1.0, 0].map(val => (
              <Box key={val} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '10px', color: '#999', width: '30px' }}>{val.toFixed(1)}</Typography>
                <Box sx={{ flex: 1, borderBottom: '1px solid #f0f0f0' }} />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flex: 1, ml: '40px', height: '100%', alignItems: 'flex-end', justifyContent: 'space-around', zIndex: 1, pb: '40px' }}>
            {domainAnalysis.map((domain, i) => {
              const girl = domain.genders?.find(g => g.gender === 'Female')?.score || 0;
              const boy = domain.genders?.find(g => g.gender === 'Male')?.score || 0;
              return (
                <Box key={i} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '240px' }}>
                    <Tooltip arrow title={`Girls: ${girl}`} componentsProps={{ tooltip: { sx: { bgcolor: '#1C1C1C' } } }}>
                      <Box sx={{ width: '40px', bgcolor: COLORS.girls, height: `${(girl / 5) * 100}%`, borderRadius: '2px 2px 0 0' }} />
                    </Tooltip>
                    <Tooltip arrow title={`Boys: ${boy}`} componentsProps={{ tooltip: { sx: { bgcolor: '#1C1C1C' } } }}>
                      <Box sx={{ width: '40px', bgcolor: COLORS.boys, height: `${(boy / 5) * 100}%`, borderRadius: '2px 2px 0 0' }} />
                    </Tooltip>
                  </Box>
                  <Typography sx={{ fontSize: '10px', mt: 1.5, fontWeight: 600 }}>{domain.label}</Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>

      {/* Table Section */}
     {/* 🔵 SECTION-WISE TIER DISTRIBUTION TABLE */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee', mt: 3 }}>
        <Typography sx={{ fontSize: '15px', fontWeight: 600, mb: 2 }}>Section-wise tier distribution</Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.tableHeader }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, py: 1.5 }}>Section</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Students</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tier 1</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tier 2</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Tier 3</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Top flag</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sectionTableData.length > 0 ? sectionTableData.map((row, idx) => {
                const t1Pct = Math.round((row.t1 / row.total) * 100) || 0;
                const t2Pct = Math.round((row.t2 / row.total) * 100) || 0;
                const t3Pct = Math.round((row.t3 / row.total) * 100) || 0;

                // 🎯 Logic for Top Flag based on Tier 3
                let topFlag = "Stable";
                if (t3Pct > 20) topFlag = "Distress + impulsivity";
                else if (t3Pct > 15) topFlag = "Help-seeking risk";
                else if (t3Pct > 10) topFlag = "Internal distress";
                else topFlag = "Execution gap";

                return (
                  <TableRow key={idx} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                    <TableCell sx={{ fontWeight: 600, py: 1.5 }}>{row._id}</TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{t1Pct}%</TableCell>
                    <TableCell>{t2Pct}%</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: t3Pct > 15 ? COLORS.tier3 : 'inherit' }}>
                      {t3Pct}%
                    </TableCell>
                    <TableCell sx={{ fontSize: '13px', color: '#555' }}>{topFlag}</TableCell>
                    <TableCell>
                      {/* 🎯 Trend Icons logic */}
                      {t3Pct > 18 ? (
                        <Typography sx={{ color: '#C0392B', fontWeight: 900, fontSize: '18px' }}>▼</Typography>
                      ) : t3Pct > 12 ? (
                        <Typography sx={{ color: '#D35400', fontWeight: 900, fontSize: '18px' }}>—</Typography>
                      ) : (
                        <Typography sx={{ color: '#27AE60', fontWeight: 900, fontSize: '18px' }}>▲</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              }) : (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 3 }}>No section data available</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 🔴 Alert Box (Design ke hisaab se) */}
        {sectionTableData.some(row => (row.t3 / row.total) > 0.18) && (
          <Box sx={{ mt: 2, p: 1.5, bgcolor: '#FDEDEC', color: '#C0392B', borderRadius: '6px', fontSize: '13px', border: '1px solid #FADBD8' }}>
            <strong>Alert:</strong> Some sections are showing worsening trends — Tier 3 is up. Coordinator review recommended.
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GenderSectionReport;