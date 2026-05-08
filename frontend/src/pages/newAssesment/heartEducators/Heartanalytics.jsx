import React, { useMemo, useRef, useState } from 'react';
import {
    Dialog, AppBar, Toolbar, IconButton, Typography,
    Box, Grid, Card, CardContent, Divider, Slide,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Bar, Pie, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    Title, Tooltip, Legend, ArcElement, RadialLinearScale,
    PointElement, LineElement, Filler,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import CustomButton from '../../../components/CustomButton';
import CustomIcon from '../../../components/CustomIcon';
import { iconConstants } from '../../../resources/theme/iconConstants';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import useCommonStyles from '../../../components/styles';
import { generatePDF } from '../../../utils/utils';
import { heartDomainInfo } from './heartConstants';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
    ArcElement, RadialLinearScale, PointElement, LineElement, Filler,
    ChartDataLabels
);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DOMAINS = ['Honesty', 'Empathy', 'Autonomy', 'Respect', 'Trust'];

const Heartanalytics = ({ open, onClose, data }) => {
    const flexStyles = useCommonStyles();
    const captureUIRef = useRef(null);
    const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);

    // ── Data Processing ─────────────────────────────────────────────────────
    const analyticsData = useMemo(() => {
        const records = data || [];
        const total = records.length;

        // Safety bands
        const counts = { high: 0, moderate: 0, low: 0, veryLow: 0 };

        // Domain averages
        const domainTotals = { Honesty: 0, Empathy: 0, Autonomy: 0, Respect: 0, Trust: 0 };

        records.forEach(r => {
            const score = r.overallScore || 0;
            if (score >= 81) counts.high++;
            else if (score >= 61) counts.moderate++;
            else if (score >= 41) counts.low++;
            else counts.veryLow++;

            if (r.domainScores) {
                DOMAINS.forEach(d => {
                    domainTotals[d] += (r.domainScores[d] || 0);
                });
            }
        });

        const domainAverages = DOMAINS.map(d =>
            total > 0 ? parseFloat((domainTotals[d] / total).toFixed(1)) : 0
        );

        return { total, counts, domainAverages };
    }, [data]);

    // ── Charts ───────────────────────────────────────────────────────────────
    const pieData = {
        labels: ['High (81–100%)', 'Moderate (61–80%)', 'Low (41–60%)', 'Very Low (0–40%)'],
        datasets: [{
            data: [
                analyticsData.counts.high,
                analyticsData.counts.moderate,
                analyticsData.counts.low,
                analyticsData.counts.veryLow,
            ],
            backgroundColor: ['#43A047', '#7CB342', '#FB8C00', '#E53935'],
            borderWidth: 0,
        }],
    };

    const pieOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'right', labels: { padding: 20, font: { size: 12 } } },
            datalabels: { display: false },
        },
    };

    const barData = {
        labels: DOMAINS,
        datasets: [{
            label: 'Average Score (%)',
            data: analyticsData.domainAverages,
            backgroundColor: DOMAINS.map(d => heartDomainInfo[d]?.color || '#0267D9'),
            borderRadius: 6,
            barThickness: 40,
        }],
    };

    const barOptions = {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            datalabels: {
                display: true,
                color: '#fff',
                anchor: 'end',
                align: 'bottom',
                font: { weight: 'bold', size: 12 },
                formatter: (value) => `${value}%`,
            },
        },
        scales: {
            y: { beginAtZero: true, max: 100, grid: { color: '#f0f0f0' } },
            x: { grid: { display: false } },
        },
    };

    const radarData = {
        labels: DOMAINS,
        datasets: [{
            label: 'H.E.A.R.T. Profile',
            data: analyticsData.domainAverages,
            backgroundColor: 'rgba(2, 103, 217, 0.15)',
            borderColor: '#0267D9',
            borderWidth: 2,
            pointBackgroundColor: DOMAINS.map(d => heartDomainInfo[d]?.color || '#0267D9'),
            pointRadius: 5,
        }],
    };

    const radarOptions = {
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                max: 100,
                ticks: { stepSize: 20, font: { size: 10 } },
                pointLabels: { font: { size: 12, weight: '600' } },
            },
        },
        plugins: {
            legend: { display: false },
            datalabels: { display: false },
        },
    };

    const captureAndDownload = async () => {
        await generatePDF(captureUIRef.current, {
            filename: 'HEART_Analytics_Report.pdf',
            orientation: 'l',
            pageSize: 'a4',
            margin: 5,
        });
        setDownloadDialogOpen(false);
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
            {/* ── AppBar ── */}
            <AppBar sx={{
                position: 'relative',
                backgroundColor: '#fff',
                color: '#334155',
                boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
            }}>
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                    <FavoriteIcon sx={{ color: '#E53935', mx: 1.5 }} />
                    <Typography sx={{ flex: 1, fontWeight: 700, fontSize: '1.2rem', color: '#334155' }}>
                        H.E.A.R.T. Analytics Dashboard — Educator Psychological Safety
                    </Typography>
                    <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mr: 2 }}>
                        Total Responses: {analyticsData.total}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: 4, backgroundColor: '#F8FBFF', minHeight: '100vh' }}>
                {/* Download Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                    <CustomButton
                        sx={{
                            minWidth: '160px', height: '40px', borderRadius: '8px',
                            background: 'linear-gradient(135deg, #E53935 0%, #C62828 100%)',
                        }}
                        typoSx={{ fontSize: '14px', fontWeight: 500 }}
                        text={localizationConstants.generateReport || 'Generate Report'}
                        onClick={() => setDownloadDialogOpen(true)}
                    />
                </Box>

                <Box ref={captureUIRef} sx={{ backgroundColor: '#fff', p: 3, borderRadius: '12px' }}>
                    {/* ── KPI Cards ── */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                        {[
                            {
                                label: 'Total Assessed', value: analyticsData.total,
                                color: '#0267D9', bg: '#E3F2FD', icon: <FavoriteIcon />,
                            },
                            {
                                label: 'High Safety (81–100%)', value: analyticsData.counts.high,
                                color: '#43A047', bg: '#E8F5E9', icon: <VerifiedUserIcon />,
                            },
                            {
                                label: 'Moderate (61–80%)', value: analyticsData.counts.moderate,
                                color: '#7CB342', bg: '#F1F8E9', icon: <TimelineIcon />,
                            },
                            {
                                label: 'Low / Very Low (<60%)', value: analyticsData.counts.low + analyticsData.counts.veryLow,
                                color: '#E53935', bg: '#FFEBEE', icon: <WarningAmberIcon />,
                            },
                        ].map(({ label, value, color, bg, icon }) => (
                            <Grid item xs={12} sm={6} md={3} key={label}>
                                <Card sx={{
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    borderLeft: `5px solid ${color}`,
                                }}>
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Box sx={{ p: 1.5, backgroundColor: bg, borderRadius: '8px', color }}>
                                            {icon}
                                        </Box>
                                        <Box>
                                            <Typography sx={{ color: '#64748B', fontSize: '0.85rem', fontWeight: 500 }}>
                                                {label}
                                            </Typography>
                                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155' }}>
                                                {value}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    {/* ── Charts ── */}
                    <Grid container spacing={3}>
                        {/* Pie */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                                        Safety Band Distribution
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: '280px' }}>
                                        {analyticsData.total > 0 ? (
                                            <Pie data={pieData} options={pieOptions} />
                                        ) : (
                                            <Typography sx={{ textAlign: 'center', color: '#94A3B8', mt: 10 }}>
                                                No data available.
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Bar */}
                        <Grid item xs={12} md={5}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                                        H.E.A.R.T. Domain Averages
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: '280px' }}>
                                        {analyticsData.total > 0 ? (
                                            <Bar data={barData} options={barOptions} />
                                        ) : (
                                            <Typography sx={{ textAlign: 'center', color: '#94A3B8', mt: 10 }}>
                                                No data available.
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Radar */}
                        <Grid item xs={12} md={3}>
                            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', height: '100%' }}>
                                <CardContent>
                                    <Typography sx={{ fontWeight: 700, color: '#334155', mb: 1 }}>
                                        H.E.A.R.T. Profile (Spider)
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box sx={{ height: '280px' }}>
                                        {analyticsData.total > 0 ? (
                                            <Radar data={radarData} options={radarOptions} />
                                        ) : (
                                            <Typography sx={{ textAlign: 'center', color: '#94A3B8', mt: 10 }}>
                                                No data available.
                                            </Typography>
                                        )}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* ── Domain Legend ── */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {DOMAINS.map(d => {
                            const info = heartDomainInfo[d];
                            return (
                                <Box key={d} sx={{
                                    display: 'flex', alignItems: 'center', gap: 1,
                                    px: 2, py: 1, borderRadius: '20px',
                                    border: `1px solid ${info.color}20`,
                                    backgroundColor: info.color + '10',
                                }}>
                                    <Box sx={{
                                        width: '10px', height: '10px',
                                        borderRadius: '50%', backgroundColor: info.color,
                                    }} />
                                    <Typography sx={{ fontSize: '12px', fontWeight: 600, color: info.color }}>
                                        {info.icon} {d}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#64748B' }}>
                                        — {analyticsData.domainAverages[DOMAINS.indexOf(d)]}%
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                </Box>
            </Box>

            {/* Download Confirmation Dialog */}
            <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)}>
                <Box sx={{ borderRadius: '10px', width: '500px', overflow: 'hidden' }}>
                    <Box sx={{ padding: '20px 30px' }}>
                        <Box className={flexStyles.flexRowCenterSpaceBetween}>
                            <Typography variant={typographyConstants.h4} sx={{ fontWeight: 500 }}>
                                {localizationConstants.generateReport || 'Generate Report'}
                            </Typography>
                            <CustomIcon
                                name={iconConstants.cancelRounded}
                                style={{ cursor: 'pointer', width: '26px', height: '26px' }}
                                svgStyle="width: 26px; height: 26px"
                                onClick={() => setDownloadDialogOpen(false)}
                            />
                        </Box>
                        <Typography color="globalElementColors.gray1" sx={{ mt: 2 }}>
                            {localizationConstants.downloadAnalyticalPDFReportMsg || 'Are you sure you want to download the PDF report?'}
                        </Typography>
                        <Box className={flexStyles.flexColumnCenter} sx={{ mt: 3 }}>
                            <CustomButton
                                sx={{ backgroundColor: 'globalElementColors.green2', minWidth: '182px', height: '44px' }}
                                text={localizationConstants.download || 'Download'}
                                onClick={captureAndDownload}
                                endIcon={
                                    <CustomIcon
                                        name={iconConstants.downloadWhite}
                                        style={{ width: '20px', height: '30px', marginLeft: '10px' }}
                                        svgStyle="width: 20px; height: 30px"
                                    />
                                }
                            />
                        </Box>
                    </Box>
                </Box>
            </Dialog>
        </Dialog>
    );
};

export default Heartanalytics;