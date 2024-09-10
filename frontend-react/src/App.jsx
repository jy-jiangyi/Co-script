import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import {HashRouter} from "react-router-dom";
import ProjectRoutes from "./routers/routers.jsx";

function App() {

    return (
        <HashRouter>
            <ProjectRoutes/>
        </HashRouter>
    )
}

export default App
