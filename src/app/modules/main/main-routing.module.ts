import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { PageTitleService } from 'src/app/services';
import { MainComponent } from './main.component';
import { AboutComponent, HomeComponent, MoviesComponent, TvShowsComponent } from './pages';
import { AllMoviesComponent, TopRatedMoviesComponent, UpcomingMoviesComponent } from './pages/movies';
import { AiringTodayComponent, AllTvShowsComponent, OnTheAirComponent, TopRatedTvShowsComponent } from './pages/tv-shows';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'about',
        component: AboutComponent,
        title: 'About Us'
      },
      {
        path: 'movies',
        component: MoviesComponent,
        children: [
          {
            path: 'top-rated',
            component: TopRatedMoviesComponent,
            title: 'Top Rated Movies'
          },
          {
            path: 'upcoming',
            component: UpcomingMoviesComponent,
            title: 'Upcoming Movies'
          },
          {
            path: '',
            component: AllMoviesComponent,
            title: 'Movies'
          },
          { path: '**', redirectTo: '' }
        ]
      },
      {
        path: 'tv-shows',
        component: TvShowsComponent,
        children: [
          {
            path: 'airing-today',
            component: AiringTodayComponent,
            title: 'TV Shows Airing Today'
          },
          {
            path: 'on-the-air',
            component: OnTheAirComponent,
            title: 'On The Air TV Shows'
          },
          {
            path: 'top-rated',
            component: TopRatedTvShowsComponent,
            title: 'Top Rated TV Shows'
          },
          {
            path: '',
            component: AllTvShowsComponent,
            title: 'TV Shows'
          },
          { path: '**', redirectTo: '' }
        ]
      },
      {
        path: '',
        component: HomeComponent,
        title: 'Home'
      },
      { path: '**', redirectTo: '' }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: PageTitleService }]
})
export class MainRoutingModule { }
