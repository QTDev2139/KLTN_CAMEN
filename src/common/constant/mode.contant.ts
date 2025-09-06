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
});
