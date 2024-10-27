import React, { useState } from 'react';
import { Modal, Button, Checkbox, message } from 'antd';
import axios from 'axios';
import DownloadSuccessModal from "./DownloadSuccessModal.jsx";
import DownloadFailModal from "./DownloadFailModal.jsx";

const DownloadModal = ({ visible, onClose, scriptId }) => {
    const [selectedFormats, setSelectedFormats] = useState([]);
    const [downloadSuccessVisible, setDownloadSuccessVisible] = useState(false);
    const [downloadFailVisible, setDownloadFailVisible] = useState(false);

    // 处理格式选择
    const handleFormatChange = (checkedValues) => {
        setSelectedFormats(checkedValues);
    };

    // 执行下载逻辑
    const handleDownload = async () => {
        if (!scriptId || selectedFormats.length === 0) {
            message.error('请选择至少一个格式或确保 scriptId 存在');
            return;
        }

        try {
            for (const format of selectedFormats) {
                const formatValue = getFormatValue(format);

                // 发起下载请求
                const response = await axios.get(
                    `/download/${scriptId}`,
                    {
                        params: { format: formatValue },
                        responseType: 'blob', // 处理二进制数据
                    }
                );

                downloadFile(response.data, format);
            }

            // 如果所有文件下载成功，显示成功弹窗
            setDownloadSuccessVisible(true);
        } catch (error) {
            console.error('下载出错:', error);
            setDownloadFailVisible(true); // 显示失败弹窗
        }
    };

    // 文件下载函数
    const downloadFile = (data, format) => {
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `script.${format.toLowerCase()}`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    // 将选择的格式映射为后端的格式参数
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

            {/* 成功和失败弹窗 */}
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
