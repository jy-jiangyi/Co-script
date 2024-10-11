import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom";
import axios from 'axios';

const { Title } = Typography;

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [name, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password_hash, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Handle Register Logic
    const handleRegister = async () => {
        // Basic validation
        if (password_hash !== confirmPassword) {
            alert("Passwords do not match!");
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
                console.log(response.status)
                // 注册成功，重定向到成功页面
                window.location.href = '/#/login';
            } else if (response.status === 400) {
                // 注册失败，重定向到错误页面
                window.location.href = '/error';
            }
        } catch (error) {
            console.error('Registration failed:', error);
            alert("Registration failed! Please try again.");
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
        </div>
    );
};

export default RegisterPage;