import React, { useState } from 'react';
import { Modal, Button, Checkbox } from 'antd';

const DownloadModal = ({ visible, onClose }) => {
    const [selectedFormats, setSelectedFormats] = useState([]);

    const handleFormatChange = (checkedValues) => {
        setSelectedFormats(checkedValues);
    };

    return (
        <Modal
            title="Download"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center' }}>
                <p>Please select a download format</p>
                <Checkbox.Group
                    options={['PDF', 'JPEG', 'Txt']}
                    onChange={handleFormatChange}
                    style={{ marginBottom: '16px' }}
                />
                <Button type="primary" onClick={onClose} disabled={selectedFormats.length === 0}>
                    Download
                </Button>
            </div>
        </Modal>
    );
};

export default DownloadModal;
