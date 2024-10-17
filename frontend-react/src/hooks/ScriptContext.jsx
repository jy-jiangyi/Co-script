import React, { createContext, useState } from 'react';

// 创建一个 Context
export const ScriptContext = createContext();

// 创建一个 Context Provider 组件
export const ScriptProvider = ({ children }) => {
    const [scriptId, setScriptId] = useState(null);

    return (
        <ScriptContext.Provider value={{ scriptId, setScriptId }}>
            {children}
        </ScriptContext.Provider>
    );
};
