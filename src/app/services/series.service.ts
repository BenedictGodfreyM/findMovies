import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ExternalIDs, Genre, Season, SeriesDetails, TVShows, Videos } from '../models';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {

  constructor(private http: HttpClient) { }

  public trending(page: string = "1"): Observable<TVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TVShows>(`${environment.api.tmdb.url}/tv/popular`, { params: params });
  }

  public top_rated(page: string = "1"): Observable<TVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TVShows>(`${environment.api.tmdb.url}/tv/top_rated`, { params: params });
  }

  public on_the_air(page: string = "1"): Observable<TVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TVShows>(`${environment.api.tmdb.url}/tv/on_the_air`, { params: params });
  }

  public airing_today(page: string = "1"): Observable<TVShows>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US").set("page", page);
    return this.http.get<TVShows>(`${environment.api.tmdb.url}/tv/airing_today`, { params: params });
  }

  public details(tvshow_id: number): Observable<SeriesDetails>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<SeriesDetails>(`${environment.api.tmdb.url}/tv/${tvshow_id}`, { params: params });
  }

  public external_ids(tvshow_id: number): Observable<ExternalIDs>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<ExternalIDs>(`${environment.api.tmdb.url}/tv/${tvshow_id}/external_ids`, { params: params });
  }

  public season(tvshow_id: number, season_number: number): Observable<Season>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Season>(`${environment.api.tmdb.url}/tv/${tvshow_id}/season/${season_number}`, { params: params });
  }

  public season_videos(tvshow_id: number, season_number: number): Observable<Videos>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Videos>(`${environment.api.tmdb.url}/tv/${tvshow_id}/season/${season_number}/videos`, { params: params });
  }

  public genres(): Observable<Array<Genre>>{
    let params = new HttpParams().set("api_key", environment.api.tmdb.key).set("language", "en-US");
    return this.http.get<Array<Genre>>(`${environment.api.tmdb.url}/genre/tv/list`, { params: params });
  }
}
