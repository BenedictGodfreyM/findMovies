import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MediaCardComponent, PaginationComponent } from '@/app/components';
import { RouterModule } from '@angular/router';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { PaginationConfig, TMDBTVShows } from '@/app/interfaces';
import { TmdbService, UiLoaderService } from '@/app/services';
import { ScrollGovernor } from '@/app/utils';

@Component({
  selector: 'app-tvshows',
  imports: [CommonModule,RouterModule,MediaCardComponent,PaginationComponent],
  templateUrl: './tvshows.component.html',
  styleUrl: './tvshows.component.css'
})
export class TvshowsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public tv_shows!: TMDBTVShows;
  public pagination = signal<PaginationConfig>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  })

  constructor(private TMDBService: TmdbService, public UILoader: UiLoaderService) { }

  ngOnInit(): void {
    this.getPopularTVShows();
  }

  public getPopularTVShows(page: string = "1"): void{
    this.UILoader.showSpinner();
    this.TMDBService.trending_tv_shows(page)
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => this.UILoader.stopSpinner()))
    .subscribe({
      next: (results: TMDBTVShows) => {
        this.tv_shows = results;
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
