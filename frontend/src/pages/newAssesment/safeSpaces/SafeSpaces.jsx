import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box, Checkbox, IconButton, Table, TableBody, TableCell, TableRow,
    TableHead, TableContainer, Typography, TextField, InputAdornment, Button,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import VisibilityIcon from '@mui/icons-material/Visibility'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { tableStyles } from '../../../components/styles/tableStyles'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import { safeSpacesColumn, getTierByScore } from './safeSpacesConstants'
import AddSafeSpacesDialog from './AddSafeSpacesDialog'
import SafeSpacesDrawer from './SafeSpacesDrawer'
import SafeSpacesAnalytics from './SafeSpacesAnalytics'
import UploadSafeSpacesData from './UploadSafeSpacesData' // <--- NAYA IMPORT
import CustomDialog from '../../../components/CustomDialog'
import CustomPagination from '../../../components/CustomPagination'
import { formatDate } from '../../../utils/utils'
import CommonFilterDrawer, {
    initialFilterStates, initialAccordionStates,
} from '../../../components/commonComponents/CustomFilter'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
import { iconConstants } from '../../../resources/theme/iconConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'

const SafeSpaces = () => {
    const dispatch = useDispatch()
    const tableContainerRef = useRef(null)
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup)

    const [allRecords, setAllRecords] = useState([])
    const [searchText, setSearchText] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState({ text: '150', value: 150 })
    const [currentPage, setCurrentPage] = useState(1)

    const [modal, setModal] = useState({
        add: false, drawer: false, filter: false, deleteSingle: false, upload: false, analytics: false
    })
    
    const [selectedData, setSelectedData] = useState({ domainKey: '', displayLabel: '', total: 0, rowData: null })
    const [selectedDropDown, setSelectedDropDown] = useState('')
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
    const [deleteId, setDeleteId] = useState('')
    
    // Filter State
    const [filterData, setFilterData] = useState(initialFilterStates)
    const [isSelectedAllForDelete, setIsSelectedAllForDelete] = useState(false)
    const [idsForDelete, setIdsForDelete] = useState([])

    const dropDownOptions = [
        { id: 'addStudent', label: localizationConstants?.addStudent || 'Add Student' },
        { id: 'bulkUpload', label: localizationConstants?.bulkUpload || 'Bulk Upload' },
    ]

    useEffect(() => {
        const savedData = localStorage.getItem('safeSpacesRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }, [])

    const handleDrawerEditSuccess = () => {
        const savedData = localStorage.getItem('safeSpacesRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }

    const handleModal = useCallback((name, value) => {
        setModal((state) => ({ ...state, [name]: value }))
    }, [])

    const getAcademicYearLabel = (id) => {
        if (!academicYears || !id) return '-'
        const yearObj = academicYears.find((ay) => ay._id === id)
        return yearObj ? yearObj.academicYear || yearObj.label : '-'
    }

    const renderDomainScore = (row, exactKey, displayLabel) => {
        const score = row.domainScores?.[exactKey] || 0
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
                    setSelectedData({ domainKey: exactKey, displayLabel: displayLabel, total: score, rowData: row })
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

        if (fieldName === 'Emotional') return renderDomainScore(row, 'Emotional', 'Emotional Safety')
        if (fieldName === 'Physical') return renderDomainScore(row, 'Physical', 'Physical Safety')
        if (fieldName === 'Social') return renderDomainScore(row, 'Social', 'Social Belonging')
        if (fieldName === 'AdultSupport') return renderDomainScore(row, 'AdultSupport', 'Adult Support')
        if (fieldName === 'SystemResp') return renderDomainScore(row, 'SystemResp', 'System Responsiveness')
        if (fieldName === 'Agency') return renderDomainScore(row, 'Agency', 'Student Agency')
        if (fieldName === 'Harm') return renderDomainScore(row, 'Experiences Of School', 'Experiences of School')

        return '-'
    }

    const filteredRecords = useMemo(() => {
        return allRecords.filter((record) => {
            const nameMatch = record.studentName ? record.studentName.toLowerCase().includes(searchText.toLowerCase()) : false
            const idMatch = record.user_id ? record.user_id.toLowerCase().includes(searchText.toLowerCase()) : false
            const matchesSearch = searchText ? (nameMatch || idMatch) : true

            let matchesAY = true
            if (filterData?.selectdAYs?.length > 0) {
                matchesAY = filterData.selectdAYs.includes(record.academicYear)
            }
            
            let matchesSchool = true
            if (filterData?.schools?.length > 0) {
                const recSchool = record.schoolId || record.school_id || record.school
                matchesSchool = recSchool ? filterData.schools.includes(recSchool) : false
            }

            let matchesClass = true
            if (filterData?.classrooms?.length > 0) {
                const recClass = record.classRoomId || record.class_id || record.classroom || record.className
                matchesClass = recClass ? filterData.classrooms.includes(recClass) : false
            }

            let matchesSection = true
            if (filterData?.sections?.length > 0) {
                matchesSection = record.section ? filterData.sections.includes(record.section) : false
            }

            return matchesSearch && matchesAY && matchesSchool && matchesClass && matchesSection
        })
    }, [allRecords, searchText, filterData])

    const tableMinWidth = useMemo(() => safeSpacesColumn.reduce((sum, col) => sum + (col.width || 120), 0), [])

    return (
        <Box sx={counsellorStyles.pageContainerSx}>
            <Box sx={counsellorStyles.toolbarSx}>
                <TextField 
                    placeholder='Search Student or ID...' 
                    value={searchText} 
                    onChange={(e) => setSearchText(e.target.value)} 
                    size='small' 
                    sx={counsellorStyles.searchFieldSx} 
                    InputProps={{ startAdornment: (<InputAdornment position='start'><SearchIcon sx={{ fontSize: 18 }} /></InputAdornment>) }} 
                />
                
                <Box sx={counsellorStyles.actionButtonsSx}>
                    <IconButton onClick={() => handleModal('filter', true)} sx={counsellorStyles.filterButtonSx}>
                        <FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} />
                    </IconButton>
                    
                    <Button 
                        variant='outlined' 
                        sx={{ ...counsellorStyles.addButtonSx, borderColor: 'primary.main', color: 'primary.main', backgroundColor: 'transparent' }} 
                        onClick={() => handleModal('analytics', true)}
                    >
                        Safe Spaces Analytics
                    </Button>

                    <CustomAutocompleteNew 
                        options={dropDownOptions} 
                        sx={{ minWidth: '150px', height: '34px' }} 
                        fieldSx={{ height: '34px' }} 
                        placeholder={localizationConstants.select || "New Assessment"} 
                        value={selectedDropDown} 
                        onChange={(e) => { 
                            if (e === 'addStudent') handleModal('add', true)
                            else if (e === 'bulkUpload') handleModal('upload', true) // MODAL TRIGGER
                            setSelectedDropDown('') 
                        }} 
                    />
                </Box>
            </Box>

            <TableContainer ref={tableContainerRef} sx={{ mt: 2, ...tableStyles.container, flex: 1, overflowX: 'auto' }}>
                <Table stickyHeader size='small' sx={{ minWidth: tableMinWidth }}>
                    <TableHead>
                        <TableRow>
                            {safeSpacesColumn.map((col, idx) => (
                                <TableCell key={col.id} sx={{ ...tableStyles.headerCell, width: col.width }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {isSelectedAllForDelete && idx === 0 && (
                                            <Checkbox size='small' checked={isSelectedAllForDelete} onChange={() => setIsSelectedAllForDelete(!isSelectedAllForDelete)} sx={{ p: 0, mr: 1 }} />
                                        )}
                                        {col.label}
                                    </Box>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredRecords.map((row, index) => (
                            <TableRow key={row.id} onMouseEnter={() => setHoveredRowIndex(index)} onMouseLeave={() => setHoveredRowIndex(null)} sx={tableStyles.bodyRow}>
                                {safeSpacesColumn.map((col, colIdx) => (
                                    <TableCell key={col.id} sx={tableStyles.bodyCell}>
                                        {colIdx === 0 && isSelectedAllForDelete ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox size='small' checked={idsForDelete.includes(row.id)} onChange={() => setIdsForDelete((prev) => prev.includes(row.id) ? prev.filter((i) => i !== row.id) : [...prev, row.id])} sx={{ p: 0, mr: 1 }} />
                                                {row.user_id}
                                            </Box>
                                        ) : col.id === 'actions' ? (
                                            hoveredRowIndex === index && !isSelectedAllForDelete && (
                                                <IconButton 
                                                    size="small"
                                                    onClick={(e) => { e.stopPropagation(); setDeleteId(row.id); handleModal('deleteSingle', true) }}
                                                    sx={{ color: '#EF4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}
                                                >
                                                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            )
                                        ) : renderCellContent(col, row)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={tableStyles.footer}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}></Box>
                <CustomPagination rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} totalCount={filteredRecords.length} />
            </Box>

            {/* --- Modals Renderings --- */}
            {modal.add && <AddSafeSpacesDialog open={modal.add} onClose={() => handleModal('add', false)} onAdd={(rec) => setAllRecords([rec, ...allRecords])} />}
            {modal.analytics && <SafeSpacesAnalytics open={modal.analytics} onClose={() => handleModal('analytics', false)} data={filteredRecords} />}
            
            {/* BULK UPLOAD MODAL */}
            {modal.upload && (
                <UploadSafeSpacesData 
                    open={modal.upload} 
                    onClose={() => handleModal('upload', false)} 
                    onUploadSuccess={(updatedRecords) => {
                        setAllRecords(updatedRecords);
                        handleModal('upload', false);
                    }}
                />
            )}
            
            {modal.drawer && (
                <SafeSpacesDrawer 
                    open={modal.drawer} 
                    onClose={() => handleModal('drawer', false)} 
                    domainKey={selectedData.domainKey} 
                    displayLabel={selectedData.displayLabel} 
                    total={selectedData.total} 
                    rowData={selectedData.rowData} 
                    onEditSuccess={handleDrawerEditSuccess}
                />
            )}
            
            <CommonFilterDrawer 
                onOpen={modal.filter} 
                handleModal={handleModal} 
                filterData={filterData} 
                setFilterData={setFilterData} 
                filterOptions={{ ...initialAccordionStates, AYs: true, schools: true, classrooms: true, sections: true }} 
                defaultAccordions={['AYs', 'schools', 'classrooms', 'sections']}
                onApply={() => { handleModal('filter', false) }} 
            />

            <CustomDialog
                isOpen={modal.deleteSingle}
                title={localizationConstants.deleteStudentRecord}
                iconName={iconConstants.academicRed}
                message={localizationConstants.baselineDeleteMsg}
                onLeftButtonClick={() => handleModal('deleteSingle', false)}
                onRightButtonClick={() => {
                    const filtered = allRecords.filter((r) => r.id !== deleteId)
                    setAllRecords(filtered)
                    localStorage.setItem('safeSpacesRecords', JSON.stringify(filtered))
                    handleModal('deleteSingle', false)
                }}
                rightButtonText={localizationConstants.yesDelete}
                leftButtonText={localizationConstants.cancel}
            />
        </Box>
    )
}
export default SafeSpaces