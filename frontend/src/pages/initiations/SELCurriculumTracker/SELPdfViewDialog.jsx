// import { Dialog, Typography, Box, Skeleton, MenuItem, Select, CircularProgress } from '@mui/material'
// import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
// import { fetchAllSELTrackerModules } from './SELFunctions'
// import { Document, Page, pdfjs } from 'react-pdf'
// import { SELpdfViewTitle, presentationTools } from './SELpdfViewTitle'

// // ── API Imports ──
// import myPeeguAxios from '../../../utils/myPeeguAxios'
// import { apiEndPoints, apiMethods } from '../../../utils/apiConstants'

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

// const MONTHS_LIST = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ]

// // ── Theme ─────────────────────────────────────────────────────────────────────
// const THEME = {
//   blue: '#1565c0',
//   blueMid: '#1976d2',
//   blueLight: '#e3f0fd',
//   blueBorder: '#bbdefb',
//   blueHover: '#1e88e5',
//   text: '#1a2340',
//   textMuted: '#64748b',
//   bg: '#f4f6fa',
//   white: '#ffffff',
//   border: '#e8edf4',
// }

// const BADGE_COLORS = ['#1565c0', '#0277bd', '#00838f', '#2e7d32', '#6a1b9a', '#ad1457', '#e65100']

// const getDefaultZoom = (orientation, sidebarOpen) => {
//   if (orientation === 'landscape') return sidebarOpen ? 0.9 : 1.0
//   if (orientation === 'portrait')  return sidebarOpen ? 2.1 : 2.3
//   return 2.0 
// }

// // ─── Highlighter Canvas ───────────────────────────────────────────────────────
// const NativeHighlighter = ({ isActive, isEraser, clearTrigger, undoTrigger }) => {
//   const canvasRef = useRef(null)
//   const isDrawing = useRef(false)
//   const historyStack = useRef([])
//   const lastPos = useRef({ x: 0, y: 0 })

//   useEffect(() => {
//     const canvas = canvasRef.current
//     if (!canvas) return
//     const ro = new ResizeObserver(() => {
//       if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
//         canvas.width = canvas.offsetWidth
//         canvas.height = canvas.offsetHeight
//         const ctx = canvas.getContext('2d')
//         try { historyStack.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)] } catch (e) {}
//       }
//     })
//     ro.observe(canvas)
//     return () => ro.disconnect()
//   }, [])

//   useEffect(() => {
//     if (clearTrigger > 0 && canvasRef.current?.width > 0) {
//       const canvas = canvasRef.current
//       const ctx = canvas.getContext('2d')
//       ctx.clearRect(0, 0, canvas.width, canvas.height)
//       try { historyStack.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)] } catch (e) {}
//     }
//   }, [clearTrigger])

//   useEffect(() => {
//     if (undoTrigger > 0 && canvasRef.current && historyStack.current.length > 1) {
//       const canvas = canvasRef.current
//       const ctx = canvas.getContext('2d')
//       historyStack.current.pop()
//       const prev = historyStack.current[historyStack.current.length - 1]
//       if (prev) ctx.putImageData(prev, 0, 0)
//     }
//   }, [undoTrigger])

//   const startDrawing = (e) => {
//     if (!isActive && !isEraser) return
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')
//     const rect = canvas.getBoundingClientRect()
//     isDrawing.current = true
//     lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
//     ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
//     ctx.fillStyle = isEraser ? 'rgba(0,0,0,1)' : '#ffff00'
//     ctx.beginPath()
//     ctx.arc(lastPos.current.x, lastPos.current.y, isEraser ? 15 : 9, 0, Math.PI * 2)
//     ctx.fill()
//   }

//   const draw = (e) => {
//     if (!isDrawing.current || (!isActive && !isEraser)) return
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')
//     const rect = canvas.getBoundingClientRect()
//     const x = e.clientX - rect.left
//     const y = e.clientY - rect.top
//     ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
//     ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : '#ffff00'
//     ctx.lineWidth = isEraser ? 30 : 18
//     ctx.lineCap = 'round'; ctx.lineJoin = 'round'
//     ctx.beginPath()
//     ctx.moveTo(lastPos.current.x, lastPos.current.y)
//     ctx.lineTo(x, y); ctx.stroke()
//     lastPos.current = { x, y }
//   }

//   const stopDrawing = () => {
//     if (!isDrawing.current) return
//     isDrawing.current = false
//     const canvas = canvasRef.current
//     const ctx = canvas.getContext('2d')
//     if (canvas.width > 0 && canvas.height > 0)
//       historyStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
//   }

//   return (
//     <canvas
//       ref={canvasRef}
//       onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
//       style={{
//         position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
//         pointerEvents: (isActive || isEraser) ? 'auto' : 'none',
//         zIndex: 50, touchAction: 'none', mixBlendMode: 'multiply', opacity: isActive ? 0.8 : 1,
//       }}
//     />
//   )
// }

// // ─── Single PDF file row ──────────────────────────────────────────────────────
// const PdfFileRow = ({ file, category, onFileClick, index }) => {
//   const [hovered, setHovered] = useState(false)
//   return (
//     <Box
//       onClick={() => onFileClick(file, category)}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}
//       sx={{
//         display: 'flex', alignItems: 'center', gap: '11px',
//         px: '14px', py: '10px', mx: '8px', mb: '2px',
//         cursor: 'pointer', borderRadius: '10px',
//         backgroundColor: hovered ? THEME.blueLight : 'transparent',
//         transition: 'background-color 0.14s ease',
//       }}
//     >
//       <Box sx={{
//         width: 34, height: 34, borderRadius: '8px', flexShrink: 0,
//         backgroundColor: hovered ? THEME.blue : THEME.blueLight,
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         transition: 'all 0.15s ease',
//         boxShadow: hovered ? `0 3px 10px ${THEME.blue}40` : 'none',
//       }}>
//         <PictureAsPdfRoundedIcon sx={{ fontSize: 17, color: hovered ? '#fff' : THEME.blue }} />
//       </Box>
//       <Typography sx={{
//         fontSize: '13.5px', fontWeight: 400, flex: 1,
//         color: hovered ? THEME.blue : '#374151',
//         transition: 'color 0.14s ease', lineHeight: 1.45, wordBreak: 'break-word',
//       }}>
//         {file.fileName}
//       </Typography>
//     </Box>
//   )
// }

