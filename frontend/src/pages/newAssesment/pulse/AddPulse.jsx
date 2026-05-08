import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Box, Typography, FormControl, FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';
import { pulseQuestions } from './pulseConstants';
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent';
import CommonBarFilter, { initialBarFilterStates } from '../../../components/commonComponents/CommonBarFilter';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import { getCurrentAcademicYearId, delay } from '../../../utils/utils';
import { useSelector } from 'react-redux';

const testInValid = [undefined, null, ''];

const AddPulse = forwardRef(({ onSaveStateChange, clearOptionsRef }, ref) => {
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup);
    
    const [formData, setFormData] = useState({});
    const [student, setStudent] = useState({});
    const [barFilterData, setBarFilterData] = useState(initialBarFilterStates); 
    const [boolStats, setBoolStats] = useState({ 'SECTION 1: My Online Time': true });

    const isStudentSelected = !testInValid.includes(student?.studentName) && !testInValid.includes(student?.user_id);
    const actualClassName = String(barFilterData?.className || student?.className || student?.class || '').trim();
    
    const formattedClass = actualClassName.toUpperCase().replace(/\s+/g, ''); // e.g., "CLASS6", "6", "VI"
    const validGrades = ['6', '7', '8', '06', '07', '08', 'VI', 'VII', 'VIII'];
    
    let isAllowedGrade = false;
    if (formattedClass !== '') {
        isAllowedGrade = validGrades.some(vg => 
            formattedClass === vg || 
            formattedClass === `CLASS${vg}` || 
            formattedClass === `GRADE${vg}`
        );
    }

    const isInvalidGrade = actualClassName !== '' && !isAllowedGrade;

    // Validation Logic for Save Button
    useEffect(() => {
        const totalQns = Object.values(pulseQuestions).flat().length;
        const filledQns = Object.keys(formData).length;
        
        // Save button tabhi enable hoga jab Student Selected ho + Class allowed ho + Saare answers filled hon
        const isInvalid = !isStudentSelected || !isAllowedGrade || filledQns < totalQns;
        onSaveStateChange(isInvalid);
    }, [formData, student, isStudentSelected, isAllowedGrade, onSaveStateChange]);

    // Handle Academic Year Auto-population
    const isInitialLoad = useRef(true);
    useEffect(() => {
        const populateAY = async () => {
            if (academicYears.length > 0 && isInitialLoad.current) {
                const currentAYId = getCurrentAcademicYearId(academicYears);
                if (currentAYId) {
                    await delay();
                    setBarFilterData(prev => ({ ...prev, selectdAYs: currentAYId }));
                }
                isInitialLoad.current = false;
            }
        };
        populateAY();
    }, [academicYears]);

    // Points Scoring Logic
    const getOptionScore = (optionStr) => {
        if (optionStr === 'Always' || optionStr === 'Strongly agree' || optionStr === 'Yes, often' || optionStr === 'Many times') return 4;
        if (optionStr === 'Most of the time' || optionStr === 'Often' || optionStr === 'Agree' || optionStr === 'Yes, sometimes') return 3;
        if (optionStr === 'Sometimes' || optionStr === 'Once in a while' || optionStr === 'Disagree' || optionStr === 'Once or twice' || optionStr === 'Somewhat') return 2;
        if (optionStr === 'Never' || optionStr === 'Rarely' || optionStr === 'Strongly disagree' || optionStr === 'No' || optionStr === 'I don\'t play games') return 1;
        return 0;
    }

    useImperativeHandle(ref, () => ({
        getSubmitData: () => {
            const domainScores = {
                OnlineTime: 0, GamesFun: 0, PeopleOnline: 0, ThingsISee: 0,
                SocialMedia: 0, Respectful: 0, MakingChoices: 0, GettingHelp: 0, AboutMe: 0
            };

            let totalActualScore = 0;
            let totalMaxScore = 0;

            Object.keys(pulseQuestions).forEach((sectionKey) => {
                const qList = pulseQuestions[sectionKey] || [];
                let sectionTotal = 0;

                qList.forEach((qnObj, qIdx) => {
                    const exactKey = `${sectionKey}_${qIdx}`;
                    const answerObj = formData[exactKey];
                    
                    if (answerObj && answerObj.option && qnObj.type !== 'text') {
                        const pts = getOptionScore(answerObj.option);
                        sectionTotal += pts;
                        totalActualScore += pts;
                        totalMaxScore += 4; 
                    }
                });

                if (sectionKey.includes('Online Time')) domainScores.OnlineTime = sectionTotal;
                else if (sectionKey.includes('Games & Online Fun')) domainScores.GamesFun = sectionTotal;
                else if (sectionKey.includes('People I Talk to')) domainScores.PeopleOnline = sectionTotal;
                else if (sectionKey.includes('Things I See')) domainScores.ThingsISee = sectionTotal;
                else if (sectionKey.includes('Social Media')) domainScores.SocialMedia = sectionTotal;
                else if (sectionKey.includes('Respectful')) domainScores.Respectful = sectionTotal;
                else if (sectionKey.includes('Making Choices')) domainScores.MakingChoices = sectionTotal;
                else if (sectionKey.includes('Getting Help')) domainScores.GettingHelp = sectionTotal;
                else if (sectionKey.includes('About Me')) domainScores.AboutMe = sectionTotal;
            });

            const percentage = totalMaxScore > 0 ? Math.round((totalActualScore / totalMaxScore) * 100) : 0;

            return {
                id: Date.now(),
                user_id: student.user_id,
                studentName: student.studentName,
                schoolId: barFilterData.selectdSchools || null,
                classRoomId: barFilterData.selectdClassrooms?.length > 0 ? barFilterData.selectdClassrooms[0] : null,
                section: barFilterData.selectdSections || null,
                responses: formData,
                domainScores: domainScores,
                overallPercentage: percentage,
                academicYear: barFilterData.selectdAYs,
                createdAt: new Date().toISOString()
            }
        }
    }));

    let globalQuestionCounter = 1;

    return (
        <Box sx={{ mt: '10px' }}>
            <Box sx={{ mt: '24px' }}>
                <CommonBarFilter
                    barFilterData={barFilterData}
                    setBarFilterData={setBarFilterData}
                    isStudentRequired={true}
                    setStudent={setStudent}
                    dropdownOptions={{
                        academicYear: true,
                        school: true,
                        classroom: true,
                        section: true,
                        student: true,
                    }}
                    ref={clearOptionsRef}
                />
            </Box>

            {/* IF-ELSE UI RENDERING LOGIC */}
            {isStudentSelected ? (
                isAllowedGrade ? (
                    /* IF GRADE IS 6, 7 OR 8 -> SHOW QUESTIONS */
                    <Box sx={{ mt: '30px' }}>
                        {Object.entries(pulseQuestions).map(([domain, questions]) => {
                            const currentStartNum = globalQuestionCounter;
                            globalQuestionCounter += questions.length;

                            return (
                                <Box sx={{ mt: '24px' }} key={domain}>
                                    <CustomCollapsibleComponent 
                                        open={boolStats[domain]} 
                                        title={domain} 
                                        onClick={() => setBoolStats(prev => ({ ...prev, [domain]: !prev[domain] }))}
                                    >
                                        {questions.map((qnObj, idx) => {
                                            const qNum = currentStartNum + idx;
                                            const exactKey = `${domain}_${idx}`;
                                            const qText = qnObj.question;

                                            return (
                                                <Box key={idx} sx={{ mb: '28px', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant={typographyConstants.h5} sx={{ minWidth: '30px' }}>
                                                            {`${qNum}.`}
                                                        </Typography>
                                                        <Typography variant={typographyConstants.h5}>
                                                            {qText}
                                                        </Typography>
                                                    </Box>

                                                    {qnObj.type === 'text' ? (
                                                        <FormControl fullWidth sx={{ mt: '12px', pl: '30px' }}>
                                                            <TextField 
                                                                multiline 
                                                                rows={3} 
                                                                placeholder="Type your answer here..."
                                                                value={formData[exactKey]?.option || ''}
                                                                onChange={(e) => setFormData(prev => ({ 
                                                                    ...prev, 
                                                                    [exactKey]: { question: qText, option: e.target.value } 
                                                                }))}
                                                            />
                                                        </FormControl>
                                                    ) : (
                                                        <FormControl sx={{ mt: '12px', pl: '30px' }}>
                                                            <RadioGroup 
                                                                row 
                                                                value={formData[exactKey]?.option || ''}
                                                                onChange={(e) => setFormData(prev => ({ 
                                                                    ...prev, 
                                                                    [exactKey]: { question: qText, option: e.target.value } 
                                                                }))}
                                                            >
                                                                {qnObj.options.map(opt => (
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
                                                    )}
                                                </Box>
                                            )
                                        })}
                                    </CustomCollapsibleComponent>
                                </Box>
                            )
                        })}
                    </Box>
                ) : (
                    /* ELSE IF GRADE IS NOT 6, 7 OR 8 -> SHOW ERROR BOX */
                    <Box sx={{ mt: 5, p: 4, bgcolor: '#FFEBEE', border: '1px solid #EF4444', borderRadius: '8px', textAlign: 'center' }}>
                        <Typography sx={{ color: '#C62828', fontWeight: 700, fontSize: '18px' }}>
                            🚫 Assessment Restricted
                        </Typography>
                        <Typography sx={{ color: '#C62828', mt: 1, fontSize: '15px' }}>
                            Pulse Digital Wellbeing Check-In is exclusively for <b>Grades 6 to 8</b>.<br/>
                            The selected student belongs to <b>Class {actualClassName || 'Unknown'}</b>. Please select an eligible student to proceed.
                        </Typography>
                    </Box>
                )
            ) : (
                /* IF STUDENT IS NOT SELECTED YET */
                <Box sx={{ mt: 5, p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    <Typography color="textSecondary">Please select a student to load the assessment.</Typography>
                </Box>
            )}
        </Box>
    );
});

export default AddPulse;