import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Paper } from '@mui/material';
import {
    heartQuestions,
    heartScoringOptions,
    heartScoringMapping,
    heartOpenEndedQuestions,
} from './heartConstants';
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent';
import { typographyConstants } from '../../../resources/theme/typographyConstants';

const testInValid = [undefined, null, ''];

const AddHeart = forwardRef(({ onSaveStateChange }, ref) => {
    const [codeName, setCodeName] = useState('');
    const [gradesTaught, setGradesTaught] = useState('');
    const [formData, setFormData] = useState({});
    const [openEnded, setOpenEnded] = useState({ q16: '', q17: '', q18: '' });
    
    // Auto-initialize collapsibles based on the Sections in Constants
    const [boolStats, setBoolStats] = useState(() => {
        const initialStates = {};
        Object.keys(heartQuestions).forEach(section => {
            initialStates[section] = true;
        });
        return initialStates;
    });

    const isCodeNameValid = !testInValid.includes(codeName?.trim()) && codeName.trim().length >= 3;

    // Validation logic for Save Button (Must answer all 15 questions)
    useEffect(() => {
        const totalQns = 15; 
        const filledQns = Object.keys(formData).length;
        const isInvalid = !isCodeNameValid || filledQns < totalQns;
        onSaveStateChange(isInvalid);
    }, [formData, codeName, isCodeNameValid, onSaveStateChange]);

    const handleOptionChange = (qId, option, text) => {
        setFormData(prev => ({
            ...prev,
            [qId]: {
                question: text,
                option,
                points: heartScoringMapping[option] || 1,
            },
        }));
    };

    useImperativeHandle(ref, () => ({
        getSubmitData: () => {
            const getPts = (id) => formData[id]?.points || 0;

            // Mathematical Mapping to H.E.A.R.T. Domains based on PDF rules
            const hScore = getPts('q1') + getPts('q2') + getPts('q3') + getPts('q4') + getPts('q14');
            const eScore = getPts('q12') + getPts('q13') + getPts('q14') + getPts('q15') + getPts('q10');
            const aScore = getPts('q5') + getPts('q6') + getPts('q7') + getPts('q8');
            const rScore = getPts('q13') + getPts('q9');
            const tScore = getPts('q6') + getPts('q11');

            const domainScores = {
                'Honesty': Math.round((hScore / 25) * 100) || 0,
                'Empathy': Math.round((eScore / 25) * 100) || 0,
                'Autonomy': Math.round((aScore / 20) * 100) || 0,
                'Respect': Math.round((rScore / 10) * 100) || 0,
                'Trust': Math.round((tScore / 10) * 100) || 0,
            };

            // Calculate Overall Score (Sum of all 15 questions / 75 Max Points)
            let totalActual = 0;
            for (let i = 1; i <= 15; i++) {
                totalActual += getPts(`q${i}`);
            }

            return {
                id: Date.now(),
                code_name: codeName.trim(),
                grades_taught: gradesTaught.trim(),
                overallScore: Math.round((totalActual / 75) * 100),
                domainScores,
                responses: formData,
                openEnded,
                createdAt: new Date().toISOString(),
            };
        },
    }));

    return (
        <Box sx={{ mt: '10px' }}>

            {/* DEMOGRAPHIC FIELDS */}
            <Box sx={{ mt: '24px' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: '240px' }}>
                        <Typography variant={typographyConstants.h5} sx={{ mb: '6px', fontWeight: 600 }}>
                            Anonymous Code Name <span style={{ color: 'red' }}>*</span>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="e.g. The Happy Capybara"
                            value={codeName}
                            onChange={(e) => setCodeName(e.target.value)}
                            error={codeName.length > 0 && codeName.trim().length < 3}
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: '180px' }}>
                        <Typography variant={typographyConstants.h5} sx={{ mb: '6px', fontWeight: 600 }}>
                            Grades I Teach
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="e.g. 6, 7, 8"
                            value={gradesTaught}
                            onChange={(e) => setGradesTaught(e.target.value)}
                            sx={{ backgroundColor: '#fff' }}
                        />
                    </Box>
                </Box>
            </Box>

            {/* SURVEY SECTIONS */}
            {isCodeNameValid && (
                <Box sx={{ mt: '30px' }}>
                    {Object.entries(heartQuestions).map(([sectionTitle, questions]) => (
                        <Box sx={{ mt: '24px' }} key={sectionTitle}>
                            <CustomCollapsibleComponent
                                open={boolStats[sectionTitle]}
                                title={sectionTitle}
                                onClick={() => setBoolStats(prev => ({ ...prev, [sectionTitle]: !prev[sectionTitle] }))}
                            >
                                {questions.map((qn) => {
                                    const qNum = qn.id.replace('q', '');
                                    return (
                                        <Box sx={{ mb: '28px', borderBottom: '1px solid #f0f0f0', pb: 2 }} key={qn.id}>
                                            <Box sx={{ display: 'flex' }}>
                                                <Typography variant={typographyConstants.h5} sx={{ minWidth: '25px' }}>
                                                    {`${qNum}.`}
                                                </Typography>
                                                <Typography variant={typographyConstants.h5}>{qn.text}</Typography>
                                            </Box>

                                            <FormControl sx={{ mt: '12px', pl: '25px' }}>
                                                <RadioGroup
                                                    row
                                                    value={formData[qn.id]?.option || ''}
                                                    onChange={(e) => handleOptionChange(qn.id, e.target.value, qn.text)}
                                                >
                                                    {heartScoringOptions.map((opt) => (
                                                        <FormControlLabel
                                                            key={opt}
                                                            value={opt}
                                                            control={<Radio size="small" />}
                                                            label={<Typography sx={{ fontSize: '14px' }}>{opt}</Typography>}
                                                            sx={{ mr: 3 }}
                                                        />
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                        </Box>
                                    );
                                })}
                            </CustomCollapsibleComponent>
                        </Box>
                    ))}

                    {/* EDUCATOR VOICE / OPEN ENDED */}
                    <Paper elevation={0} sx={{ p: 2, mt: 4, borderRadius: '8px', border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#333' }}>
                            SECTION 5: OPEN-ENDED QUESTIONS
                        </Typography>

                        {heartOpenEndedQuestions.map((qn, idx) => {
                            const key = `q${16 + idx}`;
                            return (
                                <Box key={idx} sx={{ mb: idx < heartOpenEndedQuestions.length - 1 ? 3 : 0 }}>
                                    <Typography variant="body1" sx={{ mb: 1, fontWeight: 500 }}>
                                        {`${16 + idx}. ${qn}`}
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        placeholder="Type your answer here..."
                                        value={openEnded[key]}
                                        onChange={(e) => setOpenEnded(prev => ({ ...prev, [key]: e.target.value }))}
                                        sx={{ backgroundColor: '#fff' }}
                                    />
                                </Box>
                            );
                        })}
                    </Paper>
                </Box>
            )}

            {/* PLACEHOLDER */}
            {!isCodeNameValid && (
                <Box sx={{ mt: 5, p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    <Typography color="textSecondary">
                        Please enter your anonymous code name above to load the H.E.A.R.T. assessment.
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

export default AddHeart;