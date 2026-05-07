// const { default: mongoose } = require('mongoose')
// const { BaselineRecord } = require('../../models/database/myPeegu-baseline')
// const { GlobalServices } = require('../global-service')
// const { Classrooms } = require('../../models/database/myPeegu-classroom')

// class BaselineHelperService extends GlobalServices {
// 	async getBaselineRecordsRankwise(baselineCategory, school, studentId, className, section) {
// 		if (school) {
// 			const filter = {}

// 			if (className) {
// 				filter['studentData.0.classRoom.className'] = className
// 			}

// 			if (section) {
// 				filter['studentData.0.classRoom.section'] = section
// 			}
// 			const schoolId = new mongoose.Types.ObjectId(school)
// 			const pipeline1 = [
// 				{
// 					$match: {
// 						school: schoolId,
// 						baselineCategory: baselineCategory,
// 					},
// 				},
// 				{
// 					$sort: {
// 						createdAt: -1,
// 					},
// 				},
// 				{
// 					$lookup: {
// 						from: 'students',
// 						localField: 'studentId',
// 						foreignField: '_id',
// 						as: 'studentData',
// 					},
// 				},
// 				{
// 					$lookup: {
// 						from: 'classrooms',
// 						localField: 'classRoomId',
// 						foreignField: '_id',
// 						as: 'classRoom',
// 					},
// 				},
// 				{
// 					$unwind: '$classRoom',
// 				},
// 			]

// 			if (
// 				filter['studentData.classRoom.className'] ||
// 				filter['studentData.classRoom.section']
// 			) {
// 				pipeline1.push({ $match: { ...filter } })
// 			}

// 			const pipeline2 = [
// 				{
// 					$addFields: {
// 						PPercentage: {
// 							$round: [
// 								{
// 									$multiply: [
// 										{ $divide: [{ $toInt: '$Physical.total' }, 7] },
// 										100,
// 									],
// 								},
// 								2,
// 							],
// 						},
// 						SPercentage: {
// 							$round: [
// 								{ $multiply: [{ $divide: [{ $toInt: '$Social.total' }, 7] }, 100] },
// 								2,
// 							],
// 						},
// 						EPercentage: {
// 							$round: [
// 								{
// 									$multiply: [
// 										{ $divide: [{ $toInt: '$Emotional.total' }, 7] },
// 										100,
// 									],
// 								},
// 								2,
// 							],
// 						},
// 						CPercentage: {
// 							$round: [
// 								{
// 									$multiply: [
// 										{ $divide: [{ $toInt: '$Cognitive.total' }, 7] },
// 										100,
// 									],
// 								},
// 								2,
// 							],
// 						},
// 						LPercentage: {
// 							$round: [
// 								{
// 									$multiply: [
// 										{ $divide: [{ $toInt: '$Language.total' }, 7] },
// 										100,
// 									],
// 								},
// 								2,
// 							],
// 						},
// 						Total: {
// 							$round: [
// 								{
// 									$multiply: [
// 										{
// 											$divide: [
// 												{
// 													$add: [
// 														{ $toInt: '$Physical.total' },
// 														{ $toInt: '$Social.total' },
// 														{ $toInt: '$Emotional.total' },
// 														{ $toInt: '$Cognitive.total' },
// 														{ $toInt: '$Language.total' },
// 													],
// 												},
// 												35,
// 											],
// 										},
// 										100,
// 									],
// 								},
// 								2,
// 							],
// 						},
// 						StudentData: {
// 							className: {
// 								$arrayElemAt: ['$studentData.0.classRoom.className', 0],
// 							},
// 							section: {
// 								$arrayElemAt: ['$studentData.0.classRoom.section', 0],
// 							},
// 							_id: {
// 								$arrayElemAt: ['$studentData._id', 0],
// 							},
// 							studentName: { $arrayElemAt: ['$studentData.studentName', 0] },
// 						},
// 					},
// 				},
// 				{
// 					$project: {
// 						StudentData: 1,
// 						Physical: {
// 							data: '$Physical.data',
// 							score: '$Physical.total',
// 							percentage: '$PPercentage',
// 						},
// 						Social: {
// 							data: '$Social.data',
// 							score: '$Social.total',
// 							percentage: '$SPercentage',
// 						},
// 						Emotional: {
// 							data: '$Emotional.data',
// 							score: '$Emotional.total',
// 							percentage: '$EPercentage',
// 						},
// 						Cognitive: {
// 							data: '$Cognitive.data',
// 							score: '$Cognitive.total',
// 							percentage: '$CPercentage',
// 						},
// 						Language: {
// 							data: '$Language.data',
// 							score: '$Language.total',
// 							percentage: '$LPercentage',
// 						},
// 						Total: 1,
// 						_id: 0,
// 					},
// 				},

// 				{
// 					$group: {
// 						_id: '$StudentData._id',
// 						mostRecentRecord: { $first: '$$ROOT' },
// 					},
// 				},
// 				{
// 					$replaceRoot: { newRoot: '$mostRecentRecord' },
// 				},
// 				{
// 					$sort: {
// 						Total: -1,
// 					},
// 				},
// 			]

// 			const result = await BaselineRecord.aggregate([...pipeline1, ...pipeline2])
// 			console.log('result', result.length)
// 			const response = this.assignRanksSingleRecord(result)

// 			return {
// 				data:
// 					response.find(
// 						(st) => st?.StudentData?._id?.toString() === studentId?.toString(),
// 					) ?? [],
// 				totalStudents: result?.length,
// 			}
// 		} else {
// 			return []
// 		}
// 	}

// 	assignRanksSingleRecord(records) {
// 		const sortedArray = records.slice().sort((a, b) => b.Total - a.Total)
// 		let currentRank = 1
// 		let previousValue = sortedArray[0].Total

// 		const resultArray = sortedArray.map((obj, index) => {
// 			if (index > 0 && obj.Total < previousValue) {
// 				currentRank++
// 			}
// 			previousValue = obj.Total
// 			// Inject the 'Rank' key into the object
// 			obj.Rank = currentRank
// 			return obj
// 		})

// 		return resultArray
// 	}

// 	async AllSchoolsAggregationPipeline(query) {
// 		const aggregationPipeline = [
// 			{
// 				$match: {
// 					...query,
// 				},
// 			},
// 			{
// 				$lookup: {
// 					from: 'schools',

// 					localField: 'school',

// 					foreignField: '_id',

// 					as: 'schoolData',
// 				},
// 			},
// 			{
// 				$addFields: {
// 					schoolName: { $arrayElemAt: ['$schoolData.school', 0] },
// 					school: '$school',
// 					PTotal: '$Physical.total',
// 					STotal: '$Social.total',
// 					ETotal: '$Emotional.total',
// 					CTotal: '$Cognitive.total',
// 					LTotal: '$Language.total',
// 				},
// 			},

// 			{
// 				$project: {
// 					schoolName: 1,
// 					school: 1,
// 					PTotal: 1,
// 					STotal: 1,
// 					ETotal: 1,
// 					CTotal: 1,
// 					LTotal: 1,
// 				},
// 			},

// 			{
// 				$group: {
// 					_id: '$school',
// 					school: { $first: '$school' },
// 					schoolName: { $first: '$schoolName' },
// 					Physical: { $avg: { $divide: [{ $toInt: '$PTotal' }, 7] } },
// 					Cognitive: { $avg: { $divide: [{ $toInt: '$CTotal' }, 7] } },
// 					Emotional: { $avg: { $divide: [{ $toInt: '$ETotal' }, 7] } },
// 					Social: { $avg: { $divide: [{ $toInt: '$STotal' }, 7] } },
// 					Language: { $avg: { $divide: [{ $toInt: '$LTotal' }, 7] } },
// 				},
// 			},

