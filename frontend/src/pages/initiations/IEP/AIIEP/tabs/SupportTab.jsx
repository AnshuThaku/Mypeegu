import React from 'react';
import { Box, Typography, Paper, Grid, RadioGroup, FormControlLabel, Radio, FormControl, Select, MenuItem } from '@mui/material';
import { SettingsSuggestOutlined, AutoAwesome } from '@mui/icons-material';

const SupportTab = ({ isIepGenerated, editableSupport, handleSupportChange }) => {
  if (!isIepGenerated) {
    return (
      <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#F8FAFC', borderRadius: '16px', border: '1px dashed #CBD5E1' }}>
        <SettingsSuggestOutlined sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
        <Typography variant="subtitle1" fontWeight="600" color="#475569">Support Plan Not Generated</Typography>
        <Typography variant="body2" color="textSecondary" sx={{ maxWidth: '400px', mx: 'auto', mb: 3 }}>
          AI analyzes student needs to suggest internal and external support systems. Click "Generate IEP AI" to start.
        </Typography>
      </Box>
    );
  }

  const renderRadioRow = (category, item) => (
    <Grid container key={item.id} alignItems="center" sx={{ p: 2, borderBottom: '1px solid #F1F5F9', '&:last-child': { borderBottom: 'none' } }}>
      <Grid item xs={12} sm={6}>
        <Typography variant="body2" fontWeight="600" color="#334155">{item.label}</Typography>
      </Grid>
      <Grid item xs={12} sm={6}>
        <RadioGroup row value={editableSupport[category]?.[item.id] || 'No'} onChange={(e) => handleSupportChange(category, item.id, e.target.value)}>
          <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography variant="body2">No</Typography>} />
          <FormControlLabel value="Yes" control={<Radio size="small" sx={{ color: '#3B82F6', '&.Mui-checked': { color: '#3B82F6' } }} />} label={<Typography variant="body2" color="#3B82F6" fontWeight="600">Yes</Typography>} />
        </RadioGroup>
      </Grid>
    </Grid>
  );

  return (
    <Box>
      <Paper sx={{ p: 2, bgcolor: '#F0FDF4', borderRadius: '12px', mb: 4, display: 'flex', alignItems: 'center', gap: 2, boxShadow: 'none', border: '1px solid #DCFCE7' }}>
        <AutoAwesome sx={{ color: '#16A34A' }} />
        <Box>
          <Typography variant="subtitle2" fontWeight="700" color="#166534">Support & Placement Recommendations</Typography>
          <Typography variant="caption" color="#166534">✨ Auto-suggested by AI based on clinical report and baseline risk</Typography>
        </Box>
      </Paper>

      {/* Accommodation */}
      <Paper sx={{ mb: 4, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderBottom: '1px solid #E2E8F0' }}><Typography variant="subtitle1" fontWeight="800" color="#1E293B">Accommodation (Internal)</Typography></Box>
        <Box sx={{ p: 1 }}>
          {[
            { id: 'specialEducationClasses', label: 'Special Education Classes' },
            { id: 'behavioralInterventions', label: 'Behavioral Interventions' },
            { id: 'oneOnOneHRT', label: '1-1 w/ HRT/CT' },
            { id: 'focusClasses', label: 'Focus Classes/Remedial' },
            { id: 'accommodationsInSchool', label: 'Accommodations in School' },
            { id: 'assistiveTechnology', label: 'Assistive Technology' }
          ].map(item => renderRadioRow('accommodations', item))}
        </Box>
      </Paper>

      {/* Transition */}
      <Paper sx={{ mb: 4, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderBottom: '1px solid #E2E8F0' }}><Typography variant="subtitle1" fontWeight="800" color="#1E293B">Transition Planning</Typography></Box>
        <Box sx={{ p: 1 }}>
          {[
            { id: 'communityExperience', label: 'Community Experience' },
            { id: 'activitiesOfDailyLiving', label: 'Activities of Daily Living' },
            { id: 'functionalVocationalAssistance', label: 'Functional/Vocational Assistance' }
          ].map(item => renderRadioRow('transitionPlanning', item))}
        </Box>
      </Paper>

      {/* Placement */}
      <Paper sx={{ mb: 4, borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'none', overflow: 'hidden' }}>
        <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderBottom: '1px solid #E2E8F0' }}><Typography variant="subtitle1" fontWeight="800" color="#1E293B">Placement with SEND</Typography></Box>
        <Box sx={{ p: 1 }}>
          <Grid container alignItems="center" sx={{ p: 2, borderBottom: '1px solid #F1F5F9' }}>
            <Grid item xs={12} sm={6}><Typography variant="body2" fontWeight="600" color="#334155">Individual Sessions</Typography></Grid>
            <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <RadioGroup row value={editableSupport.placement?.individualSessions || 'No'} onChange={(e) => handleSupportChange('placement', 'individualSessions', e.target.value)}>
                <FormControlLabel value="No" control={<Radio size="small" />} label={<Typography variant="body2">No</Typography>} />
                <FormControlLabel value="Yes" control={<Radio size="small" sx={{ color: '#3B82F6' }} />} label={<Typography variant="body2" color="#3B82F6" fontWeight="600">Yes</Typography>} />
              </RadioGroup>
              {editableSupport.placement?.individualSessions === 'Yes' && (
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select value={editableSupport.placement?.individualSessionCount || '1 session'} onChange={(e) => handleSupportChange('placement', 'individualSessionCount', e.target.value)} sx={{ borderRadius: '8px', bgcolor: '#F8FAFC', fontSize: '13px' }}>
                    <MenuItem value="1 session">1 session</MenuItem>
                    <MenuItem value="2 sessions">2 sessions</MenuItem>
                    <MenuItem value="3 sessions">3 sessions</MenuItem>
                    <MenuItem value="Daily">Daily</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
          {renderRadioRow('placement', { id: 'groupSessions', label: 'Group Sessions' })}
        </Box>
      </Paper>
    </Box>
  );
};

export default SupportTab;