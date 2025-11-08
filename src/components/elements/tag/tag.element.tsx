import { alpha, SxProps, Theme, Typography, useTheme } from '@mui/material';
import React from 'react';
import { STYLE } from '../../../common/constant';
import { getLimitLineCss } from '~/common/until/get-limit-line-css';

export type TagType = |'success' | 'warning' | 'info' | 'secondary' | 'primary' | 'error';

export interface TagElementProps {
  type: TagType;
  content: string;
  width?: number;
  sx?: SxProps<Theme>;
  variation?: 'body1' | 'caption';
}

export const TagElement: React.FC<TagElementProps> = ({ type, content, width, variation = 'caption', sx }) => {
  const { palette } = useTheme();

  return (
    <Typography
      variant={variation}
      sx={{
        padding: `calc(${STYLE.PADDING_GAP_ITEM_SMALL} - 1.5px) ${STYLE.PADDING_GAP_ITEM_SMALL}`,
        backgroundColor: alpha(palette[type].main, 0.12),
        borderRadius: STYLE.BORDER_RADIUS_ELEMENT_TAG,
        color: palette[type].dark,
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
