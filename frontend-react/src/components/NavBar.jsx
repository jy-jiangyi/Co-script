import React from 'react';
import {Menu} from 'antd';
import { Link } from 'react-router-dom';

const NavBar = () => {
    return (
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
                <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/context">Context Management</Link>
            </Menu.Item>
        </Menu>
    );
};

export default NavBar;
