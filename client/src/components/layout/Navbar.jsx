import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        await logout();
        navigate('/login');
    }

    return (
        <AppBar position="sticky" elevation={1}>
            <Toolbar>
                <Typography
                    variant='h4'
                    noWrap
                    component={RouterLink}
                    color='secondary'
                    to="/"
                    sx={{
                        mr: 2,
                        display: 'flex',
                        fontFamily: 'Roboto',
                        fontWeight: 700,
                        textDecoration: 'none',
                        flexGrow: 1
                    }}
                >
                    Stride
                </Typography>

                <Box sx={{ flexGrow: 1, display: 'flex' }}></Box>

                <Box display="flex" gap={2}>
                    <Button
                        size="large"
                        color="inherit"
                        component={RouterLink}
                        to="/"
                    >
                        Dashboard
                    </Button>
                </Box>

                <Box display="flex" alignItems="center" gap={2} ml={1}>
                    <Button color="error" variant="outlined" size="small" onClick={handleLogout}>
                        Logout
                    </Button>
                </Box>

            </Toolbar>
        </AppBar>
    );
}