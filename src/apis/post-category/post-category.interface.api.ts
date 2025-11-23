export interface PostCategoryTranSlation{
    id: number;
    name: string;
    slug: string;
}

export interface PostCategory {
    id: number;
    category_translation: PostCategoryTranSlation[];
} 