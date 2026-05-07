const mongoose = require('mongoose')
const { MyPeeguPermissions, MyPeeguPermissionOps } = require('../models/database/myPeegu-staticConfigs')
const { collections } = require('../utility/databaseConstants')

async function addSSECounselorPermission() {
	try {
		// Check if SSECounselor permission exists
		let ssePermission = await MyPeeguPermissions.findOne({ name: 'SSECounselor' })
		if (!ssePermission) {
			ssePermission = new MyPeeguPermissions({ name: 'SSECounselor' })
			await ssePermission.save()
			console.log('SSECounselor permission created')
		} else {
			console.log('SSECounselor permission already exists')
		}

		// Check if SSECounselor permission ops exists
		let ssePermissionOps = await MyPeeguPermissionOps.findOne({ permission: ssePermission._id })
		if (!ssePermissionOps) {
			// Get all existing permissions to use as userOperationPermissions (same as ScCounselor for now)
			const allPermissions = await MyPeeguPermissions.find({})
			ssePermissionOps = new MyPeeguPermissionOps({
				permission: ssePermission._id,
				userOperationPermissions: allPermissions.map(p => p._id),
				appFeatures: [] // You can add app features later if needed
			})
			await ssePermissionOps.save()
			console.log('SSECounselor permission ops created')
		} else {
			console.log('SSECounselor permission ops already exists')
		}

		console.log('SSECounselor permission setup complete')
	} catch (error) {
		console.error('Error adding SSECounselor permission:', error)
	} finally {
		mongoose.connection.close()
	}
}

// Connect to MongoDB and run
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mypeegu', {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
addSSECounselorPermission()