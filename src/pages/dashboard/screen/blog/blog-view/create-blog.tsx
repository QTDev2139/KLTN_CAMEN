import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik, getIn } from 'formik';
import { Box, Stack, TextField, Button, Typography, Tabs, Tab, Divider, Paper, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { RichEditor } from '~/components/rick-text-editor/rick-text-editor';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import { createPost, updatePost } from '~/apis/blog/blog.api';
import { getPostCategory } from '~/apis/post-category/post-category.api';
import { schema } from './blog.schema';
import { slugify } from '~/common/until/slug';
import type { Post } from '~/apis/blog/blog.interface.api';

/** props: initial for edit, onSuccess callback to go back to list */
export default function CreateBlogMultiLang({ initial, onSuccess }: { initial?: Post | null; onSuccess?: () => void }) {
  const { snackbar } = useSnackbar();
  const [tab, setTab] = useState<'vi' | 'en'>('vi');
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [slugEdited, setSlugEdited] = useState<{ vi: boolean; en: boolean }>({ vi: false, en: false });
  const buildInitialValues = (): any => {
    if (!initial) {
      return {
        post_category_id: '',
        thumbnail: null,
        vi: { language_id: 1, title: '', slug: '', content: '', meta_title: '', meta_description: '' },
        en: { language_id: 2, title: '', slug: '', content: '', meta_title: '', meta_description: '' },
      };
    }
    // map initial post -> form shape (best-effort)
    const viTr = (initial as any).translations?.find((t: any) => t.language_id === 1) ?? {};
    const enTr = (initial as any).translations?.find((t: any) => t.language_id === 2) ?? {};

    const postCatId =
      (initial as any).post_category?.id ??
      (initial as any).post_category_id ??
      // fallback: try nested shape used by some responses
      (initial as any).post_category?.post_category_id ??
      '';

    return {
      post_category_id: String(postCatId ?? ''),
      thumbnail: null,
      vi: {
        language_id: 1,
        title: viTr.title ?? '',
        slug: viTr.slug ?? '',
        content: viTr.content ?? '',
        meta_title: viTr.meta_title ?? '',
        meta_description: viTr.meta_description ?? '',
      },
      en: {
        language_id: 2,
        title: enTr.title ?? '',
        slug: enTr.slug ?? '',
        content: enTr.content ?? '',
        meta_title: enTr.meta_title ?? '',
        meta_description: enTr.meta_description ?? '',
      },
    };
  };

  // when editing an existing post we don't require thumbnail; keep required when creating
  const effectiveSchema = initial
    ? (schema as any).shape({ thumbnail: Yup.mixed().notRequired() })
    : schema;

  const formik = useFormik<any>({
    initialValues: buildInitialValues(),
    enableReinitialize: true,
    validationSchema: effectiveSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const fd = new FormData();
        if (values.post_category_id) fd.append('post_category_id', String(values.post_category_id));
        if (values.thumbnail) fd.append('thumbnail', values.thumbnail);
        const translations = [values.vi, values.en];
        translations.forEach((t: any, idx: number) => {
          fd.append(`post_translations[${idx}][language_id]`, String(t.language_id));
          fd.append(`post_translations[${idx}][title]`, t.title);
          fd.append(`post_translations[${idx}][slug]`, t.slug);
          fd.append(`post_translations[${idx}][content]`, t.content);
          fd.append(`post_translations[${idx}][meta_title]`, t.meta_title ?? '');
          fd.append(`post_translations[${idx}][meta_description]`, t.meta_description ?? '');
        });

        if (initial && (initial as any).id) {
          await updatePost(Number((initial as any).id), fd);
          snackbar('success', 'Cập nhật bài viết thành công');
        } else {
          await createPost(fd);
          snackbar('success', 'Tạo bài viết thành công');
        }

        resetForm();
        setPreview(null);
        setSlugEdited({ vi: false, en: false });
        onSuccess?.();
      } catch (error: any) {
        snackbar('error', error?.message || 'Có lỗi xảy ra');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string) => (showError(path) ? getIn(formik.errors, path) : ' ');

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

  // auto-slug as before
  const handleTitleChange = (locale: 'vi' | 'en') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    formik.setFieldValue(`${locale}.title`, title);
    if (!slugEdited[locale]) {
      formik.setFieldValue(`${locale}.slug`, slugify(title));
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getPostCategory('vi');
        const items = Array.isArray(res) ? res : ((res as any)?.post ?? (res as any)?.posts ?? []);
        const mapped = items.map((d: any) => ({ id: String(d.id), name: d.post_category_translations?.[0]?.name ?? `#${d.id}` }));
        if (initial?.post_category) {
          const currentId = String(initial.post_category.id ?? initial.post_category ?? '');
          if (currentId && !mapped.find((m: any) => m.id === currentId)) {
            mapped.unshift({
              id: currentId,
              name: initial.post_category.translations?.[0]?.name ?? `#${currentId}`,
            });
          }
        }
        if (mounted) setCategories(mapped);
      } catch (err) {
        console.error('Load categories failed', err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  /** new effect: when editing, show existing thumbnail and keep slug flags */
  useEffect(() => {
    if (!initial) {
      setPreview(null);
      setSlugEdited({ vi: false, en: false });
      return;
    }

    // preview existing thumbnail URL (backend returns string path)
    const thumb = (initial as any).thumbnail ?? null;
    setPreview(thumb);

    // set slugEdited so existing slugs aren't auto-overwritten
    const viTr = (initial as any).translations?.find((t: any) => t.language_id === 1) ?? {};
    const enTr = (initial as any).translations?.find((t: any) => t.language_id === 2) ?? {};
    setSlugEdited({ vi: Boolean(viTr?.slug), en: Boolean(enTr?.slug) });
  }, [initial]);

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin chung
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Button variant="outlined" component="label">
            Chọn ảnh đại diện
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

        <FormControl fullWidth variant="outlined" size="small" sx={{ mt: 2 }} error={showError('post_category_id')}>
          <InputLabel id="post-cat-label" >
            Danh mục
          </InputLabel>

          <Select
            labelId="post-cat-label"
            label="Danh mục"
            value={String(formik.values.post_category_id ?? '')}
            onChange={(e) => formik.setFieldValue('post_category_id', String(e.target.value))}
            size="small"
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={String(c.id)}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{showError('post_category_id') ? (helperText('post_category_id') as string) : ' '}</FormHelperText>
        </FormControl>
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
                label="Tiêu đề (VI)"
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
                value={formik.values.vi.slug}
                onChange={(e) => {
                  formik.setFieldValue('vi.slug', e.target.value);
                  setSlugEdited((s) => ({ ...s, vi: true }));
                }}
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

              <RichEditor
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
              Nội dung tiếng anh
            </Typography>
            <Stack spacing={2}>
              <input type="hidden" {...formik.getFieldProps('en.language_code')} />

              <TextField
                label="Tiêu đề (EN)"
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
                value={formik.values.en.slug}
                onChange={(e) => {
                  formik.setFieldValue('en.slug', e.target.value);
                  setSlugEdited((s) => ({ ...s, en: true }));
                }}
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

              <RichEditor
                value={formik.values.en.content}
                onChange={(html) => formik.setFieldValue('en.content', html)}
                placeholder="Nội dung (EN)"
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
        <Button
          type="button"
          variant="outlined"
          onClick={() => {
            formik.resetForm();
            setSlugEdited({ vi: false, en: false });
            setPreview(null);
          }}
          disabled={formik.isSubmitting}
        >
           Reset
         </Button>
         <Button type="submit" variant="contained" size="large" disabled={formik.isSubmitting}>
           {formik.isSubmitting ? 'Đang gửi…' : 'Submit'}
         </Button>
       </Stack>
     </Box>
   );
 }
