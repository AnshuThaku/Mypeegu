import { createSlice } from '@reduxjs/toolkit';

// Path check kar lena agar redux folder me hai
import { 
    fetchStudent360Data, 
    uploadIEPEvaluationPDF, 
    generateIEPWithAI, 
    saveIEPData 
} from './AIIEP/aiIepThunks'; 

const initialState = {
    student360Data: null,
    is360Loading: false,
    isUploadingPDF: false,
    isSaving: false,
    error: null,
};

const iEP360Slice = createSlice({
    name: 'iep360',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // 1. Fetch Data
        builder
            .addCase(fetchStudent360Data.pending, (state) => {
                state.is360Loading = true;
                state.error = null;
            })
            .addCase(fetchStudent360Data.fulfilled, (state, action) => {
                state.is360Loading = false;
                state.student360Data = action.payload;
            })
            .addCase(fetchStudent360Data.rejected, (state, action) => {
                state.is360Loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch Student 360 profile';
            });

        // 2. PDF Upload -> STRICTLY FOR EVALUATION TAB
        builder
            .addCase(uploadIEPEvaluationPDF.pending, (state) => {
                state.isUploadingPDF = true;
                state.error = null;
            })
            .addCase(uploadIEPEvaluationPDF.fulfilled, (state, action) => {
                state.isUploadingPDF = false;
                
                // Sirf Evaluation data update karo, baaki safe rakho
                if (state.student360Data) {
                    state.student360Data.iepData = {
                        ...state.student360Data.iepData,
                        evaluationDetails: action.payload.evaluationDetails || action.payload.evaluationData
                    };
                }
            })
            .addCase(uploadIEPEvaluationPDF.rejected, (state, action) => {
                state.isUploadingPDF = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to analyze PDF';
            });

        // 3. Generate IEP -> STRICTLY FOR PLOP, GOALS & SUPPORT
        builder
            .addCase(generateIEPWithAI.pending, (state) => {
                state.is360Loading = true; 
                state.error = null;
            })
            .addCase(generateIEPWithAI.fulfilled, (state, action) => {
                state.is360Loading = false;
                
                // Evaluation ko chhod kar baaki sab update karo
                if (state.student360Data) {
                    state.student360Data.iepData = {
                        ...state.student360Data.iepData,
                        plopAnalysis: action.payload.plopAnalysis,
                        aiGeneratedGoals: action.payload.aiGeneratedGoals,
                        supportNeeds: action.payload.supportNeeds
                    };
                }
            })
            .addCase(generateIEPWithAI.rejected, (state, action) => {
                state.is360Loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to generate AI IEP';
            });

        // 4. Save Data
        builder
            .addCase(saveIEPData.pending, (state) => {
                state.isSaving = true;
                state.error = null;
            })
            .addCase(saveIEPData.fulfilled, (state, action) => {
                state.isSaving = false;
                if (state.student360Data) {
                    state.student360Data.iepData = action.payload;
                }
            })
            .addCase(saveIEPData.rejected, (state, action) => {
                state.isSaving = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to save IEP Data';
            });
    },
});

export default iEP360Slice.reducer;