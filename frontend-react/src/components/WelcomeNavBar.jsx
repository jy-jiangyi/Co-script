import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { useActiveUser } from '../hooks/UserContext';

const WelcomeNavBar = () => {

    const { activeUser, setActiveUser } = useActiveUser();

    const menuItems = () => {
        let base_menu = [
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
        }];
        let user_menu = [,
        {
            key: "5",
            label: (
                <Link to="/context">Context</Link>
            )
        }];
        if(activeUser){
            return [...base_menu, ...user_menu];
        }else{
            return base_menu;
        }
    };

    return (
        <Menu 
            theme="dark" 
            mode="horizontal" 
            style={{width: "100%"}}
            defaultSelectedKeys={['1']}
            items={menuItems()}/>
    );
};

export default WelcomeNavBar;
