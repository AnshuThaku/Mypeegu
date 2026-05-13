import React from 'react';
import { Box, Typography, Grid, Paper, LinearProgress, TextField } from '@mui/material';

const PLOPTab = ({ isIepGenerated, plopBaseline, editablePlop, setEditablePlop }) => {
  
  if (!isIepGenerated) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography color="textSecondary">Generate IEP to see PLOP data</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container sx={{ px: 2, mb: 2, display: { xs: 'none', md: 'flex' } }}>
        <Grid item md={2}><Typography variant="caption" fontWeight="800" color="#64748B">DOMAIN</Typography></Grid>
        <Grid item md={3}><Typography variant="caption" fontWeight="800" color="#64748B">SCORE</Typography></Grid>
        <Grid item md={7}><Typography variant="caption" fontWeight="800" color="#64748B">ANALYSIS (EDITABLE)</Typography></Grid>
      </Grid>
      
      {['physical', 'social', 'emotional', 'cognitive', 'language'].map((domain) => {
        
        // 🟢 SUPER-AGGRESSIVE SCORE FINDER (NESTED OBJECT FIX)
        const findScoreAggressively = (domainName, dataObj) => {
          if (!dataObj) return null;

          const dLower = String(domainName).toLowerCase();
          const isLanguage = dLower === 'language';
          
          const searchTerms = isLanguage 
            ? ['language', 'verbal', 'communication', 'speech'] 
            : [dLower];

          if (Array.isArray(dataObj)) {
            for (const item of dataObj) {
              const nameField = String(item.domain || item.category || item.name || item.title || '').toLowerCase();
              if (searchTerms.some(term => nameField.includes(term))) {
                return item.total || item.score || item.value || item.marks || null;
              }
            }
          }

          if (typeof dataObj === 'object') {
            const keys = Object.keys(dataObj);
            const targetKey = keys.find(k => {
              const keyLower = String(k).toLowerCase();
              return searchTerms.some(term => keyLower.includes(term));
            });
            
            if (targetKey) {
              const val = dataObj[targetKey];
              // 🟢 THE FIX: Agar data us object ke andar 'total' me rakha hai
              if (val && typeof val === 'object' && !Array.isArray(val)) {
                return val.total || val.score || val.value || null;
              }
              return val;
            }
          }

          return null;
        };

        // Dono jagah aggressively search karo
        let rawScore = findScoreAggressively(domain, plopBaseline?.domainScores);
        
        // Agar response directly Array ke form me hai (jaise aapke API response me "data" array hai)
        if (rawScore === null && Array.isArray(plopBaseline)) {
            rawScore = findScoreAggressively(domain, plopBaseline[0]);
        }
        
        if (rawScore === null) rawScore = findScoreAggressively(domain, plopBaseline);

        // 🟢 MISSING DATA HANDLING
        const isScoreMissing = rawScore === null || rawScore === undefined || isNaN(Number(rawScore));
        const percent = isScoreMissing ? 0 : Math.round((Number(rawScore) / 7) * 100);
        
        let barColor = '#E2E8F0'; 
        if (!isScoreMissing) {
          barColor = percent > 70 ? '#10B981' : percent > 40 ? '#F59E0B' : '#EF4444';
        }
        
        return (
          <Paper key={domain} sx={{ p: 2, mb: 2, borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={2}>
                <Typography variant="body2" fontWeight="800" textTransform="uppercase">{domain}</Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" fontWeight="900" color={isScoreMissing ? '#94A3B8' : 'inherit'}>
                    {isScoreMissing ? 'N/A' : `${percent}%`}
                  </Typography>
                  <Box sx={{ flexGrow: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={isScoreMissing ? 100 : percent} 
                      sx={{ 
                        height: 6, borderRadius: 3, bgcolor: '#F1F5F9', 
                        '& .MuiLinearProgress-bar': { bgcolor: barColor } 
                      }} 
                    />
                    <Typography variant="caption" color="textSecondary">
                      {isScoreMissing ? 'Score Missing' : `${rawScore} / 7`}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={7}>
                <TextField 
                  fullWidth 
                  multiline 
                  minRows={2} 
                  value={editablePlop[domain] || ''} 
                  onChange={(e) => setEditablePlop({ ...editablePlop, [domain]: e.target.value })} 
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px', bgcolor: '#F8FAFC', fontSize: '13px' } }} 
                />
              </Grid>
            </Grid>
          </Paper>
        );
      })}
    </Box>
  );
};

export default PLOPTab;