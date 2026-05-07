import React, { useState, useRef } from 'react';
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs';
import AddPulse from './AddPulse';

const AddPulseDialog = ({ open, onClose, onAdd }) => {
    const childRef = useRef();
    const [isDisable, setIsDisable] = useState(true);

    const handleSave = () => {
        if (childRef.current) {
            const data = childRef.current.getSubmitData();
            onAdd(data);
            onClose();
        }
    };

    return (
        <CustomDialogWithBreadcrumbs
            onClose={onClose} open={open}
            clickableTitle="PULSE" title="Digital Wellbeing Check-In"
            onSave={handleSave} disableSaveBtn={isDisable} permittedUser={true}
        >
            <AddPulse ref={childRef} onSaveStateChange={setIsDisable} />
        </CustomDialogWithBreadcrumbs>
    );
};

export default AddPulseDialog;