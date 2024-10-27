import React from 'react';
import { Modal, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

const DownloadSuccessModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Download success!"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                <p>Please check your download folder!</p>
                <Button type="primary" onClick={onClose}>
                    Done
                </Button>
            </div>
        </Modal>
    );
};

export default DownloadSuccessModal;
