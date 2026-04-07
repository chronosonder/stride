import { createBrowserRouter } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';
import Layout from '../components/layout/Layout';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectPage from '../pages/ProjectPage';

const router = createBrowserRouter([
    { path: '/login', element: <GuestRoute><LoginPage /></GuestRoute> },
    { path: '/register', element: <GuestRoute><RegisterPage /></GuestRoute> },
    {
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
            { path: '/', element: <DashboardPage /> },
            { path: '/projects/:id', element: <ProjectPage /> },
        ]
    }
]);

export default router;