import { TMDBMovieGenre, TMDBMovieLanguage, TMDBMovieCountry } from ".";

export interface TMDBMovieMarkUp{
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBMovie extends TMDBMovieMarkUp{
  genre_ids: Array<number>;
}

export interface TMDBMovieDetails extends TMDBMovieMarkUp{
  belongs_to_collection: null | object;
  budget: number;
  genres: Array<TMDBMovieGenre>;
  homepage: string | null;
  imdb_id: string | null;
  revenue: number;
  runtime: number | null;
  spoken_languages: Array<TMDBMovieLanguage>;
  production_countries: Array<TMDBMovieCountry>;
  status: TMDBMovieStatus;
  tagline: string | null;
}

export enum TMDBMovieStatus{
  'Rumored',
  'Planned',
  'In Production',
  'Post Production',
  'Released',
  'Canceled'
}

export interface TMDBMovies{
  page: number;
  results: Array<TMDBMovie>;
  total_pages: number;
  total_results: number;
}
