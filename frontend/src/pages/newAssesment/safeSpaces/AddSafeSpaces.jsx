import React, {
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Typography,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Paper,
} from '@mui/material';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import useCommonStyles from '../../../components/styles';
import {
    safeSpacesQns_vA,
    safeSpacesQns_vB,
    scoringMapping 
} from './safeSpacesConstants';
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent';
import {
    delay,
    getCurrentAcademicYearId,
} from '../../../utils/utils';
import CommonBarFilter, {
    initialBarFilterStates,
} from '../../../components/commonComponents/CommonBarFilter';

const testInValid = [undefined, null, ''];

const AddSafeSpaces = forwardRef(
    ({ onSaveStateChange, handleClose, clearOptionsRef }, ref) => {
        const flexStyles = useCommonStyles();
        const { academicYears } = useSelector((store) => store.dashboardSliceSetup);

        const [formData, setFormData] = useState({});
        const [student, setStudent] = useState({});
        const [studentVoice, setStudentVoice] = useState('');
        const [barFilterData, setBarFilterData] = useState(initialBarFilterStates);
        const [boolStats, setBoolStats] = useState({
            'Physical Safety': true, 
        });

        // ================= VERSION LOGIC ================= 
        const selectedAcademicYearObj = academicYears.find(
            (ay) => ay._id === barFilterData.selectdAYs
        );
        
        let isVersion2 = false; 
        if (selectedAcademicYearObj) {
            const yearString = selectedAcademicYearObj.academicYear || selectedAcademicYearObj.label || "";
            const startYear = parseInt(yearString.split('-')[0], 10);
            if(startYear >= 2026) {
                isVersion2 = true;
            }
        }

        const currentQuestions = isVersion2 ? safeSpacesQns_vB : safeSpacesQns_vA;
        const currentMapping = isVersion2 ? scoringMapping.versionB : scoringMapping.versionA;

        const isStudentSelected = !testInValid.includes(student?.studentName) && !testInValid.includes(student?.user_id);
        
        useEffect(() => {
            if (!currentQuestions) return;
            const totalQns = Object.values(currentQuestions).flat().length;
            const filledQns = Object.keys(formData).length;
            
            const isInvalid = !isStudentSelected || filledQns < totalQns;
            onSaveStateChange(isInvalid);
        }, [formData, student, currentQuestions, isStudentSelected, onSaveStateChange]);

        const handleOptionChange = (domain, index, option) => {
            const points = currentMapping[option] || 0;
            setFormData(prev => ({
                ...prev,
                [`${domain}_${index}`]: { option, points }
            }));
        };

        const calculateScore = () => {
            const responses = Object.values(formData);
            const totalActual = responses.reduce((sum, item) => sum + item.points, 0);
            const maxPointsPerQ = isVersion2 ? 4 : 3; 
            const totalMax = responses.length * maxPointsPerQ;
            return totalMax > 0 ? Math.round((totalActual / totalMax) * 100) : 0;
        };

        useImperativeHandle(ref, () => ({
            getSubmitData: () => {
                // 1. Group responses by Domain & Calculate individual domain scores
                const responses = {};
                const domainScores = {};
                const maxPointsPerQ = isVersion2 ? 4 : 3;

                Object.entries(currentQuestions).forEach(([domain, questions]) => {
                    responses[domain] = [];
                    let domainActualPoints = 0;
                    let answeredCount = 0;

                    questions.forEach((qn, index) => {
                        const answer = formData[`${domain}_${index}`];
                        if (answer) {
                            responses[domain].push({
                                question: qn,
                                option: answer.option,
                                points: answer.points
                            });
                            domainActualPoints += answer.points;
                            answeredCount++;
                        }
                    });

                    // Calculate percentage for this specific domain
                    if (answeredCount > 0) {
                        const domainMax = answeredCount * maxPointsPerQ;
                        domainScores[domain] = Math.round((domainActualPoints / domainMax) * 100);
                    } else {
                        domainScores[domain] = 0;
                    }
                });

                return {
                    id: Date.now(),
                    user_id: student.user_id,
                    studentName: student.studentName,
                    overallScore: calculateScore(),
                    version: isVersion2 ? 'versionB' : 'versionA',
                    studentVoice: studentVoice,
                    academicYear: barFilterData.selectdAYs,
                    createdAt: new Date().toISOString(),
                    responses: responses,       // Saved for Drawer
                    domainScores: domainScores  // Saved for Table Columns
                };
            }
        }));

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

                {isStudentSelected ? (
                    <Box sx={{ mt: '30px' }}>
                        <Typography variant="body2" sx={{ mb: 3, fontStyle: 'italic', color: 'text.secondary' }}>
                            "Your voice matters. This assessment helps us ensure you feel safe and supported at school."
                        </Typography>

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
                                                <Typography variant={typographyConstants.h5} sx={{ minWidth: '25px' }}>
                                                    {`${index + 1}.`}
                                                </Typography>
                                                <Typography variant={typographyConstants.h5}>
                                                    {qn}
                                                </Typography>
                                            </Box>
                                            
                                            <FormControl sx={{ mt: '12px', pl: '25px' }}>
                                                <RadioGroup
                                                    row
                                                    value={formData[`${domain}_${index}`]?.option || ''}
                                                    onChange={(e) => handleOptionChange(domain, index, e.target.value)}
                                                >
                                                    {Object.keys(currentMapping).map((opt) => (
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

                        <Paper elevation={0} sx={{ p: 2, mt: 4, borderRadius: '8px', border: '1px solid #e0e0e0', bgcolor: '#fafafa' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Student Voice (Optional)
                            </Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                placeholder="What would help you feel safer?"
                                value={studentVoice}
                                onChange={(e) => setStudentVoice(e.target.value)}
                                sx={{ backgroundColor: '#fff' }}
                            />
                        </Paper>
                    </Box>
                ) : (
                    <Box sx={{ mt: 5, p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                        <Typography color="textSecondary">
                            Please select a student to load the Safe Spaces assessment items.
                        </Typography>
                    </Box>
                )}
            </Box>
        );
    }
);

export default AddSafeSpaces;