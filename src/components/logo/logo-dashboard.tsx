import LogoVi from '~/assets/images/logo-vi.png';
import { Link } from 'react-router-dom';
import { PATH } from '~/router';
import { PAGE } from '~/router/path.route';

export default function LogoDashboard() {

  return (
    <Link to={`/${PAGE.DASHBOARD}/${PATH.DASHBOARD_SCREEN.OVERVIEW}`} style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
      <img src={LogoVi} alt="Logo" style={{ width: '157px', height: '67px' }} />
    </Link>
  );
}
