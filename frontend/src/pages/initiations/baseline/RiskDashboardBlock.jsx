// import React, { useState, useEffect } from 'react'
// import {
// 	Box,
// 	Typography,
// 	Table,
// 	TableBody,
// 	TableCell,
// 	TableContainer,
// 	TableHead,
// 	TableRow,
// 	Chip,
// 	CircularProgress,
// 	Paper,
// 	Button,
// } from '@mui/material'
// import DownloadIcon from '@mui/icons-material/Download'
// import { riskLevelColors, supportLevels } from './baselineConstants'
// import { apiEndPoints } from '../../../utils/apiConstants'
// import myPeeguAxios from '../../../utils/myPeeguAxios'
// import * as XLSX from 'xlsx'

// // Common table cell styles
// const headerCellSx = {
// 	fontWeight: 600,
// 	fontSize: '12px',
// 	backgroundColor: '#F0F7FF',
// 	borderBottom: '1px solid #E2E2E2',
// 	color: '#64748B',
// 	whiteSpace: 'nowrap',
// }

// const bodyCellSx = {
// 	fontSize: '13px',
// 	fontWeight: 400,
// 	color: '#334155',
// }

// const RiskDashboardBlock = ({ filter, academicYears }) => {
// 	const [loading, setLoading] = useState(false)
// 	const [data, setData] = useState({ students: [], summary: {}, totalCount: 0 })

// 	useEffect(() => {
// 		if (filter?.schoolIds) {
// 			fetchRiskData()
// 		}
// 		// eslint-disable-next-line react-hooks/exhaustive-deps
// 	}, [filter?.schoolIds, JSON.stringify(filter?.classroomIds), JSON.stringify(academicYears)])

// 	const fetchRiskData = async () => {
// 		setLoading(true)
// 		try {
// 			const response = await myPeeguAxios.post(apiEndPoints.baselineRiskDashboard, {
// 				filter: {
// 					schoolIds: filter.schoolIds,
// 					classroomIds: filter.classroomIds,
// 					academicYear: academicYears,
// 				},
// 			})
// 			setData(response.data)
// 		} catch (error) {
// 			console.error('Error fetching risk dashboard data:', error)
// 		} finally {
// 			setLoading(false)
// 		}
// 	}

// 	const getScoreColor = (score) => {
// 		const numScore = parseInt(score) || 0
// 		if (numScore <= 3) return supportLevels.red.color
// 		if (numScore <= 5) return supportLevels.orange.color
// 		return supportLevels.green.color
// 	}

// 	const handleExcelDownload = () => {
// 		if (!data.students || data.students.length === 0) return

// 		const exportData = data.students.map((student) => ({
// 			'Student ID': student.user_id,
// 			'Student Name': student.studentName,
// 			Gender: student.gender || '-',
// 			Class: student.className,
// 			Section: student.section,
// 			'Red Domains': student.redDomainCount,
// 			'Affected Domains': student.redDomains?.join(', ') || '-',
// 			Physical: student.Physical,
// 			Social: student.Social,
// 			Emotional: student.Emotional,
// 			Cognitive: student.Cognitive,
// 			Language: student.Language,
// 		}))

// 		const worksheet = XLSX.utils.json_to_sheet(exportData)
// 		const workbook = XLSX.utils.book_new()
// 		XLSX.utils.book_append_sheet(workbook, worksheet, 'At-Risk Students')
// 		XLSX.writeFile(workbook, 'Baseline_Risk_Dashboard.xlsx')
// 	}

// 	const { summary } = data

// 	if (!filter?.schoolIds) {
// 		return null
// 	}

// 	return (
// 		<Paper
// 			elevation={0}
// 			sx={{
// 				borderRadius: '8px',
// 				border: '1px solid #E2E2E2',
// 				overflow: 'hidden',
// 				marginTop: '20px',
// 			}}
// 		>
// 			{/* Header */}
// 			<Box
// 				sx={{
// 					display: 'flex',
// 					justifyContent: 'space-between',
// 					alignItems: 'center',
// 					padding: '12px 16px',
// 					borderBottom: '1px solid #E2E2E2',
// 					backgroundColor: '#F0F7FF',
// 				}}
// 			>
// 				<Box>
// 					<Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#C62828' }}>
// 						Risk Dashboard - Students Needing Support
// 					</Typography>
// 					<Typography sx={{ fontSize: '12px', color: '#64748B', mt: '2px' }}>
// 						Prioritize students with multiple red domains for immediate intervention
// 					</Typography>
// 				</Box>
// 				<Button
// 					size="small"
// 					variant="outlined"
// 					startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
// 					onClick={handleExcelDownload}
// 					disabled={!data.students?.length}
// 					sx={{
// 						textTransform: 'none',
// 						fontSize: '12px',
// 						padding: '4px 12px',
// 						borderColor: '#E2E2E2',
// 						color: '#64748B',
// 						'&:hover': {
// 							borderColor: '#64748B',
// 							backgroundColor: 'rgba(0,0,0,0.02)',
// 						},
// 					}}
// 				>
// 					Export
// 				</Button>
// 			</Box>

