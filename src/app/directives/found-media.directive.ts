import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TMDBMovies,TMDBTVShows } from '../models';

@Directive({
  selector: '[appFoundMedia]'
})
export class FoundMediaDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) { }

  @Input() set appFoundMedia(media: TMDBMovies|TMDBTVShows){
    if(!this.foundMedia(media)){
      this.viewContainer.createEmbeddedView(this.templateRef);
    }else{
      this.viewContainer.clear();
    }
  }

  private foundMedia(media: TMDBMovies | TMDBTVShows): boolean{
    return (typeof media.results !== "undefined" && media.results.length > 0);
  }
}
