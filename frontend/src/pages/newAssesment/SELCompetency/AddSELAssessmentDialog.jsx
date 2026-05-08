import React, { useState, useRef } from 'react';
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import AddSELAssessment from './AddSELAssessment';

const AddSELAssessmentDialog = ({ open, onClose, onAdd }) => {
    const childRef = useRef();
    const [isDisable, setIsDisable] = useState(true);

    const handleSave = () => {
        if (childRef.current) {
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
            saveBtnText={localizationConstants?.save || "Save"}
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