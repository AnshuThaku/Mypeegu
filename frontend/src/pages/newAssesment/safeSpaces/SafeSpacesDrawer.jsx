import React from 'react'
import { Box, Drawer, Typography, IconButton, Radio, FormControlLabel, RadioGroup, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { scoringMapping } from './safeSpacesConstants'

const SafeSpacesDrawer = ({ open, onClose, data }) => {
    if (!data) return null

    // Version ke basis pe options uthana (Varna default Hardcoded aa rahe the)
    const optionsArray = data.version === 'versionB' 
        ? Object.keys(scoringMapping.versionB) 
        : Object.keys(scoringMapping.versionA);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 450, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" color="primary">{data.title}</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
                <Divider sx={{ mb: 3 }} />

                {data.questions && data.questions.length > 0 ? (
                    data.questions.map((item, idx) => (
                        <Box key={idx} sx={{ mb: 4 }}>
                            {/* Numbering according to questions array length */}
                            <Typography sx={{ fontWeight: 500, mb: 1 }}>{`${idx + 1}. ${item.question}`}</Typography>
                            
                            {/* Saved Option select rahega aur baaki disabled rahenge */}
                            <RadioGroup value={item.option}>
                                {optionsArray.map((opt) => (
                                    <FormControlLabel 
                                        key={opt} 
                                        value={opt} 
                                        control={<Radio size="small" />} 
                                        label={<Typography sx={{ fontSize: '13px' }}>{opt}</Typography>} 
                                        disabled // View-only mode
                                    />
                                ))}
                            </RadioGroup>
                        </Box>
                    ))
                ) : (
                    <Typography>No data found for this domain.</Typography>
                )}

                <Box sx={{ mt: 2, p: 2, bgcolor: '#f0f7ff', borderRadius: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography sx={{ fontWeight: 700 }}>Domain Score:</Typography>
                    <Typography sx={{ fontWeight: 700, color: 'primary.main' }}>{data.total}%</Typography>
                </Box>
            </Box>
        </Drawer>
    )
}
export default SafeSpacesDrawer