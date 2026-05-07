import React, { useState, useRef } from 'react';
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import AddTeacherPSAssessment from './AddTeacherPSAssessment';

const AddTeacherPSDialog = ({ open, onClose, onAdd }) => {
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
            clickableTitle="H.E.A.R.T. Model"
            title="Add Educator Survey"
            onClick={onClose}
            open={open}
            saveBtnText={localizationConstants.save}
            onSave={handleSave}
            disableSaveBtn={isDisable}
            permittedUser={true}
        >
            <AddTeacherPSAssessment 
                ref={childRef} 
                onSaveStateChange={setIsDisable} 
            />
        </CustomDialogWithBreadcrumbs>
    );
};

export default AddTeacherPSDialog;