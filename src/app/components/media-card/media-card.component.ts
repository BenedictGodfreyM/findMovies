import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TMDBMovie, TMDBMovieDetails, TMDBSeries, TMDBSeriesDetails } from '@/app/interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ImgLoaderService, TmdbService } from '@/app/services';
import { FormatDatePipe } from '@/app/pipes';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SkeletonLoaderComponent } from '@/app/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'media-card',
  host: {
    'class': 'card',
    '[class.card--big]': 'isCarouselCard'
  },
  imports: [CommonModule,RouterModule,LazyLoadImageModule,FormatDatePipe,SkeletonLoaderComponent],
  templateUrl: './media-card.component.html',
  styleUrl: './media-card.component.css'
})
export class MediaCardComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public loadingDetails: boolean = false;
  public media_details!: TMDBMovieDetails|TMDBSeriesDetails;

  @Input() isCarouselCard: boolean = false;
  @Input() media!: TMDBMovie|TMDBSeries;

  constructor(public IMGLoader: ImgLoaderService, private TMDBService: TmdbService){}

  ngOnInit(): void {
    this.loadingDetails = true;
    if(this.isMovie(this.media)){
      this.TMDBService.movie_details(this.media.id)
      .pipe(takeUntil(this._destroyed$), finalize(()=>{this.loadingDetails = false;}))
      .subscribe({
        next: (details: TMDBMovieDetails) => {this.media_details = details}
      });
    }else if(this.isSeries(this.media)){
      this.TMDBService.tv_show_details(this.media.id)
      .pipe(takeUntil(this._destroyed$), finalize(()=>{this.loadingDetails = false;}))
      .subscribe({
        next: (details: TMDBSeriesDetails) => {this.media_details = details}
      });
    }
  }

  public isMovie(media: TMDBMovie|TMDBSeries): media is TMDBMovie{
    return (media as TMDBMovie).title !== undefined;
  }

  public isSeries(media: TMDBMovie|TMDBSeries): media is TMDBSeries{
    return (media as TMDBSeries).name !== undefined;
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
