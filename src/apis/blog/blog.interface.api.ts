export interface Post {
  id: number;
  status?: string;
  created_at?: string | null;
  user?: any;
  language?: { code?: 'vi' | 'en' };
  title?: string;
  slug?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  thumbnail?: string;
  translation_key?: string;
}

export interface CreatePostDto extends Post {}
