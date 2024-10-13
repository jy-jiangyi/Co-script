import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Breadcrumb, Button, Layout, List, Card, Image, Typography, Row, Col } from 'antd';
import { HomeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';

import '../styles/SceneIllustrationGeneration.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const API_ENDPOINT='/api/scene_illustration_generation';

// eg
const scenes = [
    {
        number: 1,
        title: 'Opening Scene',
        content: 'The story begins in a small village...',
        imageUrl: 'https://via.placeholder.com/200',
    },
    {
        number: 2,
        title: 'Conflict Arises',
        content: 'Our hero encounters a challenge...',
        imageUrl: 'https://via.placeholder.com/200',
    },
    // 添加更多场景
];


function BreadcrumbNav() {
    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item href="">
                <HomeOutlined />
                <span>Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="">
                <FileTextOutlined />
                <span>Script Editing</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Scene Illustration</Breadcrumb.Item>
        </Breadcrumb>
    );
}


function Header({ scriptName }) {
    return (
        <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
            <Title level={2}>{scriptName}</Title>
            <Button type="primary">Generate Scene</Button>
        </Row>
    );
}


function SceneItem({ scene }) {
    return (
        <Card style={{ marginBottom: '20px' }}>
            <Row gutter={16}>
                {/* 左侧：场次和标题 */}
                <Col span={16}>
                    <Title level={4}>{`Scene ${scene.scene}: ${scene.title}`}</Title>
                    {/* 如果需要显示内容，可以添加 scene.content */}
                </Col>

                {/* 右侧：占位图像和悬停效果 */}
                <Col span={8}>
                    <div className="image-container">
                        <Image
                            src={scene.imageUrl || 'https://via.placeholder.com/200'}
                            alt={`Scene ${scene.scene} Illustration`}
                            style={{ borderRadius: '4px' }}
                            preview={false}
                            width="100%"
                        />
                        <div className="overlay">
                            <Button type="primary" shape="round" icon={<ReloadOutlined />}>
                                Regenerate
                            </Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
}


function SceneList({ scenes }) {
    return (
        <List
            itemLayout="vertical"
            dataSource={scenes}
            renderItem={(scene) => <SceneItem key={scene.scene} scene={scene} />}
        />
    );
}

function SceneIllustrationGenerationPage() {
    // const { scriptId } = useParams(); // 获取路由参数中的 scriptId
    const scriptId = 1;
    const [scriptName, setScriptName] = useState('');
    const [scenes, setScenes] = useState([]);

    useEffect(() => {
        // 使用 axios 从 API 获取数据，发送 scriptId 作为请求参数
        axios
            .get(`${API_ENDPOINT}/get_details`, {
                params: {
                    scriptId: scriptId,
                },
            })
            .then((response) => {
                const data = response.data;
                console.log(data); // 测试输出
                setScriptName(data.scriptName);
                setScenes(data.scenes);
            })
            .catch((error) => {
                console.error('Error fetching script data:', error);
            });
    }, [scriptId]);

    return (
        <Content style={{ padding: '0 50px', marginTop: '20px' }}>
            <BreadcrumbNav />
            <div className="site-layout-content">
                <Header scriptName={scriptName} />
                <SceneList scenes={scenes} />
            </div>
        </Content>
    );
}

export default SceneIllustrationGenerationPage;
