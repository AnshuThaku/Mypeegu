import React, { useState, useRef } from 'react';
import CustomDialogWithBreadcrumbs from '../../../components/commonComponents/CustomDialogWithBreadcrumbs';
import { localizationConstants } from '../../../resources/theme/localizationConstants';
import AddSafeSpaces from './AddSafeSpaces';

const AddSafeSpacesDialog = ({ open, onClose, onAdd }) => {
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
            clickableTitle="Safe Spaces"
            title="Add Assessment"
            onClick={onClose}
            open={open}
            saveBtnText={localizationConstants.save}
            onSave={handleSave}
            disableSaveBtn={isDisable}
            permittedUser={true}
        >
            <AddSafeSpaces ref={childRef} onSaveStateChange={setIsDisable} />
        </CustomDialogWithBreadcrumbs>
    );
};
export default AddSafeSpacesDialog;