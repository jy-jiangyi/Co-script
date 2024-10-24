import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'antd';
import { DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import StyleAnalysisModal from './StyleAnalysisModal';

const ScriptCard = ({ title, description, analysis }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
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
                    >
                        More
                    </Button>
                </div>

                {/* description */}
                <div style={{ paddingTop: '5px', height: '145px' }}>
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
                script={title}
                analysis={analysis}
            />
        </>
    );
};

export default ScriptCard;
