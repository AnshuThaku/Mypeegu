import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
	Checkbox,
	TextField,
} from '@mui/material'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	getAllClassroomsForStudents,
	viewAllStudentsForSchoolActions,
	promoteStudentsToNextClass,
	clearAllStudentsForSchoolAction,
	markStudentAsGraduated,
	markStudentAsExited,
} from '../../../redux/commonSlice'
import { getCurrentAcademicYearId } from '../../../utils/utils'
import CustomButton from '../../../components/CustomButton'
import { requestParams } from '../../../utils/apiConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'

const PromoteStudentsComponent = ({ isOpen, onClose, schoolId }) => {
	const dispatch = useDispatch()
	const { academicYears } = useSelector((s) => s.dashboardSliceSetup)
	const { allSchools } = useSelector((s) => s.school)
	const { allStudentsForSchoolActions: students, classroomsListForStudents } =
		useSelector((s) => s.commonData)
	// console.log('requestParams', requestParams?.targetCount, academicYears)
	// console.log('students', students)
	// console.log('classroomsListForStudents', classroomsListForStudents)
	const [sourceClasses, setSourceClasses] = useState([])
	const [targetClasses, setTargetClasses] = useState([])
	const [selectedSourceClassId, setSelectedSourceClassId] = useState('')
	const [overrides, setOverrides] = useState({})
	const [nextAyId, setNextAyId] = useState(null)
	const [lastAyId, setLastAyId] = useState(null)
	const [errorMsg, setErrorMsg] = useState('')

	const selectedSchool = useMemo(
		() => allSchools?.data?.find((s) => s._id === schoolId),
		[allSchools, schoolId],
	)

	useEffect(() => {
		if (!selectedSchool || !academicYears?.length) return
		const currentAcyId = getCurrentAcademicYearId(academicYears)
		const schoolCurAyId = selectedSchool.currentAcademicYear || null
		const schoolNextAyId = selectedSchool.lastActiveAcademicYear || null

		if (schoolCurAyId && schoolNextAyId) {
			setLastAyId(schoolCurAyId)
			setNextAyId(schoolNextAyId)
			return
		}

		const lastPromotionAcy = selectedSchool.lastPromotionAcademicYear
		const lastPromotionYearObj = academicYears.find((a) => a._id === lastPromotionAcy)
		const target = lastPromotionYearObj
			? academicYears.find((a) => a.order === lastPromotionYearObj.order + 1)
			: null
		setLastAyId(lastPromotionAcy || currentAcyId)
		setNextAyId(target?._id || null)
	}, [selectedSchool, academicYears])

	const fetchSourceClasses = useCallback(() => {
		if (!schoolId || !lastAyId) return
		const body = { filter: { schoolIds: [schoolId], academicYear: [lastAyId] } }
		dispatch(getAllClassroomsForStudents({ body })).then((res) => {
			setSourceClasses(res?.payload || [])
		})
	}, [dispatch, schoolId, lastAyId])

	const fetchTargetClasses = useCallback(() => {
		if (!schoolId || !nextAyId) {
			setTargetClasses([])
			return
		}
		const body = { filter: { schoolIds: [schoolId], academicYear: [nextAyId] } }
		dispatch(getAllClassroomsForStudents({ body })).then((res) => {
			setTargetClasses(res?.payload || [])
		})
	}, [dispatch, schoolId, nextAyId])

	useEffect(() => {
		fetchSourceClasses()
	}, [fetchSourceClasses])

	useEffect(() => {
		fetchTargetClasses()
	}, [fetchTargetClasses])

	const fetchStudents = useCallback(
		(classId) => {
			if (!schoolId || !lastAyId) return
			const sortKeys = [{ key: 'regDate', asc: false }]
			const body = {
				[requestParams.sortKeys]: sortKeys,
				filter: {
					schoolIds: [schoolId],
					...(classId ? { classroomIds: [classId] } : {}),
					academicYear: lastAyId,
				},
				[requestParams.searchText]: '',
				isSchoolAction: true,
			}
			dispatch(viewAllStudentsForSchoolActions({ body }))
		},
		[dispatch, schoolId, lastAyId],
	)

	useEffect(() => {
		// Fetch all-school students when no class selected; else fetch class students
		fetchStudents(selectedSourceClassId || '')
	}, [selectedSourceClassId, fetchStudents])

	const selectedSourceClass = useMemo(
		() => sourceClasses.find((c) => c._id === selectedSourceClassId),
		[sourceClasses, selectedSourceClassId],
	)

	// Map classrooms by className+section to determine terminal class and per-student classHierarchy
	const classroomByKey = useMemo(() => {
		const map = new Map()
		sourceClasses.forEach((c) => {
			map.set(`${c.className}__${c.section}`, c)
		})
		return map
	}, [sourceClasses])
	const maxHierarchy = useMemo(
		() =>
			sourceClasses.reduce(
				(max, c) => (typeof c.classHierarchy === 'number' && c.classHierarchy > max ? c.classHierarchy : max),
				-Infinity,
			),
		[sourceClasses],
	)
	const isTerminalStudent = useCallback(
		(s) => {
			const key = `${s.className}__${s.section}`
			const cls = classroomByKey.get(key)
			if (!cls || typeof cls.classHierarchy !== 'number') return false
			return cls.classHierarchy === maxHierarchy
		},
		[classroomByKey, maxHierarchy],
	)

	const getStudentClassHierarchy = useCallback(
		(s) => {
			const key = `${s.className}__${s.section}`
			const cls = classroomByKey.get(key)
			return typeof cls?.classHierarchy === 'number' ? cls.classHierarchy : null
		},
		[classroomByKey],
	)

	const inferNextClassName = useCallback((name) => {
		const n = parseInt(name, 10)
		if (!Number.isNaN(n)) return String(n + 1)
		const map = { Nursery: 'LKG', LKG: 'UKG', UKG: '1', KG: '1' }
		return map[name] || name
	}, [])

	const getTargetOptionsForStudent = useCallback(
		(s) => {
			// Prefer className-based matching to avoid missing classHierarchy
			const nextName = inferNextClassName(s.className)
			let options = targetClasses.filter((c) => c.className === nextName)
			if (options.length === 0) {
				// Fallback to hierarchy if className data not aligned
				const currentHierarchy = getStudentClassHierarchy(s)
				if (typeof currentHierarchy === 'number') {
					const expected = currentHierarchy + 1
					options = targetClasses.filter((c) => c.classHierarchy === expected)
				}
			}
			return options
		},
		[targetClasses, getStudentClassHierarchy, inferNextClassName],
	)

	const getDefaultNextForStudent = useCallback(
		(s) => {
			const options = getTargetOptionsForStudent(s)
			if (!options.length) return null
			const sameSection = options.find((c) => c.section === s.section)
			if (sameSection) return sameSection
			// pick nearest section by sectionHierarchy distance
			const currentKey = `${s.className}__${s.section}`
			const curCls = classroomByKey.get(currentKey)
			const curSecOrder = curCls?.sectionHierarchy ?? 0
			return options.reduce((best, c) => {
				if (!best) return c
				const d1 = Math.abs((c.sectionHierarchy ?? 0) - curSecOrder)
				const d2 = Math.abs((best.sectionHierarchy ?? 0) - curSecOrder)
				return d1 < d2 ? c : best
			}, null)
		},
		[getTargetOptionsForStudent, classroomByKey],
	)

	useEffect(() => {
		if (process.env.NODE_ENV === 'production') return
		if (!selectedSchool) return
		// eslint-disable-next-line no-console
		// console.log('PROMOTE DEBUG (AYs):', {
		// 	schoolId,
		// 	currentAcademicYear: selectedSchool.currentAcademicYear || null,
		// 	lastActiveAcademicYear: selectedSchool.lastActiveAcademicYear || null,
		// 	lastAyId,
		// 	nextAyId,
		// 	sourceClassesCount: sourceClasses.length,
		// 	targetClassesCount: targetClasses.length,
		// })
	}, [schoolId, selectedSchool, lastAyId, nextAyId, sourceClasses.length, targetClasses.length])

	const onSubmit = async () => {
		setErrorMsg('')

		const exitedStudentIds = []
		const graduateStudentIds = []
		const failedIds = []
		const sectionOverridesList = []
		// const missingJumpTargets = []

		filteredRows.forEach((s) => {
			const action = actionsMap[s._id] || (isTerminalStudent(s) ? 'GRADUATE' : 'PROMOTE')
			if (action === 'EXIT') {
				exitedStudentIds.push(s._id)
			} else if (action === 'GRADUATE' || (action === 'PROMOTE' && isTerminalStudent(s))) {
				graduateStudentIds.push(s._id)
			} else if (action === 'FAIL') {
				failedIds.push(s._id)
			} else {
				const override = overrides[s._id]
				if (override) {
					sectionOverridesList.push({ studentId: s._id, toClassroomId: override })
				}
			}
		})

		// if (missingJumpTargets.length > 0) {
		// 	setErrorMsg('Please select a target class for all JUMP students.')
		// 	return
		// }

		const promoteBody = {
			schoolId,
			failedStudentIds: failedIds,
			sectionOverrides: sectionOverridesList
		}

		try {
			// First, process exits if any
			if (exitedStudentIds.length > 0) {
				const exitBody = {
					school: schoolId,
					studentIds: exitedStudentIds,
					academicYear: lastAyId,
				}
				const exitRes = await dispatch(markStudentAsExited({ body: exitBody }))
				if (exitRes?.error) {
					setErrorMsg('Failed to mark students as exited.')
					return
				}
			}

			// Then, process graduation for terminal class students
			if (graduateStudentIds.length > 0) {
				const gradBody = {
					school: schoolId,
					studentIds: graduateStudentIds,
					academicYear: lastAyId,
				}
				const gradRes = await dispatch(markStudentAsGraduated({ body: gradBody }))
				// console.log(gradRes)
				if (gradRes?.error) {
					console.log(gradRes.error)
					setErrorMsg('Failed to mark students as graduated.')
					return
				}
			}

			// Then, process promotion
			const res = await dispatch(promoteStudentsToNextClass({ body: promoteBody }))
			const payload = res?.payload
			const err =
				payload?.error ||
				payload?.message ||
				res?.error?.message ||
				res?.error ||
				null

			if (err) {
				setErrorMsg(
					typeof err === 'string'
						? err
						: 'Promotion failed. Please try again or contact support.',
				)
				return
			}
			dispatch(clearAllStudentsForSchoolAction())
			onClose()
		} catch (e) {
			setErrorMsg('Action failed. Please try again or contact support.')
		}
	}

	const onCloseDialog = () => {
		dispatch(clearAllStudentsForSchoolAction())
		onClose()
	}

	// Search and filtered view
	const [searchText, setSearchText] = useState('')
	const studentsArray = useMemo(
		() =>
			Array.isArray(students?.data)
				? students.data
				: Array.isArray(students)
					? students
					: [],
		[students],
	)
	const filteredRows = useMemo(() => {
		const q = (searchText || '').toLowerCase().trim()
		if (!q) return studentsArray
		return studentsArray.filter((s) => {
			const name = (s?.studentName || '').toLowerCase()
			const cls = (s?.className || '').toLowerCase()
			const sec = (s?.section || '').toLowerCase()
			return (
				name.includes(q) ||
				`${cls} ${sec}`.includes(q) ||
				cls.includes(q) ||
				sec.includes(q)
			)
		})
	}, [studentsArray, searchText])
	const [actionsMap, setActionsMap] = useState({})
	const setActionFor = (id, value) => {
		setActionsMap((prev) => ({ ...prev, [id]: value }))
	}
	const setOverride = (studentId, toClassroomId) => {
		setOverrides((prev) => ({ ...prev, [studentId]: toClassroomId || undefined }))
	}
	return (
		<Dialog open={isOpen} onClose={onCloseDialog} fullWidth maxWidth="lg">
			<DialogTitle>{localizationConstants.promoteStudents}</DialogTitle>
			<DialogContent>
				<Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
					<Typography sx={{ minWidth: 120 }}>
						{localizationConstants.class}
					</Typography>
					<Select
						size="small"
						value={selectedSourceClassId}
						onChange={(e) => setSelectedSourceClassId(e.target.value)}
						displayEmpty
					>
						<MenuItem value="">
							<em>All Classes</em>
						</MenuItem>
						{sourceClasses.map((c) => (
							<MenuItem key={c._id} value={c._id}>
								{c.className} {c.section}
							</MenuItem>
						))}
					</Select>
					<TextField
						size="small"
						placeholder="Search by name, reg no, class/section"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						sx={{ flex: 1 }}
					/>
					<Typography sx={{ minWidth: 140, textAlign: 'right' }}>
						Total: {filteredRows.length}
					</Typography>
				</Box>
				<Table size="small">
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>{localizationConstants.studentsName}</TableCell>
							<TableCell>Current →  Next</TableCell>
							<TableCell>Action</TableCell>
							{/* <TableCell>Shift Section</TableCell> */}
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredRows.map((s, idx) => {
							const currentAction = actionsMap[s._id] || (isTerminalStudent(s) ? 'GRADUATE' : 'PROMOTE')
							const rowTargetOptions = getTargetOptionsForStudent(s)
							const defaultNext = getDefaultNextForStudent(s)
							const overrideId = overrides[s._id]
							const overrideTarget = overrideId
								? rowTargetOptions.find((c) => c._id === overrideId)
								: null
							const selectedTarget = overrideTarget || defaultNext
							const selectedTargetLabel = selectedTarget
								? `${selectedTarget.className} ${selectedTarget.section}`
								: `${inferNextClassName(s.className)} ${s.section}`
							const selectedColor = selectedTarget
								? overrideTarget
									? '#2563EB' // blue when user overrides section
									: '#16A34A' // green default next
								: '#16A34A' // green inferred next (no class yet)
							return (
								<TableRow key={s._id}>
									<TableCell>{idx + 1}</TableCell>
									<TableCell>{s.studentName}</TableCell>
									<TableCell>
										{s.className} {s.section}{' '}
										<Typography
											component="span"
											sx={{
												fontWeight: 700,
												color: selectedColor,
											}}
										>
											→ {selectedTargetLabel}
										</Typography>
									</TableCell>
									<TableCell>
										<Select
											size="small"
											value={currentAction}
											onChange={(e) => setActionFor(s._id, e.target.value)}
											sx={{ minWidth: 140 }}
										>
											<MenuItem value="PROMOTE">Promote</MenuItem>
											{isTerminalStudent(s) ? <MenuItem value="GRADUATE">Graduate</MenuItem> : null}
											<MenuItem value="EXIT">Exit (Left School)</MenuItem>
										</Select>
									</TableCell>
									{/* <TableCell>
										{currentAction === 'PROMOTE' ? (
											rowTargetOptions.length > 0 ? (
												<Select
													size="small"
													value={overrides[s._id] || ''}
													onChange={(e) => setOverride(s._id, e.target.value)}
													displayEmpty
													sx={{ minWidth: 180 }}
												>
													<MenuItem value="">
														<em>Default: {defaultNext ? defaultNext.section : s.section}</em>
													</MenuItem>
													{rowTargetOptions.map((c) => (
														<MenuItem key={c._id} value={c._id}>
															{c.section}
														</MenuItem>
													))}
												</Select>
											) : (
												<Select size="small" value="" displayEmpty disabled sx={{ minWidth: 180 }}>
													<MenuItem value="">
														<em>No next-year sections yet</em>
													</MenuItem>
												</Select>
											)
										) : (
											<Typography variant="body2" color="textSecondary">—</Typography>
										)}
									</TableCell> */}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
				{selectedSourceClassId && (
					<Typography sx={{ mt: 2, color: '#DD2A2B' }}>
						For PROMOTE, students go to the default next class (same section if available). Use “Shift Section” to move them to 3B/3C etc.
					</Typography>
				)}
			</DialogContent>
			<DialogActions>
				{errorMsg ? (
					<Typography sx={{ mr: 'auto', color: '#DD2A2B' }}>{errorMsg}</Typography>
				) : null}
				<Button onClick={onCloseDialog}>{localizationConstants.cancel}</Button>
				<CustomButton title={localizationConstants.promoteStudents} onClick={onSubmit} />
			</DialogActions>
		</Dialog>
	)
}

export default PromoteStudentsComponent
