import React, { memo, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
	Box,
	Divider,
	Drawer,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material'
import { counsellorStyles } from '../../counsellors/counsellorsStyles'
import useCommonStyles from '../../../components/styles'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import CustomIcon from '../../../components/CustomIcon'
import { iconConstants } from '../../../resources/theme/iconConstants'
import CustomButton from '../../../components/CustomButton'
import {
	safeSpacesQns_vA,
	safeSpacesQns_vB,
	scoringOptions_vA,
	scoringOptions_vB,
	scoringMapping,
	getTierByScore,
} from './safeSpacesConstants'

const SafeSpacesDrawer = ({
	open,
	onClose,
	domainKey, // (e.g. 'Adult Support')
	displayLabel,
	total,
	rowData,
	onEditSuccess,
}) => {
	const flexStyles = useCommonStyles()
	const dispatch = useDispatch()
	const { appPermissions } = useSelector((store) => store.dashboardSliceSetup)

	const [isEditBtnClicked, setIsEditBtnClicked] = useState(false)
	const [selectedData, setSelectedData] = useState([])
	const [count, setCount] = useState(0)

	// CHECK SAVED VERSION EXACTLY
	const version = rowData?.version || 'versionA'
	const sourceQuestions =
		version === 'versionA' ? safeSpacesQns_vA : safeSpacesQns_vB
	const optionsList =
		version === 'versionA' ? scoringOptions_vA : scoringOptions_vB
	const mapping = scoringMapping[version]

	// Fetch Questions based on exact DomainKey
	const currentQuestionsList = sourceQuestions[domainKey] || []

	const normalizedQuestions = currentQuestionsList.flatMap((q) => {
		if (typeof q === 'object') {
			return q.options.map((opt, idx) => ({
				parentQuestion: q.question,
				question: opt,
				responseScale: q.responseScale,
				key: idx,
			}))
		}

		return [
			{
				parentQuestion: '',
				question: q,
				responseScale: optionsList,
			},
		]
	})

	useEffect(() => {
		if (normalizedQuestions.length > 0) {
			const initialList = normalizedQuestions.map((qn, idx) => {
				const exactKey =
    qn.parentQuestion
        ? `${domainKey}_0_${idx}`
        : `${domainKey}_${idx}`

				let savedOption = ''

				if (rowData?.responses && rowData.responses[exactKey]) {
					savedOption =
						rowData.responses[exactKey].option ||
						rowData.responses[exactKey]
				}

				return {
					...qn,
					option: savedOption,
					points: mapping[savedOption] || 0,
				}
			})

			setSelectedData(initialList)
			setCount(total || 0)
		} else {
			setSelectedData([])
			setCount(0)
		}
	}, [rowData, domainKey, currentQuestionsList, total, open, mapping])

	const handleOptionChange = (index, newOption) => {
		const list = [...selectedData]
		const points = mapping[newOption] || 0
		list[index] = { ...list[index], option: newOption, points }

		// Dynamic Calculation logic (1 for vA, 1.5 for vB)
		const maxPtsPerQ = version === 'versionA' ? 1 : 1.5
		const totalActual = list.reduce(
			(sum, item) => sum + (item.points || 0),
			0,
		)
		const totalMax = list.length * maxPtsPerQ
		const newTotal =
			totalMax > 0 ? Math.round((totalActual / totalMax) * 100) : 0

		setCount(newTotal)
		setSelectedData(list)
	}

	const handleSave = () => {
		const updatedResponses = { ...(rowData?.responses || {}) }
		selectedData.forEach((item, idx) => {
			updatedResponses[`${domainKey}_${idx}`] = {
				question: item.question,
				option: item.option,
				points: item.points,
			}
		})

		const updatedRecord = {
			...rowData,
			responses: updatedResponses,
			domainScores: {
				...rowData.domainScores,
				[domainKey]: count,
			},
		}

		const allRecords = JSON.parse(
			localStorage.getItem('safeSpacesRecords') || '[]',
		)
		const newRecordsList = allRecords.map((r) =>
			r.id === rowData?.id ? updatedRecord : r,
		)
		localStorage.setItem(
			'safeSpacesRecords',
			JSON.stringify(newRecordsList),
		)

		setIsEditBtnClicked(false)
		if (onEditSuccess) onEditSuccess()
		onClose()
	}

	const tierInfo = getTierByScore(count)

	return (
		<Drawer
			anchor='right'
			sx={counsellorStyles.drawerSx}
			open={open}
			onClose={() => (isEditBtnClicked ? '' : onClose())}
		>
			<Box sx={{ flexGrow: 1 }}>
				<Box
					className={flexStyles.flexRowCenterSpaceBetween}
					sx={{ pb: '12px', p: 3 }}
				>
					<Typography
						variant={typographyConstants.h4}
						sx={{ fontWeight: 500, color: 'textColors.blue' }}
					>
						{displayLabel?.toUpperCase()}
					</Typography>
					<CustomIcon
						name={iconConstants.cancelRounded}
						style={{
							cursor: 'pointer',
							width: '26px',
							height: '26px',
						}}
						svgStyle={'width: 26px; height: 26px'}
						onClick={() => {
							onClose()
							setIsEditBtnClicked(false)
						}}
					/>
				</Box>
				<Divider />

				<Box
					sx={{
						mt: '20px',
						p: 3,
						pt: 0,
						height:
							appPermissions?.ObservationManagement?.edit !==
							false
								? `calc(100vh - 270px)`
								: `calc(100vh - 200px)`,
						overflow: 'auto',
					}}
				>
					{selectedData.length > 0 ? (
						selectedData.map((item, index) => {
							return (
								<Box sx={{ mb: '28px' }} key={index}>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'flex-start',
										}}
									>
										<Typography
											variant={typographyConstants.h5}
											sx={{ minWidth: '20px' }}
										>
											{`${index + 1}.`}
										</Typography>
										<Box>
											{item.parentQuestion && (
												<Typography
													variant={
														typographyConstants.h6
													}
													sx={{
														fontWeight: 600,
														mb: 1,
													}}
												>
													{item.parentQuestion}
												</Typography>
											)}

											<Typography
												variant={typographyConstants.h5}
											>
												• {item.question}
											</Typography>
										</Box>
									</Box>

									<FormControl
										sx={{ mt: '24px', pl: '20px' }}
										disabled={!isEditBtnClicked}
									>
										<RadioGroup
											row
											value={item.option}
											onChange={(e) =>
												handleOptionChange(
													index,
													e.target.value,
												)
											}
										>
											{optionsList.map((opt) => (
												<FormControlLabel
													key={opt}
													value={opt}
													control={<Radio />}
													label={opt}
													sx={{ mr: 2 }}
												/>
											))}
										</RadioGroup>
									</FormControl>
								</Box>
							)
						})
					) : (
						<Box sx={{ textAlign: 'center', mt: 5 }}>
							<Typography color='textSecondary'>
								No questions mapped for this domain in Version{' '}
								{version}.
							</Typography>
						</Box>
					)}
				</Box>
			</Box>

			<Box sx={{ px: 3, pb: 2 }}>
				<Box
					className={flexStyles.flexRowCenterSpaceBetween}
					sx={{
						mb: '36px',
						borderRadius: '4px',
						backgroundColor: tierInfo.color + '20',
						border: `1px solid ${tierInfo.color}`,
						minHeight: '50px',
						pl: '16px',
						pr: '16px',
					}}
				>
					<Box
						className={flexStyles.flexRowCenterSpaceBetween}
						sx={{ width: '100%' }}
					>
						<Typography
							variant={typographyConstants.h4}
							sx={{ color: tierInfo.color }}
						>
							{localizationConstants.total || 'Score'}
						</Typography>
						<Typography
							variant={typographyConstants.h4}
							sx={{ color: tierInfo.color, fontWeight: 700 }}
						>
							{count}%
						</Typography>
					</Box>
				</Box>

				{isEditBtnClicked ? (
					<Box
						className={flexStyles.flexRowCenterSpaceBetween}
						sx={{ mb: '36px', mt: '-20px' }}
					>
						<CustomButton
							sx={{
								minWidth: '192px',
								height: '60px',
								backgroundColor: 'transparent',
								border: '1px solid',
								borderColor: 'globalElementColors.blue',
							}}
							typoSx={{ color: 'textColors.black' }}
							text={localizationConstants.cancel}
							onClick={() => {
								setIsEditBtnClicked(false)
								setCount(total)
							}}
						/>
						<CustomButton
							sx={{
								minWidth: '192px',
								height: '60px',
								backgroundColor: '#0267D9',
							}}
							text={localizationConstants.submit}
							endIcon={
								<CustomIcon
									name={iconConstants.doneWhite}
									style={{
										width: '24px',
										height: '24px',
										marginLeft: '10px',
									}}
									svgStyle={'width: 24px; height: 24px'}
								/>
							}
							onClick={handleSave}
						/>
					</Box>
				) : (
					<CustomButton
						sx={{
							mb: '36px',
							mt: '-20px',
							width: '100%',
							height: '60px',
							backgroundColor: '#0267D9',
						}}
						text={localizationConstants.edit}
						onClick={() => setIsEditBtnClicked(true)}
					/>
				)}
			</Box>
		</Drawer>
	)
}

export default memo(SafeSpacesDrawer)
