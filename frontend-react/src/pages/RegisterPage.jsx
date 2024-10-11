import React, { useState } from "react";
import { Form, Input, Button, Typography, Modal } from "antd";
import { Link } from "react-router-dom";
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [name, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password_hash, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // 状态管理，用于控制 Modal 的可见性和内容
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalIcon, setModalIcon] = useState(null);

    // 处理注册逻辑
    const handleRegister = async () => {
        // 初始化错误消息数组
        const errors = [];

        // 检查每个字段是否为空，并添加相应的错误消息
        if (!email) {
            errors.push("Email is required.");
        }
        if (!name) {
            errors.push("Username is required.");
        }
        if (!role) {
            errors.push("Role is required.");
        }
        if (!password_hash) {
            errors.push("Password is required.");
        }
        if (!confirmPassword) {
            errors.push("Confirm password is required.");
        }

        // 如果有错误，显示所有错误消息
        if (errors.length > 0) {
            setModalTitle('Missing Fields');
            setModalContent(errors.join("\n"));
            setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
            setModalVisible(true);
            return;
        }

        // 检查密码是否匹配
        if (password_hash !== confirmPassword) {
            setModalTitle('Mismatch Password');
            setModalContent("Make sure confirm password and password is the same.");
            setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
            setModalVisible(true);
            return;
        }

        const data = {
            email,
            name,
            role,
            password_hash,
        };

        try {
            const response = await axios.post('/users/register', data);
            if (response.status === 201) {
                setModalTitle('Successfully Registered');
                setModalContent("You can now login with this email.");
                setModalIcon(<CheckCircleOutlined style={{ color: 'green', fontSize: 24 }} />);
                setModalVisible(true);
                // 注册成功，重定向到成功页面
                setTimeout(() => {
                    window.location.href = '/#/login';
                }, 2000); // 2秒后重定向
            } else if (response.status === 400) {
                setModalTitle('Error');
                setModalContent("Registration failed.");
                setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
                setModalVisible(true);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data; // 获取后端返回的错误消息
                setModalTitle('Error');
                setModalContent(errorMessage);
                setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
                setModalVisible(true);
            } else {
                console.error('Registration failed:', error);
                setModalTitle('Registration Failed');
                setModalContent("Please try again.");
                setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
                setModalVisible(true);
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '50px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Register For New Account</Title>
            <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item label="Email" required>
                    <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="example@example.com" 
                    />
                </Form.Item>
                <Form.Item label="Username" required>
                    <Input 
                        value={name} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="example" 
                    />
                </Form.Item>
                <Form.Item label="Role" required>
                    <Input 
                        value={role} 
                        onChange={(e) => setRole(e.target.value)} 
                        placeholder="example" 
                    />
                </Form.Item>
                <Form.Item label="Password" required>
                    <Input.Password 
                        value={password_hash} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="example" 
                    />
                </Form.Item>
                <Form.Item label="Confirm Password" required>
                    <Input.Password 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="example" 
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Register for New Account
                    </Button>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    Already have an account? Login{' '} 
                    <Link to="/login">here</Link>
                </Form.Item>
            </Form>

            {/* Modal 用于展示错误和成功消息 */}
            <Modal
                title={modalTitle}
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                okText="Done"
            >
                {/* 在内容中添加图标 */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {modalIcon}
                    <p style={{ marginLeft: 8 }}>{modalContent}</p>
                </div>
            </Modal>
        </div>
    );
};

export default RegisterPage;