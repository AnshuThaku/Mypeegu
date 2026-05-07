// import {
//     Box,
//     Divider,
//     FormControl,
//     FormControlLabel,
//     Radio,
//     RadioGroup,
//     Typography,
// } from '@mui/material'
// import React, { useEffect, useState } from 'react'
// import CustomCollapsibleComponent from './CustomCollapsibleComponent'
// import { typographyConstants } from '../resources/theme/typographyConstants'
// import { localizationConstants } from '../resources/theme/localizationConstants'
// import useCommonStyles from './styles'
// import { getBackgroundColor } from '../pages/initiations/sendCheckList/sendChecklistFunction'

// const QuestionsCollapsibleComponent = ({
//     open,
//     onClick,
//     qusetionChange,
//     questionList,
//     isEditable,
//     isCollapsable,
//     isVersion2, // <--- NAYA PROP ADD KIYA HAI
// }) => {
//     const flexStyles = useCommonStyles()
//     const [selectedSubQuestion, setSelectedSubQuestion] = useState('')
//     const [questionsData, setQuestionsData] = useState({})

//     useEffect(() => {
//         if (questionList?.subQuestions) {
//             if (selectedSubQuestion?.length === 0) {
//                 setSelectedSubQuestion(questionList?.subQuestions?.[0]?.title)
//                 setQuestionsData(questionList?.subQuestions?.[0])
//             } else {
//                 setQuestionsData(
//                     questionList?.subQuestions?.find(
//                         (data) => data?.title === selectedSubQuestion,
//                     ),
//                 )
//             }
//         } else {
//             setQuestionsData(questionList)
//         }
//     }, [questionList, selectedSubQuestion])