// 			{/* Content */}
// 			<Box sx={{ padding: '16px' }}>
// 				{loading ? (
// 					<Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
// 						<CircularProgress size={24} />
// 					</Box>
// 				) : (
// 					<>
// 						{/* Summary Cards */}
// 						<Box
// 							sx={{
// 								display: 'flex',
// 								gap: 1,
// 								marginBottom: '16px',
// 								flexWrap: 'wrap',
// 							}}
// 						>
// 							<Box
// 								sx={{
// 									flex: '1 1 80px',
// 									backgroundColor: '#FFEBEE',
// 									borderRadius: '6px',
// 									padding: '8px 12px',
// 									textAlign: 'center',
// 									minWidth: '70px',
// 								}}
// 							>
// 								<Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#C62828' }}>
// 									{summary?.total || 0}
// 								</Typography>
// 								<Typography sx={{ fontSize: '10px', color: '#64748B' }}>
// 									Total At-Risk
// 								</Typography>
// 							</Box>
// 							{[5, 4, 3, 2, 1].map((count) => (
// 								<Box
// 									key={count}
// 									sx={{
// 										flex: '1 1 60px',
// 										backgroundColor: '#FFF',
// 										border: `1px solid ${riskLevelColors[count]}`,
// 										borderRadius: '6px',
// 										padding: '8px',
// 										textAlign: 'center',
// 										minWidth: '50px',
// 									}}
// 								>
// 									<Typography sx={{ fontWeight: 600, fontSize: '16px', color: riskLevelColors[count] }}>
// 										{summary?.[`${['one', 'two', 'three', 'four', 'five'][count - 1]}Red`] || 0}
// 									</Typography>
// 									<Typography sx={{ fontSize: '9px', color: '#64748B' }}>
// 										{count} Red
// 									</Typography>
// 								</Box>
// 							))}
// 						</Box>

// 						{/* Students Table */}
// 						<TableContainer
// 							sx={{
// 								maxHeight: 300,
// 								border: '1px solid #E2E2E2',
// 								borderRadius: '8px',
// 							}}
// 						>
// 							<Table stickyHeader size="small">
// 								<TableHead>
// 									<TableRow>
// 										<TableCell sx={headerCellSx}>Student ID</TableCell>
// 										<TableCell sx={headerCellSx}>Name</TableCell>
// 										<TableCell sx={headerCellSx}>Class</TableCell>
// 										<TableCell sx={headerCellSx}>Risk</TableCell>
// 										<TableCell sx={headerCellSx}>Affected Domains</TableCell>
// 										<TableCell align="center" sx={headerCellSx}>Phy</TableCell>
// 										<TableCell align="center" sx={headerCellSx}>Soc</TableCell>
// 										<TableCell align="center" sx={headerCellSx}>Emo</TableCell>
// 										<TableCell align="center" sx={headerCellSx}>Cog</TableCell>
// 										<TableCell align="center" sx={headerCellSx}>Lan</TableCell>
// 									</TableRow>
// 								</TableHead>
// 								<TableBody>
// 									{data.students?.length === 0 ? (
// 										<TableRow>
// 											<TableCell colSpan={10} align="center" sx={{ padding: '30px' }}>
// 												<Typography sx={{ fontSize: '13px', color: '#64748B' }}>
// 													No at-risk students found
// 												</Typography>
// 											</TableCell>
// 										</TableRow>
// 									) : (
// 										data.students?.map((student) => (
// 											<TableRow
// 												key={student._id}
// 												sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' } }}
// 											>
// 												<TableCell sx={bodyCellSx}>{student.user_id}</TableCell>
// 												<TableCell sx={bodyCellSx}>{student.studentName}</TableCell>
// 												<TableCell sx={bodyCellSx}>
// 													{student.className}{student.section ? ` - ${student.section}` : ''}
// 												</TableCell>
// 												<TableCell sx={bodyCellSx}>
// 													<Chip
// 														label={`${student.redDomainCount}`}
// 														size="small"
// 														sx={{
// 															backgroundColor: riskLevelColors[student.redDomainCount] || riskLevelColors[1],
// 															color: '#FFF',
// 															fontWeight: 600,
// 															fontSize: '11px',
// 															height: '20px',
// 															minWidth: '24px',
// 														}}
// 													/>
// 												</TableCell>
// 												<TableCell sx={bodyCellSx}>
// 													<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2px' }}>
// 														{student.redDomains?.map((domain) => (
// 															<Chip
// 																key={domain}
// 																label={domain.substring(0, 3)}
// 																size="small"
// 																sx={{
// 																	backgroundColor: supportLevels.red.color,
// 																	color: '#FFF',
// 																	fontSize: '9px',
// 																	height: '16px',
// 																	'& .MuiChip-label': { px: '4px' },
// 																}}
// 															/>
// 														))}
// 													</Box>
// 												</TableCell>
// 												<TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600, color: getScoreColor(student.Physical) }}>
// 													{student.Physical || '-'}
// 												</TableCell>
// 												<TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600, color: getScoreColor(student.Social) }}>
// 													{student.Social || '-'}
// 												</TableCell>
// 												<TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600, color: getScoreColor(student.Emotional) }}>
// 													{student.Emotional || '-'}
// 												</TableCell>
// 												<TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600, color: getScoreColor(student.Cognitive) }}>
// 													{student.Cognitive || '-'}
// 												</TableCell>
// 												<TableCell align="center" sx={{ ...bodyCellSx, fontWeight: 600, color: getScoreColor(student.Language) }}>
// 													{student.Language || '-'}
// 												</TableCell>
// 											</TableRow>
// 										))
// 									)}
// 								</TableBody>
// 							</Table>
// 						</TableContainer>

