import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Layout, Breadcrumb, theme, Tabs, Button } from "antd";
import { Link, Navigate, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import ReactQuill from "react-quill"; // Import ReactQuill
import "react-quill/dist/quill.snow.css"; // Import styles
import { marked } from "marked"; // Import marked for Markdown conversion

const { Content, Sider } = Layout;

const ScriptDemo1 = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [scriptName, setScriptName] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorContent, setEditorContent] = useState(""); // For storing editor content

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
      {
        key: 'editing',
        label: (
          <Button type="primary" onClick={toggleEditing}>
            {editing ? "Save" : "Edit"}
          </Button>
        ),
      },
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

  // Toggle editing state
  const toggleEditing = () => {
    setEditing((prevEditing) => {
      const newEditing = !prevEditing; // Toggle current state
      if (newEditing) {
        // Enter edit mode
        if (selectedScene) {
            const htmlContent = marked(selectedScene.content);
            setEditorContent(htmlContent); // Set editor content to Markdown
        }
      } else {
        // Save content when exiting edit mode
        saveSceneContent();
      }
      return newEditing; // Return new state
    });
  };

  // Save scene content
  const saveSceneContent = async () => {
    if (selectedScene) {
      try {
        // Directly send editorContent, ensure it's a string
        await axios.put(`/api/script_scenes/update_content/${selectedScene.id}`, editorContent, {
          headers: {
            'Content-Type': 'text/plain', // Indicate pure text to backend
          },
        });
        // Optionally update selectedScene's content
        setSelectedScene(prev => ({ ...prev, content: editorContent })); 
      } catch (error) {
        console.error("Error saving scene content:", error);
      }
    }
  };

  return (
    <Layout>
      <Content style={{ padding: "0 48px" }}>
        <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>
            <Link to="/home">
            <HomeOutlined />
            <span>Home</span>
            </Link>
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
                  onClick={() => {
                    setSelectedScene(scene);
                    setEditorContent(scene.content); // Set editor content
                  }}
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
                {editing ? (
                  <ReactQuill
                    value={editorContent}
                    onChange={setEditorContent}
                    style={{ height: "300px" }} // Set height
                  />
                ) : (
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
                )}
              </div>
            )}
          </Content>
        </Layout>
      </Content>
    </Layout>
  );
};

export default ScriptDemo1;