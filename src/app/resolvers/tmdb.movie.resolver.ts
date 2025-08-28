import { RedirectCommand, ResolveFn, Router } from "@angular/router";
import { TMDBMovieDetails } from "../models";
import { inject } from "@angular/core";
import { NavigationService, TmdbService } from "../services";
import { catchError, of } from "rxjs";

export const TMDBMovieResolver: ResolveFn<TMDBMovieDetails|RedirectCommand> = (route) => {
    const TMDBMovieStore = inject(TmdbService);
    const NavigationStore = inject(NavigationService);
    const router = inject(Router);
    const tmdb_id = parseInt(route.paramMap.get('tmdb_id') || '');

    return TMDBMovieStore.movie_details(tmdb_id).pipe(catchError(error => {
        console.error('Failed to load movie details:', error);
        return of(new RedirectCommand(router.parseUrl(NavigationStore.getReturnURL() || '/')))
    }));
}