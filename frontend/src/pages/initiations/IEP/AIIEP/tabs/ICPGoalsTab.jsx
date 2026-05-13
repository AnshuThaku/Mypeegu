import React from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';

const ICPGoalsTab = ({ isIepGenerated, editableGoals, handleGoalChange }) => {
  if (!isIepGenerated) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="textSecondary">Generate IEP to see Goals</Typography>
      </Box>
    );
  }

  // Group goals by domain
  const groupedGoals = editableGoals.reduce((acc, goal, index) => {
    const d = goal.domain || 'General';
    if (!acc[d]) acc[d] = { shortTerm: null, longTerm: null, indices: {} };
    if (goal.goalType === 'ShortTerm') { acc[d].shortTerm = goal.goalDescription; acc[d].indices.st = index; }
    if (goal.goalType === 'LongTerm') { acc[d].longTerm = goal.goalDescription; acc[d].indices.lt = index; }
    return acc;
  }, {});

  return (
    <Box>
      {Object.entries(groupedGoals).map(([domain, data], idx) => {
        const dLow = domain.toLowerCase();
        let theme = { bg: '#F8FAFC', text: '#475569' }; 
        if (dLow.includes('attention')) theme = { bg: '#EFF6FF', text: '#2563EB' }; 
        else if (dLow.includes('social')) theme = { bg: '#FFF1F2', text: '#E11D48' }; 
        else if (dLow.includes('emotion')) theme = { bg: '#FFF7ED', text: '#EA580C' }; 
        else if (dLow.includes('verbal')) theme = { bg: '#F0FDF4', text: '#16A34A' };

        return (
          <Paper key={idx} sx={{ mb: 3, border: '1px solid #E2E8F0', borderRadius: '12px', boxShadow: 'none', overflow: 'hidden' }}>
            <Box sx={{ bgcolor: theme.bg, p: 1.5, borderBottom: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: theme.text }}>{domain}</Typography>
            </Box>
            <Box sx={{ p: 2 }}>
              {data.shortTerm && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" fontWeight="700" color="textSecondary">SHORT TERM GOAL</Typography>
                  <TextField 
                    fullWidth multiline minRows={2} 
                    value={data.shortTerm} 
                    onChange={(e) => handleGoalChange(data.indices.st, 'goalDescription', e.target.value)} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#F8FAFC', fontSize: '13px' } }} 
                  />
                </Box>
              )}
              {data.longTerm && (
                <Box>
                  <Typography variant="caption" fontWeight="700" color="textSecondary">LONG TERM GOAL</Typography>
                  <TextField 
                    fullWidth multiline minRows={2} 
                    value={data.longTerm} 
                    onChange={(e) => handleGoalChange(data.indices.lt, 'goalDescription', e.target.value)} 
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#F8FAFC', fontSize: '13px' } }} 
                  />
                </Box>
              )}
            </Box>
          </Paper>
        );
      })}
    </Box>
  );
};

export default ICPGoalsTab;