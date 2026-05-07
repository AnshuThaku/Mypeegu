import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, Typography, Paper, Grid, Avatar, Chip, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress 
} from '@mui/material';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
// 🟢 API fetch function import karna zaroori hai
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk'; 

const COLORS = {
  primary: '#1A5276',
  t1: { text: '#1E8449', bg: '#D5F5E3' },
  t2: { text: '#E67E22', bg: '#FDEBD0' },
  t3: { text: '#C0392B', bg: '#FADBD8' },
  aiBox: { bg: '#F4FAFF', border: '#B5D5EE' },
  strengthBox: { bg: '#F4FCF7', border: '#A9DFBF' },
  redBox: { bg: '#FDEDEC', border: '#F5B7B1' }
};

// 🟢 Props receive karna zaroori hai
const BackendCounselorReport = ({ selectedSchool, selectedYear, selectedPhase, selectedClass }) => {
  const dispatch = useDispatch();
  const baselineState = useSelector((state) => state.baselineAnalytics || {});
  
  // 🟢 YAHAN API HIT HOGI JAISE HI FILTERS CHANGE HONGE
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

  // Extract dynamic students list from API response
  const MOCK_STUDENTS = baselineState?.schoolData?.studentsList || [];
  
  const [selectedId, setSelectedId] = useState(null);

  // Auto-select the first student when data loads
  useEffect(() => {
    if (MOCK_STUDENTS.length > 0) {
      // Agar purana selected ID abhi ki list mein nahi hai, toh pehla student select karo
      const exists = MOCK_STUDENTS.find(s => s.id === selectedId);
      if (!exists) {
        setSelectedId(MOCK_STUDENTS[0].id);
      }
    }
  }, [MOCK_STUDENTS, selectedId]);

  // 🟢 LOADING STATE
  if (baselineState.isSchoolLoading || baselineState.isLoading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress sx={{ color: COLORS.primary }} /></Box>;
  }

  // 🟢 EMPTY STATE
  if (MOCK_STUDENTS.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', color: '#666', borderRadius: '12px', border: '1px dashed #ccc' }}>
        <Typography variant="h6">No Student Data Found</Typography>
        <Typography variant="body2">Please select a valid Academic Year and Classroom from the filters above.</Typography>
      </Paper>
    );
  }

  // Get currently selected student's data
  const data = MOCK_STUDENTS.find(s => s.id === selectedId) || MOCK_STUDENTS[0];

  return (
    <Box className="fade-in" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      
      {/* 🔵 HEADER */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1C2833' }}>Backend counsellor — individual student view</Typography>
          <Typography variant="caption" color="textSecondary">Full clinical access • {selectedPhase === 'all' ? 'All Phases' : selectedPhase}</Typography>
        </Box>
        <Chip label="Backend access — full data" size="small" sx={{ bgcolor: '#E8F6F3', color: '#16A085', fontWeight: 600, border: '1px solid #A3E4D7' }} />
      </Box>

      {/* 🔵 STUDENT SELECTOR */}
      <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', border: '1px solid #eee' }}>
        <Typography sx={{ fontSize: '13px', fontWeight: 600, mb: 1.5 }}>Select student ({MOCK_STUDENTS.length} found)</Typography>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1, '&::-webkit-scrollbar': { height: '6px' }, '&::-webkit-scrollbar-thumb': { bgcolor: '#ccc', borderRadius: '4px' } }}>
          {MOCK_STUDENTS.map(stu => {
            const isSelected = stu.id === selectedId;
            return (
              <Box 
                key={stu.id} onClick={() => setSelectedId(stu.id)}
                sx={{ 
                  display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, minWidth: '200px', cursor: 'pointer', flexShrink: 0,
                  borderRadius: '8px', border: isSelected ? `1px solid ${COLORS.primary}` : '1px solid #eee',
                  bgcolor: isSelected ? '#F4FAFF' : '#fff', transition: 'all 0.2s'
                }}
              >
                <Avatar sx={{ bgcolor: isSelected ? '#fff' : stu.tierColor.bg, color: isSelected ? COLORS.primary : stu.tierColor.text, width: 36, height: 36, fontSize: '14px', fontWeight: 600, border: isSelected ? `1px solid ${COLORS.primary}` : 'none' }}>
                  {stu.initials}
                </Avatar>
                <Box>
                  <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1C2833' }}>{stu.name}</Typography>
                  <Chip label={stu.tier} size="small" sx={{ height: '18px', fontSize: '10px', bgcolor: stu.tierColor.bg, color: stu.tierColor.text, fontWeight: 700, mt: 0.5 }} />
                </Box>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* 🔵 STUDENT PROFILE HEADER & KPIs */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: '12px', border: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#F4FAFF', color: COLORS.primary, border: `1px solid ${COLORS.primary}`, width: 48, height: 48, fontSize: '18px', fontWeight: 600 }}>{data.initials}</Avatar>
            <Box>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#1C2833' }}>{data.name}</Typography>
              <Typography sx={{ fontSize: '12px', color: '#666' }}>ID: {data.id.slice(-6)} • {selectedPhase}</Typography>
            </Box>
          </Box>
          <Chip label={data.tierLabel} sx={{ bgcolor: data.tierColor.bg, color: data.tierColor.text, fontWeight: 700, borderRadius: '6px' }} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '12px', color: '#666' }}>Overall risk</Typography>
            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: COLORS.t2.text }}>{data.kpi.risk}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '12px', color: '#666' }}>Protective score</Typography>
            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: COLORS.t1.text }}>{data.kpi.protective}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '12px', color: '#666' }}>Adjusted risk</Typography>
            <Typography sx={{ fontSize: '24px', fontWeight: 700, color: COLORS.t2.text }}>{data.kpi.adjusted}</Typography>
          </Grid>
          <Grid item xs={3}>
            <Typography sx={{ fontSize: '12px', color: '#666' }}>Trend Indicator</Typography>
            <Typography sx={{ fontSize: '20px', fontWeight: 600, color: COLORS.t2.text }}>{data.kpi.trend}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* 🔵 DOMAIN BREAKDOWN TABLE */}
      <Paper elevation={0} sx={{ borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 600 }}>Domain breakdown — full clinical view</Typography>
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: COLORS.primary }}>
                <TableCell sx={{ color: '#fff', fontWeight: 600, py: 1.5 }}>Domain</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Risk</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Protective</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Adjusted</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Band</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 600 }}>Trend</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.domains.map((dom, idx) => (
                <TableRow key={idx} sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                  <TableCell sx={{ fontWeight: 500, py: 1.5 }}>{dom.name}</TableCell>
                  <TableCell>{dom.risk}</TableCell>
                  <TableCell>{dom.protective}</TableCell>
                  <TableCell>{dom.adjusted}</TableCell>
                  <TableCell>
                    <Chip label={dom.band} size="small" sx={{ bgcolor: dom.bandColor.bg, color: dom.bandColor.text, fontWeight: 600, height: '20px', fontSize: '11px' }} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ color: dom.trendColor, fontWeight: 900, fontSize: '16px' }}>{dom.trend}</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 🔵 FLAGS & COMPARISON ROW */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #eee', height: '100%' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 2 }}>Active flags generated</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {data.flags.map((flag, idx) => (
                <Chip key={idx} label={flag.label} size="small" sx={{ bgcolor: flag.color.bg, color: flag.color.text, fontWeight: 600, borderRadius: '6px' }} />
              ))}
            </Box>
            
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', border: '1px solid #eee', height: '100%' }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 2 }}>Parent vs student comparison</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {data.comparisons && data.comparisons.map((comp, idx) => (
                <Box key={idx} sx={{ p: 2, bgcolor: comp.color.bg, borderRadius: '8px', border: `1px solid ${comp.type === 'risk' ? '#F5B7B1' : '#A9DFBF'}` }}>
                  <Typography sx={{ fontSize: '13px', fontWeight: 700, color: comp.color.text, mb: 0.5 }}>{comp.title}</Typography>
                  <Typography sx={{ fontSize: '12px', color: '#333' }}>{comp.desc1}</Typography>
                  <Typography sx={{ fontSize: '12px', color: comp.type === 'risk' ? COLORS.t3.text : COLORS.t1.text, fontWeight: 600, mt: 0.5 }}>{comp.desc2}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* 🔵 STRENGTH CLUSTERS */}
      {data.strengthClusters && data.strengthClusters.length > 0 && (
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '12px', bgcolor: COLORS.strengthBox.bg, border: `1px solid ${COLORS.strengthBox.border}` }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 700, color: COLORS.t1.text, display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            ⭐ Strength clusters — how to leverage in sessions
          </Typography>
          <Grid container spacing={4}>
            {data.strengthClusters.map((str, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <Chip label={str.label} size="small" sx={{ bgcolor: COLORS.t1.bg, color: COLORS.t1.text, fontWeight: 600, borderRadius: '6px', mb: 1 }} />
                <Typography sx={{ fontSize: '13px', color: '#444', lineHeight: 1.6 }}>{str.desc}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

    </Box>
  );
};

export default BackendCounselorReport;