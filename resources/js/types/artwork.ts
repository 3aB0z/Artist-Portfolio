import type { ArtworkMedia } from '@/types/artwork-media';
import type { Category } from '@/types/category';

export interface Artwork {
    id: number;
    slug: string;
    title: string;
    category: Category;
    image: string | null;
    media: ArtworkMedia[];
    description: string;
    artwork_date: string;
    started_at?: string;
    completed_at?: string;
    duration?: string;
    price?: number;
    created_at: string;
    updated_at: string;
}

export interface AdminArtwork extends Omit<Artwork, 'category'> {
    category_id: number;
}
