import { ElementRef } from "@angular/core";

export class ScrollGovernor {

  static scrollToTop(): void{
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  static scrollToBottom(scrollContainer: ElementRef<HTMLElement>): void{
    scrollContainer.nativeElement.scroll({
      top: scrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
}
