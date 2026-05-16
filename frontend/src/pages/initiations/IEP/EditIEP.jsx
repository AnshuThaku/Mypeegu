import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Box, IconButton, Typography, Button } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import IEPForm from './IEPForm'
import useCommonStyles from '../../../components/styles'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { useDispatch, useSelector } from 'react-redux'
import {
    addOrUpdate,
    formDataFormat,
    viewByIdAPICallFunction,
} from './iEPFunctions'
import { initialAddform } from './iEPConstants'
import { iconConstants } from '../../../resources/theme/iconConstants'
import CustomAlertDialog from '../../../components/CustomDialogForCancelling'
import { getUserFromLocalStorage } from '../../../utils/utils'
import CustomTextfield from '../../../components/CustomTextField'

const EditIEP = forwardRef(
    ({ onEditIEP, onSaveStateChange, rowDataSelected, handleClose }, ref) => {
        const dispatch = useDispatch()
        const flexStyles = useCommonStyles()
        const user = getUserFromLocalStorage()
        const { studentBaselineReport, viewByIDData } = useSelector(
            (store) => store.StudentIEP,
        )
        const { academicYears } = useSelector(
            (store) => store.dashboardSliceSetup,
        )
        const [addIEPData, setAddIEPData] = useState(initialAddform(user))
        const [oldAddIEPData, setOldAddIEPData] = useState(initialAddform(user))
        const [isBtnDisabled, setIsBtnDisabled] = useState(false)
        const [openConfirmationDialog, setOpenConfirmationDialog] =
            useState(false)
        const { appPermissions } = useSelector(
            (store) => store.dashboardSliceSetup,
        )

      // 🟢 FIX 1: Sirf ek API Call wala useEffect rakhiye
        useEffect(() => {
            if (rowDataSelected?._id) {
                console.log("Fetching Student Data for ID:", rowDataSelected._id);
                viewByIdAPICallFunction(dispatch, rowDataSelected._id)
            }
            // 🟢 STRICTLY EMPTY ARRAY: Taki sirf modal khulne par 1 baar call ho
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []) 

        // 🟢 FIX 2: Data format hone ka useEffect
        useEffect(() => {
            if (viewByIDData && Object.keys(viewByIDData).length > 0) {
                console.log("Formatting Data for Form...");
                formDataFormat(
                    viewByIDData,
                    setAddIEPData,
                    setOldAddIEPData,
                    user,
                );
            }
        }, [viewByIDData, setAddIEPData, setOldAddIEPData, user]);
useEffect(() => {
    if (viewByIDData && Object.keys(viewByIDData).length > 0) {
        console.log("Formatting Data for Form...");
        formDataFormat(
            viewByIDData,
            setAddIEPData,
            setOldAddIEPData,
            user,
        );
    }
}, [viewByIDData]);

        const handleSaveClick = () => {
            addOrUpdate(
                {
                    selectdAYs: viewByIDData.academicYear,
                    selectdSchools: viewByIDData.school,
                },
                addIEPData,
                true,
                dispatch,
                {
                    user_id: viewByIDData.user_id,
                    studentName: viewByIDData.studentName,
                },
                addIEPData?.Evolution?.[localizationConstants.reportLink]
                    ?.fileName?.length > 0,
                studentBaselineReport?.isBaseLineRecordExist ?? false,
                onEditIEP, // Save hone ke baad master dashboard me list refresh karne ke liye
                viewByIDData._id,
                handleClose, // Save hone ke baad close karne ke liye
            )
        }

        // const disableSave =
        //     JSON.stringify(oldAddIEPData) === JSON.stringify(addIEPData) ||
        //     isBtnDisabled
        const disableSave = false

        useEffect(() => {
            if (onSaveStateChange) {
                onSaveStateChange(disableSave)
            }
        }, [disableSave, onSaveStateChange])

        useImperativeHandle(ref, () => ({
            handleSaveClick,
            disableSave,
        }))

        const AY =
            academicYears.find((obj) => obj._id === viewByIDData?.academicYear)
                ?.academicYear || ''

        return (
            <Box 
                className={flexStyles.flexColumn} 
                sx={{ 
                    p: { xs: 2, md: 4 }, 
                    maxWidth: '1200px', 
                    margin: '0 auto', 
                    width: '100%', 
                    bgcolor: '#FFFFFF', 
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                {/* 🟢 HEADER: Title + Actions (Save & Close) */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 3, 
                    pb: 2, 
                    borderBottom: '1px solid #E2E8F0',
                    position: 'sticky',
                    top: 0,
                    bgcolor: '#FFFFFF',
                    zIndex: 10
                }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E293B' }}>
                        Edit Legacy IEP
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* 🟢 SAVE BUTTON */}
                        <Button 
                            variant="contained" 
                            onClick={handleSaveClick} 
                            disabled={disableSave}
                            sx={{ 
                                bgcolor: '#3B82F6', 
                                color: 'white',
                                borderRadius: '8px',
                                textTransform: 'none',
                                px: 4,
                                '&:hover': { bgcolor: '#2563EB' },
                                '&.Mui-disabled': {
                                    bgcolor: '#CBD5E1',
                                    color: '#94A3B8'
                                }
                            }}
                        >
                            {localizationConstants.save || 'Save'}
                        </Button>

                        {/* 🟢 CROSS BUTTON */}
                        <IconButton 
                            onClick={() => {
                                // Agar user ne form me change kiya hai toh cross dabane par warning do
                                if (!disableSave) {
                                    setOpenConfirmationDialog(true)
                                } else {
                                    handleClose()
                                }
                            }} 
                            sx={{ 
                                color: '#64748B', 
                                '&:hover': { bgcolor: '#FEE2E2', color: '#EF4444' } 
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                {/* 🟢 FORM CONTENT */}
                <CustomTextfield
                    formSx={{ width: '250px', mb: 3 }}
                    propSx={{ height: '44px' }}
                    labelText={localizationConstants.academicYear}
                    labelTypoSx={{ pb: '5px', pt: '1px' }}
                    name='AY'
                    value={AY}
                    disabled={true}
                />

<IEPForm
    addIEPData={addIEPData}
    setAddIEPData={setAddIEPData}
    isBaselineExist={studentBaselineReport?.isBaseLineRecordExist ?? false}
    
    readOnly={false} // 🟢 Yahan hardcoded 'false' likh do! 
    
    studentBaselineReport={studentBaselineReport}
    setIsBtnDisabled={setIsBtnDisabled}
/>
                
                {/* 🟢 WARNING DIALOG (Agar unsaved changes hain aur cross dabaya) */}
                <CustomAlertDialog
                    isOpen={openConfirmationDialog}
                    title={localizationConstants.confirmation}
                    iconName={iconConstants.alertOctagon}
                    message={localizationConstants.cancelConfirmationMsg || "You have unsaved changes. Are you sure you want to cancel?"}
                    titleSx={{
                        color: 'textColors.red',
                        fontWeight: 500,
                        pb: '20px',
                        pt: '25px',
                    }}
                    titleTypoVariant={typographyConstants.h4}
                    messageTypoVariant={typographyConstants.h5}
                    leftButtonText={localizationConstants.cancel}
                    rightButtonText={localizationConstants.yes}
                    onLeftButtonClick={() => {
                        setOpenConfirmationDialog(false)
                    }}
                    onRightButtonClick={() => {
                        // Yes pe click kiya toh changes discard karke wapas jao
                        setOpenConfirmationDialog(false)
                        handleClose()
                    }}
                />
            </Box>
        )
    }
)

export default EditIEP