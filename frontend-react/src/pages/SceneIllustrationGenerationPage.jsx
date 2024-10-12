import React from 'react';
import { Breadcrumb, Button, Layout, List, Card, Image, Typography, Row, Col } from 'antd';
import { HomeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import '../styles/SceneIllustrationGeneration.css'

const { Content } = Layout;
const { Title, Text } = Typography;

// Sample data for scenes
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
    // Add more scenes as needed
];

function SceneIllustrationGenerationPage() {
    const scriptName = 'My Awesome Script'; // Replace with your actual script name

    return (
        <Content style={{ padding: '0 50px', marginTop: '20px' }}>
            {/* Breadcrumb Navigation Bar */}
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

            <div className="site-layout-content">
                {/* Title and Generate Scene Button */}
                <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
                    <Title level={2}>{scriptName}</Title>
                    <Button type="primary">Generate Scene</Button>
                </Row>

                {/* Scene Blocks */}
                <List
                    itemLayout="vertical"
                    dataSource={scenes}
                    renderItem={(scene) => (
                        <Card style={{ marginBottom: '20px' }}>
                            <Row gutter={16}>
                                {/* Left Side: Scene Number, Title, Content */}
                                <Col span={16}>
                                    <Title level={4}>{`Scene ${scene.number}: ${scene.title}`}</Title>
                                    <Text>{scene.content}</Text>
                                </Col>

                                {/* Right Side: Image with Hover Effect */}
                                <Col span={8}>
                                    <div className="image-container">
                                        <Image
                                            src={scene.imageUrl}
                                            alt={`Scene ${scene.number} Illustration`}
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
                    )}
                />
            </div>
        </Content>
    );
}

export default SceneIllustrationGenerationPage;
