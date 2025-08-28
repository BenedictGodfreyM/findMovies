import { RedirectCommand, ResolveFn, Router } from "@angular/router";
import { TMDBSeriesDetails } from "../models";
import { inject } from "@angular/core";
import { NavigationService, TmdbService } from "../services";
import { catchError, of } from "rxjs";

export const TMDBSeriesResolver: ResolveFn<TMDBSeriesDetails|RedirectCommand> = (route) => {
    const TMDBMovieStore = inject(TmdbService);
    const NavigationStore = inject(NavigationService);
    const router = inject(Router);
    const tmdb_id = parseInt(route.paramMap.get('tmdb_id') || '');

    return TMDBMovieStore.tv_show_details(tmdb_id).pipe(catchError(error => {
        console.error('Failed to load tv show details:', error);
        return of(new RedirectCommand(router.parseUrl(NavigationStore.getReturnURL() || '/')))
    }));
}