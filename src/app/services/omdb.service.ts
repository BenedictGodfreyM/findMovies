import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment';
import { OMDBMedia } from '@/app/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OmdbService {

  constructor(private http: HttpClient) { }

  public search(title: string): Observable<{Search: Array<OMDBMedia>}>{
    let params = new HttpParams().set("apikey", environment.api.omdb.key).set("s", title).set("plot", "full").set("r", "json").set("v", "1");
    return this.http.get<{Search: Array<OMDBMedia>}>(`${environment.api.omdb.url}/`, { params: params });
  }

  public details(imdb_ID: string): Observable<OMDBMedia>{
    let imdbID = `${imdb_ID}`;
    let params = new HttpParams().set("apikey", environment.api.omdb.key).set("i", imdbID).set("plot", "full").set("r", "json").set("v", "1");
    return this.http.get<OMDBMedia>(`${environment.api.omdb.url}/`, { params: params });
  }
}
