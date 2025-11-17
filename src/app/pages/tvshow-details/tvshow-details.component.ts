import { Component, ElementRef, inject, Input, input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { finalize, Subject, switchMap, takeUntil } from 'rxjs';
import { OMDBMedia, TMDBSeriesDetails, TMDBTVShows, TMDBTVShowSeason } from '@/app/interfaces';
import { ImgLoaderService, OmdbService, TmdbService } from '@/app/services';
import { CommonModule } from '@angular/common';
import { MediaCardComponent, PhotosComponent, ReviewsComponent, SkeletonLoaderComponent, VideoPlayerComponent } from '@/app/components';
import { OverlayModule } from '@angular/cdk/overlay';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DurationPipe, FormatCountriesPipe, FormatLanguagesPipe } from '@/app/pipes';
import { RemoveIfEmptyString } from '@/app/directives';
import { TvshowSeason } from "./tvshow-season/tvshow-season";

@Component({
  selector: 'app-tvshow-details',
  imports: [CommonModule, RouterModule, OverlayModule, LazyLoadImageModule, DurationPipe, FormatLanguagesPipe, FormatCountriesPipe, MediaCardComponent, VideoPlayerComponent, SkeletonLoaderComponent, ReviewsComponent, PhotosComponent, RemoveIfEmptyString, TvshowSeason],
  templateUrl: './tvshow-details.component.html',
  styleUrl: './tvshow-details.component.css'
})
export class TvshowDetailsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public tvShowDetails: any;
  public tv_seasons: Array<TMDBTVShowSeason> = new Array();
  public loadingOMDBDetails: boolean = false;
  public OMDB_details!: OMDBMedia;
  public loadingSimilarTVShows: boolean = false;
  public similar_tv_shows!: TMDBTVShows;
  private _titleService = inject(Title);

  @Input({required: true})
  set tv_show_details(tv_show: TMDBSeriesDetails){
    this.tvShowDetails = tv_show;
    this._titleService.setTitle(`${tv_show.name} | FindMovies`);
    this._reloadMoviePoster();
  }

  @ViewChild('tvShowPoster') tvShowPoster!: ElementRef;

  constructor(private OMDBService: OmdbService,private TMDBService: TmdbService,public IMGLoader: ImgLoaderService){}

  ngOnInit(): void {
    this.loadingOMDBDetails = true;
    this.TMDBService.tv_show_external_ids(this.tvShowDetails.id)
    .pipe(
      switchMap((external_ids) => this.OMDBService.details(external_ids.imdb_id)),
      takeUntil(this._destroyed$),finalize(() => this.loadingOMDBDetails = false))
    .subscribe({
      next: (tv_show) => this.OMDB_details = tv_show
    });

    this.loadingSimilarTVShows = true;
    this.TMDBService.similar_tv_shows(this.tvShowDetails.id)
    .pipe(takeUntil(this._destroyed$),finalize(() => this.loadingSimilarTVShows = false))
    .subscribe({
      next: (tv_shows) => this.similar_tv_shows = tv_shows
    });
  }

  private _reloadMoviePoster(): void{
    if(this.tvShowPoster?.nativeElement) this.tvShowPoster.nativeElement.load();
  }
  
  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
