import React, { useState } from 'react';
import {Layout, Menu, Input, Row, Col, Upload, Avatar, message, Card, Button} from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ScriptCard from '../components/ScriptCard';
import UploadFailModal from '../components/UploadFailModal';
import UploadSuccessModal from '../components/UploadSuccessModal';
import DownloadFailModal from '../components/DownloadFailModal';
import DownloadSuccessModal from '../components/DownloadSuccessModal';
import DownloadModal from '../components/DownloadModal';

const { Header, Content } = Layout;
const { Search } = Input;

const ScriptManagementPage = () => {
    const [scripts, setScripts] = useState([]);
    const userId = 1;
    const navigate = useNavigate();

    const [isUploadFailVisible, setUploadFailVisible] = useState(false);
    const [isUploadSuccessVisible, setUploadSuccessVisible] = useState(false);
    const [isDownloadFailVisible, setDownloadFailVisible] = useState(false);
    const [isDownloadSuccessVisible, setDownloadSuccessVisible] = useState(false);
    const [isDownloadModalVisible, setDownloadModalVisible] = useState(false);

    // for test
    const scriptData = [
        {
            title: '剧本 1',
            description: '这是一个示例剧本的描述。',
            analysis: `诗意的语言：该剧大量使用诗意的形式，尤其是五步抑扬格和押韵...
                    光明与黑暗的意象：光明用来象征罗密欧与朱丽叶爱情的纯洁与明亮...`,
        },
        // 其他剧本数据
    ];

    // 搜索功能
    const handleSearch = async (text) => {
        try {
            // 模拟搜索请求
            // 实际开发中将使用axios发送请求
            console.log(`Searching scripts for: ${text}`);
            message.success('搜索成功');
        } catch (error) {
            console.error('搜索失败：', error);
            message.error('搜索失败，请重试');
        }
    };

    // 上传文件功能
    const handleFileUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    };

    return (
        <Layout className="script-management-layout">
            <Content className="content">
                {/* 搜索栏和上传区域 */}
                <Row gutter={[16, 16]} align="middle" style={{ height: '100px', marginTop: '20px' }}>
                    <Col span={16}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <Search
                                placeholder="Please describe the Scripts you want to browse!"
                                onSearch={handleSearch}
                                enterButton
                                style={{ width: '100%', marginLeft: '20px' }}
                            />
                        </div>
                    </Col>

                    <Col span={8}>
                        <Upload.Dragger
                            name="files"
                            multiple
                            action="/api/upload"
                            onChange={handleFileUpload}
                            className="upload-dragger"
                            style={{ height: '20px', width: '360px' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for single or bulk upload. Do not upload sensitive data.
                            </p>
                        </Upload.Dragger>
                    </Col>
                </Row>

                {/*create new script*/}
                <Row gutter={[16, 16]} style={{ marginTop: '130px', marginLeft:'10px', marginRight:'10px'}} justify="center">
                    {/* 创建新剧本的卡片 */}
                    <Col span={6}>
                        <Card
                            hoverable
                            onClick={() => navigate('/script_creating')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '250px', // 固定高度
                                // width: '250px',
                                margin: 'auto', // 使其在网格中居中
                                fontSize: '16px'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PlusOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '12px' }} />
                                <span>Create new script</span>
                            </div>

                        </Card>



                    </Col>

                    {/* 示例脚本卡片 */}
                    {[...Array(7)].map((_, index) => (
                        <Col span={6} key={index}>
                            <ScriptCard
                                title={`Script ${index + 1}`}
                                description="这是一个示例脚本的描述。"
                                analysis="分析内容"
                            />
                        </Col>
                    ))}
                </Row>

                {/* for test 5 component */}
                <Row justify="center" gutter={[16, 16]} style={{ marginTop: '40px' }}>
                    <Col>
                        <Button type="primary" onClick={() => setUploadFailVisible(true)}>
                            Show Upload Fail
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => setUploadSuccessVisible(true)}>
                            Show Upload Success
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => setDownloadFailVisible(true)}>
                            Show Download Fail
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => setDownloadSuccessVisible(true)}>
                            Show Download Success
                        </Button>
                    </Col>
                    <Col>
                        <Button type="primary" onClick={() => setDownloadModalVisible(true)}>
                            Show Download Modal
                        </Button>
                    </Col>
                </Row>

                {/* 各种模态框 */}
                <UploadFailModal
                    visible={isUploadFailVisible}
                    onClose={() => setUploadFailVisible(false)}
                />
                <UploadSuccessModal
                    visible={isUploadSuccessVisible}
                    onClose={() => setUploadSuccessVisible(false)}
                />
                <DownloadFailModal
                    visible={isDownloadFailVisible}
                    onClose={() => setDownloadFailVisible(false)}
                />
                <DownloadSuccessModal
                    visible={isDownloadSuccessVisible}
                    onClose={() => setDownloadSuccessVisible(false)}
                />
                <DownloadModal
                    visible={isDownloadModalVisible}
                    onClose={() => setDownloadModalVisible(false)}
                />



            </Content>
        </Layout>
    );
};

export default ScriptManagementPage;
