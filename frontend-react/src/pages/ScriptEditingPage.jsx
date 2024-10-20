import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Layout, Breadcrumb, theme } from "antd";
import { Link, Navigate, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import { Tabs, Button } from "antd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";

const { Header, Content, Sider } = Layout;

const ScriptDemo1 = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [scriptName, setScriptName] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const location = useLocation();

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
    const tabItems = [
      { key: 'character', label: 'Character' },
      { key: 'parenthetical', label: 'Parenthetical' },
      { key: 'dialogue', label: 'Dialogue' },
      { key: 'transition', label: 'Transition' },
      { key: 'general', label: 'General' },
      { key: 'action', label: 'Action' },
      { key: 'editing', label: 'Editing' },
      {
        key: 'scene-illustration',
        label: (
          <Link to="/scene_illustration">
            <Button type="primary" size="small" style={{ marginLeft: '2px' }}>
              Scene Illustration
            </Button>
          </Link>
        ),
      },
      { key: 'all-continuation', label: 'All Continuation' },
    ];
  
    return (
      <StyledTabs defaultActiveKey="character" centered items={tabItems} />
    );
  };

  useEffect(() => {
    const fetchScriptAndScenes = async () => {
      const params = new URLSearchParams(location.search);
      const scriptId = params.get("id");

      if (scriptId) {
        try {
          const scriptResponse = await axios.get(`/scripts/${scriptId}`);
          setScriptName(scriptResponse.data);

          const scenesResponse = await axios.get(`/scripts/${scriptId}/scenes`);
          setScenes(scenesResponse.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchScriptAndScenes();
  }, [location.search]);

  const handleRedirect = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/scene_illustration" />;
  }

  return (
    <Layout>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
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
            <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              style={{ height: "100%", borderRight: 0 }}
            >
              {scenes.map((scene) => (
                <Menu.Item
                  key={scene.id}
                  onClick={() => setSelectedScene(scene)}
                >
                  Scene {scene.id}: {scene.title}
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
            {selectedScene && (
              <div>
                <h2>{selectedScene.title}</h2>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw, rehypeHighlight]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <pre data-language={match[1]}>
                          <code {...props}>{children}</code>
                        </pre>
                      ) : (
                        <code {...props}>{children}</code>
                      );
                    },
                  }}
                >
                  {selectedScene.content}
                </ReactMarkdown>
              </div>
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default ScriptDemo1;
