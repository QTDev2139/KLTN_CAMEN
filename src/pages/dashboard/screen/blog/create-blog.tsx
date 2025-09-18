import React, { useMemo, useState } from 'react';
import { useFormik, getIn } from 'formik';
import * as Yup from 'yup';
import { Box, Stack, TextField, Button, Typography, Tabs, Tab, Divider, Paper } from '@mui/material';
import RichTextEditor from '~/components/rick-text-editor/rick-text-editor';
// import axios from 'axios'; // <- Bật nếu bạn dùng axios trực tiếp
// import { axiosApi } from '~/apis'; // <- Hoặc client axios riêng của bạn

/** ---------------------------------------------------------
 *  Types
 *  --------------------------------------------------------- */
type LocaleCode = 'vi' | 'en';

type LocalePayload = {
  language_id: 1 | 2; // hoặc language_id nếu BE yêu cầu
  title: string;
  slug: string;
  content: string; // HTML từ RichTextEditor
  meta_title: string;
  meta_description: string;
};

export type FormValues = {
  translation_key: string;
  thumbnail: File | null;
  vi: LocalePayload;
  en: LocalePayload;
};

/** ---------------------------------------------------------
 *  Helpers
 *  --------------------------------------------------------- */
const localeSchema = Yup.object({
  language_id: Yup.string().required('Bắt buộc'),
  title: Yup.string().required('Bắt buộc'),
  slug: Yup.string().required('Bắt buộc'),
  content: Yup.string().required('Bắt buộc'),
  meta_title: Yup.string().required('Bắt buộc'),
  meta_description: Yup.string().required('Bắt buộc'),
});

const schema = Yup.object({
  translation_key: Yup.string().required('Bắt buộc'),
  thumbnail: Yup.mixed<File>()
    .required('Vui lòng chọn ảnh thumbnail!')
    .test('fileType', 'File phải là ảnh', (f) => !f || (f && f.type.startsWith('image/'))),
  vi: localeSchema,
  en: localeSchema,
});

// Slugify tiếng Việt đơn giản (bỏ dấu, khoảng trắng -> '-')
const slugify = (str: string) =>
  str
    .normalize('NFD')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt
    .replace(/\s+/g, '-') // space -> '-'
    .replace(/-+/g, '-'); // gộp nhiều '-'

/** ---------------------------------------------------------
 *  Component
 *  --------------------------------------------------------- */