//     const renderBody = () => {
//         return (
//             <Box>
//                 <Box
//                     className={flexStyles.flexRowAlignCenter}
//                     gap={'15px'}
//                     sx={{
//                         display: 'flex',
//                         mb:
//                             !isCollapsable && questionList?.subQuestions
//                                 ? '20px'
//                                 : questionList?.subQuestions
//                                     ? '20px'
//                                     : 'none',
//                         flexWrap: isCollapsable ? 'none' : 'wrap',
//                         mt: '10px',
//                         justifyContent: isCollapsable
//                             ? 'none'
//                             : 'space-between',
//                     }}
//                 >
//                     {questionList?.subQuestions?.map((data, i) => {
//                         return (
//                             <Box
//                                 key={i}
//                                 sx={{
//                                     ...(!isCollapsable &&
//                                     questionList?.title ===
//                                         localizationConstants.socialSkills
//                                         ? { flexGrow: 1 }
//                                         : !isCollapsable
//                                             ? { width: '48%' }
//                                             : {}),
//                                 }}
//                             >
//                                 <Box
//                                     sx={{
//                                         minWidth: isCollapsable
//                                             ? '225px'
//                                             : '150px',
//                                         height: isCollapsable ? '43px' : '32px',
//                                         border: '1px solid',
//                                         borderColor:
//                                             selectedSubQuestion === data?.title
//                                                 ? 'globalElementColors.ceruleanBlue'
//                                                 : 'globalElementColors.blue',
//                                         backgroundColor:
//                                             selectedSubQuestion === data?.title
//                                                 ? 'globalElementColors.ceruleanBlue'
//                                                 : 'none',
//                                         borderRadius: '6px',
//                                         cursor: 'pointer',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         paddingRight: isCollapsable
//                                             ? '10px'
//                                             : 'none',
//                                         paddingLeft: isCollapsable
//                                             ? '10px'
//                                             : 'none',
//                                     }}
//                                     onClick={() => {
//                                         setSelectedSubQuestion(data?.title)
//                                         setQuestionsData(data)
//                                     }}
//                                 >
//                                     <Typography
//                                         sx={{
//                                             fontWeight: 500,
//                                             fontSize: isCollapsable
//                                                 ? '17px'
//                                                 : '14px',
//                                             color:
//                                                 selectedSubQuestion ===
//                                                 data?.title
//                                                     ? 'globalElementColors.white'
//                                                     : 'globalElementColors.blue',
//                                             p: '5px',
//                                         }}
//                                     >
//                                         {data?.title}
//                                     </Typography>
//                                 </Box>
//                             </Box>
//                         )
//                     })}
//                 </Box>
//                 {!isCollapsable && questionList?.subQuestions ? (
//                     <Box
//                         className={flexStyles.flexRowCenterSpaceBetween}
//                         sx={{
//                             mb: '20px',
//                             borderRadius: '4px',
//                             backgroundColor: getBackgroundColor(
//                                 questionsData?.total ?? 0,
//                                 questionsData?.totalQuestions ?? 0,
//                                 true,
//                             ),
//                             minHeight: '39px',
//                             pl: '16px',
//                             pr: '16px',
//                         }}
//                     >
//                         <Box
//                             className={flexStyles.flexRowCenterSpaceBetween}
//                             sx={{ width: '100%' }}
//                         >
//                             <Typography
//                                 variant={typographyConstants.h4}
//                                 sx={{ fontSize: '20px', color: '#08091D' }}
//                             >
//                                 {localizationConstants.total}
//                             </Typography>
//                             <Typography
//                                 variant={typographyConstants.h4}
//                                 sx={{ fontSize: '20px', color: '#08091D' }}
//                             >
//                                 {questionsData?.total ?? 0}
//                             </Typography>
//                         </Box>
//                     </Box>
//                 ) : null}
//                 <Box>
//                     {questionsData?.qusetions?.map((_, index) => {
//                         return (
//                             <Box
//                                 className={flexStyles.flexColumn}
//                                 sx={{ mt: index === 0 ? '0px' : '10px' }}
//                                 gap={'10px'}
//                                 key={index}
//                             >
//                                 <Typography
//                                     variant={typographyConstants.title}
//                                     sx={{ fontSize: '16px' }}
//                                 >
//                                     {questionsData?.qusetions?.[index]?.qns_no}.{' '}
//                                     {
//                                         questionsData?.qusetions?.[index]
//                                             ?.question
//                                     }
//                                 </Typography>
//                                 <Box
//                                     className={
//                                         flexStyles.flexRowAlighnItemsCenter
//                                     }
//                                 >
//                                     <FormControl
//                                         sx={{ pl: '20px' }}
//                                         disabled={!isEditable}
//                                     >
//                                         <RadioGroup
//                                             row
//                                             aria-labelledby='demo-row-radio-buttons-group-label'
//                                             name={`row-radio-buttons-group-${index}`}
//                                         >
//                                             {isVersion2 ? (
//                                                 /* ================= V2: 4 OPTIONS ================= */
//                                                 <>
//                                                     <FormControlLabel
//                                                         disabled={!isEditable}
//                                                         value='Score'
//                                                         control={<Radio checked={questionsData?.selection?.[index]?.answer === 'Score'} />}
//                                                         label='Score'
//                                                         onClick={() => { if (isEditable) qusetionChange?.(index, 'Score', questionList?.title, !!questionList?.subQuestions, questionsData?.title) }}
//                                                     />
//                                                     <FormControlLabel
//                                                         disabled={!isEditable}
//                                                         value='Achieved'
//                                                         control={<Radio checked={questionsData?.selection?.[index]?.answer === 'Achieved' || questionsData?.selection?.[index]?.answer === 'yes' || questionsData?.selection?.[index]?.answer === true} />}
//                                                         label='Achieved'
//                                                         onClick={() => { if (isEditable) qusetionChange?.(index, 'Achieved', questionList?.title, !!questionList?.subQuestions, questionsData?.title) }}
//                                                     />
//                                                     <FormControlLabel
//                                                         disabled={!isEditable}
//                                                         value='Emerging'
//                                                         control={<Radio checked={questionsData?.selection?.[index]?.answer === 'Emerging'} />}
//                                                         label='Emerging'
//                                                         onClick={() => { if (isEditable) qusetionChange?.(index, 'Emerging', questionList?.title, !!questionList?.subQuestions, questionsData?.title) }}
//                                                     />
//                                                     <FormControlLabel
//                                                         disabled={!isEditable}
//                                                         value='Not Achieved'
//                                                         control={<Radio checked={questionsData?.selection?.[index]?.answer === 'Not Achieved' || questionsData?.selection?.[index]?.answer === 'no' || questionsData?.selection?.[index]?.answer === false} />}
//                                                         label='Not Achieved'
//                                                         onClick={() => { if (isEditable) qusetionChange?.(index, 'Not Achieved', questionList?.title, !!questionList?.subQuestions, questionsData?.title) }}
//                                                     />
//                                                 </>
//                                             ) : (
//                                                 /* ================= V1: 2 OPTIONS (Yes/No) ================= */
//                                                 <>
//                                                     <FormControlLabel
//                                                         disabled={!isEditable}
//                                                         value='Yes'
//                                                         control={<Radio checked={questionsData?.selection?.[index]?.answer === 'yes' || questionsData?.selection?.[index]?.answer === true || questionsData?.selection?.[index]?.answer === 'Achieved'} />}
//                                                         label='Yes'
//                                                         onClick={() => { if (isEditable) qusetionChange?.(index, 'yes', questionList?.title, !!questionList?.subQuestions, questionsData?.title) }}
//                                                     />
//                                                     <FormControlLabel
//                                                         disabled={!isEditable}
//                                                         value='No'
//                                                         control={<Radio checked={questionsData?.selection?.[index]?.answer === 'no' || questionsData?.selection?.[index]?.answer === false || questionsData?.selection?.[index]?.answer === 'Not Achieved'} />}
//                                                         label='No'
//                                                         onClick={() => { if (isEditable) qusetionChange?.(index, 'no', questionList?.title, !!questionList?.subQuestions, questionsData?.title) }}
//                                                     />
//                                                 </>
//                                             )}
//                                         </RadioGroup>
//                                     </FormControl>
//                                 </Box>
//                             </Box>
//                         )
//                     })}
//                 </Box>
//                 {isCollapsable ? (
//                     <>
//                         <Divider sx={{ mt: '10px' }} />
//                         <Box
//                             className={flexStyles.flexRowFlexEnd}
//                             sx={{ mt: '10px' }}
//                         >
//                             {' '}
//                             <Typography
//                                 variant={typographyConstants.body2}
//                                 color={
//                                     getBackgroundColor(
//                                         questionsData?.total ?? 0,
//                                         questionsData?.totalQuestions ?? 0,
//                                     ) ?? 'globalElementColors.black'
//                                 }
//                             >
//                                 {`${localizationConstants.total} =  ${questionsData?.total ?? 0}`}
//                             </Typography>{' '}
//                         </Box>
//                     </>
//                 ) : null}
//             </Box>
//         )
//     }
//     return (
//         <Box>
//             {isCollapsable ? (
//                 <CustomCollapsibleComponent
//                     open={open}
//                     title={questionList?.title}
//                     onClick={onClick}
//                     titleSx={{ fontSize: '17px' }}
//                     titleRightSide={
//                         open && !questionList?.subQuestions ? null : (
//                             <Box
//                                 sx={{
//                                     borderRadius: '34px',
//                                     height: '32px',
//                                     minWidth: '114px',
//                                     p: '0px 10px',
//                                     backgroundColor:
//                                         'globalElementColors.white',
//                                     display: 'flex',
//                                     justifyContent: 'center',
//                                     alignItems: 'center',
//                                 }}
//                             >
//                                 <Typography
//                                     variant={typographyConstants.body2}
//                                     color={
//                                         getBackgroundColor(
//                                             questionList?.total ?? 0,
//                                             questionList?.totalQuestions ?? 0,
//                                         ) ?? 'globalElementColors.black'
//                                     }
//                                 >
//                                     {`${localizationConstants.total} =  ${questionList?.total ?? 0}`}
//                                 </Typography>
//                             </Box>
//                         )
//                     }
//                 >
//                     {renderBody()}
//                 </CustomCollapsibleComponent>
//             ) : (
//                 <Box>{renderBody()}</Box>
//             )}
//         </Box>
//     )
// }

