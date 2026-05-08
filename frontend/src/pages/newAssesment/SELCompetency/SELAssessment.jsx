import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Checkbox, IconButton, Table, TableBody, TableCell, TableRow, TableHead, TableContainer, Typography, TextField, InputAdornment, Button } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { tableStyles } from '../../../components/styles/tableStyles'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import { selColumn, getSELTier } from './SELConstants'
import AddSELAssessmentDialog from './AddSELAssessmentDialog'
import SELDrawer from './SELDrawer'
import SELAnalytics from './SELAnalytics'
import UploadSELData from './UploadSELData' // Make sure this matches your actual file name
import CustomDialog from '../../../components/CustomDialog'
import CustomPagination from '../../../components/CustomPagination'
import { formatDate } from '../../../utils/utils'
import CommonFilterDrawer, { initialFilterStates, initialAccordionStates } from '../../../components/commonComponents/CustomFilter'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
import { iconConstants } from '../../../resources/theme/iconConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'

const SELAssessment = () => {
    const tableContainerRef = useRef(null)
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup)

    const [allRecords, setAllRecords] = useState([])
    const [searchText, setSearchText] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState({ text: '150', value: 150 })
    const [currentPage, setCurrentPage] = useState(1)

    // Added bulkUpload to modal state
    const [modal, setModal] = useState({ add: false, drawer: false, filter: false, deleteSingle: false, analytics: false, bulkUpload: false })
    const [selectedData, setSelectedData] = useState({ domainKey: '', displayLabel: '', total: 0, rowData: null })
    const [selectedDropDown, setSelectedDropDown] = useState('')
    const [deleteId, setDeleteId] = useState('')
    
    const [filterData, setFilterData] = useState(initialFilterStates)

    useEffect(() => {
        const savedData = localStorage.getItem('selAssessmentRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }, [])

    const handleDrawerEditSuccess = () => {
        const savedData = localStorage.getItem('selAssessmentRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }

    const handleModal = useCallback((name, value) => { setModal((state) => ({ ...state, [name]: value })) }, [])

    const getAcademicYearLabel = (id) => {
        if (!academicYears || !id) return '-'
        const yearObj = academicYears.find((ay) => ay._id === id)
        return yearObj ? yearObj.academicYear || yearObj.label : '-'
    }

    const renderDomainScore = (row, exactKey) => {
        const score = row.domainScores?.[exactKey] || 0
        const tier = getSELTier(score, row.version)
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: '28px', height: '24px', borderRadius: '4px', backgroundColor: tier.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ fontSize: '11px', color: 'white', fontWeight: 700 }}>{score}</Typography>
                </Box>
                <IconButton size='small' onClick={() => {
                    setSelectedData({ domainKey: exactKey, displayLabel: exactKey, total: score, rowData: row })
                    handleModal('drawer', true)
                }}>
                    <VisibilityIcon sx={{ fontSize: 16, color: '#64748B' }} />
                </IconButton>
            </Box>
        )
    }

    const renderCellContent = (column, row) => {
        const fieldName = column.name
        if (fieldName === 'user_id') return row?.user_id || '-'
        if (fieldName === 'academicYear') return getAcademicYearLabel(row?.academicYear)
        if (fieldName === 'createdAt') return formatDate(row?.createdAt) || '-'
        if (fieldName === 'studentName') return <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 500, textTransform: 'uppercase' }}>{row?.studentName || '-'}</Typography>

        if (['SELF-AWARENESS', 'SELF-MANAGEMENT', 'SOCIAL AWARENESS', 'RELATIONSHIP SKILLS', 'RESPONSIBLE DECISION-MAKING', 'ENGAGEMENT', 'OPTIMISM', 'CONNECTEDNESS', 'HAPPINESS'].includes(fieldName)) {
            return renderDomainScore(row, fieldName)
        }
        return '-'
    }

    const filteredRecords = useMemo(() => {
        return allRecords.filter((record) => {
            const nameMatch = record.studentName ? record.studentName.toLowerCase().includes(searchText.toLowerCase()) : false
            const idMatch = record.user_id ? record.user_id.toLowerCase().includes(searchText.toLowerCase()) : false
            return searchText ? (nameMatch || idMatch) : true
        })
    }, [allRecords, searchText])

    const tableMinWidth = useMemo(() => selColumn.reduce((sum, col) => sum + (col.width || 120), 0), [])

    return (
        <Box sx={counsellorStyles.pageContainerSx}>
            <Box sx={counsellorStyles.toolbarSx}>
                <TextField placeholder='Search Student or ID...' value={searchText} onChange={(e) => setSearchText(e.target.value)} size='small' sx={counsellorStyles.searchFieldSx} InputProps={{ startAdornment: (<InputAdornment position='start'><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment>) }} />
                <Box sx={counsellorStyles.actionButtonsSx}>
                    <IconButton onClick={() => handleModal('filter', true)} sx={counsellorStyles.filterButtonSx}><FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} /></IconButton>
                    <Button variant='outlined' sx={{ ...counsellorStyles.addButtonSx, borderColor: 'primary.main', color: 'primary.main' }} onClick={() => handleModal('analytics', true)}>SEL Analytics</Button>
                    
                    {/* Dropdown modified here for Bulk Upload and Select placeholder */}
                    <CustomAutocompleteNew 
                        options={[
                            { id: 'addStudent', label: 'Add Student' },
                            { id: 'bulkUpload', label: 'Bulk Upload' }
                        ]} 
                        sx={{ minWidth: '150px', height: '34px' }} 
                        fieldSx={{ height: '34px' }} 
                        placeholder="Select" 
                        value={selectedDropDown} 
                        onChange={(e) => { 
                            if (e === 'addStudent') handleModal('add', true); 
                            if (e === 'bulkUpload') handleModal('bulkUpload', true); 
                            setSelectedDropDown(''); 
                        }} 
                    />
                </Box>
            </Box>

            <TableContainer ref={tableContainerRef} sx={{ mt: 2, ...tableStyles.container, flex: 1, overflowX: 'auto' }}>
                <Table stickyHeader size='small' sx={{ minWidth: tableMinWidth }}>
                    <TableHead>
                        <TableRow>
                            {selColumn.map((col) => (
                                <TableCell key={col.id} sx={{ ...tableStyles.headerCell, width: col.width }}>{col.label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((row, index) => (
                            <TableRow key={row.id} sx={tableStyles.bodyRow}>
                                {selColumn.map((col) => (
                                    <TableCell key={col.id} sx={tableStyles.bodyCell}>
                                        {col.id === 'actions' ? (
                                            <IconButton size="small" onClick={() => { setDeleteId(row.id); handleModal('deleteSingle', true) }} sx={{ color: '#EF4444' }}><DeleteOutlineIcon sx={{ fontSize: 18 }} /></IconButton>
                                        ) : renderCellContent(col, row)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {modal.add && <AddSELAssessmentDialog open={modal.add} onClose={() => handleModal('add', false)} onAdd={(rec) => setAllRecords([rec, ...allRecords])} />}
            
            {/* Added Bulk Upload Component Modal */}
            {modal.bulkUpload && (
                <UploadSELData 
                    open={modal.bulkUpload} 
                    onClose={() => handleModal('bulkUpload', false)} 
                    onUploadSuccess={(updatedRecords) => {
                        setAllRecords(updatedRecords)
                        handleModal('bulkUpload', false)
                    }} 
                />
            )}

            {modal.analytics && <SELAnalytics open={modal.analytics} onClose={() => handleModal('analytics', false)} data={filteredRecords} />}
            {modal.drawer && <SELDrawer open={modal.drawer} onClose={() => handleModal('drawer', false)} domainKey={selectedData.domainKey} total={selectedData.total} rowData={selectedData.rowData} onEditSuccess={handleDrawerEditSuccess} />}
            <CustomDialog isOpen={modal.deleteSingle} title="Delete Record" iconName={iconConstants.academicRed} message="Are you sure you want to delete this record?" onLeftButtonClick={() => handleModal('deleteSingle', false)} onRightButtonClick={() => { const filtered = allRecords.filter((r) => r.id !== deleteId); setAllRecords(filtered); localStorage.setItem('selAssessmentRecords', JSON.stringify(filtered)); handleModal('deleteSingle', false); }} rightButtonText="Delete" leftButtonText="Cancel" />
        </Box>
    )
}
export default SELAssessment