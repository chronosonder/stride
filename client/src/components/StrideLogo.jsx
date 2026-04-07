import { Typography } from '@mui/material';

export default function StrideLogo() {
    return (
        <>
            <Typography
                variant="h1"
                fontWeight={700}
                sx={{
                    textAlign: 'center',
                    fontFamily: '"Roboto", sans-serif',
                    letterSpacing: '-0.5px',
                    background: theme => `linear-gradient(135deg, ${theme.palette.secondary.light} 0%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: theme => `drop-shadow(0 0 20px ${theme.palette.secondary.main}70) drop-shadow(0 0 40px ${theme.palette.secondary.main}40)`,
                    animation: 'fade-in 1s ease-out forwards',
                    '@keyframes fade-in': {
                        from: { opacity: 0, transform: 'translateY(-8px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                Stride
            </Typography>

            <Typography
                variant="h4"
                fontWeight={700}
                mb={6}
                sx={{
                    textAlign: 'center',
                    fontFamily: '"Roboto", sans-serif',
                    letterSpacing: '-0.5px',
                    background: theme => `linear-gradient(135deg, ${theme.palette.secondary.main} 20%, ${theme.palette.secondary.main} 50%, ${theme.palette.secondary.dark} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: theme => `drop-shadow(0 0 20px ${theme.palette.secondary.main}60) drop-shadow(0 0 40px ${theme.palette.secondary.main}40)`,
                    animation: 'fade-in 1.2s ease-out forwards',
                    '@keyframes fade-in': {
                        from: { opacity: 0, transform: 'translateY(-8px)' },
                        to: { opacity: 1, transform: 'translateY(0)' },
                    },
                }}
            >
                Project Manager
            </Typography>

        </>
    );
}