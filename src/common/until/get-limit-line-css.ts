export const getLimitLineCss = (line: number): any => ({
  display: '-webkit-box',
  overflow: 'hidden',
  WebkitBoxOrient: 'vertical',
  textOverflow: 'ellipsis',
  WebkitLineClamp: line,
});
