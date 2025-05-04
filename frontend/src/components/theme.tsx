import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark', // or 'dark'
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#1e1e1e', // purple
    },
    background: {
      default: '#000000',
      paper: '#121212',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5'
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiIconButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          backgroundColor: '#9c27b0', // Purple
          color: '#fff',
          '&:hover': {
            backgroundColor: '#7b1fa2',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
          backgroundColor: '#9c27b0',
          '&:hover': {
            backgroundColor: '#7b1fa2',
          },
        },
      },
    },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;