// // ─── Category accordion card ──────────────────────────────────────────────────
// const CategoryCard = ({ title, emoji, files, category, onFileClick, isOpen, onToggle, badgeColor }) => (
//   <Box sx={{
//     mb: '8px', borderRadius: '12px', overflow: 'hidden',
//     backgroundColor: THEME.white, border: '1px solid',
//     borderColor: isOpen ? THEME.blueBorder : THEME.border,
//     boxShadow: isOpen ? `0 2px 12px rgba(21,101,192,0.10)` : '0 1px 3px rgba(0,0,0,0.05)',
//     transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
//   }}>
//     <Box
//       onClick={onToggle}
//       sx={{
//         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//         px: '16px', py: '13px', cursor: 'pointer', userSelect: 'none',
//         backgroundColor: isOpen ? THEME.blueLight : '#fafbfd',
//         borderBottom: isOpen ? `1px solid ${THEME.blueBorder}` : '1px solid transparent',
//         transition: 'background-color 0.18s ease',
//         '&:hover': { backgroundColor: THEME.blueLight },
//       }}
//     >
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//         <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: badgeColor, flexShrink: 0 }} />
//         <Typography sx={{ fontWeight: 600, fontSize: '13.5px', color: THEME.text }}>
//           {emoji ? `${emoji} ` : ''}{title}
//         </Typography>
//         {files?.length > 0 && (
//           <Box sx={{
//             px: '7px', py: '1px', borderRadius: '20px',
//             backgroundColor: isOpen ? `${THEME.blue}15` : '#eef2f7',
//             border: `1px solid ${isOpen ? THEME.blueBorder : '#dde3ed'}`,
//           }}>
//             <Typography sx={{ fontSize: '11px', fontWeight: 700, color: isOpen ? THEME.blue : '#64748b' }}>
//               {files.length}
//             </Typography>
//           </Box>
//         )}
//       </Box>
//       <Box sx={{
//         width: 26, height: 26, borderRadius: '50%',
//         backgroundColor: isOpen ? THEME.blueBorder : '#eef2f7',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         transition: 'transform 0.22s ease',
//         transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0,
//       }}>
//         <KeyboardArrowDownRoundedIcon sx={{ fontSize: 17, color: isOpen ? THEME.blue : '#9ca3af' }} />
//       </Box>
//     </Box>
//     {isOpen && (
//       <Box sx={{ pt: '6px', pb: '8px' }}>
//         {files?.map((file, idx) => (
//           <PdfFileRow key={file._id || file.fileName} file={file} category={category} onFileClick={onFileClick} index={idx} />
//         ))}
//       </Box>
//     )}
//   </Box>
// )

// // ─── Main Component ───────────────────────────────────────────────────────────
// const SELPdfViewDialog = ({ open, onClose }) => {
//   // Safe Redux extractions
//   const { allSELTrackerModules } = useSelector((store) => store.selTrackerList || {})
//   const { countries } = useSelector((store) => store.dashboardSliceSetup || {})
//   
//   const dispatch = useDispatch()

//   const [fileViewMode, setFileViewMode] = useState(false)
//   const [selectedPdfUrl, setSelectedPdfUrl] = useState('')
//   const [selectedCategory, setSelectedCategory] = useState({})
//   const [openCollapsible, setOpenCollapsible] = useState({})
//   const [numPages, setNumPages] = useState(null)
//   const [isPdfLoaded, setIsPdfLoaded] = useState(false)
//   const [zoom, setZoom] = useState(2.0)
//   const [pdfOrientation, setPdfOrientation] = useState(null)

//   // ── SMART STATES: API se aane wale schools aur unke parameters ──
//   const [assignedSchoolsList, setAssignedSchoolsList] = useState([])
//   const [isLoadingSchools, setIsLoadingSchools] = useState(true)

//   const [selectedSchool, setSelectedSchool] = useState('')
//   const [selectedCountry, setSelectedCountry] = useState('')
//   const [selectedYear, setSelectedYear] = useState('')
//   const [selectedMonth, setSelectedMonth] = useState('')
//   const [availableYears, setAvailableYears] = useState([])
//   
//   const [currentMonthData, setCurrentMonthData] = useState(null)
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true)
//   const [activeTool, setActiveTool] = useState(presentationTools.HAND)
//   const [activePage, setActivePage] = useState(1)
//   const [clearTrigger, setClearTrigger] = useState(0)
//   const [undoTrigger, setUndoTrigger] = useState(0)

//   const laserPointerRef = useRef(null)
//   const pageRefs = useRef([])
//   const scrollContainerRef = useRef(null)
//   const baseURL = 'https://mypeegu-prodd.s3.ap-south-1.amazonaws.com'
//   const isInitialLoad = useRef(true)

//   const enterFullscreen = () => { try { if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {}) } catch (e) {} }
//   const exitFullscreen = () => { try { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}) } catch (e) {} }

//   // ── 1. Calculate Current and Previous Month (Sirf 2 Months) ──
//   const allowedMonths = useMemo(() => {
//     const date = new Date()
//     const currentMonthIdx = date.getMonth() 
//     const prevMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1
//     return [MONTHS_LIST[prevMonthIdx], MONTHS_LIST[currentMonthIdx]]
//   }, [])

//   // ── 2. Handle School Selection (Resolves Country ID to Name) ──
//   const handleSchoolChange = useCallback((schoolId, schoolsArray = assignedSchoolsList) => {
//     const schoolObj = schoolsArray.find(s => s._id === schoolId)
//     if (schoolObj) {
//       setSelectedSchool(schoolObj._id)
//       
//       // Extract country safely and resolve ID to Name
//       let countryName = 'India'
//       if (typeof schoolObj.country === 'object') {
//         countryName = schoolObj.country?.name || schoolObj.country?.countryName || 'India'
//       } else if (typeof schoolObj.country === 'string') {
//         const matchedCountry = countries?.find(c => c._id === schoolObj.country)
//         countryName = matchedCountry ? (matchedCountry.name || matchedCountry.countryName || 'India') : 'India'
//       }
//       
//       // Extract assigned years
//       const years = schoolObj.assignedSELYears || []
//       
//       setSelectedCountry(countryName)
//       setAvailableYears(years)
//       
//       // Auto-select first year if assigned, else blank
//       if (years.length > 0) {
//         setSelectedYear(years[0])
//       } else {
//         setSelectedYear('')
//       }
//     }
//   }, [assignedSchoolsList, countries])

//   // ── 3. Initial Load: Fetch Schools via API (POST method) ──
//   useEffect(() => {
//     const fetchSchools = async () => {
//       try {
//         setIsLoadingSchools(true)
//         
//         // POST method used for viewAllSchools API
//         const body = { page: 1, pageSize: 100 }
//         const response = await myPeeguAxios[apiMethods.post](apiEndPoints.viewAllSchools, body)
//         const schoolsData = response?.data?.data || response?.data || []
//         
//         setAssignedSchoolsList(schoolsData)
//         
//         // Set default month to current month
//         setSelectedMonth(allowedMonths[1]) 

//         // Auto-select the first school
//         if (schoolsData.length > 0) {
//           handleSchoolChange(schoolsData[0]._id, schoolsData)
//         }
//       } catch (error) {
//         console.error("Schools fetch failed:", error)
//       } finally {
//         setIsLoadingSchools(false)
//         isInitialLoad.current = false
//       }
//     }

//     if (open && isInitialLoad.current) {
//       fetchSchools()
//     }
//   }, [open, allowedMonths, handleSchoolChange])

//   // ── 4. Fetch SEL Modules when required filters are set ──
//   useEffect(() => {
//     if (selectedCountry && selectedYear && selectedMonth && !isInitialLoad.current && !isLoadingSchools) {
//       fetchAllSELTrackerModules(dispatch, selectedCountry, selectedYear, selectedMonth)
//     }
//   }, [selectedCountry, selectedYear, selectedMonth, isLoadingSchools, dispatch])

