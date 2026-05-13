/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Button, Dialog, Slide, Typography, TextField, InputAdornment, IconButton } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import debounce from 'lodash.debounce'

import IEPTableList from '../IEPTableList'
import { fetchAllStudentIEP } from '../iEPFunctions'
import Student360Dashboard from './AIIEPDashboard'
import AddAIIEPDialog from './AddAIIEPDialog'
import { getCurACYear, sortEnum } from '../../../../utils/utils'
import CommonFilterDrawer, { initialAccordionStates, initialFilterStates } from '../../../../components/commonComponents/CustomFilter'
import { counsellorStyles } from '../../../counsellors/counsellorsStyles'
import { localizationConstants } from '../../../../resources/theme/localizationConstants'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const StudentAIIEP = () => {
    const dispatch = useDispatch()
    const { IEPviewAllData } = useSelector((store) => store.StudentIEP)
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup) 
    
    // States for Table & Responsiveness
    const [sortKeys, setSortKeys] = useState([{ key: 'createdAt', value: sortEnum.desc }])
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState({ text: '150', value: 150 })
    const [filterData, setFilterData] = useState(initialFilterStates) 
    const [searchText, setSearchText] = useState('')
    const [searchInputValue, setSearchInputValue] = useState('')

    const [selectedStudentId, setSelectedStudentId] = useState(null)
    const [modal, setModal] = useState({ addAIIEP: false, view360: false, filter: false }) 

    const handleModal = useCallback((name, value, studentId = null) => {
        if (studentId) setSelectedStudentId(studentId);
        if (name === 'edit' && value === true) {
            setModal((state) => ({ ...state, view360: true }));
            return;
        }
        setModal((state) => ({ ...state, [name]: value }))
    }, [])

    const debouncedSearch = useCallback(
        debounce((text) => {
            setSearchText(text)
            setCurrentPage(1)
        }, 500),
        [],
    )

    const handleSearchChange = (e) => {
        setSearchInputValue(e.target.value)
        debouncedSearch(e.target.value)
    }

    useEffect(() => {
        fetchAllStudentIEP(dispatch, filterData, searchText, currentPage, rowsPerPage.value, sortKeys)
    }, [dispatch, sortKeys, currentPage, rowsPerPage, searchText])

    return (
        <Box sx={{ 
            ...counsellorStyles.pageContainerSx, 
            display: 'flex', 
            flexDirection: 'column',
            height: '100vh', 
            overflow: 'hidden' 
        }}>
            
            {/* --- RESPONSIVE TOOLBAR --- */}
            <Box sx={{ 
                ...counsellorStyles.toolbarSx, 
                flexWrap: 'wrap',
                gap: 2,
                mb: 2 
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
                    <TextField
                        placeholder={localizationConstants.searchPalceholderForCOPE}
                        value={searchInputValue}
                        onChange={handleSearchChange}
                        size='small'
                        sx={{ 
                            ...counsellorStyles.searchFieldSx,
                            width: { xs: '100%', sm: '300px' } 
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <SearchIcon sx={{ fontSize: 18, color: '#94A3B8' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

                {/* 🟢 FILTER AND CREATE BUTTONS */}
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                    <IconButton
                        onClick={() => handleModal('filter', true)}
                        sx={{ 
                            bgcolor: '#F1F5F9', 
                            borderRadius: '8px', 
                            width: 40, height: 40,
                            border: '1px solid #E2E8F0'
                        }}
                    >
                        <FilterListIcon sx={{ color: '#64748B' }} />
                    </IconButton>

                    <Button
                        variant='contained'
                        startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                        sx={{ 
                            bgcolor: '#8B5CF6', 
                            color: 'white', 
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)',
                            '&:hover': { bgcolor: '#7C3AED' } 
                        }}
                        onClick={() => handleModal('addAIIEP', true)}
                    >
                        Create AI IEP
                    </Button>
                </Box>
            </Box>

            {/* --- TABLE CONTAINER --- */}
            <Box sx={{ 
                flex: 1, 
                minHeight: 0, 
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden'
            }}>
                <IEPTableList 
                    allStudentsForspecificSchool={IEPviewAllData} 
                    modal={modal} 
                    handleModal={handleModal}
                    sortKeys={sortKeys}
                    setSortKeys={setSortKeys}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    rowsPerPage={rowsPerPage}
                    setRowsPerPage={setRowsPerPage}
                />
            </Box>

            {/* --- MODALS --- */}
            {modal.addAIIEP && (
                <AddAIIEPDialog 
                    open={modal.addAIIEP} 
                    onClose={() => handleModal('addAIIEP', false)} 
                    onSuccess={() => {
                        // 🟢 FIX: Ab direct dashboard nahi khulega, bas popup band hoga aur table refresh hogi
                        handleModal('addAIIEP', false);
                        fetchAllStudentIEP(
                            dispatch,
                            filterData,
                            searchText,
                            currentPage,
                            rowsPerPage.value,
                            sortKeys
                        );
                    }}
                />
            )}

            <Dialog 
                fullScreen 
                open={modal.view360} 
                TransitionComponent={Transition}
                sx={{ zIndex: 1300 }}
            >
                {selectedStudentId && (
                    <Student360Dashboard 
                        studentId={selectedStudentId} 
                        onClose={() => handleModal('view360', false)} 
                    />
                )}
            </Dialog>

            {/* FILTER DRAWER */}
            <CommonFilterDrawer
                onOpen={modal.filter}
                handleModal={handleModal}
                filterOptions={{
                    ...initialAccordionStates,
                    AYs: true,
                    schools: true,
                    classrooms: true,
                    sections: true,
                    studentStatus: true,
                }}
                filterData={filterData}
                setFilterData={setFilterData}
                onApply={() => {
                    const curACYear = getCurACYear()
                    const academicYearId = academicYears.find(
                        (obj) => obj.academicYear === curACYear,
                    )
                    const newFilterData = {
                        ...filterData,
                        selectdAYs: Array.isArray(filterData?.selectdAYs) && filterData.selectdAYs.length > 0
                                ? filterData.selectdAYs
                                : [academicYearId?._id],
                    }
                    setFilterData(newFilterData)
                    fetchAllStudentIEP(
                        dispatch,
                        newFilterData,
                        searchText,
                        currentPage,
                        rowsPerPage.value,
                        sortKeys,
                    )
                    handleModal('filter', false)
                }}
                defaultAccordions={['AYs', 'studentStatus']}
            />
        </Box>
    )
}

export default StudentAIIEP