// 			{
// 				$project: {
// 					school: 1,
// 					schoolName: 1,
// 					Physical: { $round: [{ $multiply: ['$Physical', 100] }, 2] },
// 					Cognitive: { $round: [{ $multiply: ['$Cognitive', 100] }, 2] },
// 					Emotional: { $round: [{ $multiply: ['$Emotional', 100] }, 2] },
// 					Social: { $round: [{ $multiply: ['$Social', 100] }, 2] },
// 					Language: { $round: [{ $multiply: ['$Language', 100] }, 2] },
// 					overallPercentageofSchools: {
// 						$round: [
// 							{
// 								$multiply: [
// 									{
// 										$avg: [
// 											'$Physical',
// 											'$Cognitive',
// 											'$Emotional',
// 											'$Social',
// 											'$Language',
// 										],
// 									},
// 									100,
// 								],
// 							},
// 							2,
// 						],
// 					},

// 					_id: 0,
// 				},
// 			},
// 		]
// 		return BaselineRecord.aggregate(aggregationPipeline)
// 	}

// 	async SpecificSchoolsAggregationPipeline(schoolId, academicYears) {
// 		const aggregationPipeline = [
// 			{
// 				$match: {
// 					school: schoolId,
// 					graduated: { $ne: true },
// 					exited: { $ne: true },
// 					academicYear: { $in: academicYears },
// 				},
// 			},
// 			{
// 				$addFields: {
// 					school: '$school',
// 					classRoomId: '$classRoomId',
// 					PTotal: '$Physical.total',
// 					STotal: '$Social.total',
// 					ETotal: '$Emotional.total',
// 					CTotal: '$Cognitive.total',
// 					LTotal: '$Language.total',
// 				},
// 			},
// 			{
// 				$project: {
// 					classRoomId: 1,
// 					school: 1,
// 					PTotal: 1,
// 					STotal: 1,
// 					ETotal: 1,
// 					CTotal: 1,
// 					LTotal: 1,
// 					_id: 0,
// 				},
// 			},
// 			{
// 				$lookup: {
// 					from: 'classrooms',
// 					localField: 'classRoomId',
// 					foreignField: '_id',
// 					as: 'classRoom',
// 				},
// 			},
// 			{
// 				$unwind: '$classRoom',
// 			},
// 			{
// 				$group: {
// 					_id: {
// 						className: '$classRoom.className',
// 						section: '$classRoom.section',
// 						classRoomId: '$classRoomId',
// 					},
// 					school: { $first: '$school' },
// 					Physical: { $avg: { $divide: [{ $toInt: '$PTotal' }, 7] } },
// 					Cognitive: { $avg: { $divide: [{ $toInt: '$CTotal' }, 7] } },
// 					Emotional: { $avg: { $divide: [{ $toInt: '$ETotal' }, 7] } },
// 					Social: { $avg: { $divide: [{ $toInt: '$STotal' }, 7] } },
// 					Language: { $avg: { $divide: [{ $toInt: '$LTotal' }, 7] } },
// 				},
// 			},
// 			{
// 				$project: {
// 					school: 1,
// 					className: '$_id.className',
// 					section: '$_id.section',
// 					classRoomId: '$_id.classRoomId',
// 					Physical: { $round: [{ $multiply: ['$Physical', 100] }, 2] },
// 					Cognitive: { $round: [{ $multiply: ['$Cognitive', 100] }, 2] },
// 					Emotional: { $round: [{ $multiply: ['$Emotional', 100] }, 2] },
// 					Social: { $round: [{ $multiply: ['$Social', 100] }, 2] },
// 					Language: { $round: [{ $multiply: ['$Language', 100] }, 2] },
// 					overallPercentageofClasses: {
// 						$round: [
// 							{
// 								$multiply: [
// 									{
// 										$avg: [
// 											'$Physical',
// 											'$Cognitive',
// 											'$Emotional',
// 											'$Social',
// 											'$Language',
// 										],
// 									},
// 									100,
// 								],
// 							},
// 							2,
// 						],
// 					},
// 					_id: 0,
// 				},
// 			},
// 			{
// 				$sort: {
// 					className: 1,
// 					section: 1,
// 				},
// 			},
// 		]
// 		return BaselineRecord.aggregate(aggregationPipeline)
// 	}

// 	async SpecificClassRoomPipeline(schoolId, academicYears) {
// 		const aggregationPipeline = [
// 			// Start from classrooms collection
// 			{
// 				$match: {
// 					school: schoolId,
// 					academicYear: {
// 						$in: academicYears.map((id) => new mongoose.Types.ObjectId(id)),
// 					},
// 				},
// 			},

// 			// Lookup baseline records for each classroom
// 			{
// 				$lookup: {
// 					from: 'baselinerecords', // adjust collection name as needed
// 					let: { classRoomId: '$_id' },
// 					pipeline: [
// 						{
// 							$match: {
// 								$expr: {
// 									$and: [
// 										{ $eq: ['$classRoomId', '$$classRoomId'] },
// 										{ $ne: ['$graduated', true] },
// 										{ $ne: ['$exited', true] },
// 									],
// 								},
// 							},
// 						},
// 						{
// 							$project: {
// 								PTotal: '$Physical.total',
// 								STotal: '$Social.total',
// 								ETotal: '$Emotional.total',
// 								CTotal: '$Cognitive.total',
// 								LTotal: '$Language.total',
// 							},
// 						},
// 					],
// 					as: 'baselineRecords',
// 				},
// 			},

// 			// Filter out classrooms with no baseline records (optional)
// 			{
// 				$match: {
// 					'baselineRecords.0': { $exists: true },
// 				},
// 			},

// 			// Unwind to calculate averages
// 			{
// 				$unwind: '$baselineRecords',
// 			},

// 			// Group by classroom and section to calculate averages
// 			{
// 				$group: {
// 					_id: {
// 						classRoomId: '$_id',
// 						section: '$section',
// 					},
// 					school: { $first: '$school' },
// 					className: { $first: '$className' },
// 					Physical: {
// 						$avg: {
// 							$divide: [{ $toInt: '$baselineRecords.PTotal' }, 7],
// 						},
// 					},
// 					Cognitive: {
// 						$avg: {
// 							$divide: [{ $toInt: '$baselineRecords.CTotal' }, 7],
// 						},
// 					},
// 					Emotional: {
// 						$avg: {
// 							$divide: [{ $toInt: '$baselineRecords.ETotal' }, 7],
// 						},
// 					},
// 					Social: {
// 						$avg: {
// 							$divide: [{ $toInt: '$baselineRecords.STotal' }, 7],
// 						},
// 					},
// 					Language: {
// 						$avg: {
// 							$divide: [{ $toInt: '$baselineRecords.LTotal' }, 7],
// 						},
// 					},
// 				},
// 			},

