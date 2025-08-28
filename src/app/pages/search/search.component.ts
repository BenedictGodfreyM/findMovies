import { CommonModule } from '@angular/common';
import { ApplicationRef, Component, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Observable, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import { TmdbService, UiLoaderService } from '../../services';
import { TMDBMovie, TMDBSearchResults, TMDBSeries } from '../../models';
import { MediaCardComponent } from '../../components';

@Component({
  selector: 'app-search',
  imports: [CommonModule,ReactiveFormsModule,MatDialogModule,MatSnackBarModule,MediaCardComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public items = signal<Array<TMDBMovie|TMDBSeries>>(new Array<TMDBMovie|TMDBSeries>);
  public searchingItems: boolean = false;
  public searchField: FormControl = new FormControl('');
  public hasSearched$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private searchFieldObserver!: Subscription;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, public UILoader: UiLoaderService, private applicationRef: ApplicationRef, private TMDBService: TmdbService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.searchField = this.fb.control('');
    this.searchFieldObserver = this.searchField.valueChanges
    .pipe(debounceTime(500), distinctUntilChanged(), switchMap(inputValue => {
      return this.searchItems(inputValue);
    })).subscribe({
      next: (response: TMDBSearchResults) => {
        let filtered_results = response.results.filter((value, index, arr) => {
          return ["movie","tv"].includes(value.media_type.toString());
        }).map((value) => value as TMDBMovie|TMDBSeries);
        this.items.set(filtered_results);
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
      }
    });
  }

  public searchItems(query: string): Observable<TMDBSearchResults>{
    this.emptySearchedResults();
    this.UILoader.showSpinner();
    this.applicationRef.tick();
    return this.TMDBService.search_multi(query)
    .pipe(take(1), takeUntil(this._destroyed$), finalize(() => { 
      this.UILoader.stopSpinner();
      this.hasSearched$.next(true);
      this.applicationRef.tick(); 
    }));
  }

  public emptySearchedResults(): void{
    this.items().splice(0, this.items.length);
  }

  public hasSearched(): boolean{
    return this.hasSearched$.value;
  }

  ngOnDestroy(): void {
      this._destroyed$.next(true);
      this._destroyed$.complete();
      this.searchFieldObserver.unsubscribe();
  }
}
