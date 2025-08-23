import { Stack, styled } from '@mui/material';

export const StackRow = styled(Stack)(() => ({
  flexDirection: 'row',
}));

export const StackWrap = styled(Stack)(() => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
}))

export const StackRowAlignCenter = styled(Stack)(() => ({
    flexDirection: 'row',
    alignItems: 'center',
}))

export const StackRowAlignEnd = styled(Stack)(() => ({
    flexDirection: 'row',
    alignItems: 'flex-end',
}))

export const StackRowJustCenter = styled(Stack)(() => ({
    flexDirection: 'row',
    justifyContent: 'center',
}))

export const StackRowJustEnd = styled(Stack)(() => ({
    flexDirection: 'row',
    justifyContent: 'flex-end',
}))

export const StackRowJustBetween = styled(Stack)(() => ({
    flexDirection: 'row',
    justifyContent: 'space-between'
}))

export const StackRowJustEvenly = styled(Stack)(() => ({
    flexDirection: 'row',
    justifyContent: 'space-evenly'
}))

export const StackRowAlignJustCenter = styled(Stack)(() => ({
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
}))