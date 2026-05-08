import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, Divider, Drawer, FormControl, FormControlLabel, Radio, RadioGroup, Typography,
} from '@mui/material';
import { counsellorStyles } from '../../counsellors/counsellorsStyles';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import CustomIcon from '../../../components/CustomIcon';
import { iconConstants } from '../../../resources/theme/iconConstants';
import CustomButton from '../../../components/CustomButton';
import {
    selQns_vA,
    selQns_vB,
    scoringOptions_vA,
    scoringOptions_vB,
    selScoringMapping,
    getSELTier,
} from './SELConstants';

const SELDrawer = ({
    open,
    onClose,
    domainKey,
    displayLabel,
    total,
    rowData,
    onEditSuccess,
}) => {
    const dispatch = useDispatch();
    const { appPermissions } = useSelector((store) => store.dashboardSliceSetup);

    const [isEditBtnClicked, setIsEditBtnClicked] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [count, setCount] = useState(0);

    // CHECK SAVED VERSION EXACTLY
    const version = rowData?.version || 'versionA';
    const sourceQuestions = version === 'versionA' ? selQns_vA : selQns_vB;
    const optionsList = version === 'versionA' ? scoringOptions_vA : scoringOptions_vB;
    const mapping = selScoringMapping[version];

    // Fetch Questions based on exact DomainKey
    const currentQuestionsList = sourceQuestions[domainKey] || [];

    // Function to populate initial data
    const populateInitialData = () => {
        if (currentQuestionsList.length > 0) {
            const initialList = currentQuestionsList.map((qn, idx) => {
                const exactKey = `${domainKey}_${idx}`;
                let savedOption = '';

                // Fetch saved response from cache memory
                if (rowData?.responses && rowData.responses[exactKey]) {
                    savedOption = rowData.responses[exactKey].option || rowData.responses[exactKey];
                } else if (rowData?.responses) {
                    const flat = Object.values(rowData.responses);
                    const found = flat.find(item => item.question === qn);
                    if (found) savedOption = found.option || found;
                }

                // SEL Reverse Scoring logic mapping for initial load
                let mappedPoints = mapping[savedOption] || 0;
                if (qn.includes('(R)') && mappedPoints > 0) {
                    if (version === 'versionA') mappedPoints = 4 - mappedPoints; 
                    else mappedPoints = 5 - mappedPoints; 
                }

                return {
                    question: qn,
                    option: savedOption,
                    points: mappedPoints
                };
            });

            setSelectedData(initialList);
            setCount(total || 0);
        } else {
            setSelectedData([]);
            setCount(0);
        }
    };

    useEffect(() => {
        populateInitialData();
    }, [rowData, domainKey, currentQuestionsList, total, open, mapping, version]);

    const handleOptionChange = (index, newOption) => {
        const list = [...selectedData];
        const questionText = list[index].question;
        let points = mapping[newOption] || 0;
        
        // Handle Reverse Scoring during edit
        if (questionText.includes('(R)')) {
            if (version === 'versionA') points = 4 - points; 
            else points = 5 - points; 
        }

        list[index] = { ...list[index], option: newOption, points };
        
        // Recalculate Decimal Average for SEL
        const totalActual = list.reduce((sum, item) => sum + (item.points || 0), 0);
        const domainAvg = list.length > 0 ? parseFloat((totalActual / list.length).toFixed(1)) : 0;
        
        setCount(domainAvg);
        setSelectedData(list);
    };

    const handleSave = () => {
        const updatedResponses = { ...(rowData?.responses || {}) };
        selectedData.forEach((item, idx) => {
            updatedResponses[`${domainKey}_${idx}`] = { 
                question: item.question, 
                option: item.option, 
                points: item.points 
            };
        });

        const updatedRecord = {
            ...rowData,
            responses: updatedResponses,
            domainScores: {
                ...rowData.domainScores,
                [domainKey]: count
            }
        };

        const allRecords = JSON.parse(localStorage.getItem('selAssessmentRecords') || '[]');
        const newRecordsList = allRecords.map(r => r.id === rowData?.id ? updatedRecord : r);
        localStorage.setItem('selAssessmentRecords', JSON.stringify(newRecordsList));

        setIsEditBtnClicked(false);
        if (onEditSuccess) onEditSuccess();
        onClose();
    };

    const handleCancel = () => {
        setIsEditBtnClicked(false);
        populateInitialData(); // Reset to saved database state
    };

    const tierInfo = getSELTier(count, version);

    return (
        <Drawer
            anchor='right'
            sx={counsellorStyles.drawerSx}
            open={open}
            onClose={() => (isEditBtnClicked ? null : onClose())}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                boxSizing: 'border-box',
                width: { xs: '100vw', sm: 450 }
            }}>

                {/* ── HEADER ── */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 3,
                    py: 2,
                    flexShrink: 0,
                }}>
                    <Typography
                        variant={typographyConstants.h4}
                        sx={{ fontWeight: 500, color: 'textColors.blue' }}
                    >
                        {displayLabel ? displayLabel.toUpperCase() : domainKey?.toUpperCase()}
                    </Typography>
                    <CustomIcon
                        name={iconConstants.cancelRounded}
                        style={{ cursor: 'pointer', width: '26px', height: '26px' }}
                        svgStyle="width: 26px; height: 26px"
                        onClick={() => { onClose(); setIsEditBtnClicked(false); }}
                    />
                </Box>

                <Divider sx={{ flexShrink: 0 }} />

                {/* ── QUESTIONS (only this scrolls) ── */}
                <Box sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    px: 3,
                    pt: 2,
                    pb: 1,
                }}>
                    {selectedData.length > 0 ? (
                        selectedData.map((item, index) => {
                            const isReverse = item.question.includes('(R)');
                            const qText = item.question.replace(/^\d+\.\s*/, '');

                            return (
                                <Box sx={{ mb: '24px' }} key={index}>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <Typography
                                            variant={typographyConstants.h5}
                                            sx={{ minWidth: '22px', color: isReverse ? '#E53935' : '#334155', fontWeight: 600, flexShrink: 0 }}
                                        >
                                            {`${index + 1}.`}
                                        </Typography>
                                        <Typography
                                            variant={typographyConstants.h5}
                                            sx={{ color: isReverse ? '#E53935' : '#334155' }}
                                        >
                                            {qText}
                                        </Typography>
                                    </Box>

                                    <FormControl
                                        sx={{ mt: '12px', pl: '22px', width: '100%' }}
                                        disabled={!isEditBtnClicked}
                                    >
                                        <RadioGroup
                                            row
                                            value={item.option}
                                            onChange={(e) => handleOptionChange(index, e.target.value)}
                                            sx={{ flexWrap: 'wrap' }}
                                        >
                                            {optionsList.map((opt) => (
                                                <FormControlLabel
                                                    key={opt}
                                                    value={opt}
                                                    control={<Radio size="small" />}
                                                    label={<Typography sx={{ fontSize: '13px' }}>{opt}</Typography>}
                                                    sx={{ mr: 2, mb: '4px' }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            );
                        })
                    ) : (
                        <Box sx={{ textAlign: 'center', mt: 5 }}>
                            <Typography color='textSecondary'>
                                No questions mapped for this domain in {version === 'versionA' ? 'Version A' : 'Version B'}.
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* ── FOOTER (always pinned at bottom) ── */}
                <Box sx={{
                    flexShrink: 0,
                    px: 3,
                    pb: 3,
                    pt: 1.5,
                    borderTop: '1px solid #f0f0f0',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box',
                    width: '100%',
                }}>
                    {/* Score Bar */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        borderRadius: '4px',
                        backgroundColor: tierInfo.color + '20',
                        border: `1px solid ${tierInfo.color}`,
                        height: '50px',
                        px: 2,
                    }}>
                        <Typography variant={typographyConstants.h4} sx={{ color: tierInfo.color, fontWeight: 600 }}>
                            Avg Score
                        </Typography>
                        <Typography variant={typographyConstants.h4} sx={{ color: tierInfo.color, fontWeight: 700 }}>
                            {count}
                        </Typography>
                    </Box>

                    {/* Buttons */}
                    {isEditBtnClicked ? (
                        <Box sx={{
                            display: 'flex',
                            gap: '12px',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}>
                            <Box sx={{ width: '50%' }}>
                                <CustomButton
                                    sx={{
                                        width: '100%',
                                        height: '52px',
                                        backgroundColor: 'transparent',
                                        border: '1px solid #CBD5E1',
                                    }}
                                    typoSx={{ color: 'textColors.black' }}
                                    text={localizationConstants.cancel || 'Cancel'}
                                    onClick={handleCancel}
                                />
                            </Box>
                            <Box sx={{ width: '50%' }}>
                                <CustomButton
                                    sx={{
                                        width: '100%',
                                        height: '52px',
                                        backgroundColor: '#0267D9',
                                    }}
                                    text={localizationConstants.submit || 'Submit'}
                                    endIcon={
                                        <CustomIcon
                                            name={iconConstants.doneWhite}
                                            style={{ width: '24px', height: '24px', marginLeft: '10px' }}
                                            svgStyle="width: 24px; height: 24px"
                                        />
                                    }
                                    onClick={handleSave}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ width: '100%' }}>
                            <CustomButton
                                sx={{
                                    width: '100%',
                                    height: '52px',
                                    backgroundColor: '#0267D9',
                                }}
                                text={localizationConstants.edit || 'Edit'}
                                onClick={() => setIsEditBtnClicked(true)}
                            />
                        </Box>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};

export default memo(SELDrawer);