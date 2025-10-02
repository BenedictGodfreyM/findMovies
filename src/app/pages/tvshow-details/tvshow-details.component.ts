import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { OMDBMedia, TMDBSeriesDetails, TMDBTVShows, TMDBTVShowSeason, Torrent, Torrents } from '../../models';
import { ImgLoaderService, OmdbService, TmdbService, TorrentService } from '../../services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';
import { MediaCardComponent, PhotosComponent, ReviewsComponent, SkeletonLoaderComponent, TorrentsComponent, VideoPlayerComponent } from '../../components';
import { OverlayModule } from '@angular/cdk/overlay';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DurationPipe, FormatCountriesPipe, FormatLanguagesPipe } from '../../pipes';
import { RemoveIfEmptyString } from '../../directives';
import { ScrollGovernor } from '../../factories';

@Component({
  selector: 'app-tvshow-details',
  imports: [CommonModule,RouterModule,OverlayModule,MatSnackBarModule,MatBottomSheetModule,LazyLoadImageModule,DurationPipe,FormatLanguagesPipe,FormatCountriesPipe,MediaCardComponent,VideoPlayerComponent,SkeletonLoaderComponent,ReviewsComponent,PhotosComponent,RemoveIfEmptyString],
  templateUrl: './tvshow-details.component.html',
  styleUrl: './tvshow-details.component.css'
})
export class TvshowDetailsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  public tv_show_details = computed(() => (this.data()?.['tv_show'] as unknown) as TMDBSeriesDetails);
  public tv_seasons: Array<TMDBTVShowSeason> = new Array();
  private allowed_tvshow_status_options: Array<string> = ["Returning Series", "Ended", "Canceled"];
  public loadingOMDBDetails: boolean = false;
  public OMDB_details!: OMDBMedia;
  public fetchingTorrents: boolean = false;
  public loadingTorrents: boolean = false;
  public torrents: Array<Torrent> = new Array();
  public torrentsDisabled: boolean = true;
  public loadingSimilarTVShows: boolean = false;
  public loadingTVShowSeasonDetails: boolean = false;
  public similar_tv_shows!: TMDBTVShows;

  constructor(private titleService: Title,private OMDBService: OmdbService,private TMDBService: TmdbService,private torrentClient: TorrentService,private snackBar: MatSnackBar,private bottomSheet: MatBottomSheet,public IMGLoader: ImgLoaderService){}

  ngOnInit(): void {
    this.titleService.setTitle(`${this.tv_show_details().name} | FindMovies`);
    
    ScrollGovernor.scrollToTop();
    
    this.loadingOMDBDetails = true;
    this.TMDBService.tv_show_external_ids(this.tv_show_details().id)
    .pipe(
      switchMap((external_ids) => this.OMDBService.details(external_ids.imdb_id)),
      takeUntil(this._destroyed$),finalize(() => this.loadingOMDBDetails = false))
    .subscribe({
      next: (tv_show) => this.OMDB_details = tv_show
    });

    this.loadingSimilarTVShows = true;
    this.TMDBService.similar_tv_shows(this.tv_show_details().id)
    .pipe(takeUntil(this._destroyed$),finalize(() => this.loadingSimilarTVShows = false))
    .subscribe({
      next: (tv_shows) => this.similar_tv_shows = tv_shows
    });
  }

  public getTVSeasonDetails(tvshow_id: number, season_number: number): void{
    this.loadingTVShowSeasonDetails = true;
    this.TMDBService.tv_show_season(tvshow_id, season_number)
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.loadingTVShowSeasonDetails = false; }))
    .subscribe({
      next: (tv_season) => this.tv_seasons[season_number] = tv_season
    });
  }

  public getTorrents(title: string, type: string, season_number: number, episode_number: number = 0): void{
    this.torrents.splice(0, this.torrents.length);
    this.fetchingTorrents = true;
    this.loadingTorrents = false;
    this.torrentClient.search(title)
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingTorrents = false; }))
    .subscribe({
      next: (results: string | Torrents) => {
        if(typeof results !== "string"){
          this.fetchingTorrents = false;
          this.loadingTorrents = true;
          results.data.forEach((value, index, array) => {
            this.torrents.push(value);
          });
          // Filter Torrents Here
          this.torrents = this.filterTorrentsByTitle(title);
          if(type == "season") this.torrents = this.filterTorrentsBySeason(season_number);
          if(type == "episode") this.torrents = this.filterTorrentsByEpisode(season_number, episode_number);
          this.torrents = this.torrents.sort((a, b) => parseInt((b.seeders).replace(/,/g, '')) - parseInt((a.seeders).replace(/,/g, '')));
          this.torrents = this.torrents.slice(0, 60);
          this.loadingTorrents = false;
          if(this.torrents.length < 1){
            this.torrentClient.invalidateCache(title);
            this.snackBar.open("Torrents not found!!!.", "Retry", { duration: 3000 }).onAction().subscribe({
              next: () => { this.getTorrents(title, type, season_number, episode_number); }
            });
          }else{
            let bottomsheetRef = this.openTorrents(this.torrents);
            bottomsheetRef.afterOpened().subscribe(result => {
              if(this.torrentClient.hasCachedData(title)){
                this.snackBar.open("Retrieved Saved Torrents!", "Reload", { duration: 3000 }).onAction().subscribe(results => {
                  this.torrentClient.invalidateCache(title);
                  this.getTorrents(title, type, season_number, episode_number);
                });
              }
            });
            bottomsheetRef.afterDismissed().subscribe(response => this.bottomSheetDismissHandler(response))
          }
        }else{
          this.snackBar.open(results, "", { duration: 3000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
      }
    });
  }

  public getSeasonTorrents(title: string, season_number: number): void{
    let sanitizedTitle = this.generateSearchQuery(title);
    sanitizedTitle = `${sanitizedTitle}.${this.createSeasonIndex(season_number)}`;
    this.getTorrents(sanitizedTitle, "season", season_number);
  }

  public getEpisodeTorrents(title: string, season_number: number, episode_number: number): void{
    let sanitizedTitle = this.generateSearchQuery(title);
    sanitizedTitle = `${sanitizedTitle}.${this.createEpisodeIndex(season_number, episode_number)}`;
    this.getTorrents(sanitizedTitle, "episode", season_number, episode_number);
  }

  private filterTorrentsBySeason(season_number: number): Array<Torrent>{
    let index1 = this.createSeasonIndex(season_number);
    let index2 = `Season ${season_number}`;
    let regExp1 = new RegExp(`[\\s|\\.]${index1}[\\s|\\.]`, 'i');
    let regExp2 = new RegExp(`[\\s|\\.]${index2}[\\s|\\.]`, 'i');
    return this.torrents.filter((value, index, arr) => (regExp1.test(value.name?.toString()) || regExp2.test(value.name?.toString())));
  }

  private filterTorrentsByEpisode(season_number: number, episode_number: number): Array<Torrent>{
    let index = this.createEpisodeIndex(season_number, episode_number);
    let regExp = new RegExp(`[\\s|\\.]${index}[\\s|\\.]`, 'i');
    return this.torrents.filter((value, index, arr) => regExp.test(value.name?.toString()));
  }

  private filterTorrentsByTitle(title: string): Array<Torrent>{
    var sanitizedTitle = this.sanitizeSearchQuery(title);
    var sanitizedTitleArr = sanitizedTitle.split(' ');
    var sanitizedTitleSize = sanitizedTitleArr.length;
    var titleExpression = (sanitizedTitleSize > 1) ? sanitizedTitleArr.join('[\\s|\\.|\\-]') : sanitizedTitle;
    var titleRegex = new RegExp(`^${titleExpression}`, 'i');
    return this.torrents.filter((torrent, index, torrents) => titleRegex.test(torrent.name?.toString()));
  }

  private generateSearchQuery(title: string): string{
    var sanitizedSearchQuery = this.sanitizeSearchQuery(title);
    var searchQueryArr = sanitizedSearchQuery.split(' ');
    var searchQueryArrSize = searchQueryArr.length;
    var searchQuery = (searchQueryArrSize > 1) ? searchQueryArr.join('.') : sanitizedSearchQuery;
    return searchQuery;
  }

  private sanitizeSearchQuery(query: string): string{
    query = query.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_'{|}~]/g, " ");
    return query.replace(/\s{2,}/g, " ");
  }

  private createSeasonIndex(season_number: number): string{
    var index = (season_number > 9) ? `S${season_number}` : `S0${season_number}`;
    return `${index}`;
  }

  public createEpisodeIndex(season_number: number, episode_number: number): string{
    let index = this.createSeasonIndex(season_number);
    index = (episode_number > 9) ? `${index}E${episode_number}` : `${index}E0${episode_number}`;
    return `${index}`;
  }

  private openTorrents(torrents: Array<Torrent>): MatBottomSheetRef<TorrentsComponent>{
    return this.bottomSheet.open(TorrentsComponent, { data: torrents });
  }

  private bottomSheetDismissHandler(response: any): void{
    if(typeof response === "string" && response !== null && response !== ""){
      this.snackBar.open(response, "OK", { duration: 3000 });
    }
  }
  
  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
