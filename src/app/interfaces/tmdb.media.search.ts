import { TMDBMediaType } from "@/app/enums";

export interface TMDBSearchedMovie{
  poster_path: string;
  adult: boolean;
  overview: string;
  release_date: string;
  original_title: string;
  genre_ids: Array<number>;
  id: number;
  media_type: TMDBMediaType;
  original_language: string;
  title: string;
  backdrop_path: string;
  popularity: number;
  vote_count: number;
  video: boolean;
  vote_average: number;
}

export interface TMDBSearchedTVShow{
  poster_path: string;
  popularity: number;
  id: number;
  overview: string;
  backdrop_path: string;
  vote_average: number;
  media_type: TMDBMediaType;
  first_air_date: string;
  origin_country: Array<string>;
  genre_ids: Array<number>;
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

export interface TMDBSearchedPerson{
  profile_path: string;
  adult: boolean;
  id: number;
  media_type: TMDBMediaType;
  known_for: Array<TMDBSearchedMovie & TMDBSearchedTVShow>;
  name: string;
  popularity: number;
}

export interface TMDBSearchResults{
  page: number;
  results: Array<TMDBSearchedMovie & TMDBSearchedTVShow & TMDBSearchedPerson>;
  total_results: number;
  total_pages: number;
}
