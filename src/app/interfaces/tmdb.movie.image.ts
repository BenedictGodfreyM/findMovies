export interface TMDBMovieImage{
    aspect_ratio: number;
    height: number;
    iso_639_1: string;
    file_path: string;
    vote_average: number;
    vote_count: number;
    width: number;
}

export interface TMDBMovieImages{
    id: number;
    backdrops: Array<TMDBMovieImage>;
    logos: Array<TMDBMovieImage>;
    posters: Array<TMDBMovieImage>;
}