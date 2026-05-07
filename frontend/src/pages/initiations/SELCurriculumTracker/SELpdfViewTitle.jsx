// import { Box, Typography, IconButton, Divider, Toolbar } from '@mui/material'
// import React from 'react'
// import { selPDFViewStyles } from './SELStyles'
// import { typographyConstants } from '../../../resources/theme/typographyConstants'
// import { localizationConstants } from '../../../resources/theme/localizationConstants'
// import CustomIcon from '../../../components/CustomIcon'
// import { iconConstants } from '../../../resources/theme/iconConstants'
// import NavigateNextIcon from '@mui/icons-material/NavigateNext'
// import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
// import AddIcon from '@mui/icons-material/Add'
// import RemoveIcon from '@mui/icons-material/Remove'
// import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined' // Hand
// import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined' // Laser
// import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined' // Sidebar
// import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined' // Highlighter
// import FormatClearOutlinedIcon from '@mui/icons-material/FormatClearOutlined' // Eraser Tool
// import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined' // Undo Button
// import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined' // Clear All

// export const presentationTools = {
//   NONE: 'none',
//   HAND: 'hand',
//   LASER: 'laser',
//   HIGHLIGHTER: 'highlighter',
//   ERASER: 'eraser' // 🎯 Naya Eraser Tool
// }

// export const SELpdfViewTitle = ({
//   fileViewMode, handleBackToList, selectedCategory, onClose, monthOptions, selectedMonth, onMonthSelect,
//   zoom, increaseZoom, decreaseZoom, isPDF, activeTool, setActiveTool, isSidebarOpen, toggleSidebar,
//   clearAllDrawings, handleUndo // 🎯 Undo prop
// }) => {
//   const handleMonthChange = (value) => { if (onMonthSelect) onMonthSelect(value) }
//   const isToolActive = (toolName) => activeTool === toolName

//   return (
//     <Box sx={{
//       ...selPDFViewStyles.headerBox, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//       padding: '8px 16px', minHeight: '64px', boxSizing: 'border-box'
//     }}>
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//         {fileViewMode && isPDF && (
//           <IconButton onClick={toggleSidebar} color={isSidebarOpen ? "primary" : "default"} title="Toggle Thumbnails">
//             <GridViewOutlinedIcon />
//           </IconButton>
//         )}
//         {fileViewMode ? (
//           <Box sx={{ ...selPDFViewStyles.titleBox, display: 'flex', alignItems: 'center', gap: '2px' }}>
//             <Typography variant={typographyConstants.h4} sx={selPDFViewStyles.coloredTitle} onClick={handleBackToList} style={{ cursor: 'pointer', margin: 0, padding: 0 }}>
//               {selectedCategory.category?.categoryName}
//             </Typography>
//             <NavigateNextIcon sx={{ height: '24px', width: '24px', display: 'flex', color: '#888' }} />
//             <Typography variant={typographyConstants.h4} sx={{ ...selPDFViewStyles.title, margin: 0, padding: 0 }}>
//               {selectedCategory.file?.fileName}
//             </Typography>
//           </Box>
//         ) : (
//           <Typography variant={typographyConstants.h4} sx={{ ...selPDFViewStyles.title, margin: 0 }}>
//             {localizationConstants.selTracker}
//           </Typography>
//         )}
//       </Box>

//       <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
//         {fileViewMode && isPDF && (
//           <Toolbar variant="dense" sx={{
//             backgroundColor: '#f5f5f7', borderRadius: '12px', padding: '0px 10px !important', 
//             boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '4px',
//             '& .MuiIconButton-root': { padding: '8px', borderRadius: '8px' }
//           }}>
//             <IconButton onClick={() => setActiveTool(presentationTools.HAND)} color={isToolActive(presentationTools.HAND) ? "primary" : "default"} title="Hand Tool (Pan & Scroll)">
//               <TouchAppOutlinedIcon />
//             </IconButton>

//             <IconButton onClick={() => setActiveTool(presentationTools.LASER)} color={isToolActive(presentationTools.LASER) ? "secondary" : "default"} title="Laser Pointer">
//               <FlashOnOutlinedIcon />
//             </IconButton>

//             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//             <IconButton onClick={() => setActiveTool(presentationTools.HIGHLIGHTER)} color={isToolActive(presentationTools.HIGHLIGHTER) ? "warning" : "default"} title="Highlighter Tool">
//               <BrushOutlinedIcon />
//             </IconButton>

