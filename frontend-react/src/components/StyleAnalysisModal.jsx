import React from 'react';
import { Modal, Button, Row, Col, Typography } from 'antd';
import {DownloadOutlined} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const StyleAnalysisModal = ({ visible, onClose, script }) => {
    return (
        <Modal
            title="Title"
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
            {/* 上部区域 */}
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
                <Title level={4} style={{margin: 0}}>
                    {script.title}
                </Title>
                <Paragraph style={{margin: 0}}>
                    简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述
                </Paragraph>
            </div>

            {/* 中部区域 */}
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
                {/*<Paragraph>{script.analysis}</Paragraph>*/}
                <Paragraph>
                    简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述简短描述
                </Paragraph>

            </div>

            {/* 底部区域 */}
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
                {/* 左侧的下载按钮 */}
                <Button
                    type="link"
                    icon={<DownloadOutlined/>}
                    style={{marginLeft: '0', padding: '0'}}
                >
                    Download
                </Button>

                {/* 右侧的关闭和更多按钮 */}
                <div>
                    <Button type="default"
                            onClick={onClose}
                            style={{marginRight: '8px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none'
                            }}
                    >
                        Close
                    </Button>
                    <Button type="primary">More</Button>
                </div>
            </div>
        </Modal>
    );
};

export default StyleAnalysisModal;
