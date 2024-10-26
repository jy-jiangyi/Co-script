import React, { useState, useEffect } from "react";
import axios from "axios";
import { Menu, Layout, Breadcrumb, theme, Tabs, Button, Modal, Form, Input, Select, message } from "antd";
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

  // For adding/editing scene
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState("");

  // For deleting a scene
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null); // For deleting a scene

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
      { key: "character", label: "Character" },
      { key: "parenthetical", label: "Parenthetical" },
      { key: "dialogue", label: "Dialogue" },
      { key: "transition", label: "Transition" },
      { key: "general", label: "General" },
      { key: "action", label: "Action" },
      {
        key: "editing",
        label: (
          <Button type="primary" onClick={toggleEditing}>
            {editing ? "Save" : "Edit"}
          </Button>
        ),
      },
      {
        key: "scene-illustration",
        label: <Link to="/scene_illustration">Scene Illustration</Link>,
      },
      {
        key: "AI-continuation",
        label: (
          <Button type="primary" onClick={showAIContinuationModal}>
            AI Continuation
          </Button>
        ),
      },
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
        await axios.put(
          `/api/script_scenes/update_content/${selectedScene.id}`,
          editorContent,
          {
            headers: {
              "Content-Type": "text/plain", // Indicate pure text to backend
            },
          }
        );
        // Optionally update selectedScene's content
        setSelectedScene((prev) => ({ ...prev, content: editorContent }));
      } catch (error) {
        console.error("Error saving scene content:", error);
      }
    }
  };

  // Add or edit a scene
  const handleSceneChange = async () => {
    if (selectedScene) {
      // Edit existing scene
      try {
        const response = await axios.put(`/api/script_scenes/${selectedScene.id}`, { title: newSceneTitle });
        setScenes((prevScenes) => prevScenes.map(scene => scene.id === response.data.id ? response.data : scene));
      } catch (error) {
        console.error("Error updating scene:", error);
      }
    } else {
      // Add new scene
      try {
        const response = await axios.post(`/api/scripts/${scriptName.id}/scenes`, { title: newSceneTitle });
        setScenes([...scenes, response.data]);
      } catch (error) {
        console.error("Error adding scene:", error);
      }
    }
    setIsModalVisible(false);
    setNewSceneTitle("");
  };

  // Delete a scene with confirmation
  const confirmDeleteScene = async () => {
    if (sceneToDelete) {
      try {
        await axios.delete(`/api/script_scenes/${sceneToDelete}`);
        setScenes(scenes.filter((scene) => scene.id !== sceneToDelete));
        setSceneToDelete(null);
        setIsDeleteModalVisible(false);
        message.success("Scene deleted successfully!");
      } catch (error) {
        console.error("Error deleting scene:", error);
      }
    }
  };

  // Show modal for adding/editing a scene
  const showModal = (scene) => {
    setSelectedScene(scene);
    setNewSceneTitle(scene ? scene.title : ""); // Set title if editing, blank if adding
    setIsModalVisible(true); // Show modal
  };

  // Show modal for AI continuation
  const [isAIContinuationModalVisible, setIsAIContinuationModalVisible] = useState(false);
  const [selectedScene2, setSelectedScene2] = useState(null);
  const [positivePrompt, setPositivePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  const showAIContinuationModal = () => {
    setIsAIContinuationModalVisible(true);
  };

  const handleAIContinuationModalOk = () => {
    // Handle AI continuation logic
    console.log("Selected Scene:", selectedScene2);
    console.log("Positive Prompt:", positivePrompt);
    console.log("Negative Prompt:", negativePrompt);
    setIsAIContinuationModalVisible(false);
  };

  const handleAIContinuationModalCancel = () => {
    setIsAIContinuationModalVisible(false);
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
                <Menu.Item key={scene.id}>
                  <span onClick={() => {
                    setSelectedScene(scene);
                    setEditorContent(scene.content); // Set editor content
                  }}>
                    Scene {scene.scene}: {scene.title}
                  </span>
                  <Button
                    type="link"
                    onClick={() => showModal(scene)}
                    style={{ marginLeft: 8 }}
                  >
                    Edit
                  </Button>
                </Menu.Item>
              ))}
              <Menu.Item key="add-scene" onClick={() => showModal(null)}>
                Add Scene
              </Menu.Item>
              <Menu.Item key="delete-scene" onClick={() => setIsDeleteModalVisible(true)}>
                Delete Scene
              </Menu.Item>
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

        {/* Modal for adding/editing scene */}
        <Modal
          title={selectedScene ? "Edit Scene" : "Add New Scene"}
          visible={isModalVisible}
          onOk={handleSceneChange}
          onCancel={() => setIsModalVisible(false)}
        >
          <Form>
            <Form.Item label="Scene Title">
              <Input
                value={newSceneTitle}
                onChange={(e) => setNewSceneTitle(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for deleting a scene */}
        <Modal
          title="Delete Scene"
          visible={isDeleteModalVisible}
          onCancel={() => setIsDeleteModalVisible(false)}
          footer={null}
        >
          <Form>
            <Form.Item label="Select Scene to Delete">
              <Select
                placeholder="Select Scene"
                onChange={setSceneToDelete}
                style={{ width: "100%" }}
              >
                {scenes.map(scene => (
                  <Select.Option key={scene.id} value={scene.id}>
                    Scene {scene.scene}: {scene.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={confirmDeleteScene}>
                Confirm Delete
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for AI Continuation */}
        <Modal
          title="AI Continuation"
          visible={isAIContinuationModalVisible}
          onOk={handleAIContinuationModalOk}
          onCancel={handleAIContinuationModalCancel}
        >
          <Form>
            <Form.Item label="Select Scene">
              <Select
                placeholder="Select Scene"
                onChange={(value) => setSelectedScene2(value)}
                style={{ width: "100%" }}
              >
                {scenes.map((scene) => (
                  <Select.Option key={scene.id} value={scene.id}>
                    Scene {scene.scene}: {scene.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Positive Prompt">
              <Input
                value={positivePrompt}
                onChange={(e) => setPositivePrompt(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Negative Prompt">
              <Input
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default ScriptDemo1;