import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, shareReplay, switchMap } from 'rxjs';
import { Torrents } from '@/app/interfaces';
import { environment } from '@/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  private _baseURL: string = `${environment.api.torrent.url}/all/search`;
  private _cache = new Map<string, Observable<Torrents>>();
  private readonly _refresh$ = new ReplaySubject<void>(1);

  constructor(private http: HttpClient) { 
    this._refresh$.next();
  }

  public search(title: string, limit: number = 8, windowTime: number = 600000): Observable<Torrents>{
    const params = new HttpParams().set("query", `${title}`).set("limit", limit);
    const cacheKey = `${this._baseURL}?${params.toString()}`;
    if(!this._cache.has(cacheKey)){
      const cachedObservable = this._refresh$.pipe(
        switchMap(() => this.http.get<Torrents>(`${this._baseURL}`, { params: params})),
        shareReplay({bufferSize: 1,refCount: true,windowTime: windowTime})
      );
      this._cache.set(cacheKey, cachedObservable);
    }
    return this._cache.get(cacheKey)!;
  }

  public hasCachedData(title: string, limit: number = 8): boolean{
    const params = new HttpParams().set("query", `${title}`).set("limit", limit);
    const cacheKey = `${this._baseURL}?${params.toString()}`;
    return this._cache.has(cacheKey);
  }

  public invalidateCache(title: string, limit: number = 8): void{
    const params = new HttpParams().set("query", `${title}`).set("limit", limit);
    const cacheKey = `${this._baseURL}?${params.toString()}`;
    if(this._cache.has(cacheKey)){
      this._refresh$.next();
      this._cache.delete(cacheKey);
    }
  }
}
