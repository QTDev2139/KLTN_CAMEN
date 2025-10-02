import { Divider, Stack, Typography } from "@mui/material";
import { StackRow } from "../styles/stack.style";

interface SpeciaListProps {
    label: string;
    value: string;
}

export const SpeciaList:React.FC<SpeciaListProps> = ({label, value}) => {
  return (
    <Stack>
      <StackRow sx={{ padding: '10px 0' }}>
        <Typography variant="h4" sx={{ fontSize: '16px', minWidth: '140px' }}>
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontSize: '16px', paddingLeft: '20px',width: '40px' }}>
          :
        </Typography>
        <Typography variant="h5" sx={{ fontSize: '16px' }}>
          {value}
        </Typography>
      </StackRow>
      <Divider />
    </Stack>
  );
}
