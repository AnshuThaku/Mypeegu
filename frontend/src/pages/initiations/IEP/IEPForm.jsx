import React from 'react'
import PlacementWithSend from './PlacementWithSend'
import { Box } from '@mui/material'
import useCommonStyles from '../../../components/styles'
import { IEPContentsList, checklistHeaders } from './iEPConstants'
import CustomCollapsibleComponent from '../../../components/CustomCollapsibleComponent'
import { useState } from 'react'
import { useCallback } from 'react'
import BaselineCategoryIEP from './BaselineCategoryIEP'
import ChecklistData from './ChecklistData'
import Evolution from './Evolution '
import AccFromBoard from './AccFromBoard'
import InternalAccomodation from './AccInternal'
import TransitionPlanning from './TransitionPlanning'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import { useEffect } from 'react'
import { ValidationCheckforAddIEP } from './iEPFunctions'

const IEPForm = ({
	addIEPData,
	setAddIEPData,
	studentBaselineReport,
	readOnly = false,
	isBaselineExist,
	setIsBtnDisabled,
}) => {
	const flexStyles = useCommonStyles()
	const [modal, setModal] = useState({
    0: true,  // 🟢 Baseline hamesha khula rahega
    1: true,  // 🟢 Checklist hamesha khula rahega
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
})
	const handleModal = useCallback((name, value) => {
		const obj = {}
		obj[name] = value
		setModal((state) => ({ ...state, ...obj }))
	}, [])

	const [variants, setVariants] = useState({})

	// Effect 1: Only update variants when baseline changes
	useEffect(() => {
		const obj = {}
		studentBaselineReport?.additionalNeeds?.forEach((data) => {
			obj[data.categoryName?.trim()] = data?.Criticality
		})
		setVariants(obj)
	}, [studentBaselineReport?.additionalNeeds])
// ✅ Effect 2: Initialize checklist only when baseline changes (Loop-Free Version)
    useEffect(() => {
        if (
            studentBaselineReport?.checklistForm?.length > 0 &&
            (!addIEPData?.checkList || addIEPData?.checkList?.length === 0)
        ) {
            console.log("Setting Checklist Data...");
            const listData = checklistHeaders(
                studentBaselineReport?.checklistForm,
            )?.map((d) => ({
                category: d?.trim(),
                shortTermGoal: [],
                longTermGoal: [],
            }))
            // Use functional setState to avoid depending on current addIEPData
            setAddIEPData((prevData) => ({ ...prevData, checkList: listData }))
        }
        // 🟢 BOMB DEFUSED: Yahan se 'addIEPData?.checkList?.length' hata diya hai!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentBaselineReport?.checklistForm])
	// Effect 3: Validate form state - with ALL dependencies
	// 🟢 LEGACY RECORDS BYPASS: For legacy IEP records, keep button ALWAYS ENABLED
	useEffect(() => {
		// Check if this is a legacy record (if Evolution data exists, it's legacy)
		const isLegacyRecord = !!addIEPData?.Evolution && 
			Object.keys(addIEPData.Evolution).length > 0
		
		if (isLegacyRecord) {
			// Legacy records: FORCE button enabled (no validation)
			setIsBtnDisabled(false)
		} else {
			// New records: Run validation
			const isAnyEmpty = ValidationCheckforAddIEP(
				addIEPData,
				isBaselineExist,
				variants,
			)
			setIsBtnDisabled(!isAnyEmpty)
		}
	}, [addIEPData, isBaselineExist, variants, setIsBtnDisabled])

	return (
		<div>
			<Box className={flexStyles.flexColumn} gap={'20px'}>
				{IEPContentsList.map((category, index) => {
					return (
					<Box key={index} sx={{ mt: '20px' }}>
							<CustomCollapsibleComponent
								open={modal[index]}
								title={category}
								onClick={() =>
									handleModal(index, !modal[index])
								}
								titleSx={{ fontSize: '16px' }}
							>
								{index === 0 && (
									<BaselineCategoryIEP
										data={
											studentBaselineReport?.baselinePerformance ??
											{}
										}
										comments={addIEPData?.baselineComments}
										setComments={(title, data) =>
											setAddIEPData((prevData) => ({
												...prevData,
												baselineComments: {
													...prevData.baselineComments,
													[title]: data,
												},
											}))
										}
										readOnly={readOnly}
										isBaselineExist={isBaselineExist}
									/>
								)}
								{index === 1 && (
									<ChecklistData
										checklistData={addIEPData?.checkList}
										onChange={(data) => {
											setAddIEPData((prevData) => ({
												...prevData,
												checkList: data,
											}))
										}}
										readOnly={readOnly}
										variants={variants}
									/>
								)}
								{index === 2 ? (
									<Evolution
										data={addIEPData.Evolution}
										onChange={(data) => {
											if (
												JSON.stringify(
													addIEPData?.Evolution,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													Evolution: data,
												}))
											}
										}}
										setComments={(data) => {
											if (
												JSON.stringify(
													addIEPData?.Evolution?.[
														localizationConstants
															.comments
													],
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													Evolution: {
														...prevData.Evolution,
														[localizationConstants.comments]:
															data,
													},
												}))
											}
										}}
										readOnly={readOnly}
									/>
								) : null}

								{index === 3 && (
									<AccFromBoard
										data={
											addIEPData?.AccommodationFromBoard ??
											{}
										}
										onChange={(data) => {
											if (
												JSON.stringify(
													addIEPData?.AccommodationFromBoard,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													AccommodationFromBoard:
														data,
												}))
											}
										}}
										readOnly={readOnly}
									/>
								)}

								{index === 4 ? (
									<InternalAccomodation
										data={addIEPData.internalAccommodation}
										onChange={(data) => {
											if (
												JSON.stringify(
													addIEPData?.internalAccommodation,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													internalAccommodation: data,
												}))
											}
										}}
										setComments={(title, data) => {
											if (
												JSON.stringify(
													addIEPData
														?.internalAccommodation?.[
														title
													]?.comments,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													internalAccommodation: {
														...prevData.internalAccommodation,
														[title]: {
															...prevData
																?.internalAccommodation?.[
																title
															],
															comments: data,
														},
													},
												}))
											}
										}}
										readOnly={readOnly}
									/>
								) : null}

								{index === 5 ? (
									<TransitionPlanning
										data={addIEPData.TransitionPlanning}
										onChange={(data) => {
											if (
												JSON.stringify(
													addIEPData?.TransitionPlanning,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													TransitionPlanning: data,
												}))
											}
										}}
										setComments={(title, data) => {
											if (
												JSON.stringify(
													addIEPData
														?.TransitionPlanning?.[
														title
													]?.comments,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													TransitionPlanning: {
														...prevData.TransitionPlanning,
														[title]: {
															...prevData
																?.TransitionPlanning?.[
																title
															],
															comments: data,
														},
													},
												}))
											}
										}}
										readOnly={readOnly}
									/>
								) : null}

								{index === 6 ? (
									<PlacementWithSend
										data={addIEPData.PlacementWithSEND}
										onChange={(data) => {
											if (
												JSON.stringify(
													addIEPData?.PlacementWithSEND,
												) !== JSON.stringify(data)
											) {
												setAddIEPData((prevData) => ({
													...prevData,
													PlacementWithSEND: data,
												}))
											}
										}}
										readOnly={readOnly}
									/>
								) : null}
							</CustomCollapsibleComponent>
						</Box>
					)
				})}
			</Box>
		</div>
	)
}

export default IEPForm