// 			// Final projection with percentages
// 			{
// 				$project: {
// 					school: 1,
// 					className: 1,
// 					section: '$_id.section',
// 					classRoomId: '$_id.classRoomId',
// 					Physical: { $round: [{ $multiply: ['$Physical', 100] }, 2] },
// 					Cognitive: { $round: [{ $multiply: ['$Cognitive', 100] }, 2] },
// 					Emotional: { $round: [{ $multiply: ['$Emotional', 100] }, 2] },
// 					Social: { $round: [{ $multiply: ['$Social', 100] }, 2] },
// 					Language: { $round: [{ $multiply: ['$Language', 100] }, 2] },
// 					overallPercentageofSection: {
// 						$round: [
// 							{
// 								$multiply: [
// 									{
// 										$avg: [
// 											'$Physical',
// 											'$Cognitive',
// 											'$Emotional',
// 											'$Social',
// 											'$Language',
// 										],
// 									},
// 									100,
// 								],
// 							},
// 							2,
// 						],
// 					},
// 					_id: 0,
// 				},
// 			},

// 			// Optional: Sort by className and section
// 			{
// 				$sort: {
// 					className: 1,
// 					section: 1,
// 				},
// 			},
// 		]

// 		return Classrooms.aggregate(aggregationPipeline) // Note: Changed to ClassRoom model
// 	}

// 	async groupedDataPipeLine(query) {
// 		const groupingPipeLine = [
// 			{
// 				$match: query,
// 			},
// 			{
// 				$addFields: {
// 					// Check if any d
// omain is red (0-3)
// 					hasRed: {
// 						$or: [
// 							{ $lte: [{ $toInt: '$Physical.total' }, 3] },
// 							{ $lte: [{ $toInt: '$Social.total' }, 3] },
// 							{ $lte: [{ $toInt: '$Emotional.total' }, 3] },
// 							{ $lte: [{ $toInt: '$Cognitive.total' }, 3] },
// 							{ $lte: [{ $toInt: '$Language.total' }, 3] },
// 						],
// 					},
// 					// Check if any domain is orange (4-5)
// 					hasOrange: {
// 						$or: [
// 							{
// 								$and: [
// 									{ $gte: [{ $toInt: '$Physical.total' }, 4] },
// 									{ $lte: [{ $toInt: '$Physical.total' }, 5] },
// 								],
// 							},
// 							{
// 								$and: [
// 									{ $gte: [{ $toInt: '$Social.total' }, 4] },
// 									{ $lte: [{ $toInt: '$Social.total' }, 5] },
// 								],
// 							},
// 							{
// 								$and: [
// 									{ $gte: [{ $toInt: '$Emotional.total' }, 4] },
// 									{ $lte: [{ $toInt: '$Emotional.total' }, 5] },
// 								],
// 							},
// 							{
// 								$and: [
// 									{ $gte: [{ $toInt: '$Cognitive.total' }, 4] },
// 									{ $lte: [{ $toInt: '$Cognitive.total' }, 5] },
// 								],
// 							},
// 							{
// 								$and: [
// 									{ $gte: [{ $toInt: '$Language.total' }, 4] },
// 									{ $lte: [{ $toInt: '$Language.total' }, 5] },
// 								],
// 							},
// 						],
// 					},
// 				},
// 			},
// 			{
// 				$addFields: {
// 					// ROG classification: Red if hasRed, Orange if hasOrange but not hasRed, Green otherwise
// 					rogCategory: {
// 						$cond: {
// 							if: '$hasRed',
// 							then: 'red',
// 							else: {
// 								$cond: {
// 									if: '$hasOrange',
// 									then: 'orange',
// 									else: 'green',
// 								},
// 							},
// 						},
// 					},
// 				},
// 			},
// 			// Deduplicate by studentId - keep first record per student to count unique students
// 			{
// 				$group: {
// 					_id: '$studentId',
// 					rogCategory: { $first: '$rogCategory' },
// 					Physical: { $first: '$Physical' },
// 					Social: { $first: '$Social' },
// 					Emotional: { $first: '$Emotional' },
// 					Cognitive: { $first: '$Cognitive' },
// 					Language: { $first: '$Language' },
// 				},
// 			},
// 			{
// 				$group: {
// 					_id: null,
// 					studentCount: { $sum: 1 },
// 					// ROG counts
// 					rogRed: { $sum: { $cond: [{ $eq: ['$rogCategory', 'red'] }, 1, 0] } },
// 					rogOrange: { $sum: { $cond: [{ $eq: ['$rogCategory', 'orange'] }, 1, 0] } },
// 					rogGreen: { $sum: { $cond: [{ $eq: ['$rogCategory', 'green'] }, 1, 0] } },
// 					Physical_0_3: {
// 						$sum: { $cond: [{ $lte: [{ $toInt: '$Physical.total' }, 3] }, 1, 0] },
// 					},
// 					Physical_4_5: {
// 						$sum: {
// 							$cond: [
// 								{
// 									$and: [
// 										{ $gte: [{ $toInt: '$Physical.total' }, 4] },
// 										{ $lte: [{ $toInt: '$Physical.total' }, 5] },
// 									],
// 								},
// 								1,
// 								0,
// 							],
// 						},
// 					},
// 					Physical_6_7: {
// 						$sum: { $cond: [{ $gte: [{ $toInt: '$Physical.total' }, 6] }, 1, 0] },
// 					},
// 					Social_0_3: {
// 						$sum: { $cond: [{ $lte: [{ $toInt: '$Social.total' }, 3] }, 1, 0] },
// 					},
// 					Social_4_5: {
// 						$sum: {
// 							$cond: [
// 								{
// 									$and: [
// 										{ $gte: [{ $toInt: '$Social.total' }, 4] },
// 										{ $lte: [{ $toInt: '$Social.total' }, 5] },
// 									],
// 								},
// 								1,
// 								0,
// 							],
// 						},
// 					},
// 					Social_6_7: {
// 						$sum: { $cond: [{ $gte: [{ $toInt: '$Social.total' }, 6] }, 1, 0] },
// 					},
// 					Emotional_0_3: {
// 						$sum: { $cond: [{ $lte: [{ $toInt: '$Emotional.total' }, 3] }, 1, 0] },
// 					},
// 					Emotional_4_5: {
// 						$sum: {
// 							$cond: [
// 								{
// 									$and: [
// 										{ $gte: [{ $toInt: '$Emotional.total' }, 4] },
// 										{ $lte: [{ $toInt: '$Emotional.total' }, 5] },
// 									],
// 								},
// 								1,
// 								0,
// 							],
// 						},
// 					},
// 					Emotional_6_7: {
// 						$sum: { $cond: [{ $gte: [{ $toInt: '$Emotional.total' }, 6] }, 1, 0] },
// 					},
// 					Cognitive_0_3: {
// 						$sum: { $cond: [{ $lte: [{ $toInt: '$Cognitive.total' }, 3] }, 1, 0] },
// 					},
// 					Cognitive_4_5: {
// 						$sum: {
// 							$cond: [
// 								{
// 									$and: [
// 										{ $gte: [{ $toInt: '$Cognitive.total' }, 4] },
// 										{ $lte: [{ $toInt: '$Cognitive.total' }, 5] },
// 									],
// 								},
// 								1,
// 								0,
// 							],
// 						},
// 					},
// 					Cognitive_6_7: {
// 						$sum: { $cond: [{ $gte: [{ $toInt: '$Cognitive.total' }, 6] }, 1, 0] },
// 					},
// 					Language_0_3: {
// 						$sum: { $cond: [{ $lte: [{ $toInt: '$Language.total' }, 3] }, 1, 0] },
// 					},
// 					Language_4_5: {
// 						$sum: {
// 							$cond: [
// 								{
// 									$and: [
// 										{ $gte: [{ $toInt: '$Language.total' }, 4] },
// 										{ $lte: [{ $toInt: '$Language.total' }, 5] },
// 									],
// 								},
// 								1,
// 								0,
// 							],
// 						},
// 					},
// 					Language_6_7: {
// 						$sum: { $cond: [{ $gte: [{ $toInt: '$Language.total' }, 6] }, 1, 0] },
// 					},

