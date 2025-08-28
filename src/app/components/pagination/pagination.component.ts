import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { PaginationConfig } from '../../models';

@Component({
  selector: 'app-pagination',
  host: {class: 'col-12'},
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  private _config = signal<PaginationConfig>({
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
  });
  public isFirstPage = computed(() => this._config().currentPage === 1);
  public isLastPage = computed(() => this._config().currentPage === this._config().totalPages);
  public hasResults = computed(() => this._config().totalItems > 0);
  public pages = computed(() => {
    const config = this._config();
    if(config.totalPages <= 1) return [];
    const maxSize = 5; 
    if(config.totalPages <= maxSize){
      return Array.from({length: config.totalPages}, (_, i) => i + 1);
    }
    const halfMaxSize = Math.ceil(maxSize / 2);
    let startPage = Math.max(1, config.currentPage - halfMaxSize);
    let endPage = startPage + maxSize - 1;
    if(endPage > config.totalPages){
      endPage = config.totalPages;
      startPage = Math.max(1, endPage - maxSize + 1);
    }
    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  });
  public showPageNumbers: boolean = false;

  @Input() loading = false;
  @Input()
  set config(value: PaginationConfig){
    this._config.update(current => ({...current, ...value}));
  }

  get config(): PaginationConfig{
    return this._config();
  }

  @Output() pageChange = new EventEmitter<string>();

  constructor(){}

  public goToPage(event: Event, page: number): void{
    event.preventDefault();
    if(this.loading) return;
    if(page >= 1 && page <= this._config().totalPages && page !== this._config().currentPage){
      this.pageChange.emit(`${page}`);
    }
  }

  public goToFirst(event: Event): void{
    this.goToPage(event, 1);
  }

  public goToLast(event: Event): void{
    this.goToPage(event, this._config().totalPages);
  }

  public goToPrevious(event: Event): void{
    this.goToPage(event, this._config().currentPage - 1);
  }

  public goToNext(event: Event): void{
    this.goToPage(event, this._config().currentPage + 1);
  }
}
