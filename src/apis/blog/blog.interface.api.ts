export interface CreatePostDto {
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
}

export interface Translation {
  id: number;
  language_id: number;
  title: string;
  slug: string | null;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export interface User {
  id: number;
  name: string;
}

export interface Post {
  id: number;
  post_category: {
    id: number;
    translations: [
      {
        name: string;
      },
    ];
  };
  title: string;
  status: number;
  created_at: string;
  thumbnail: string;
  translations: Translation[];
  user: User;
}
