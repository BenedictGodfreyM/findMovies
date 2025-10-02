import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MediaCardComponent, PaginationComponent } from '../../components';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { PaginationConfig, TMDBMovies } from '../../models';
import { TmdbService, UiLoaderService } from '../../services';
import { ScrollGovernor } from '../../factories';

@Component({
  selector: 'app-movies',
  imports: [CommonModule,RouterModule,MediaCardComponent,PaginationComponent],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.css'
})
export class MoviesComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public movies!: TMDBMovies;
  public pagination = signal<PaginationConfig>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  })

  constructor(private TMDBService: TmdbService, public UILoader: UiLoaderService) { }

  ngOnInit(): void {
    this.getPopularMovies();
  }

  public getPopularMovies(page: string = "1"): void{
    this.UILoader.showSpinner();
    this.TMDBService.popular_movies(page)
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => this.UILoader.stopSpinner()))
    .subscribe({
      next: (results: TMDBMovies) => {
        this.movies = results;
        this.pagination.set({
          currentPage: results.page,
          totalPages: results.total_pages,
          totalItems: results.total_results,
        });
        ScrollGovernor.scrollToTop();
      }
    });
  }

  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
