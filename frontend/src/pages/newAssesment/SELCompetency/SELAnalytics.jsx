import React, { useMemo, useRef } from 'react'
import { Dialog, AppBar, Toolbar, IconButton, Typography, Box, Grid, Card, CardContent, Divider, Slide } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import CustomButton from '../../../components/CustomButton'
import { generatePDF } from '../../../utils/utils'
import { getSELTier } from './SELConstants'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)
const Transition = React.forwardRef(function Transition(props, ref) { return <Slide direction="up" ref={ref} {...props} /> })

const SELAnalytics = ({ open, onClose, data }) => {
    const captureUIRef = useRef(null)

    const analyticsData = useMemo(() => {
        const records = data || []
        const totalAssessed = records.length
        const counts = { high: 0, dev: 0, emerg: 0, support: 0 }
        
        const domainTotals = { 'SELF-AWARENESS': 0, 'SELF-MANAGEMENT': 0, 'SOCIAL AWARENESS': 0, 'RELATIONSHIP SKILLS': 0, 'RESPONSIBLE DECISION-MAKING': 0, 'ENGAGEMENT': 0, 'OPTIMISM': 0, 'CONNECTEDNESS': 0, 'HAPPINESS': 0 }

        records.forEach(r => {
            const tier = getSELTier(r.overallScore, r.version);
            if (tier.label === 'High Competency') counts.high++;
            else if (tier.label === 'Developing') counts.dev++;
            else if (tier.label === 'Emerging') counts.emerg++;
            else counts.support++;

            if (r.domainScores) Object.keys(domainTotals).forEach(domain => { domainTotals[domain] += (r.domainScores[domain] || 0) })
        })

        const domainAverages = Object.keys(domainTotals).map(key => totalAssessed > 0 ? parseFloat((domainTotals[key] / totalAssessed).toFixed(1)) : 0)
        return { totalAssessed, counts, domainAverages, domainLabels: ['Self Aware', 'Self Mgmt', 'Social Aware', 'Relationships', 'Decisions', 'Engagement', 'Optimism', 'Connectedness', 'Happiness'] }
    }, [data])

    const pieData = {
        labels: ['High Competency', 'Developing', 'Emerging', 'Needs Support'],
        datasets: [{ data: [analyticsData.counts.high, analyticsData.counts.dev, analyticsData.counts.emerg, analyticsData.counts.support], backgroundColor: ['#43A047', '#7CB342', '#FB8C00', '#E53935'], borderWidth: 0 }]
    }

    const barData = {
        labels: analyticsData.domainLabels,
        datasets: [{ label: 'Average Score', data: analyticsData.domainAverages, backgroundColor: '#0267D9', borderRadius: 4, barThickness: 25 }]
    }

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            <AppBar sx={{ position: 'relative', backgroundColor: '#fff', color: '#334155' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}><CloseIcon /></IconButton>
                    <Typography sx={{ ml: 2, flex: 1, fontWeight: 600 }} variant="h6">SEL CA Analytics</Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: 4, backgroundColor: '#F8FBFF', minHeight: '100vh' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <CustomButton sx={{ minWidth: '160px', height: '40px', background: 'linear-gradient(135deg, #4CB8C4 0%, #3BA3AD 100%)' }} text="Download PDF" onClick={() => generatePDF(captureUIRef.current, { filename: 'SEL_Report.pdf', orientation: 'l' })} />
                </Box>
                <Box ref={captureUIRef} sx={{ backgroundColor: '#fff', p: 3, borderRadius: '12px' }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}><Card><CardContent><Typography sx={{ fontWeight: 600, mb: 2 }}>Competency Levels</Typography><Box sx={{ height: '300px' }}><Pie data={pieData} options={{ maintainAspectRatio: false }} /></Box></CardContent></Card></Grid>
                        <Grid item xs={12} md={8}><Card><CardContent><Typography sx={{ fontWeight: 600, mb: 2 }}>Domain-wise Average Performance</Typography><Box sx={{ height: '300px' }}><Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { max: 4 } } }} /></Box></CardContent></Card></Grid>
                    </Grid>
                </Box>
            </Box>
        </Dialog>
    )
}
export default SELAnalytics