export interface CategoryTranSlation{
    id: number;
    name: string;
    slug: string;
}

export interface Category {
    id: number;
    category_translation: CategoryTranSlation[];

} 