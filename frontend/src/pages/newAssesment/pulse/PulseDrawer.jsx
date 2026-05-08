import React, { memo, useState } from 'react'
import {
    Box,
    Divider,
    Drawer,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import useCommonStyles from '../../../components/styles'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import CustomIcon from '../../../components/CustomIcon'
import { iconConstants } from '../../../resources/theme/iconConstants'
import CustomButton from '../../../components/CustomButton'
// DHYAN DEIN: Yahan se pulseOptions hata diya gaya hai kyunki ab wo har question ke object me hai
import { pulseQuestions } from './pulseConstants'

const PulseDrawer = ({
    open,
    onClose,
    questionSectionKey,
    category,
    total, // Ye actual calculated score hai
    rowData,
}) => {
    const flexStyles = useCommonStyles()
    const [isEditBtnClicked, setIsEditBtnClicked] = useState(false)

    let currentQuestionsList = pulseQuestions[questionSectionKey]
    if (!currentQuestionsList) {
        const fallbackKey = Object.keys(pulseQuestions).find((k) =>
            k.toLowerCase().includes(category?.toLowerCase())
        )
        currentQuestionsList = fallbackKey ? pulseQuestions[fallbackKey] : []
    }

    return (
        <Drawer
            anchor='right'
            sx={counsellorStyles.drawerSx}
            open={open}
            onClose={() => (isEditBtnClicked ? '' : onClose())}
        >
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Box className={flexStyles.flexRowCenterSpaceBetween} sx={{ pb: '12px', p: 3 }}>
                    <Typography variant={typographyConstants.h4} sx={{ fontWeight: 500, color: 'textColors.blue' }}>
                        {category}
                    </Typography>
                    <CustomIcon
                        name={iconConstants.cancelRounded}
                        style={{ cursor: 'pointer', width: '26px', height: '26px' }}
                        svgStyle={'width: 26px; height: 26px'}
                        onClick={() => {
                            onClose()
                            setIsEditBtnClicked(false)
                        }}
                    />
                </Box>

                <Divider />

                <Box sx={{ mt: '20px', p: 3, pt: 0, height: `calc(100vh - 200px)`, overflow: 'auto' }}>
                    {currentQuestionsList.length > 0 ? (
                        currentQuestionsList.map((qnObj, index) => {
                            // Object se question text aur options nikalna
                            const qnText = typeof qnObj === 'object' ? qnObj.question : qnObj;
                            const optionsList = typeof qnObj === 'object' ? (qnObj.options || []) : [];

                            let studentAnswer = ''
                            if (rowData) {
                                const exactKey = `${questionSectionKey}_${index}`
                                if (rowData.responses && rowData.responses[exactKey]) {
                                    studentAnswer = rowData.responses[exactKey].option || rowData.responses[exactKey]
                                } else if (rowData.responses) {
                                    const flat = Object.values(rowData.responses)
                                    const found = flat.find((item) => item.question === qnText)
                                    if (found) studentAnswer = found.option || found
                                }
                            }

                            return (
                                <Box sx={{ mb: '28px' }} key={index}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <Typography variant={typographyConstants.h5} sx={{ minWidth: '30px' }}>
                                            {`${index + 1}.`}
                                        </Typography>
                                        <Typography variant={typographyConstants.h5} sx={{ color: '#334155' }}>
                                            {qnText}
                                        </Typography>
                                    </Box>

                                    {/* Text type question ke liye TextBox warna RadioGroup */}
                                    {qnObj.type === 'text' ? (
                                         <Typography sx={{ mt: 1, pl: '30px', color: 'gray', fontStyle: 'italic' }}>
                                            {studentAnswer || 'No written response provided.'}
                                         </Typography>
                                    ) : (
                                        <FormControl sx={{ mt: '12px', pl: '30px' }} disabled={!isEditBtnClicked}>
                                            <RadioGroup row value={studentAnswer}>
                                                {optionsList.map((opt) => (
                                                    <FormControlLabel
                                                        key={opt}
                                                        value={opt}
                                                        control={<Radio size='small' />}
                                                        label={<Typography sx={{ fontSize: '14px' }}>{opt}</Typography>}
                                                        sx={{ mr: 3 }}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                    )}
                                </Box>
                            )
                        })
                    ) : (
                        <Typography sx={{ textAlign: 'center', mt: 4, color: 'gray' }}>
                            Questions mapping not found in constants.
                        </Typography>
                    )}
                </Box>
            </Box>

            <Box sx={{ mt: 'auto', p: 3, pt: 1 }}>
                <Box
                    className={flexStyles.flexRowCenterSpaceBetween}
                    sx={{
                        mb: '16px', borderRadius: '4px', backgroundColor: '#C8E6C9',
                        minHeight: '48px', pl: '16px', pr: '16px',
                    }}
                >
                    <Box className={flexStyles.flexRowCenterSpaceBetween} sx={{ width: '100%' }}>
                        <Typography variant={typographyConstants.h4} sx={{ color: '#2E7D32', fontWeight: 500 }}>
                            {localizationConstants.total || 'Total'}
                        </Typography>
                        <Typography variant={typographyConstants.h4} sx={{ color: '#2E7D32', fontWeight: 600 }}>
                            {total}
                        </Typography>
                    </Box>
                </Box>

                {!isEditBtnClicked ? (
                    <CustomButton
                        sx={{ minWidth: '100%', height: '48px', backgroundColor: '#0061d5', color: '#fff' }}
                        text={localizationConstants.edit || 'Edit'}
                        onClick={() => setIsEditBtnClicked(true)}
                    />
                ) : (
                    <Box className={flexStyles.flexRowCenterSpaceBetween} sx={{ gap: 2 }}>
                        <CustomButton
                            sx={{ flex: 1, height: '48px', backgroundColor: 'transparent', border: '1px solid', borderColor: 'globalElementColors.blue' }}
                            typoSx={{ color: 'textColors.black' }}
                            text={localizationConstants.cancel || 'Cancel'}
                            onClick={() => setIsEditBtnClicked(false)}
                        />
                        <CustomButton
                            sx={{ flex: 1, height: '48px', backgroundColor: '#0061d5' }}
                            text={localizationConstants.submit || 'Submit'}
                            endIcon={
                                <CustomIcon name={iconConstants.doneWhite} style={{ width: '20px', height: '20px', marginLeft: '8px' }} svgStyle={'width: 20px; height: 20px'} />
                            }
                            onClick={() => setIsEditBtnClicked(false)}
                        />
                    </Box>
                )}
            </Box>
        </Drawer>
    )
}

export default memo(PulseDrawer)