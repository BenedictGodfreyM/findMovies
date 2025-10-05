import { Component, OnInit } from '@angular/core';
import { environment } from '@/environments/environment';
import { ScrollGovernor } from '@/app/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  public version: string = environment.version;
  public github: string = environment.github;
  public tmdb: string = environment.api.tmdb.site;
  public omdb: string = environment.api.omdb.site;
  public torrent: string = environment.api.torrent.github;

  ngOnInit(): void {
    ScrollGovernor.scrollToTop();
  }
}
