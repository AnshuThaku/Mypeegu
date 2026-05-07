import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from 'react';
import { Box, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Divider } from '@mui/material';
import { pulseQuestions } from './pulseConstants';
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent';
import CommonBarFilter, { initialBarFilterStates } from '../../../components/commonComponents/CommonBarFilter';
import { typographyConstants } from '../../../resources/theme/typographyConstants';
import { getCurrentAcademicYearId, delay } from '../../../utils/utils';
import { useSelector } from 'react-redux';

const AddPulse = forwardRef(({ onSaveStateChange, clearOptionsRef }, ref) => {
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup);
    
    // States: Ensure barFilterData is initialized with initialBarFilterStates
    const [formData, setFormData] = useState({});
    const [student, setStudent] = useState({});
    const [barFilterData, setBarFilterData] = useState(initialBarFilterStates); 
    const [boolStats, setBoolStats] = useState({ 'SECTION 1: My Online Time': true });

    const isStudentSelected = student?.studentName && student?.user_id;

    // Validation logic like AddSafeSpaces[cite: 3, 4]
    useEffect(() => {
        const totalQns = Object.values(pulseQuestions).flat().length;
        const filledQns = Object.keys(formData).length;
        const isInvalid = !isStudentSelected || filledQns < totalQns;
        onSaveStateChange(isInvalid);
    }, [formData, student, onSaveStateChange, isStudentSelected]);

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

    useImperativeHandle(ref, () => ({
        getSubmitData: () => ({
            id: Date.now(),
            user_id: student.user_id,
            studentName: student.studentName,
            responses: formData,
            academicYear: barFilterData.selectdAYs,
            createdAt: new Date().toISOString()
        })
    }));

    return (
        <Box sx={{ mt: '10px' }}>
            {/* CommonBarFilter needs correctly initialized barFilterData[cite: 3, 4] */}
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

            {isStudentSelected && (
                <Box sx={{ mt: '30px' }}>
                    {Object.entries(pulseQuestions).map(([domain, questions]) => (
                        <Box sx={{ mt: '24px' }} key={domain}>
                            <CustomCollapsibleComponent 
                                open={boolStats[domain]} 
                                title={domain} 
                                onClick={() => setBoolStats(prev => ({ ...prev, [domain]: !prev[domain] }))}
                            >
                                {questions.map((qn, idx) => (
                                    <Box key={idx} sx={{ mb: '28px', borderBottom: '1px solid #f0f0f0', pb: 2 }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Typography variant={typographyConstants.h5} sx={{ minWidth: '25px' }}>{`${idx + 1}.`}</Typography>
                                            <Typography variant={typographyConstants.h5}>{qn}</Typography>
                                        </Box>
                                        <FormControl sx={{ mt: '12px', pl: '25px' }}>
                                            <RadioGroup row onChange={(e) => setFormData(prev => ({ ...prev, [`${domain}_${idx}`]: { option: e.target.value } }))}>
                                                {["Always", "Often", "Sometimes", "Never"].map(opt => (
                                                    <FormControlLabel key={opt} value={opt} control={<Radio size="small" />} label={opt} sx={{ mr: 3 }} />
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
        </Box>
    );
});

export default AddPulse;