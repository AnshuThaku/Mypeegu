import React, {
	useState,
	useRef,
	useImperativeHandle,
	forwardRef,
	useEffect,
} from 'react'
import {
	Box,
	Typography,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	TextField,
	Paper,
} from '@mui/material'
import { useSelector } from 'react-redux'
import {
	safeSpacesQns_vA,
	safeSpacesQns_vB,
	scoringMapping,
	scoringOptions_vA,
	scoringOptions_vB,
} from './safeSpacesConstants'
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent'
import CommonBarFilter, {
	initialBarFilterStates,
} from '../../../components/commonComponents/CommonBarFilter'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { getCurrentAcademicYearId, delay } from '../../../utils/utils'

const testInValid = [undefined, null, '']

const AddSafeSpaces = forwardRef(
	({ onSaveStateChange, clearOptionsRef }, ref) => {
		const { academicYears } = useSelector(
			(store) => store.dashboardSliceSetup,
		)

		const [barFilterData, setBarFilterData] = useState(
			initialBarFilterStates,
		)
		const [student, setStudent] = useState({})
		const [formData, setFormData] = useState({})
		const [studentVoice, setStudentVoice] = useState('')
		const [boolStats, setBoolStats] = useState({
			'Emotional Safety': true,
			Emotional: true,
		})

		const isStudentSelected =
			!testInValid.includes(student?.studentName) &&
			!testInValid.includes(student?.user_id)

		// =========================================================================
		// 100% BULLETPROOF GRADE DETECTION LOGIC (Same as Pulse)
		// =========================================================================

		// Seedha barFilterData se className utha rahe hain!
		const actualClassName = String(
			barFilterData?.className ||
				student?.className ||
				student?.class ||
				'',
		).trim()
		const formattedClass = actualClassName.toUpperCase().replace(/\s+/g, '')

		// Version A: Grades 3-5
		const validGradesA = ['3', '4', '5', '03', '04', '05', 'III', 'IV', 'V']
		// Version B: Grades 6-12
		const validGradesB = [
			'6',
			'7',
			'8',
			'9',
			'10',
			'11',
			'12',
			'06',
			'07',
			'08',
			'09',
			'VI',
			'VII',
			'VIII',
			'IX',
			'X',
			'XI',
			'XII',
		]

		let isAllowedGradeA = false
		let isAllowedGradeB = false

		if (formattedClass !== '') {
			isAllowedGradeA = validGradesA.some(
				(vg) =>
					formattedClass === vg ||
					formattedClass === `CLASS${vg}` ||
					formattedClass === `GRADE${vg}`,
			)
			isAllowedGradeB = validGradesB.some(
				(vg) =>
					formattedClass === vg ||
					formattedClass === `CLASS${vg}` ||
					formattedClass === `GRADE${vg}`,
			)
		}

		const isAllowedGrade = isAllowedGradeA || isAllowedGradeB
		const isInvalidGrade = actualClassName !== '' && !isAllowedGrade

		// AUTO SELECT VERSION BASED ON CLASS
		const version = isAllowedGradeB ? 'versionB' : 'versionA'

		const currentQuestions =
			version === 'versionA' ? safeSpacesQns_vA : safeSpacesQns_vB
		const currentOptions =
			version === 'versionA' ? scoringOptions_vA : scoringOptions_vB
		const currentMapping = scoringMapping[version]

		// Reset formData if version changes
		const previousVersion = useRef(version)
		useEffect(() => {
			if (previousVersion.current !== version) {
				setFormData({})
				setStudentVoice('')
				previousVersion.current = version
			}
		}, [version])

		// Validation logic for Save Button
		useEffect(() => {
			const totalQns = Object.values(currentQuestions).flat().length
			const filledQns = Object.keys(formData).length

			// Version B ke liye Student voice empty nahi hona chahiye
			const isVoiceValid =
				version === 'versionB' ? studentVoice.trim().length > 0 : true

			const isInvalid =
				!isStudentSelected ||
				!isAllowedGrade ||
				filledQns < totalQns ||
				!isVoiceValid
			onSaveStateChange(isInvalid)
		}, [
			formData,
			student,
			currentQuestions,
			isStudentSelected,
			isAllowedGrade,
			studentVoice,
			version,
			onSaveStateChange,
		])

		// Handle Academic Year Auto-population
		const isInitialLoad = useRef(true)
		useEffect(() => {
			const populateAY = async () => {
				if (academicYears.length > 0 && isInitialLoad.current) {
					const currentAYId = getCurrentAcademicYearId(academicYears)
					if (currentAYId) {
						await delay()
						setBarFilterData((prev) => ({
							...prev,
							selectdAYs: currentAYId,
						}))
					}
					isInitialLoad.current = false
				}
			}
			populateAY()
		}, [academicYears])

		const handleOptionChange = (domain, index, option) => {
			setFormData((prev) => ({
				...prev,
				[`${domain}_${index}`]: {
					question:
    typeof currentQuestions[domain][index] === 'object'
        ? currentQuestions[domain][index].question
        : currentQuestions[domain][index],
					option,
					points: currentMapping[option] || 1,
				},
			}))
		}

		useImperativeHandle(ref, () => ({
			getSubmitData: () => {
				const domainScores = {}
				let totalActual = 0
				let totalMax = 0
				const maxPtsPerQ = version === 'versionA' ? 3 : 4

				Object.keys(currentQuestions).forEach((domain) => {
					let dScore = 0
					currentQuestions[domain].forEach((qn, idx) => {
						const ans = formData[`${domain}_${idx}`]
						if (ans) {
							dScore += ans.points
							totalActual += ans.points
						}
						totalMax += maxPtsPerQ
					})
					domainScores[domain] =
						Math.round(
							(dScore /
								(currentQuestions[domain].length *
									maxPtsPerQ)) *
								100,
						) || 0
				})

				return {
					id: Date.now(),
					user_id: student.user_id,
					studentName: student.studentName,
					schoolId: barFilterData.schools
						? barFilterData.schools[0]
						: null,
					classRoomId: barFilterData.classrooms
						? barFilterData.classrooms[0]
						: null,
					section: barFilterData.sections
						? barFilterData.sections[0]
						: null,
					academicYear: barFilterData.selectdAYs,
					version,
					overallScore: Math.round((totalActual / totalMax) * 100),
					domainScores,
					responses: formData,
					studentVoice,
					createdAt: new Date().toISOString(),
				}
			},
		}))

		return (
			<Box sx={{ mt: '10px' }}>
				<Box sx={{ mt: '24px' }}>
					<CommonBarFilter
						barFilterData={barFilterData}
						setBarFilterData={setBarFilterData}
						isStudentRequired={true}
						setStudent={setStudent}
						dropdownOptions={{
							academicYear: true,
							school: true,
							classroom: true,
							section: true,
							student: true,
						}}
						ref={clearOptionsRef}
					/>
				</Box>

				{/* ERROR FOR INVALID CLASSES (LIKE CLASS 1, 2) */}
				{isInvalidGrade && isStudentSelected && (
					<Box
						sx={{
							mt: 4,
							p: 3,
							bgcolor: '#FFEBEE',
							border: '1px solid #EF4444',
							borderRadius: '8px',
							textAlign: 'center',
						}}
					>
						<Typography
							sx={{
								color: '#C62828',
								fontWeight: 700,
								fontSize: '16px',
							}}
						>
							⚠️ Assessment Restricted
						</Typography>
						<Typography
							sx={{ color: '#C62828', mt: 1, fontSize: '14px' }}
						>
							Safe Spaces Assessment is exclusively designed for{' '}
							<b>Grades 3 to 12</b>.<br />
							The selected student belongs to{' '}
							<b>Class {actualClassName || 'Unknown'}</b>. Please
							select an eligible student to proceed.
						</Typography>
					</Box>
				)}

				{/* AUTOMATIC FORM RENDERING FOR VALID CLASSES (No Green Box anymore) */}
				{isStudentSelected && !isInvalidGrade && (
					<Box sx={{ mt: '30px' }}>
						{Object.entries(currentQuestions).map(
							([domain, questions]) => (
								<Box sx={{ mt: '24px' }} key={domain}>
									<CustomCollapsibleComponent
										open={boolStats[domain]}
										title={domain}
										onClick={() =>
											setBoolStats((prev) => ({
												...prev,
												[domain]: !prev[domain],
											}))
										}
									>
										{questions.map((qn, index) => (
											<Box
												sx={{
													mb: '28px',
													borderBottom:
														'1px solid #f0f0f0',
													pb: 2,
												}}
												key={index}
											>
												<Box sx={{ display: 'flex' }}>
													<Typography
														variant={
															typographyConstants.h5
														}
														sx={{
															minWidth: '25px',
														}}
													>{`${index + 1}.`}</Typography>
													{/* <Typography variant={typographyConstants.h5}>{qn}</Typography> */}
													<Typography
														variant={
															typographyConstants.h5
														}
													>
														{typeof qn === 'object'
															? qn.question
															: qn}
													</Typography>
												</Box>

												<FormControl sx={{ mt: '12px', pl: '25px', width: '100%' }}>
    {typeof qn === 'object' ? (
        qn.options.map((item, itemIndex) => (
            <Box key={itemIndex} sx={{ mb: 2 }}>
                <Typography sx={{ fontSize: '14px', mb: 1, fontWeight: 500 }}>
                    • {item}
                </Typography>

                <RadioGroup
                    row
                    value={formData[`${domain}_${index}_${itemIndex}`]?.option || ''}
                    onChange={(e) =>
                        handleOptionChange(
                            domain,
                            `${index}_${itemIndex}`,
                            e.target.value
                        )
                    }
                >
                    {qn.responseScale.map((scale) => (
                        <FormControlLabel
                            key={scale}
                            value={scale}
                            control={<Radio size="small" />}
                            label={
                                <Typography sx={{ fontSize: '14px' }}>
                                    {scale}
                                </Typography>
                            }
                            sx={{ mr: 3 }}
                        />
                    ))}
                </RadioGroup>
            </Box>
        ))
    ) : (
        <RadioGroup
            row
            value={formData[`${domain}_${index}`]?.option || ''}
            onChange={(e) =>
                handleOptionChange(domain, index, e.target.value)
            }
        >
            {currentOptions.map((opt) => (
                <FormControlLabel
                    key={opt}
                    value={opt}
                    control={<Radio size="small" />}
                    label={
                        <Typography sx={{ fontSize: '14px' }}>
                            {opt}
                        </Typography>
                    }
                    sx={{ mr: 3 }}
                />
            ))}
        </RadioGroup>
    )}
</FormControl>
											</Box>
										))}
									</CustomCollapsibleComponent>
								</Box>
							),
						)}

						{/* STUDENT VOICE */}
						<Paper
							elevation={0}
							sx={{
								p: 2,
								mt: 4,
								borderRadius: '8px',
								border: '1px solid #e0e0e0',
								bgcolor: '#fafafa',
							}}
						>
							<Typography
								variant='subtitle2'
								sx={{ mb: 1, fontWeight: 600, color: '#333' }}
							>
								{version === 'versionB'
									? ' STUDENT VOICE'
									: ' STUDENT VOICE'}
							</Typography>

							<Typography
								variant='body1'
								sx={{ mb: 1, fontWeight: 500 }}
							>
								{version === 'versionB'
									? '1. What would help you feel safer at school?'
									: '1. Is there anything you want to share about how you feel at school?'}
								{version === 'versionB' && (
									<span style={{ color: 'red' }}> * </span>
								)}
							</Typography>

							<TextField
								fullWidth
								multiline
								rows={3}
								placeholder='Type your answer here...'
								value={studentVoice}
								onChange={(e) =>
									setStudentVoice(e.target.value)
								}
								sx={{ backgroundColor: '#fff' }}
								required={version === 'versionB'}
								error={
									version === 'versionB' &&
									studentVoice.trim() === '' &&
									Object.keys(formData).length > 0
								}
								helperText={
									version === 'versionB' &&
									studentVoice.trim() === '' &&
									Object.keys(formData).length > 0
										? 'This field is required '
										: ''
								}
							/>
						</Paper>
					</Box>
				)}

				{/* INSTRUCTION BEFORE STUDENT IS SELECTED */}
				{!isStudentSelected && (
					<Box
						sx={{
							mt: 5,
							p: 4,
							textAlign: 'center',
							border: '1px dashed #ccc',
							borderRadius: '8px',
						}}
					>
						<Typography color='textSecondary'>
							Please select a student to auto-load the correct
							Safe Spaces assessment version.
						</Typography>
					</Box>
				)}
			</Box>
		)
	},
)

export default AddSafeSpaces
