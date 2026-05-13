import React from 'react';
import { Paper, Avatar, Typography, Box } from '@mui/material';

const SidebarProfile = ({ student, activeChecklistScores }) => {
  return (
    <>
      {/* Student Profile Card */}
      <Paper sx={{ p: 3, borderRadius: '20px', textAlign: 'center', mb: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Avatar sx={{ width: 72, height: 72, mx: 'auto', mb: 2, bgcolor: '#3B82F6', fontWeight: 'bold' }}>
          {student.initials}
        </Avatar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B', textTransform: 'capitalize' }}>
          {student.name.toLowerCase()}
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Age {student.age} Years
        </Typography>
      </Paper>

      {/* Checklist Scores Card */}
      <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
        <Typography variant="overline" sx={{ fontWeight: 800, color: '#64748B', display: 'block', mb: 2 }}>
          CHECKLIST SCORES
        </Typography>
        
        {activeChecklistScores?.map((item, index) => {
          const isHighRisk = Number(item.score) >= 4; 
          return (
            <Box key={index} sx={{ 
              p: 1.5, mb: 1.5, borderRadius: '12px', 
              bgcolor: isHighRisk ? '#FEF2F2' : '#ECFDF5', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              border: `1px solid ${isHighRisk ? '#FCA5A5' : '#6EE7B7'}` 
            }}>
              <Typography variant="caption" sx={{ color: isHighRisk ? '#DC2626' : '#059669', fontWeight: 700 }}>
                {item.category}
              </Typography>
              <Typography variant="h6" sx={{ color: isHighRisk ? '#991B1B' : '#065F46', fontWeight: 800 }}>
                {item.score || 0}
              </Typography>
            </Box>
          )
        })}
        {(!activeChecklistScores || activeChecklistScores.length === 0) && (
            <Typography variant="caption" color="textSecondary">No checklist data found.</Typography>
        )}
      </Paper>
    </>
  );
};

export default SidebarProfile;