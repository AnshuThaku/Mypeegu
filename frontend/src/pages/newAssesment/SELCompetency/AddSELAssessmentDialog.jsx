// AddSELAssessmentDialog.jsx[cite: 2]
import React, { useState, useRef } from 'react';
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import AddSELAssessment from './AddSELAssessment';

const AddSELAssessmentDialog = ({ open, onClose, onAdd }) => {
    const childRef = useRef();
    const [isDisable, setIsDisable] = useState(true);

    const handleSave = () => {
        if (childRef.current) {
            // Child component se data nikalna[cite: 1]
            const newRecord = childRef.current.getSubmitData();
            onAdd(newRecord);
            onClose();
        }
    };

    return (
        <CustomDialogWithBreadcrumbs
            onClose={onClose}
            clickableTitle="SEL Assessment"
            title="Add New SEL Assessment"
            onClick={onClose}
            open={open}
            saveBtnText={localizationConstants.save}
            onSave={handleSave}
            disableSaveBtn={isDisable}
            permittedUser={true}
        >
            <AddSELAssessment 
                ref={childRef} 
                onSaveStateChange={setIsDisable} 
            />
        </CustomDialogWithBreadcrumbs>
    );
};

export default AddSELAssessmentDialog;