//   // Sync Redux Data
//   useEffect(() => {
//     if (allSELTrackerModules && Array.isArray(allSELTrackerModules)) {
//       const monthData = allSELTrackerModules.find((item) => item.month?.toLowerCase() === selectedMonth?.toLowerCase())
//       setCurrentMonthData(monthData || null)
//     } else {
//       setCurrentMonthData(null)
//     }
//   }, [allSELTrackerModules, selectedMonth])

//   useEffect(() => {
//     if (currentMonthData?.categories?.length) {
//       const s = {}
//       currentMonthData.categories.forEach((c) => { s[c.order] = true })
//       setOpenCollapsible(s)
//     }
//   }, [currentMonthData?.categories])

//   const handleFileClick = (file, category) => {
//     setIsPdfLoaded(false)
//     setPdfOrientation(null)
//     setZoom(2.0)
//     const fileUrl = `${baseURL}${file.path}`
//     setSelectedPdfUrl(fileUrl)
//     setSelectedCategory((s) => ({ ...s, file, category }))
//     setFileViewMode(true)
//     setActiveTool(presentationTools.HAND)
//     setActivePage(1)
//     enterFullscreen()
//   }

//   const handleBackToList = () => {
//     setFileViewMode(false)
//     setSelectedPdfUrl('')
//     setSelectedCategory({})
//     setNumPages(null)
//     setIsPdfLoaded(false)
//     setZoom(2.0)
//     setPdfOrientation(null)
//     setActiveTool(presentationTools.NONE)
//     setActivePage(1)
//     pageRefs.current = []
//     exitFullscreen()
//   }

//   const toggleCollapsible = (order) => setOpenCollapsible((prev) => ({ ...prev, [order]: !prev[order] }))

//   const onDocumentLoadSuccess = useCallback(
//     async ({ numPages: pages }) => {
//       setNumPages(pages)
//       setIsPdfLoaded(true)
//       pageRefs.current = new Array(pages).fill(null)
//       if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0

//       try {
//         const pdf = await pdfjs.getDocument(selectedPdfUrl).promise
//         const page = await pdf.getPage(1)
//         const viewport = page.getViewport({ scale: 1 })
//         const orientation = viewport.width > viewport.height ? 'landscape' : 'portrait'
//         setPdfOrientation(orientation)
//         setZoom(getDefaultZoom(orientation, isSidebarOpen))
//       } catch (err) {}
//     },
//     [selectedPdfUrl, isSidebarOpen]
//   )

//   const increaseZoom = () => setZoom((prev) => Math.min(prev + 0.1, 4.0))
//   const decreaseZoom = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
//   const clearAllDrawings = () => setClearTrigger((p) => p + 1)
//   const handleUndo = () => setUndoTrigger((p) => p + 1)

//   const isPDF =
//     typeof selectedPdfUrl === 'string' &&
//     (selectedPdfUrl.toLowerCase().endsWith('.pdf') || selectedPdfUrl.toLowerCase().includes('application/pdf'))

//   useEffect(() => {
//     if (fileViewMode && pdfOrientation) {
//       setZoom(getDefaultZoom(pdfOrientation, isSidebarOpen))
//     }
//   }, [isSidebarOpen, pdfOrientation, fileViewMode])

//   useEffect(() => {
//     const laserDiv = laserPointerRef.current
//     if (!fileViewMode || !isPDF || !laserDiv) return
//     const move = (e) => {
//       if (activeTool === presentationTools.LASER) {
//         laserDiv.style.transform = `translate(${e.clientX - 10}px,${e.clientY - 10}px)`
//         laserDiv.style.visibility = 'visible'
//       } else { laserDiv.style.visibility = 'hidden' }
//     }
//     const el = document.getElementById('sel-dialog-root')
//     el?.addEventListener('mousemove', move)
//     return () => el?.removeEventListener('mousemove', move)
//   }, [fileViewMode, isPDF, activeTool])

//   useEffect(() => {
//     if (!fileViewMode || !isPDF) return
//     const fn = (e) => {
//       if (e.key === '+' || e.key === '=') { e.preventDefault(); increaseZoom() }
//       else if (e.key === '-') { e.preventDefault(); decreaseZoom() }
//       else if (e.key === 'Escape') { e.preventDefault(); handleBackToList() }
//       else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo() }
//     }
//     window.addEventListener('keydown', fn)
//     return () => window.removeEventListener('keydown', fn)
//   }, [fileViewMode, isPDF])

//   useEffect(() => {
//     if (!fileViewMode || !numPages || !pageRefs.current.length || !scrollContainerRef.current) return
//     const handler = (entries) => {
//       let maxRatio = 0; let best = -1
//       entries.forEach((entry) => {
//         if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
//           maxRatio = entry.intersectionRatio
//           const i = pageRefs.current.findIndex((r) => r === entry.target)
//           if (i !== -1) best = i + 1
//         }
//       })
//       if (maxRatio > 0 && best !== -1) setActivePage((p) => p !== best ? best : p)
//     }
//     const obs = new IntersectionObserver(handler, {
//       root: scrollContainerRef.current,
//       threshold: [0.1, 0.3, 0.5, 0.8, 1.0],
//       rootMargin: '-10% 0px -10% 0px',
//     })
//     pageRefs.current.forEach((r) => r && obs.observe(r))
//     return () => obs.disconnect()
//   }, [fileViewMode, numPages])

//   useEffect(() => {
//     if (!isSidebarOpen || !activePage) return
//     document.getElementById(`thumbnail-sidebar-${activePage}`)
//       ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
//   }, [activePage, isSidebarOpen])

//   const renderPdfSkeleton = () => (
//     <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f7' }}>
//       <Skeleton variant="rectangular" width={600} height={800} animation="wave" sx={{ borderRadius: '4px' }} />
//     </Box>
//   )

//   const getPointerCursor = () => {
//     if (activeTool === presentationTools.HIGHLIGHTER) return 'text'
//     if (activeTool === presentationTools.ERASER) return 'crosshair'
//     if (activeTool === presentationTools.HAND) return 'grab'
//     return 'default'
//   }

//   return (
//     <Dialog
//       id="sel-dialog-root"
//       maxWidth={fileViewMode ? false : 'md'} 
//       fullWidth
//       fullScreen={fileViewMode}
//       open={open}
//       onClose={fileViewMode ? handleBackToList : onClose}
//       PaperProps={{
//         sx: {
//           cursor: getPointerCursor(),
//           ...(fileViewMode
//             ? {
//                 backgroundColor: '#f5f5f7', borderRadius: 0, margin: 0, padding: 0,
//                 maxWidth: '100vw', maxHeight: '100vh', width: '100vw', height: '100vh',
//                 display: 'flex', flexDirection: 'column', overflow: 'hidden',
//               }
//             : {
//                 borderRadius: '16px',
//                 boxShadow: '0 20px 60px rgba(21,101,192,0.15), 0 0 0 1px rgba(21,101,192,0.08)',
//                 overflow: 'hidden', maxHeight: '86vh',
//                 display: 'flex', flexDirection: 'column',
//               }),
//         },
//       }}
//       onContextMenu={(e) => e.preventDefault()}
//     >
//       {/* Laser dot */}
//       {activeTool === presentationTools.LASER && (
//         <div
//           ref={laserPointerRef}
//           style={{
//             position: 'fixed', top: 0, left: 0, width: 20, height: 20,
//             backgroundColor: '#d32f2f', borderRadius: '50%', pointerEvents: 'none',
//             boxShadow: '0 0 10px 4px rgba(211,47,47,0.6)', zIndex: 99999,
//             visibility: 'hidden', willChange: 'transform',
//           }}
//         />
//       )}