// 						{data.students?.length > 0 && (
// 							<Typography
// 								sx={{ fontSize: '11px', color: '#64748B', marginTop: '8px', textAlign: 'right' }}
// 							>
// 								{data.students?.length} at-risk students (sorted by severity)
// 							</Typography>
// 						)}
// 					</>
// 				)}
// 			</Box>
// 		</Paper>
// 	)
// }

// export default RiskDashboardBlock


import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Paper,
    Button,
    Tooltip
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import ShieldIcon from '@mui/icons-material/Shield' 
import { riskLevelColors, supportLevels } from './baselineConstants'
import { apiEndPoints } from '../../../utils/apiConstants'
import myPeeguAxios from '../../../utils/myPeeguAxios'
import * as XLSX from 'xlsx'

// Common table cell styles
const headerCellSx = {
    fontWeight: 600,
    fontSize: '12px',
    backgroundColor: '#F0F7FF',
    borderBottom: '1px solid #E2E2E2',
    color: '#64748B',
    whiteSpace: 'nowrap',
}

const bodyCellSx = {
    fontSize: '13px',
    fontWeight: 400,
    color: '#334155',
}

const RiskDashboardBlock = ({ filter, academicYears }) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({ students: [], summary: {}, totalCount: 0 })

    useEffect(() => {
        if (filter?.schoolIds) {
            fetchRiskData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter?.schoolIds, JSON.stringify(filter?.classroomIds), JSON.stringify(academicYears)])

    const fetchRiskData = async () => {
        setLoading(true)
        try {
            const response = await myPeeguAxios.post(apiEndPoints.baselineRiskDashboard, {
                filter: {
                    schoolIds: filter.schoolIds,
                    classroomIds: filter.classroomIds,
                    academicYear: academicYears,
                },
            })
            setData(response.data)
        } catch (error) {
            console.error('Error fetching risk dashboard data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score) => {
        const numScore = parseInt(score) || 0
        if (numScore <= 3) return supportLevels.red.color
        if (numScore <= 5) return supportLevels.orange.color
        return supportLevels.green.color
    }

    const handleExcelDownload = () => {
        if (!data.students || data.students.length === 0) return

        const exportData = data.students.map((student) => ({
            'Student ID': student.user_id,
            'Student Name': student.studentName,
            'Risk Score': student.redDomainCount,
            'Strength Score': student.overallStrengthScore || 0,
            'Class': student.className,
            'Section': student.section,
            'Physical': student.Physical,
            'Social': student.Social,
            'Emotional': student.Emotional,
            'Cognitive': student.Cognitive,
            'Language': student.Language,
        }))

        const worksheet = XLSX.utils.json_to_sheet(exportData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'At-Risk Students')
        XLSX.writeFile(workbook, 'Baseline_Risk_Resilience_Report.xlsx')
    }

    const { summary } = data

    if (!filter?.schoolIds) return null

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: '8px',
                border: '1px solid #E2E2E2',
                overflow: 'hidden',
                marginTop: '20px',
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    borderBottom: '1px solid #E2E2E2',
                    backgroundColor: '#F0F7FF',
                }}
            >
                <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#C62828' }}>
                        🛡️ Risk vs Resilience Dashboard
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#64748B', mt: '2px' }}>
                        Identifying students with high risk but strong protective buffers
                    </Typography>
                </Box>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
                    onClick={handleExcelDownload}
                    disabled={!data.students?.length}
                    sx={{
                        textTransform: 'none',
                        fontSize: '12px',
                        padding: '4px 12px',
                        borderColor: '#E2E2E2',
                        color: '#64748B',
                    }}
                >
                    Export
                </Button>
            </Box>

            {/* Content */}
            <Box sx={{ padding: '16px' }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                        <CircularProgress size={24} />
                    </Box>
                ) : (
                    <>
                        {/* Summary Cards */}
                        <Box sx={{ display: 'flex', gap: 1, marginBottom: '16px', flexWrap: 'wrap' }}>
                            <Box sx={{ flex: '1 1 80px', backgroundColor: '#FFEBEE', borderRadius: '6px', padding: '8px 12px', textAlign: 'center' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#C62828' }}>{summary?.total || 0}</Typography>
                                <Typography sx={{ fontSize: '10px', color: '#64748B' }}>Total At-Risk</Typography>
                            </Box>
                            <Box sx={{ flex: '1 1 80px', backgroundColor: '#ECFDF5', borderRadius: '6px', padding: '8px 12px', textAlign: 'center', border: '1px solid #A7F3D0' }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '18px', color: '#059669' }}>
                                    {data.students.filter(s => (s.overallStrengthScore || 0) >= 10).length}
                                </Typography>
                                <Typography sx={{ fontSize: '10px', color: '#047857' }}>Resilient Students</Typography>
                            </Box>
                        </Box>

                        {/* Students Table */}
                        <TableContainer sx={{ maxHeight: 350, border: '1px solid #E2E2E2', borderRadius: '8px' }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={headerCellSx}>Name</TableCell>
                                        <TableCell sx={headerCellSx} align="center">Risk</TableCell>
                                        <TableCell sx={headerCellSx} align="center">Strength</TableCell>
                                        <TableCell align="center" sx={headerCellSx}>Phy</TableCell>
                                        <TableCell align="center" sx={headerCellSx}>Soc</TableCell>
                                        <TableCell align="center" sx={headerCellSx}>Emo</TableCell>
                                        <TableCell align="center" sx={headerCellSx}>Cog</TableCell>
                                        <TableCell align="center" sx={headerCellSx}>Lan</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.students?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ padding: '30px' }}>
                                                <Typography sx={{ fontSize: '13px', color: '#64748B' }}>No students found</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        data.students?.map((student) => {
                                            const isResilient = (student.overallStrengthScore || 0) >= 10;
                                            return (
                                                <TableRow key={student._id} sx={{ '&:hover': { backgroundColor: 'rgba(0,0,0,0.02)' } }}>
                                                    <TableCell sx={{ ...bodyCellSx, fontWeight: 500 }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {student.studentName}
                                                            {isResilient && (
                                                                <Tooltip title="Strong Protective Buffer">
                                                                    <ShieldIcon sx={{ fontSize: 16, color: '#059669' }} />
                                                                </Tooltip>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip label={student.redDomainCount} size="small" sx={{ backgroundColor: riskLevelColors[student.redDomainCount] || '#EF4444', color: '#FFF', fontWeight: 700, height: 20 }} />
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography sx={{ fontSize: '13px', fontWeight: 700, color: isResilient ? '#059669' : '#64748B' }}>
                                                            {student.overallStrengthScore || 0}
                                                        </Typography>
                                                    </TableCell>
                                                    {['Physical', 'Social', 'Emotional', 'Cognitive', 'Language'].map(dom => (
                                                        <TableCell key={dom} align="center" sx={{ ...bodyCellSx, fontWeight: 600, color: getScoreColor(student[dom]) }}>
                                                            {student[dom] || '0'}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}
            </Box>
        </Paper>
    )
}

export default RiskDashboardBlock


