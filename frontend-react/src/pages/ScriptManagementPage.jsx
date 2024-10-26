import React, { useEffect, useState } from 'react';
import { Layout, Input, Row, Col, Upload, Card, Button, message, Modal } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ScriptCard from '../components/ScriptCard';
import UploadFailModal from '../components/UploadFailModal';
import DownloadFailModal from '../components/DownloadFailModal';
import DownloadSuccessModal from '../components/DownloadSuccessModal';
import DownloadModal from '../components/DownloadModal';
import axios from 'axios';

const { Content } = Layout;
const { Search } = Input;

const ScriptManagementPage = () => {
    const [scripts, setScripts] = useState([]);  // 所有脚本数据
    const [filteredScripts, setFilteredScripts] = useState([]);  // 存储过滤后的脚本数据
    const [fileContent, setFileContent] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState([]);  // 存储搜索结果的scriptId

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
                setFilteredScripts(response.data);  // 初始化时显示所有脚本
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
            // 调用后端搜索接口
            const response = await axios.post('/api/script_management/search', { text });

            if (response.status === 200) {
                const scriptIds = response.data;
                console.log("Received script IDs: ", scriptIds); // 输出返回的ID列表
                setSearchResults(scriptIds); // 更新状态

                // 根据搜索结果过滤脚本数据
                const results = scripts.filter(script => scriptIds.includes(script.id));
                setFilteredScripts(results);  // 更新显示的脚本
                message.success('搜索成功');
            } else {
                message.error('搜索失败，请重试');
            }
        } catch (error) {
            console.error('搜索失败：', error);
            message.error('搜索失败，请重试');
        }
    };

    // Validate file type before upload
    const beforeUpload = (file) => {
        const isTxt = file.type === 'text/plain';
        if (!isTxt) {
            message.error('只能上传TXT文件！');
            return Upload.LIST_IGNORE; // 阻止上传
        }
        return true;
    };

    // Handle file upload
    const handleFileUpload = (info) => {
        const file = info.file.originFileObj;
        if (info.file.status === 'done' || file) {
            // 使用 FileReader 读取文件内容
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setFileContent(content); // 设置文件内容
                setNewFileName(file.name); // 默认文件名
                setUploadSuccessVisible(true); // 显示成功上传的弹窗
            };
            reader.readAsText(file);
            message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    };

    // Handle rename and save
    const handleRenameAndSave = async () => {
        if (!newFileName) {
            message.error('请输入新的文件名！');
            return;
        }

        try {
            await axios.post('/api/upload/saveFile', {
                fileName: newFileName,
                content: fileContent,
            });
            message.success('文件名和内容已成功发送！');
            setUploadSuccessVisible(false);
        } catch (error) {
            message.error('文件名和内容发送失败！');
            console.error(error);
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
                                placeholder="Please enter the script name!"
                                onSearch={handleSearch}
                                enterButton
                                style={{ width: '100%', marginLeft: '20px' }}
                            />
                        </div>
                    </Col>

                    <Col span={8}>
                        <Upload.Dragger
                            name="files"
                            multiple={false}  // 只允许上传一个文件
                            action="/api/upload"
                            beforeUpload={beforeUpload}  // 验证文件类型
                            onChange={handleFileUpload}
                            accept=".txt"  // 限制上传文件类型为 .txt
                            showUploadList={false}
                            className="upload-dragger"
                            style={{ height: '100px', width: '360px' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Only .txt files are supported.
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
                    {filteredScripts.map((script) => (
                        <Col span={6} key={script.id}>
                            <ScriptCard
                                title={script.name}
                                description={script.summary}
                                scriptId={script.id}
                            />
                        </Col>
                    ))}
                </Row>

                {/* Upload success modal */}
                <Modal
                    visible={isUploadSuccessVisible}
                    title="Successfully uploaded"
                    onCancel={() => setUploadSuccessVisible(false)}
                    footer={[
                        <Button key="back" onClick={() => setUploadSuccessVisible(false)}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleRenameAndSave}>
                            Done
                        </Button>,
                    ]}
                >
                    <p>Please rename the file!</p>
                    <Input
                        placeholder="Input a new file name"
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                    />
                </Modal>

                {/* Modals for testing */}
                <UploadFailModal visible={isUploadFailVisible} onClose={() => setUploadFailVisible(false)} />
                <DownloadFailModal visible={isDownloadFailVisible} onClose={() => setDownloadFailVisible(false)} />
                <DownloadSuccessModal visible={isDownloadSuccessVisible} onClose={() => setDownloadSuccessVisible(false)} />
                <DownloadModal visible={isDownloadModalVisible} onClose={() => setDownloadModalVisible(false)} />
            </Content>
        </Layout>
    );
};

export default ScriptManagementPage;
