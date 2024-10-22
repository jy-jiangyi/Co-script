import React, { createContext, useContext, useState } from 'react';

// 创建一个 Context
export const ActiveCtx = createContext({
    activeCtx: '',
    setActiveCtx: (x:string) => {}
});

// 创建一个 Context Provider 组件
export const ActiveCtxProvider = ({ children }) => {
    const [activeCtx, setActiveCtx] = useState('');

    return (
        <ActiveCtx.Provider value={{ activeCtx, setActiveCtx }}>
            {children}
        </ActiveCtx.Provider>
    );
};

export function useActiveCtx() {
    return useContext(ActiveCtx);
}