// 					PhysicalTotal: { $sum: { $toInt: '$Physical.total' } },
// 					SocialTotal: { $sum: { $toInt: '$Social.total' } },
// 					EmotionalTotal: { $sum: { $toInt: '$Emotional.total' } },
// 					CognitiveTotal: { $sum: { $toInt: '$Cognitive.total' } },
// 					LanguageTotal: { $sum: { $toInt: '$Language.total' } },
// 				},
// 			},
// 			// Project to reshape the output as desired
// 			{
// 				$project: {
// 					_id: 0,
// 					studentsScreened: '$studentCount',
// 					rogBreakup: {
// 						red: '$rogRed',
// 						orange: '$rogOrange',
// 						green: '$rogGreen',
// 					},
// 					data: {
// 						Physical: {
// 							'0-3': '$Physical_0_3',
// 							'4-5': '$Physical_4_5',
// 							'6-7': '$Physical_6_7',
// 							percentage: {
// 								$round: [
// 									{
// 										$multiply: [
// 											{
// 												$divide: [
// 													'$PhysicalTotal',
// 													{ $multiply: ['$studentCount', 7] },
// 												],
// 											},
// 											100,
// 										],
// 									},
// 									2,
// 								],
// 							},
// 						},
// 						Social: {
// 							'0-3': '$Social_0_3',
// 							'4-5': '$Social_4_5',
// 							'6-7': '$Social_6_7',
// 							percentage: {
// 								$round: [
// 									{
// 										$multiply: [
// 											{
// 												$divide: [
// 													'$SocialTotal',
// 													{ $multiply: ['$studentCount', 7] },
// 												],
// 											},
// 											100,
// 										],
// 									},
// 									2,
// 								],
// 							},
// 						},
// 						Emotional: {
// 							'0-3': '$Emotional_0_3',
// 							'4-5': '$Emotional_4_5',
// 							'6-7': '$Emotional_6_7',
// 							percentage: {
// 								$round: [
// 									{
// 										$multiply: [
// 											{
// 												$divide: [
// 													'$EmotionalTotal',
// 													{ $multiply: ['$studentCount', 7] },
// 												],
// 											},
// 											100,
// 										],
// 									},
// 									2,
// 								],
// 							},
// 						},
// 						Cognitive: {
// 							'0-3': '$Cognitive_0_3',
// 							'4-5': '$Cognitive_4_5',
// 							'6-7': '$Cognitive_6_7',
// 							percentage: {
// 								$round: [
// 									{
// 										$multiply: [
// 											{
// 												$divide: [
// 													'$CognitiveTotal',
// 													{ $multiply: ['$studentCount', 7] },
// 												],
// 											},
// 											100,
// 										],
// 									},
// 									2,
// 								],
// 							},
// 						},
// 						Language: {
// 							'0-3': '$Language_0_3',
// 							'4-5': '$Language_4_5',
// 							'6-7': '$Language_6_7',
// 							percentage: {
// 								$round: [
// 									{
// 										$multiply: [
// 											{
// 												$divide: [
// 													'$LanguageTotal',
// 													{ $multiply: ['$studentCount', 7] },
// 												],
// 											},
// 											100,
// 										],
// 									},
// 									2,
// 								],
// 							},
// 						},
// 					},
// 				},
// 			},
// 		]

// 		const groupedData = await BaselineRecord.aggregate(groupingPipeLine)

// 		return groupedData[0] // Return the first element because we know there's only one group (_id: null)
// 	}

// 	assignRanks(dataArray, field) {
// 		const sortedArray = dataArray.slice().sort((a, b) => b[field] - a[field])

// 		// Reuse the addRanking function to rank each record based on the specified field
// 		const rankedData = this.addRanking(sortedArray, field)

// 		// Construct the percentages object for each record
// 		const transformedData = rankedData.map((record) => {
// 			const percentages = {}
// 			const percentageFields = ['Physical', 'Social', 'Emotional', 'Cognitive', 'Language']
// 			// Calculate rank for each percentage field
// 			percentageFields.forEach((percentageField) => {
// 				const sortedPercentageArray = sortedArray
// 					.slice()
// 					.sort((a, b) => b[percentageField] - a[percentageField])
// 				const percentageRank =
// 					sortedPercentageArray.findIndex(
// 						(item) => item[percentageField] === record[percentageField],
// 					) + 1

// 				percentages[percentageField] = {
// 					percentage: record[percentageField],
// 					rank: record[percentageField] !== 0 ? percentageRank : 0, // If percentage is 0, set rank to 0
// 				}
// 			})

// 			return {
// 				schoolName: record.schoolName,
// 				schoolId: record.school,
// 				rank: record.rank,
// 				overallPercentageofSchools: record.overallPercentageofSchools,
// 				overallPercentageofClasses: record.overallPercentageofClasses,
// 				className: record.className,
// 				section: record?.section,
// 				overallPercentageofSection: record.overallPercentageofSection,
// 				classRoomId: record.classRoomId,
// 				percentages: { ...percentages },
// 			}
// 		})

// 		return transformedData
// 	}

// 	addRanking(sortedArray, field) {
// 		let currentRank = 1
// 		let previousScore = null

// 		sortedArray.forEach((entry, index) => {
// 			if (entry[field] !== previousScore) {
// 				// currentRank = index + 1;
// 				currentRank = entry[field] === 0 ? 0 : index + 1
// 			}
// 			entry.rank = currentRank
// 			previousScore = entry[field]
// 		})

// 		return sortedArray
// 	}
// }

// module.exports.BaselineHelperService = BaselineHelperService


const { default: mongoose } = require('mongoose')
const { BaselineRecord } = require('../../models/database/myPeegu-baseline')
const { GlobalServices } = require('../global-service')
const { Classrooms } = require('../../models/database/myPeegu-classroom')

