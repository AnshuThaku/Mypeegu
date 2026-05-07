import React, { useState, useEffect, useMemo } from 'react';
import { Box, Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Typography, TextField, InputAdornment, Button, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { tableStyles } from '../../../components/styles/tableStyles';
import { heartDomains, getHeartTier } from './TeacherPSConstants';
import AddTeacherPSDialog from './AddTeacherPSDialog';
import TeacherPSDrawer from './TeacherPSDrawer';
import { formatDate } from '../../../utils/utils';

const TeacherPSMain = () => {
    const [records, setRecords] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [selectedData, setSelectedData] = useState(null);
    const [modal, setModal] = useState({ add: false, drawer: false });

    useEffect(() => {
        const saved = localStorage.getItem('teacherPSRecords');
        if (saved) setRecords(JSON.parse(saved));
    }, []);

    const filteredRecords = useMemo(() => {
        return records.filter(r => r.educatorName?.toLowerCase().includes(searchText.toLowerCase()) || r.user_id?.includes(searchText));
    }, [records, searchText]);

    const renderDomainScore = (row, domain) => {
        const score = row.domainScores?.[domain] || 0;
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ p: '2px 8px', borderRadius: '4px', bgcolor: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                    <Typography sx={{ fontSize: '11px', fontWeight: 700 }}>{score}</Typography>
                </Box>
                <IconButton size='small' onClick={() => {
                    setSelectedData({ title: domain, total: score, responses: row.responses, domain });
                    setModal(prev => ({ ...prev, drawer: true }));
                }}>
                    <VisibilityIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </IconButton>
            </Box>
        );
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <TextField
                    placeholder="Search Educator..." size='small' value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{ startAdornment: <InputAdornment position='start'><SearchIcon fontSize="small" /></InputAdornment> }}
                />
                <Button variant='contained' onClick={() => setModal(prev => ({ ...prev, add: true }))}>+ Add Survey</Button>
            </Box>

            <TableContainer sx={tableStyles.container}>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableStyles.headerCell}>ID</TableCell>
                            <TableCell sx={tableStyles.headerCell}>EDUCATOR</TableCell>
                            <TableCell sx={tableStyles.headerCell}>CODE NAME</TableCell>
                            {heartDomains.map(d => <TableCell key={d} sx={tableStyles.headerCell}>{d.toUpperCase()}</TableCell>)}
                            <TableCell sx={tableStyles.headerCell}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell>{row.user_id}</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>{row.educatorName}</TableCell>
                                <TableCell>{row.codeName}</TableCell>
                                {heartDomains.map(d => <TableCell key={d}>{renderDomainScore(row, d)}</TableCell>)}
                                <TableCell>
                                    <IconButton onClick={() => {
                                        const upd = records.filter(item => item.id !== row.id);
                                        setRecords(upd);
                                        localStorage.setItem('teacherPSRecords', JSON.stringify(upd));
                                    }}>
                                        <DeleteOutlineIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {modal.add && (
                <AddTeacherPSDialog 
                    open={modal.add} 
                    onClose={() => setModal(prev => ({ ...prev, add: false }))}
                    onAdd={(rec) => {
                        const newBatch = [rec, ...records];
                        setRecords(newBatch);
                        localStorage.setItem('teacherPSRecords', JSON.stringify(newBatch));
                    }}
                />
            )}
            {modal.drawer && (
                <TeacherPSDrawer 
                    open={modal.drawer} 
                    onClose={() => setModal(prev => ({ ...prev, drawer: false }))}
                    data={selectedData}
                />
            )}
        </Box>
    );
};

export default TeacherPSMain;