import * as yup from 'yup';
import dayjs from 'dayjs';

export const schema = yup.object().shape({
  code: yup
    .string()
    .required('Mã coupon là bắt buộc')
    .min(3, 'Mã coupon phải có ít nhất 3 ký tự')
    .max(50, 'Mã coupon không được quá 50 ký tự')
    .matches(/^[A-Z0-9_-]+$/, 'Mã coupon chỉ được chứa chữ hoa, số, gạch ngang và gạch dưới'),
  discount_type: yup
    .string()
    .required('Loại giảm giá là bắt buộc')
    .oneOf(['fixed', 'percentage'], 'Loại giảm giá không hợp lệ'),
  discount_value: yup
    .string()
    .required('Giá trị giảm giá là bắt buộc')
    .test('valid-discount', 'Giá trị giảm giá không hợp lệ', function (value) {
      const { discount_type } = this.parent;
      const numValue = parseFloat(value || '0');
      if (discount_type === 'percentage') {
        return numValue > 0 && numValue <= 100;
      }
      return numValue > 0;
    }),
  min_order_amount: yup
    .string()
    .required('Giá trị đơn hàng tối thiểu là bắt buộc')
    .test('valid-amount', 'Giá trị đơn hàng phải lớn hơn 0', (value) => {
      return parseFloat(value || '0') >= 0;
    }),
  usage_limit: yup.number().required('Giới hạn sử dụng là bắt buộc').min(1, 'Giới hạn sử dụng phải lớn hơn 0'),
  // start_date must be after current time
  start_date: yup
    .string()
    .required('Ngày bắt đầu là bắt buộc')
    .test('is-after-now', 'Ngày bắt đầu phải sau thời điểm hiện tại', (value) => {
      if (!value) return false;
      return dayjs(value).isAfter(dayjs());
    }),
  end_date: yup
    .string()
    .required('Ngày kết thúc là bắt buộc')
    .test('is-after-start', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
      const { start_date } = this.parent;
      if (!start_date || !value) return true;
      return new Date(value) > new Date(start_date);
    }),
  state: yup
    .string()
    .required('Trạng thái là bắt buộc')
    .oneOf(['pending', 'approved', 'rejected', 'expired', 'disabled'], 'Trạng thái không hợp lệ'),
  is_active: yup.boolean().required('Trạng thái hoạt động là bắt buộc'),
});
