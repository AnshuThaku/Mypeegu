import React, { useMemo, useRef, useState } from 'react'
import {
    Dialog,
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AssessmentIcon from '@mui/icons-material/Assessment'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import TimelineIcon from '@mui/icons-material/Timeline'
import { Bar, Doughnut } from 'react-chartjs-2'
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
import { pulseQuestions } from './pulseConstants'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, ChartDataLabels)

const PulseAnalyticsDialog = ({ open, onClose, data }) => {
    const flexStyles = useCommonStyles()
    const captureUIRef = useRef(null)
    const [downloadReportDialogOpen, setDownloadReportDialogOpen] = useState(false)

    // Data Calculation
    const analyticsData = useMemo(() => {
        const records = data || []
        const totalAssessed = records.length
        
        let safeCount = 0
        let monitorCount = 0
        let riskCount = 0

        const domainTotals = {
            'Online Time': 0, 'Games & Fun': 0, 'People Online': 0, 'Things I See': 0,
            'Social Media': 0, 'Respect Online': 0, 'Making Choices': 0, 'Getting Help': 0, 'About Me': 0
        }

        records.forEach(row => {
            let studentTotalScore = 0
            let maxPossibleScore = 0

            Object.keys(pulseQuestions).forEach((sectionKey, index) => {
                const qList = pulseQuestions[sectionKey] || []
                let domainScore = 0
                
                qList.forEach((qnObj, qIdx) => {
                    maxPossibleScore += 4
                    const exactKey = `${sectionKey}_${qIdx}`
                    let ans = ''
                    if (row.responses && row.responses[exactKey]) ans = row.responses[exactKey].option || row.responses[exactKey]
                    else if (row.responses) {
                        const flat = Object.values(row.responses)
                        const found = flat.find((item) => item.question === (qnObj.text || qnObj))
                        if (found) ans = found.option || found
                    }
                    if (ans === 'Always') domainScore += 4
                    else if (ans === 'Often') domainScore += 3
                    else if (ans === 'Sometimes') domainScore += 2
                    else if (ans === 'Never') domainScore += 1
                })

                studentTotalScore += domainScore
                const keys = Object.keys(domainTotals)
                if(keys[index]) domainTotals[keys[index]] += domainScore
            })

            const percentage = maxPossibleScore > 0 ? (studentTotalScore / maxPossibleScore) * 100 : 0
            if (percentage >= 75) safeCount++
            else if (percentage >= 50) monitorCount++
            else riskCount++
        })

        const domainAverages = Object.keys(domainTotals).map(key => 
            totalAssessed > 0 ? (domainTotals[key] / totalAssessed).toFixed(1) : 0
        )

        return { totalAssessed, safeCount, monitorCount, riskCount, domainAverages, domainLabels: Object.keys(domainTotals) }
    }, [data])

    // Charts Config
    const doughnutData = {
        labels: ['Safe & Supported', 'Emerging Concerns', 'At Risk'],
        datasets: [{
            data: [analyticsData.safeCount, analyticsData.monitorCount, analyticsData.riskCount],
            backgroundColor: ['#43A047', '#FB8C00', '#E53935'],
            borderWidth: 0,
            cutout: '65%',
        }]
    }

    const barData = {
        labels: analyticsData.domainLabels,
        datasets: [{
            data: analyticsData.domainAverages,
            backgroundColor: '#0267D9',
            borderRadius: 5,
            barThickness: 30,
        }]
    }

    const captureUIAndDownloadPDF = async () => {
        await generatePDF(captureUIRef.current, {
            filename: 'Pulse_Analytics_Report.pdf',
            orientation: 'l',
            pageSize: 'a4',
            margin: 5,
        })
        setDownloadReportDialogOpen(false)
    }

    return (
        <CustomDialogWithBreadcrumbs
            onClose={onClose}
            clickableTitle="Pulse Assessment"
            title="Analytics Dashboard"
            onClick={onClose}
            open={open}
            saveBtnReq={false}
        >
            <Box ref={captureUIRef} sx={{ p: 2, backgroundColor: '#FFFFFF', minHeight: '80vh' }}>
                
                {/* Download Report Button Section */}
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

                {/* KPI Summary Cards */}
                <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap', mb: 3 }}>
                    {[
                        { title: 'Total Screened', val: analyticsData.totalAssessed, icon: <AssessmentIcon />, color: '#0267D9', bg: '#E3F2FD' },
                        { title: 'Safe & Supported', val: analyticsData.safeCount, icon: <VerifiedUserIcon />, color: '#43A047', bg: '#E8F5E9' },
                        { title: 'Needs Monitoring', val: analyticsData.monitorCount, icon: <TimelineIcon />, color: '#FB8C00', bg: '#FFF3E0' },
                        { title: 'At Risk', val: analyticsData.riskCount, icon: <WarningAmberIcon />, color: '#E53935', bg: '#FFEBEE' }
                    ].map((kpi, i) => (
                        <Box key={i} sx={{ flex: 1, minWidth: '180px', p: 2, border: '1px solid #E2E2E2', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ p: 1.5, backgroundColor: kpi.bg, borderRadius: '8px', color: kpi.color, display: 'flex' }}>{kpi.icon}</Box>
                            <Box>
                                <Typography sx={{ color: 'textColors.gray1', fontSize: '12px', fontWeight: 600 }}>{kpi.title}</Typography>
                                <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#334155' }}>{kpi.val}</Typography>
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/* Charts Area */}
                <Grid container spacing={3}>
                    {/* Doughnut Chart */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ border: '1px solid #E2E2E2', borderRadius: '12px', p: 3, height: '346px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography sx={{ fontWeight: 600, color: 'textColors.primary', mb: 2 }}>Student Support Levels</Typography>
                            <Box sx={{ height: '220px', width: '220px', position: 'relative' }}>
                                <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                    <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#334155' }}>{analyticsData.totalAssessed}</Typography>
                                    <Typography sx={{ fontSize: '10px', color: '#64748B' }}>Assessed</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Bar Chart */}
                    <Grid item xs={12} md={8}>
                        <Box sx={{ border: '1px solid #E2E2E2', borderRadius: '12px', p: 3, height: '346px' }}>
                            <Typography sx={{ fontWeight: 600, color: 'textColors.primary', mb: 2 }}>Domain-wise Average Score</Typography>
                            <Box sx={{ height: '270px' }}>
                                <Bar data={barData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, datalabels: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } } } }} />
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Download Report Confirmation Dialog */}
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
        </CustomDialogWithBreadcrumbs>
    )
}

export default PulseAnalyticsDialog