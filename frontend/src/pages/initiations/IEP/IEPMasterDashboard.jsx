import React, { useMemo, forwardRef } from 'react' // 🟢 forwardRef import kiya
import { useParams, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography, Dialog, Slide } from '@mui/material' // 🟢 Dialog aur Slide import kiya

// Import both IEP Dashboard components
import AIIEPDashboard from './AIIEP/AIIEPDashboard'
import EditIEP from './EditIEP'

// 🟢 NAYA: Full screen popup ke liye ek smooth Slide-up animation (Optional but looks premium)
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const IEPMasterDashboard = () => {
    const location = useLocation()

    // Extract studentId, academicYear and rowDataSelected from location state
    const studentId = location.state?.studentId
    const academicYear = location.state?.academicYear
    const rowDataSelected = location.state?.rowDataSelected

    const extractYearFromAcademicYear = (ayString) => {
        if (!ayString || typeof ayString !== 'string') return 0
        const yearMatch = ayString.match(/(\d{4})/)
        return yearMatch ? parseInt(yearMatch[1], 10) : 0
    }

    const startingYear = useMemo(() => {
        return extractYearFromAcademicYear(academicYear)
    }, [academicYear])

    if (!studentId) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: '#F8FAFC' }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, color: '#64748B' }}>
                    Loading student information...
                </Typography>
            </Box>
        )
    }

    // 🟢 NAYA LOGIC: Poore component ko <Dialog fullScreen> ke andar daal diya
    return (
        <Dialog 
            fullScreen 
            open={true} 
            TransitionComponent={Transition} 
            sx={{ zIndex: 99999 }} // Taaki sidebar aur navbar ke bhi upar aaye
        >
            <Box sx={{ width: '100%', height: '100%', bgcolor: '#F8FCFF' }}>
                {startingYear >= 2026 ? (
                    // 🟢 NEW AI-POWERED IEP SYSTEM (2026 and onwards)
                    <AIIEPDashboard
                        studentId={studentId}
                        academicYear={academicYear}
                        onClose={() => {
                            window.history.back() // Band karne par wapas table pe jayega
                        }}
                    />
                ) : (
                    // 🟢 LEGACY IEP SYSTEM (2025 and earlier)
                    <Box sx={{ p: 3, bgcolor: '#FFFFFF', minHeight: '100vh' }}>
                        <Typography variant="h6" sx={{ mb: 3, pb: 1, borderBottom: '1px solid #E2E8F0' }}>
                             Edit Legacy IEP
                        </Typography>
                        <EditIEP
                            studentId={studentId}
                            academicYear={academicYear}
                            rowDataSelected={rowDataSelected || { _id: studentId }}
                            onEditIEP={() => window.history.back()}
                            onSaveStateChange={(isDisabled) => { 
                                console.log("Legacy IEP Save State Disabled:", isDisabled) 
                            }} 
                            handleClose={() => window.history.back()}
                        />
                    </Box>
                )}
            </Box>
        </Dialog>
    )
}

export default IEPMasterDashboard