import React, { useMemo, useState, useEffect } from 'react';
import { Box, Paper, Typography, Stack, Divider, Tabs, Tab, Button, TextField, MenuItem, Chip, IconButton } from '@mui/material';
import { useFormik, getIn } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { ProductDetail } from '~/apis/product/product.interface.api';
import { schema } from './product.schema';
import { productApi } from '~/apis';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { RichEditor } from '~/components/rick-text-editor/rick-text-editor';

// type code cho tab
type LocaleCode = 'vi' | 'en';

// --- utils nhỏ ---
const slugify = (s: string) =>
  s
    .normalize('NFD')                 // tách dấu
    .replace(/[\u0300-\u036f]/g, '')  // xoá dấu
    .toLowerCase()
    .replace(/đ/g, 'd')               // đ -> d
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function CreateProduct(props: {
  initial?: Partial<ProductDetail>; // dùng cho edit
  onSuccess?: () => void; // callback sau khi submit thành công
}) {
  const { initial, onSuccess } = props;
  const { snackbar } = useSnackbar();

  // Tab ngôn ngữ
  const [tab, setTab] = useState<LocaleCode>('vi');

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ id?: number; url: string }>>([]);

  const isEditMode = !!(initial && 'id' in initial && initial.id);

  // Chuẩn hóa translations
  const normalizeTranslations = (arr: any[] = []) => {
    const byLang: Record<number, any> = {};
    arr.forEach((t) => {
      if (t?.language_id) byLang[t.language_id] = t;
    });
    return [1, 2].map((langId) => ({
      language_id: langId,
      name: byLang[langId]?.name ?? '',
      slug: byLang[langId]?.slug ?? '',
      description: byLang[langId]?.description ?? '',
      ingredient: byLang[langId]?.ingredient ?? '',
      nutrition_info: byLang[langId]?.nutrition_info ?? '',
      usage_instruction: byLang[langId]?.usage_instruction ?? '',
      reason_to_choose: byLang[langId]?.reason_to_choose ?? '',
    }));
  };

  // ----- Formik -----
  const formik = useFormik<ProductDetail>({
    validationSchema: schema,
    enableReinitialize: true,
    initialValues: {
      id: initial && 'id' in initial ? initial.id : undefined,
      price: initial?.price ?? 0,
      compare_at_price: initial?.compare_at_price ?? 0,
      stock_quantity: initial?.stock_quantity ?? 0,
      origin: initial?.origin ?? 'Việt Nam',
      quantity_per_pack: initial?.quantity_per_pack ?? 1,
      shipping_from: initial?.shipping_from ?? 'TP. Hồ Chí Minh',
      category_id: initial?.category_id ?? 1,
      type: initial?.type ?? 'domestic',
      product_translations: initial?.product_translations
        ? normalizeTranslations(initial.product_translations)
        : [
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
    } as ProductDetail,
    onSubmit: async (values, helpers) => {
      try {
        const fd = new FormData();

        // --------- fields đơn giản ----------
        fd.append('price', String(values.price));
        fd.append('compare_at_price', String(values.compare_at_price ?? ''));
        fd.append('stock_quantity', String(values.stock_quantity));
        fd.append('origin', values.origin);
        fd.append('quantity_per_pack', String(values.quantity_per_pack));
        fd.append('shipping_from', values.shipping_from);
        fd.append('category_id', String(values.category_id));
        fd.append('type', String(values.type || 'domestic'));

        // --------- product_translations ----------
        values.product_translations.forEach((t, i) => {
          fd.append(`product_translations[${i}][language_id]`, String(t.language_id));
          fd.append(`product_translations[${i}][name]`, t.name);
          fd.append(`product_translations[${i}][slug]`, t.slug);
          fd.append(`product_translations[${i}][description]`, t.description ?? '');
          fd.append(`product_translations[${i}][ingredient]`, t.ingredient ?? '');
          fd.append(`product_translations[${i}][nutrition_info]`, t.nutrition_info ?? '');
          fd.append(`product_translations[${i}][usage_instruction]`, t.usage_instruction ?? '');
          fd.append(`product_translations[${i}][reason_to_choose]`, t.reason_to_choose ?? '');
        });

        // --------- product_images (chỉ gửi ảnh mới) ----------
        galleryFiles.forEach((file, i) => {
          fd.append(`product_images[${i}][image]`, file);
          fd.append(`product_images[${i}][sort_order]`, String(i));
        });

        // --------- existing images (nếu edit) ----------
        if (isEditMode) {
          existingImages.forEach((img, i) => {
            if (img.id) {
              fd.append(`existing_images[${i}][id]`, String(img.id));
              fd.append(`existing_images[${i}][sort_order]`, String(i + galleryFiles.length));
            }
          });
        }
        console.log('FormData to submit:', fd);
        // before calling API
        console.log('values.id',values.id);
        Array.from(fd.entries()).forEach(([k, v]) => {
          console.log(k, v);
        });
        // Gọi API tương ứng
        let result;
        if (isEditMode && values.id) {
          result = await productApi.updateProduct(values.id, fd);
          snackbar('success', result.message || 'Cập nhật sản phẩm thành công');
        } else {
          result = await productApi.createProduct(fd);
          snackbar('success', result.message || 'Thêm sản phẩm thành công');
        }

        // Callback về parent để chuyển về list
        onSuccess?.();
      } catch (error: any) {
        snackbar('error', error?.message || 'Có lỗi xảy ra');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  // Load existing images when editing
  useEffect(() => {
    if (initial?.product_images?.length) {
      const images = initial.product_images.map((img) => ({
        id: img.id,
        url: img.image_url,
      }));
      setExistingImages(images);
    } else {
      setExistingImages([]);
      setGalleryFiles([]);
      setGalleryPreviews([]);
    }
  }, [initial]);

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

  // Xóa ảnh cũ
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Xóa ảnh mới
  const handleRemoveNewImage = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
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

  const totalImages = existingImages.length + galleryFiles.length;

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ maxWidth: 1500, mx: 'auto', mt: 4 }}>
      {/* ---- Thông tin chung ---- */}
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          {isEditMode ? 'Chỉnh sửa thông tin sản phẩm' : 'Thông tin chung'}
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
            {totalImages > 0 && <Chip label={`${totalImages} ảnh`} variant="outlined" />}
          </Stack>

          {/* Hiển thị ảnh cũ (từ server) */}
          {existingImages.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Ảnh hiện tại:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {existingImages.map((img, i) => (
                  <Box
                    key={`existing-${i}`}
                    sx={{
                      position: 'relative',
                      border: '1px dashed',
                      borderColor: 'divider',
                      p: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <img src={img.url} alt={`existing-${i}`} style={{ width: 96, height: 72, objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveExistingImage(i)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}

          {/* Hiển thị ảnh mới (chưa upload) */}
          {galleryPreviews.length > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Ảnh mới thêm:
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {galleryPreviews.map((src, i) => (
                  <Box
                    key={`new-${i}`}
                    sx={{
                      position: 'relative',
                      border: '1px dashed',
                      borderColor: 'primary.main',
                      p: 0.5,
                      borderRadius: 1,
                    }}
                  >
                    <img src={src} alt={`new-${i}`} style={{ width: 96, height: 72, objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveNewImage(i)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            </Box>
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
              label={`Name `}
              fullWidth
              value={formik.values.product_translations[ci].name}
              onChange={handleNameChange(current)}
              onBlur={formik.handleBlur}
              name={`product_translations.${ci}.name`}
              error={showError(`product_translations.${ci}.name`)}
              helperText={helperText(`product_translations.${ci}.name`)}
            />

            <TextField
              label={`Slug `}
              fullWidth
              name={`product_translations.${ci}.slug`}
              value={formik.values.product_translations[ci].slug}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={showError(`product_translations.${ci}.slug`)}
              helperText={helperText(`product_translations.${ci}.slug`)}
            />

            <TextField
              label={`Description `}
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

            <RichEditor
              value={formik.values.product_translations[ci].nutrition_info || ''}
              onChange={(val) => formik.setFieldValue(`product_translations.${ci}.nutrition_info`, val || '')}
              onBlur={() => formik.setFieldTouched(`product_translations.${ci}.nutrition_info`, true)}
              placeholder={`Enter nutrition info `}
              height={300}
              error={showError(`product_translations.${ci}.nutrition_info`)}
              helperText={helperText(`product_translations.${ci}.nutrition_info`)}
            />

            <RichEditor
              value={formik.values.product_translations[ci].usage_instruction || ''}
              onChange={(val) => formik.setFieldValue(`product_translations.${ci}.usage_instruction`, val || '')}
              onBlur={() => formik.setFieldTouched(`product_translations.${ci}.usage_instruction`, true)}
              placeholder={`Enter usage instruction `}
              height={300}
              error={showError(`product_translations.${ci}.usage_instruction`)}
              helperText={helperText(`product_translations.${ci}.usage_instruction`)}
            />

            <RichEditor
              value={formik.values.product_translations[ci].reason_to_choose || ''}
              onChange={(val) => formik.setFieldValue(`product_translations.${ci}.reason_to_choose`, val || '')}
              onBlur={() => formik.setFieldTouched(`product_translations.${ci}.reason_to_choose`, true)}
              placeholder={`Enter reason to choose `}
              height={300}
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
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? (isEditMode ? 'Đang cập nhật...' : 'Đang lưu...') : isEditMode ? 'Cập nhật sản phẩm' : 'Lưu sản phẩm'}
        </Button>
      </Stack>
    </Box>
  );
}
