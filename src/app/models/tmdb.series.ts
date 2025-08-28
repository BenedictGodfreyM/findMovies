import { TMDBMovieCrew, TMDBMovieGenre, TMDBMovieGuestStars, TMDBMovieLanguage, TMDBMovieCountry } from ".";

export interface TMDBSeriesMarkUp{
  poster_path: string | null;
  popularity: number;
  id: number;
  backdrop_path: string | null;
  vote_average: number;
  overview: string;
  first_air_date: string;
  origin_country: Array<string>;
  original_language: string;
  vote_count: number;
  name: string;
  original_name: string;
}

export interface TMDBSeries extends TMDBSeriesMarkUp{
  genre_ids: Array<number>;
}

export interface TMDBSeriesDetails extends TMDBSeriesMarkUp{
  episode_run_time: Array<number>;
  genres: Array<TMDBMovieGenre>;
  homepage: string;
  in_production: boolean;
  languages: Array<string>;
  last_air_date: string;
  last_episode_to_air: TMDBTVShowEpisode;
  next_episode_to_air: TMDBTVShowEpisode;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Array<TMDBTVShowSeason>;
  spoken_languages: Array<TMDBMovieLanguage>;
  production_countries: Array<TMDBMovieCountry>;
  status: string;
  tagline: string;
  type: string;
}

export interface TMDBTVShows{
  page: number;
  results: Array<TMDBSeries>;
  total_pages: number;
  total_results: number;
}

export interface TMDBTVShowSeason{
  _id: string;
  air_date: string;
  episodes: Array<TMDBTVShowEpisode>;
  episode_count: number;
  name: string;
  overview: string;
  id: number;
  poster_path: string;
  season_number: number;
}

export interface TMDBTVShowEpisode{
  air_date: string;
  episode_number: number;
  crew: Array<TMDBMovieCrew>;
  guest_stars: Array<TMDBMovieGuestStars>;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface ExternalIDs{
  imdb_id: string;
  freebase_id: string;
  freebase_mid: string;
  tvdb_id: number;
  tvrage_id: number;
  facebook_id: string;
  instagram_id: string;
  twitter_id: string;
  id: number;
}
