import * as MuiIcons from '@mui/icons-material';
import { Typography } from '@mui/material';
import { StackRow } from '../styles/stack.style';

interface Props {
  icon: keyof typeof MuiIcons;
  title: string;
}

export default function IconLabel({ icon, title }: Props) {
  const IconComponent = MuiIcons[icon];

  return (
    <StackRow sx={{ alignItems: 'center', gap: 1 }}>
      <IconComponent fontSize="small" />
      <Typography variant="subtitle1">{title}</Typography>
    </StackRow>
  );
}
