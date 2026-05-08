import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
    Box, Checkbox, FormControlLabel, IconButton,
    Table, TableBody, TableCell, TableRow,
    TableHead, TableContainer, Typography,
    TextField, InputAdornment, Button,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { counsellorStyles } from '../../counsellors/counsellorsStyles';
import { tableStyles } from '../../../components/styles/tableStyles';
import { heartColumn, getSafetyBandByScore } from './heartConstants';
import AddHeartDialog from './AddHeartDialog';
import HeartDrawer from './HeartDrawer';
import HeartAnalyticsDialog from './HeartAnalyticsDialog';
import UploadHeartData from './UploadHeartData';
import CustomDialog from '../../../components/CustomDialog';
import CustomPagination from '../../../components/CustomPagination';
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete';
import CustomIcon from '../../../components/CustomIcon';
import { iconConstants } from '../../../resources/theme/iconConstants';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import { formatDate } from '../../../utils/utils';
import CommonFilterDrawer, {
    initialFilterStates,
    initialAccordionStates,
} from '../../../components/commonComponents/CustomFilter';

const DOMAINS = ['Honesty', 'Empathy', 'Autonomy', 'Respect', 'Trust'];

const dropDownOptions = [
    { id: 'addAssessment', label: 'Add Educator' },
    { id: 'bulkUpload',    label: 'Bulk Upload' },
];

