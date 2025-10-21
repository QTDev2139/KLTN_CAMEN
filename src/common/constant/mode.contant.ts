import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
      light: '#fff8f6',
      dark: '#e53935',
    },
    // secondary: {
    //   main: '#f44336',
    //   light: '#ef5350',
    //   dark: '#e53935',
    // },
    
    info: {
      main: '#2196f3',
    },
    action: {
      disabledBackground: '#e0e0e0', 
    },
    text: {
      primary: '#1b1b1bff', 
      secondary: '#757575',
      disabled: '#606060', 
    },
    divider: '#d6d6d6ff', 
    background: {
      default: '#fff', 
      paper: '#f5f5f5', 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',     
          letterSpacing: 'normal',    
          // fontWeight: 500,         
        },
      },
      // (tuỳ chọn) props mặc định cho tất cả Button
      defaultProps: {
        disableElevation: true,
      },
    },
    // Viền OutlinedInput khi focus
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#424242',   // màu bạn muốn khi focus
          },
        },
      },
    },
    // Màu label khi focus
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#424242',
          },
        },
      },
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 700,
    },
    h2: {
      fontSize: 32,
      fontWeight: 500,
    },
    h3: {
      fontSize: 26,
      fontWeight: 700,
    },
    h4: {
      fontSize: 22,
      fontWeight: 700,
    },
    h5: {
      fontSize: 22,
      fontWeight: 500,
    },
    h6: {
      fontSize: 18,
      fontWeight: 700,
    },
    subtitle1: {
      fontSize: 18,
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: 14,
      fontWeight: 400,
    },
    body1: {
      fontWeight: 500,
    },
    body2: {
      fontWeight: 500,
    },
  }
  
});

// h1
// h2
// h3
// h4
// h5
// h6
// subtitle1
// subtitle2
// body1
// body2
// button
// caption
// overline
