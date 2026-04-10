import { createTheme } from '@mui/material/styles';

const primaryColor = '#165a9d';
const secondaryColor = '#00a6a6';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primaryColor
    },
    secondary: {
      main: secondaryColor
    },
    background: {
      default: '#f4f7fb',
      paper: '#ffffff'
    },
    success: {
      main: '#2e7d32'
    },
    error: {
      main: '#c62828'
    },
    warning: {
      main: '#ed6c02'
    },
    info: {
      main: '#0288d1'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.75rem', fontWeight: 600 },
    h2: { fontSize: '2.25rem', fontWeight: 600 },
    h3: { fontSize: '1.9rem', fontWeight: 600 },
    h4: { fontSize: '1.6rem', fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 }
  },
  shape: {
    borderRadius: 14
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: '1.5rem',
          paddingBlock: '0.6rem',
          boxShadow: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 20px 45px rgba(22, 90, 157, 0.12)'
        }
      }
    }
  }
});

export default theme;
