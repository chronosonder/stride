import { createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#FF6F61',
            light: '#FF948C',
            dark: '#FF4500',
            contrastText: '#1C1C1C',
        },
        secondary: {
            main: '#DAA520',
            light: '#EED97A',
            dark: '#B08300',
            contrastText: '#1C1C1C',
        },
        background: {
            default: '#0F0F13',
            paper: '#18181F',
        },
        text: {
            primary: '#F0EFF8',
            secondary: '#8B8A9B',
        },
        divider: 'rgba(255,255,255,0.07)',
        error: {
            main: '#F07171',
        },
        success: {
            main: '#6BCB8B',
        },
        warning: {
            main: '#F5C86E',
        },
    },
    typography: {
        fontFamily: '"Roboto", Arial, sans-serif',
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none' },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#18181F',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 500,
                },
                containedPrimary: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'small',
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255,255,255,0.07)',
                },
            },
        },
    },
});

export default theme;