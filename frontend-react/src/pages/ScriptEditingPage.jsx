import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Menu,
  Layout,
  Breadcrumb,
  theme,
  Tabs,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { Link, Navigate, useLocation } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { marked } from "marked";


const { Content, Sider } = Layout;

const ScriptDemo1 = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [scriptName, setScriptName] = useState(null);
  const [scenes, setScenes] = useState([]);
  const [sideToggle, setSideToggle] = useState(false);
  const [selectedScene, setSelectedScene] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [shortSummary, setShortSummary] = useState(""); // 新增状态
  
  const [scriptId, setScriptId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSceneTitle, setNewSceneTitle] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);
  const [selectedContext, setSelectedContext] = useState("");
  const [sceneNameForAIContinuation, setSceneNameForAIContinuation] = useState("");
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

  const fetchScriptAndScenes = async () => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    if (id) {
      setScriptId(id);
      try {
        const scriptResponse = await axios.get(`/scripts/${id}`);
        setScriptName(scriptResponse.data);

        const scenesResponse = await axios.get(`/scripts/${id}/scenes`);
        setScenes(scenesResponse.data);
      } catch (error) {
        console.error(error);
      }
    }
  }; 

  useEffect(() => {
    fetchScriptAndScenes();
  }, []);

  useEffect(() => {
    fetchScriptAndScenes();
  }, [sideToggle])

  useEffect(() => {
    const fetchScriptSummary = async () => {
      try {
        const response = await axios.get(`/api/script_management/${scriptId}/scenes/summary/short`);
        setShortSummary(response.data);
      } catch (error) {
        console.error("Error fetching script summary:", error);
      }
    };

    fetchScriptSummary();
  }, [scriptId]); // 依赖项是 scriptId

  const handleRedirect = () => {
    setRedirect(true);
  };

  if (redirect) {
    return <Navigate to="/scene_illustration" />;
  }

  const toggleEditing = () => {
    setEditing((prevEditing) => {
      const newEditing = !prevEditing;
      if (newEditing) {
        if (selectedScene) {
          const htmlContent = marked(selectedScene.content);
          setEditorContent(htmlContent);
        }
      } else {
        saveSceneContent();
      }
      return newEditing;
    });
  };

  const saveSceneContent = async () => {
    if (selectedScene) {
      try {
        await axios.put(
          `/api/script_scenes/update_content/${selectedScene.id}`,
          editorContent,
          {
            headers: {
              "Content-Type": "text/plain",
            },
          }
        );
        setSelectedScene((prev) => ({ ...prev, content: editorContent }));
      } catch (error) {
        console.error("Error saving scene content:", error);
      }
    }
  };

  const handleSceneChange = async () => {
    if (selectedScene) {
      try {
        const response = await axios.put(
          `/api/script_scenes/${selectedScene.id}`,
          { title: newSceneTitle }
        );
        setScenes((prevScenes) =>
          prevScenes.map((scene) =>
            scene.id === response.data.id ? response.data : scene
          )
        );
      } catch (error) {
        console.error("Error updating scene:", error);
      }
    } else {
      try {
        const response = await axios.post(
          `/api/scripts/${scriptName.id}/scenes`,
          { title: newSceneTitle }
        );
        setScenes([...scenes, response.data]);
      } catch (error) {
        console.error("Error adding scene:", error);
      }
    }
    setIsModalVisible(false);
    setNewSceneTitle("");
  };

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

  const showModal = (scene) => {
    setSelectedScene(scene);
    setNewSceneTitle(scene ? scene.title : "");
    setIsModalVisible(true);
  };

  const [isAIContinuationModalVisible, setIsAIContinuationModalVisible] =
    useState(false);
  const [selectedScene2, setSelectedScene2] = useState(null);
  const [positivePrompt, setPositivePrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");

  const showAIContinuationModal = () => {
    setIsAIContinuationModalVisible(true);
  };

  const handleAIContinuationModalOk = async () => {
    const requestBody = {
      script_id: Number(scriptId),
      scene_id: selectedScene2.scene,
      name: sceneNameForAIContinuation,
      contextList: [""],
      positive: positivePrompt,
      negative: negativePrompt,
    };

    console.log(requestBody);

    try {
      const response = await axios.post(
        '/scripts/ai_continuation',
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      message.success(response.data.message);
      setIsAIContinuationModalVisible(false);
      setSideToggle(!sideToggle);
    } catch (error) {
      if (error.response) {
        message.error(`Error: ${error.response.data.message}`);
      } else {
        message.error("An unexpected error occurred.");
      }
    }
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
          <p>{shortSummary}</p>
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
                  <span
                    onClick={() => {
                      setSelectedScene(scene);
                      setEditorContent(scene.content);
                    }}
                  >
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
                    style={{ height: "300px" }}
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

        <Modal
          title="AI Continuation"
          visible={isAIContinuationModalVisible}
          onOk={handleAIContinuationModalOk}
          onCancel={handleAIContinuationModalCancel}
        >
          <Form>
            <Form.Item label="Select Previous Scene">
              <Select
                placeholder="Select Previous Scene"
                value={selectedScene2?.id}
                onChange={(value) => {
                  const selectedSceneItem = scenes.find(
                    (scene) => scene.id === value
                  );
                  setSelectedScene2(selectedSceneItem);
                }}
                style={{ width: "100%" }}
              >
                {scenes.map((scene) => (
                  <Select.Option key={scene.id} value={scene.id}>
                    Scene {scene.scene}: {scene.title}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="New Scene Name">
              <Input
                value={sceneNameForAIContinuation}
                onChange={(e) => setSceneNameForAIContinuation(e.target.value)}
              />
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