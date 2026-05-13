import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getSchoolsList } from '../../../../redux/commonSlice'
import { localizationConstants } from '../../../../resources/theme/localizationConstants'
import {
    Box,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Dialog,
    DialogContent,
    Slide
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import debounce from 'lodash.debounce'

import AIIEPTableList from './AIIEPTableList'
import {
    initialAccordionStates,
    initialFilterStates,
} from '../../../../components/commonComponents/CustomFilter'
import { fetchAllStudentIEP } from '../iEPFunctions'
import CommonFilterDrawer from '../../../../components/commonComponents/CustomFilter'
import { getCurACYear, sortEnum } from '../../../../utils/utils'
import { counsellorStyles } from '../../../counsellors/counsellorsStyles'

const AIIEPStudentList = () => {
    const dispatch = useDispatch()
    const { academicYears } = useSelector((store) => store.dashboardSliceSetup)
    const { appPermissions } = useSelector((store) => store.dashboardSliceSetup)
    const { IEPviewAllData } = useSelector((store) => store.StudentIEP || {})
    
    const [sortKeys, setSortKeys] = useState([{ key: 'createdAt', value: sortEnum.desc }])
    
    // 🟢 2. NAYA STATE: Selected Student track karne ke liye
    const [selectedStudentId, setSelectedStudentId] = useState(null)

    const [modal, setModal] = useState({
        add: false,
        edit: false,
        upload: false,
        filter: false,
        delete: false,
        view360: false, // 🟢 3. NAYA STATE: Modal kholne ke liye
    })
    
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState({
        text: '150',
        value: 150,
    })
    const [filterData, setFilterData] = useState(initialFilterStates)
    const [searchText, setSearchText] = useState('')
    const [searchInputValue, setSearchInputValue] = useState('')

    // 🟢 4. NAYA HANDLE MODAL: Ab ye studentId bhi save karega
    const handleModal = useCallback((name, value, studentId = null) => {
        if (studentId) setSelectedStudentId(studentId);
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
        const value = e.target.value
        setSearchInputValue(value)
        debouncedSearch(value)
    }

    const refreshListAndCloseDialog = (type) => {
        if (type === 'add') {
            handleModal('add', false)
        } else if (type === 'edit') {
            handleModal('edit', false)
        }

        fetchAllStudentIEP(
            dispatch,
            filterData,
            searchText,
            currentPage,
            rowsPerPage.value,
            sortKeys,
        )
    }

    const isFirstLoad = useRef(true)
    useEffect(() => {
        if (academicYears.length > 0) {
            let filter_data = { ...filterData }
            if (isFirstLoad.current) {
                const curACYear = getCurACYear()
                const academicYearId = academicYears.find(
                    (obj) => obj.academicYear === curACYear,
                )
                if (academicYearId) {
                    setFilterData((state) => ({
                        ...state,
                        selectdAYs: [academicYearId._id],
                    }))
                    filter_data = {
                        ...filter_data,
                        selectdAYs: [academicYearId._id],
                    }
                }
                isFirstLoad.current = false
            }

            fetchAllStudentIEP(
                dispatch,
                filter_data,
                searchText,
                currentPage,
                rowsPerPage.value,
                sortKeys,
            )
        }
    }, [
        academicYears,
        sortKeys,
        currentPage,
        rowsPerPage,
        searchText,
        dispatch,
    ])

    useEffect(() => {
        dispatch(getSchoolsList({}))
    }, [dispatch])

    // Utility validation filtering logic to only show students who have completed base requirements
    const filterEligibleStudents = (data) => {
        if (!data || !data.data) return data;
        
        // 🟢 TEMPORARY FIX: Abhi strict filter hata diya hai taaki sab bache dikhein.
        // Jab UI par data aane lagega tab hum check karenge ki backend asliyat mein kya bhej raha hai.
        return {
            ...data,
            data: data.data 
        };
    }

    return (
        <Box sx={counsellorStyles.pageContainerSx}>
            {/* Toolbar */}
            <Box sx={counsellorStyles.toolbarSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder={localizationConstants.searchPalceholderForCOPE}
                        value={searchInputValue}
                        onChange={handleSearchChange}
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
                </Box>
            </Box>

            <AIIEPTableList
                allStudentsForspecificSchool={filterEligibleStudents(IEPviewAllData)}
                sortKeys={sortKeys}
                setSortKeys={setSortKeys}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                searchText={searchText}
                filterData={filterData}
                refreshListAndCloseDialog={() =>
                    refreshListAndCloseDialog('edit')
                }
                modal={modal}
                handleModal={handleModal} 
            />

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
                        selectdAYs:
                            Array.isArray(filterData?.selectdAYs) &&
                            filterData.selectdAYs.length > 0
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

export default AIIEPStudentList