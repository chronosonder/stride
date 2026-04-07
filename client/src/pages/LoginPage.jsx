import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
    Box, Card, CardContent, TextField, Button,
    Typography, Link, Alert, CircularProgress
} from '@mui/material';
import StrideLogo from '../components/StrideLogo';
import { login } from '../api/auth';

export default function LoginPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await login(email, password);
            await queryClient.invalidateQueries({ queryKey: ['auth'] });
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="background.default">

            <StrideLogo />

            <Card sx={{ width: '100%', maxWidth: 420, mx: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h4" fontWeight={600} mb={1}>
                        Welcome back
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                        Sign in to your account to continue
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            fullWidth
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            fullWidth
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={isLoading}
                            sx={{ mt: 1 }}
                        >
                            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
                        </Button>
                    </Box>

                    <Typography variant="body1" color="text.secondary" textAlign="center" mt={3}>
                        Don't have an account?{' '}
                        <Link component={RouterLink} to="/register">
                            Register
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}