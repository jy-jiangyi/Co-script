import React from 'react';
import { Modal, Button } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

const DownloadFailModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="Download Fail"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center' }}>
                <CloseCircleOutlined style={{ fontSize: '48px', color: '#ff4d4f' }} />
                <p>Please try again!</p>
                <Button type="primary" onClick={onClose}>
                    Try again
                </Button>
            </div>
        </Modal>
    );
};

export default DownloadFailModal;
