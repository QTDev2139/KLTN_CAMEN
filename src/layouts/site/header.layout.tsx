import {  Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { STYLE } from '~/common/constant';
import BtnSwitchLanguage from '~/components/btn-switch-language/btn-switch-language';
import ContainerWrapper from '~/components/elements/container/container.element';
import { StackRow, StackRowJustBetweenAlignCenter, StackRowJustEnd } from '~/components/elements/styles/stack.style';
import { sidebars } from '~/pages/site/part/sitebar';

export default function Header() {

  const { t } = useTranslation('sideBar');

  return (
    <ContainerWrapper>
      <StackRowJustBetweenAlignCenter>
        <div className="logo">CA MEN</div>
        <Stack>
          <StackRowJustEnd>
            <BtnSwitchLanguage />
            <div style={{ padding: '0 10px' }}>YOUTOBE</div>
            <div style={{ padding: '0 10px' }}>SHARE</div>
          </StackRowJustEnd>
          <StackRow>
            {sidebars.map((sidebar, index) => (
              <Link key={index} to={sidebar.to} style={{ padding: STYLE.PADDING_GAP_ITEM }}>
                {t(sidebar.title)}
              </Link>
            ))}
          </StackRow>
        </Stack>
      </StackRowJustBetweenAlignCenter>
    </ContainerWrapper>
  );
}
