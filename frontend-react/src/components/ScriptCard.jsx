import React, {useContext, useState} from 'react';
import {Button, Card, Col, message, Row} from 'antd';
import {DownloadOutlined, QuestionCircleOutlined} from '@ant-design/icons';
import StyleAnalysisModal from './StyleAnalysisModal';
import axios from 'axios';
import DownloadModal from "./DownloadModal.jsx";
import {useNavigate} from "react-router-dom";
import {ScriptContext} from "../hooks/ScriptContext.jsx";

const ScriptCard = ({ title, description, scriptId }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDownloadModalVisible, setDownloadModalVisible] = useState(false); // 控制DownloadModal的可见性
    const [longSummary, setLongSummary] = useState('');
    const navigate = useNavigate();
    const { setScriptId } = useContext(ScriptContext);

    const showModal = async () => {
        console.log('scriptId:', scriptId);
        console.log('tltle:', title);

        if (!scriptId) {
            console.error('scriptId is undefined');
            return;
        }

        try {
            const response = await axios.get(`/api/script_management/scripts/${scriptId}/scenes/summary/long`);
            setLongSummary(response.data);
        } catch (error) {
            console.error('Error fetching long summary:', error);
            message.error('获取长 summary 失败');
        }

        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    const showDownloadModal = () => {
        setDownloadModalVisible(true);
    };

    const closeDownloadModal = () => {
        setDownloadModalVisible(false);
    };

    const handleMoreClick = () => {
        setScriptId(scriptId);
        navigate('/script_editing');
    };

    return (
        <>
            <Card
                hoverable
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '250px',
                    padding: '0px',
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '5px',
                    height: '45px',
                }}>
                    <h3 style={{ marginBottom: '0' }}>{title}</h3>
                    <Button
                        type="link"
                        style={{ paddingTop: '5px', margin: '0', textAlign: 'right' }}
                        onClick={handleMoreClick}
                    >
                        More
                    </Button>
                </div>

                {/* description */}
                <div style={{ paddingTop: '5px', height: '145px', overflow: 'hidden' }}>
                    <p>{description}</p>
                </div>

                {/* bottom button */}
                <div
                    style={{
                        marginBottom: 'auto',
                        borderTop: '1px solid #f0f0f0',
                        paddingTop: '0px',
                        flex: 1,
                    }}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Button
                                type="link"
                                icon={<DownloadOutlined />}
                                style={{ width: '100%', textAlign: 'center' }}
                                onClick={showDownloadModal}
                            >
                                Download
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                type="link"
                                icon={<QuestionCircleOutlined />}
                                style={{ width: '100%', textAlign: 'center' }}
                                onClick={showModal}
                            >
                                Style analysis
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>

            {/* StyleAnalysisModal  */}
            <StyleAnalysisModal
                visible={isModalVisible}
                onClose={closeModal}
                scriptTitle={title}
                scriptAnalysis={description}
                longSummary={longSummary}
                scriptId={scriptId}
            />

            <DownloadModal
                visible={isDownloadModalVisible}
                onClose={closeDownloadModal}
                scriptId={scriptId}
            />
        </>
    );
};

export default ScriptCard;
