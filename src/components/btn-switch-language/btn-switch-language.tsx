import i18n from 'i18next';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Menu, Stack } from '@mui/material';
import React from 'react';
import ViIcon from '~/assets/images/vi_icon.png';
import EnIcon from '~/assets/images/en_icon.png';
import { locates } from '~/i18n/i18n';
import { StackRowAlignJustCenter } from '../elements/styles/stack.style';

export default function BtnSwitchLanguage() {
  const handleChangeLanguages = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const raw = window.localStorage.getItem('languages') ?? 'vi';
  const language: 'vi' | 'en' = JSON.parse(raw);

  return (
    <React.Fragment>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {language === 'vi' ? (
          <img src={ViIcon} alt="" style={{ width: '20px', height: '16px' }} />
        ) : (
          <img src={EnIcon} alt="" style={{ width: '20px', height: '16px' }} />
        )}
        {open ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Stack>
          <Button
            onClick={() => {
              localStorage.setItem('languages', JSON.stringify('vi'));
              handleChangeLanguages('vi');
            }}
          >
            <StackRowAlignJustCenter>
              <img src={locates.vi.icon} alt="" style={{ width: '20px', height: '16px' }} />
              <span>{locates.vi.label}</span>
            </StackRowAlignJustCenter>
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem('languages', JSON.stringify('en'));
              handleChangeLanguages('en');
            }}
          >
            <StackRowAlignJustCenter>
              <img src={locates.en.icon} alt="" style={{ width: '20px', height: '16px' }} />
              <span>{locates.en.label}</span>
            </StackRowAlignJustCenter>
          </Button>
        </Stack>
      </Menu>
    </React.Fragment>
  );
}
