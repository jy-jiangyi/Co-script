import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, Layout, Breadcrumb, theme } from 'antd';
import { Link } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, ReloadOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const ScriptDemo1 = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [script, setScript] = useState(null);

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const response = await axios.get('/api/scripts/1'); // 替换为实际的 API 端点
        setScript(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchScript();
  }, []);

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
            {script ? (
              <div>
                <h1>{script.title}</h1>
                <p>{script.content}</p>
              </div>
            ) : (
              <div>Loading...</div>
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default ScriptDemo1;