import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {HashRouter} from "react-router-dom";
import ProjectRoutes from "./routers/routers.jsx";
import {ScriptProvider} from "./hooks/ScriptContext.jsx";
import {ActiveCtxProvider} from "./hooks/ActiveContext.tsx";
import {ActiveUserProvider} from "./hooks/UserContext.tsx";

function App() {

    return (
        <HashRouter>
            <ActiveUserProvider>
                <ActiveCtxProvider>
                    <ScriptProvider>
                        <ProjectRoutes/>
                    </ScriptProvider>
                </ActiveCtxProvider>
            </ActiveUserProvider>
        </HashRouter>
    )
}

export default App
