import { Routes, Route, Link } from "react-router-dom";

import CommonLayout from "../layouts/CommonLayout.jsx";
import WelcomeLayout from "../layouts/WelcomeLayout.jsx";

import SciptManagementPage from "../pages/ScriptManagementPage.jsx";
import ContextManagementPage from "../pages/ContextManagementPage.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import RegisterPage from "../pages/RegisterPage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ContactPage from "../pages/ContactPage.jsx";

function ProjectRoutes() {
    return (
        <Routes>
            <Route path="/" element={<WelcomeLayout><LandingPage /></WelcomeLayout>}></Route>
            <Route path="/about" element={<WelcomeLayout><AboutPage /></WelcomeLayout>}></Route>
            <Route path="/contact" element={<WelcomeLayout><ContactPage /></WelcomeLayout>}></Route>
            <Route path="/Login" element={<WelcomeLayout><LoginPage /></WelcomeLayout>}></Route>
            <Route path="/register" element={<WelcomeLayout><RegisterPage /></WelcomeLayout>}></Route>
            <Route path="/context" element={<CommonLayout><ContextManagementPage /></CommonLayout>}></Route>
            {/*<Route path="/" element={<CommonLayout><ContextManagementPage /></CommonLayout>}></Route>*/}
            {/*<Route path="/" element={<CommonLayout><ContextManagementPage /></CommonLayout>}></Route>*/}
        </Routes>
    );
}
export default ProjectRoutes;