import { styled } from '@mui/material/styles'
import { Box, Card, RadioGroup, TextField } from '@mui/material'

export const MainWrapper = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: '#FFFFFF',
	minHeight: '100vh',
}))

// Search Bar Section (Gray Background)
export const ToolbarSection = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: theme.spacing(3),
	padding: theme.spacing(2),
	mb: 3,
	borderRadius: '8px',
	background: 'linear-gradient(90deg, #F8FBFF 0%, #F8FBFF 100%)',
}))

// Search Input (White Background inside gray toolbar)
export const SearchField = styled(TextField)({
	width: '350px',
	'& .MuiOutlinedInput-root': {
		borderRadius: '8px',
		backgroundColor: '#FFFFFF',
	},
})

// Info Card
export const HeaderCard = styled(Card)(({ theme }) => ({
	padding: theme.spacing(3),
	marginBottom: theme.spacing(4),
	borderRadius: '15px',
	border: '1px solid #E2E8F0',
	boxShadow: 'none',
	backgroundColor: '#FFFFFF',
}))

// Question Cards
export const QuestionCard = styled(Card)(({ theme }) => ({
	padding: theme.spacing(3),
	height: '100%',
	borderRadius: '16px',
	border: '1px solid #ECECEC',
	boxShadow: 'none',
	transition: '0.3s',
	backgroundColor: '#FFFFFF',
	'&:hover': {
		boxShadow: '0 8px 24px rgba(2, 103, 217, 0.08)',
		borderColor: '#0267D9',
	},
}))

// Option Group Background
export const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
	justifyContent: 'space-between',
	backgroundColor: '#F8FAFC',
	padding: theme.spacing(1.5),
	borderRadius: '10px',
	marginTop: theme.spacing(2),
}))

// Footer (Sticky)
export const StickyFooter = styled(Box)(({ theme }) => ({
	marginTop: theme.spacing(5),
	padding: theme.spacing(2),
	display: 'flex',
	justifyContent: 'flex-end',
	gap: theme.spacing(2),
	position: 'sticky',
	bottom: 0,
	backgroundColor: 'rgba(255, 255, 255, 0.9)',
	backdropFilter: 'blur(8px)',
	borderTop: '1px solid #F1F5F9',
	zIndex: 10,
}))