//       {/* Toolbar */}
//       {fileViewMode && (
//         <Box sx={{ flexShrink: 0, backgroundColor: '#fff', zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
//           <SELpdfViewTitle
//             fileViewMode={fileViewMode} handleBackToList={handleBackToList}
//             selectedCategory={selectedCategory} onClose={handleBackToList}
//             selectedMonth={selectedMonth.toLowerCase()} 
//             monthOptions={allowedMonths.map(m => ({id: m.toLowerCase(), label: m}))} 
//             onMonthSelect={setSelectedMonth}
//             zoom={zoom} increaseZoom={increaseZoom} decreaseZoom={decreaseZoom} isPDF={isPDF}
//             activeTool={activeTool} setActiveTool={setActiveTool}
//             isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen((v) => !v)}
//             clearAllDrawings={clearAllDrawings} handleUndo={handleUndo}
//           />
//         </Box>
//       )}

//       {fileViewMode ? (
//         // ── PDF Viewer ──────────────────────────────────────────────────────────
//         <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', backgroundColor: '#e9e9eb' }}>

//           {/* Thumbnail sidebar */}
//           {isSidebarOpen && isPDF && numPages > 0 && (
//             <Box
//               id="thumbnail-sidebar"
//               sx={{
//                 width: '120px', backgroundColor: '#fff', borderRight: '1px solid #e0e0e0',
//                 overflowY: 'auto', flexShrink: 0, pt: '15px', pb: '20px',
//                 display: 'flex', flexDirection: 'column', gap: '15px',
//                 '& .react-pdf__Page': { pointerEvents: 'none', overflow: 'hidden !important' },
//               }}
//             >
//               <Document file={selectedPdfUrl}>
//                 {Array.from(new Array(numPages), (_, i) => (
//                   <Box
//                     key={`thumb_${i + 1}`}
//                     id={`thumbnail-sidebar-${i + 1}`}
//                     onClick={() => {
//                       setActivePage(i + 1)
//                       requestAnimationFrame(() => {
//                         document.getElementById(`sel-pdf-page-${i + 1}`)
//                           ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//                       })
//                     }}
//                     sx={{
//                       width: '80%', mx: 'auto', cursor: 'pointer', borderRadius: '4px', mb: '15px',
//                       border: activePage === i + 1 ? `3px solid ${THEME.blue}` : '3px solid transparent',
//                       boxShadow: activePage === i + 1 ? `0 2px 8px ${THEME.blue}40` : '0 1px 4px rgba(0,0,0,0.1)',
//                       transition: 'border 0.15s ease, box-shadow 0.15s ease',
//                       display: 'flex', justifyContent: 'center',
//                     }}
//                   >
//                     <Page pageNumber={i + 1} width={80} scale={1} renderTextLayer={false} renderAnnotationLayer={false} loading={null} />
//                   </Box>
//                 ))}
//               </Document>
//             </Box>
//           )}

//           {/* Main scroll area */}
//           <Box
//             id="pdf-scroll-container"
//             ref={scrollContainerRef}
//             onContextMenu={(e) => e.preventDefault()}
//             sx={{
//               flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column',
//               alignItems: 'center', gap: '30px', pt: '30px', pb: '40px',
//               '&:active': { cursor: activeTool === presentationTools.HAND ? 'grabbing' : getPointerCursor() },
//             }}
//           >
//             {isPDF ? (
//               <Document
//                 file={selectedPdfUrl}
//                 onLoadSuccess={onDocumentLoadSuccess}
//                 onLoadError={() => {}}
//                 loading={renderPdfSkeleton()}
//               >
//                 {Array.from(new Array(numPages), (_, i) => (
//                   <Box
//                     key={`page_${i + 1}`}
//                     id={`sel-pdf-page-${i + 1}`}
//                     ref={(el) => (pageRefs.current[i] = el)}
//                     sx={{
//                       backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
//                       display: 'flex', justifyContent: 'center',
//                       borderRadius: '2px', position: 'relative', overflow: 'hidden',
//                     }}
//                   >
//                     {isPdfLoaded && (
//                       <NativeHighlighter
//                         isActive={activeTool === presentationTools.HIGHLIGHTER}
//                         isEraser={activeTool === presentationTools.ERASER}
//                         clearTrigger={clearTrigger} undoTrigger={undoTrigger}
//                       />
//                     )}
//                     <Page renderTextLayer={false} renderAnnotationLayer={false} pageNumber={i + 1} scale={zoom} loading={null} />
//                   </Box>
//                 ))}
//               </Document>
//             ) : (
//               <img src={selectedPdfUrl} alt="Resource" style={{ maxWidth: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
//             )}
//           </Box>
//         </Box>

//       ) : (
//         // ── File List View ──────────────────────────────────────────────────────
//         <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '600px', flex: 1 }}>

//           {/* ── HEADER WITH FILTERS ── */}
//           <Box sx={{
//             px: '22px', pt: '20px', pb: '16px', flexShrink: 0,
//             backgroundColor: THEME.white, borderBottom: `1px solid ${THEME.border}`,
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
//           }}>
//             <Box>
//               <Typography sx={{ fontWeight: 700, fontSize: '17px', color: THEME.text }}>
//                 SEL Tracker
//               </Typography>
//               {selectedCountry && !isLoadingSchools && (
//                 <Typography sx={{ fontSize: '12px', color: THEME.textMuted, mt: '2px' }}>
//                   Region: {selectedCountry}
//                 </Typography>
//               )}
//             </Box>

//             <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
//               
//               {isLoadingSchools ? (
//                 <CircularProgress size={24} sx={{ color: THEME.blue }} />
//               ) : (
//                 <>
//                   {/* 1. API Fetched School Selection Dropdown */}
//                   {assignedSchoolsList.length > 0 && (
//                     <Select
//                       value={selectedSchool}
//                       onChange={(e) => handleSchoolChange(e.target.value)}
//                       size="small"
//                       displayEmpty
//                       sx={{
//                         fontSize: '13.5px', fontWeight: 600, color: THEME.text,
//                         borderRadius: '10px', backgroundColor: THEME.white, minWidth: '150px'
//                       }}
//                     >
//                       {assignedSchoolsList.map((s) => (
//                         <MenuItem key={s._id} value={s._id}>{s.school || s.schoolName || 'School'}</MenuItem>
//                       ))}
//                     </Select>
//                   )}

