import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { Box, Typography, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useSelector } from 'react-redux';
import { selQns_vA, selQns_vB, selScoringMapping, scoringOptions_vA, scoringOptions_vB } from './SELConstants';
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent';
import CommonBarFilter, { initialBarFilterStates } from '../../../components/commonComponents/CommonBarFilter';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import { getCurrentAcademicYearId, delay } from '../../../utils/utils';

const testInValid = [undefined, null, ''];

const AddSELAssessment = forwardRef(({ onSaveStateChange, clearOptionsRef }, ref) => {
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup);

    const [barFilterData, setBarFilterData] = useState(initialBarFilterStates);
    const [student, setStudent] = useState({});
    const [formData, setFormData] = useState({});
    const [boolStats, setBoolStats] = useState({ 'SELF-AWARENESS': true });

    const isStudentSelected = !testInValid.includes(student?.studentName) && !testInValid.includes(student?.user_id);

    // =========================================================================
    // 100% STRICT AUTOMATIC GRADE DETECTION LOGIC (Same as Pulse Fix)
    // =========================================================================
    
    // Seedha barFilterData se className string uthana
    const actualClassName = String(barFilterData?.className || student?.className || student?.class || student?.class_name || '').trim();
    const formattedClass = actualClassName.toUpperCase().replace(/\s+/g, ''); 

    // Version A: Grades 3-5
    const validGradesA = ['3', '4', '5', '03', '04', '05', 'III', 'IV', 'V'];
    // Version B: Grades 6-12
    const validGradesB = ['6', '7', '8', '9', '10', '11', '12', '06', '07', '08', '09', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    let isAllowedGradeA = false;
    let isAllowedGradeB = false;

    if (formattedClass !== '') {
        isAllowedGradeA = validGradesA.some(vg => formattedClass === vg || formattedClass === `CLASS${vg}` || formattedClass === `GRADE${vg}`);
        isAllowedGradeB = validGradesB.some(vg => formattedClass === vg || formattedClass === `CLASS${vg}` || formattedClass === `GRADE${vg}`);
    }

    const isAllowedGrade = isAllowedGradeA || isAllowedGradeB;
    
    // Invalid tabhi hoga jab student selected ho aur grade allowed na ho
    const isInvalidGrade = isStudentSelected && !isAllowedGrade;

    // AUTO SELECT VERSION BASED ON CLASS (Fallback versionA just for initialization)
    const version = isAllowedGradeB ? 'versionB' : 'versionA'; 

    const currentQuestions = version === 'versionA' ? selQns_vA : selQns_vB;
    const currentOptions = version === 'versionA' ? scoringOptions_vA : scoringOptions_vB;
    const currentMapping = selScoringMapping[version];

    // Reset formData if version changes
    const previousVersion = useRef(version);
    useEffect(() => {
        if (previousVersion.current !== version) {
            setFormData({});
            previousVersion.current = version;
        }
    }, [version]);

    // Validation logic for Save Button
    useEffect(() => {
        const totalQns = Object.values(currentQuestions).flat().length;
        const filledQns = Object.keys(formData).length;
        
        const isInvalid = !isStudentSelected || !isAllowedGrade || filledQns < totalQns;
        onSaveStateChange(isInvalid);
    }, [formData, student, currentQuestions, isStudentSelected, isAllowedGrade, onSaveStateChange]);

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

    const handleOptionChange = (domain, index, option) => {
        const questionText = currentQuestions[domain][index];
        let points = currentMapping[option] || 0;

        // Reverse Scoring Logic for (R) questions
        if (questionText.includes('(R)')) {
            if (version === 'versionA') points = 4 - points; 
            else points = 5 - points; 
        }

        setFormData(prev => ({
            ...prev,
            [`${domain}_${index}`]: { question: questionText, option, points }
        }));
    };

    useImperativeHandle(ref, () => ({
        getSubmitData: () => {
            const domainScores = {};
            let totalPoints = 0;
            let totalQnsAnswered = 0;

            Object.keys(currentQuestions).forEach(domain => {
                let domainPoints = 0;
                currentQuestions[domain].forEach((qn, idx) => {
                    const ans = formData[`${domain}_${idx}`];
                    if (ans) {
                        domainPoints += ans.points;
                        totalPoints += ans.points;
                        totalQnsAnswered += 1;
                    }
                });
                const domainAvg = currentQuestions[domain].length > 0 ? (domainPoints / currentQuestions[domain].length) : 0;
                domainScores[domain] = parseFloat(domainAvg.toFixed(1));
            });

            const overallScore = totalQnsAnswered > 0 ? parseFloat((totalPoints / totalQnsAnswered).toFixed(1)) : 0;

            return {
                id: Date.now(),
                user_id: student.user_id,
                studentName: student.studentName,
                schoolId: barFilterData.schools ? barFilterData.schools[0] : null,
                classRoomId: barFilterData.classrooms ? barFilterData.classrooms[0] : null,
                section: barFilterData.sections ? barFilterData.sections[0] : null,
                academicYear: barFilterData.selectdAYs,
                version,
                overallScore,
                domainScores,
                responses: formData,
                createdAt: new Date().toISOString()
            };
        }
    }));

    return (
        <Box sx={{ mt: '10px' }}>
            <Box sx={{ mt: '24px' }}>
                <CommonBarFilter 
                    barFilterData={barFilterData} 
                    setBarFilterData={setBarFilterData} 
                    isStudentRequired={true} 
                    setStudent={setStudent} 
                    dropdownOptions={{ academicYear: true, school: true, classroom: true, section: true, student: true }} 
                    ref={clearOptionsRef} 
                />
            </Box>

            {/* ERROR FOR INVALID CLASSES (BELOW 3rd GRADE) */}
            {isInvalidGrade && (
                <Box sx={{ mt: 4, p: 3, bgcolor: '#FFEBEE', border: '1px solid #EF4444', borderRadius: '8px', textAlign: 'center' }}>
                    <Typography sx={{ color: '#C62828', fontWeight: 700, fontSize: '16px' }}>
                        ⚠️ Assessment Restricted
                    </Typography>
                    <Typography sx={{ color: '#C62828', mt: 1, fontSize: '14px' }}>
                        SEL Competency Assessment is exclusively designed for <b>Grades 3 to 12</b>.<br/> 
                        The selected student belongs to <b>Class {actualClassName || 'Unknown'}</b>. Please select an eligible student to proceed.
                    </Typography>
                </Box>
            )}

            {/* AUTOMATIC FORM RENDERING FOR VALID CLASSES (No Green Box) */}
            {isStudentSelected && isAllowedGrade && (
                <Box sx={{ mt: '30px' }}>
                    {Object.entries(currentQuestions).map(([domain, questions]) => (
                        <Box sx={{ mt: '24px' }} key={domain}>
                            <CustomCollapsibleComponent 
                                open={boolStats[domain]} 
                                title={domain} 
                                onClick={() => setBoolStats(prev => ({ ...prev, [domain]: !prev[domain] }))}
                            >
                                {questions.map((qn, index) => (
                                    <Box sx={{ mb: '28px', borderBottom: '1px solid #f0f0f0', pb: 2 }} key={index}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography variant={typographyConstants.h5} sx={{ color: qn.includes('(R)') ? '#E53935' : '#334155' }}>
                                                {qn}
                                            </Typography>
                                        </Box>
                                        <FormControl sx={{ mt: '12px', pl: '10px' }}>
                                            <RadioGroup 
                                                row 
                                                value={formData[`${domain}_${index}`]?.option || ''} 
                                                onChange={(e) => handleOptionChange(domain, index, e.target.value)}
                                            >
                                                {currentOptions.map((opt) => (
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
                                ))}
                            </CustomCollapsibleComponent>
                        </Box>
                    ))}
                </Box>
            )}

            {/* INSTRUCTION BEFORE STUDENT IS SELECTED */}
            {!isStudentSelected && (
                <Box sx={{ mt: 5, p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                    <Typography color="textSecondary">
                        Please select a student to auto-load the correct SEL assessment version.
                    </Typography>
                </Box>
            )}
        </Box>
    );
});

export default AddSELAssessment;