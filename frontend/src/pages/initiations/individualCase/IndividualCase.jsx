import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  FormControlLabel,
  IconButton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
  Typography,
  Chip,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import DownloadIcon from '@mui/icons-material/Download'
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import debounce from 'lodash.debounce'
import CustomIcon from '../../../components/CustomIcon'
import { iconConstants } from '../../../resources/theme/iconConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import { tableStyles } from '../../../components/styles/tableStyles'
import {
  ISOStringToTimeString,
  formatDate,
  getCurACYear,
  sortEnum,
} from '../../../utils/utils'
import {
  clearStudentStatus,
} from './individualCaseSlice'
import {
  fetchAllIndividualRecords,
} from './individualCaseFunctions'
import { getSchoolsList } from '../../../redux/commonSlice'
import { toggleSSEVisibilityForRecord } from './individualCaseFunctions'
import {
  invalidTest,
  individualCaseColumn,
} from './individualCaseConstants'
import CustomPagination from '../../../components/CustomPagination'
import { handleDownloadExcel } from './individualCaseThunk'

import {
  initialAccordionStates,
  initialFilterStates,
} from '../../../components/commonComponents/CustomFilter'
import CommonFilterDrawer from '../../../components/commonComponents/CustomFilter'

import EditStudent from './EditIndividualCase'
import AddIndividualCaseDialog from './AddIndividualCaseDialog'
import { getUserFromLocalStorage } from '../../../utils/utils'

