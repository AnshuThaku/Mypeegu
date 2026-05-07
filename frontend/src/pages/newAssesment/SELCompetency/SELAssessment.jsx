import React, { useEffect, useState, useCallback, useMemo } from 'react'
import {
    Box, IconButton, Table, TableBody, TableCell, TableRow, 
    TableHead, TableContainer, Typography, TextField, 
    InputAdornment, Button, Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { tableStyles } from '../../../components/styles/tableStyles'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import { getSELTier } from './SELConstants' // Naya constant file[cite: 5, 7]
import AddSELAssessmentDialog from './AddSELAssessmentDialog' // Add Dialog
import CommonFilterDrawer from '../../../components/commonComponents/CustomFilter'
import { initialFilterStates, initialAccordionStates } from '../../../components/commonComponents/CustomFilter'

const SELAssessment = () => {
    const [allRecords, setAllRecords] = useState([])
    const [searchText, setSearchText] = useState('')
    const [filterData, setFilterData] = useState(initialFilterStates)
    
    const [modal, setModal] = useState({
        add: false,
        filter: false,
        analytics: false 
    })

    const handleModal = useCallback((name, value) => {
        setModal((state) => ({ ...state, [name]: value }))
    }, [])

    // LocalStorage se data load karna
    useEffect(() => {
        const savedData = localStorage.getItem('selAssessmentRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }, [])

    // Search logic
    const filteredRecords = useMemo(() => {
        return allRecords.filter(record => 
            record.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
            record.user_id?.includes(searchText)
        )
    }, [allRecords, searchText])

    const handleDelete = (id) => {
        const updated = allRecords.filter(item => item.id !== id)
        setAllRecords(updated)
        localStorage.setItem('selAssessmentRecords', JSON.stringify(updated))
    }

    return (
        <Box sx={counsellorStyles.pageContainerSx}>
            {/* Toolbar: Search and Action Buttons[cite: 3] */}
            <Box sx={counsellorStyles.toolbarSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search Student..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size='small'
                        sx={counsellorStyles.searchFieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                <Box sx={counsellorStyles.actionButtonsSx}>
                    <IconButton 
                        sx={counsellorStyles.filterButtonSx}
                        onClick={() => handleModal('filter', true)}
                    >
                        <FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    </IconButton>

                    <Button
                        variant='outlined'
                        sx={{ 
                            ...counsellorStyles.addButtonSx, 
                            borderColor: 'primary.main', 
                            color: 'primary.main',
                            backgroundColor: 'transparent'
                        }}
                        onClick={() => handleModal('analytics', true)}
                    >
                        SEL Analytics
                    </Button>

                    <Button
                        variant='contained'
                        sx={counsellorStyles.addButtonSx}
                        onClick={() => handleModal('add', true)}
                    >
                        + Add SEL Assessment
                    </Button>
                </Box>
            </Box>

            {/* Assessment Data Table[cite: 3] */}
            <TableContainer sx={{ mt: 2, ...tableStyles.container, flex: 1 }}>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableStyles.headerCell}>Student ID</TableCell>
                            <TableCell sx={tableStyles.headerCell}>Name</TableCell>
                            <TableCell sx={tableStyles.headerCell}>Grade Version</TableCell>
                            <TableCell sx={tableStyles.headerCell}>SEL Score (%)</TableCell>
                            <TableCell sx={tableStyles.headerCell}>Competency Level</TableCell>
                            <TableCell sx={tableStyles.headerCell}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.length > 0 ? filteredRecords.map((row) => {
                            const tier = getSELTier(row.overallScore); // Scoring logic from PDF
                            return (
                                <TableRow key={row.id} sx={tableStyles.bodyRow}>
                                    <TableCell sx={tableStyles.bodyCell}>{row.user_id}</TableCell>
                                    <TableCell sx={tableStyles.bodyCell}>{row.studentName}</TableCell>
                                    <TableCell sx={tableStyles.bodyCell}>
                                        {row.version === 'versionA' ? 'Grades 3-5' : 'Grades 6-12'}
                                    </TableCell>
                                    <TableCell sx={tableStyles.bodyCell}>
                                        <Typography sx={{ fontWeight: 700, color: tier.color }}>
                                            {row.overallScore}%
                                        </Typography>
                                    </TableCell>
                                    <TableCell sx={tableStyles.bodyCell}>
                                        <Chip 
                                            label={tier.label} 
                                            size="small" 
                                            sx={{ backgroundColor: tier.color, color: 'white' }} 
                                        />
                                    </TableCell>
                                    <TableCell sx={tableStyles.bodyCell}>
                                        <IconButton>
                                            <VisibilityIcon sx={{ fontSize: 18 }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(row.id)}>
                                            <DeleteOutlineIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography color="textSecondary">No SEL records found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Filter Drawer[cite: 4] */}
            <CommonFilterDrawer
                onOpen={modal.filter}
                handleModal={handleModal}
                filterData={filterData}
                setFilterData={setFilterData}
                filterOptions={{
                    ...initialAccordionStates,
                    AYs: true,
                    schools: true,
                    classrooms: true,
                }}
                onApply={() => handleModal('filter', false)}
            />

            {/* Add Assessment Dialog[cite: 2] */}
            {modal.add && (
                <AddSELAssessmentDialog
                    open={modal.add}
                    onClose={() => handleModal('add', false)}
                    onAdd={(newRecord) => {
                        const updated = [newRecord, ...allRecords]
                        setAllRecords(updated)
                        localStorage.setItem('selAssessmentRecords', JSON.stringify(updated))
                        handleModal('add', false)
                    }}
                />
            )}
        </Box>
    )
}

export default SELAssessment;