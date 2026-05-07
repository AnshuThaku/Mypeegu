import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Box, Typography, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Paper } from '@mui/material';
import { heartQuestions, heartScoringMapping } from './TeacherPSConstants';
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent';
import CommonBarFilter, { initialBarFilterStates } from '../../../components/commonComponents/CommonBarFilter';

const AddTeacherPSAssessment = forwardRef(({ onSaveStateChange, clearOptionsRef }, ref) => {
    const [formData, setFormData] = useState({});
    const [educator, setEducator] = useState({});
    const [codeName, setCodeName] = useState('');
    const [barFilterData, setBarFilterData] = useState(initialBarFilterStates);
    const [boolStats, setBoolStats] = useState({ 'Honesty': true });

    const isValid = educator?.user_id && codeName.trim() !== '' && 
                    Object.keys(formData).length === Object.values(heartQuestions).flat().length;

    useEffect(() => {
        onSaveStateChange(!isValid);
    }, [isValid, onSaveStateChange]);

    const handleOptionChange = (domain, index, option) => {
        setFormData(prev => ({
            ...prev,
            [`${domain}_${index}`]: { 
                question: heartQuestions[domain][index], 
                option, 
                points: heartScoringMapping[option] 
            }
        }));
    };

    useImperativeHandle(ref, () => ({
        getSubmitData: () => {
            const responses = Object.values(formData);
            const totalScore = responses.reduce((acc, curr) => acc + curr.points, 0);
            
            // Grouping scores by domain for the table view
            const domainScores = {};
            Object.keys(heartQuestions).forEach(domain => {
                const domainPts = responses
                    .filter(r => heartQuestions[domain].includes(r.question))
                    .reduce((sum, r) => sum + r.points, 0);
                domainScores[domain] = domainPts;
            });

            return {
                id: Date.now(),
                user_id: educator.user_id,
                educatorName: educator.studentName, // Reusing filter key
                codeName,
                totalScore,
                domainScores,
                responses: formData,
                academicYear: barFilterData.selectdAYs,
                createdAt: new Date().toISOString()
            };
        }
    }));

    return (
        <Box sx={{ mt: 2 }}>
            <CommonBarFilter
                barFilterData={barFilterData}
                setBarFilterData={setBarFilterData}
                isStudentRequired={true}
                setStudent={setEducator}
                ref={clearOptionsRef}
            />
            {educator?.user_id && (
                <Box sx={{ mt: 3 }}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: '#f8fafc' }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Anonymous Code Name</Typography>
                        <TextField 
                            fullWidth size="small" placeholder="e.g., The Happy Capybara"
                            value={codeName} onChange={(e) => setCodeName(e.target.value)} 
                        />
                    </Paper>
                    {Object.entries(heartQuestions).map(([domain, questions]) => (
                        <CustomCollapsibleComponent
                            key={domain} title={domain} open={boolStats[domain]}
                            onClick={() => setBoolStats(prev => ({ ...prev, [domain]: !prev[domain] }))}
                        >
                            {questions.map((qn, idx) => (
                                <Box key={idx} sx={{ mb: 3, borderBottom: '1px solid #eee', pb: 2 }}>
                                    <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>{`${idx + 1}. ${qn}`}</Typography>
                                    <RadioGroup row value={formData[`${domain}_${idx}`]?.option || ''}
                                        onChange={(e) => handleOptionChange(domain, idx, e.target.value)}>
                                        {Object.keys(heartScoringMapping).map(opt => (
                                            <FormControlLabel key={opt} value={opt} control={<Radio size="small" />} 
                                                label={<Typography sx={{ fontSize: '12px' }}>{opt}</Typography>} />
                                        ))}
                                    </RadioGroup>
                                </Box>
                            ))}
                        </CustomCollapsibleComponent>
                    ))}
                </Box>
            )}
        </Box>
    );
});

export default AddTeacherPSAssessment;