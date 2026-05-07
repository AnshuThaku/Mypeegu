import React, { useState, memo, useEffect, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import FileUploadDialog from '../../../components/FileUploadDialog'
import useCommonStyles from '../../../components/styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  downloadExcel,
  getCurrentAcademicYearId,
  getUserFromLocalStorage,
  initialuploadSelectOptionsStates,
  getCurACYear,
  getPrevACYear,
} from '../../../utils/utils'
import { TeachersUploadDefaultExcelColumns } from './teachersConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { UploadMultipleTeachersData } from './tecahersFunction'
import { iconConstants } from '../../../resources/theme/iconConstants'
import CustomDialog from '../../../components/CustomDialog'
import { ErrorMsgsExcelDownload } from '../../initiations/baseline/baselineFunctions'
import { getSchoolsList } from '../../../redux/commonSlice'
import { bulkUploadMandatoryKeys } from '../../../utils/globalConstants'

const UploadTeachers = ({ modal, handleModal, refreshList }) => {
  const flexStyles = useCommonStyles()
  const dispatch = useDispatch()
  const { schoolsList } = useSelector((store) => store.commonData)
  const { academicYears } = useSelector((store) => store.dashboardSliceSetup)
  const [inputFileObject, setInputFileObject] = useState({
    fileName: '',
    file: '',
    fileUrl: '',
    extensionError: false,
  })
  const [outputFileObject, setOutputFileObject] = useState({
    fileName: '',
    file: '',
    fileUrl: '',
    extensionError: false,
  })
  const [excelTableData, setExcelTableData] = useState({})
  const counsellor = getUserFromLocalStorage()
  const [deleteBulkDialog, setDeleteBulkDialog] = useState(false)
  const [response, setResponse] = useState('')
  const [selectedOptionsData, setSelctedOptionsData] = useState(
    initialuploadSelectOptionsStates,
  )

  const content = (
    <>
      <Box sx={{ display: 'flex', mb: '10px', mt: '24px' }}>
        <Box
          className={flexStyles.flexSpaceBetween}
          sx={{ width: '40%', mx: '1%' }}
        >
          <Box sx={{ display: 'flex', gap: '3px' }}>
            <Typography variant={typographyConstants.body}>
              {' '}
              {localizationConstants.teachersId}
            </Typography>
            <Typography
              sx={{
                color: 'red',
              }}
            >
              {'*'}
            </Typography>
          </Box>

          <Typography variant={typographyConstants.body}>
            :
          </Typography>
        </Box>
        <Box sx={{ width: '58%', mx: '1%', ml: '10px' }}>
          <Typography variant={typographyConstants.body}>
            {' '}
            {localizationConstants.teachersIdMsg}{' '}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', mb: '10px', mt: '10px' }}>
        <Box
          className={flexStyles.flexSpaceBetween}
          sx={{ width: '40%', mx: '1%' }}
        >
          <Box sx={{ display: 'flex', gap: '3px' }}>
            <Typography variant={typographyConstants.body}>
              {' '}
              {localizationConstants?.teacherName}
            </Typography>
            <Typography
              sx={{
                color: 'red',
              }}
            >
              {'*'}
            </Typography>
          </Box>
          <Typography variant={typographyConstants.body}>
            :
          </Typography>
        </Box>
        <Box sx={{ width: '58%', mx: '1%', ml: '10px' }}>
          <Typography variant={typographyConstants.body}>
            {' '}
            {localizationConstants.teacherNameMsg}{' '}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mt: '10px' }}>
        <Box
          className={flexStyles.flexSpaceBetween}
          sx={{ width: '40%', mx: '1%' }}
        >
          <Box sx={{ display: 'flex', gap: '3px' }}>
            <Typography variant={typographyConstants.body}>
              {' '}
              {localizationConstants.gender}{' '}
            </Typography>
            <Typography
              sx={{
                color: 'red',
              }}
            >
              {'*'}
            </Typography>
          </Box>
          <Typography variant={typographyConstants.body}>
            :
          </Typography>
        </Box>
        <Box sx={{ width: '58%', ml: '10px' }}>
          <Typography variant={typographyConstants.body}>
            {' '}
            {localizationConstants.teacherGenderMsg}{' '}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', mt: '10px' }}>
        <Box
          className={flexStyles.flexSpaceBetween}
          sx={{ width: '40%', mx: '1%' }}
        >
          <Box sx={{ display: 'flex', gap: '3px' }}>
            <Typography variant={typographyConstants.body}>
              {' '}
              {localizationConstants.email}{' '}
            </Typography>
            <Typography
              sx={{
                color: 'red',
              }}
            >
              {'*'}
            </Typography>
          </Box>
          <Typography variant={typographyConstants.body}>
            :
          </Typography>
        </Box>
        <Box sx={{ width: '58%', ml: '10px' }}>
          <Typography variant={typographyConstants.body}>
            {' '}
            {localizationConstants.teacherEmailIdMsg}{' '}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', mt: '10px' }}>
        <Box
          className={flexStyles.flexSpaceBetween}
          sx={{ width: '40%', mx: '1%' }}
        >
          <Box sx={{ display: 'flex', gap: '3px' }}>
            <Typography variant={typographyConstants.body}>
              {' '}
              {localizationConstants.Phone_no}{' '}
            </Typography>
          </Box>
          <Typography variant={typographyConstants.body}>
            :
          </Typography>
        </Box>
        <Box sx={{ width: '58%', ml: '10px' }}>
          <Typography variant={typographyConstants.body}>
            {' '}
            {localizationConstants.phoneNoTeacher}{' '}
          </Typography>
        </Box>
      </Box>
    </>
  )

  const isInitialLoad = useRef(true)
  useEffect(() => {
    if (academicYears.length > 0 && isInitialLoad.current) {
      // Kyunki utils.js fix ho gaya hai, ab ye directly dynamic ID uthayega
      const currentAYId = getCurrentAcademicYearId(academicYears)
      if (currentAYId) {
        setSelctedOptionsData((state) => ({
          ...state,
          selectdAY: currentAYId,
        }))
      }
      isInitialLoad.current = false
    }
  }, [academicYears])

  const fetchSchoolList = () => {
    if (selectedOptionsData.selectdAY) {
      const body = {
        filter: { academicYear: selectedOptionsData.selectdAY },
      }
      dispatch(getSchoolsList({ body }))
    }
  }

  useEffect(() => {
    fetchSchoolList()
  }, [selectedOptionsData.selectdAY])

  // Current aur Previous Year ki string lana
  const curAYString = getCurACYear()
  const prevAYString = getPrevACYear()

  // Dropdown mein sirf current aur previous year show karega
  const acyOption = academicYears
    .filter((acy) => acy.academicYear === curAYString || acy.academicYear === prevAYString)
    .map((acy) => ({ id: acy._id, label: acy.academicYear }))

  const schoolListOptions =
    schoolsList.map((obj) => ({
      label: `${obj.school} (${obj.scCode})`,
      id: obj._id,
    })) || []

  return (
    <Box>
      <FileUploadDialog
        open={modal.upload}
        width='100px'
        inputFileObject={inputFileObject}
        setOutputFileObject={setOutputFileObject}
        setExcelTableData={(data) => {
          if (Array.isArray(data) && data?.length > 0) {
            UploadMultipleTeachersData(
              dispatch,
              data,
              handleModal,
              setInputFileObject,
              counsellor?.profile?.fullName,
              setDeleteBulkDialog,
              setResponse,
              selectedOptionsData.selectdSchool,
              selectedOptionsData.selectdAY,
              refreshList,
            )
          }
        }}
        handleUploadFormClose={(e) => {
          handleModal('upload', false)
        }}
        type='sheet'
        handleExcelDownload={(e) => {
          e.stopPropagation()
          downloadExcel(
            TeachersUploadDefaultExcelColumns,
            'Teachers.xlsx',
          )
        }}
        Content={content}
        isSchoolListReq={true}
        
        // 👉 Dropdown ko enable karne ke liye ye dono lines update ki gayi hain
        isAcyRequired={true} 
        disableDropDown1={false} 

        selectedOptionsData={selectedOptionsData}
        setSelctedOptionsData={setSelctedOptionsData}
        schoolOptions={schoolListOptions}
        acyOptions={acyOption}
        mandatoryKeys={bulkUploadMandatoryKeys.teachers}
      />

      <CustomDialog
        isOpen={deleteBulkDialog}
        onClose={() => setDeleteBulkDialog(false)}
        title={`${localizationConstants?.oops} !`}
        iconName={iconConstants.errorFile}
        titleSx={{
          color: 'textColors.red',
          fontWeight: 500,
          pb: '20px',
        }}
        titleTypoVariant={typographyConstants.h4}
        message={localizationConstants.errorFileDownloadMsg}
        messageTypoVariant={typographyConstants.h5}
        leftButtonText={localizationConstants.closeCamel}
        rightButtonText={`${localizationConstants.download} File`}
        onLeftButtonClick={() => {
          setDeleteBulkDialog(false)
        }}
        onRightButtonClick={() => {
          ErrorMsgsExcelDownload(
            response,
            setDeleteBulkDialog,
            'Teacher Validation Error.xlsx',
          )
        }}
      />
    </Box>
  )
}

export default memo(UploadTeachers)