import React from 'react';
import { Box, Drawer, Typography, IconButton, Radio, FormControlLabel, RadioGroup, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const TeacherPSDrawer = ({ open, onClose, data }) => {
    if (!data) return null;

    // Filter responses specifically for the selected domain
    const domainResponses = Object.values(data.responses || {}).filter(r => 
        data.domainQuestions?.includes(r.question)
    );

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 450, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="primary">{data.title}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {domainResponses.map((item, idx) => (
                    <Box key={idx} sx={{ mb: 4 }}>
                        <Typography sx={{ fontWeight: 500, mb: 1, fontSize: '14px' }}>
                            {`${idx + 1}. ${item.question}`}
                        </Typography>
                        <RadioGroup value={item.option}>
                            {['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'].map((opt) => (
                                <FormControlLabel 
                                    key={opt} value={opt} 
                                    control={<Radio size="small" />} 
                                    label={<Typography sx={{ fontSize: '13px' }}>{opt}</Typography>} 
                                    disabled 
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                ))}

                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 700 }}>Total Domain Points:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{data.total}</Typography>
                </Box>
            </Box>
        </Drawer>
    );
};

export default TeacherPSDrawer;