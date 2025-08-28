import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-catalog-filter',
  host: {class: 'filter'},
  imports: [CommonModule],
  templateUrl: './catalog-filter.component.html',
  styleUrl: './catalog-filter.component.css'
})
export class CatalogFilterComponent {
  @Input() loading: boolean = false;
  @Input() media_type!: 'movie'|'tv_show';
}
