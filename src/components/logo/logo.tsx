import LogoVi from '~/assets/images/logo-vi.png';
import LogoEn from '~/assets/images/logo-en.png';
import { Link, useParams } from 'react-router-dom';
import { DASHBOARD_SCREEN, SITE_SCREEN } from '~/router/path.route';

export default function Logo() {
  const { lang } = useParams();
  if (lang) {
    return (
      <Link to={SITE_SCREEN.HOME}>
        <img src={lang === 'vi' ? LogoVi : LogoEn} alt="Logo" style={{ width: '157px', height: '67px' }} />
      </Link>
    );
  } else {
    return (
      <Link to={DASHBOARD_SCREEN.OVERVIEW}>
        <img src={LogoVi} alt="Logo" style={{ width: '157px', height: '67px' }} />
      </Link>
    );
  }
}
