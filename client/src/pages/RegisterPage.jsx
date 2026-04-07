import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Link, Alert, CircularProgress
} from '@mui/material';
import StrideLogo from '../components/StrideLogo';
import { register } from '../api/auth';

export default function RegisterPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await register(username, email, password);
            await queryClient.invalidateQueries({ queryKey: ['auth'] });
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Box display="flex" flexDirection="column"  justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">

            <StrideLogo />

            <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" fontWeight={600} mb={1}>
                        Create an account
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        Get started by creating your account
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            required
                            fullWidth
                            autoComplete="username"
                            autoFocus
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                            autoComplete="email"
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            fullWidth
                            autoComplete="new-password"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isLoading}
                            sx={{ mt: 1 }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Create account'}
                        </Button>
                    </Box>

                    <Typography variant="body1" color="text.secondary" textAlign="center" mt={3}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/login">
                            Sign in
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}