class BaselineHelperService extends GlobalServices {
    async getBaselineRecordsRankwise(baselineCategory, school, studentId, className, section) {
        if (school) {
            const filter = {}

            if (className) {
                filter['studentData.0.classRoom.className'] = className
            }

            if (section) {
                filter['studentData.0.classRoom.section'] = section
            }
            const schoolId = new mongoose.Types.ObjectId(school)
            const pipeline1 = [
                {
                    $match: {
                        school: schoolId,
                        baselineCategory: baselineCategory,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $lookup: {
                        from: 'students',
                        localField: 'studentId',
                        foreignField: '_id',
                        as: 'studentData',
                    },
                },
                {
                    $lookup: {
                        from: 'classrooms',
                        localField: 'classRoomId',
                        foreignField: '_id',
                        as: 'classRoom',
                    },
                },
                {
                    $unwind: '$classRoom',
                },
            ]

            if (
                filter['studentData.classRoom.className'] ||
                filter['studentData.classRoom.section']
            ) {
                pipeline1.push({ $match: { ...filter } })
            }

            const pipeline2 = [
                {
                    $addFields: {
                        PPercentage: {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: [{ $toInt: '$Physical.total' }, 7] },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        SPercentage: {
                            $round: [
                                { $multiply: [{ $divide: [{ $toInt: '$Social.total' }, 7] }, 100] },
                                2,
                            ],
                        },
                        EPercentage: {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: [{ $toInt: '$Emotional.total' }, 7] },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        CPercentage: {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: [{ $toInt: '$Cognitive.total' }, 7] },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        LPercentage: {
                            $round: [
                                {
                                    $multiply: [
                                        { $divide: [{ $toInt: '$Language.total' }, 7] },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        Total: {
                            $round: [
                                {
                                    $multiply: [
                                        {
                                            $divide: [
                                                {
                                                    $add: [
                                                        { $toInt: '$Physical.total' },
                                                        { $toInt: '$Social.total' },
                                                        { $toInt: '$Emotional.total' },
                                                        { $toInt: '$Cognitive.total' },
                                                        { $toInt: '$Language.total' },
                                                    ],
                                                },
                                                35,
                                            ],
                                        },
                                        100,
                                    ],
                                },
                                2,
                            ],
                        },
                        StudentData: {
                            className: {
                                $arrayElemAt: ['$studentData.0.classRoom.className', 0],
                            },
                            section: {
                                $arrayElemAt: ['$studentData.0.classRoom.section', 0],
                            },
                            _id: {
                                $arrayElemAt: ['$studentData._id', 0],
                            },
                            studentName: { $arrayElemAt: ['$studentData.studentName', 0] },
                        },
                    },
                },
                {
                    $project: {
                        StudentData: 1,
                        Physical: {
                            data: '$Physical.data',
                            score: '$Physical.total',
                            percentage: '$PPercentage',
                        },
                        Social: {
                            data: '$Social.data',
                            score: '$Social.total',
                            percentage: '$SPercentage',
                        },
                        Emotional: {
                            data: '$Emotional.data',
                            score: '$Emotional.total',
                            percentage: '$EPercentage',
                        },
                        Cognitive: {
                            data: '$Cognitive.data',
                            score: '$Cognitive.total',
                            percentage: '$CPercentage',
                        },
                        Language: {
                            data: '$Language.data',
                            score: '$Language.total',
                            percentage: '$LPercentage',
                        },
                        Total: 1,
                        _id: 0,
                    },
                },

                {
                    $group: {
                        _id: '$StudentData._id',
                        mostRecentRecord: { $first: '$$ROOT' },
                    },
                },
                {
                    $replaceRoot: { newRoot: '$mostRecentRecord' },
                },
                {
                    $sort: {
                        Total: -1,
                    },
                },
            ]

            const result = await BaselineRecord.aggregate([...pipeline1, ...pipeline2])
            console.log('result', result.length)
            const response = this.assignRanksSingleRecord(result)

            return {
                data:
                    response.find(
                        (st) => st?.StudentData?._id?.toString() === studentId?.toString(),
                    ) ?? [],
                totalStudents: result?.length,
            }
        } else {
            return []
        }
    }

    assignRanksSingleRecord(records) {
        const sortedArray = records.slice().sort((a, b) => b.Total - a.Total)
        let currentRank = 1
        let previousValue = sortedArray[0].Total

        const resultArray = sortedArray.map((obj, index) => {
            if (index > 0 && obj.Total < previousValue) {
                currentRank++
            }
            previousValue = obj.Total
            // Inject the 'Rank' key into the object
            obj.Rank = currentRank
            return obj
        })

        return resultArray
    }

async AllSchoolsAggregationPipeline(query) {
        const aggregationPipeline = [
            { $match: { ...query } },
            {
                $lookup: {
                    from: 'schools',
                    localField: 'school',
                    foreignField: '_id',
                    as: 'schoolData',
                },
            },
            {
                $addFields: {
                    schoolName: { $arrayElemAt: ['$schoolData.school', 0] },
                    school: '$school',
                    PTotal: '$Physical.total',
                    STotal: '$Social.total',
                    ETotal: '$Emotional.total',
                    CTotal: '$Cognitive.total',
                    LTotal: '$Language.total',
                },
            },
            {
                $project: {
                    schoolName: 1, school: 1, PTotal: 1, STotal: 1, ETotal: 1, CTotal: 1, LTotal: 1,
                },
            },
            {
                $group: {
                    _id: '$school',
                    school: { $first: '$school' },
                    schoolName: { $first: '$schoolName' },
                    Physical: { $avg: { $divide: [{ $toInt: '$PTotal' }, 7] } },
                    Cognitive: { $avg: { $divide: [{ $toInt: '$CTotal' }, 7] } },
                    Emotional: { $avg: { $divide: [{ $toInt: '$ETotal' }, 7] } },
                    Social: { $avg: { $divide: [{ $toInt: '$STotal' }, 7] } },
                    Language: { $avg: { $divide: [{ $toInt: '$LTotal' }, 7] } },
                },
            },
            {
                $project: {
                    school: 1,
                    schoolName: 1,
                    // 🟢 FIX: Cap max value to 100
                    Physical: { $min: [100, { $round: [{ $multiply: ['$Physical', 100] }, 2] }] },
                    Cognitive: { $min: [100, { $round: [{ $multiply: ['$Cognitive', 100] }, 2] }] },
                    Emotional: { $min: [100, { $round: [{ $multiply: ['$Emotional', 100] }, 2] }] },
                    Social: { $min: [100, { $round: [{ $multiply: ['$Social', 100] }, 2] }] },
                    Language: { $min: [100, { $round: [{ $multiply: ['$Language', 100] }, 2] }] },
                    overallPercentageofSchools: {
                        $min: [100, {
                            $round: [
                                {
                                    $multiply: [
                                        { $avg: ['$Physical', '$Cognitive', '$Emotional', '$Social', '$Language'] },
                                        100,
                                    ],
                                },
                                2,
                            ]
                        }]
                    },
                    _id: 0,
                },
            },
        ]
        return BaselineRecord.aggregate(aggregationPipeline)
    }
    async SpecificSchoolsAggregationPipeline(schoolId, academicYears) {
        const aggregationPipeline = [
            {
                $match: {
                    school: schoolId,
                    graduated: { $ne: true },
                    exited: { $ne: true },
                    academicYear: { $in: academicYears },
                },
            },
            {
                $addFields: {
                    school: '$school', classRoomId: '$classRoomId',
                    PTotal: '$Physical.total', STotal: '$Social.total', ETotal: '$Emotional.total', CTotal: '$Cognitive.total', LTotal: '$Language.total',
                },
            },
            {
                $project: {
                    classRoomId: 1, school: 1, PTotal: 1, STotal: 1, ETotal: 1, CTotal: 1, LTotal: 1, _id: 0,
                },
            },
            {
                $lookup: {
                    from: 'classrooms', localField: 'classRoomId', foreignField: '_id', as: 'classRoom',
                },
            },
            { $unwind: '$classRoom' },
            {
                $group: {
                    _id: { className: '$classRoom.className', section: '$classRoom.section', classRoomId: '$classRoomId' },
                    school: { $first: '$school' },
                    Physical: { $avg: { $divide: [{ $toInt: '$PTotal' }, 7] } },
                    Cognitive: { $avg: { $divide: [{ $toInt: '$CTotal' }, 7] } },
                    Emotional: { $avg: { $divide: [{ $toInt: '$ETotal' }, 7] } },
                    Social: { $avg: { $divide: [{ $toInt: '$STotal' }, 7] } },
                    Language: { $avg: { $divide: [{ $toInt: '$LTotal' }, 7] } },
                },
            },
            {
                $project: {
                    school: 1, className: '$_id.className', section: '$_id.section', classRoomId: '$_id.classRoomId',
                    // 🟢 FIX: Cap max value to 100
                    Physical: { $min: [100, { $round: [{ $multiply: ['$Physical', 100] }, 2] }] },
                    Cognitive: { $min: [100, { $round: [{ $multiply: ['$Cognitive', 100] }, 2] }] },
                    Emotional: { $min: [100, { $round: [{ $multiply: ['$Emotional', 100] }, 2] }] },
                    Social: { $min: [100, { $round: [{ $multiply: ['$Social', 100] }, 2] }] },
                    Language: { $min: [100, { $round: [{ $multiply: ['$Language', 100] }, 2] }] },
                    overallPercentageofClasses: {
                        $min: [100, {
                            $round: [
                                {
                                    $multiply: [
                                        { $avg: ['$Physical', '$Cognitive', '$Emotional', '$Social', '$Language'] },
                                        100,
                                    ],
                                },
                                2,
                            ]
                        }]
                    },
                    _id: 0,
                },
            },
            { $sort: { className: 1, section: 1 } },
        ]
        return BaselineRecord.aggregate(aggregationPipeline)
    }

   async SpecificClassRoomPipeline(schoolId, academicYears) {
        const aggregationPipeline = [
            {
                $match: {
                    school: schoolId,
                    academicYear: { $in: academicYears.map((id) => new mongoose.Types.ObjectId(id)) },
                },
            },
            {
                $lookup: {
                    from: 'baselinerecords',
                    let: { classRoomId: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$classRoomId', '$$classRoomId'] },
                                        { $ne: ['$graduated', true] },
                                        { $ne: ['$exited', true] },
                                    ],
                                },
                            },
                        },
                        {
                            $project: {
                                PTotal: '$Physical.total', STotal: '$Social.total', ETotal: '$Emotional.total', CTotal: '$Cognitive.total', LTotal: '$Language.total',
                            },
                        },
                    ],
                    as: 'baselineRecords',
                },
            },
            { $match: { 'baselineRecords.0': { $exists: true } } },
            { $unwind: '$baselineRecords' },
            {
                $group: {
                    _id: { classRoomId: '$_id', section: '$section' },
                    school: { $first: '$school' },
                    className: { $first: '$className' },
                    Physical: { $avg: { $divide: [{ $toInt: '$baselineRecords.PTotal' }, 7] } },
                    Cognitive: { $avg: { $divide: [{ $toInt: '$baselineRecords.CTotal' }, 7] } },
                    Emotional: { $avg: { $divide: [{ $toInt: '$baselineRecords.ETotal' }, 7] } },
                    Social: { $avg: { $divide: [{ $toInt: '$baselineRecords.STotal' }, 7] } },
                    Language: { $avg: { $divide: [{ $toInt: '$baselineRecords.LTotal' }, 7] } },
                },
            },
            {
                $project: {
                    school: 1, className: 1, section: '$_id.section', classRoomId: '$_id.classRoomId',
                    // 🟢 FIX: Cap max value to 100
                    Physical: { $min: [100, { $round: [{ $multiply: ['$Physical', 100] }, 2] }] },
                    Cognitive: { $min: [100, { $round: [{ $multiply: ['$Cognitive', 100] }, 2] }] },
                    Emotional: { $min: [100, { $round: [{ $multiply: ['$Emotional', 100] }, 2] }] },
                    Social: { $min: [100, { $round: [{ $multiply: ['$Social', 100] }, 2] }] },
                    Language: { $min: [100, { $round: [{ $multiply: ['$Language', 100] }, 2] }] },
                    overallPercentageofSection: {
                        $min: [100, {
                            $round: [
                                {
                                    $multiply: [
                                        { $avg: ['$Physical', '$Cognitive', '$Emotional', '$Social', '$Language'] },
                                        100,
                                    ],
                                },
                                2,
                            ]
                        }]
                    },
                    _id: 0,
                },
            },
            { $sort: { className: 1, section: 1 } },
        ]
        return Classrooms.aggregate(aggregationPipeline) 
    }

   async groupedDataPipeLine(query) {
        const groupingPipeLine = [
            {
                $match: query,
            },
            // Deduplicate by studentId - keeping the most recent baseline record
            { 
                $sort: { createdAt: -1 } 
            },
            { 
                $group: { _id: '$studentId', doc: { $first: '$$ROOT' } } 
            },
            { 
                $replaceRoot: { newRoot: '$doc' } 
            },
            {
                $group: {
                    _id: null,
                    studentCount: { $sum: 1 },
                    // Domain Totals (Sum) for Percentage Calculation
                    totalPhysical: { $sum: { $toDouble: { $ifNull: ['$Physical.total', 0] } } },
                    totalSocial: { $sum: { $toDouble: { $ifNull: ['$Social.total', 0] } } },
                    totalEmotional: { $sum: { $toDouble: { $ifNull: ['$Emotional.total', 0] } } },
                    totalCognitive: { $sum: { $toDouble: { $ifNull: ['$Cognitive.total', 0] } } },
                    totalLanguage: { $sum: { $toDouble: { $ifNull: ['$Language.total', 0] } } },
                    
                    // 🟢 FIX 1: Tiers ke basis par Red/Orange/Green Count (Pie Chart aur KPI ke liye)
                    rogRed: {
                        $sum: { $cond: [{ $regexMatch: { input: { $ifNull: ["$overallTier", ""] }, regex: /Tier 3/i } }, 1, 0] }
                    },
                    rogOrange: {
                        $sum: { $cond: [{ $regexMatch: { input: { $ifNull: ["$overallTier", ""] }, regex: /Tier 2/i } }, 1, 0] }
                    },
                    rogGreen: {
                        $sum: { $cond: [{ $regexMatch: { input: { $ifNull: ["$overallTier", ""] }, regex: /Tier 1/i } }, 1, 0] }
                    },

                    // Stacked Bar Chart Categories (0-3, 4-5, 6-7) -> Ab inhe Tier equivalent logic pe map karte hain
                    Physical_0_3: { $sum: { $cond: [{ $lte: [{ $toInt: '$Physical.total' }, 3] }, 1, 0] } },
                    Physical_4_5: { $sum: { $cond: [{ $and: [{ $gte: [{ $toInt: '$Physical.total' }, 4] }, { $lte: [{ $toInt: '$Physical.total' }, 5] }] }, 1, 0] } },
                    Physical_6_7: { $sum: { $cond: [{ $gte: [{ $toInt: '$Physical.total' }, 6] }, 1, 0] } },

                    Social_0_3: { $sum: { $cond: [{ $lte: [{ $toInt: '$Social.total' }, 3] }, 1, 0] } },
                    Social_4_5: { $sum: { $cond: [{ $and: [{ $gte: [{ $toInt: '$Social.total' }, 4] }, { $lte: [{ $toInt: '$Social.total' }, 5] }] }, 1, 0] } },
                    Social_6_7: { $sum: { $cond: [{ $gte: [{ $toInt: '$Social.total' }, 6] }, 1, 0] } },

                    Emotional_0_3: { $sum: { $cond: [{ $lte: [{ $toInt: '$Emotional.total' }, 3] }, 1, 0] } },
                    Emotional_4_5: { $sum: { $cond: [{ $and: [{ $gte: [{ $toInt: '$Emotional.total' }, 4] }, { $lte: [{ $toInt: '$Emotional.total' }, 5] }] }, 1, 0] } },
                    Emotional_6_7: { $sum: { $cond: [{ $gte: [{ $toInt: '$Emotional.total' }, 6] }, 1, 0] } },

                    Cognitive_0_3: { $sum: { $cond: [{ $lte: [{ $toInt: '$Cognitive.total' }, 3] }, 1, 0] } },
                    Cognitive_4_5: { $sum: { $cond: [{ $and: [{ $gte: [{ $toInt: '$Cognitive.total' }, 4] }, { $lte: [{ $toInt: '$Cognitive.total' }, 5] }] }, 1, 0] } },
                    Cognitive_6_7: { $sum: { $cond: [{ $gte: [{ $toInt: '$Cognitive.total' }, 6] }, 1, 0] } },

                    Language_0_3: { $sum: { $cond: [{ $lte: [{ $toInt: '$Language.total' }, 3] }, 1, 0] } },
                    Language_4_5: { $sum: { $cond: [{ $and: [{ $gte: [{ $toInt: '$Language.total' }, 4] }, { $lte: [{ $toInt: '$Language.total' }, 5] }] }, 1, 0] } },
                    Language_6_7: { $sum: { $cond: [{ $gte: [{ $toInt: '$Language.total' }, 6] }, 1, 0] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    studentsScreened: '$studentCount',
                    rogBreakup: {
                        red: '$rogRed',
                        orange: '$rogOrange',
                        green: '$rogGreen',
                    },
                    data: {
                        // 🟢 FIX 2: CAPPING PERCENTAGES TO 100% MAXIMUM
                        Physical: {
                            '0-3': '$Physical_0_3', '4-5': '$Physical_4_5', '6-7': '$Physical_6_7',
                            percentage: { $min: [100, { $cond: [{ $eq: ['$studentCount', 0] }, 0, { $round: [{ $multiply: [{ $divide: ['$totalPhysical', { $multiply: ['$studentCount', 7] }] }, 100] }, 2] }] }] }
                        },
                        Social: {
                            '0-3': '$Social_0_3', '4-5': '$Social_4_5', '6-7': '$Social_6_7',
                            percentage: { $min: [100, { $cond: [{ $eq: ['$studentCount', 0] }, 0, { $round: [{ $multiply: [{ $divide: ['$totalSocial', { $multiply: ['$studentCount', 7] }] }, 100] }, 2] }] }] }
                        },
                        Emotional: {
                            '0-3': '$Emotional_0_3', '4-5': '$Emotional_4_5', '6-7': '$Emotional_6_7',
                            percentage: { $min: [100, { $cond: [{ $eq: ['$studentCount', 0] }, 0, { $round: [{ $multiply: [{ $divide: ['$totalEmotional', { $multiply: ['$studentCount', 7] }] }, 100] }, 2] }] }] }
                        },
                        Cognitive: {
                            '0-3': '$Cognitive_0_3', '4-5': '$Cognitive_4_5', '6-7': '$Cognitive_6_7',
                            percentage: { $min: [100, { $cond: [{ $eq: ['$studentCount', 0] }, 0, { $round: [{ $multiply: [{ $divide: ['$totalCognitive', { $multiply: ['$studentCount', 7] }] }, 100] }, 2] }] }] }
                        },
                        Language: {
                            '0-3': '$Language_0_3', '4-5': '$Language_4_5', '6-7': '$Language_6_7',
                            percentage: { $min: [100, { $cond: [{ $eq: ['$studentCount', 0] }, 0, { $round: [{ $multiply: [{ $divide: ['$totalLanguage', { $multiply: ['$studentCount', 7] }] }, 100] }, 2] }] }] }
                        },
                    },
                },
            },
        ]

        const groupedData = await BaselineRecord.aggregate(groupingPipeLine)

        return groupedData.length > 0 ? groupedData[0] : { studentsScreened: 0, rogBreakup: { red: 0, orange: 0, green: 0 }, data: {} };
    }

    assignRanks(dataArray, field) {
        const sortedArray = dataArray.slice().sort((a, b) => b[field] - a[field])

        // Reuse the addRanking function to rank each record based on the specified field
        const rankedData = this.addRanking(sortedArray, field)

        // Construct the percentages object for each record
        const transformedData = rankedData.map((record) => {
            const percentages = {}
            const percentageFields = ['Physical', 'Social', 'Emotional', 'Cognitive', 'Language']
            // Calculate rank for each percentage field
            percentageFields.forEach((percentageField) => {
                const sortedPercentageArray = sortedArray
                    .slice()
                    .sort((a, b) => b[percentageField] - a[percentageField])
                const percentageRank =
                    sortedPercentageArray.findIndex(
                        (item) => item[percentageField] === record[percentageField],
                    ) + 1

                percentages[percentageField] = {
                    percentage: record[percentageField],
                    rank: record[percentageField] !== 0 ? percentageRank : 0, // If percentage is 0, set rank to 0
                }
            })

            return {
                schoolName: record.schoolName,
                schoolId: record.school,
                rank: record.rank,
                overallPercentageofSchools: record.overallPercentageofSchools,
                overallPercentageofClasses: record.overallPercentageofClasses,
                className: record.className,
                section: record?.section,
                overallPercentageofSection: record.overallPercentageofSection,
                classRoomId: record.classRoomId,
                percentages: { ...percentages },
            }
        })

        return transformedData
    }

    addRanking(sortedArray, field) {
        let currentRank = 1
        let previousScore = null

        sortedArray.forEach((entry, index) => {
            if (entry[field] !== previousScore) {
                // currentRank = index + 1;
                currentRank = entry[field] === 0 ? 0 : index + 1
            }
            entry.rank = currentRank
            previousScore = entry[field]
        })

        return sortedArray
    }

    


   // 🟢 🟢 🟢 FINAL AI SCORING & PROTECTIVE STRENGTH ENGINE 🟢 🟢 🟢

    processBaselineScoring(payload, previousBaseline = null) {
        // High-Impact Protective Indicators (Weighted Strengths)[cite: 2]
        // Exact IDs mapped from localizationConstants.js V2
        const highImpactPredictors = [
            "grade2n3EmotionalQn7", // Emotional Regulation
            "grade2n3CognitiveQn3", // Task Persistence
            "grade2n3EmotionalQn5", // Positive Peer Relationships
            "grade2n3CognitiveQn2", // Help-seeking
            // You can add exact IDs for other grades here as needed
        ];

        const predictorMapping = {
            "grade2n3PhysicalQn1": { multiplier: 1.0, isCore: false },
            "grade2n3SocialQn1": { multiplier: 1.5, isCore: true },     // Core Predictors x1.5[cite: 3]
            "grade2n3CognitiveQn3": { multiplier: 1.2, isCore: false },
        };

        const calculateDomainScores = (domainData) => {
            let domainRiskScore = 0;
            let domainStrengthScore = 0;
            let achievedCount = 0;
            let totalCount = domainData.length;

            domainData.forEach(item => {
                const config = predictorMapping[item.question] || { multiplier: 1.0, isCore: false };
                const isHighImpact = highImpactPredictors.includes(item.question);

                let risk = 0, strength = 0;

                // Logic based on Document 2 & 3[cite: 2, 3]
                if (item.status === 'Not Achieved' || item.status === 'no' || item.status === false) {
                    risk = 2; // High Risk[cite: 3]
                    strength = 0; // No protective effect[cite: 2]
                } else if (item.status === 'Emerging') {
                    risk = 1; // Medium Risk[cite: 3]
                    strength = 1; // Developing strength[cite: 2]
                } else if (item.status === 'Achieved' || item.status === 'yes' || item.status === true) {
                    risk = 0; // No risk[cite: 3]
                    strength = isHighImpact ? 3 : 2; // +3 if High Impact, else +2[cite: 2]
                    achievedCount++;
                }

                domainRiskScore += (risk * config.multiplier);
                domainStrengthScore += strength;
            });

            // Domain Risk Level[cite: 3]
            let domainRiskLevel = "Low Risk";
            if (domainRiskScore >= 8) domainRiskLevel = "High Risk";
            else if (domainRiskScore >= 4) domainRiskLevel = "Monitor";

            // Domain Protective Buffer Level[cite: 2]
            let protectiveLevel = "Low";
            if (domainStrengthScore >= 10) protectiveLevel = "Strong";
            else if (domainStrengthScore >= 5) protectiveLevel = "Moderate";

            const percentageAchieved = totalCount > 0 ? (achievedCount / totalCount) * 100 : 0;

            return { 
                riskScore: Math.round(domainRiskScore),
                strengthScore: domainStrengthScore,
                domainRiskLevel,
                protectiveLevel,
                percentageAchieved
            };
        };

        const domains = ['Physical', 'Social', 'Emotional', 'Cognitive', 'Language'];
        let totalRiskScore = 0;
        let totalStrengthScore = 0;

        const domainStats = {};

        // Calculate scores for all domains
        domains.forEach(domain => {
            if (payload[domain] && payload[domain].data) {
                const stats = calculateDomainScores(payload[domain].data);
                domainStats[domain] = stats;
                
                payload[domain].riskScore = stats.riskScore;
                payload[domain].strengthScore = stats.strengthScore;
                payload[domain].protectiveLevel = stats.protectiveLevel;
                
                // Backward compatibility for existing code structure
                payload[domain].adjustedRisk = stats.riskScore; 
                payload[domain].total = stats.riskScore.toString(); 

                totalRiskScore += stats.riskScore; 
                totalStrengthScore += stats.strengthScore;
            } else {
                domainStats[domain] = { riskScore: 0, strengthScore: 0, protectiveLevel: "Low", percentageAchieved: 0 };
            }
        });

        const systemAlerts = [];
        let influenceSeverity = "None";

        // ==========================================
        // 🔮 STRENGTH-BASED AUTOMATION (The 70% Rule)[cite: 3]
        // ==========================================
        let protectiveAdjustment = 0;
        if (domainStats.Social?.percentageAchieved >= 70 || domainStats.Emotional?.percentageAchieved >= 70) {
            // Reduce total risk score by 15%[cite: 3]
            protectiveAdjustment = totalRiskScore * 0.15;
            totalRiskScore = totalRiskScore - protectiveAdjustment;
            systemAlerts.push(`🛡️ Protective Adjustment: Strong Social/Emotional skills reduced overall risk by 15%.`);
        }

        // ==========================================
        // 🔮 STRENGTH CLUSTER DETECTION[cite: 2]
        // ==========================================
        const hasAcademicResilience = domainStats.Cognitive?.strengthScore >= 8; 
        const hasSocialResilience = domainStats.Social?.strengthScore >= 8;
        const hasEmotionalResilience = domainStats.Emotional?.strengthScore >= 8;

        if (hasAcademicResilience) systemAlerts.push("🌟 Academic Resilience Cluster detected: Strong organization and persistence.");
        if (hasSocialResilience) systemAlerts.push("🌟 Social Resilience Cluster detected: Strong peer relationships and conflict resolution.");
        if (hasEmotionalResilience) systemAlerts.push("🌟 Emotional Resilience Cluster detected: Strong self-regulation and coping.");

        if (hasAcademicResilience || hasSocialResilience || hasEmotionalResilience) {
             systemAlerts.push("ℹ️ Protective factors present – monitor before escalation."); //[cite: 2]
        }

        // ==========================================
        // 🔮 STRENGTH-TO-RISK RATIO PRIORITY[cite: 2]
        // ==========================================
        let priorityRatio = "";
        if (totalRiskScore >= 11 && totalStrengthScore >= 35) { 
            priorityRatio = "Needs support but strong recovery potential"; //[cite: 2]
            influenceSeverity = "Monitor"; 
        } else if (totalRiskScore >= 11 && totalStrengthScore < 35) {
            priorityRatio = "Priority case (High risk + Low protective)"; //[cite: 2]
            influenceSeverity = "Priority"; //[cite: 3]
        } else if (totalRiskScore < 11 && totalStrengthScore >= 35) {
            priorityRatio = "Stable functioning"; //[cite: 2]
        } else if (totalRiskScore >= 5 && totalStrengthScore < 35) {
            priorityRatio = "Higher escalation likelihood"; //[cite: 2]
            influenceSeverity = "Review"; //[cite: 3]
        }

        if (priorityRatio) systemAlerts.push(`⚖️ Risk-to-Strength Balance: ${priorityRatio}`);

        // ==========================================
        // 🔮 1. BASELINE 1 CRITICAL ALERT
        // ==========================================
        // If this is Baseline 1 and the child is at high risk, trigger an immediate alert!
        if (payload.baselineCategory === 'Baseline 1') {
            if (totalRiskScore >= 15 || influenceSeverity === "Priority" || influenceSeverity === "Review") {
                systemAlerts.push("🚨 Critical Alert: High risk factors identified in initial screening (Baseline 1). Immediate review needed.");
            }
        }

        // ==========================================
        // 🔮 2. TREND-BASED RISK DETECTION (Baseline 2 & 3)[cite: 3]
        // ==========================================
        // If previousBaseline data is provided (i.e., Baseline 2 or 3 is being submitted)
        if (previousBaseline && previousBaseline.overallAdjustedRisk !== undefined) {
            const prevRisk = previousBaseline.overallAdjustedRisk;
            const currentRisk = totalRiskScore;
            
            const riskDifference = currentRisk - prevRisk;

            // Pattern 1: Sudden Change Pattern (Large score change)[cite: 3]
            if (riskDifference >= 8) {
                systemAlerts.push(`📉 Sudden Change Pattern: Risk score jumped significantly from ${prevRisk.toFixed(1)} to ${currentRisk.toFixed(1)}. Check for recent stressors or events.`); //[cite: 3]
            } 
            // Pattern 2: Escalation Pattern (Risk increasing)[cite: 3]
            else if (riskDifference > 2) {
                systemAlerts.push(`⚠️ Escalation Pattern: Overall risk has increased since ${previousBaseline.baselineCategory}. Closer monitoring required.`); //[cite: 3]
            } 
            // Pattern 3: Improvement Pattern (Risk decreasing)[cite: 3]
            else if (riskDifference <= -3) {
                systemAlerts.push(`📈 Improvement Pattern: Responding well to support! Risk decreased from ${prevRisk.toFixed(1)} to ${currentRisk.toFixed(1)}.`); //[cite: 3]
            }
        }

        // Save AI insights and scores to payload to be saved in the database
        payload.systemAlerts = systemAlerts;
        payload.influenceSeverity = influenceSeverity;
        payload.protectiveScore = totalStrengthScore;

        // ==========================================
        // OVERALL RISK INDEX & TIER PLACEMENT[cite: 3]
        // ==========================================
        let tier = "Tier 1 (Universal Support)";
        if (totalRiskScore >= 21) tier = "Tier 3 (Intensive Support)"; //[cite: 3]
        else if (totalRiskScore >= 11) tier = "Tier 2 (Targeted Monitoring)"; //[cite: 3]
        else if (totalRiskScore >= 5) tier = "Tier 1 Monitoring"; 

        payload.overallAdjustedRisk = Math.round(totalRiskScore);
        payload.overallTier = tier;

        return payload;
    }
}

module.exports.BaselineHelperService = BaselineHelperService;