const Heart = () => {
    const tableContainerRef = useRef(null);

    const [allRecords, setAllRecords]         = useState([]);
    const [searchText, setSearchText]         = useState('');
    const [searchInputValue, setSearchInputValue] = useState('');
    const [rowsPerPage, setRowsPerPage]       = useState({ text: '150', value: 150 });
    const [currentPage, setCurrentPage]       = useState(1);
    const [selectedDropDown, setSelectedDropDown] = useState('');
    const [hoveredRowIndex, setHoveredRowIndex]   = useState(null);
    const [deleteId, setDeleteId]             = useState('');
    const [filterData, setFilterData]         = useState(initialFilterStates);
    const [isSelectedAllForDelete, setIsSelectedAllForDelete] = useState(false);
    const [idsForDelete, setIdsForDelete]     = useState([]);

    const [modal, setModal] = useState({
        add: false, drawer: false, filter: false,
        deleteSingle: false, bulkUpload: false, analytics: false,
    });

    const [selectedData, setSelectedData] = useState({
        domainKey: '', displayLabel: '', total: 0, rowData: null,
    });

    useEffect(() => {
        const saved = localStorage.getItem('heartRecords');
        if (saved) setAllRecords(JSON.parse(saved));
    }, []);

    const refreshFromStorage = () => {
        const saved = localStorage.getItem('heartRecords');
        if (saved) setAllRecords(JSON.parse(saved));
    };

    const handleModal = useCallback((name, value) => {
        setModal(s => ({ ...s, [name]: value }));
    }, []);

    const handleSelectDropDown = (val) => {
        if (val === 'addAssessment') handleModal('add', true);
        else if (val === 'bulkUpload') handleModal('bulkUpload', true);
        setSelectedDropDown('');
    };

    const renderDomainScore = (row, domainKey, displayLabel) => {
        const score = row.domainScores?.[domainKey] || 0;
        const band  = getSafetyBandByScore(score);
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{
                    width: '26px', height: '22px', borderRadius: '4px',
                    backgroundColor: band.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Typography sx={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>
                        {score}
                    </Typography>
                </Box>
                <IconButton
                    size="small"
                    sx={{ p: 0, color: '#64748B' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!isSelectedAllForDelete) {
                            setSelectedData({ domainKey, displayLabel, total: score, rowData: row });
                            handleModal('drawer', true);
                        }
                    }}
                >
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                </IconButton>
            </Box>
        );
    };

    const renderOverallScore = (row) => {
        const score = row.overallScore || 0;
        const band  = getSafetyBandByScore(score);
        return (
            <Box sx={{
                display: 'inline-flex', alignItems: 'center',
                px: 1.5, py: 0.4, borderRadius: '12px',
                backgroundColor: band.color + '20',
                border: `1px solid ${band.color}40`,
            }}>
                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: band.color }}>
                    {score}%
                </Typography>
            </Box>
        );
    };

    const renderCellContent = (column, row) => {
        const { name } = column;
        if (name === 'code_name') return row.code_name || '-';
        if (name === 'grades_taught') return row.grades_taught || '-';
        if (name === 'createdAt')     return formatDate(row.createdAt) || '-';
        if (name === 'overallScore')  return renderOverallScore(row);
        if (DOMAINS.includes(name))   return renderDomainScore(row, name, name);
        return '-';
    };

    const filteredRecords = useMemo(() => {
        return allRecords.filter(r =>
            searchText
                ? (r.code_name || '').toLowerCase().includes(searchText.toLowerCase())
                : true
        );
    }, [allRecords, searchText]);

    const tableMinWidth = useMemo(
        () => heartColumn.reduce((sum, col) => sum + (col.width || 120), 0),
        []
    );

    useEffect(() => { setIsSelectedAllForDelete(false); }, [currentPage]);

    return (
        <Box sx={counsellorStyles.pageContainerSx}>
            <Box sx={counsellorStyles.toolbarSx}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TextField
                        placeholder="Search by Code Name..."
                        value={searchInputValue}
                        onChange={(e) => {
                            setSearchInputValue(e.target.value);
                            setSearchText(e.target.value);
                        }}
                        size="small"
                        sx={counsellorStyles.searchFieldSx}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
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
                        variant="outlined"
                        sx={{
                            ...counsellorStyles.addButtonSx,
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            backgroundColor: 'transparent',
                        }}
                        onClick={() => handleModal('analytics', true)}
                    >
                        {localizationConstants.heartAnalytics || 'H.E.A.R.T. Analytics'}
                    </Button>

                    <CustomAutocompleteNew
                        options={dropDownOptions.map(op => ({ id: op.id, label: op.label }))}
                        sx={{ minWidth: '150px', height: '34px' }} 
                        fieldSx={{ height: '34px' }} 
                        placeholder={localizationConstants.select || 'Select'}
                        value={selectedDropDown}
                        onChange={(val) => handleSelectDropDown(val)}
                    />
                </Box>
            </Box>

            <Box sx={{ ...tableStyles.container, flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <TableContainer
                    ref={tableContainerRef}
                    sx={{ flex: 1, overflow: 'auto', ...tableStyles.scrollWrapper }}
                >
                    <Table stickyHeader size="small" sx={{ tableLayout: 'fixed', minWidth: tableMinWidth }}>
                        <TableHead>
                            <TableRow sx={{ height: '44px' }}>
                                {heartColumn.map((col, idx) => (
                                    <TableCell
                                        key={col.id}
                                        sx={{
                                            ...tableStyles.headerCell,
                                            width: col.width,
                                            minWidth: col.width,
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            {isSelectedAllForDelete && idx === 0 && (
                                                <Checkbox
                                                    size="small"
                                                    checked={isSelectedAllForDelete}
                                                    onChange={() => setIsSelectedAllForDelete(!isSelectedAllForDelete)}
                                                    sx={{ p: 0, mr: 1 }}
                                                />
                                            )}
                                            <Typography sx={{
                                                fontSize: '11px', fontWeight: 600,
                                                color: '#64748B', textTransform: 'uppercase',
                                                letterSpacing: '0.3px', flex: 1,
                                            }}>
                                                {col.label}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredRecords.length > 0 ? (
                                filteredRecords.map((row, index) => (
                                    <TableRow
                                        key={row.id}
                                        onMouseEnter={() => setHoveredRowIndex(index)}
                                        onMouseLeave={() => setHoveredRowIndex(null)}
                                        onClick={() => {
                                            if (isSelectedAllForDelete) {
                                                setIdsForDelete(prev =>
                                                    prev.includes(row.id)
                                                        ? prev.filter(i => i !== row.id)
                                                        : [...prev, row.id]
                                                );
                                            }
                                        }}
                                        sx={tableStyles.bodyRow}
                                    >
                                        {heartColumn.map((col, colIdx) => (
                                            <TableCell
                                                key={col.id}
                                                sx={{
                                                    ...tableStyles.bodyCell,
                                                    width: col.width,
                                                    minWidth: col.width,
                                                }}
                                            >
                                                {col.id === 'actions' ? (
                                                    hoveredRowIndex === index && !isSelectedAllForDelete ? (
                                                        <IconButton
                                                            size="small"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteId(row.id);
                                                                handleModal('deleteSingle', true);
                                                            }}
                                                            sx={{
                                                                color: '#EF4444',
                                                                '&:hover': { backgroundColor: 'rgba(239,68,68,0.1)' },
                                                            }}
                                                        >
                                                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    ) : null
                                                ) : (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        {isSelectedAllForDelete && colIdx === 0 && (
                                                            <FormControlLabel
                                                                checked={idsForDelete.includes(row.id)}
                                                                onChange={(e) => {
                                                                    e.stopPropagation();
                                                                    setIdsForDelete(prev =>
                                                                        prev.includes(row.id)
                                                                            ? prev.filter(i => i !== row.id)
                                                                            : [...prev, row.id]
                                                                    );
                                                                }}
                                                                control={<Checkbox size="small" sx={{ p: 0, mr: 1 }} />}
                                                                label=""
                                                                sx={{ m: 0 }}
                                                            />
                                                        )}
                                                        {renderCellContent(col, row)}
                                                    </Box>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={heartColumn.length}>
                                        <Box sx={tableStyles.emptyState}>
                                            <CustomIcon
                                                name={iconConstants.initiationBlack}
                                                style={{ width: '80px', height: '80px', opacity: 0.4 }}
                                                svgStyle="width: 80px; height: 80px"
                                            />
                                            <Typography sx={tableStyles.emptyStateTitle}>
                                                No H.E.A.R.T. assessments added
                                            </Typography>
                                            <Typography sx={tableStyles.emptyStateSubtitle}>
                                                Use the Select dropdown to add or upload assessments
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box sx={tableStyles.footer}>
                    <Box />
                    <CustomPagination
                        rowsPerPage={rowsPerPage}
                        setRowsPerPage={setRowsPerPage}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalCount={filteredRecords.length}
                    />
                </Box>
            </Box>

            <CommonFilterDrawer
                onOpen={modal.filter}
                handleModal={handleModal}
                filterOptions={{ ...initialAccordionStates }}
                filterData={filterData}
                setFilterData={setFilterData}
                onApply={() => handleModal('filter', false)}
                defaultAccordions={[]}
            />

            <HeartDrawer
                open={modal.drawer}
                onClose={() => handleModal('drawer', false)}
                domainKey={selectedData.domainKey}
                displayLabel={selectedData.displayLabel}
                total={selectedData.total}
                rowData={selectedData.rowData}
                onEditSuccess={refreshFromStorage}
            />

            {modal.add && (
                <AddHeartDialog
                    open={modal.add}
                    onClose={() => {
                        handleModal('add', false);
                        setSelectedDropDown('');
                    }}
                    onAdd={(rec) => {
                        const updated = [rec, ...allRecords];
                        setAllRecords(updated);
                        localStorage.setItem('heartRecords', JSON.stringify(updated));
                        setSelectedDropDown('');
                    }}
                />
            )}

            <UploadHeartData
                open={modal.bulkUpload}
                onClose={() => {
                    handleModal('bulkUpload', false);
                    setSelectedDropDown('');
                }}
                onUploadSuccess={(updated) => {
                    setAllRecords(updated);
                    handleModal('bulkUpload', false);
                    setSelectedDropDown('');
                }}
            />

            {modal.analytics && (
                <HeartAnalyticsDialog
                    open={modal.analytics}
                    onClose={() => handleModal('analytics', false)}
                    data={filteredRecords}
                />
            )}

            <CustomDialog
                isOpen={modal.deleteSingle}
                title={localizationConstants.deleteStudentRecord || 'Delete Record'}
                iconName={iconConstants.academicRed}
                message={localizationConstants.baselineDeleteMsg || 'Are you sure you want to delete this record?'}
                titleSx={{ color: 'textColors.red', fontWeight: 500, pb: '20px' }}
                leftButtonText={localizationConstants.cancel || 'Cancel'}
                rightButtonText={localizationConstants.yesDelete || 'Yes, Delete'}
                onLeftButtonClick={() => handleModal('deleteSingle', false)}
                onRightButtonClick={() => {
                    const filtered = allRecords.filter(r => r.id !== deleteId);
                    setAllRecords(filtered);
                    localStorage.setItem('heartRecords', JSON.stringify(filtered));
                    handleModal('deleteSingle', false);
                }}
            />
        </Box>
    );
};

export default Heart;