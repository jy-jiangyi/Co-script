import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';

const WelcomeNavBar = () => {

    const menuItems = [
        {
            key: "1",
            label: (
                <Link to="/">Home</Link>
            )
        },
        {
            key: "2",
            label: (
                <Link to="/about">About</Link>
            )
        },
        {
            key: "3",
            label: (
                <Link to="/contact">Contact</Link>
            )
        },
        {
            key: "4",
            label: (
                <Link to="/login">Home</Link>
            )
        },
        {
            key: "5",
            label: (
                <Link to="/context">Context</Link>
            )
        }
    ];

    return (
        <Menu 
            theme="dark" 
            mode="horizontal" 
            style={{width: "100%"}}
            defaultSelectedKeys={['1']}
            items={menuItems}/>
    );
};

export default WelcomeNavBar;
