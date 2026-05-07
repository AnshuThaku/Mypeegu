import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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
import { getBackgroundColor, handleEditBaseline } from './baselineFunctions'

const BaselineDrawer = ({
    baselineDrawerOpen,
    setBaselineDrawerOpen,
    data,
    category,
    total,
    rowId,
    pageSize,
    onEditBaseline,
    isVersion2,
}) => {
    const flexStyles = useCommonStyles()
    const [isEditBtnClicked, setIsEditBtnClicked] = useState(false)
    const [selectedData, setSelectedData] = useState([])
    const [count, setCount] = useState(0)
    const dispatch = useDispatch()
    const { appPermissions } = useSelector((store) => store.dashboardSliceSetup)

    const currentQuestionsList = isVersion2 
        ? localizationConstants.baselineQns_v2 
        : localizationConstants.baselineQns_v1;

    const handleQuestionStatus = (index, status) => {
        const list = [...selectedData]
        list[index] = { ...list[index], status }
        
        let newTotal = 0
        list.forEach((li) => {
            if (li.status === 'Not Achieved') {
                newTotal += 2;
            } else if (li.status === 'Emerging') {
                newTotal += 1;
            } else if (li.status === 'Achieved') {
                newTotal += 0;
            } 
            else if (li.status === true || li.status === 'yes') {
                newTotal += 1;
            }
        })
        
        setCount(newTotal)
        setSelectedData(list)
    }

    useEffect(() => {
        setSelectedData(data)
        setCount(total)
    }, [data, total])

    return (
        <Drawer
            anchor='right'
            sx={counsellorStyles.drawerSx}
            open={baselineDrawerOpen}
            onClose={() =>
                isEditBtnClicked ? '' : setBaselineDrawerOpen(false)
            }
        >
            <Box sx={{ flexGrow: 1 }}>
                <Box
                    className={flexStyles.flexRowCenterSpaceBetween}
                    sx={{ pb: '12px' }}
                >
                    <Typography
                        variant={typographyConstants.h4}
                        sx={{ fontWeight: 500, color: 'textColors.blue' }}
                    >
                        {category}
                    </Typography>
                    <CustomIcon
                        name={iconConstants.cancelRounded}
                        style={{
                            cursor: 'pointer',
                            width: '26px',
                            height: '26px',
                        }}
                        svgStyle={'width: 26px; height: 26px'}
                        onClick={() => {
                            setBaselineDrawerOpen(false)
                            setIsEditBtnClicked(false)
                        }}
                    />
                </Box>

                <Divider />

                <Box
                    sx={{
                        mt: '20px',
                        height: appPermissions?.ObservationManagement?.edit
                            ? `calc(100vh - 270px)`
                            : `calc(100vh - 200px)`,
                        overflow: 'auto',
                    }}
                >
                    {selectedData?.map((question, index) => {
                        return (
                            <Box sx={{ mb: '28px' }} key={index}>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <Typography
                                        variant={typographyConstants.h5}
                                        sx={{ minWidth: '20px' }}
                                    >
                                        {`${index + 1}.`}
                                    </Typography>
                                    <Typography
                                        variant={typographyConstants.h5}
                                    >
                                        {`${currentQuestionsList[question?.question]}`}
                                    </Typography>
                                </Box>

                                <FormControl
                                    sx={{ mt: '24px', pl: '20px' }}
                                    disabled={!isEditBtnClicked}
                                >
                                    <RadioGroup
                                        row
                                        aria-labelledby='demo-row-radio-buttons-group-label'
                                        name={`row-radio-buttons-group-${index}`}
                                    >
                                        {isVersion2 ? (
                                            <>
                                                <FormControlLabel
                                                    value='Achieved'
                                                    control={<Radio checked={question?.status === 'Achieved' || question?.status === 'yes' || question?.status === true} />}
                                                    label='Achieved'
                                                    onClick={() => { if (isEditBtnClicked) handleQuestionStatus(index, 'Achieved') }}
                                                />
                                                <FormControlLabel
                                                    value='Emerging'
                                                    control={<Radio checked={question?.status === 'Emerging'} />}
                                                    label='Emerging'
                                                    onClick={() => { if (isEditBtnClicked) handleQuestionStatus(index, 'Emerging') }}
                                                />
                                                <FormControlLabel
                                                    value='Not Achieved'
                                                    control={<Radio checked={question?.status === 'Not Achieved' || question?.status === 'no' || question?.status === false} />}
                                                    label='Not Achieved'
                                                    onClick={() => { if (isEditBtnClicked) handleQuestionStatus(index, 'Not Achieved') }}
                                                />
                                            </>
                                        ) : (
                                            <>
                                                <FormControlLabel
                                                    value='Yes'
                                                    control={<Radio checked={question?.status === 'yes' || question?.status === true || question?.status === 'Achieved'} />}
                                                    label='Yes'
                                                    onClick={() => { if (isEditBtnClicked) handleQuestionStatus(index, 'yes') }}
                                                />
                                                <FormControlLabel
                                                    value='No'
                                                    control={<Radio checked={question?.status === 'no' || question?.status === false || question?.status === 'Not Achieved'} />}
                                                    label='No'
                                                    onClick={() => { if (isEditBtnClicked) handleQuestionStatus(index, 'no') }}
                                                />
                                            </>
                                        )}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        )
                    })}
                </Box>
            </Box>
            <Box
                className={flexStyles.flexRowCenterSpaceBetween}
                sx={{
                    mb: '36px',
                    borderRadius: '4px',
                    backgroundColor: getBackgroundColor(count, true),
                    minHeight: '50px',
                    pl: '16px',
                    pr: '16px',
                }}
            >
                <Box
                    className={flexStyles.flexRowCenterSpaceBetween}
                    sx={{ width: '100%' }}
                >
                    <Typography variant={typographyConstants.h4}>
                        {localizationConstants.total}
                    </Typography>
                    <Typography variant={typographyConstants.h4}>
                        {count}
                    </Typography>
                </Box>
            </Box>
            {isEditBtnClicked && (
                <Box
                    className={flexStyles.flexRowCenterSpaceBetween}
                    sx={{ mb: '36px', mt: '-20px' }}
                >
                    <CustomButton
                        sx={{
                            minWidth: '192px',
                            height: '60px',
                            backgroundColor: 'transparent',
                            border: '1px solid',
                            borderColor: 'globalElementColors.blue',
                        }}
                        typoSx={{ color: 'textColors.black' }}
                        text={localizationConstants.cancel}
                        onClick={() => setIsEditBtnClicked(false)}
                    />
                    <CustomButton
                        sx={{ minWidth: '192px', height: '60px' }}
                        text={localizationConstants.submit}
                        endIcon={
                            <CustomIcon
                                name={iconConstants.doneWhite}
                                style={{
                                    width: '24px',
                                    height: '24px',
                                    marginLeft: '10px',
                                }}
                                svgStyle={'width: 24px; height: 24px'}
                            />
                        }
                        onClick={() => {
                            handleEditBaseline(
                                selectedData,
                                dispatch,
                                category,
                                rowId,
                                count,
                                setBaselineDrawerOpen,
                                pageSize,
                                onEditBaseline,
                            )
                            setTimeout(() => {
                                setIsEditBtnClicked(false)
                            }, 1000)
                        }}
                    />
                </Box>
            )}{' '}
            {!isEditBtnClicked &&
                appPermissions?.ObservationManagement?.edit && (
                    <CustomButton
                        sx={{ mb: '36px', mt: '-20px' }}
                        text={localizationConstants.edit}
                        onClick={() => setIsEditBtnClicked(true)}
                    />
                )}
        </Drawer>
    )
}

export default memo(BaselineDrawer)