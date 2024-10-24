import React from 'react';
import { Modal, Button, Input } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const UploadSuccessModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Successfully uploaded"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                <p>Please rename the file!</p>
                <Input placeholder="input a file name" style={{ marginBottom: '16px' }} />
                <Button type="primary" onClick={onClose}>
                    Done
                </Button>
            </div>
        </Modal>
    );
};

export default UploadSuccessModal;
