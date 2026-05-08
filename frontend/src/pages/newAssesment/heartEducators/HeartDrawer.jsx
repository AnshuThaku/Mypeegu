import React, { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Divider, Drawer, FormControl, FormControlLabel,
    Radio, RadioGroup, Typography,
} from '@mui/material';
import { counsellorStyles } from '../../counsellors/counsellorsStyles';
import useCommonStyles from '../../../components/styles';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import CustomIcon from '../../../components/CustomIcon';
import { iconConstants } from '../../../resources/theme/iconConstants';
import CustomButton from '../../../components/CustomButton';
import {
    heartQuestions,
    heartScoringOptions,
    heartScoringMapping,
    getSafetyBandByScore,
    MAX_SCORE_PER_QUESTION,
} from './heartConstants';

// 1. Map the specific question IDs back to their respective Domains
const domainQuestionMapping = {
    'Honesty': ['q1', 'q2', 'q3', 'q4', 'q14'],
    'Empathy': ['q12', 'q13', 'q14', 'q15', 'q10'],
    'Autonomy': ['q5', 'q6', 'q7', 'q8'],
    'Respect': ['q13', 'q9'],
    'Trust': ['q6', 'q11'],
};

// 2. Flatten the sections to easily find question texts by ID
const allQuestionsFlat = Object.values(heartQuestions).flat();
const getQuestionText = (id) => allQuestionsFlat.find(q => q.id === id)?.text || '';

