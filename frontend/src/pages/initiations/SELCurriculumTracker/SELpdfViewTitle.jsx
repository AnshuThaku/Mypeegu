import { Box, Typography, IconButton, Divider, Toolbar } from '@mui/material'
import React from 'react'
import { selPDFViewStyles } from './SELStyles'
import { typographyConstants } from '../../../resources/theme/typographyConstants'
import { localizationConstants } from '../../../resources/theme/localizationConstants'
import CustomIcon from '../../../components/CustomIcon'
import { iconConstants } from '../../../resources/theme/iconConstants'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import CustomAutocompleteNew from '../../../components/commonComponents/CustomAutoComplete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined' 
import FlashOnOutlinedIcon from '@mui/icons-material/FlashOnOutlined' 
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined' 
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined' 
import FormatClearOutlinedIcon from '@mui/icons-material/FormatClearOutlined' 
import UndoOutlinedIcon from '@mui/icons-material/UndoOutlined' 
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined' 

export const presentationTools = {
  NONE: 'none',
  HAND: 'hand',
  LASER: 'laser',
  HIGHLIGHTER: 'highlighter',
  ERASER: 'eraser'
}

export const SELpdfViewTitle = ({
  fileViewMode, handleBackToList, selectedCategory, onClose, monthOptions, selectedMonth, onMonthSelect,
  zoom, increaseZoom, decreaseZoom, isPDF, activeTool, setActiveTool, isSidebarOpen, toggleSidebar,
  clearAllDrawings, handleUndo 
}) => {
  const handleMonthChange = (value) => { if (onMonthSelect) onMonthSelect(value) }
  const isToolActive = (toolName) => activeTool === toolName

  return (
    <Box sx={{
      ...selPDFViewStyles.headerBox, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 16px', minHeight: '64px', boxSizing: 'border-box'
    }}>
      {/* 🔥 LEFT SIDE (Title Area) - Added flex: 1 and minWidth: 0 to allow truncation */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0, mr: 2 }}>
        {fileViewMode && isPDF && (
          <IconButton onClick={toggleSidebar} color={isSidebarOpen ? "primary" : "default"} title="Toggle Thumbnails">
            <GridViewOutlinedIcon />
          </IconButton>
        )}
        {fileViewMode ? (
          <Box sx={{ ...selPDFViewStyles.titleBox, display: 'flex', alignItems: 'center', gap: '2px', overflow: 'hidden' }}>
            
            <Typography variant={typographyConstants.h4} sx={{ ...selPDFViewStyles.coloredTitle, whiteSpace: 'nowrap' }} onClick={handleBackToList} style={{ cursor: 'pointer', margin: 0, padding: 0 }}>
              {selectedCategory.category?.categoryName}
            </Typography>
            
            <NavigateNextIcon sx={{ height: '24px', width: '24px', display: 'flex', color: '#888', flexShrink: 0 }} />
            
            {/* 🔥 YAHAN FIX HAI: Lamba naam ab ek line mein rahega aur "..." aayega */}
            <Typography 
              variant={typographyConstants.h4} 
              title={selectedCategory.file?.fileName} // Hover karne pe poora naam dikhega
              sx={{ 
                ...selPDFViewStyles.title, 
                margin: 0, 
                padding: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: { xs: '150px', sm: '250px', md: '400px' } // Screen ke hisaab se max width
              }}
            >
              {selectedCategory.file?.fileName}
            </Typography>

          </Box>
        ) : (
          <Typography variant={typographyConstants.h4} sx={{ ...selPDFViewStyles.title, margin: 0 }}>
            {localizationConstants.selTracker}
          </Typography>
        )}
      </Box>

      {/* 🔥 RIGHT SIDE (Toolbar Area) - Added flexShrink: 0 so buttons don't get squished */}
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center', flexShrink: 0 }}>
        {fileViewMode && isPDF && (
          <Toolbar variant="dense" sx={{
            backgroundColor: '#f5f5f7', borderRadius: '12px', padding: '0px 10px !important', 
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '4px', height: '48px', // Fixed height so icons don't stretch
            '& .MuiIconButton-root': { padding: '8px', borderRadius: '8px' }
          }}>
            <IconButton onClick={() => setActiveTool(presentationTools.HAND)} color={isToolActive(presentationTools.HAND) ? "primary" : "default"} title="Hand Tool (Pan & Scroll)">
              <TouchAppOutlinedIcon />
            </IconButton>

            <IconButton onClick={() => setActiveTool(presentationTools.LASER)} color={isToolActive(presentationTools.LASER) ? "secondary" : "default"} title="Laser Pointer">
              <FlashOnOutlinedIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />

            <IconButton onClick={() => setActiveTool(presentationTools.HIGHLIGHTER)} color={isToolActive(presentationTools.HIGHLIGHTER) ? "warning" : "default"} title="Highlighter Tool">
              <BrushOutlinedIcon />
            </IconButton>

            <IconButton onClick={() => setActiveTool(presentationTools.ERASER)} color={isToolActive(presentationTools.ERASER) ? "error" : "default"} title="Eraser (Erase specific highlights)">
              <FormatClearOutlinedIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />

            <IconButton onClick={handleUndo} title="Undo Last Highlight" sx={{ '&:hover': { color: '#1976d2' } }}>
              <UndoOutlinedIcon />
            </IconButton>

            <IconButton onClick={clearAllDrawings} title="Clear All Highlights" sx={{ '&:hover': { color: '#d32f2f' } }}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
              <IconButton onClick={decreaseZoom} size='small'><RemoveIcon fontSize="small" /></IconButton>
              <Typography sx={{ fontWeight: 'bold', fontSize: '13px', minWidth: '40px', textAlign: 'center', color: '#333', margin: 0 }}>{Math.round(zoom * 100)}%</Typography>
              <IconButton onClick={increaseZoom} size='small'><AddIcon fontSize="small" /></IconButton>
            </Box>
          </Toolbar>
        )}

        {!fileViewMode && (
          <CustomAutocompleteNew fieldSx={{ height: '40px', width: '200px' }} value={selectedMonth} placeholder={`${localizationConstants.select} ${localizationConstants.month}`} onChange={handleMonthChange} options={monthOptions} disabled={fileViewMode} />
        )}

        <CustomIcon name={iconConstants.cancelRounded} onClick={fileViewMode ? handleBackToList : onClose} style={{ ...selPDFViewStyles.iconStyle, display: 'flex' }} svgStyle={{ width: '32px', height: '32px', cursor: 'pointer' }} />
      </Box>
    </Box>
  )
}