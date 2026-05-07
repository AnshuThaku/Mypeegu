import { updateIsLoading } from '../../../toast/toastSlice'
import { uploadImageToS3Bucket } from '../../../utils/uploadToS3Bucket'
import {
  addUpdateSelModule,
  getPresignedSelModulesUrls,
  verifySelModule,
} from './SELSlice'

// ── Naya Parameter Add Kiya: country ──
export const getPresignedUrlForFiles = async (
  dispatch,
  country,
  year,
  month,
  extractedFiles,
  setPresignedUrls,
) => {
  const filePaths = extractedFiles.map((obj) => obj.originalPath)

  const body = {
    filePaths,
    year,
    month,
    country, // Add kiya backend s3 path generate karne ke liye
  }

  const res = await dispatch(getPresignedSelModulesUrls({ body }))
  if (!res.error) {
    setPresignedUrls(res.payload)
  }
}

export const uploadFilesToS3 = async (fileObjects) => {
  console.log(fileObjects)
  const uploadFiles = fileObjects.map((obj) =>
    uploadImageToS3Bucket(obj.link, obj.file),
  )
  console.log(uploadFiles.map((x) => x.link))
  await Promise.all(uploadFiles)
}

// ── Naya Parameter Add Kiya: country ──
export const uploadDataToDB = async (
  dispatch,
  country,
  year,
  month,
  extractedFiles,
  clearAll,
) => {
  const filePaths = extractedFiles.map((obj) => obj.originalPath)

  const body = {
    filePaths,
    year,
    month,
    country, // Add kiya backend me save karne ke liye
  }

  const res = await dispatch(addUpdateSelModule({ body }))
  if (!res.error) {
    clearAll()
  }
}

// ── Naya Parameter Add Kiya: country ──
const verifySelModuleWithDB = async (dispatch, country, month, year) => {
  const body = {
    month,
    year,
    country, // Check karne ke liye ki is specific country/year/month ka data hai ya nahi
  }

  const res = await dispatch(verifySelModule({ body }))
  if (!res.error) {
    return res.payload?.exist ?? false
  }
  return false
}

// ── Naya Parameter Add Kiya: country ──
export const uploadSelModuleSubmit = async (
  dispatch,
  country,
  year,
  month,
  extractedFiles,
  presignedUrls,
  acknowledge,
  setUploadAlertDialog,
  setIsUploading,
  clearAll,
) => {
  if (!acknowledge) {
    const verify = await verifySelModuleWithDB(dispatch, country, month, year)
    if (verify) {
      setUploadAlertDialog(true)
      return
    }
  }

  console.log(extractedFiles)
  console.log(presignedUrls)

  const fileObjects = extractedFiles.map((obj) => {
    const link = presignedUrls[obj.originalFilename]
    return {
      file: obj.file,
      link,
    }
  })

  setIsUploading(true)

  // Upload the files to s3
  await uploadFilesToS3(fileObjects)
  setIsUploading(false)

  // Once the files are uploaded update the database for the same
  await uploadDataToDB(dispatch, country, year, month, extractedFiles, clearAll)
}
