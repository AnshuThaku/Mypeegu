const express = require('express');
const router = express.Router();

// 🟢 Apne AWS helper file ka path yahan daalein
const { generateViewPreSignedUrl } = require('../../routes/AWSS3Manager'); 

// 🟢 GET API TO FETCH PDF URL
router.get('/view-pdf', async (req, res) => {
  try {
    let { fileName } = req.query; // 'let' use kiya taaki modify kar sakein

    if (!fileName) {
      return res.status(400).json({ success: false, message: 'File name is required' });
    }

    // 🔥 MAIN FIX: Agar file ke naam mein shuru mein slash (/) hai, toh use hata do
    // Ye code ensure karega ki double slash (//) kabhi na bane
    fileName = fileName.replace(/^\/+/, ''); 

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