// export default QuestionsCollapsibleComponent

/* eslint-disable react-hooks/exhaustive-deps */
import {
    Box,
    Divider,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import CustomCollapsibleComponent from './CustomCollapsibleComponent'
import { typographyConstants } from '../resources/theme/typographyConstants'
import { localizationConstants } from '../resources/theme/localizationConstants'
import useCommonStyles from './styles'
import { getBackgroundColor } from '../pages/initiations/sendCheckList/sendChecklistFunction'

const QuestionsCollapsibleComponent = ({
    open,
    onClick,
    qusetionChange,
    questionList,
    isEditable,
    isCollapsable,
    optionsArray = ['Yes', 'No'], // <--- Naya Prop: default Yes/No rahega
}) => {
    const flexStyles = useCommonStyles()
    const [selectedSubQuestion, setSelectedSubQuestion] = useState('')
    const [questionsData, setQuestionsData] = useState({})

    useEffect(() => {
        if (questionList?.subQuestions) {
            if (selectedSubQuestion?.length === 0) {
                setSelectedSubQuestion(questionList?.subQuestions?.[0]?.title)
                setQuestionsData(questionList?.subQuestions?.[0])
            } else {
                setQuestionsData(
                    questionList?.subQuestions?.find(
                        (data) => data?.title === selectedSubQuestion,
                    ),
                )
            }
        } else {
            setQuestionsData(questionList)
        }
    }, [questionList, selectedSubQuestion])

    const renderBody = () => {
        return (
            <Box>
                <Box
                    className={flexStyles.flexRowAlignCenter}
                    gap={'15px'}
                    sx={{
                        display: 'flex',
                        mb: !isCollapsable && questionList?.subQuestions ? '20px' : questionList?.subQuestions ? '20px' : 'none',
                        flexWrap: isCollapsable ? 'none' : 'wrap',
                        mt: '10px',
                        justifyContent: isCollapsable ? 'none' : 'space-between',
                    }}
                >
                    {questionList?.subQuestions?.map((data, i) => {
                        return (
                            <Box
                                key={i}
                                sx={{
                                    ...(!isCollapsable &&
                                    questionList?.title === localizationConstants.socialSkills
                                        ? { flexGrow: 1 }
                                        : !isCollapsable ? { width: '48%' } : {}),
                                }}
                            >
                                <Box
                                    sx={{
                                        minWidth: isCollapsable ? '225px' : '150px',
                                        height: isCollapsable ? '43px' : '32px',
                                        border: '1px solid',
                                        borderColor: selectedSubQuestion === data?.title ? 'globalElementColors.ceruleanBlue' : 'globalElementColors.blue',
                                        backgroundColor: selectedSubQuestion === data?.title ? 'globalElementColors.ceruleanBlue' : 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingRight: isCollapsable ? '10px' : 'none',
                                        paddingLeft: isCollapsable ? '10px' : 'none',
                                    }}
                                    onClick={() => {
                                        setSelectedSubQuestion(data?.title)
                                        setQuestionsData(data)
                                    }}
                                >
                                    <Typography
                                        sx={{
                                            fontWeight: 500,
                                            fontSize: isCollapsable ? '17px' : '14px',
                                            color: selectedSubQuestion === data?.title ? 'globalElementColors.white' : 'globalElementColors.blue',
                                            p: '5px',
                                        }}
                                    >
                                        {data?.title}
                                    </Typography>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>
                
                {!isCollapsable && questionList?.subQuestions ? (
                    <Box
                        className={flexStyles.flexRowCenterSpaceBetween}
                        sx={{
                            mb: '20px',
                            borderRadius: '4px',
                            backgroundColor: getBackgroundColor(questionsData?.total ?? 0, questionsData?.totalQuestions ?? 0, true),
                            minHeight: '39px',
                            pl: '16px',
                            pr: '16px',
                        }}
                    >
                        <Box className={flexStyles.flexRowCenterSpaceBetween} sx={{ width: '100%' }}>
                            <Typography variant={typographyConstants.h4} sx={{ fontSize: '20px', color: '#08091D' }}>
                                {localizationConstants.total}
                            </Typography>
                            <Typography variant={typographyConstants.h4} sx={{ fontSize: '20px', color: '#08091D' }}>
                                {questionsData?.total ?? 0}
                            </Typography>
                        </Box>
                    </Box>
                ) : null}

                <Box>
                    {questionsData?.qusetions?.map((q, index) => {
                        const currentAnswer = questionsData?.selection?.[index]?.answer;
                        return (
                            <Box
                                className={flexStyles.flexColumn}
                                sx={{ mt: index === 0 ? '0px' : '10px' }}
                                gap={'10px'}
                                key={index}
                            >
                                <Typography variant={typographyConstants.title} sx={{ fontSize: '16px' }}>
                                    {q?.qns_no}. {q?.question}
                                </Typography>
                                <Box className={flexStyles.flexRowAlighnItemsCenter}>
                                    <FormControl sx={{ pl: '20px' }} disabled={!isEditable}>
                                        <RadioGroup row name={`row-radio-buttons-group-${index}`}>
                                            {/* DYNAMIC OPTIONS MAPPING */}
                                            {optionsArray.map((opt) => (
                                                <FormControlLabel
                                                    key={opt}
                                                    disabled={!isEditable}
                                                    value={opt}
                                                    control={<Radio 
                                                        checked={
                                                            currentAnswer === opt || 
                                                            (opt === 'Yes' && (currentAnswer === 'yes' || currentAnswer === true)) ||
                                                            (opt === 'No' && (currentAnswer === 'no' || currentAnswer === false))
                                                        } 
                                                    />}
                                                    label={opt}
                                                    onClick={() => {
                                                        if (isEditable) {
                                                            // Backend support ke liye mapping: Agar 'Yes' hai toh 'yes' bhej rahe hain
                                                            const valToSend = (opt === 'Yes' || opt === 'No') ? opt.toLowerCase() : opt;
                                                            qusetionChange?.(index, valToSend, questionList?.title, !!questionList?.subQuestions, questionsData?.title)
                                                        }
                                                    }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Box>
                        )
                    })}
                </Box>

                {isCollapsable ? (
                    <>
                        <Divider sx={{ mt: '10px' }} />
                        <Box className={flexStyles.flexRowFlexEnd} sx={{ mt: '10px' }}>
                            <Typography
                                variant={typographyConstants.body2}
                                color={getBackgroundColor(questionsData?.total ?? 0, questionsData?.totalQuestions ?? 0) ?? 'globalElementColors.black'}
                            >
                                {`${localizationConstants.total} =  ${questionsData?.total ?? 0}`}
                            </Typography>
                        </Box>
                    </>
                ) : null}
            </Box>
        )
    }

    return (
        <Box>
            {isCollapsable ? (
                <CustomCollapsibleComponent
                    open={open}
                    title={questionList?.title}
                    onClick={onClick}
                    titleSx={{ fontSize: '17px' }}
                    titleRightSide={
                        open && !questionList?.subQuestions ? null : (
                            <Box
                                sx={{
                                    borderRadius: '34px',
                                    height: '32px',
                                    minWidth: '114px',
                                    p: '0px 10px',
                                    backgroundColor: 'globalElementColors.white',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography
                                    variant={typographyConstants.body2}
                                    color={getBackgroundColor(questionList?.total ?? 0, questionList?.totalQuestions ?? 0) ?? 'globalElementColors.black'}
                                >
                                    {`${localizationConstants.total} =  ${questionList?.total ?? 0}`}
                                </Typography>
                            </Box>
                        )
                    }
                >
                    {renderBody()}
                </CustomCollapsibleComponent>
            ) : (
                <Box>{renderBody()}</Box>
            )}
        </Box>
    )
}

export default QuestionsCollapsibleComponent