import { Box, Typography, useTheme } from '@mui/material';
import { PADDING_GAP_LAYOUT } from '~/common/constant/style.constant';

interface BoxContentProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
}

export const BoxContent: React.FC<BoxContentProps> = ({ title, content, children }) => {
  const { palette } = useTheme();

  return (
    <Box sx={{ borderRadius: PADDING_GAP_LAYOUT, boxShadow: '0 2px 8px rgba(0,0,0,0.2)', p: 3, flex: 1 }}>
      {title && (<Typography variant="h2" sx={{ paddingBottom: PADDING_GAP_LAYOUT, color: palette.primary.main}}>
        {title}
      </Typography>)}

      {content ? (
        <Typography variant="subtitle2">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Typography>
      ) : (
        children
      )}
    </Box>
  );
};
