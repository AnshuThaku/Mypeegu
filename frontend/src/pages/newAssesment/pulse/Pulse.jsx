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
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { tableStyles } from '../../../components/styles/tableStyles'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import { pulseColumn, pulseQuestions } from './pulseConstants'
import AddPulseDialog from './AddPulseDialog'
import PulseDrawer from './PulseDrawer'
import PulseAnalyticsDialog from './PulseAnalyticsDialog'
import CustomDialog from '../../../components/CustomDialog'
import CustomPagination from '../../../components/CustomPagination'
import { formatDate, sortEnum } from '../../../utils/utils'
import CommonFilterDrawer, {
    initialFilterStates, initialAccordionStates,
} from '../../../components/commonComponents/CustomFilter'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
import { iconConstants } from '../../../resources/theme/iconConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'

const Pulse = () => {
    const dispatch = useDispatch()
    const tableContainerRef = useRef(null)
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup)

    const [allRecords, setAllRecords] = useState([])
    const [searchText, setSearchText] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState({ text: '150', value: 150 })
    const [currentPage, setCurrentPage] = useState(1)
    const [sortKeys, setSortKeys] = useState([{ key: 'createdAt', value: sortEnum.desc }])

    const [modal, setModal] = useState({
        add: false, drawer: false, filter: false, deleteSingle: false, upload: false, analytics: false
    })
    const [selectedData, setSelectedData] = useState({
        questionSectionKey: '', total: 0, category: '', rowData: null,
    })
    
    const [selectedDropDown, setSelectedDropDown] = useState('')
    const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
    const [deleteId, setDeleteId] = useState('')
    
    // Filter State
    const [filterData, setFilterData] = useState(initialFilterStates)
    
    const [isSelectedAllForDelete, setIsSelectedAllForDelete] = useState(false)
    const [pulseIdsForDelete, setPulseIdsForDelete] = useState([])

    const dropDownOptions = [
        { id: 'addStudent', label: localizationConstants?.addStudent || 'Add Student' },
        { id: 'bulkUpload', label: localizationConstants?.bulkUpload || 'Bulk Upload' },
    ]

    useEffect(() => {
        const savedData = localStorage.getItem('pulseRecords')
        if (savedData) setAllRecords(JSON.parse(savedData))
    }, [])

    const handleModal = useCallback((name, value) => {
        setModal((state) => ({ ...state, [name]: value }))
    }, [])

    const getAcademicYearLabel = (id) => {
        if (!academicYears || !id) return '-'
        const yearObj = academicYears.find((ay) => ay._id === id)
        return yearObj ? yearObj.academicYear || yearObj.label : '-'
    }

    const handleSelectedData = useCallback((questionSectionKey, total, category, rowData) => {
        setSelectedData({ questionSectionKey, total, category, rowData })
        handleModal('drawer', true)
    }, [handleModal])

    const getDynamicScore = (row, sectionKey) => {
        const qList = pulseQuestions[sectionKey] || []
        let score = 0
        qList.forEach((qnObj, index) => {
            const exactKey = `${sectionKey}_${index}`
            let ans = ''
            if (row.responses && row.responses[exactKey]) {
                ans = row.responses[exactKey].option || row.responses[exactKey]
            } else if (row.responses) {
                const flat = Object.values(row.responses)
                const found = flat.find((item) => item.question === (qnObj.text || qnObj))
                if (found) ans = found.option || found
            }
            if (ans === 'Always') score += 4
            else if (ans === 'Often') score += 3
            else if (ans === 'Sometimes') score += 2
            else if (ans === 'Never') score += 1
        })
        return score
    }

    const renderScoreCell = (row, field, questionSectionKey, displayCategory) => {
        let score = (row.domainScores && row.domainScores[field]) ? row.domainScores[field] : getDynamicScore(row, questionSectionKey)
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    width: '24px', height: '24px', borderRadius: '4px',
                    backgroundColor: score >= 8 ? '#43A047' : '#FB8C00', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Typography sx={{ fontSize: '11px', color: 'white', fontWeight: 700 }}>{score}</Typography>
                </Box>
                <IconButton size='small' onClick={() => handleSelectedData(questionSectionKey, score, displayCategory, row)}>
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
        if (fieldName === 'studentName') {
            return <Typography sx={{ fontSize: '13px', color: '#334155', fontWeight: 500, textTransform: 'uppercase' }}>{row?.studentName || '-'}</Typography>
        }

        if (fieldName === 'OnlineTime') return renderScoreCell(row, 'OnlineTime', 'SECTION 1: My Online Time', 'ONLINE TIME')
        if (fieldName === 'GamesFun') return renderScoreCell(row, 'GamesFun', 'SECTION 2: Games & Online Fun', 'GAMES & FUN')
        if (fieldName === 'PeopleOnline') return renderScoreCell(row, 'PeopleOnline', 'SECTION 3: People I Talk to Online', 'PEOPLE ONLINE')
        if (fieldName === 'ThingsISee') return renderScoreCell(row, 'ThingsISee', 'SECTION 4: Things I See Online', 'THINGS I SEE')
        if (fieldName === 'SocialMedia') return renderScoreCell(row, 'SocialMedia', 'SECTION 5: Social Media & Me', 'SOCIAL MEDIA')
        if (fieldName === 'Respectful') return renderScoreCell(row, 'Respectful', 'SECTION 6: Being Respectful Online', 'RESPECT ONLINE')
        if (fieldName === 'MakingChoices') return renderScoreCell(row, 'MakingChoices', 'SECTION 7: Making Choices Online', 'MAKING CHOICES')
        if (fieldName === 'GettingHelp') return renderScoreCell(row, 'GettingHelp', 'SECTION 8: Getting Help When Needed', 'GETTING HELP')
        if (fieldName === 'AboutMe') return renderScoreCell(row, 'AboutMe', 'SECTION 9: A Little About Me', 'ABOUT ME')

        return '-'
    }

    // Filter Logic Working correctly
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

    const tableMinWidth = useMemo(() => {
        return pulseColumn.reduce((sum, col) => sum + (col.width || 120), 0)
    }, [])

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
                        Pulse Analytics
                    </Button>

                    <CustomAutocompleteNew 
                        options={dropDownOptions} 
                        sx={{ minWidth: '150px', height: '34px' }} 
                        fieldSx={{ height: '34px' }} 
                        placeholder={localizationConstants.select || "New Assessment"} 
                        value={selectedDropDown} 
                        onChange={(e) => { 
                            if (e === 'addStudent') handleModal('add', true)
                            else if (e === 'bulkUpload') handleModal('upload', true)
                            setSelectedDropDown('') 
                        }} 
                    />
                </Box>
            </Box>

            <TableContainer ref={tableContainerRef} sx={{ mt: 2, ...tableStyles.container, flex: 1, overflowX: 'auto' }}>
                <Table stickyHeader size='small' sx={{ minWidth: tableMinWidth }}>
                    <TableHead>
                        <TableRow>
                            {pulseColumn.map((col, idx) => (
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
                                {pulseColumn.map((col, colIdx) => (
                                    <TableCell key={col.id} sx={tableStyles.bodyCell}>
                                        {colIdx === 0 && isSelectedAllForDelete ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Checkbox size='small' checked={pulseIdsForDelete.includes(row.id)} onChange={() => setPulseIdsForDelete((prev) => prev.includes(row.id) ? prev.filter((i) => i !== row.id) : [...prev, row.id])} sx={{ p: 0, mr: 1 }} />
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

            {modal.add && <AddPulseDialog open={modal.add} onClose={() => handleModal('add', false)} onAdd={(rec) => setAllRecords([rec, ...allRecords])} />}
            {modal.analytics && <PulseAnalyticsDialog open={modal.analytics} onClose={() => handleModal('analytics', false)} data={filteredRecords} />}
            {modal.drawer && <PulseDrawer open={modal.drawer} onClose={() => handleModal('drawer', false)} questionSectionKey={selectedData.questionSectionKey} category={selectedData.category} total={selectedData.total} rowData={selectedData.rowData} />}
            
            {/* FIXED Filter Drawer */}
            <CommonFilterDrawer 
                onOpen={modal.filter} 
                handleModal={handleModal} 
                filterData={filterData} 
                setFilterData={setFilterData} 
                filterOptions={{ ...initialAccordionStates, AYs: true, schools: true, classrooms: true, sections: true }} 
                defaultAccordions={['AYs', 'schools', 'classrooms', 'sections']}
                onApply={(appliedData) => {
                    // Custom fallback agar internal onApply event parameter sahi na de
                    if (appliedData) setFilterData(appliedData)
                    handleModal('filter', false)
                }} 
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
                    localStorage.setItem('pulseRecords', JSON.stringify(filtered))
                    handleModal('deleteSingle', false)
                }}
                rightButtonText={localizationConstants.yesDelete}
                leftButtonText={localizationConstants.cancel}
            />
        </Box>
    )
}
export default Pulse