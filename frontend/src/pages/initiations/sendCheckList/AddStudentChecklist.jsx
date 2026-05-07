import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import {
    Grade_4_Questions,
    Grade_9_Questions,
    checklistOptions,
} from './sendCheckListConstants'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import QuestionsCollapsibleComponent from '../../../components/QuestionsCollapsibleComponent'
import useCommonStyles from '../../../components/styles'
import { handleAddChecklist, handleOptionChange } from './sendChecklistFunction'
import useDebounce from '../../../customHooks/useDebounce'
import { requestParams } from '../../../utils/apiConstants'
import {
    handleInputsInitiations,
    searchStudent,
} from '../individualCase/individualCaseFunctions'

import CommonBarFilter, {
    initialBarFilterStates,
} from '../../../components/commonComponents/CommonBarFilter'
import { delay, getCurrentAcademicYearId } from '../../../utils/utils'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
import { typographyConstants } from '../../../resources/theme/typographyConstants'

const AddStudentChecklist = forwardRef(
    (
        { onAddChecklist, onSaveStateChange, clearOptionsRef, handleClose },
        ref,
    ) => {
        const flexStyles = useCommonStyles()
        const { Grade_9_Marks, Grade_4_Marks } = useSelector(
            (store) => store.sendChecklist,
        )
        const dispatch = useDispatch()
        const { academicYears } = useSelector(
            (store) => store.dashboardSliceSetup,
        )
        const [stSearchData, setStSearchData] = useState([])
        const [disable, setDisable] = useState(false)
        const [selectedDropdownData, setSelectedDropdownData] = useState({
            schools: [],
            classrooms: [],
            sections: [],
            students: [],
            checklist: [],
        })
        const [searchValue, setSearchValue] = useState('')
        const debouncedSearch = useDebounce(searchValue, 1000)
        const [barFilterData, setBarFilterData] = useState(
            initialBarFilterStates,
        )
        const [student, setStudent] = useState({})
        const [modal, setModal] = useState({})

        const handleModal = useCallback((name, value) => {
            const obj = {}
            obj[name] = value
            setModal((state) => ({ ...state, ...obj }))
        }, [])

        const isInitialLoad = useRef(true)
        const populateAcademicYear = async () => {
            if (academicYears.length > 0 && isInitialLoad.current) {
                const currentAYId = getCurrentAcademicYearId(academicYears)
                if (currentAYId) {
                    await delay()
                    setBarFilterData((prev) => ({
                        ...prev,
                        selectdAYs: currentAYId,
                    }))
                }
                isInitialLoad.current = false
            }
        }

        useEffect(() => {
            if (debouncedSearch?.length >= 3) {
                const body = {
                    [requestParams.searchText]: debouncedSearch,
                    academicYear: barFilterData.selectdAYs,
                }
                searchStudent(dispatch, body, setStSearchData)
            } else {
                setStSearchData([])
            }
            if (debouncedSearch.length === 0) {
                setStSearchData([])
            }
        }, [debouncedSearch])

        // --- NEW CONDITIONAL LOGIC FOR FORMATS ---
        const selectedAYObj = academicYears?.find(ay => ay._id === barFilterData?.selectdAYs);
        const isNewFormat = selectedAYObj?.academicYear >= "2026-2027";
        
        // Define options based on year
        const checklistOptionsToDisplay = isNewFormat 
            ? ['No', 'Sometimes', 'Often'] 
            : ['Yes', 'No'];

        const isGrade9 = selectedDropdownData?.checklist?.[0] !== checklistOptions?.[0];
        const currentQuestions = selectedDropdownData?.checklist?.[0] === checklistOptions?.[0]
            ? Grade_4_Questions(Grade_4_Marks, isNewFormat)
            : Grade_9_Questions(Grade_9_Marks, isNewFormat);

        const handleSaveClick = () => {
            handleAddChecklist(
                student?.user_id ?? '',
                selectedDropdownData?.checklist,
                currentQuestions,
                dispatch,
                barFilterData,
                onAddChecklist,
                handleClose,
            )
        }

        useImperativeHandle(ref, () => ({
            handleSaveClick,
            disable,
        }))

        useEffect(() => {
            populateAcademicYear()
        }, [])

        useEffect(() => {
            onSaveStateChange(disable)
        }, [disable])

        useEffect(() => {
            const disable =
                !barFilterData.selectedStudent ||
                selectedDropdownData.checklist.length === 0 ||
                !selectedDropdownData.checklist[0]
            setDisable(disable)
        }, [
            student,
            selectedDropdownData.checklist,
            barFilterData.selectedStudent,
        ])

        return (
            <Box
                className={flexStyles.flexColumn}
                sx={{ position: 'relative' }}
                gap={'20px'}
            >
                <CommonBarFilter
                    barFilterData={barFilterData}
                    setBarFilterData={setBarFilterData}
                    isStudentRequired={true}
                    setStudent={setStudent}
                    dropdownOptions={{
                        academicYear: true,
                        school: true,
                        classroom: true,
                        section: true,
                        student: true,
                        search: true,
                    }}
                    ref={clearOptionsRef}
                />

                <Box sx={{ width: '16%', position: 'absolute', top: '120px' }}>
                    <Typography
                        variant={typographyConstants.body}
                        sx={{
                            mb: '2px',
                            display: 'flex',
                        }}
                    >
                        {localizationConstants.sendChecklistForm}
                    </Typography>
                    <CustomAutocompleteNew
                        options={checklistOptions}
                        value={selectedDropdownData.checklist?.[0] ?? null}
                        onChange={(selectedVal) => {
                            if (selectedVal !== selectedDropdownData?.checklist?.[0]) {
                                setModal({})
                            }

                            handleInputsInitiations(
                                { target: { value: [selectedVal], name: 'checklist' } },
                                setSelectedDropdownData,
                                selectedDropdownData,
                                dispatch,
                                selectedDropdownData?.schools,
                                selectedDropdownData?.classrooms,
                            )
                        }}
                        sx={{ width: '100%' }}
                        fieldSx={{ height: '44px' }}
                        placeholder='Select'
                        multiple={false}
                    />
                </Box>

                {selectedDropdownData?.checklist?.length > 0 && currentQuestions ? (
                    <Box className={flexStyles.flexColumn} gap={'30px'}>
                        {Object.values(currentQuestions).map((questionCategory, index) => {
                            if (!questionCategory) return null;

                            const modalKey = `set${index + 1}`;
                            return (
                                <QuestionsCollapsibleComponent
                                    key={modalKey + (isNewFormat ? 'new' : 'old')}
                                    open={modal?.[modalKey] || false}
                                    onClick={() => handleModal(modalKey, !modal?.[modalKey])}
                                    questionList={questionCategory}
                                    isEditable={true}
                                    isCollapsable={true}
                                    optionsArray={checklistOptionsToDisplay} // <-- Passing New Options
                                    qusetionChange={(idx, option, mainTitle, subQuestions, subTitle) =>
                                        handleOptionChange(
                                            idx,
                                            option,
                                            mainTitle,
                                            subQuestions,
                                            subTitle,
                                            isGrade9,
                                            Grade_4_Marks,
                                            dispatch,
                                            Grade_9_Marks,
                                        )
                                    }
                                />
                            );
                        })}
                    </Box>
                ) : null}
            </Box>
        )
    },
)

export default AddStudentChecklist