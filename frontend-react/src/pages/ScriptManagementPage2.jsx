import { useState } from 'react';
import { Layout, Menu, Input, Row, Col, Card, Button, Upload, Avatar, message } from 'antd';
import { PlusOutlined, UploadOutlined, DownloadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import axios from 'axios';


const { Header, Content } = Layout;
const { Search } = Input;
const { Meta } = Card;

const ScriptManagementPage2 = () => {
    // 定义状态，用于存储搜索结果和脚本数据
    const [scripts, setScripts] = useState([]);
    const userId = 1; // 假设用户ID为1，需根据实际逻辑获取

    // 处理搜索逻辑
    const handleSearch = async (text) => {
        try {
            // 向后端发送搜索请求
            const response = await axios.post(`/api/scripts/findSimilarScripts`, { userId, text });
            if (response.data) {
                setScripts(response.data); // 更新脚本列表
                message.success('搜索成功');
            } else {
                message.warning('未找到相似脚本');
            }
        } catch (error) {
            console.error('搜索失败：', error);
            message.error('搜索失败，请重试');
        }
    };

    // 处理文件上传
    const handleFileUpload = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 文件上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 文件上传失败`);
        }
    };

    return (
        <Layout className="script-management-layout">
            {/* 顶部导航栏 */}
            <Header className="header">
                <div className="logo">Co-Script</div>
                <Menu mode="horizontal" className="user-menu">
                    <Menu.Item key="user">
                        <Avatar style={{ backgroundColor: '#87d068' }}>U</Avatar>
                        <span style={{ marginLeft: 8 }}>User Name</span>
                    </Menu.Item>
                    <Menu.Item key="logout">Logout</Menu.Item>
                </Menu>
            </Header>

            {/* 主内容区域 */}
            <Content className="content">
                {/* 搜索栏 */}
                <div className="search-bar">
                    <Search
                        placeholder="Please describe the Scripts you want to browse!"
                        onSearch={handleSearch}
                        enterButton
                    />
                </div>

                <Row gutter={[16, 16]}>
                    {/* 新建脚本卡片 */}
                    <Col span={6}>
                        <Card className="new-script-card" hoverable>
                            <PlusOutlined style={{ fontSize: '36px', color: '#1890ff' }} />
                            <div style={{ marginTop: 16 }}>Create new script</div>
                        </Card>
                    </Col>

                    {/* 上传文件区域 */}
                    <Col span={6}>
                        <Upload.Dragger
                            name="files"
                            multiple
                            action="/api/upload"
                            onChange={handleFileUpload}
                            className="upload-dragger"
                        >
                            <p className="ant-upload-drag-icon">
                                <UploadOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.
                            </p>
                        </Upload.Dragger>
                    </Col>

                    {/* 显示搜索结果 */}
                    {scripts.length > 0 ? (
                        scripts.map((script, index) => (
                            <Col span={6} key={index}>
                                <Card
                                    hoverable
                                    actions={[
                                        <Button key="download" type="link" icon={<DownloadOutlined />}>Download</Button>,
                                        <Button key="style-analysis" type="link" icon={<QuestionCircleOutlined />}>Style analysis</Button>
                                    ]}
                                >
                                    <Meta
                                        title={script.title || `Script ${index + 1}`}
                                        description={script.description || 'No description available'}
                                    />
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24} style={{ textAlign: 'center', marginTop: 50 }}>
                            No scripts found. Please try searching with different text.
                        </Col>
                    )}
                </Row>
            </Content>
        </Layout>
    );
};

export default ScriptManagementPage2;
