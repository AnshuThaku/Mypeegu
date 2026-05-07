const {
 S3Client,
 ListObjectsCommand,
 PutObjectCommand,
 DeleteObjectCommand,
 HeadObjectCommand
} = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const axios = require("axios")
const logger = require("../utility/logger")

/* ------------------ S3 CLIENT ------------------ */

const s3Client = new S3Client({
 region: process.env.AWS_REGION,
 credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
 }
})

/* ------------------ S3 INFO ------------------ */

function fetchS3Info() {
 return {
  s3Client: s3Client,
  bucket: process.env.AWS_BUCKET,
  region: process.env.AWS_REGION,
  resourceBaseUrl: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
 }
}

/* ------------------ LIST FILES ------------------ */

const listOfFiles = async (path) => {
 const s3Info = fetchS3Info()

 try {

  const params = {
   Bucket: s3Info.bucket,
   Prefix: path
  }

  const data = await s3Info.s3Client.send(new ListObjectsCommand(params))

  return data

 } catch (err) {

  console.error("S3 List Error:", err)
  return null

 }
}

/* ------------------ GENERATE PRESIGNED URL ------------------ */

const generatePreSignedUrl = async (path, fileName, contentType) => {

 const s3Info = fetchS3Info()

 try {

  const params = {
   Bucket: s3Info.bucket,
   Key: `${path}${fileName}`,
   ContentType: contentType
  }

  const command = new PutObjectCommand(params)

  const signedUrl = await getSignedUrl(
   s3Info.s3Client,
   command,
   { expiresIn: 3600 }
  )

  return signedUrl

 } catch (err) {

  console.error("Presigned URL Error:", err)
  logger.info(err)
  return false

 }
}

/* ------------------ DELETE FILE ------------------ */

const deleteImageFromS3 = async (path, fileName) => {

 const s3Info = fetchS3Info()

 try {

  const params = {
   Bucket: s3Info.bucket,
   Key: `${path}${fileName}`
  }

  const deleteCommand = new DeleteObjectCommand(params)

  await s3Info.s3Client.send(deleteCommand)

  console.log(`Deleted: s3://${params.Bucket}/${params.Key}`)

  return true

 } catch (err) {

  console.error("Delete Error:", err)
  logger.info(err)
  return false

 }
}

/* ------------------ DIRECT UPLOAD ------------------ */

async function uploadImage(buffer, fileName, path) {

 const s3Info = fetchS3Info()

 try {

  const base64Data = Buffer.from(buffer, "base64")

  const objectKey = `${path}${fileName}`

  const uploadParams = {
   Bucket: s3Info.bucket,
   Key: objectKey,
   Body: base64Data,
   ContentType: "image/png"
  }

  await s3Info.s3Client.send(
   new PutObjectCommand(uploadParams)
  )

  const objectUrl = `${s3Info.resourceBaseUrl}/${objectKey}`

  return objectUrl

 } catch (error) {

  console.error("Upload Error:", error)
  logger.info(error)

  return false
 }
}

/* ------------------ GET BASE64 FROM URL ------------------ */

async function getImageBase64StringFromUrl(url) {

 try {

  const response = await axios.get(url, {
   responseType: "arraybuffer"
  })

  const base64String = Buffer
   .from(response.data, "binary")
   .toString("base64")

  return base64String

 } catch (err) {

  console.error("Fetch Base64 Error:", err)

  return null
 }
}

/* ------------------ CHECK FILE EXIST ------------------ */

const isFileExistInS3 = async (url) => {

 const s3Info = fetchS3Info()

 try {

  const params = {
   Bucket: s3Info.bucket,
   Key: url
  }

  await s3Info.s3Client.send(
   new HeadObjectCommand(params)
  )

  return true

 } catch (error) {

  if (error.name === "NotFound") {
   logger.info("File does not exist.")
  } else {
   logger.info("S3 Check Error:", error)
  }

  return false
 }
}

/* ------------------ EXPORT ------------------ */

module.exports = {
 listOfFiles,
 deleteImageFromS3,
 uploadImage,
 generatePreSignedUrl,
 getImageBase64StringFromUrl,
 isFileExistInS3
}
