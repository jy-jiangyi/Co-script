import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Breadcrumb, Button, Layout, List, Card, Image, Typography, Row, Col } from 'antd';
import { HomeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import {ScriptContext} from "../hooks/ScriptContext.jsx";

import '../styles/SceneIllustrationGeneration.css';

const { Content } = Layout;
const { Title, Text } = Typography;

const API_ENDPOINT='/api/scene_illustration_generation';


function BreadcrumbNav() {
    return (
        <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item href="#/home">
                <HomeOutlined />
                <span>Home</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item href="#/script_editing">
                <FileTextOutlined />
                <span>Script Editing</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Scene Illustration</Breadcrumb.Item>
        </Breadcrumb>
    );
}


function Header({ scriptName, onGenerateScenes, loading }) {
    return (
        <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
            <Title level={2}>{scriptName}</Title>
            <Button type="primary" onClick={onGenerateScenes} loading={loading} disabled={loading}>
                Generate Scene
            </Button>
        </Row>
    );
}



function SceneItem({ scene, onUpdateScene }) {
    const [loading, setLoading] = useState(false);

    const handleRegenerate = () => {
        setLoading(true);
        axios
            .get(`${API_ENDPOINT}/generate_scene_image`, {
                params: {
                    sceneId: scene.id,
                },
            })
            .then((response) => {
                const newImageUrl = response.data;
                onUpdateScene(scene.id, newImageUrl);
            })
            .catch((error) => {
                console.error('Error regenerating image:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Card style={{ marginBottom: '20px' }}>
            <Row gutter={16}>
                {/* 左侧：场景编号、标题和内容 */}
                <Col span={12}>
                    <Title level={4}>{`Scene ${scene.scene}: ${scene.title}`}</Title>
                    <Typography.Paragraph
                        ellipsis={{
                            rows: 3,
                            expandable: true,
                            symbol: 'more',
                        }}
                    >
                        <span dangerouslySetInnerHTML={{__html: scene.content}}/>
                    </Typography.Paragraph>
                </Col>

                {/* 右侧：图片和按钮 */}
                <Col span={12}>
                    <Row align="middle" justify="end">
                        {/* 图片 */}
                        <Col>
                            <Image
                                src={scene.imageUrl || "data:image/png;base64,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"}
                                alt={`Scene ${scene.scene} Illustration`}
                                style={{
                                    borderRadius: '4px',
                                    maxWidth: '270px',
                                    maxHeight: '270px',
                                    width: '100%',
                                    height: 'auto',
                                }}
                                preview={true}
                            />
                        </Col>
                        {/* 按钮 */}
                        <Col style={{ marginLeft: '20px' }}>
                            <Button
                                type="primary"
                                shape="round"
                                icon={<ReloadOutlined />}
                                onClick={handleRegenerate}
                                loading={loading}
                            >
                                Regenerate
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
}


function SceneList({ scenes, onUpdateScene }) {
    return (
        <List
            itemLayout="vertical"
            dataSource={scenes}
            renderItem={(scene) => (
                <SceneItem key={scene.id} scene={scene} onUpdateScene={onUpdateScene} />
            )}
        />
    );
}

function SceneIllustrationGenerationPage() {
    // const { scriptId } = useParams(); // 获取路由参数中的 scriptId
    const scriptId = 1;
    const [scriptName, setScriptName] = useState('');
    const [scenes, setScenes] = useState([]);
    // const { scriptId } = useContext(ScriptContext);

    const [loading, setLoading] = useState(false);

    const fetchScenes = () => {
        axios
            .get(`${API_ENDPOINT}/get_details`, {
                params: {
                    scriptId: scriptId,
                },
            })
            .then((response) => {
                const data = response.data;
                setScriptName(data.scriptName);
                setScenes(data.scenes);
            })
            .catch((error) => {
                console.error('Error fetching script data:', error);
            });
    };


    useEffect(() => {
        fetchScenes();
    }, [scriptId]);

    // Handler for generating all scenes images
    const handleGenerateScenes = () => {
        setLoading(true);
        axios
            .get(`${API_ENDPOINT}/generate_script_images`, {
                params: {
                    scriptId: scriptId,
                },
            })
            .then((response) => {
                const imageUrls = response.data;
                setScenes((prevScenes) =>
                    prevScenes.map((scene, index) => ({
                        ...scene,
                        imageUrl: imageUrls[index] || scene.imageUrl,
                    }))
                );
            })
            .catch((error) => {
                console.error('Error generating images:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Handler for updating a single scene's imageUrl
    const handleUpdateSceneImage = (sceneId, newImageUrl) => {
        setScenes((prevScenes) =>
            prevScenes.map((scene) =>
                scene.id === sceneId ? { ...scene, imageUrl: newImageUrl } : scene
            )
        );
    };


    return (
        <Content style={{ padding: '0 50px', marginTop: '20px' }}>
            <BreadcrumbNav />
            <div className="site-layout-content">
                <Header
                    scriptName={scriptName}
                    onGenerateScenes={handleGenerateScenes}
                    loading={loading}
                />
                <SceneList scenes={scenes} onUpdateScene={handleUpdateSceneImage} />
            </div>
        </Content>
    );
}

export default SceneIllustrationGenerationPage;
