import React, { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Divider, Tabs, Tab, Button, TextField, MenuItem, Chip } from '@mui/material';
import { useFormik, getIn } from 'formik';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import { ProductDetail } from '~/apis/product/product.interface.api';
import { schema } from './product.schema';
import { productApi } from '~/apis';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';

// type code cho tab
type LocaleCode = 'vi' | 'en';

// --- utils nhỏ ---
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

// === Component chính ===
export default function CreateProduct(props: {
  initial?: Partial<ProductDetail>; // dùng cho edit
  onSubmit: (values: ProductDetail) => Promise<void> | void;
}) {
  const { initial, onSubmit } = props;
  const { snackbar } = useSnackbar();

  // Tab ngôn ngữ
  const [tab, setTab] = useState<LocaleCode>('vi');

  // Preview thumbnail chính và gallery local (File[])

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // ----- Formik -----
  const formik = useFormik<ProductDetail>({
    validationSchema: schema,
    enableReinitialize: true,
    initialValues: {
      price: 0,
      compare_at_price: 0,
      stock_quantity: 0,
      origin: 'Việt Nam',
      quantity_per_pack: 1,
      shipping_from: 'TP. Hồ Chí Minh',
      category_id: 1,
      type: 'domestic',
      product_translations: [
        {
          language_id: 1,
          name: '',
          slug: '',
          description: '',
          ingredient: '',
          nutrition_info: '',
          usage_instruction: '',
          reason_to_choose: '',
        },
        {
          language_id: 2,
          name: '',
          slug: '',
          description: '',
          ingredient: '',
          nutrition_info: '',
          usage_instruction: '',
          reason_to_choose: '',
        },
      ],
      product_images: initial?.product_images ?? [],
    },
    onSubmit: async (values, helpers) => {
      try {
        // giả sử bạn đang có:
        const fd = new FormData();

        // --------- fields đơn giản ----------
        fd.append('price', String(formik.values.price));
        fd.append('compare_at_price', String(formik.values.compare_at_price ?? ''));
        fd.append('stock_quantity', String(formik.values.stock_quantity));
        fd.append('origin', formik.values.origin);
        fd.append('quantity_per_pack', String(formik.values.quantity_per_pack));
        fd.append('shipping_from', formik.values.shipping_from);
        fd.append('category_id', String(formik.values.category_id));

        // --------- product_translations ----------
        formik.values.product_translations.forEach((t, i) => {
          fd.append(`product_translations[${i}][language_id]`, String(t.language_id));
          fd.append(`product_translations[${i}][name]`, t.name);
          fd.append(`product_translations[${i}][slug]`, t.slug);
          fd.append(`product_translations[${i}][description]`, t.description ?? '');
          fd.append(`product_translations[${i}][ingredient]`, t.ingredient ?? '');
          fd.append(`product_translations[${i}][nutrition_info]`, t.nutrition_info ?? '');
          fd.append(`product_translations[${i}][usage_instruction]`, t.usage_instruction ?? '');
          fd.append(`product_translations[${i}][reason_to_choose]`, t.reason_to_choose ?? '');
        });

        // --------- product_images (file + sort_order) ----------
        galleryFiles.forEach((file, i) => {
          fd.append(`product_images[${i}][image]`, file); 
          fd.append(`product_images[${i}][sort_order]`, String(i)); // hoặc lấy sort từ UI nếu có
        });


        fd.forEach((v, k) => console.log(k, v));

        const result = await productApi.createProduct(fd);
        snackbar('success', result.message || "Thêm sản phẩm thành công :_");
      
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // ======= Field helpers cho nested path =======
  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string) => (showError(path) ? (getIn(formik.errors, path) as string) : ' ');

  // ======= Gallery handler (multi) =======
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files ?? []);
    setGalleryFiles((prev) => [...prev, ...files]);
  };
  useEffect(() => {
    if (!galleryFiles.length) {
      setGalleryPreviews([]);
      return;
    }
    let cancelled = false;
    Promise.all(
      galleryFiles.map(
        (f) =>
          new Promise<string>((resolve) => {
            const r = new FileReader();
            r.onloadend = () => resolve(r.result as string);
            r.readAsDataURL(f);
          }),
      ),
    ).then((arr) => {
      if (!cancelled) setGalleryPreviews(arr);
    });
    return () => {
      cancelled = true;
    };
  }, [galleryFiles]);

  const idxOf = (locale: LocaleCode) => (locale === 'vi' ? 0 : 1);
  const handleNameChange = (locale: LocaleCode) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const i = idxOf(locale);
    const val = e.target.value;
    formik.setFieldValue(`product_translations.${i}.name`, val);

    const currentSlug: string = getIn(formik.values, `product_translations.${i}.slug`) || '';
    if (!currentSlug) {
      formik.setFieldValue(`product_translations.${i}.slug`, slugify(val));
    }
  };

  const current = useMemo<LocaleCode>(() => (tab === 'vi' ? 'vi' : 'en'), [tab]);
  const ci = idxOf(current);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      {/* ---- Thông tin chung ---- */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin chung
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Giá bán"
            type="number"
            fullWidth
            {...formik.getFieldProps('price')}
            error={showError('price')}
            helperText={helperText('price')}
          />
          <TextField
            label="Giá so sánh (khuyến mãi)"
            type="number"
            fullWidth
            {...formik.getFieldProps('compare_at_price')}
            error={showError('compare_at_price')}
            helperText={helperText('compare_at_price')}
          />
          <TextField
            label="Tồn kho"
            type="number"
            fullWidth
            {...formik.getFieldProps('stock_quantity')}
            error={showError('stock_quantity')}
            helperText={helperText('stock_quantity')}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Xuất xứ (origin)"
            fullWidth
            {...formik.getFieldProps('origin')}
            error={showError('origin')}
            helperText={helperText('origin')}
          />
          <TextField
            label="Số lượng/Combo"
            type="number"
            fullWidth
            {...formik.getFieldProps('quantity_per_pack')}
            error={showError('quantity_per_pack')}
            helperText={helperText('quantity_per_pack')}
          />
        </Stack>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="Nơi giao (shipping_from)"
            fullWidth
            {...formik.getFieldProps('shipping_from')}
            error={showError('shipping_from')}
            helperText={helperText('shipping_from')}
          />
          <TextField
            label="Loại sản phẩm"
            select
            fullWidth
            {...formik.getFieldProps('type')}
            error={showError('type')}
            helperText={helperText('type')}
          >
            <MenuItem value="domestic">Domestic</MenuItem>
            <MenuItem value="export">Export</MenuItem>
          </TextField>
          <TextField
            label="Danh mục sản phẩm"
            select
            fullWidth
            {...formik.getFieldProps('category_id')}
            error={showError('category_id')}
            helperText={helperText('category_id')}
          >
            <MenuItem value={1}>1 gói</MenuItem>
            <MenuItem value={2}>Combo 3 gói</MenuItem>
            <MenuItem value={3}>Combo 6 gói</MenuItem>
            <MenuItem value={4}>Combo 10 gói</MenuItem>
          </TextField>
        </Stack>

        {/* Gallery ảnh */}
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button variant="outlined" component="label">
              Thêm ảnh gallery
              <input type="file" accept="image/*" hidden multiple onChange={handleGalleryChange} />
            </Button>
            {!!galleryFiles.length && (
              <Chip
                label={`${galleryFiles.length} ảnh`}
                onDelete={() => {
                  setGalleryFiles([]);
                  setGalleryPreviews([]);
                }}
                deleteIcon={<CloseIcon />}
                variant="outlined"
              />
            )}
          </Stack>
          {!!galleryPreviews.length && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
              {galleryPreviews.map((src, i) => (
                <Box key={i} sx={{ border: '1px dashed', borderColor: 'divider', p: 0.5, borderRadius: 1 }}>
                  <img src={src} alt={`g-${i}`} style={{ width: 96, height: 72, objectFit: 'cover' }} />
                </Box>
              ))}
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* ---- Nội dung đa ngôn ngữ ---- */}
      <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)} variant="fullWidth" aria-label="Ngôn ngữ">
          <Tab label="Tiếng Việt (VI)" value="vi" />
          <Tab label="English (EN)" value="en" />
        </Tabs>
        <Divider />

        {/* Panel hiện tại */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            {current === 'vi' ? 'Nội dung tiếng Việt' : 'English content'}
          </Typography>

          {/* name + slug */}
          <Stack spacing={2}>
            <TextField
              label={`Name (${current.toUpperCase()})`}
              fullWidth
              value={formik.values.product_translations[ci].name}
              onChange={handleNameChange(current)}
              onBlur={formik.handleBlur}
              name={`product_translations.${ci}.name`}
              error={showError(`product_translations.${ci}.name`)}
              helperText={helperText(`product_translations.${ci}.name`)}
            />

            <TextField
              label={`Slug (${current.toUpperCase()})`}
              fullWidth
              name={`product_translations.${ci}.slug`}
              value={formik.values.product_translations[ci].slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.slug`)}
              helperText={helperText(`product_translations.${ci}.slug`)}
            />

            <TextField
              label={`Description (${current.toUpperCase()})`}
              fullWidth
              multiline
              minRows={3}
              name={`product_translations.${ci}.description`}
              value={formik.values.product_translations[ci].description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.description`)}
              helperText={helperText(`product_translations.${ci}.description`)}
            />

            <TextField
              label={`Ingredient (${current.toUpperCase()})`}
              fullWidth
              multiline
              minRows={2}
              name={`product_translations.${ci}.ingredient`}
              value={formik.values.product_translations[ci].ingredient}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.ingredient`)}
              helperText={helperText(`product_translations.${ci}.ingredient`)}
            />

            <TextField
              label={`Nutrition info (${current.toUpperCase()})`}
              fullWidth
              multiline
              minRows={2}
              name={`product_translations.${ci}.nutrition_info`}
              value={formik.values.product_translations[ci].nutrition_info}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.nutrition_info`)}
              helperText={helperText(`product_translations.${ci}.nutrition_info`)}
            />

            <TextField
              label={`Usage instruction (${current.toUpperCase()})`}
              fullWidth
              multiline
              minRows={2}
              name={`product_translations.${ci}.usage_instruction`}
              value={formik.values.product_translations[ci].usage_instruction}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.usage_instruction`)}
              helperText={helperText(`product_translations.${ci}.usage_instruction`)}
            />

            <TextField
              label={`Reason to choose (${current.toUpperCase()})`}
              fullWidth
              multiline
              minRows={2}
              name={`product_translations.${ci}.reason_to_choose`}
              value={formik.values.product_translations[ci].reason_to_choose}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.reason_to_choose`)}
              helperText={helperText(`product_translations.${ci}.reason_to_choose`)}
            />
          </Stack>
        </Box>
      </Paper>

      {/* ---- Actions ---- */}
      <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
        <Button type="button" variant="outlined" onClick={() => formik.resetForm()} disabled={formik.isSubmitting}>
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={formik.isSubmitting}
          onClick={async () => {
            const errors = await formik.validateForm();
            console.log('isValid:', Object.keys(errors).length === 0);
            console.log('errors:', errors);
          }}
        >
          {formik.isSubmitting ? 'Đang lưu…' : 'Lưu sản phẩm'}
        </Button>
      </Stack>
    </Box>
  );
}
