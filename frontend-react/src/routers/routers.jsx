import { Routes, Route, Link } from "react-router-dom";

import CommonLayout from "../layouts/CommonLayout.jsx";
import WelcomeLayout from "../layouts/WelcomeLayout.jsx";

import SciptManagementPage from "../pages/ScriptManagementPage.jsx";
import ContextManagementPage from "../pages/ContextManagementPage.jsx";

function ProjectRoutes() {
    return (
        <Routes>
            <Route path="/" element={<CommonLayout><SciptManagementPage /></CommonLayout>}></Route>
            <Route path="/context" element={<CommonLayout><ContextManagementPage /></CommonLayout>}></Route>
            {/*<Route path="/Login" element={<CommonLayout><SignUpPage /></CommonLayout>}></Route>*/}
            {/*<Route path="/" element={<CommonLayout><ContextManagementPage /></CommonLayout>}></Route>*/}
            {/*<Route path="/" element={<CommonLayout><ContextManagementPage /></CommonLayout>}></Route>*/}
        </Routes>
    );
}
export default ProjectRoutes;