const express = require('express');
const router = express.Router();

// 🟢 Apne AWS helper file ka path yahan daalein (Jahan aapne generateViewPreSignedUrl banaya hai)
const { generateViewPreSignedUrl } = require('../../routes/AWSS3Manager'); 

// 🟢 GET API TO FETCH PDF URL
router.get('/view-pdf', async (req, res) => {
  try {
    // Frontend se file ka naam aayega (e.g., ?fileName=module_1_grade_8.pdf)
    const { fileName } = req.query; 

    if (!fileName) {
      return res.status(400).json({ success: false, message: 'File name is required' });
    }

    // 🟢 S3 Bucket ke andar ka folder path (Agar root par hai toh khali string "" chhod dein)
    const s3FolderPath = ""; 

    // Naya function call karein URL generate karne ke liye
    const pdfUrl = await generateViewPreSignedUrl(s3FolderPath, fileName);

    if (pdfUrl) {
      return res.status(200).json({ 
        success: true, 
        data: { url: pdfUrl } 
      });
    } else {
      return res.status(500).json({ success: false, message: 'Failed to generate secure URL' });
    }

  } catch (error) {
    console.error("PDF Fetch Error:", error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;