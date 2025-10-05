import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TMDBMovieImages } from '@/app/interfaces';
import { ImgLoaderService, TmdbService } from '@/app/services';
import { SkeletonLoaderComponent } from '..';

@Component({
  selector: 'app-photos',
  host: {class: 'gallery'},
  imports: [CommonModule,LazyLoadImageModule,SkeletonLoaderComponent],
  templateUrl: './photos.component.html',
  styleUrl: './photos.component.css'
})
export class PhotosComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public loadingImages: boolean = false;
  public images!: TMDBMovieImages;

  @Input() tmdb_id!: number;
  @Input() media_type!: 'movie'|'tv_show';
    
  constructor(public IMGLoader: ImgLoaderService, private TMDBService: TmdbService){}

  ngOnInit(): void {
    this.loadingImages = true;
    if(this.media_type === 'movie'){
      this.TMDBService.movie_images(this.tmdb_id)
      .pipe(takeUntil(this._destroyed$), finalize(()=>{this.loadingImages = false;}))
      .subscribe({
        next: (images: TMDBMovieImages) => {this.images = images}
      });
    }else if(this.media_type === 'tv_show'){
      this.TMDBService.tv_show_images(this.tmdb_id)
      .pipe(takeUntil(this._destroyed$), finalize(()=>{this.loadingImages = false;}))
      .subscribe({
        next: (images: TMDBMovieImages) => {this.images = images}
      });
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
