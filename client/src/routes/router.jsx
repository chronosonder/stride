import { createBrowserRouter } from 'react-router';
import ProtectedRoute from './ProtectedRoute';
import GuestRoute from './GuestRoute';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectPage from '../pages/ProjectPage';

const router = createBrowserRouter([
    { path: '/login', element: <GuestRoute><LoginPage /></GuestRoute> },
    { path: '/register', element: <GuestRoute><RegisterPage /></GuestRoute> },
    {
        path: '/',
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute>
    },
    {
        path: '/projects/:id',
        element: <ProtectedRoute><ProjectPage /></ProtectedRoute>
    },
]);

export default router;