const HeartDrawer = ({
    open,
    onClose,
    domainKey,
    displayLabel,
    total,
    rowData,
    onEditSuccess,
}) => {
    const flexStyles = useCommonStyles();

    const [isEditBtnClicked, setIsEditBtnClicked] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [count, setCount] = useState(0);

    const expectedQIds = domainQuestionMapping[domainKey] || [];

    // ── Load saved responses ─────────────────────────────────────────────────
    useEffect(() => {
        if (expectedQIds.length > 0) {
            const initialList = expectedQIds.map((qId) => {
                // Look for 'q1', 'q2' etc. inside rowData.responses
                const savedItem = rowData?.responses?.[qId];
                const savedOption = savedItem?.option || '';

                return {
                    qId, 
                    question: savedItem?.question || getQuestionText(qId),
                    option: savedOption,
                    points: heartScoringMapping[savedOption] || 0,
                };
            });

            setSelectedData(initialList);
            const totalActual = initialList.reduce((sum, item) => sum + item.points, 0);
            const totalMax = initialList.length * MAX_SCORE_PER_QUESTION;
            setCount(totalMax > 0 ? Math.round((totalActual / totalMax) * 100) : 0);
        } else {
            setSelectedData([]);
            setCount(0);
        }
    }, [rowData, domainKey, open, expectedQIds]);

    // ── Option change ────────────────────────────────────────────────────────
    const handleOptionChange = (index, newOption) => {
        const list = [...selectedData];
        list[index] = { ...list[index], option: newOption, points: heartScoringMapping[newOption] || 0 };
        
        // Update simulated count
        const totalActual = list.reduce((sum, item) => sum + item.points, 0);
        const totalMax = list.length * MAX_SCORE_PER_QUESTION;
        setCount(totalMax > 0 ? Math.round((totalActual / totalMax) * 100) : 0);
        setSelectedData(list);
    };

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = () => {
        const updatedResponses = { ...(rowData?.responses || {}) };
        
        // Apply changes made in the drawer
        selectedData.forEach((item, idx) => {
    const responseKey =
        item.parentQuestion
            ? `${domainKey}_0_${idx}`
            : `${domainKey}_${idx}`

    updatedResponses[responseKey] = {
        question: item.question,
        option: item.option,
        points: item.points,
    }
})

        // Because questions overlap (e.g. q6 is in Autonomy & Trust), we MUST recalculate ALL scores
        const getPts = (id) => updatedResponses[id]?.points || 0;

        const hScore = getPts('q1') + getPts('q2') + getPts('q3') + getPts('q4') + getPts('q14');
        const eScore = getPts('q12') + getPts('q13') + getPts('q14') + getPts('q15') + getPts('q10');
        const aScore = getPts('q5') + getPts('q6') + getPts('q7') + getPts('q8');
        const rScore = getPts('q13') + getPts('q9');
        const tScore = getPts('q6') + getPts('q11');

        const newDomainScores = {
            'Honesty': Math.round((hScore / 25) * 100) || 0,
            'Empathy': Math.round((eScore / 25) * 100) || 0,
            'Autonomy': Math.round((aScore / 20) * 100) || 0,
            'Respect': Math.round((rScore / 10) * 100) || 0,
            'Trust': Math.round((tScore / 10) * 100) || 0,
        };

        let totalActual = 0;
        for (let i = 1; i <= 15; i++) {
            totalActual += getPts(`q${i}`);
        }
        const newOverallScore = Math.round((totalActual / 75) * 100) || 0;

        const updatedRecord = {
            ...rowData,
            responses: updatedResponses,
            domainScores: newDomainScores,
            overallScore: newOverallScore
        };

        const allRecords = JSON.parse(localStorage.getItem('heartRecords') || '[]');
        localStorage.setItem('heartRecords', JSON.stringify(
            allRecords.map(r => r.id === rowData?.id ? updatedRecord : r)
        ));

        setIsEditBtnClicked(false);
        if (onEditSuccess) onEditSuccess();
        onClose();
    };

    // ── Cancel reset ─────────────────────────────────────────────────────────
    const handleCancel = () => {
        setIsEditBtnClicked(false);
        const resetList = expectedQIds.map((qId) => {
            const savedItem = rowData?.responses?.[qId];
            const savedOption = savedItem?.option || '';
            return { 
                qId, 
                question: savedItem?.question || getQuestionText(qId), 
                option: savedOption, 
                points: heartScoringMapping[savedOption] || 0 
            };
        });
        setSelectedData(resetList);
        const totalActual = resetList.reduce((sum, item) => sum + item.points, 0);
        const totalMax = resetList.length * MAX_SCORE_PER_QUESTION;
        setCount(totalMax > 0 ? Math.round((totalActual / totalMax) * 100) : 0);
    };

    const bandInfo = getSafetyBandByScore(count);

    return (
        <Drawer
            anchor="right"
            sx={counsellorStyles.drawerSx}
            open={open}
            onClose={() => isEditBtnClicked ? null : onClose()}
        >
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                overflow: 'hidden',
                boxSizing: 'border-box',
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
                        {displayLabel?.toUpperCase()}
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
                        selectedData.map((item, index) => (
                            <Box sx={{ mb: '24px' }} key={index}>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography
                                        variant={typographyConstants.h5}
                                        sx={{ minWidth: '22px', flexShrink: 0 }}
                                    >
                                        {`${index + 1}.`}
                                    </Typography>
                                    <Typography variant={typographyConstants.h5}>
                                        {item.question}
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
                                        {heartScoringOptions.map((opt) => (
                                            <FormControlLabel
                                                key={opt}
                                                value={opt}
                                                control={<Radio size="small" />}
                                                label={
                                                    <Typography sx={{ fontSize: '13px' }}>
                                                        {opt}
                                                    </Typography>
                                                }
                                                sx={{ mr: 2, mb: '4px' }}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ textAlign: 'center', mt: 5 }}>
                            <Typography color="textSecondary">
                                No questions found for this domain.
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

                    {/* Total score bar */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        borderRadius: '4px',
                        backgroundColor: bandInfo.color + '20',
                        border: `1px solid ${bandInfo.color}`,
                        height: '50px',
                        px: 2,
                    }}>
                        <Typography variant={typographyConstants.h4} sx={{ color: bandInfo.color }}>
                            {localizationConstants.total || 'Total'}
                        </Typography>
                        <Typography variant={typographyConstants.h4} sx={{ color: bandInfo.color, fontWeight: 700 }}>
                            {count}%
                        </Typography>
                    </Box>

                    {/* Buttons — use width % so both always fit */}
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

export default memo(HeartDrawer);