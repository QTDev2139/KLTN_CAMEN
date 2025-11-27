import { alpha, SxProps, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';

export type TagType =  'success' | 'warning' | 'info' | 'secondary' | 'primary' | 'error' ;

export interface TagElementProps {
  type: TagType;
  content: string;
  width?: number;
  sx?: SxProps<Theme>;
  variation?: 'body1' | 'caption';
}

export const TagElement: React.FC<TagElementProps> = ({ type, content, width, variation = 'caption', sx }) => {
  const { palette } = useTheme();

  // safe palette access with fallback to primary
  const palColor: any = (palette as any)[type] ?? palette.primary ?? { main: '#1976d2', dark: '#115293' };
  const bg = alpha(palColor.main ?? '#1976d2', 0.12);
  const textColor = palColor.dark ?? palColor.main ?? palette.text.primary;

  return (
    <Typography
      variant={variation}
      sx={{
        padding: `calc(${STYLE.PADDING_GAP_ITEM_SMALL} - 1.5px) ${STYLE.PADDING_GAP_ITEM_SMALL}`,
        backgroundColor: bg,
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT_TAG,
        color: textColor,
        width,
        lineHeight: 1,
        textAlign: 'center',
        ...getLimitLineCss(1),
        ...sx,
      }}
    >
      {content}
    </Typography>
  );
};
