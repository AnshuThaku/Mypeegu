import { createAsyncThunk } from '@reduxjs/toolkit';

// 🟢 GET SCHOOL WIDE BASELINE ANALYTICS (Master API for all tabs)
export const fetchSchoolWideBaseline = createAsyncThunk(
  'baselineAnalytics/fetchSchoolWide',
  // 👇 1. classRoomId yahan destructure kiya
  async ({ schoolId, academicYearId, baselineCategory, classRoomId }, { rejectWithValue }) => {
    try {
      // 👇 2. Dynamic URL banaya
      let url = `${process.env.REACT_APP_BASE_URL}/counselor/v1/self-assessment/school?schoolId=${schoolId}&academicYearId=${academicYearId}`;
      
      if (baselineCategory) {
        url += `&baselineCategory=${baselineCategory}`;
      }
      
      // 🟢 3. YE LINE ZAROORI HAI: Agar classroom selected hai, toh URL mein add karo
      if (classRoomId) {
        url += `&classRoomId=${classRoomId}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch school analytics');
      
      return data.data; // Yeh aapke backend se aaya hua formatted data hoga
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🟢 GET CLASSROOM SPECIFIC ANALYTICS (Older individual API - Optional if using Master API)
export const fetchClassroomBaseline = createAsyncThunk(
  'baselineAnalytics/fetchClassroom',
  async ({ classRoomId, baselineCategory }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/counselor/v1/self-assessment/classroom?classRoomId=${classRoomId}&baselineCategory=${baselineCategory}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch classroom analytics');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// 🟢 GET INDIVIDUAL STUDENT CLINICAL DATA (Older individual API - Optional if using Master API)
export const fetchStudentClinicalData = createAsyncThunk(
  'baselineAnalytics/fetchStudentClinical',
  async ({ studentId, baselineCategory }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/counselor/v1/self-assessment/student?studentId=${studentId}&baselineCategory=${baselineCategory}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch student data');
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);