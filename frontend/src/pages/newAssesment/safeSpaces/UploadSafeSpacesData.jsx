import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadSafeSpacesData = ({ open, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) return;

        // Note: Yahan aap apni actual Excel parsing logic (XLSX library) laga sakte hain.
        // Filhal design aur flow maintain karne ke liye, hum upload ko simulate kar rahe hain.
        const existingRecords = JSON.parse(localStorage.getItem('safeSpacesRecords') || '[]');
        
        // Success callback with existing records (you can modify this to append parsed Excel data later)
        if(onUploadSuccess) {
            onUploadSuccess(existingRecords); 
        }
        
        setFile(null); // Reset after upload
        onClose();
    };

    const handleClose = () => {
        setFile(null);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E293B' }}>
                    Bulk Upload Safe Spaces Assessments
                </Typography>
                <IconButton onClick={handleClose} size="small">
                    <CloseIcon sx={{ color: '#64748B' }} />
                </IconButton>
            </DialogTitle>
            
            <DialogContent sx={{ p: 4 }}>
                <Box 
                    sx={{
                        border: '2px dashed #CBD5E1',
                        borderRadius: '8px',
                        p: 5,
                        textAlign: 'center',
                        bgcolor: '#F8FAFC',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                    <Typography variant="body1" sx={{ color: '#334155', mb: 1, fontWeight: 500 }}>
                        Drag and drop your Excel file here
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                        or click to browse from your computer (.xlsx, .csv)
                    </Typography>
                    
                    <Button 
                        variant="contained" 
                        component="label" 
                        sx={{ bgcolor: '#0267D9', textTransform: 'none', px: 4 }}
                    >
                        Browse File
                        <input 
                            type="file" 
                            hidden 
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" 
                            onChange={handleFileChange} 
                        />
                    </Button>

                    {file && (
                        <Box sx={{ mt: 3, p: 1.5, bgcolor: '#ECFDF5', borderRadius: '4px', width: '100%' }}>
                            <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 600 }}>
                                Selected File: {file.name}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2.5, borderTop: '1px solid #E2E8F0' }}>
                <Button 
                    onClick={handleClose} 
                    variant="outlined" 
                    sx={{ color: '#64748B', borderColor: '#CBD5E1', textTransform: 'none', px: 3 }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleUpload} 
                    variant="contained" 
                    disabled={!file} 
                    sx={{ bgcolor: '#0267D9', textTransform: 'none', px: 4 }}
                >
                    Upload Data
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UploadSafeSpacesData;