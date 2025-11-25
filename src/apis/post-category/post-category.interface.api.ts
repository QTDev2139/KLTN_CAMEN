export interface PostCategoryTranslationApi {
  id?: number;
  name: string;
  slug: string;
  language_id: number;
  post_category_id?: number;
}

export interface PostCategoryApi {
  id: number;
  post_category_translations: PostCategoryTranslationApi[];
  created_at?: string;
}