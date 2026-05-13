import { createAsyncThunk } from '@reduxjs/toolkit';
import myPeeguAxios from '../../../../utils/myPeeguAxios';

export const fetchStudent360Data = createAsyncThunk(
    'iep360/fetchStudent360Data',
    async ({ studentId, academicYear }, { rejectWithValue }) => {
        try {
            const response = await myPeeguAxios.post('/resources/v1/iep-student-360', 
                { studentId, academicYear },
                { headers: { hideLoader: true, showLoader: false } } // 🟢 NAYA: Global loader roko
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const uploadIEPEvaluationPDF = createAsyncThunk(
    'iep360/uploadIEPEvaluationPDF',
    async ({ studentId, formData }, { rejectWithValue }) => {
        try {
            const response = await myPeeguAxios.post(`/resources/v1/iep-ai-evaluate/${studentId}`, formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'hideLoader': true, // 🟢 NAYA: Global loader roko
                    'showLoader': false
                },
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const generateIEPWithAI = createAsyncThunk(
    'iep360/generateAI',
    async ({ studentId }, { rejectWithValue }) => {
        try {
            const response = await myPeeguAxios.post('/resources/v1/generate-iep-ai', 
                { studentId },
                { headers: { hideLoader: true, showLoader: false } } // 🟢 NAYA: Global loader roko
            );
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data || "Generation failed");
        }
    }
);

// Save wale me loader dikhne do, wo background process nahi hai
export const saveIEPData = createAsyncThunk(
    'iep360/saveIEPData',
    async (payload, { rejectWithValue }) => {
        try {
            const { studentId, ...dataToSave } = payload;
            const response = await myPeeguAxios.post(`/resources/v1/save-iep-data/${studentId}`, dataToSave);
            return response.data.data; 
        } catch (error) {
            return rejectWithValue(error.response?.data || "Save failed");
        }
    }
);