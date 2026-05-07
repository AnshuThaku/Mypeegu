import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Grid, CircularProgress, Autocomplete, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

// Utility & Thunks
import { getAllSchools } from '../../academic/school/schoolSlice'; 
import { viewAllClassrooms } from '../../academic/classrooms/classroomsSlice';

// Reports
import SchoolCounselorReport from './SchoolCounselorReport';
import SchoolDashboardReport from './SchoolDashboardReport';
import DomainRiskReport from './DomainRiskReport'; 
import ClassroomReport from './ClassroomReport';
import GenderSectionReport from './GenderSectionReport'; 
import BackendCounselorReport from './BackendCounselorReport'; 

const SelfAssessmentDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(5); 

  const { academicYears } = useSelector((store) => store.dashboardSliceSetup || {});
  
  // 🟢 State for Selected Filters
  const [selectedSchool, setSelectedSchool] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedPhase, setSelectedPhase] = useState('all');

  const [schoolsList, setSchoolsList] = useState([]);
  const [classroomsList, setClassroomsList] = useState([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // 🟢 Fetch All Schools on Mount
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoadingFilters(true);
        const body = {
          filter: { status: "Active", byDate: 0, startDate: null, endDate: null },
          searchText: "", page: 1, pageSize: 150, sortKeys: [{ key: "school", value: 1 }]
        };
        const res = await dispatch(getAllSchools({ body }));
        if (res?.payload?.data) {
          const list = Array.isArray(res.payload.data) ? res.payload.data : res.payload.data.list || [];
          setSchoolsList(list);
        }
      } catch (error) { 
        console.error("Schools fetch failed", error); 
      } finally { 
        setIsLoadingFilters(false); 
      }
    };
    fetchSchools();
  }, [dispatch]);

  // 🟢 Fetch Classrooms ONLY when School & Year are selected
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (selectedSchool !== 'all' && selectedYear !== 'all') {
        try {
          const body = {
            filter: { academicYear: [selectedYear], schoolIds: [selectedSchool], classroomIds: [], section: [] },
            searchText: "", page: 1, pageSize: 150
          };
          const res = await dispatch(viewAllClassrooms({ body }));
          if (res?.payload?.data) {
            const list = Array.isArray(res.payload.data) ? res.payload.data : res.payload.data.list || [];
            setClassroomsList(list);
          }
        } catch (error) { 
          console.error("Classrooms fetch failed", error); 
        }
      } else {
        // Agar school ya year 'all' ho gaya, toh class list empty kar do
        setClassroomsList([]);
      }
    };
    fetchClassrooms();
  }, [selectedSchool, selectedYear, dispatch]);

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  // 🟢 Options for Autocomplete Dropdowns
  const schoolOptions = [{ label: 'All Schools', value: 'all' }, ...schoolsList.map(s => ({ label: s.school, value: s._id }))];
  const yearOptions = [{ label: 'All Academic Years', value: 'all' }, ...(academicYears || []).map(y => ({ label: y.academicYear, value: y._id }))];
  const classOptions = [{ label: 'All Classes', value: 'all' }, ...classroomsList.map(c => ({ label: `${c.className} ${c.section ? `- ${c.section}` : ''}`, value: c._id }))];
  const phaseOptions = [
    { label: 'All Phases', value: 'all' },
    { label: 'Baseline 1', value: 'Baseline 1' },
    { label: 'Baseline 2', value: 'Baseline 2' },
    { label: 'Baseline 3', value: 'Baseline 3' }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* HEADER SECTION */}
      <Box sx={{ bgcolor: '#1A5276', color: '#fff', p: 2, borderRadius: '10px', mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography sx={{ fontSize: '20px', fontWeight: 600 }}>MyPeegu</Typography>
          <Typography sx={{ fontSize: '13px', opacity: 0.85 }}>Baseline Assessment Dashboard — v2</Typography>
        </Box>
        <Typography sx={{ fontSize: '12px', opacity: 0.8, bgcolor: 'rgba(255,255,255,0.1)', px: 2, py: 0.5, borderRadius: '20px' }}>
          {selectedPhase === 'all' ? 'All Phases Selected' : selectedPhase}
        </Typography>
      </Box>

      {/* 🟢 SEARCHABLE FILTER BAR */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: '10px', border: '1px solid #e0e0e0' }}>
        <Grid container spacing={2}>
          {/* School Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              options={schoolOptions}
              value={schoolOptions.find(o => o.value === selectedSchool) || schoolOptions[0]}
              onChange={(e, newValue) => { 
                setSelectedSchool(newValue ? newValue.value : 'all'); 
                // Reset dependent filters
                setSelectedYear('all');
                setSelectedClass('all'); 
              }}
              renderInput={(params) => <TextField {...params} label="Select School" />}
              disableClearable
              loading={isLoadingFilters}
            />
          </Grid>
          
          {/* Academic Year Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              options={yearOptions}
              value={yearOptions.find(o => o.value === selectedYear) || yearOptions[0]}
              onChange={(e, newValue) => {
                setSelectedYear(newValue ? newValue.value : 'all');
                // Reset dependent filter
                setSelectedClass('all');
              }}
              renderInput={(params) => <TextField {...params} label="Academic Year" />}
              disableClearable
              disabled={selectedSchool === 'all'} // Disable if no school is selected
            />
          </Grid>

          {/* Classroom Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              options={classOptions}
              value={classOptions.find(o => o.value === selectedClass) || classOptions[0]}
              onChange={(e, newValue) => setSelectedClass(newValue ? newValue.value : 'all')}
              renderInput={(params) => <TextField {...params} label="Classroom" />}
              disableClearable
              disabled={selectedSchool === 'all' || selectedYear === 'all'} // Disable if school or year is 'all'
            />
          </Grid>

          {/* Assessment Phase Dropdown */}
          <Grid item xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              options={phaseOptions}
              value={phaseOptions.find(o => o.value === selectedPhase) || phaseOptions[0]}
              onChange={(e, newValue) => setSelectedPhase(newValue ? newValue.value : 'all')}
              renderInput={(params) => <TextField {...params} label="Assessment Phase" />}
              disableClearable
            />
          </Grid>
        </Grid>
      </Paper>

      {/* TABS SECTION */}
      <Paper elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" sx={{ '& .Mui-selected': { color: '#1A5276 !important' }, '& .MuiTabs-indicator': { backgroundColor: '#1A5276' } }}>
          <Tab label="1. School Counsellor" />
          <Tab label="2. Backend Counsellor" />
          <Tab label="3. Classroom Report" />
          <Tab label="4. Gender & Section" />
          <Tab label="5. Domain & Risk" />
          <Tab label="6. School Dashboard" />
        </Tabs>
      </Paper>

      {/* REPORTS RENDERING */}
      <Box sx={{ mt: 2 }}>
        {activeTab === 5 && <SchoolDashboardReport selectedSchool={selectedSchool} selectedYear={selectedYear} selectedPhase={selectedPhase} />}
        {activeTab === 4 && <DomainRiskReport selectedSchool={selectedSchool} selectedYear={selectedYear} selectedPhase={selectedPhase} />}
        {activeTab === 3 && <GenderSectionReport selectedSchool={selectedSchool} selectedYear={selectedYear} selectedPhase={selectedPhase} />}
        {activeTab === 2 && <ClassroomReport selectedSchool={selectedSchool} selectedYear={selectedYear} selectedPhase={selectedPhase} selectedClass={selectedClass} />}
        {activeTab === 1 && <BackendCounselorReport selectedSchool={selectedSchool} selectedYear={selectedYear} selectedPhase={selectedPhase} selectedClass={selectedClass} />}
        {activeTab === 0 && <SchoolCounselorReport selectedSchool={selectedSchool} selectedYear={selectedYear} selectedPhase={selectedPhase} selectedClass={selectedClass} />}

        {![0, 1, 2, 3, 4, 5].includes(activeTab) && (
          <Paper sx={{ p: 4, textAlign: 'center', color: '#666', borderRadius: '12px', border: '1px dashed #ccc' }}>
            <Typography variant="h6">Coming Soon 🚀</Typography>
            <Typography variant="body2">We Are Working on it.....</Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default SelfAssessmentDashboard;