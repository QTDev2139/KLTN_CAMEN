import React, { useEffect, useState } from 'react';
import { useFormik, getIn } from 'formik';
import { schema } from './blog-categories.schema';
import { useSnackbar } from '~/hooks/use-snackbar/use-snackbar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import type { ModalMode, BlogCategory, PostCategoryTranslation } from './blog-categories.state';
import { slugify } from '~/common/until/slug';

type Props = {
  open: boolean;
  mode: ModalMode;
  initial?: BlogCategory | null;
  onClose: () => void;
  onSave: (payload: { post_category_translations: PostCategoryTranslation[] }) => void;
};

const LANGUAGES = [
  { id: 1, code: 'vi', name: 'Tiếng Việt' },
  { id: 2, code: 'en', name: 'English' },
];

export default function BlogCategoriesForm({ open, mode, initial, onClose, onSave }: Props) {
  const { snackbar } = useSnackbar();

  // track if user manually edited slug per locale (idx 0 = vi, 1 = en)
  const [slugEdited, setSlugEdited] = useState<boolean[]>([false, false]);

  // initialize slugEdited from initial values (if slug exists -> treat as edited)
  useEffect(() => {
    if (!open) return;
    if (mode === 'add') {
      setSlugEdited([false, false]);
      return;
    }
    const flags = (initial?.post_category_translations || []).map((t: any) => Boolean(t?.slug));
    setSlugEdited(flags.length ? flags : [false, false]);
  }, [open, mode, initial?.post_category_translations]);

  // handle name change: update slug automatically only if user hasn't manually edited slug
  const handleNameChange = (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    formik.setFieldValue(`post_category_translations[${idx}].name`, val);
    if (!slugEdited[idx]) {
      formik.setFieldValue(`post_category_translations[${idx}].slug`, slugify(val));
    }
  };

  // ensure initial values always contain exactly two entries: vi (1) and en (2)
  const buildInitialTranslations = (): PostCategoryTranslation[] => {
    const map = new Map<string, PostCategoryTranslation>();
    (initial?.post_category_translations ?? []).forEach((t) => map.set(String(t.language_id), t));
    return LANGUAGES.map((l) => {
      const found = map.get(String(l.id));
      return found ? { ...found, language_id: l.id } : { language_id: l.id, name: '', slug: '' };
    });
  };

  const formik = useFormik({
    initialValues: {
      post_category_translations: buildInitialTranslations(),
    },
    enableReinitialize: true,
    validationSchema: schema,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      try {
        await onSave({
          post_category_translations: values.post_category_translations.map((t: any) => ({
            language_id: t.language_id,
            name: t.name.trim(),
            slug: t.slug.trim(),
          })),
        });
      } catch (err: any) {
        snackbar('error', err?.message || 'Có lỗi xảy ra');
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    // auto-generate slug when name changed and slug empty (kept for safety)
    formik.values.post_category_translations.forEach((t, idx) => {
      const name = t.name ?? '';
      const slug = t.slug ?? '';
      if (name && !slug && !slugEdited[idx]) {
        formik.setFieldValue(`post_category_translations[${idx}].slug`, slugify(name));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.values.post_category_translations.map((t) => t.name).join('|')]);

  const readOnly = mode === 'view';
  const showError = (path: string) => {
    const touched = getIn(formik.touched, path);
    const error = getIn(formik.errors, path);
    return (touched || formik.submitCount > 0) && Boolean(error);
  };
  const helperText = (path: string) => (showError(path) ? (getIn(formik.errors, path) as string) : ' ');

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Danh mục bài viết</DialogTitle>
      <form onSubmit={formik.handleSubmit} noValidate>
        <DialogContent dividers>
          <Box sx={{ display: 'grid', gap: 2 }}>
            {formik.values.post_category_translations.map((t: any, idx: number) => (
              <Box
                key={idx}
                sx={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 1, alignItems: 'center',  }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, mb: '22px' }}>
                  <strong>{LANGUAGES[idx].name}</strong>
                </Box>

                <TextField
                  label="Tên"
                  name={`post_category_translations[${idx}].name`}
                  value={t.name}
                  onChange={handleNameChange(idx)}
                  disabled={readOnly}
                  fullWidth
                  error={showError(`post_category_translations[${idx}].name`)}
                  helperText={helperText(`post_category_translations[${idx}].name`)}
                  size="small"
                />

                <TextField
                  label="Slug"
                  name={`post_category_translations[${idx}].slug`}
                  value={t.slug}
                  onChange={(e) => {
                    formik.setFieldValue(`post_category_translations[${idx}].slug`, e.target.value);
                    setSlugEdited((prev) => {
                      const next = [...prev];
                      next[idx] = true;
                      return next;
                    });
                  }}
                  disabled={readOnly}
                  error={showError(`post_category_translations[${idx}].slug`)}
                  helperText={helperText(`post_category_translations[${idx}].slug`)}
                  size="small"
                />
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Đóng</Button>
          {mode !== 'view' && (
            <Button variant="contained" type="submit" disabled={formik.isSubmitting}>
              Lưu
            </Button>
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
}
