import * as React from 'react';
import {createContext, useContext, useState} from "react";
// 创建一个 Context
export const ActiveUser = createContext({
    activeUser: '',
    setActiveUser: (x:string) => {}
});

// 创建一个 Context Provider 组件
export const ActiveUserProvider = ({ children }) => {
    const [activeUser, setActiveUser] = useState('');

    return (
        <ActiveUser.Provider value={{ activeUser, setActiveUser }}>
            {children}
        </ActiveUser.Provider>
    );
};

export function useActiveUser() {
    return useContext(ActiveUser);
}