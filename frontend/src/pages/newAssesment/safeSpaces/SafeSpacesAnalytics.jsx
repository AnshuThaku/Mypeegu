import React from 'react'
import { Box, Typography, Grid, Paper } from '@mui/material'
import { Pie, Bar } from 'react-chartjs-2'

const SafeSpacesAnalytics = ({ data }) => {
    // Logic to count students in each Tier
    const tierCounts = { tier1: 0, tier1Monitor: 0, tier2: 0, tier3: 0 }
    
    data.forEach(r => {
        if (r.overallScore >= 80) tierCounts.tier1++
        else if (r.overallScore >= 60) tierCounts.tier1Monitor++
        else if (r.overallScore >= 40) tierCounts.tier2++
        else tierCounts.tier3++
    })

    const pieData = {
        labels: ['Tier 1 (Safe)', 'Tier 1-Monitor', 'Tier 2 (At Risk)', 'Tier 3 (High Risk)'],
        datasets: [{
            data: [tierCounts.tier1, tierCounts.tier1Monitor, tierCounts.tier2, tierCounts.tier3],
            backgroundColor: ['#43A047', '#7CB342', '#FB8C00', '#E53935'],
        }]
    }

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Safe Spaces Analytics Overview</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: '12px' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>MTSS Tier Distribution</Typography>
                        <Box sx={{ height: 300 }}><Pie data={pieData} options={{ maintainAspectRatio: false }} /></Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#f0f7ff' }}>
                        <Typography variant="h6">Key Interpretation Summary</Typography>
                        <Typography variant="body1" sx={{ mt: 2 }}><b>Total Assessments:</b> {data.length}</Typography>
                        <Typography variant="body1" color="error"><b>High Risk Students (Tier 3):</b> {tierCounts.tier3}</Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SafeSpacesAnalytics