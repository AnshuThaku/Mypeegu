const mongoose = require('mongoose')
const {
  MyPeeguPermissions,
  MyPeeguPermissionOps,
} = require('../models/database/myPeegu-staticConfigs')

async function ensureSSEInAllowedPermissions() {
  try {
    const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mypeegu'
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    let ssePerm = await MyPeeguPermissions.findOne({ name: 'SSECounselor' })
    if (!ssePerm) {
      ssePerm = await MyPeeguPermissions.create({ name: 'SSECounselor' })
      console.log('Created MyPeeguPermissions: SSECounselor')
    } else {
      console.log('Found MyPeeguPermissions: SSECounselor')
    }

    // Roles that should be able to create/manage SSE Counselor users
    const managerRoles = ['SuperAdmin', 'Admin']
    const rolePerms = await MyPeeguPermissions.find({ name: { $in: managerRoles } })
    const rolePermMap = new Map(rolePerms.map((p) => [p.name, p]))

    for (const role of managerRoles) {
      const permDoc = rolePermMap.get(role)
      if (!permDoc) {
        console.warn(`Warning: Permission doc for ${role} not found. Skipping.`)
        continue
      }
      let permOps = await MyPeeguPermissionOps.findOne({ permission: permDoc._id })
      if (!permOps) {
        // If permission ops missing, create a minimal one
        permOps = new MyPeeguPermissionOps({
          permission: permDoc._id,
          userOperationPermissions: [],
          appFeatures: [],
        })
      }
      const hasSSE = permOps.userOperationPermissions.some(
        (id) => String(id) === String(ssePerm._id),
      )
      if (!hasSSE) {
        permOps.userOperationPermissions.push(ssePerm._id)
        await permOps.save()
        console.log(`Updated ${role} userOperationPermissions to include SSECounselor`)
      } else {
        console.log(`${role} already allows SSECounselor in userOperationPermissions`)
      }
    }

    console.log('SSECounselor allowedPermissions update complete')
  } catch (err) {
    console.error('Failed to update permission ops for SSECounselor:', err)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

ensureSSEInAllowedPermissions()

