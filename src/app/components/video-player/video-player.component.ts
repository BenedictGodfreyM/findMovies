import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { finalize, Subject, takeUntil } from 'rxjs';
import { TmdbService } from '../../services';
import { TMDBMovieVideos } from '../../models';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../pipes';

@Component({
  selector: 'app-video-player',
  imports: [CommonModule,SkeletonLoaderComponent,SafePipe],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public loadingVideo: boolean = false;
  public video_URL: string = "";
  public videoFound: boolean = false;

  @Input() tmdb_id!: number;
  @Input() media_type!: 'movie'|'tv_show';

  constructor(private TMDBService: TmdbService){}

  ngOnInit(): void {
    this.loadingVideo = true;
    if(this.media_type === 'movie'){
      this.TMDBService.movie_videos(this.tmdb_id)
      .pipe(takeUntil(this._destroyed$),finalize(() => this.loadingVideo = false))
      .subscribe({
        next: (videos) => this.processMovieVideos(videos)
      });
    }else if(this.media_type === 'tv_show'){
      this.TMDBService.tv_show_videos(this.tmdb_id)
      .pipe(takeUntil(this._destroyed$),finalize(() => this.loadingVideo = false))
      .subscribe({
        next: (videos) => this.processMovieVideos(videos)
      });
    }
  }
  
  private processMovieVideos(videos: TMDBMovieVideos): void{
    let v = videos.results;
    v = v.filter((video, i, arr) => video.site === "YouTube" && video.type === "Trailer" && video.official === true);
    v = v.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    if(v.length > 0){
      this.videoFound = true;
      this.video_URL = `https://www.youtube.com/embed/${v[0].key}?rel=0`;
    }else{
      this.videoFound = false;
    }
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
