import React, { useState } from 'react';
import { Modal, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import DownloadSuccessModal from "./DownloadSuccessModal.jsx";
import DownloadFailModal from "./DownloadFailModal.jsx";

const DownloadModal = ({ visible, onClose, scriptId }) => {
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [downloadSuccessVisible, setDownloadSuccessVisible] = useState(false);
    const [downloadFailVisible, setDownloadFailVisible] = useState(false);

    const handleFormatChange = (checkedValues) => {
        setSelectedFormats(checkedValues);
    };

    const handleDownload = async () => {
        if (!scriptId || selectedFormats.length === 0) {
            message.error('please select at least one format!');
            return;
        }

        try {
            for (const format of selectedFormats) {
                const formatValue = getFormatValue(format);
                const url = `/download_control/download/${scriptId}?format=${formatValue}`;

                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Download Failed');
                }

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.setAttribute('download', `script.${format.toLowerCase()}`);

                if (link) {
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    message.error('Failed create download link');
                }

                window.URL.revokeObjectURL(blobUrl);
            }

            setDownloadSuccessVisible(true);
        } catch (error) {
            console.error('download error:', error);
            setDownloadFailVisible(true);
        }
    };

    const getFormatValue = (format) => {
        switch (format) {
            case 'PDF': return 1;
            case 'JPEG': return 2;
            case 'TXT': return 3;
            default: return 0;
        }
    };

    return (
        <>
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
                        options={['PDF', 'JPEG', 'TXT']}
                        onChange={handleFormatChange}
                        style={{ marginBottom: '16px' }}
                    />
                    <Button
                        type="primary"
                        onClick={handleDownload}
                        disabled={selectedFormats.length === 0}
                    >
                        Download
                    </Button>
                </div>
            </Modal>

            <DownloadSuccessModal
                visible={downloadSuccessVisible}
                onClose={() => setDownloadSuccessVisible(false)}
            />
            <DownloadFailModal
                visible={downloadFailVisible}
                onClose={() => setDownloadFailVisible(false)}
            />
        </>
    );
};

export default DownloadModal;
