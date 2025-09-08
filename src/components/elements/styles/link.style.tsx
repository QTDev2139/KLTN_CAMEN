import { styled, Typography } from '@mui/material';

export const TypographyHover = styled(Typography)(({theme}) => ({
  position: 'relative',
  display: 'inline-block',
  cursor: 'pointer',
  
  '&::after': {
    content: '""',
    position: 'absolute',
    left: '50%',
    bottom: 0, 
    width: '100%',
    height: 2,
    backgroundColor:  theme.palette.primary.main, 
    transform: 'translateX(-50%) scaleX(0)', // bắt đầu từ giữa, 0%
    transformOrigin: 'center',
    transition: 'transform 300ms ease', 
  },

  '&.active': { color: theme.palette.primary.main },
  '&.active::after': { transform: 'translateX(-50%) scaleX(1)' },

  '&:hover': { color: theme.palette.primary.main, transition: 'transform 300ms ease', },
  '&:hover::after': {
    transform: 'translateX(-50%) scaleX(1)', // bung full chiều ngang
  },
}));
