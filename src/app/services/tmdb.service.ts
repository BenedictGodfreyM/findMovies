import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExternalIDs, TMDBMovieDetails, TMDBMovieGenre, TMDBMovieImages, TMDBMovies, TMDBMovieVideos, TMDBSeriesDetails, TMDBTVShows, TMDBTVShowSeason, TMDBMovieReviews, TMDBSearchResults, TMDBMovie, TMDBSeries } from '../models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {

  constructor(private http: HttpClient) { }

  public find(external_id: string, external_source: string = "imdb_id"): Observable<{"movie_results": Array<TMDBMovie>, "tv_results": Array<TMDBSeries>}>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("external_source", external_source);
    return this.http.get<{"movie_results": Array<TMDBMovie>, "tv_results": Array<TMDBSeries>}>(`${environment.api.tmdb.url}/find/${external_id}`, { params: params });
  }

  public search_multi(query: string, page: string = "1"): Observable<TMDBSearchResults>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("query", query).set("page", page).set("include_adult", false);
    return this.http.get<TMDBSearchResults>(`${environment.api.tmdb.url}/search/multi`, { params: params });
  }

  public discover_movies(year?: number, with_genres?: string, sort_by?: string, page: string = "1"): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("include_adult", false).set("include_video", false).set("language", "en-US").set("page", page)
    params = (typeof sort_by !== "undefined") ? params.append("sort_by", sort_by) : params;
    params = (typeof year !== "undefined") ? params.append("year", year) : params;
    params = (typeof with_genres !== "undefined") ? params.append("with_genres", with_genres) : params;
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/discover/movie`, { params: params });
  }

  public upcoming_movies(page: string = "1"): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/movie/upcoming`, { params: params });
  }

  public now_playing_movies(page: string = "1"): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/movie/now_playing`, { params: params });
  }

  public trending_movies(): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key);
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/trending/movie/week`, { params: params });
  }

  public popular_movies(page: string = "1"): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/movie/popular`, { params: params });
  }

  public top_rated_movies(page: string = "1"): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/movie/top_rated`, { params: params });
  }

  public movie_details(movie_id: number): Observable<TMDBMovieDetails>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBMovieDetails>(`${environment.api.tmdb.url}/movie/${movie_id}`, { params: params });
  }

  public movie_videos(movie_id: number): Observable<TMDBMovieVideos>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBMovieVideos>(`${environment.api.tmdb.url}/movie/${movie_id}/videos`, { params: params });
  }

  public movie_images(movie_id: number): Observable<TMDBMovieImages>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBMovieImages>(`${environment.api.tmdb.url}/movie/${movie_id}/images`, { params: params });
  }

  public movie_reviews(movie_id: number, page: string = "1"): Observable<TMDBMovieReviews>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovieReviews>(`${environment.api.tmdb.url}/movie/${movie_id}/reviews`, { params: params });
  }

  public movie_genres(): Observable<Array<TMDBMovieGenre>>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Array<TMDBMovieGenre>>(`${environment.api.tmdb.url}/genre/movie/list`, { params: params });
  }

  public similar_movies(movie_id: number, page: string = "1"): Observable<TMDBMovies>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovies>(`${environment.api.tmdb.url}/movie/${movie_id}/similar`, { params: params });
  }

  public discover_series(first_air_date_year?: number, with_genres?: string, sort_by?: string, page: string = "1"): Observable<TMDBTVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("include_adult", false).set("include_null_first_air_dates", false).set("language", "en-US").set("page", page)
    params = (typeof sort_by !== "undefined") ? params.append("sort_by", sort_by) : params;
    params = (typeof first_air_date_year !== "undefined") ? params.append("first_air_date_year", first_air_date_year) : params;
    params = (typeof with_genres !== "undefined") ? params.append("with_genres", with_genres) : params;
    return this.http.get<TMDBTVShows>(`${environment.api.tmdb.url}/discover/tv`, { params: params });
  }

  public trending_tv_shows(page: string = "1"): Observable<TMDBTVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBTVShows>(`${environment.api.tmdb.url}/tv/popular`, { params: params });
  }

  public top_rated_tv_shows(page: string = "1"): Observable<TMDBTVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBTVShows>(`${environment.api.tmdb.url}/tv/top_rated`, { params: params });
  }

  public tv_shows_on_the_air(page: string = "1"): Observable<TMDBTVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBTVShows>(`${environment.api.tmdb.url}/tv/on_the_air`, { params: params });
  }

  public tv_shows_airing_today(page: string = "1"): Observable<TMDBTVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBTVShows>(`${environment.api.tmdb.url}/tv/airing_today`, { params: params });
  }

  public tv_show_details(tvshow_id: number): Observable<TMDBSeriesDetails>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBSeriesDetails>(`${environment.api.tmdb.url}/tv/${tvshow_id}`, { params: params });
  }

  public tv_show_external_ids(tvshow_id: number): Observable<ExternalIDs>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<ExternalIDs>(`${environment.api.tmdb.url}/tv/${tvshow_id}/external_ids`, { params: params });
  }

  public tv_show_season(tvshow_id: number, season_number: number): Observable<TMDBTVShowSeason>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBTVShowSeason>(`${environment.api.tmdb.url}/tv/${tvshow_id}/season/${season_number}`, { params: params });
  }

  public tv_show_season_videos(tvshow_id: number, season_number: number): Observable<TMDBMovieVideos>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBMovieVideos>(`${environment.api.tmdb.url}/tv/${tvshow_id}/season/${season_number}/videos`, { params: params });
  }

  public tv_show_videos(tvshow_id: number): Observable<TMDBMovieVideos>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBMovieVideos>(`${environment.api.tmdb.url}/tv/${tvshow_id}/videos`, { params: params });
  }

  public tv_show_images(tvshow_id: number): Observable<TMDBMovieImages>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<TMDBMovieImages>(`${environment.api.tmdb.url}/tv/${tvshow_id}/images`, { params: params });
  }

  public tv_show_reviews(tvshow_id: number, page: string = "1"): Observable<TMDBMovieReviews>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBMovieReviews>(`${environment.api.tmdb.url}/tv/${tvshow_id}/reviews`, { params: params });
  }

  public tv_show_genres(): Observable<Array<TMDBMovieGenre>>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Array<TMDBMovieGenre>>(`${environment.api.tmdb.url}/genre/tv/list`, { params: params });
  }

  public similar_tv_shows(tvshow_id: number, page: string = "1"): Observable<TMDBTVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TMDBTVShows>(`${environment.api.tmdb.url}/tv/${tvshow_id}/similar`, { params: params });
  }
}
