import { useEffect, useState } from "react";
import { getPostCategory, createPostCategory, updatePostCategory, deletePostCategory } from "~/apis/post-category/post-category.api";
import type { PostCategoryApi } from "~/apis/post-category/post-category.interface.api";

export type PostCategoryTranslation = {
  language_id: number | string;
  name: string;
  slug: string;
};

export type BlogCategory = {
  id: number | string;
  post_category_translations: PostCategoryTranslation[];
  created_at?: string;
};

export type ModalMode = "view" | "edit" | "add" | null;

export function useBlogCategoriesState() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<BlogCategory | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getPostCategory('vi');
        setCategories(
          (data || []).map((d: PostCategoryApi) => ({
            id: d.id,
            post_category_translations: d.post_category_translations.map((t) => ({
              language_id: t.language_id,
              name: t.name,
              slug: t.slug,
            })),
            created_at: d.created_at,
          }))
        );
      } catch (err) {
        // swallow here — screen can show snackbar
        console.error("Failed load categories", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function openAdd() {
    setModalMode("add");
    setSelected(null);
  }
  function openView(cat: BlogCategory) {
    setSelected(cat);
    setModalMode("view");
  }
  function openEdit(cat: BlogCategory) {
    setSelected(cat);
    setModalMode("edit");
  }
  function closeModal() {
    setModalMode(null);
    setSelected(null);
  }

  // async actions returning created/updated item so caller can await & handle snackbar
  async function addCategory(payload: { post_category_translations: PostCategoryTranslation[] }) {
    setLoading(true);
    try {
      const created = await createPostCategory({
        post_category_translations: payload.post_category_translations.map((t) => ({
          language_id: Number(t.language_id),
          name: t.name,
          slug: t.slug,
        })),
      });
      const mapped: BlogCategory = {
        id: created.id,
        post_category_translations: created.post_category_translations.map((t) => ({
          language_id: t.language_id,
          name: t.name,
          slug: t.slug,
        })),
        created_at: created.created_at,
      };
      setCategories((prev) => [mapped, ...prev]);
      return mapped;
    } finally {
      setLoading(false);
    }
  }

  async function updateCategory(id: number | string, payload: { post_category_translations: PostCategoryTranslation[] }) {
    setLoading(true);
    try {
      const updated = await updatePostCategory(Number(id), {
        post_category_translations: payload.post_category_translations.map((t) => ({
          language_id: Number(t.language_id),
          name: t.name,
          slug: t.slug,
        })),
      });
      const mapped: BlogCategory = {
        id: updated.id,
        post_category_translations: updated.post_category_translations.map((t) => ({
          language_id: t.language_id,
          name: t.name,
          slug: t.slug,
        })),
        created_at: updated.created_at,
      };
      setCategories((prev) => prev.map((c) => (String(c.id) === String(id) ? mapped : c)));
      return mapped;
    } finally {
      setLoading(false);
    }
  }

  async function deleteCategoryById(id: number | string) {
    setLoading(true);
    try {
      await deletePostCategory(Number(id));
      setCategories((prev) => prev.filter((c) => String(c.id) !== String(id)));
    } finally {
      setLoading(false);
    }
  }

  return {
    categories,
    modalMode,
    selected,
    loading,
    openAdd,
    openView,
    openEdit,
    closeModal,
    addCategory,
    updateCategory,
    deleteCategory: deleteCategoryById,
  };
}