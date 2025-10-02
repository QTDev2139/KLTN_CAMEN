import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Stack, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';

export interface SliderProductItems {
  src: string;
  title: string;
  href?: string; // sau này xử lý cho Link
}

interface SliderProductProps {
  items: SliderProductItems[];
}

export const SliderProduct: React.FC<SliderProductProps> = ({ items }) => {
  const { palette } = useTheme();
  var settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    autoplaySpeed: 3000,
    autoplay: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <Slider {...settings}>
      {items.map((item, idx) => (
        <Link to="#" key={idx}>
          <Stack sx={{ alignItems: 'center' }}>
            <img src={item.src} alt="" style={{ width: '240px', height: '240px', padding: '20px 40px' }} />
            <Typography variant="h5" sx={{ color: palette.text.primary }}>
              {item.title}
            </Typography>
          </Stack>
        </Link>
      ))}
    </Slider>
  );
};
