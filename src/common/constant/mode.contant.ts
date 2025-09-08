import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#e53935',
    },
    // secondary: {
    //   main: '#f44336',
    //   light: '#ef5350',
    //   dark: '#e53935',
    // },
    text: {
      primary: '#424242', 
      secondary: '#757575',
      disabled: '#606060', 
    },
    divider: '#545454', 
  },
  components: {
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
      fontSize: 22,
      fontWeight: 700,
    },
    h2: {
      fontSize: 22,
      fontWeight: 700,
    },
    h3: {
      fontSize: 22,
      fontWeight: 500,
    },
    h4: {
      fontSize: 22,
      fontWeight: 500,
    },
    h5: {
      fontSize: 22,
      fontWeight: 500,
    },
    h6: {
      fontSize: 22,
      fontWeight: 500,
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
