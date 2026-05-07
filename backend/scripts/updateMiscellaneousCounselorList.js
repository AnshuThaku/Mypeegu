const mongoose = require('mongoose')
const { Miscellaneous } = require('../models/database/myPeegu-staticConfigs')
const { collections } = require('../utility/databaseConstants')

async function updateCounselorList() {
	try {
		// Find the miscellaneous document (usually there's only one relevant config doc, but we need to find the one with counselorList)
		const miscDoc = await Miscellaneous.findOne({ counselorList: { $exists: true } })
		
		if (miscDoc) {
			console.log('Current counselorList:', miscDoc.counselorList)
			
			if (!miscDoc.counselorList.includes('SSECounselor')) {
				miscDoc.counselorList.push('SSECounselor')
				// Mark modified because it's a mixed type or just to be safe
				miscDoc.markModified('counselorList')
				await miscDoc.save()
				console.log('SSECounselor added to counselorList')
			} else {
				console.log('SSECounselor already in counselorList')
			}
		} else {
			console.log('No miscellaneous document found with counselorList')
			// Optional: Create one if needed, but risky without knowing structure
		}

	} catch (error) {
		console.error('Error updating counselorList:', error)
	} finally {
		mongoose.connection.close()
	}
}

// Connect to MongoDB and run
// Use environment variable for URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mypeegu'
mongoose.connect(mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
updateCounselorList()