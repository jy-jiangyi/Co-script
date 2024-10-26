import { Routes, Route, Link } from "react-router-dom";

import WelcomeLayout from "../layouts/WelcomeLayout.jsx";

import SciptManagementPage from "../pages/ScriptManagementPage.jsx";
import ContextManagementPage from "../pages/ContextManagementPage.tsx";
import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";
import SceneIllustrationGenerationPage from "../pages/SceneIllustrationGenerationPage.jsx";
import ScriptEditingPage from "../pages/ScriptEditingPage.jsx"
import ScriptCreatingPage from "../pages/ScriptCreatingPage.jsx";
import ScriptManagementPage from "../pages/ScriptManagementPage.jsx";

function ProjectRoutes() {
    return (
        <Routes>
            <Route path="/" element={<WelcomeLayout><LandingPage /></WelcomeLayout>}></Route>
            <Route path="/about" element={<WelcomeLayout><AboutPage /></WelcomeLayout>}></Route>
            <Route path="/contact" element={<WelcomeLayout><ContactPage /></WelcomeLayout>}></Route>
            <Route path="/Login" element={<WelcomeLayout><LoginPage /></WelcomeLayout>}></Route>
            <Route path="/register" element={<WelcomeLayout><RegisterPage /></WelcomeLayout>}></Route>
            <Route path="/context" element={<WelcomeLayout><ContextManagementPage /></WelcomeLayout>}></Route>
            <Route path="/scene_illustration" element={<WelcomeLayout><SceneIllustrationGenerationPage /></WelcomeLayout>}></Route>
            <Route path="/home" element={<WelcomeLayout><ContextManagementPage /></WelcomeLayout>}></Route>
            <Route path="/script_editing" element={<WelcomeLayout><ScriptEditingPage /></WelcomeLayout>}></Route>
            <Route path="/script_creating" element={<WelcomeLayout><ScriptCreatingPage /></WelcomeLayout>}></Route>
            <Route path="/script_management" element={<WelcomeLayout><ScriptManagementPage /></WelcomeLayout>}></Route>
            {/*<Route path="/" element={<WelcomeLayout><ContextManagementPage /></WelcomeLayout>}></Route>*/}
            {/*<Route path="/" element={<WelcomeLayout><ContextManagementPage /></WelcomeLayout>}></Route>*/}
        </Routes>
    );
}
export default ProjectRoutes;