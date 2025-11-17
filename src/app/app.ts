import { Component, computed, OnDestroy, OnInit } from '@angular/core';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, RouterModule } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { NavigationService } from '@/app/services';
import { FooterComponent, HeaderComponent } from '@/app/components';
import { ClipboardService, IClipboardResponse, ClipboardModule } from 'ngx-clipboard';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ScrollGovernor } from './utils';

@Component({
  selector: 'app-root',
  imports: [RouterModule,HeaderComponent,FooterComponent,MatSnackBarModule,MatProgressBarModule,ClipboardModule],
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
      filter((event: Event): event is NavigationStart | NavigationEnd | NavigationCancel | NavigationError =>
        event instanceof NavigationStart || event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError
      ),
      takeUntil(this._destroyed$)
    ).subscribe((event: RouterEvent) => {
      if(event instanceof NavigationStart){
        this.navigation.setReturnURL(event.url);
      }
      if(event instanceof NavigationEnd){
        ScrollGovernor.scrollToTop();
      }
    });
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
