import i18n from 'i18next';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Button, Menu, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import ViIcon from '~/assets/images/vi_icon.png';
import EnIcon from '~/assets/images/en_icon.png';
import { locates } from '~/i18n/i18n';
import { StackRowAlignCenter, StackRowJustBetweenAlignCenter } from '../elements/styles/stack.style';
import { useLocation, useNavigate } from 'react-router-dom';
import { FONT_SIZE } from '~/common/constant/style.constant';

export default function BtnSwitchLanguage() {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const switchLang = (lng: 'vi' | 'en') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('languages', lng);

    // thay /vi hoặc /en ở đầu path (nếu có), nếu chưa có thì thêm vào
    const replaced = pathname.replace(/^\/(vi|en)(?=\/|$)/, `/${lng}`);
    const nextPath = replaced;

    navigate(nextPath, { replace: true });
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
  const saved = localStorage.getItem('languages');
  const language: 'vi' | 'en' = saved === 'vi' || saved === 'en' ? saved : 'vi';


  return (
    <React.Fragment>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ color: palette.text.primary, padding:  0 }}
      >
        {language === 'vi' ? (
          <StackRowAlignCenter>
            <img src={ViIcon} alt="" style={{ width: '18px', height: '14px' }} /> 
            <Typography variant='subtitle2' sx={{ paddingLeft: '6px', fontSize: FONT_SIZE.small }}>VN</Typography>
          </StackRowAlignCenter>
        ) : (
          <StackRowAlignCenter>
            <img src={EnIcon} alt="" style={{ width: '18px', height: '14px' }} />
            <Typography variant='subtitle2' sx={{ paddingLeft: '6px', fontSize: FONT_SIZE.small }}>EN</Typography>
          </StackRowAlignCenter>
        )}
        {open ? <ExpandLess /> : <ExpandMore />}
      </Button>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Stack>
          <Button
            onClick={() => {
              switchLang("vi");
            }}
          >
            <StackRowJustBetweenAlignCenter sx={{ width: '100px' }}>
              <img src={locates.vi.icon} alt="" style={{ width: '20px', height: '16px' }} />
              <span style={{ color: palette.text.primary }}>{locates.vi.label}</span>
            </StackRowJustBetweenAlignCenter>
          </Button>
          <Button
            onClick={() => {
              switchLang("en");
            }}
          >
            <StackRowJustBetweenAlignCenter sx={{ width: '100px' }}>
              <img src={locates.en.icon} alt="" style={{ width: '20px', height: '16px' }} />
              <span style={{ color: palette.text.primary }}>{locates.en.label}</span>
            </StackRowJustBetweenAlignCenter>
          </Button>
        </Stack>
      </Menu>
    </React.Fragment>
  );
}
