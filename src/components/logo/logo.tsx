import LogoVi from '~/assets/images/logo-vi.png';
import LogoEn from '~/assets/images/logo-en.png';
import { Link } from 'react-router-dom';
import { SITE_SCREEN } from '~/router/path.route';
import { useLang } from '~/hooks/use-lang/use-lang';
import { getLangPrefix } from '~/common/constant/get-lang-prefix';

export default function Logo() {
  // Lấy lang từ hook
  const currentLang = useLang();
  const prefix = getLangPrefix(currentLang);

  return (
    <Link to={`${prefix}/${SITE_SCREEN.HOME}`} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
      <img src={prefix === '/en' ? LogoEn : LogoVi} alt="Logo" style={{ width: '157px', height: '67px' }} />
    </Link>
  );
}