//                   {/* 2. Assigned Years Dropdown (Sirf assigned years show honge) */}
//                   <Select
//                     value={selectedYear}
//                     onChange={(e) => setSelectedYear(e.target.value)}
//                     size="small"
//                     displayEmpty
//                     sx={{
//                       fontSize: '13.5px', fontWeight: 600, color: THEME.text,
//                       borderRadius: '10px', backgroundColor: THEME.white, minWidth: '110px'
//                     }}
//                   >
//                     {availableYears.length === 0 ? (
//                       <MenuItem value="" disabled>No Years Assigned</MenuItem>
//                     ) : (
//                       availableYears.map((y) => (
//                         <MenuItem key={y} value={y}>{y}</MenuItem>
//                       ))
//                     )}
//                   </Select>

//                   {/* 3. Restricted Month Dropdown (Sirf 2 Months Only) */}
//                   <Select
//                     value={selectedMonth}
//                     onChange={(e) => setSelectedMonth(e.target.value)}
//                     size="small"
//                     sx={{
//                       fontSize: '13.5px', fontWeight: 600, color: THEME.text,
//                       borderRadius: '10px', backgroundColor: THEME.white, minWidth: '120px'
//                     }}
//                   >
//                     {allowedMonths.map((m) => (
//                       <MenuItem key={m} value={m}>{m}</MenuItem>
//                     ))}
//                   </Select>
//                 </>
//               )}

//               {/* Close Button */}
//               <Box onClick={onClose} sx={{ cursor: 'pointer', ml: 1 }}>
//                 <CloseRoundedIcon sx={{ fontSize: 20, color: THEME.textMuted }} />
//               </Box>
//             </Box>
//           </Box>

//           {/* Category list rendering */}
//           <Box sx={{
//             flex: 1, overflowY: 'auto', px: '14px', pt: '12px', pb: '16px', backgroundColor: THEME.bg,
//             '&::-webkit-scrollbar': { width: '4px' },
//             '&::-webkit-scrollbar-track': { background: 'transparent' },
//             '&::-webkit-scrollbar-thumb': { background: THEME.blueBorder, borderRadius: '10px' },
//             '&::-webkit-scrollbar-thumb:hover': { background: THEME.blueMid },
//           }}>

//             {currentMonthData?.categories?.map((category, idx) => (
//               <CategoryCard
//                 key={category.order}
//                 title={category.categoryName} files={category.files}
//                 category={category} onFileClick={handleFileClick}
//                 isOpen={openCollapsible[category.order]}
//                 onToggle={() => toggleCollapsible(category.order)}
//                 badgeColor={BADGE_COLORS[idx % BADGE_COLORS.length]}
//               />
//             ))}

//             {!currentMonthData && !isLoadingSchools && (
//               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '60px', gap: '10px' }}>
//                 <Typography sx={{ fontSize: '36px' }}>📂</Typography>
//                 <Typography sx={{ fontSize: '14px', color: THEME.textMuted, fontWeight: 500 }}>
//                   {availableYears.length === 0 ? "Ask Admin to assign SEL Years" : "No resources for this month"}
//                 </Typography>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       )}
//     </Dialog>
//   )
// }
// export default SELPdfViewDialog
import { Dialog, Typography, Box, Skeleton, MenuItem, Select, CircularProgress } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded'
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { fetchAllSELTrackerModules } from './SELFunctions'
import { Document, Page, pdfjs } from 'react-pdf'
import { SELpdfViewTitle, presentationTools } from './SELpdfViewTitle'

// ── API Imports ──
import myPeeguAxios from '../../../utils/myPeeguAxios'
import { apiEndPoints, apiMethods } from '../../../utils/apiConstants'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const MONTHS_LIST = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// ── Theme ─────────────────────────────────────────────────────────────────────
const THEME = {
  blue: '#1565c0', blueMid: '#1976d2', blueLight: '#e3f0fd', blueBorder: '#bbdefb',
  text: '#1a2340', textMuted: '#64748b', bg: '#f4f6fa', white: '#ffffff', border: '#e8edf4',
}

const BADGE_COLORS = ['#1565c0', '#0277bd', '#00838f', '#2e7d32', '#6a1b9a', '#ad1457', '#e65100']

const getDefaultZoom = (orientation) => {
  if (orientation === 'landscape') return 1.0
  if (orientation === 'portrait')  return 2.3
  return 2.0 
}

// ─── Highlighter Canvas ───────────────────────────────────────────────────────
const NativeHighlighter = ({ isActive, isEraser, clearTrigger, undoTrigger }) => {
  const canvasRef = useRef(null)
  const isDrawing = useRef(false)
  const historyStack = useRef([])
  const lastPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ro = new ResizeObserver(() => {
      if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
        canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight
        const ctx = canvas.getContext('2d')
        try { historyStack.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)] } catch (e) {}
      }
    }); ro.observe(canvas); return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (clearTrigger > 0 && canvasRef.current?.width > 0) {
      const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      try { historyStack.current = [ctx.getImageData(0, 0, canvas.width, canvas.height)] } catch (e) {}
    }
  }, [clearTrigger])

  useEffect(() => {
    if (undoTrigger > 0 && canvasRef.current && historyStack.current.length > 1) {
      const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
      historyStack.current.pop(); const prev = historyStack.current[historyStack.current.length - 1]
      if (prev) ctx.putImageData(prev, 0, 0)
    }
  }, [undoTrigger])

  const startDrawing = (e) => {
    if (!isActive && !isEraser) return
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect(); isDrawing.current = true
    lastPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
    ctx.fillStyle = isEraser ? 'rgba(0,0,0,1)' : '#ffff00'
    ctx.beginPath(); ctx.arc(lastPos.current.x, lastPos.current.y, isEraser ? 15 : 9, 0, Math.PI * 2); ctx.fill()
  }

  const draw = (e) => {
    if (!isDrawing.current || (!isActive && !isEraser)) return
    const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect(); const x = e.clientX - rect.left; const y = e.clientY - rect.top
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over'
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : '#ffff00'
    ctx.lineWidth = isEraser ? 30 : 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    ctx.beginPath(); ctx.moveTo(lastPos.current.x, lastPos.current.y); ctx.lineTo(x, y); ctx.stroke()
    lastPos.current = { x, y }
  }

  const stopDrawing = () => {
    if (!isDrawing.current) return
    isDrawing.current = false; const canvas = canvasRef.current; const ctx = canvas.getContext('2d')
    if (canvas.width > 0 && canvas.height > 0) historyStack.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
  }

  return (
    <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: (isActive || isEraser) ? 'auto' : 'none', zIndex: 50, touchAction: 'none', mixBlendMode: 'multiply', opacity: isActive ? 0.8 : 1 }}
    />
  )
}

