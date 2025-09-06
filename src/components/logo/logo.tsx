import LogoVi from '~/assets/images/logo-vi.png';
import LogoEn from '~/assets/images/logo-en.png';
import { useParams } from 'react-router-dom';


export default function Logo() {
    const { lang } = useParams();
    
    return (<img src={lang === 'vi' ? LogoVi : LogoEn} alt="Logo" style={{ width: '187px', height: '87px' }}  />)
}