import React, { useEffect, useState } from 'react';
import { Layout, Input, Row, Col, Upload, Card, Button, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ScriptCard from '../components/ScriptCard';
import UploadFailModal from '../components/UploadFailModal';
import UploadSuccessModal from '../components/UploadSuccessModal';
import DownloadFailModal from '../components/DownloadFailModal';
import DownloadSuccessModal from '../components/DownloadSuccessModal';
import DownloadModal from '../components/DownloadModal';
import axios from 'axios';

const { Content } = Layout;
const { Search } = Input;

const ScriptManagementPage = () => {
    const [scripts, setScripts] = useState([]);
    const navigate = useNavigate();

    // Modal visibility state
    const [isUploadFailVisible, setUploadFailVisible] = useState(false);
    const [isUploadSuccessVisible, setUploadSuccessVisible] = useState(false);
    const [isDownloadFailVisible, setDownloadFailVisible] = useState(false);
    const [isDownloadSuccessVisible, setDownloadSuccessVisible] = useState(false);
    const [isDownloadModalVisible, setDownloadModalVisible] = useState(false);

    // Fetch scripts from the backend
    useEffect(() => {
        const fetchScripts = async () => {
            try {
                const response = await axios.post('/api/script_management/findAllScripts');
                setScripts(response.data);
                console.log(response.data);
            } catch (error) {
                console.error('Error fetching scripts:', error);
                message.error('获取脚本列表失败');
            }
        };

        fetchScripts();
    }, []);

    // Handle search
    const handleSearch = async (text) => {
        try {
            console.log(`Searching scripts for: ${text}`);
            // In actual development, you might use axios to search scripts
            message.success('搜索成功');
        } catch (error) {
            console.error('搜索失败：', error);
            message.error('搜索失败，请重试');
        }
    };

    // Handle file upload
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
                {/* Search bar and upload area */}
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
                            style={{ height: '100px', width: '360px' }}
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

                {/* Create new script card */}
                <Row gutter={[16, 16]} style={{ marginTop: '130px', marginLeft: '10px', marginRight: '10px' }} justify="center">
                    <Col span={6}>
                        <Card
                            hoverable
                            onClick={() => navigate('/script_creating')}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '250px',
                                margin: 'auto',
                                fontSize: '16px'
                            }}
                        >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <PlusOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '12px' }} />
                                <span>Create new script</span>
                            </div>
                        </Card>
                    </Col>

                    {/* Dynamic rendering of script cards */}
                    {scripts.map((script) => (
                        <Col span={6} key={script.id}>
                            <ScriptCard
                                title={script.name}
                                description={script.summary}
                                scriptId={script.id}
                            />
                        </Col>
                    ))}
                </Row>

                {/* Test 5 components */}
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

                {/* Modals for testing */}
                <UploadFailModal visible={isUploadFailVisible} onClose={() => setUploadFailVisible(false)} />
                <UploadSuccessModal visible={isUploadSuccessVisible} onClose={() => setUploadSuccessVisible(false)} />
                <DownloadFailModal visible={isDownloadFailVisible} onClose={() => setDownloadFailVisible(false)} />
                <DownloadSuccessModal visible={isDownloadSuccessVisible} onClose={() => setDownloadSuccessVisible(false)} />
                <DownloadModal visible={isDownloadModalVisible} onClose={() => setDownloadModalVisible(false)} />
            </Content>
        </Layout>
    );
};

export default ScriptManagementPage;
