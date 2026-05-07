import { useEffect, useRef, useState } from 'react'
import { Box, Typography, Button, Alert, LinearProgress, Grid } from '@mui/material'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import ZipUploadExtractor from '../../../components/commonComponents/UploadZipExtractor'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
import {
  getPresignedUrlForFiles,
  uploadSelModuleSubmit,
} from './SelModuleFunctions'
import { useDispatch, useSelector } from 'react-redux'
import CustomAlertDialogs from '../../../components/commonComponents/CustomAlertDialogs'
import { iconConstants } from '../../../resources/theme/iconConstants'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const UploadSelModules = () => {
  const dispatch = useDispatch()
  const zipExtractChild = useRef()
  
  // ─── REDUX SE COUNTRIES NIKAL LI ───
  // Note: Aapke store structure ke according "dashboardSliceSetup" me countries ho sakti hain.
  // Agar countries khali aati hain, toh us part ka state path check kar lijiye jahan SchoolForm me use ho raha hai.
  const { countries } = useSelector((store) => store.dashboardSliceSetup)

  // States
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  
  // Lists
  const [countriesList, setCountriesList] = useState([]) 
  const [monthsList, setMonthsList] = useState([])
  const [yearsList, setYearsList] = useState([])
  
  // Upload States
  const [extractedFiles, setExtractedFiles] = useState([]) 
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [presignedUrls, setPresignedUrls] = useState([])
  const [uploadAlertDialog, setUploadAlertDialog] = useState(false)

  // Handle files extracted from ZIP
  const handleFilesExtracted = (files) => {
    setExtractedFiles(files)
    setError('')
    
    // Country ab pass kar rahe hain
    getPresignedUrlForFiles(
      dispatch,
      selectedCountry,
      selectedYear,
      selectedMonth,
      files,
      setPresignedUrls,
    )
  }

  // Handle extraction errors
  const handleExtractionError = (errorMessage) => {
    setError(errorMessage)
    setExtractedFiles([])
  }

  // Handle form submission
  const uploadZipAndExtract = async (acknowledgement = false) => {
    uploadSelModuleSubmit(
      dispatch,
      selectedCountry,
      selectedYear,
      selectedMonth,
      extractedFiles,
      presignedUrls,
      acknowledgement,
      setUploadAlertDialog,
      setIsUploading,
      () => {
        zipExtractChild.current.clearExtractedFiles()
        setExtractedFiles([])
      },
    )
  }

  const handleYearChange = (year) => {
    setSelectedYear(year)
    setMonthsList(months)
  }

  // Set initial default options and dynamic lists
  useEffect(() => {
    const generatedYears = Array.from({ length: 10 }, (_, i) => `Year ${i + 1}`)
    
    setYearsList(generatedYears)
    setMonthsList(months)
    
    setSelectedYear(generatedYears[0])
    setSelectedMonth(months[0])
  }, [])

  // Sync Redux countries to local component state
  useEffect(() => {
    if (countries && countries.length > 0) {
      // Map it to an array of country names (assuming the store has an array of objects)
      const formattedCountries = countries.map(c => c.name || c.countryName || c.country || c)
      setCountriesList(formattedCountries)
      
      // Select the first one by default
      if (!selectedCountry && formattedCountries.length > 0) {
        setSelectedCountry(formattedCountries[0])
      }
    }
  }, [countries])

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      
      {/* ─── Dropdowns Grid ─── */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* Country Selection */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant={typographyConstants.title}
            sx={{ color: 'textColors.grey', fontSize: '14px', mb: '4px' }}
          >
            Select Country *
          </Typography>
          <CustomAutocompleteNew
            sx={{ width: '100%' }}
            fieldSx={{ height: '44px' }}
            value={selectedCountry}
            placeholder="Select Country"
            onChange={(e) => {
              setSelectedCountry(e)
            }}
            options={countriesList}
          />
        </Grid>

        {/* Year Selection */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant={typographyConstants.title}
            sx={{ color: 'textColors.grey', fontSize: '14px', mb: '4px' }}
          >
            {localizationConstants.selectYear} *
          </Typography>
          <CustomAutocompleteNew
            sx={{ width: '100%' }}
            fieldSx={{ height: '44px' }}
            value={selectedYear}
            placeholder={localizationConstants.selectYear}
            onChange={(e) => {
              handleYearChange(e)
            }}
            options={yearsList}
          />
        </Grid>

        {/* Month Selection */}
        <Grid item xs={12} sm={4}>
          <Typography
            variant={typographyConstants.title}
            sx={{ color: 'textColors.grey', fontSize: '14px', mb: '4px' }}
          >
            {localizationConstants.selectMonth} *
          </Typography>
          <CustomAutocompleteNew
            sx={{ width: '100%' }}
            fieldSx={{ height: '44px' }}
            value={selectedMonth}
            placeholder={localizationConstants.selectMonth}
            onChange={(e) => {
              setSelectedMonth(e)
            }}
            options={monthsList}
          />
        </Grid>
      </Grid>

      {/* ZIP Upload and Extraction Component */}
      <ZipUploadExtractor
        onFilesExtracted={handleFilesExtracted}
        onError={handleExtractionError}
        maxFileSize={500 * 1024 * 1024} // 100MB max
        ref={zipExtractChild}
      />

      {/* Progress Bar */}
      {isUploading && (
        <Box sx={{ mb: 3 }}>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Uploading files...
          </Typography>
          <LinearProgress />
        </Box>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity='success' sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      {/* Upload Button */}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant='contained'
          size='large'
          onClick={() => {
            uploadZipAndExtract(false)
          }}
          disabled={
            isUploading ||
            extractedFiles.length === 0 ||
            !selectedCountry ||
            !selectedYear ||
            !selectedMonth
          }
          startIcon={<CloudUploadIcon />}
          sx={{ minWidth: 200 }}
        >
          {isUploading
            ? 'Uploading...'
            : `Upload ${extractedFiles.length} Files`}
        </Button>
      </Box>

      <CustomAlertDialogs
        open={uploadAlertDialog}
        setOpen={setUploadAlertDialog}
        type={localizationConstants.selModuleUploadAcknowledgement}
        title={localizationConstants.selModuleAlreadyExist}
        onSubitClick={() => {
          setUploadAlertDialog(false)
          uploadZipAndExtract(true)
        }}
        onCancelClick={() => {
          setUploadAlertDialog(false)
        }}
        iconName={iconConstants}
      />
    </Box>
  )
}

export default UploadSelModules