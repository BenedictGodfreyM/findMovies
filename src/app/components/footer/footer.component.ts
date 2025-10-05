import { Component } from '@angular/core';
import { environment } from '@/environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'footer',
  host: {class: 'footer'},
  imports: [CommonModule,RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  public version: string = environment.version;
  public copyright: string = environment.copyright;
  public github: string = environment.github;
  public socials_github: string = environment.socials.github;
  public socials_linkedin: string = environment.socials.linkedin;
  public socials_twitter: string = environment.socials.twitter;
}