//             {/* 🎯 Naya ERASER Tool */}
//             <IconButton onClick={() => setActiveTool(presentationTools.ERASER)} color={isToolActive(presentationTools.ERASER) ? "error" : "default"} title="Eraser (Erase specific highlights)">
//               <FormatClearOutlinedIcon />
//             </IconButton>

//             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//             {/* 🎯 Naya UNDO & CLEAR Buttons */}
//             <IconButton onClick={handleUndo} title="Undo Last Highlight" sx={{ '&:hover': { color: '#1976d2' } }}>
//               <UndoOutlinedIcon />
//             </IconButton>

//             <IconButton onClick={clearAllDrawings} title="Clear All Highlights" sx={{ '&:hover': { color: '#d32f2f' } }}>
//               <DeleteOutlineOutlinedIcon />
//             </IconButton>

//             <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
//               <IconButton onClick={decreaseZoom} size='small'><RemoveIcon fontSize="small" /></IconButton>
//               <Typography sx={{ fontWeight: 'bold', fontSize: '13px', minWidth: '40px', textAlign: 'center', color: '#333', margin: 0 }}>{Math.round(zoom * 100)}%</Typography>
//               <IconButton onClick={increaseZoom} size='small'><AddIcon fontSize="small" /></IconButton>
//             </Box>
//           </Toolbar>
//         )}

//         {!fileViewMode && (
//           <CustomAutocompleteNew fieldSx={{ height: '40px', width: '200px' }} value={selectedMonth} placeholder={`${localizationConstants.select} ${localizationConstants.month}`} onChange={handleMonthChange} options={monthOptions} disabled={fileViewMode} />
//         )}

//         <CustomIcon name={iconConstants.cancelRounded} onClick={fileViewMode ? handleBackToList : onClose} style={{ ...selPDFViewStyles.iconStyle, display: 'flex' }} svgStyle={{ width: '32px', height: '32px', cursor: 'pointer' }} />
//       </Box>
//     </Box>
//   )
// }

import { Box, Typography, IconButton, Toolbar } from '@mui/material'
import React from 'react'
import { selPDFViewStyles } from './SELStyles'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import CustomIcon from '../../../components/CustomIcon'
import { iconConstants } from '../../../resources/theme/iconConstants'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'

// Ab tools ki zaroorat nahi hai iframe ke sath
export const presentationTools = { NONE: 'none' }

export const SELpdfViewTitle = ({
  fileViewMode, handleBackToList, selectedCategory, onClose, monthOptions, selectedMonth, onMonthSelect
}) => {
  const handleMonthChange = (value) => { if (onMonthSelect) onMonthSelect(value) }

  return (
    <Box sx={{
      ...selPDFViewStyles.headerBox, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 16px', minHeight: '64px', boxSizing: 'border-box'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {fileViewMode ? (
          <Box sx={{ ...selPDFViewStyles.titleBox, display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Typography variant={typographyConstants.h4} sx={selPDFViewStyles.coloredTitle} onClick={handleBackToList} style={{ cursor: 'pointer', margin: 0, padding: 0 }}>
              {selectedCategory.category?.categoryName}
            </Typography>
            <NavigateNextIcon sx={{ height: '24px', width: '24px', display: 'flex', color: '#888' }} />
            <Typography variant={typographyConstants.h4} sx={{ ...selPDFViewStyles.title, margin: 0, padding: 0 }}>
              {selectedCategory.file?.fileName}
            </Typography>
          </Box>
        ) : (
          <Typography variant={typographyConstants.h4} sx={{ ...selPDFViewStyles.title, margin: 0 }}>
            {localizationConstants.selTracker}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* 🔥 Iframe ka apna native toolbar hota hai, isliye humne yahan se custom highlighter/zoom hata diye hain */}

        {!fileViewMode && (
          <CustomAutocompleteNew fieldSx={{ height: '40px', width: '200px' }} value={selectedMonth} placeholder={`${localizationConstants.select} ${localizationConstants.month}`} onChange={handleMonthChange} options={monthOptions} disabled={fileViewMode} />
        )}

        <CustomIcon name={iconConstants.cancelRounded} onClick={fileViewMode ? handleBackToList : onClose} style={{ ...selPDFViewStyles.iconStyle, display: 'flex' }} svgStyle={{ width: '32px', height: '32px', cursor: 'pointer' }} />
      </Box>
    </Box>
  )
}