export default function CreateBlogMultiLang() {
  const [tab, setTab] = useState<LocaleCode>('vi');
  const [preview, setPreview] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      translation_key: '',
      thumbnail: null,
      vi: {
        language_id: 1,
        title: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
      },
      en: {
        language_id: 2,
        title: '',
        slug: '',
        content: '',
        meta_title: '',
        meta_description: '',
      },
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const fd = new FormData();

        // vi
        fd.append('translations[0][languages_id]', String(values.vi.language_id));
        fd.append('translations[0][title]', values.vi.title);
        if (values.vi.slug) fd.append('translations[0][slug]', values.vi.slug);
        if (values.vi.content) fd.append('translations[0][content]', values.vi.content);
        if (values.vi.meta_title) fd.append('translations[0][meta_title]', values.vi.meta_title);
        if (values.vi.meta_description) fd.append('translations[0][meta_description]', values.vi.meta_description);
        if (values.thumbnail) fd.append('translations[0][thumbnail]', values.thumbnail);
        fd.append('translations[0][translation_key]', values.translation_key);

        // en
        fd.append('translations[1][languages_id]', String(values.en.language_id));
        fd.append('translations[1][title]', values.en.title);
        if (values.en.slug) fd.append('translations[1][slug]', values.en.slug);
        if (values.en.content) fd.append('translations[1][content]', values.en.content);
        if (values.en.meta_title) fd.append('translations[1][meta_title]', values.en.meta_title);
        if (values.en.meta_description) fd.append('translations[1][meta_description]', values.en.meta_description);
        if (values.thumbnail) fd.append('translations[1][thumbnail]', values.thumbnail);
        fd.append('translations[1][translation_key]', values.translation_key);

        console.log('SUBMIT ->', values);
      } catch (error) {
        console.error('Error submitting:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  /** Field helpers cho nested path */
  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string) => (showError(path) ? getIn(formik.errors, path) : ' ');

  /** Handle file */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue('thumbnail', file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  /**
   * Auto-slug: nếu người dùng chưa nhập slug, khi họ gõ title thì tạo slug lần đầu.
   * Nếu đã có slug (người dùng sửa tay), sẽ không overwrite.
   */
  const handleTitleChange = (locale: LocaleCode) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    formik.setFieldValue(`${locale}.title`, title);

    const currentSlug: string = getIn(formik.values, `${locale}.slug`) || '';
    if (!currentSlug) {
      formik.setFieldValue(`${locale}.slug`, slugify(title));
    }
  };

  const current = useMemo(() => (tab === 'vi' ? 'vi' : 'en'), [tab]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin chung
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Button variant="outlined" component="label">
            Chọn thumbnail
            <input type="file" accept="image/*" hidden onChange={handleFileChange} />
          </Button>
          {preview && (
            <Box sx={{ border: '1px dashed', borderColor: 'divider', p: 1, borderRadius: 1 }}>
              <img src={preview} alt="Preview" style={{ maxWidth: 240, maxHeight: 160, display: 'block' }} />
            </Box>
          )}
        </Stack>
        {showError('thumbnail') && (
          <Typography variant="body2" color="error" mt={1}>
            {getIn(formik.errors, 'thumbnail') as string}
          </Typography>
        )}

        <TextField
          sx={{ mt: 2 }}
          label="Translation key"
          fullWidth
          {...formik.getFieldProps('translation_key')}
          error={showError('translation_key')}
          helperText={helperText('translation_key')}
        />
      </Paper>

      <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
        <Tabs value={tab} onChange={(_e, v) => setTab(v)} variant="fullWidth" aria-label="Ngôn ngữ">
          <Tab label="Tiếng Việt (VI)" value="vi" />
          <Tab label="English (EN)" value="en" />
        </Tabs>

        <Divider />

        {/* Panel VI */}
        {tab === 'vi' && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Nội dung tiếng Việt
            </Typography>
            <Stack spacing={2}>
              <input type="hidden" {...formik.getFieldProps('vi.language_code')} />

              <TextField
                label="Title (VI)"
                fullWidth
                value={formik.values.vi.title}
                onChange={handleTitleChange('vi')}
                onBlur={formik.handleBlur}
                name="vi.title"
                error={showError('vi.title')}
                helperText={helperText('vi.title')}
              />

              <TextField
                label="Slug (VI)"
                fullWidth
                {...formik.getFieldProps('vi.slug')}
                error={showError('vi.slug')}
                helperText={helperText('vi.slug')}
              />

              <TextField
                label="Meta title (VI)"
                fullWidth
                {...formik.getFieldProps('vi.meta_title')}
                error={showError('vi.meta_title')}
                helperText={helperText('vi.meta_title')}
              />

              <TextField
                label="Meta description (VI)"
                fullWidth
                multiline
                minRows={3}
                {...formik.getFieldProps('vi.meta_description')}
                error={showError('vi.meta_description')}
                helperText={helperText('vi.meta_description')}
              />

              <RichTextEditor
                value={formik.values.vi.content}
                onChange={(html) => formik.setFieldValue('vi.content', html)}
                placeholder="Nội dung (VI)"
              />
              {showError('vi.content') && (
                <Typography variant="body2" color="error">
                  {helperText('vi.content')}
                </Typography>
              )}
            </Stack>
          </Box>
        )}

        {/* Panel EN */}
        {tab === 'en' && (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              English content
            </Typography>
            <Stack spacing={2}>
              <input type="hidden" {...formik.getFieldProps('en.language_code')} />

              <TextField
                label="Title (EN)"
                fullWidth
                value={formik.values.en.title}
                onChange={handleTitleChange('en')}
                onBlur={formik.handleBlur}
                name="en.title"
                error={showError('en.title')}
                helperText={helperText('en.title')}
              />

              <TextField
                label="Slug (EN)"
                fullWidth
                {...formik.getFieldProps('en.slug')}
                error={showError('en.slug')}
                helperText={helperText('en.slug')}
              />

              <TextField
                label="Meta title (EN)"
                fullWidth
                {...formik.getFieldProps('en.meta_title')}
                error={showError('en.meta_title')}
                helperText={helperText('en.meta_title')}
              />

              <TextField
                label="Meta description (EN)"
                fullWidth
                multiline
                minRows={3}
                {...formik.getFieldProps('en.meta_description')}
                error={showError('en.meta_description')}
                helperText={helperText('en.meta_description')}
              />

              <RichTextEditor
                value={formik.values.en.content}
                onChange={(html) => formik.setFieldValue('en.content', html)}
                placeholder="Content (EN)"
              />
              {showError('en.content') && (
                <Typography variant="body2" color="error">
                  {helperText('en.content')}
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Paper>

      <Stack direction="row" justifyContent="flex-end" mt={3} spacing={2}>
        <Button type="button" variant="outlined" onClick={() => formik.resetForm()} disabled={formik.isSubmitting}>
          Reset
        </Button>
        <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Đang gửi…' : 'Submit'}
        </Button>
      </Stack>
    </Box>
  );
}
