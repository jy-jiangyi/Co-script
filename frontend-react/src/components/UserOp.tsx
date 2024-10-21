import React, {useEffect, useState} from 'react';
import { useActiveUser } from "../hooks/UserContext";
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space } from 'antd';
import axios from 'axios';

const UserOp = () => {

    const handleLogout = () => {
        setActiveUser('');
    }

    useEffect(() => {
        axios.get("/users/name")
            .then(response => {
                let name = response.data;
                console.log("logged user", name)
                setActiveUser(name);
            })
            .catch(error => {
                console.log("error", error)
            })
    },[]);

    const item_unlogin: MenuProps['items'] = [
        {
            key: '1',
            label: 'New User',
            disabled: true,
          },
        {
            key: '2',
            label: (
                <a href='/#/Login'>Login/Regist</a>
            )
        }
    ];

    const item_login: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            key: '2',
            label: (
                <div onClick={handleLogout}>Logout</div>
            )
        }
    ];
    const { activeUser, setActiveUser } = useActiveUser();

    return (
        <Dropdown menu={{items: activeUser?item_login:item_unlogin }}>
        <a onClick={(e) => e.preventDefault()}>
        <Space>
            {activeUser?activeUser:"login/regist"}
            <DownOutlined />
        </Space>
        </a>
    </Dropdown>
    );
};

export default UserOp;