import React, { useState } from 'react';
import { Modal, Input, Button, message } from 'antd';
import axios from 'axios';

const UploadSuccessModal = ({ visible, onClose, fileContent }) => {
    const [newFileName, setNewFileName] = useState('');

    const handleRename = (e) => {
        setNewFileName(e.target.value);
    };

    const handleDone = async () => {
        if (!newFileName) {
            message.error('Please enter a new file name!');
            return;
        }

        try {
            // 将新的文件名和文件内容发送到后端
            await axios.post('/api/upload/saveFile', {
                fileName: newFileName,
                content: fileContent,
            });
            message.success('File name and content sent successfully!');
            onClose();
        } catch (error) {
            message.error('Failed to send file name and content!');
            console.error(error);
        }
    };

    return (
        <Modal
            title="Successfully uploaded"
            visible={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: '24px', color: 'green' }}>✓</span>
                </div>
                <p>Please rename the file!</p>
                <Input
                    placeholder="input a file name"
                    value={newFileName}
                    onChange={handleRename}
                />
                <Button type="primary" onClick={handleDone} style={{ marginTop: 16 }}>
                    Done
                </Button>
            </div>
        </Modal>
    );
};

export default UploadSuccessModal;
