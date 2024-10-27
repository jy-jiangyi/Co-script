import React, {useState, useEffect, useContext} from 'react';
import { Modal, Button, Typography, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import DownloadModal from "./DownloadModal.jsx";
import {ScriptContext} from "../hooks/ScriptContext.jsx";

const { Title, Paragraph } = Typography;

const StyleAnalysisModal = ({ visible, onClose, scriptTitle, scriptAnalysis, longSummary, scriptId }) => {
    const title = scriptTitle || 'Unknown Title';
    const shortAnalysis = scriptAnalysis || 'No analysis available.';
    const longAnalysis = longSummary || 'No long summary available.';
    const navigate = useNavigate();
    const [isDownloadModalVisible, setDownloadModalVisible] = useState(false);
    const { setScriptId } = useContext(ScriptContext);

    useEffect(() => {
        console.log('Received scriptId:', scriptId);
    }, [scriptId]);

    const handleMoreClick = () => {
        setScriptId(scriptId);
        navigate('/script_editing');
    };

    const showDownloadModal = () => {
        if (!scriptId) {
            message.error('scriptId 不存在，无法下载');
            return;
        }
        setDownloadModalVisible(true);
    };

    const closeDownloadModal = () => {
        setDownloadModalVisible(false);
    };

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            bodyStyle={{
                height: '600px',
                display: 'flex',
                flexDirection: 'column',
                padding: '0',
                overflow: 'hidden'
            }}
            centered
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100px',
                    padding: '5px',
                    borderBottom: '1px solid #f0f0f0',
                    boxSizing: 'border-box'
                }}
            >
                <Title level={4} style={{ margin: 0 }}>
                    {title}
                </Title>
                <Paragraph
                    style={{
                        margin: 0,
                        maxWidth: '50%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {shortAnalysis}
                </Paragraph>
            </div>

            <div
                style={{
                    height: '450px',
                    padding: '16px',
                    overflowY: 'auto',
                    borderBottom: '1px solid #f0f0f0',
                    boxSizing: 'border-box'
                }}
            >
                <Title level={5}>Analysis:</Title>
                <Paragraph>{longAnalysis}</Paragraph>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '50px',
                    padding: '0 16px',
                    boxSizing: 'border-box',
                }}
            >
                <Button
                    type="link"
                    icon={<DownloadOutlined />}
                    style={{ marginLeft: '0', padding: '0' }}
                    onClick={showDownloadModal}
                >
                    Download
                </Button>

                <div>
                    <Button
                        type="default"
                        onClick={onClose}
                        style={{
                            marginRight: '8px',
                            backgroundColor: 'red',
                            color: 'white',
                            border: 'none'
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleMoreClick}
                    >
                        More
                    </Button>
                </div>
            </div>

            <DownloadModal
                visible={isDownloadModalVisible}
                onClose={closeDownloadModal}
                scriptId={scriptId}
            />
        </Modal>
    );
};

export default StyleAnalysisModal;
