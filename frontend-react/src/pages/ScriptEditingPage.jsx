import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, Layout, Breadcrumb, theme } from 'antd';
import { Link, Navigate } from 'react-router-dom'; // 导入 Navigate
import { HomeOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Tabs, Button } from 'antd';

const { Header, Content, Sider } = Layout;

const ScriptDemo1 = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [scriptName, setScriptName] = useState(null);
  const [redirect, setRedirect] = useState(false); // 用于重定向的状态

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
    const fetchScript = async () => {
      try {
        const response = await axios.get('/scripts/1'); // 替换为实际的 API 端点
        setScriptName(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScript();
  }, []);

  // 如果需要重定向，设置 redirect 为 true
  const handleRedirect = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/scene_illustration" />; // 使用 Navigate 进行重定向
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
          <Sider
            width={200}
            style={{
              background: colorBgContainer,
            }}
          >
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              style={{ height: '100%', borderRight: 0 }}
            >
              <Menu.Item key="1">Scene 1</Menu.Item>
              <Menu.Item key="2">Scene 2</Menu.Item>
              <Menu.Item key="3">Scene 3</Menu.Item>
              <Menu.Item key="4">Scene 4</Menu.Item>
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