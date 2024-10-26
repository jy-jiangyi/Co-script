import React from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const UploadFailModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Upload Fail"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center' }}>
                <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                <p>The selected file can not be decoded!!!</p>
                <Button type="primary" onClick={onClose}>
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default UploadFailModal;
