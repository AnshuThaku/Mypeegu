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
import { getTierByScore } from './safeSpacesConstants'
import AddSafeSpacesDialog from './AddSafeSpacesDialog'
import SafeSpacesDrawer from './SafeSpacesDrawer'
import CommonFilterDrawer, { initialFilterStates, initialAccordionStates } from '../../../components/commonComponents/CustomFilter'
import { formatDate } from '../../../utils/utils'

const SafeSpaces = () => {
    const [allRecords, setAllRecords] = useState([])
    const [searchText, setSearchText] = useState('')
    const [filterData, setFilterData] = useState(initialFilterStates)
    const [selectedData, setSelectedData] = useState(null)
    const [modal, setModal] = useState({ add: false, drawer: false, filter: false, analytics: false })

    useEffect(() => {
        const savedData = localStorage.getItem('safeSpacesRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }, [])

    const handleModal = useCallback((name, value) => {
        setModal((state) => ({ ...state, [name]: value }))
    }, [])

    const handleDelete = (id) => {
        const updated = allRecords.filter(item => item.id !== id)
        setAllRecords(updated)
        localStorage.setItem('safeSpacesRecords', JSON.stringify(updated))
    }

    const renderDomainScore = (row, domainName) => {
        // Saved structure use karke score nikal rahe hain
        const score = row.domainScores?.[domainName] || 0
        const tier = getTierByScore(score)
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    width: '24px', height: '24px', borderRadius: '4px',
                    backgroundColor: tier.color, display: 'flex',
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    <Typography sx={{ fontSize: '11px', color: 'white', fontWeight: 700 }}>{score}</Typography>
                </Box>
                <IconButton size='small' onClick={() => {
                    setSelectedData({
                        title: domainName,
                        total: score,
                        version: row.version, // Version send kiya taaki drawer options identify kar sake
                        questions: row.responses?.[domainName] || []
                    })
                    handleModal('drawer', true)
                }}>
                    <VisibilityIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </IconButton>
            </Box>
        )
    }

    const filteredRecords = useMemo(() => {
        return allRecords.filter(record => 
            record.studentName?.toLowerCase().includes(searchText.toLowerCase()) ||
            record.user_id?.includes(searchText)
        )
    }, [allRecords, searchText])

    return (
        <Box sx={counsellorStyles.pageContainerSx}>
            <Box sx={counsellorStyles.toolbarSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search Student name or by ID"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        size='small'
                        sx={counsellorStyles.searchFieldSx}
                        InputProps={{ startAdornment: (<InputAdornment position='start'><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment>) }}
                    />
                </Box>

                <Box sx={counsellorStyles.actionButtonsSx}>
                    <IconButton onClick={() => handleModal('filter', true)} sx={counsellorStyles.filterButtonSx}>
                        <FilterListIcon sx={{ fontSize: 18 }} />
                    </IconButton>

                    <Button
                        variant='outlined'
                        sx={{ ...counsellorStyles.addButtonSx, borderColor: 'primary.main', color: 'primary.main' }}
                        onClick={() => handleModal('analytics', true)}
                    >
                        Baseline Analytics
                    </Button>

                    <Button
                        variant='contained'
                        sx={counsellorStyles.addButtonSx}
                        onClick={() => handleModal('add', true)}
                    >
                        + Add Assessment
                    </Button>
                </Box>
            </Box>

            <TableContainer sx={{ mt: 2, ...tableStyles.container, flex: 1 }}>
                <Table stickyHeader size='small'>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={tableStyles.headerCell}>ID</TableCell>
                            <TableCell sx={tableStyles.headerCell}>ACADEMIC YEAR</TableCell>
                            <TableCell sx={tableStyles.headerCell}>STUDENT NAME</TableCell>
                            <TableCell sx={tableStyles.headerCell}>CREATED DATE</TableCell>
                            <TableCell sx={tableStyles.headerCell}>EMOTIONAL</TableCell>
                            <TableCell sx={tableStyles.headerCell}>PHYSICAL</TableCell>
                            <TableCell sx={tableStyles.headerCell}>SOCIAL</TableCell>
                            <TableCell sx={tableStyles.headerCell}>ADULT SUPPORT</TableCell>
                            <TableCell sx={tableStyles.headerCell}>SYSTEM RESP.</TableCell>
                            <TableCell sx={tableStyles.headerCell}>AGENCY</TableCell>
                            <TableCell sx={tableStyles.headerCell}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((row) => (
                            <TableRow key={row.id} sx={tableStyles.bodyRow}>
                                <TableCell sx={{ fontWeight: 700 }}>{row.user_id}</TableCell>
                                {/* Mapping Academic Year Properly */}
                                <TableCell>{row.academicYear || '-'}</TableCell>
                                <TableCell sx={{ textTransform: 'uppercase' }}>{row.studentName}</TableCell>
                                <TableCell>{formatDate(row.createdAt)}</TableCell>
                                <TableCell>{renderDomainScore(row, 'Emotional Safety')}</TableCell>
                                <TableCell>{renderDomainScore(row, 'Physical Safety')}</TableCell>
                                <TableCell>{renderDomainScore(row, 'Social Belonging')}</TableCell>
                                <TableCell>{renderDomainScore(row, 'Adult Support')}</TableCell>
                                <TableCell>{renderDomainScore(row, 'System Responsiveness')}</TableCell>
                                <TableCell>{renderDomainScore(row, 'Student Agency')}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(row.id)}>
                                        <DeleteOutlineIcon sx={{ color: '#EF4444', fontSize: 18 }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <CommonFilterDrawer
                onOpen={modal.filter}
                handleModal={handleModal}
                filterData={filterData}
                setFilterData={setFilterData}
                filterOptions={{ ...initialAccordionStates, AYs: true, schools: true, classrooms: true }}
                onApply={() => handleModal('filter', false)}
            />

            {modal.add && (
                <AddSafeSpacesDialog
                    open={modal.add}
                    onClose={() => handleModal('add', false)}
                    onAdd={(rec) => setAllRecords([rec, ...allRecords])}
                />
            )}

            {modal.drawer && (
                <SafeSpacesDrawer
                    open={modal.drawer}
                    onClose={() => handleModal('drawer', false)}
                    data={selectedData}
                />
            )}
        </Box>
    )
}

export default SafeSpaces