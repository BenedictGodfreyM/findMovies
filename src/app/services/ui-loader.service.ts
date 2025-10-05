import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable, signal } from '@angular/core';
import { LoadingSpinnerComponent } from '@/app/components';

@Injectable({
  providedIn: 'root'
})
export class UiLoaderService {
  private _spinnerRef: OverlayRef;
  public loading = signal(false);

  constructor(private overlay: Overlay) {
    this._spinnerRef = this.cdkSpinnerCreate();
  }

  private cdkSpinnerCreate(): OverlayRef{
    return this.overlay.create({
      hasBackdrop: true,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });
  }

  public showSpinner(): void{
    this._spinnerRef = this.cdkSpinnerCreate();
    this._spinnerRef.attach(new ComponentPortal(LoadingSpinnerComponent));
    this.loading.set(true);
  }

  public stopSpinner(): any{
    this.loading.set(false);
    return this._spinnerRef.hasAttached() ? this._spinnerRef.detach() : null;
  }
}
