import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // handle logic part
    const handleLogin = () => {
        console.log('Email:', email);
        console.log('Password:', password);
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
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="example" 
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
                {/* <Form.Item style={{ textAlign: 'center' }}>
                    <Link to="/forgot-password">Forgot password</Link>
                </Form.Item> */}
            </Form>
        </div>
    );
};

export default LoginPage;