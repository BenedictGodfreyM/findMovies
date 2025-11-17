import { Routes } from '@angular/router';
import { AboutUsComponent, HomeComponent, MovieDetailsComponent, MoviesComponent, PageNotFoundComponent, SearchComponent, TvshowDetailsComponent, TvshowsComponent } from '@/app/pages';
import { TMDBMovieResolver, TMDBSeriesResolver } from '@/app/resolvers';

export const routes: Routes = [
  {
    path: 'about-us',
    component: AboutUsComponent,
    title: 'About Us'
  },
  {
    path: 'movies/:tmdb_id',
    component: MovieDetailsComponent,
    resolve: {movie_details: TMDBMovieResolver},
    data: {reuse: false}
  },
  {
    path: 'movies',
    component: MoviesComponent,
    title: 'Movies'
  },
  {
    path: 'search',
    component: SearchComponent,
    title: 'Search'
  },
  {
    path: 'tv-shows/:tmdb_id',
    component: TvshowDetailsComponent,
    resolve: {tv_show_details: TMDBSeriesResolver},
    data: {reuse: false}
  },
  {
    path: 'tv-shows',
    component: TvshowsComponent,
    title: 'TV Shows'
  },
  {
    path: '',
    component: HomeComponent,
    title: 'Home'
  },
  {
    path: '**',
    component: PageNotFoundComponent,
    title: 'Page Not Found'
  },
];
