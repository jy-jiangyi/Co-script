import React, { useState } from "react";
import { Form, Input, Button, Typography, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useActiveUser } from "../hooks/UserContext";

const { Title } = Typography;

const LoginPage = () => {
    
    const { activeUser, setActiveUser } = useActiveUser();

    const [email, setEmail] = useState('');
    const [password_hash, setPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [modalIcon, setModalIcon] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async () => {
        const errors = [];

        if (!email) {
            errors.push("Email is required.");
        }
        if (!password_hash) {
            errors.push("Password is required.");
        }

        if (errors.length > 0) {
            setModalTitle('Missing Fields');
            setModalContent(errors.join("\n"));
            setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
            setModalVisible(true);
            return;
        }

        const data = { email, password_hash };

        try {
            const response = await axios.post('/users/login', data);
            if (response.status === 200) {
                setModalTitle('Login Successful');
                setModalContent("Welcome back!");
                setActiveUser(response.data);
                setModalIcon(<CheckCircleOutlined style={{ color: 'green', fontSize: 24 }} />);
                setModalVisible(true);
                // Redirect or set user state here
                setTimeout(() => {
                    navigate('/'); // Change to your home route
                }, 2000);
            }
        } catch (error) {
            if (error.response) {
                const errorMessage = error.response.data;
                setModalTitle('Error');
                setModalContent(errorMessage);
                setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
                setModalVisible(true);
            } else {
                console.error('Login failed:', error);
                setModalTitle('Login Failed');
                setModalContent("Please try again.");
                setModalIcon(<ExclamationCircleOutlined style={{ color: 'red', fontSize: 24 }} />);
                setModalVisible(true);
            }
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '50px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Login with existing account</Title>
            <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item label="Email" required>
                    <Input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="example@example.com" 
                    />
                </Form.Item>
                <Form.Item label="Password" required>
                    <Input.Password 
                        value={password_hash} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                        Login
                    </Button>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center' }}>
                    Do not have an account? Register{' '} 
                    <Link to="/register">here</Link>
                </Form.Item>
            </Form>

            {/* Modal for displaying messages */}
            <Modal
                title={modalTitle}
                visible={modalVisible}
                onOk={() => setModalVisible(false)}
                footer={[
                    <Button key="done" type="primary" onClick={() => setModalVisible(false)}>
                        Done
                    </Button>
                ]}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {modalIcon}
                    <p style={{ marginLeft: 8 }}>{modalContent}</p>
                </div>
            </Modal>
        </div>
    );
};

export default LoginPage;