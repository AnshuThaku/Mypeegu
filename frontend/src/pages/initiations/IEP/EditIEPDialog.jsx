import React, { lazy, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import CustomSuspense from '../../../components/commonComponents/CustomSuspense'
import { Dialog, Slide, Box } from '@mui/material'

import AIIEPDashboard from './AIIEP/AIIEPDashboard'
const EditIEP = lazy(() => import('./EditIEP'))

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const EditIEPDialog = ({ open, onClose, refreshListAndCloseDialog, rowDataSelected }) => {
    const IEPRef = useRef()
    const [disableSave, setDisableSave] = useState(true)
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup)
    
    const selectedYearObj = academicYears?.find(ay => ay._id === rowDataSelected?.academicYear)
    const yearName = selectedYearObj?.academicYear || '';

    // 🟢 Simple logic: 2026/27 hai toh AI, varna Purana
    const isAIYear = yearName.includes('2026') || yearName.includes('2027');

    return (
        <>
            {/* --- CASE 1: NAYA AI DASHBOARD --- */}
            {isAIYear ? (
                <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition} sx={{ zIndex: 1300 }}>
                    <Box sx={{ height: '100vh', bgcolor: '#F8FAFC', overflow: 'auto' }}>
                        <AIIEPDashboard
                            studentId={rowDataSelected?._id || rowDataSelected?.user_id}
                            academicYear={yearName || '2026-2027'}
                            onClose={() => refreshListAndCloseDialog('edit')}
                        />
                    </Box>
                </Dialog>
            ) : (
                /* --- CASE 2: PURANA LEGACY FORM --- */
                <CustomDialogWithBreadcrumbs
                    onClose={onClose}
                    clickableTitle={localizationConstants.IEP}
                    title={rowDataSelected?.studentName}
                    open={open}
                    saveBtnText={localizationConstants.save}
                    onSave={() => {
                        console.log("Saving...");
                        IEPRef.current?.handleSaveClick();
                    }}
                    disableSaveBtn={disableSave}
                >
                    <CustomSuspense>
                        <EditIEP
                            ref={IEPRef} // 🟢 Ref Connection
                            rowDataSelected={rowDataSelected}
                            onEditIEP={refreshListAndCloseDialog}
                            onSaveStateChange={setDisableSave}
                            handleClose={onClose}
                        />
                    </CustomSuspense>
                </CustomDialogWithBreadcrumbs>
            )}
        </>
    )
}

export default EditIEPDialog