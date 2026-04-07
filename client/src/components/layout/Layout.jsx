import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

export default function Layout() {
    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Navbar />
            
            <Container
                maxWidth="lg"
                sx={{
                    flex: '1 1 auto',
                    height: '100%',
                    flexDirection: 'column',
                    padding: 2,
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
}