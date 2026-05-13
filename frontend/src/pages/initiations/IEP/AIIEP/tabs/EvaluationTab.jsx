import React from 'react';
import { Box, Paper, Avatar, Typography, Button, CircularProgress, Grid, Divider, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { 
  AssignmentOutlined, 
  CloudUpload, 
  AutoAwesome, 
  DescriptionOutlined, 
  PsychologyOutlined, 
  SchoolOutlined,
  MonitorHeartOutlined,
  FiberManualRecord
} from '@mui/icons-material';

const EvaluationTab = ({ selectedFile, handleFileChange, handleUpload, isUploadingPDF, iepData }) => {
  const evalData = iepData?.evaluationDetails;

  const renderRecommendations = (text) => {
    if (!text) return "No recommendations provided.";
    const items = text.split(',').map(item => item.trim()).filter(item => item.length > 0);
    
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {items.map((item, idx) => (
          <Chip 
            key={idx} 
            label={item} 
            color="primary" 
            variant="outlined" 
            sx={{ fontWeight: 500, bgcolor: '#EFF6FF', borderColor: '#BFDBFE', color: '#1E3A8A' }} 
          />
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Paper sx={{ p: 2, bgcolor: '#F0F9FF', borderRadius: '12px', mb: 3, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid #BAE6FD', boxShadow: 'none' }}>
        <Avatar sx={{ bgcolor: '#DBEAFE', color: '#1E40AF', width: 32, height: 32 }}>
          <AssignmentOutlined fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight="800" color="#1E3A8A">AI Clinical Evaluation</Typography>
          <Typography variant="caption" color="#2563EB">Upload a diagnostic report for advanced AI-powered clinical analysis</Typography>
        </Box>
      </Paper>

      {/* 🔴 UPLOAD DROPZONE */}
      <Box sx={{ mb: 3 }}>
        <input type="file" id="pdf-upload" hidden accept=".pdf" onChange={handleFileChange} />
        <label htmlFor="pdf-upload" style={{ width: '100%', display: 'block' }}>
          <Box sx={{ p: 4, borderRadius: '16px', border: '2px dashed #CBD5E1', bgcolor: '#F8FAFC', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '160px', transition: '0.2s', '&:hover': { bgcolor: '#F1F5F9', borderColor: '#3B82F6' } }}>
            <CloudUpload sx={{ fontSize: 48, color: '#3B82F6', mb: 1.5 }} />
            <Typography variant="h6" fontWeight="700" color="#0F172A">
              {selectedFile ? selectedFile.name : "Drop Report for AI Analysis"}
            </Typography>
            {!selectedFile && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                AI will automatically extract behavioral, cognitive & educational insights
              </Typography>
            )}
          </Box>
        </label>
      </Box>

      {/* 🔴 ACTION BUTTON */}
      {selectedFile && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button 
            variant="contained" 
            onClick={handleUpload} 
            disabled={isUploadingPDF} 
            sx={{ bgcolor: '#3B82F6', '&:hover': { bgcolor: '#2563EB' }, borderRadius: '10px', px: 4, py: 1.2, fontWeight: 'bold', textTransform: 'none', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)' }}
          >
            {isUploadingPDF ? <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} /> : <AutoAwesome sx={{ mr: 1, fontSize: 18 }} />}
            {isUploadingPDF ? "Analyzing Report..." : "Run AI Analysis"}
          </Button>
        </Box>
      )}

      {/* 🔴 CLINICAL DATA DISPLAY */}
      {evalData ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          
          {/* Section 1: Clinical Profile & Diagnosis */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#0F766E', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <MonitorHeartOutlined fontSize="small" /> Clinical Profile & Diagnosis
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                   <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Student Profile</Typography>
                   <Typography variant="body2" sx={{ mt: 1, color: '#334155', lineHeight: 1.6 }}>{evalData.studentProfile || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                   <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Diagnosis</Typography>
                   <Box sx={{ mt: 1 }}>
                     {evalData.diagnosis ? (
                        <Chip label={evalData.diagnosis} color="error" variant="outlined" sx={{ fontWeight: 600, bgcolor: '#FEF2F2' }} />
                     ) : (
                        <Typography variant="body2" sx={{ color: '#334155', lineHeight: 1.6 }}>N/A</Typography>
                     )}
                   </Box>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Section 2: Cognitive Profile */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#4338CA', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <PsychologyOutlined fontSize="small" /> Cognitive Profile
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
               <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                   <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Cognitive Strengths</Typography>
                   <Typography variant="body2" sx={{ mt: 1, color: '#334155', lineHeight: 1.6 }}>{evalData.cognitiveStrengths || "N/A"}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                   <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Strengths & Weaknesses</Typography>
                   <Typography variant="body2" sx={{ mt: 1, color: '#334155', lineHeight: 1.6 }}>{evalData.strengthsWeaknesses || "N/A"}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>

          {/* Section 3: Interventions & Recommendations */}
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#B45309', fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              <AutoAwesome fontSize="small" /> Interventions & Recommendations
            </Typography>
            <Paper sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFBEB', border: '1px solid #FDE68A', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              {renderRecommendations(evalData.recommendations)}
            </Paper>
          </Box>

        </Box>
      ) : (
        /* Empty State */
        <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
          <DescriptionOutlined sx={{ fontSize: 64, color: '#94A3B8', mb: 2 }} />
          <Typography variant="h6" color="#64748B" fontWeight="600">No Clinical Data</Typography>
          <Typography variant="body2" color="#94A3B8" sx={{ textAlign: 'center', maxWidth: 400, mt: 1 }}>
            Upload a diagnostic report above to automatically extract clinical insights, cognitive profiles, and evidence-based recommendations.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default EvaluationTab;