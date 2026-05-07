import { createSlice } from '@reduxjs/toolkit';
import { fetchSchoolWideBaseline } from './baselineAnalyticsThunk'; // Make sure path is correct

const initialState = {
  schoolData: null,          // API ka data yahan aake save hoga
  isSchoolLoading: false,    // Loader dikhane ke liye
  error: null,
};

const baselineAnalyticsSlice = createSlice({
  name: 'baselineAnalytics',
  initialState,
  reducers: {
    // Agar future mein data clear karna ho
    clearBaselineData: (state) => {
      state.schoolData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 1. Jab API call shuru ho (Loading State)
      .addCase(fetchSchoolWideBaseline.pending, (state) => {
        state.isSchoolLoading = true;
        state.error = null;
      })
      // 2. Jab API successful ho jaye (Success State)
      .addCase(fetchSchoolWideBaseline.fulfilled, (state, action) => {
        state.isSchoolLoading = false;
        // 🔥 THE MAGIC LINE: Backend ka data 'schoolData' mein save ho gaya!
        state.schoolData = action.payload; 
      })
      // 3. Jab API fail ho jaye (Error State)
      .addCase(fetchSchoolWideBaseline.rejected, (state, action) => {
        state.isSchoolLoading = false;
        state.error = action.payload || 'Failed to fetch baseline data';
      });
  },
});

export const { clearBaselineData } = baselineAnalyticsSlice.actions;
export default baselineAnalyticsSlice.reducer;