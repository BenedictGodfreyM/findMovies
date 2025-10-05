import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, finalize, Subject, take, takeUntil } from 'rxjs';
import { TMDBMovies,TMDBTVShows } from '@/app/interfaces';
import { TmdbService, UiLoaderService } from '@/app/services';
import { CommonModule } from '@angular/common';
import { MediaCardComponent } from '@/app/components';

@Component({
  selector: 'app-home',
  imports: [CommonModule,MediaCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{
  private _destroyed$: Subject<boolean> = new Subject();
  public now_playing_movies!: TMDBMovies;
  public trending_movies!: TMDBMovies;
  public trending_series!: TMDBTVShows;

  constructor(private UIloader: UiLoaderService, private TMDBService: TmdbService) { }

  ngOnInit(): void {
    this.UIloader.showSpinner();
    combineLatest({
      trending_movies: this.TMDBService.trending_movies(),
      trending_series: this.TMDBService.trending_tv_shows()
    })
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => this.UIloader.stopSpinner()))
    .subscribe({
      next: (response) => {
        this.trending_movies = response.trending_movies;
        this.trending_series = response.trending_series;
      }
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
