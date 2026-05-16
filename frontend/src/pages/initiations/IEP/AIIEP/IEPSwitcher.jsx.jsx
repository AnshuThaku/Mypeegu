import React from 'react';
import { useSelector } from 'react-redux';
import StudentIEP from './StudentIEP'; // Aapka purana component
import StudentAIIEP from './AIIEP/StudentAIIEP'; // Aapka naya AI component
import { getCurACYear } from '../../../utils/utils'; // Sahi path check kar lena

const IEPSwitcher = () => {
    // System ka current academic year nikalenge (e.g., "2026-2027")
    const currentAcademicYear = getCurACYear(); 
    
    // String me se start year nikalenge (e.g., "2026")
    const startYear = parseInt(currentAcademicYear.split('-')[0]);

    // 🟢 Asli Logic: 2026 ya uske baad naya, warna purana
    if (startYear >= 2026) {
        return <StudentAIIEP />;
    } else {
        return <StudentIEP />;
    }
};

export default IEPSwitcher;