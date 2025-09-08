import LogoVi from '~/assets/images/logo-vi.png';
import LogoEn from '~/assets/images/logo-en.png';
import { Link, useParams } from 'react-router-dom';
import { SITE_SCREEN } from '~/router/path.route';

export default function Logo() {
  const { lang } = useParams();
  return (
    <Link to={SITE_SCREEN.HOME} >
      <img src={lang === 'vi' ? LogoVi : LogoEn} alt="Logo" style={{ width: '157px', height: '67px' }} />
    </Link>
  );
}
