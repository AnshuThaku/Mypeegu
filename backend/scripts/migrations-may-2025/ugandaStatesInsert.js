const mongoose = require('mongoose')
const { States } = require('../../models/database/states')

// ✅ Local MongoDB URI
const MONGODB_URI = 'mongodb://localhost:27017/mypeegu'

// ✅ Uganda country ID
const UGANDA_ID = '683535fbcba5a9e492315ca8'

const ugandaStates = [
	{ name: 'Central Region', capital: 'Kampala' },
	{ name: 'Eastern Region', capital: 'Mbale' },
	{ name: 'Northern Region', capital: 'Gulu' },
	{ name: 'Western Region', capital: 'Mbarara' },
]

async function runMigration() {
	try {
		console.log('Uganda Migration started...')
		await mongoose.connect(MONGODB_URI)
		console.log('Connected to MongoDB ✅')

		// 🔥 Safe rerun (delete old Uganda states)
		await States.deleteMany({
			country: new mongoose.Types.ObjectId(UGANDA_ID),
		})

		console.log('Old Uganda states removed (if any)')

		// ✅ Insert new states
		const promises = ugandaStates.map((state) =>
			States.create({
				name: state.name,
				country: new mongoose.Types.ObjectId(UGANDA_ID),
			}),
		)

		await Promise.all(promises)

		console.log('Uganda states inserted successfully 🎉')

		await mongoose.disconnect()
		process.exit(0)
	} catch (err) {
		console.error('Migration failed ❌', err)
		process.exit(1)
	}
}

runMigration()