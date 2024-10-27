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
    const navigate = useNavigate(); // 初始化navigate
    const { setScriptId } = useContext(ScriptContext);

    const showModal = async () => {
        console.log('scriptId:', scriptId); // 检查scriptId的值
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
        setDownloadModalVisible(true); // 显示DownloadModal
    };

    const closeDownloadModal = () => {
        setDownloadModalVisible(false); // 关闭DownloadModal
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
                {/* 卡片头部区域：标题和 More 按钮 */}
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
                        onClick={handleMoreClick} // 点击时触发跳转
                    >
                        More
                    </Button>
                </div>

                {/* description */}
                <div style={{ paddingTop: '5px', height: '145px', overflow: 'hidden' }}>
                    <p>{description}</p>
                </div>

                {/* 底部按钮区域 */}
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
                                onClick={showDownloadModal} // 点击后显示DownloadModal
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

            {/* 弹出的 StyleAnalysisModal 组件 */}
            <StyleAnalysisModal
                visible={isModalVisible}
                onClose={closeModal}
                scriptTitle={title}
                scriptAnalysis={description}  // 上部显示 short summary
                longSummary={longSummary}// 下部显示 long summary
                scriptId={scriptId}
            />

            <DownloadModal
                visible={isDownloadModalVisible}
                onClose={closeDownloadModal}
                scriptId={scriptId} // 传递 scriptId
            />
        </>
    );
};

export default ScriptCard;
