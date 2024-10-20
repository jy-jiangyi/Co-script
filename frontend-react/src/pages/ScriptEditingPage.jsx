import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, Layout, Breadcrumb, theme } from 'antd';
import { Link, Navigate, useLocation } from 'react-router-dom'; // 导入 useLocation
import { HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Tabs, Button } from 'antd';

const { Header, Content, Sider } = Layout;

const ScriptDemo1 = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [scriptName, setScriptName] = useState(null);
  const [scenes, setScenes] = useState([]); // 用于存储场景数据
  const [redirect, setRedirect] = useState(false); // 用于重定向的状态

  const location = useLocation(); // 获取 location 对象

  const { TabPane } = Tabs;

  const StyledTabs = styled(Tabs)`
    .ant-tabs-nav::before {
      border-bottom: none;
    }

    .ant-tabs-ink-bar {
      background-color: #1890ff;
      height: 2px;
    }

    .ant-tabs-tab {
      font-size: 11px;
      padding: 0px 0px;
    }

    .ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #1890ff;
    }
  `;

  const NavigationBar = () => {
    return (
        <StyledTabs defaultActiveKey="character" centered>
            <TabPane tab="Character" key="character" />
            <TabPane tab="Parenthetical" key="parenthetical" />
            <TabPane tab="Dialogue" key="dialogue" />
            <TabPane tab="Transition" key="transition" />
            <TabPane tab="General" key="general" />
            <TabPane tab="Action" key="action" />
            <TabPane tab="Editing" key="editing" />
            <TabPane
                tab={
                <div>
                    <Link to="/scene_illustration">
                        <Button type="primary" size="small" style={{ marginLeft: '2px' }}>
                            Scene Illustration
                        </Button>
                    </Link>
                </div>
            }
            key="scene-illustration"
            />
            <TabPane tab="All Continuation" key="all-continuation" />
        </StyledTabs>
    );
  };

  useEffect(() => {
    const fetchScriptAndScenes = async () => {
      const params = new URLSearchParams(location.search);
      const scriptId = params.get('id'); // 获取 id 参数

      if (scriptId) {
        try {
          // Fetch script
          const scriptResponse = await axios.get(`/scripts/${scriptId}`);
          setScriptName(scriptResponse.data);

          // Fetch scenes
          const scenesResponse = await axios.get(`/scripts/${scriptId}/scenes`);
          setScenes(scenesResponse.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchScriptAndScenes();
  }, [location.search]); // 依赖于 location.search

  // 如果需要重定向，设置 redirect 为 true
  const handleRedirect = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/scene_illustration" />;
  }

  return (
    <Layout>
      <Content style={{ padding: '0 48px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item href="#/home">
            <HomeOutlined />
            <span>Home</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Script Editing</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <h2>{scriptName}</h2>
          <p>Script short summary</p>
        </div>
        <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
            <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%', borderRight: 0 }}>
                {scenes.map((scene) => (
                <Menu.Item key={scene.id}> {/* 使用 scene.id 作为 key */}
                    Scene {scene.id}: {scene.title} {/* 显示场景的 ID 和标题 */}
                </Menu.Item>
                ))}
            </Menu>
        </Sider>

          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <NavigationBar />
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default ScriptDemo1;