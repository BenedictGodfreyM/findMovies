import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent {
  public version: string = environment.version;
  public github: string = environment.github;
  public tmdb: string = environment.api.tmdb.site;
  public omdb: string = environment.api.omdb.site;
  public torrent: string = environment.api.torrent.github;
}