// ─── Single PDF file row ──────────────────────────────────────────────────────
const PdfFileRow = ({ file, category, onFileClick }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <Box onClick={() => onFileClick(file, category)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      sx={{ display: 'flex', alignItems: 'center', gap: '11px', px: '14px', py: '10px', mx: '8px', mb: '2px', cursor: 'pointer', borderRadius: '10px', backgroundColor: hovered ? THEME.blueLight : 'transparent', transition: 'background-color 0.14s ease' }}>
      <Box sx={{ width: 34, height: 34, borderRadius: '8px', flexShrink: 0, backgroundColor: hovered ? THEME.blue : THEME.blueLight, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s ease', boxShadow: hovered ? `0 3px 10px ${THEME.blue}40` : 'none' }}>
        <PictureAsPdfRoundedIcon sx={{ fontSize: 17, color: hovered ? '#fff' : THEME.blue }} />
      </Box>
      <Typography sx={{ fontSize: '13.5px', fontWeight: 400, flex: 1, color: hovered ? THEME.blue : '#374151', transition: 'color 0.14s ease', lineHeight: 1.45, wordBreak: 'break-word' }}>
        {file.fileName}
      </Typography>
    </Box>
  )
}

// ─── Category accordion card ──────────────────────────────────────────────────
const CategoryCard = ({ title, emoji, files, category, onFileClick, isOpen, onToggle, badgeColor }) => (
  <Box sx={{ mb: '8px', borderRadius: '12px', overflow: 'hidden', backgroundColor: THEME.white, border: '1px solid', borderColor: isOpen ? THEME.blueBorder : THEME.border, boxShadow: isOpen ? `0 2px 12px rgba(21,101,192,0.10)` : '0 1px 3px rgba(0,0,0,0.05)', transition: 'box-shadow 0.2s ease, border-color 0.2s ease' }}>
    <Box onClick={onToggle} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: '16px', py: '13px', cursor: 'pointer', userSelect: 'none', backgroundColor: isOpen ? THEME.blueLight : '#fafbfd', borderBottom: isOpen ? `1px solid ${THEME.blueBorder}` : '1px solid transparent', transition: 'background-color 0.18s ease', '&:hover': { backgroundColor: THEME.blueLight } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: badgeColor, flexShrink: 0 }} />
        <Typography sx={{ fontWeight: 600, fontSize: '13.5px', color: THEME.text }}>{emoji ? `${emoji} ` : ''}{title}</Typography>
        {files?.length > 0 && (
          <Box sx={{ px: '7px', py: '1px', borderRadius: '20px', backgroundColor: isOpen ? `${THEME.blue}15` : '#eef2f7', border: `1px solid ${isOpen ? THEME.blueBorder : '#dde3ed'}` }}>
            <Typography sx={{ fontSize: '11px', fontWeight: 700, color: isOpen ? THEME.blue : '#64748b' }}>{files.length}</Typography>
          </Box>
        )}
      </Box>
      <Box sx={{ width: 26, height: 26, borderRadius: '50%', backgroundColor: isOpen ? THEME.blueBorder : '#eef2f7', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.22s ease', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
        <KeyboardArrowDownRoundedIcon sx={{ fontSize: 17, color: isOpen ? THEME.blue : '#9ca3af' }} />
      </Box>
    </Box>
    {isOpen && (
      <Box sx={{ pt: '6px', pb: '8px' }}>
        {files?.map((file, idx) => <PdfFileRow key={file._id || file.fileName} file={file} category={category} onFileClick={onFileClick} index={idx} />)}
      </Box>
    )}
  </Box>
)

// ─── Main Component ───────────────────────────────────────────────────────────
const SELPdfViewDialog = ({ open, onClose }) => {
  const { allSELTrackerModules } = useSelector((store) => store.selTrackerList || {})
  const { countries } = useSelector((store) => store.dashboardSliceSetup || {})
  const dispatch = useDispatch()

  const [fileViewMode, setFileViewMode] = useState(false)
  const [selectedPdfUrl, setSelectedPdfUrl] = useState('')
  const [selectedCategory, setSelectedCategory] = useState({})
  const [openCollapsible, setOpenCollapsible] = useState({})
  const [numPages, setNumPages] = useState(null)
  const [isPdfLoaded, setIsPdfLoaded] = useState(false)
  const [zoom, setZoom] = useState(2.0)
  const [pdfOrientation, setPdfOrientation] = useState(null)
  
  // 🔥 Track Page Dimension for Skeleton box sizes (Virtualization)
  const [pageDimensions, setPageDimensions] = useState({ width: 600, height: 800 })

  const [assignedSchoolsList, setAssignedSchoolsList] = useState([])
  const [isLoadingSchools, setIsLoadingSchools] = useState(true)

  const [selectedSchool, setSelectedSchool] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [availableYears, setAvailableYears] = useState([])
  
  const [currentMonthData, setCurrentMonthData] = useState(null)
  const [activeTool, setActiveTool] = useState(presentationTools.HAND)
  const [activePage, setActivePage] = useState(1)
  const [clearTrigger, setClearTrigger] = useState(0)
  const [undoTrigger, setUndoTrigger] = useState(0)

  const laserPointerRef = useRef(null)
  const pageRefs = useRef([])
  const scrollContainerRef = useRef(null)
  const baseURL = 'https://mypeegu-prodd.s3.ap-south-1.amazonaws.com'
  const isInitialLoad = useRef(true)

  // ── 1. Calculate Current and Previous Month ──
  const allowedMonths = useMemo(() => {
    const date = new Date()
    const currentMonthIdx = date.getMonth() 
    const prevMonthIdx = currentMonthIdx === 0 ? 11 : currentMonthIdx - 1
    return [MONTHS_LIST[prevMonthIdx], MONTHS_LIST[currentMonthIdx]]
  }, [])

  // ── 2. Handle School Selection ──
  const handleSchoolChange = useCallback((schoolId, schoolsArray = assignedSchoolsList) => {
    const schoolObj = schoolsArray.find(s => s._id === schoolId)
    if (schoolObj) {
      setSelectedSchool(schoolObj._id)
      let countryName = 'India'
      if (typeof schoolObj.country === 'object') countryName = schoolObj.country?.name || schoolObj.country?.countryName || 'India'
      else if (typeof schoolObj.country === 'string') {
        const matchedCountry = countries?.find(c => c._id === schoolObj.country)
        countryName = matchedCountry ? (matchedCountry.name || matchedCountry.countryName || 'India') : 'India'
      }
      const years = schoolObj.assignedSELYears || []
      setSelectedCountry(countryName); setAvailableYears(years)
      if (years.length > 0) setSelectedYear(years[0])
      else setSelectedYear('')
    }
  }, [assignedSchoolsList, countries])

  // ── 3. Initial Load: Fetch Schools via API ──
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoadingSchools(true)
        const body = { page: 1, pageSize: 100 }
        const response = await myPeeguAxios[apiMethods.post](apiEndPoints.viewAllSchools, body)
        const schoolsData = response?.data?.data || response?.data || []
        setAssignedSchoolsList(schoolsData); setSelectedMonth(allowedMonths[1]) 
        if (schoolsData.length > 0) handleSchoolChange(schoolsData[0]._id, schoolsData)
      } catch (error) {
        console.error("Schools fetch failed:", error)
      } finally { setIsLoadingSchools(false); isInitialLoad.current = false }
    }
    if (open && isInitialLoad.current) fetchSchools()
  }, [open, allowedMonths, handleSchoolChange])

  // ── 4. Fetch SEL Modules ──
  useEffect(() => {
    if (selectedCountry && selectedYear && selectedMonth && !isInitialLoad.current && !isLoadingSchools) {
      fetchAllSELTrackerModules(dispatch, selectedCountry, selectedYear, selectedMonth)
    }
  }, [selectedCountry, selectedYear, selectedMonth, isLoadingSchools, dispatch])

  // Sync Redux Data
  useEffect(() => {
    if (allSELTrackerModules && Array.isArray(allSELTrackerModules)) {
      const monthData = allSELTrackerModules.find((item) => item.month?.toLowerCase() === selectedMonth?.toLowerCase())
      setCurrentMonthData(monthData || null)
    } else setCurrentMonthData(null)
  }, [allSELTrackerModules, selectedMonth])

  useEffect(() => {
    if (currentMonthData?.categories?.length) {
      const s = {}
      currentMonthData.categories.forEach((c) => { s[c.order] = true })
      setOpenCollapsible(s)
    }
  }, [currentMonthData?.categories])

  const handleFileClick = (file, category) => {
    setIsPdfLoaded(false); setPdfOrientation(null); setZoom(2.0)
    const fileUrl = `${baseURL}${file.path}`
    setSelectedPdfUrl(fileUrl)
    setSelectedCategory((s) => ({ ...s, file, category }))
    setFileViewMode(true); setActiveTool(presentationTools.HAND); setActivePage(1)
  }

  const handleBackToList = () => {
    setFileViewMode(false); setSelectedPdfUrl(''); setSelectedCategory({})
    setNumPages(null); setIsPdfLoaded(false); setZoom(2.0); setPdfOrientation(null)
    setActiveTool(presentationTools.NONE); setActivePage(1); pageRefs.current = []
  }

  const toggleCollapsible = (order) => setOpenCollapsible((prev) => ({ ...prev, [order]: !prev[order] }))

  const onDocumentLoadSuccess = useCallback(
    async ({ numPages: pages }) => {
      setNumPages(pages); setIsPdfLoaded(true); pageRefs.current = new Array(pages).fill(null)
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0
      try {
        const pdf = await pdfjs.getDocument(selectedPdfUrl).promise
        const page = await pdf.getPage(1)
        const viewport = page.getViewport({ scale: 1 })
        
        // 🔥 Store dimensions for Skeletons
        setPageDimensions({ width: viewport.width, height: viewport.height })
        
        const orientation = viewport.width > viewport.height ? 'landscape' : 'portrait'
        setPdfOrientation(orientation)
        setZoom(getDefaultZoom(orientation))
      } catch (err) {}
    },
    [selectedPdfUrl]
  )

  const increaseZoom = () => setZoom((prev) => Math.min(prev + 0.1, 4.0))
  const decreaseZoom = () => setZoom((prev) => Math.max(prev - 0.1, 0.5))
  const clearAllDrawings = () => setClearTrigger((p) => p + 1)
  const handleUndo = () => setUndoTrigger((p) => p + 1)

  const isPDF = typeof selectedPdfUrl === 'string' && (selectedPdfUrl.toLowerCase().endsWith('.pdf') || selectedPdfUrl.toLowerCase().includes('application/pdf'))

  useEffect(() => {
    if (fileViewMode && pdfOrientation) { setZoom(getDefaultZoom(pdfOrientation)) }
  }, [pdfOrientation, fileViewMode])

  useEffect(() => {
    const laserDiv = laserPointerRef.current
    if (!fileViewMode || !isPDF || !laserDiv) return
    const move = (e) => {
      if (activeTool === presentationTools.LASER) {
        laserDiv.style.transform = `translate(${e.clientX - 10}px,${e.clientY - 10}px)`
        laserDiv.style.visibility = 'visible'
      } else { laserDiv.style.visibility = 'hidden' }
    }
    const el = document.getElementById('sel-dialog-root')
    el?.addEventListener('mousemove', move)
    return () => el?.removeEventListener('mousemove', move)
  }, [fileViewMode, isPDF, activeTool])

  useEffect(() => {
    if (!fileViewMode || !isPDF) return
    const fn = (e) => {
      if (e.key === '+' || e.key === '=') { e.preventDefault(); increaseZoom() }
      else if (e.key === '-') { e.preventDefault(); decreaseZoom() }
      else if (e.key === 'Escape') { e.preventDefault(); handleBackToList() }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo() }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [fileViewMode, isPDF])

  useEffect(() => {
    if (!fileViewMode || !numPages || !scrollContainerRef.current) return
    const handler = (entries) => {
      let maxRatio = 0; let best = -1
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          const i = pageRefs.current.findIndex((r) => r === entry.target)
          if (i !== -1) best = i + 1
        }
      })
      if (maxRatio > 0 && best !== -1) setActivePage((p) => p !== best ? best : p)
    }
    const obs = new IntersectionObserver(handler, {
      root: scrollContainerRef.current, threshold: [0.1, 0.3, 0.5, 0.8, 1.0], rootMargin: '-10% 0px -10% 0px',
    })
    pageRefs.current.forEach((r) => r && obs.observe(r))
    return () => obs.disconnect()
  }, [fileViewMode, numPages, isPdfLoaded])

  const renderPdfSkeleton = () => (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f7' }}>
      <Skeleton variant="rectangular" width={600} height={800} animation="wave" sx={{ borderRadius: '4px' }} />
    </Box>
  )

  const getPointerCursor = () => {
    if (activeTool === presentationTools.HIGHLIGHTER) return 'text'
    if (activeTool === presentationTools.ERASER) return 'crosshair'
    if (activeTool === presentationTools.HAND) return 'grab'
    return 'default'
  }

  return (
    <Dialog
      id="sel-dialog-root"
      maxWidth={fileViewMode ? false : 'md'} 
      fullWidth
      fullScreen={fileViewMode}
      open={open}
      onClose={fileViewMode ? handleBackToList : onClose}
      scroll="paper"
      PaperProps={{
        sx: {
          cursor: getPointerCursor(),
          ...(fileViewMode
            ? {
                backgroundColor: '#f5f5f7', borderRadius: 0, margin: 0, padding: 0,
                maxWidth: '100vw', maxHeight: '100vh', width: '100vw', height: '100vh',
                display: 'flex', flexDirection: 'column', overflow: 'hidden',
              }
            : {
                borderRadius: '16px',
                boxShadow: '0 20px 60px rgba(21,101,192,0.15), 0 0 0 1px rgba(21,101,192,0.08)',
                overflow: 'hidden', 
                maxHeight: { xs: '95vh', sm: '86vh' }, // 🔥 Mobile Responsive Scroll Fix
                margin: { xs: '10px', sm: '32px' },
                display: 'flex', flexDirection: 'column',
              }),
        },
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Laser dot */}
      {activeTool === presentationTools.LASER && (
        <div
          ref={laserPointerRef}
          style={{
            position: 'fixed', top: 0, left: 0, width: 20, height: 20,
            backgroundColor: '#d32f2f', borderRadius: '50%', pointerEvents: 'none',
            boxShadow: '0 0 10px 4px rgba(211,47,47,0.6)', zIndex: 99999,
            visibility: 'hidden', willChange: 'transform',
          }}
        />
      )}

      {/* Toolbar */}
      {fileViewMode && (
        <Box sx={{ flexShrink: 0, backgroundColor: '#fff', zIndex: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <SELpdfViewTitle
            fileViewMode={fileViewMode} handleBackToList={handleBackToList}
            selectedCategory={selectedCategory} onClose={handleBackToList}
            selectedMonth={selectedMonth.toLowerCase()} 
            monthOptions={allowedMonths.map(m => ({id: m.toLowerCase(), label: m}))} 
            onMonthSelect={setSelectedMonth}
            zoom={zoom} increaseZoom={increaseZoom} decreaseZoom={decreaseZoom} isPDF={isPDF}
            activeTool={activeTool} setActiveTool={setActiveTool}
            clearAllDrawings={clearAllDrawings} handleUndo={handleUndo}
          />
        </Box>
      )}

      {fileViewMode ? (
        // ── PDF Viewer ──────────────────────────────────────────────────────────
        <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden', backgroundColor: '#e9e9eb' }}>
          
          {/* Main scroll area */}
          <Box
            id="pdf-scroll-container"
            ref={scrollContainerRef}
            onContextMenu={(e) => e.preventDefault()}
            sx={{
              flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '30px', pt: '30px', pb: '40px',
              '&:active': { cursor: activeTool === presentationTools.HAND ? 'grabbing' : getPointerCursor() },
            }}
          >
            {isPDF ? (
              <Document
                file={selectedPdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={() => {}}
                loading={renderPdfSkeleton()}
              >
                {Array.from(new Array(numPages || 0), (_, i) => {
                  
                  // 🔥 Lazy Loading Logic (Virtualization)
                  const isVisible = Math.abs(activePage - (i + 1)) <= 2;

                  return (
                  <Box
                    key={`page_${i + 1}`}
                    id={`sel-pdf-page-${i + 1}`}
                    ref={(el) => (pageRefs.current[i] = el)}
                    sx={{
                      backgroundColor: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      borderRadius: '2px', position: 'relative', overflow: 'hidden',
                      minHeight: isVisible ? 'auto' : `${pageDimensions.height * zoom}px`,
                      width: isVisible ? 'auto' : `${pageDimensions.width * zoom}px`,
                    }}
                  >
                    {isVisible ? (
                      <>
                        {isPdfLoaded && (
                          <NativeHighlighter
                            isActive={activeTool === presentationTools.HIGHLIGHTER}
                            isEraser={activeTool === presentationTools.ERASER}
                            clearTrigger={clearTrigger} undoTrigger={undoTrigger}
                          />
                        )}
                        <Page renderTextLayer={false} renderAnnotationLayer={false} pageNumber={i + 1} scale={zoom} loading={<CircularProgress />} />
                      </>
                    ) : (
                      <Typography sx={{ color: '#aaa', fontWeight: 600 }}>Loading Page {i + 1}...</Typography>
                    )}
                  </Box>
                )})}
              </Document>
            ) : (
              <img src={selectedPdfUrl} alt="Resource" style={{ maxWidth: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
            )}
          </Box>
        </Box>

      ) : (
        // ── File List View ──────────────────────────────────────────────────────
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflow: 'hidden' }}>

          {/* ── HEADER WITH FILTERS ── */}
          <Box sx={{
            px: '22px', pt: '20px', pb: '16px', flexShrink: 0,
            backgroundColor: THEME.white, borderBottom: `1px solid ${THEME.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
          }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '17px', color: THEME.text }}>
                SEL Tracker
              </Typography>
              {selectedCountry && !isLoadingSchools && (
                <Typography sx={{ fontSize: '12px', color: THEME.textMuted, mt: '2px' }}>
                  Region: {selectedCountry}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
              
              {isLoadingSchools ? (
                <CircularProgress size={24} sx={{ color: THEME.blue }} />
              ) : (
                <>
                  {/* 1. API Fetched School Selection Dropdown */}
                  {assignedSchoolsList.length > 0 && (
                    <Select
                      value={selectedSchool}
                      onChange={(e) => handleSchoolChange(e.target.value)}
                      size="small"
                      displayEmpty
                      sx={{
                        fontSize: '13.5px', fontWeight: 600, color: THEME.text,
                        borderRadius: '10px', backgroundColor: THEME.white, minWidth: '150px'
                      }}
                    >
                      {assignedSchoolsList.map((s) => (
                        <MenuItem key={s._id} value={s._id}>{s.school || s.schoolName || 'School'}</MenuItem>
                      ))}
                    </Select>
                  )}

                  {/* 2. Assigned Years Dropdown (Sirf assigned years show honge) */}
                  <Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    size="small"
                    displayEmpty
                    sx={{
                      fontSize: '13.5px', fontWeight: 600, color: THEME.text,
                      borderRadius: '10px', backgroundColor: THEME.white, minWidth: '110px'
                    }}
                  >
                    {availableYears.length === 0 ? (
                      <MenuItem value="" disabled>No Years Assigned</MenuItem>
                    ) : (
                      availableYears.map((y) => (
                        <MenuItem key={y} value={y}>{y}</MenuItem>
                      ))
                    )}
                  </Select>

                  {/* 3. Restricted Month Dropdown (Sirf 2 Months Only) */}
                  <Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    size="small"
                    sx={{
                      fontSize: '13.5px', fontWeight: 600, color: THEME.text,
                      borderRadius: '10px', backgroundColor: THEME.white, minWidth: '120px'
                    }}
                  >
                    {allowedMonths.map((m) => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </Select>
                </>
              )}

              {/* Close Button */}
              <Box onClick={onClose} sx={{ cursor: 'pointer', ml: 1 }}>
                <CloseRoundedIcon sx={{ fontSize: 20, color: THEME.textMuted }} />
              </Box>
            </Box>
          </Box>

          {/* Category list rendering */}
          <Box sx={{
            flex: 1, overflowY: 'auto', px: { xs: '10px', sm: '14px' }, pt: '12px', pb: '16px', backgroundColor: THEME.bg,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-track': { background: 'transparent' },
            '&::-webkit-scrollbar-thumb': { background: THEME.blueBorder, borderRadius: '10px' },
            '&::-webkit-scrollbar-thumb:hover': { background: THEME.blueMid },
          }}>

            {currentMonthData?.categories?.map((category, idx) => (
              <CategoryCard
                key={category.order}
                title={category.categoryName} files={category.files}
                category={category} onFileClick={handleFileClick}
                isOpen={openCollapsible[category.order]}
                onToggle={() => toggleCollapsible(category.order)}
                badgeColor={BADGE_COLORS[idx % BADGE_COLORS.length]}
              />
            ))}

            {!currentMonthData && !isLoadingSchools && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: '60px', gap: '10px' }}>
                <Typography sx={{ fontSize: '36px' }}>📂</Typography>
                <Typography sx={{ fontSize: '14px', color: THEME.textMuted, fontWeight: 500 }}>
                  {availableYears.length === 0 ? "Ask Admin to assign SEL Years" : "No resources for this month"}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Dialog>
  )
}
export default SELPdfViewDialog