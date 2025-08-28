import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { OMDBMedia, TMDBSeriesDetails, TMDBTVShows, TMDBTVShowSeason, Torrent } from '../../models';
import { ImgLoaderService, OmdbService, TmdbService, TorrentService } from '../../services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tvshow-details',
  imports: [CommonModule],
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
  public similar_tv_shows!: TMDBTVShows;

  constructor(private titleService: Title,private OMDBService: OmdbService,private TMDBService: TmdbService,private torrentClient: TorrentService,private snackBar: MatSnackBar,private bottomSheet: MatBottomSheet,public IMGLoader: ImgLoaderService){}

  ngOnInit(): void {
    this.titleService.setTitle(`${this.tv_show_details().name} | FindMovies`);
    
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
  
  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
