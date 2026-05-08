import React, { useMemo, useRef, useState } from 'react'
import {
    Dialog,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    Divider,
    Slide
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AssessmentIcon from '@mui/icons-material/Assessment'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import TimelineIcon from '@mui/icons-material/Timeline'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs'
import CustomButton from '../../../components/CustomButton'
import CustomIcon from '../../../components/CustomIcon'
import CustomDialog from '../../../components/CustomDialog'
import useCommonStyles from '../../../components/styles'
import { iconConstants } from '../../../resources/theme/iconConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { generatePDF } from '../../../utils/utils'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels)

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const SafeSpacesAnalytics = ({ open, onClose, data }) => {
    const flexStyles = useCommonStyles()
    const captureUIRef = useRef(null)
    const [downloadReportDialogOpen, setDownloadReportDialogOpen] = useState(false)

    // Data Processing for Safe Spaces MTSS Tiers
    const analyticsData = useMemo(() => {
        const records = data || []
        const totalAssessed = records.length
        
        const counts = { t1: 0, t1m: 0, t2: 0, t3: 0 }
        
        // Track averages for Bar Chart
        const domainTotals = {
            'Emotional Safety': 0, 'Social Belonging': 0, 'Experiences of School': 0, 
            'Physical Safety': 0, 'Adult Support': 0, 'System Responsiveness': 0, 'Student Agency': 0
        }

        records.forEach(r => {
            const score = r.overallScore || 0;
            if (score >= 80) counts.t1++ 
            else if (score >= 60) counts.t1m++
            else if (score >= 40) counts.t2++
            else counts.t3++

            if (r.domainScores) {
                Object.keys(domainTotals).forEach(domain => {
                    domainTotals[domain] += (r.domainScores[domain] || 0)
                })
            }
        })

        const domainAverages = Object.keys(domainTotals).map(key => 
            totalAssessed > 0 ? (domainTotals[key] / totalAssessed).toFixed(1) : 0
        )

        return { 
            totalAssessed, counts, domainAverages, 
            domainLabels: ['Emotional', 'Social', 'Harm Exp.', 'Physical', 'Adult Support', 'System Resp.', 'Agency'] 
        }
    }, [data])

    // Charts Configuration
    const pieData = {
        labels: ['Tier 1 (Safe & Supported)', 'Tier 1-Monitor (Emerging)', 'Tier 2 (At Risk)', 'Tier 3 (High Risk)'],
        datasets: [{
            data: [analyticsData.counts.t1, analyticsData.counts.t1m, analyticsData.counts.t2, analyticsData.counts.t3],
            backgroundColor: ['#43A047', '#7CB342', '#FB8C00', '#E53935'],
            borderWidth: 0
        }]
    }

    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { padding: 20, font: { size: 12 } } },
            datalabels: { display: false }
        }
    }

    const barData = {
        labels: analyticsData.domainLabels,
        datasets: [{
            label: 'Average Score (%)',
            data: analyticsData.domainAverages,
            backgroundColor: '#0267D9',
            borderRadius: 4,
            barThickness: 35,
        }]
    }

    const barOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                display: true, color: '#fff', anchor: 'end', align: 'bottom', font: { weight: 'bold' }
            }
        },
        scales: {
            y: { beginAtZero: true, max: 100, grid: { color: '#f0f0f0' } },
            x: { grid: { display: false } }
        }
    }

    const captureUIAndDownloadPDF = async () => {
        await generatePDF(captureUIRef.current, {
            filename: 'SafeSpaces_Analytics_Report.pdf',
            orientation: 'l',
            pageSize: 'a4',
            margin: 5,
        })
        setDownloadReportDialogOpen(false)
    }

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            {/* Header */}
            <AppBar sx={{ position: 'relative', backgroundColor: '#fff', color: '#334155', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1, fontWeight: 600, fontSize: '1.25rem' }} variant="h6">
                        Safe Spaces (MTSS) Analytics Dashboard
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.875rem' }}>
                        Total Records: {analyticsData.totalAssessed}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4, backgroundColor: '#F8FBFF', minHeight: '100vh' }}>
                
                {/* Download PDF Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <CustomButton
                        sx={{
                            minWidth: '160px', height: '40px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #4CB8C4 0%, #3BA3AD 100%)',
                        }}
                        typoSx={{ fontSize: '14px', fontWeight: 500 }}
                        text={localizationConstants.generateReport || "Generate Report"}
                        onClick={() => setDownloadReportDialogOpen(true)}
                    />
                </Box>

                <Box ref={captureUIRef} sx={{ backgroundColor: '#fff', p: 3, borderRadius: '12px' }}>
                    {/* KPI Cards */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderLeft: '5px solid #0267D9' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, backgroundColor: '#E3F2FD', borderRadius: '8px', color: '#0267D9' }}><AssessmentIcon /></Box>
                                    <Box>
                                        <Typography sx={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 500 }}>Total Screened</Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{analyticsData.totalAssessed}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderLeft: '5px solid #43A047' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, backgroundColor: '#E8F5E9', borderRadius: '8px', color: '#43A047' }}><VerifiedUserIcon /></Box>
                                    <Box>
                                        <Typography sx={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 500 }}>Tier 1 (Safe)</Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{analyticsData.counts.t1}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderLeft: '5px solid #FB8C00' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, backgroundColor: '#FFF3E0', borderRadius: '8px', color: '#FB8C00' }}><TimelineIcon /></Box>
                                    <Box>
                                        <Typography sx={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 500 }}>Tier 2 (At Risk)</Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{analyticsData.counts.t2}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', borderLeft: '5px solid #E53935' }}>
                                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Box sx={{ p: 1.5, backgroundColor: '#FFEBEE', borderRadius: '8px', color: '#E53935' }}><WarningAmberIcon /></Box>
                                    <Box>
                                        <Typography sx={{ color: '#64748B', fontSize: '0.875rem', fontWeight: 500 }}>Tier 3 (High Risk)</Typography>
                                        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>{analyticsData.counts.t3}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Charts Area */}
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={5}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 600, color: '#334155', mb: 3 }}>MTSS Tier Distribution</Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Box sx={{ height: '320px' }}>
                                        {analyticsData.totalAssessed > 0 ? (
                                            <Pie data={pieData} options={pieOptions} />
                                        ) : (
                                            <Typography sx={{ textAlign: 'center', color: '#94A3B8', mt: 10 }}>No assessment data available.</Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={7}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', height: '100%' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 600, color: '#334155', mb: 3 }}>Domain-wise Average Score</Typography>
                                    <Divider sx={{ mb: 3 }} />
                                    <Box sx={{ height: '320px' }}>
                                        {analyticsData.totalAssessed > 0 ? (
                                            <Bar data={barData} options={barOptions} />
                                        ) : (
                                            <Typography sx={{ textAlign: 'center', color: '#94A3B8', mt: 10 }}>No assessment data available.</Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Box>

            {/* Download Confirmation Dialog */}
            <Dialog open={downloadReportDialogOpen} onClose={() => setDownloadReportDialogOpen(false)}>
                <Box sx={{ borderRadius: '10px', width: '500px', overflow: 'hidden' }}>
                    <Box sx={{ padding: '20px 30px' }}>
                        <Box className={flexStyles.flexRowCenterSpaceBetween}>
                            <Typography variant={typographyConstants.h4} sx={{ fontWeight: 500, color: 'textColors.blue' }}>
                                {localizationConstants.generateReport || "Generate Report"}
                            </Typography>
                            <CustomIcon name={iconConstants.cancelRounded} style={{ cursor: 'pointer', width: '26px', height: '26px' }} svgStyle={'width: 26px; height: 26px'} onClick={() => setDownloadReportDialogOpen(false)} />
                        </Box>
                        <Typography color="globalElementColors.gray1" sx={{ mt: 2 }}>
                            {localizationConstants.downloadAnalyticalPDFReportMsg || "Are you sure you want to download the PDF report?"}
                        </Typography>
                        <Box className={flexStyles.flexColumnCenter} sx={{ mt: 3 }}>
                            <CustomButton
                                sx={{ backgroundColor: 'globalElementColors.green2', minWidth: '182px', height: '44px' }}
                                text={localizationConstants.download || "Download"}
                                onClick={captureUIAndDownloadPDF}
                                endIcon={<CustomIcon name={iconConstants.downloadWhite} style={{ width: '20px', height: '30px', marginLeft: '10px' }} svgStyle={'width: 20px; height: 30px'} />}
                            />
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </Dialog>
    )
}

export default SafeSpacesAnalytics