import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OMDBMedia, TMDBMovieDetails, TMDBMovies, Torrent, Torrents } from '../../models';
import { finalize, Subject, takeUntil } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ImgLoaderService, OmdbService, TmdbService, TorrentService } from '../../services';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MediaCardComponent, PhotosComponent, ReviewsComponent, SkeletonLoaderComponent, TorrentsComponent, VideoPlayerComponent } from '../../components';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DurationPipe, FormatCountriesPipe, FormatDatePipe, FormatLanguagesPipe } from '../../pipes';
import { RemoveIfEmptyString } from '../../directives';
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollGovernor } from '../../factories';

@Component({
  selector: 'app-movie-details',
  imports: [CommonModule,RouterModule,OverlayModule,MatSnackBarModule, MatBottomSheetModule, LazyLoadImageModule, DurationPipe, FormatDatePipe, FormatLanguagesPipe, FormatCountriesPipe, MediaCardComponent, VideoPlayerComponent, SkeletonLoaderComponent, ReviewsComponent, PhotosComponent,RemoveIfEmptyString],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css'
})
export class MovieDetailsComponent implements OnInit, OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  private route = inject(ActivatedRoute);
  private data = toSignal(this.route.data);
  public movie_details = computed(() => (this.data()?.['movie'] as unknown) as TMDBMovieDetails);
  public loadingOMDBDetails: boolean = false;
  public OMDB_details!: OMDBMedia;
  public fetchingTorrents: boolean = false;
  public loadingTorrents: boolean = false;
  public torrents: Array<Torrent> = new Array();
  public torrentsDisabled: boolean = true;
  public loadingSimilarMovies: boolean = false;
  public similar_movies!: TMDBMovies;

  constructor(private titleService: Title,private OMDBService: OmdbService,private TMDBService: TmdbService,private torrentClient: TorrentService,private snackBar: MatSnackBar,private bottomSheet: MatBottomSheet,public IMGLoader: ImgLoaderService){}

  ngOnInit(): void {
    this.titleService.setTitle(`${this.movie_details().title} | FindMovies`);
    
    ScrollGovernor.scrollToTop();

    this.loadingOMDBDetails = true;
    this.OMDBService.details(`${this.movie_details().imdb_id}`)
    .pipe(takeUntil(this._destroyed$),finalize(() => this.loadingOMDBDetails = false))
    .subscribe({
      next: (movie) => this.OMDB_details = movie
    });

    this.loadingSimilarMovies = true;
    this.TMDBService.similar_movies(this.movie_details().id)
    .pipe(takeUntil(this._destroyed$),finalize(() => this.loadingSimilarMovies = false))
    .subscribe({
      next: (movies) => this.similar_movies = movies
    });
  }

  public getTorrents(title: string): void{
    this.torrents.splice(0, this.torrents.length);
    this.fetchingTorrents = true;
    this.loadingTorrents = false;
    this.torrentClient.search(title)
    .pipe(takeUntil(this._destroyed$), finalize(() => { this.fetchingTorrents = false; }))
    .subscribe({
      next: (results: string | Torrents) => {
        if(typeof results !== "string"){
          this.fetchingTorrents = false;
          this.loadingTorrents = true;
          results.data.forEach((value, index, array) => {
            this.torrents.push(value);
          });
          const regex = this.generateMovieTorrentRegExp(title, this.movie_details().release_date);
          this.torrents = this.torrents.filter((torrent, index, torrents) => regex.test(torrent.name?.toString()));
          this.torrents = this.torrents.sort((a, b) => parseInt((b.seeders).replace(/,/g, '')) - parseInt((a.seeders).replace(/,/g, '')));
          this.torrents = this.torrents.slice(0, 40);
          this.loadingTorrents = false;
          if (this.torrents.length < 1) {
            this.torrentClient.invalidateCache(title);
            this.snackBar.open("Torrents not found!!!.", "Retry", { duration: 3000 }).onAction().subscribe({
              next: () => { this.getTorrents(title); }
            });
          }else{
            let bottomsheetRef = this.viewTorrents(this.torrents);
            bottomsheetRef.afterOpened().subscribe(result => {
              if(this.torrentClient.hasCachedData(title)){
                this.snackBar.open("Viewing Saved Torrents!", "Reload", { duration: 3000 }).onAction().subscribe(results => {
                  bottomsheetRef.dismiss();
                  this.torrentClient.invalidateCache(title);
                  this.getTorrents(title);
                });
              }
            });
            bottomsheetRef.afterDismissed().subscribe(response => {
              if(typeof response === "string" && response !== null && response !== ""){
                this.snackBar.open(response, "OK", { duration: 3000 });
              }
            });
          }
        }else{
          this.snackBar.open(results, "", { duration: 3000 });
        }
      },
      error: (error: any) => {
        this.snackBar.open(error.message, "Ok", { duration: 2000 });
      }
    });
  }

  private generateMovieTorrentRegExp(needle: string, release_date: string): RegExp{
    let year = `${new Date(release_date).getFullYear()}`;
    needle = needle.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_'{|}~]/g, " ");
    needle = needle.replace(/\s{2,}/g, " ");
    var needleArr = needle.split(' ');
    var needleSize = needleArr.length;
    var expression = '';
    if (needleSize > 1) {
      expression = needleArr.join('[\\s:\\.\\-\\&]*');
      expression += `[\\s:\\.\\-\\&]*\\(?${year}\\)?[\\s:\\.\\-\\&]*`;
    }else{
      expression = needle + `[\\s:\\.\\-\\&]*\\(?${year}\\)?[\\s:\\.\\-\\&]*`;
    }
    return new RegExp(expression, 'i');
  }

  private viewTorrents(torrents: Array<Torrent>): MatBottomSheetRef<TorrentsComponent>{
    return this.bottomSheet.open(TorrentsComponent, { data: torrents });
  }
  
  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
