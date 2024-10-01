import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [company, setCompany] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    //Handle Regitser Logic
    const handleRegister = () => {
        console.log('Email:', email);
        console.log('Username:', username);
        console.log('Company:', company);
        console.log('Role:', role);
        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
    };

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '50px', backgroundColor: '#fff', borderRadius: 8, boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Register For new account</Title>
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
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        placeholder="example" 
                    />
                </Form.Item>
                <Form.Item label="Company" required>
                    <Input 
                        value={company} 
                        onChange={(e) => setCompany(e.target.value)} 
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
                        value={password} 
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
                        Register for new account
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