import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appRemoveIfEmptyString]'
})
export class RemoveIfEmptyString implements OnChanges {
  public originalDisplayStyle: string = '';

  @Input('appRemoveIfEmptyString') textValue: string = '';
  @Input() removeOnWhiteSpace: boolean = true;

  constructor(private el: ElementRef) {
    this.originalDisplayStyle = this.el.nativeElement.style.display || '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['textValue']){
      this.updateVisibility();
    }
  }

  private updateVisibility(): void{
    const isEmpty = this.isStringEmpty(this.textValue);
    if(isEmpty){
      this.el.nativeElement.style.display = 'none';
    }else{
      this.el.nativeElement.style.display = this.originalDisplayStyle;
    }
  }

  private isStringEmpty(value: string): boolean{
    if(value === null || value === undefined) return true;
    if(this.removeOnWhiteSpace) return (value.trim().length === 0);
    return (value.length === 0);
  }
}
