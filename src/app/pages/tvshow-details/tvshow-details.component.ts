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
import { TvshowSeason } from "./tvshow-season/tvshow-season";

@Component({
  selector: 'app-tvshow-details',
  imports: [CommonModule, RouterModule, OverlayModule, LazyLoadImageModule, DurationPipe, FormatLanguagesPipe, FormatCountriesPipe, MediaCardComponent, VideoPlayerComponent, SkeletonLoaderComponent, ReviewsComponent, PhotosComponent, RemoveIfEmptyString, TvshowSeason],
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
  public loadingSimilarTVShows: boolean = false;
  public similar_tv_shows!: TMDBTVShows;

  constructor(private titleService: Title,private OMDBService: OmdbService,private TMDBService: TmdbService,public IMGLoader: ImgLoaderService){}

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
  
  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
