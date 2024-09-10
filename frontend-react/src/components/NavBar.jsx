import React from 'react';
import {Menu} from 'antd';

const items1 = ['1', '2', '3'].map((key) => ({
    key,
    label: `nav ${key}`,
}));

const NavBar = () => {
    return (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            items={items1}
            style={{
                flex: 1,
                minWidth: 0,
            }}
        />
    )
        ;
};

export default NavBar;
