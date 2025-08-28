import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TMDBMovieReviews } from '../../models';
import { ImgLoaderService, TmdbService } from '../../services';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { SkeletonLoaderComponent } from '..';

@Component({
  selector: 'app-reviews',
  host: {class: 'reviews'},
  imports: [CommonModule,LazyLoadImageModule,SkeletonLoaderComponent],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit, OnDestroy{
  private _destroyed$: Subject<boolean> = new Subject();
  public loadingReviews: boolean = false;
  public reviews!: TMDBMovieReviews;

  @Input() tmdb_id!: number;
  @Input() media_type!: 'movie'|'tv_show';
  
  constructor(public IMGLoader: ImgLoaderService, private TMDBService: TmdbService){}

  ngOnInit(): void {
    this.loadingReviews = true;
    if(this.media_type === 'movie'){
      this.TMDBService.movie_reviews(this.tmdb_id)
      .pipe(takeUntil(this._destroyed$), finalize(()=>{this.loadingReviews = false;}))
      .subscribe({
        next: (reviews: TMDBMovieReviews) => {this.reviews = reviews}
      });
    }else if(this.media_type === 'tv_show'){
      this.TMDBService.tv_show_reviews(this.tmdb_id)
      .pipe(takeUntil(this._destroyed$), finalize(()=>{this.loadingReviews = false;}))
      .subscribe({
        next: (reviews: TMDBMovieReviews) => {this.reviews = reviews}
      });
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
