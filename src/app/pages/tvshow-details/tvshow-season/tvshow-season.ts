import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TMDBTVShowSeason, Torrent, Torrents } from '../../../models';
import { FormatDatePipe } from '../../../pipes';
import { finalize, Subject, takeUntil } from 'rxjs';
import { MatBottomSheet, MatBottomSheetModule, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TorrentService } from '../../../services';
import { TorrentsComponent } from '../../../components';

@Component({
  selector: 'tvshow-season',
  imports: [CommonModule, FormatDatePipe, MatBottomSheetModule, MatSnackBarModule],
  templateUrl: './tvshow-season.html',
  styleUrl: './tvshow-season.css'
})
export class TvshowSeason implements OnDestroy {
  private _destroyed$: Subject<boolean> = new Subject();
  public fetchingTorrents: boolean = false;
  public loadingTorrents: boolean = false;
  public torrents: Array<Torrent> = new Array();
  public torrentsDisabled: boolean = true;

  @Input() season!: TMDBTVShowSeason;

  constructor(private torrentClient: TorrentService,private snackBar: MatSnackBar,private bottomSheet: MatBottomSheet){}

  public getTorrents(title: string, type: string, season_number: number, episode_number: number = 0): void{
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
          // Filter Torrents Here
          this.torrents = this.filterTorrentsByTitle(title);
          if(type == "season") this.torrents = this.filterTorrentsBySeason(season_number);
          if(type == "episode") this.torrents = this.filterTorrentsByEpisode(season_number, episode_number);
          this.torrents = this.torrents.sort((a, b) => parseInt((b.seeders).replace(/,/g, '')) - parseInt((a.seeders).replace(/,/g, '')));
          this.torrents = this.torrents.slice(0, 60);
          this.loadingTorrents = false;
          if(this.torrents.length < 1){
            this.torrentClient.invalidateCache(title);
            this.snackBar.open("Torrents not found!!!.", "Retry", { duration: 3000 }).onAction().subscribe({
              next: () => { this.getTorrents(title, type, season_number, episode_number); }
            });
          }else{
            let bottomsheetRef = this.openTorrents(this.torrents);
            bottomsheetRef.afterOpened().subscribe(result => {
              if(this.torrentClient.hasCachedData(title)){
                this.snackBar.open("Retrieved Saved Torrents!", "Reload", { duration: 3000 }).onAction().subscribe(results => {
                  this.torrentClient.invalidateCache(title);
                  this.getTorrents(title, type, season_number, episode_number);
                });
              }
            });
            bottomsheetRef.afterDismissed().subscribe(response => this.bottomSheetDismissHandler(response))
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

  public getSeasonTorrents(title: string, season_number: number): void{
    let sanitizedTitle = this.generateSearchQuery(title);
    sanitizedTitle = `${sanitizedTitle}.${this.createSeasonIndex(season_number)}`;
    this.getTorrents(sanitizedTitle, "season", season_number);
  }

  public getEpisodeTorrents(title: string, season_number: number, episode_number: number): void{
    let sanitizedTitle = this.generateSearchQuery(title);
    sanitizedTitle = `${sanitizedTitle}.${this.createEpisodeIndex(season_number, episode_number)}`;
    this.getTorrents(sanitizedTitle, "episode", season_number, episode_number);
  }

  private filterTorrentsBySeason(season_number: number): Array<Torrent>{
    let index1 = this.createSeasonIndex(season_number);
    let index2 = `Season ${season_number}`;
    let regExp1 = new RegExp(`[\\s|\\.]${index1}[\\s|\\.]`, 'i');
    let regExp2 = new RegExp(`[\\s|\\.]${index2}[\\s|\\.]`, 'i');
    return this.torrents.filter((value, index, arr) => (regExp1.test(value.name?.toString()) || regExp2.test(value.name?.toString())));
  }

  private filterTorrentsByEpisode(season_number: number, episode_number: number): Array<Torrent>{
    let index = this.createEpisodeIndex(season_number, episode_number);
    let regExp = new RegExp(`[\\s|\\.]${index}[\\s|\\.]`, 'i');
    return this.torrents.filter((value, index, arr) => regExp.test(value.name?.toString()));
  }

  private createSeasonIndex(season_number: number): string{
    var index = (season_number > 9) ? `S${season_number}` : `S0${season_number}`;
    return `${index}`;
  }

  public createEpisodeIndex(season_number: number, episode_number: number): string{
    let index = this.createSeasonIndex(season_number);
    index = (episode_number > 9) ? `${index}E${episode_number}` : `${index}E0${episode_number}`;
    return `${index}`;
  }

  private filterTorrentsByTitle(title: string): Array<Torrent>{
    var sanitizedTitle = this.sanitizeSearchQuery(title);
    var sanitizedTitleArr = sanitizedTitle.split(' ');
    var sanitizedTitleSize = sanitizedTitleArr.length;
    var titleExpression = (sanitizedTitleSize > 1) ? sanitizedTitleArr.join('[\\s|\\.|\\-]') : sanitizedTitle;
    var titleRegex = new RegExp(`^${titleExpression}`, 'i');
    return this.torrents.filter((torrent, index, torrents) => titleRegex.test(torrent.name?.toString()));
  }

  private generateSearchQuery(title: string): string{
    var sanitizedSearchQuery = this.sanitizeSearchQuery(title);
    var searchQueryArr = sanitizedSearchQuery.split(' ');
    var searchQueryArrSize = searchQueryArr.length;
    var searchQuery = (searchQueryArrSize > 1) ? searchQueryArr.join('.') : sanitizedSearchQuery;
    return searchQuery;
  }

  private sanitizeSearchQuery(query: string): string{
    query = query.replace(/[!"#$%&'()*+,-./:;<=>?@[\]^_'{|}~]/g, " ");
    return query.replace(/\s{2,}/g, " ");
  }

  private openTorrents(torrents: Array<Torrent>): MatBottomSheetRef<TorrentsComponent>{
    return this.bottomSheet.open(TorrentsComponent, { data: torrents });
  }

  private bottomSheetDismissHandler(response: any): void{
    if(typeof response === "string" && response !== null && response !== ""){
      this.snackBar.open(response, "OK", { duration: 3000 });
    }
  }
  
  ngOnDestroy(): void{
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
