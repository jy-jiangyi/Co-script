import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const WelcomeNavBar = () => {
    return (
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
                <Link to="/">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/about">About</Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/contact">Contact</Link>
            </Menu.Item>
            <Menu.Item key="4">
                <Link to="/login">Login</Link>
            </Menu.Item>
        </Menu>
    );
};

export default WelcomeNavBar;
