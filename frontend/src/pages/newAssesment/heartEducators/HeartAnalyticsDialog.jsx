import React from 'react';
import Heartanalytics from './Heartanalytics';

const HeartAnalyticsDialog = ({ open, onClose, data }) => {
    if (!open) return null;
    return <Heartanalytics open={open} onClose={onClose} data={data} />;
};

export default HeartAnalyticsDialog;