// --- Professional Custom Switch ---
const ProfessionalSwitch = styled(Switch)(({ theme }) => ({
  width: 42,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 1,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#10B981', // Clean modern green
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#10B981',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}))

const IndividualCase = () => {
  const dispatch = useDispatch()
  const tableContainerRef = useRef(null)
  const { appPermissions } = useSelector((store) => store.dashboardSliceSetup)
  const { allIndividualRecords } = useSelector(
    (store) => store.individualCase,
  )
  const { schoolsList } = useSelector((store) => store.commonData)
  const user = getUserFromLocalStorage()
  const isSSE = Array.isArray(user?.permissions) && user.permissions.includes('SSECounselor')

  const [hoveredRowIndex, setHoveredRowIndex] = useState(null)
  const [rowDataSelected, setRowDataSelected] = useState({})
  
  // States for SSE Disclaimer Modal
  const [sseWarningDialog, setSseWarningDialog] = useState(false)
  const [selectedRowForSSE, setSelectedRowForSSE] = useState(null)

  const [rowsPerPage, setRowsPerPage] = useState({
    text: '150',
    value: 150,
  })
  const [currentPage, setCurrentPage] = useState(1)

  const [columns, setColumns] = useState(individualCaseColumn)
  const [sortKeys, setSortKeys] = useState([{ key: 'date', value: sortEnum.desc }])

  const [filterData, setFilterData] = useState(initialFilterStates)
  const [searchText, setSearchText] = useState('')
  const [searchInputValue, setSearchInputValue] = useState('')

  const [modal, setModal] = useState({
    upload: false,
    filter: false,
    add: false,
    edit: false,
  })
  const { academicYears } = useSelector((store) => store.dashboardSliceSetup)

  const handleModal = useCallback((name, value) => {
    const obj = {}
    obj[name] = value
    setModal((state) => ({ ...state, ...obj }))
  }, [])

  const debouncedSearch = useMemo(
    () =>
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

  const handleSort = (columnName) => {
    const currentSortKey = sortKeys[0]
    let newValue

    if (currentSortKey?.key === columnName) {
      newValue = currentSortKey.value === sortEnum.asc ? sortEnum.desc : sortEnum.asc
    } else {
      newValue = sortEnum.desc
    }

    setSortKeys([{ key: columnName, value: newValue }])
  }

  const getSortIcon = (column) => {
    if (!column.sort) return null
    const activeSortKey = sortKeys[0]
    if (activeSortKey?.key !== column.name) {
      return <UnfoldMoreIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
    }
    if (activeSortKey.value === sortEnum.asc) {
      return <KeyboardArrowUpIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
    }
    if (activeSortKey.value === sortEnum.desc) {
      return <KeyboardArrowDownIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
    }
    return <UnfoldMoreIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
  }

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '-'
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
  }

  const renderCellContent = (column, row) => {
    const fieldName = column.name

    if (fieldName === 'user_id') return row?.user_id || '-'
    if (fieldName === 'academicYear') return row?.academicYear || localizationConstants.notApplicable
    if (fieldName === 'studentName') return row?.studentName || '-'
    if (fieldName === 'date') return formatDate(row?.date) || '-'
    if (fieldName === 'createdAt') return formatDate(row?.createdAt) || '-'
    if (fieldName === 'startTime') {
      return !invalidTest.includes(row?.startTime)
        ? ISOStringToTimeString(row?.startTime)
        : '-'
    }
    if (fieldName === 'endTime') {
      return !invalidTest.includes(row?.endTime)
        ? ISOStringToTimeString(row?.endTime)
        : '-'
    }

    const textFields = [
      'issues',
      'goals',
      'activity',
      'dimension',
      'description',
      'stype',
      'basedOn',
      'purpose',
      'outcome',
      'improvements',
      'comments',
      'tasksAssigned',
      'poa',
    ]

    if (textFields.includes(fieldName)) {
      return truncateText(row?.[fieldName])
    }

    return '-'
  }

  const refreshListAndCloseDialog = (type) => {
    if (type === 'add') handleModal('add', false)
    else if (type === 'edit') handleModal('edit', false)
    else if (type === 'upload') handleModal('upload', false)

    fetchAllIndividualRecords(
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

      fetchAllIndividualRecords(
        dispatch,
        filter_data,
        searchText,
        currentPage,
        rowsPerPage.value,
        sortKeys,
      )
    }
  }, [academicYears, sortKeys, currentPage, rowsPerPage, searchText, dispatch])

  useEffect(() => {
    dispatch(getSchoolsList({}))
    dispatch(clearStudentStatus())
  }, [dispatch])

  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0
    }
  }, [allIndividualRecords?.data])

  const tableMinWidth = useMemo(() => {
    return columns.reduce((sum, col) => sum + (col.width || 0), 0)
  }, [columns])

  const selectedSchoolId =
    Array.isArray(filterData?.selectdSchools) && filterData.selectdSchools.length === 1
      ? filterData.selectdSchools[0]
      : null
  const selectedSchool = selectedSchoolId
    ? (schoolsList || []).find((s) => s?._id === selectedSchoolId)
    : null
  const sseEnabled = !!selectedSchool?.allow_sse_counselor_individualcase

  // --- SSE Toggle Handlers ---
  const handleSseToggleClick = (e, row) => {
    e.stopPropagation()
    const isTurningOn = !row?.visibleToSSE

    if (isTurningOn) {
      // Show warning modal only when turning ON
      setSelectedRowForSSE(row)
      setSseWarningDialog(true)
    } else {
      // Turn OFF immediately without warning
      toggleSSEVisibilityForRecord(
        dispatch,
        row?._id,
        false,
        filterData,
        searchText,
        currentPage,
        rowsPerPage.value,
        sortKeys,
      )
    }
  }

  const handleConfirmSseToggle = async () => {
    if (selectedRowForSSE) {
      await toggleSSEVisibilityForRecord(
        dispatch,
        selectedRowForSSE._id,
        true,
        filterData,
        searchText,
        currentPage,
        rowsPerPage.value,
        sortKeys,
      )
    }
    setSseWarningDialog(false)
    setSelectedRowForSSE(null)
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
          {isSSE && (
            <Chip
              label='Type: SSE'
              color='primary'
              variant='outlined'
              size='small'
            />
          )}
        </Box>

        <Box sx={counsellorStyles.actionButtonsSx}>
          <IconButton
            sx={counsellorStyles.filterButtonSx}
            onClick={() => handleModal('filter', true)}
          >
            <FilterListIcon sx={{ fontSize: 18, color: '#64748B' }} />
          </IconButton>

          {appPermissions?.IndividualCaseManagement?.edit && !isSSE && (
            <Button
              variant='contained'
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              sx={counsellorStyles.addButtonSx}
              onClick={() => handleModal('add', true)}
            >
              {localizationConstants.addStudent}
            </Button>
          )}
        </Box>
      </Box>

      {/* Table */}
      {allIndividualRecords?.data?.length > 0 ? (
        <Box sx={{ ...tableStyles.container, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <TableContainer
            ref={tableContainerRef}
            sx={{ flex: 1, overflow: 'auto', ...tableStyles.scrollWrapper }}
          >
            <Table
              stickyHeader
              size='small'
              sx={{ tableLayout: 'fixed', minWidth: tableMinWidth }}
            >
              <TableHead>
                <TableRow sx={{ height: '44px' }}>
                  {columns.map((column, idx) => (
                    <TableCell
                      key={column.id}
                      sx={{
                        ...tableStyles.headerCell,
                        width: column.width,
                        minWidth: column.width,
                        cursor: column.sort ? 'pointer' : 'default',
                        '&:hover': column.sort
                          ? { backgroundColor: '#F1F5F9' }
                          : {},
                      }}
                      onClick={() => column.sort && handleSort(column.name)}
                    >
                      {column.id == localizationConstants.showCategoryActions ? (
                        <Typography sx={{ fontSize: '11px', color: '#64748B' }}>
                          Actions
                        </Typography>
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: '11px',
                              fontWeight: 600,
                              color: '#64748B',
                              textTransform: 'uppercase',
                              letterSpacing: '0.3px',
                              flex: 1,
                            }}
                          >
                            {column.label}
                          </Typography>
                          {column.sort && (
                            <IconButton size='small' sx={{ p: 0 }}>
                              {getSortIcon(column)}
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {allIndividualRecords?.data?.map((row, index) => (
                  <TableRow
                    key={row._id || index}
                    onMouseEnter={() => setHoveredRowIndex(index)}
                    onMouseLeave={() => setHoveredRowIndex(null)}
                    onClick={(e) => {
                      const isFormControlClick =
                        e.target.closest('.MuiFormControlLabel-root') !== null
                      if (isFormControlClick) return

                      setRowDataSelected(row)
                      handleModal('edit', true)
                    }}
                    sx={tableStyles.bodyRow}
                  >
                    {columns.map((column, colIdx) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          ...tableStyles.bodyCell,
                          width: column.width,
                          minWidth: column.width,
                        }}
                      >
                        {column.id === localizationConstants.showCategoryActions ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {appPermissions?.IndividualCaseManagement?.edit && !isSSE && (
                              <Tooltip 
                                title={
                                  row?.visibleToSSE 
                                    ? "Toggle ON: Shared with SSE for support" 
                                    : "Toggle OFF: Case remains confidential"
                                } 
                                placement="top" 
                                arrow
                              >
                                <FormControlLabel
                                  control={
                                    <ProfessionalSwitch
                                      checked={!!row?.visibleToSSE}
                                      onChange={(e) => handleSseToggleClick(e, row)}
                                    />
                                  }
                                  label='SSE'
                                  sx={{ 
                                    m: 0, 
                                    '& .MuiFormControlLabel-label': { 
                                      fontSize: '13px', 
                                      fontWeight: 500, 
                                      ml: 1, 
                                      color: '#475569' 
                                    } 
                                  }}
                                />
                              </Tooltip>
                            )}
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography
                              sx={{
                                fontSize: '13px',
                                color: '#334155',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {renderCellContent(column, row)}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box sx={tableStyles.footer}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={tableStyles.downloadLink}
                onClick={() => {
                  const body = fetchAllIndividualRecords(
                    dispatch,
                    filterData,
                    searchText,
                    currentPage,
                    rowsPerPage.value,
                    sortKeys,
                    true,
                  )
                  handleDownloadExcel(body, true)()
                }}
              >
                <DownloadIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: '13px', fontWeight: 500 }}>
                  {localizationConstants.downloadReport}
                </Typography>
              </Box>
            </Box>
            <CustomPagination
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalCount={allIndividualRecords?.totalCount}
            />
          </Box>
        </Box>
      ) : (
        <Box sx={tableStyles.emptyState}>
          <CustomIcon
            name={iconConstants.initiationBlack}
            style={{ width: '80px', height: '80px', opacity: 0.4 }}
            svgStyle={'width: 80px; height: 80px'}
          />
          <Typography sx={tableStyles.emptyStateTitle}>
            {localizationConstants.noIndividualCasesAdded}
          </Typography>
          <Typography sx={tableStyles.emptyStateSubtitle}>
            {localizationConstants.addIndividualCase}
          </Typography>
        </Box>
      )}

      {/* Filter Drawer */}
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
          fetchAllIndividualRecords(
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

      {/* Add Dialog */}
      {modal.add && (
        <AddIndividualCaseDialog
          open={modal.add}
          onClose={() => handleModal('add', false)}
          onAddIndividual={() => refreshListAndCloseDialog('add')}
        />
      )}

      {/* Edit Dialog */}
      {modal.edit && (
        <EditStudent
          open={modal.edit}
          onClose={() => handleModal('edit', false)}
          rowDataSelected={rowDataSelected}
          onEditIndividual={() => refreshListAndCloseDialog('edit')}
        />
      )}

      {/* SSE Confidentiality Toggle Disclaimer Dialog */}
      <Dialog 
        open={sseWarningDialog} 
        onClose={() => {
          setSseWarningDialog(false)
          setSelectedRowForSSE(null)
        }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, borderBottom: '1px solid #e0e0e0', pb: 1.5, fontSize: '18px' }}>
          🔐 Confidentiality Toggle – Disclaimer
        </DialogTitle>
        <DialogContent sx={{ mt: 2.5 }}>
          <Typography variant="body1" sx={{ mb: 1.5, color: '#334155' }}>
            <strong>By default, this toggle is OFF.</strong><br/>
            This means all case details and information remain <strong>confidential and visible only to the counselor</strong>.
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 1, color: '#334155' }}>
            When you <strong>turn ON the SSE toggle</strong>:
          </Typography>
          
          <Box component="ul" sx={{ mt: 0, mb: 3, pl: 3, color: '#475569' }}>
            <li style={{ marginBottom: '8px' }}>
              <Typography variant="body2" sx={{ fontSize: '14px' }}>
                You are <strong>granting access to Special Educators (SSE)</strong> within the same school.
              </Typography>
            </li>
            <li>
              <Typography variant="body2" sx={{ fontSize: '14px' }}>
                The case details and related information will become <strong>visible to them for collaboration and support</strong>.
              </Typography>
            </li>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: '#FEF2F2', p: 1.5, borderRadius: '8px', border: '1px solid #FEE2E2' }}>
            <Typography variant="body2" sx={{ color: '#DC2626', fontStyle: 'italic', fontWeight: 500 }}>
              ⚠️ Please enable this option only when SSE involvement is required.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 1 }}>
          <Button 
            onClick={() => {
              setSseWarningDialog(false)
              setSelectedRowForSSE(null)
            }} 
            sx={{ fontWeight: 600, color: '#64748B' }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmSseToggle}
            variant="contained"
            sx={{ fontWeight: 600, backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1D4ED8' } }}
          >
            Enable SSE Access
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default IndividualCase