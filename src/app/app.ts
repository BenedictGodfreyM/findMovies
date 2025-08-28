import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, map, Subject, takeUntil } from 'rxjs';
import { NavigationService } from './services';
import { FooterComponent, HeaderComponent } from './components';
import { ClipboardService, IClipboardResponse, ClipboardModule } from 'ngx-clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterModule,HeaderComponent,FooterComponent,MatSnackBarModule,MatProgressBarModule,ClipboardModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy{
  private _destroyed$: Subject<boolean> = new Subject();
  public isNavigting = computed(() => !!this.router.getCurrentNavigation());

  constructor(private clipboardService: ClipboardService, private snackBar: MatSnackBar, private navigation: NavigationService, private router: Router){}

  ngOnInit(): void {
    this.subscribeNavigationEvents();
    this.subscribeClipboardEvents();
  }

  private subscribeNavigationEvents(): void{
    this.router.events.pipe(
      takeUntil(this._destroyed$),
      filter(event => event instanceof NavigationStart),
      map(event => this.navigation.setReturnURL(event.url))
    ).subscribe();
  }

  private subscribeClipboardEvents(): void{
    this.clipboardService.copyResponse$
    .pipe(takeUntil(this._destroyed$))
    .subscribe({
      next: (response: IClipboardResponse) => {
        if(response.isSuccess){
          this.snackBar.open("Item copied to Clipboard", "Ok", { duration: 3000 });
        }
        this.clipboardService.destroy();
      },
      error: (error: any) => this.snackBar.open("Unable to copy item!!!.", "Ok", { duration: 3000 })
    });
  }

  ngOnDestroy(): void {
    this._destroyed$.next(true);
    this._destroyed$.complete();
  }
}
