import React, {
    useEffect,
    useState,
    useRef,
    useImperativeHandle,
    forwardRef,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box,
    Typography,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
} from '@mui/material'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import useCommonStyles from '../../../components/styles'
import { selQns_vA, selQns_vB, selScoringMapping, selDomains } from './SELConstants' // PDF based constants
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import {
    delay,
    getCurrentAcademicYearId,
} from '../../../utils/utils'
import CommonBarFilter, {
    initialBarFilterStates,
} from '../../../components/commonComponents/CommonBarFilter'

const testInValid = [undefined, null, '']

const AddSELAssessment = forwardRef(
    ({ onSaveStateChange, handleClose, clearOptionsRef }, ref) => {
        const flexStyles = useCommonStyles()
        const { academicYears } = useSelector((store) => store.dashboardSliceSetup)

        // States
        const [formData, setFormData] = useState({})
        const [student, setStudent] = useState({})
        const [barFilterData, setBarFilterData] = useState(initialBarFilterStates)
        const [boolStats, setBoolStats] = useState({
            'SELF-AWARENESS': true, // Default open first domain
        })

        // ================= VERSION LOGIC (Baseline pattern) ================= 
        const selectedAcademicYearObj = academicYears.find(
            (ay) => ay._id === barFilterData.selectdAYs
        );
        
        let isVersion2 = false; // Version B for Grades 6-12
        if (selectedAcademicYearObj) {
            const yearString = selectedAcademicYearObj.academicYear || selectedAcademicYearObj.label || "";
            const startYear = parseInt(yearString.split('-')[0], 10);
            
            // Note: Baseline logic uses 2026, yahan PDF ke according 6-12 check kar sakte hain
            // Par aapne manga hai "same isi ki tarah", toh year logic follow ho raha hai.
            if(startYear >= 2026) {
                isVersion2 = true;
            }
        }

        const currentQuestions = isVersion2 ? selQns_vB : selQns_vA;
        const currentMapping = isVersion2 ? selScoringMapping.versionB : selScoringMapping.versionA;

        // Validation logic
        const isStudentSelected = !testInValid.includes(student?.studentName) && !testInValid.includes(student?.user_id);
        
        useEffect(() => {
            const totalQns = Object.values(currentQuestions).flat().length;
            const filledQns = Object.keys(formData).length;
            const isInvalid = !isStudentSelected || filledQns < totalQns;
            onSaveStateChange(isInvalid);
        }, [formData, student, currentQuestions, isStudentSelected]);

        // Scoring and Form Handling
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
            const maxPointsPerQ = isVersion2 ? 4 : 3; // Version B uses 4-point scale[cite: 7]
            const totalMax = responses.length * maxPointsPerQ;
            return totalMax > 0 ? Math.round((totalActual / totalMax) * 100) : 0;
        };

        useImperativeHandle(ref, () => ({
            getSubmitData: () => {
                return {
                    id: Date.now(),
                    user_id: student.user_id,
                    studentName: student.studentName,
                    overallScore: calculateScore(),
                    version: isVersion2 ? 'versionB' : 'versionA',
                    academicYear: barFilterData.selectdAYs,
                    createdAt: new Date().toISOString()
                };
            }
        }));

        // Academic Year Auto-population
        const isInitialLoad = useRef(true)
        useEffect(() => {
            const populateAY = async () => {
                if (academicYears.length > 0 && isInitialLoad.current) {
                    const currentAYId = getCurrentAcademicYearId(academicYears)
                    if (currentAYId) {
                        await delay()
                        setBarFilterData(prev => ({ ...prev, selectdAYs: currentAYId }))
                    }
                    isInitialLoad.current = false
                }
            }
            populateAY()
        }, [academicYears])

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
                            "There are no right or wrong answers. Your answers will help us support you better."[cite: 7]
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
                    </Box>
                ) : (
                    <Box sx={{ mt: 5, p: 4, textAlign: 'center', border: '1px dashed #ccc', borderRadius: '8px' }}>
                        <Typography color="textSecondary">
                            Please select a student to load the SEL assessment items.
                        </Typography>
                    </Box>
                )}
            </Box>
        )
    },
)

export default AddSELAssessment;