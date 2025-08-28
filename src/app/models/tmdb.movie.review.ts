export interface TMDBMovieReview{
    id: string;
    author: string;
    author_details: {
        name: string;
        username: string;
        avatar_path: string;
        rating: number;
    };
    content: string;
    url: string;
    created_at: string;
    updated_at: string;
}

export interface TMDBMovieReviews{
    id: number;
    page: number;
    results: Array<TMDBMovieReview>;
    total_pages: number;
    total_results: number;
}