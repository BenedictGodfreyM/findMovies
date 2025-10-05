import { RedirectCommand, ResolveFn, Router } from "@angular/router";
import { TMDBMovieDetails } from "@/app/interfaces";
import { inject } from "@angular/core";
import { NavigationService, TmdbService, UiLoaderService } from "@/app/services";
import { catchError, finalize, of } from "rxjs";

export const TMDBMovieResolver: ResolveFn<TMDBMovieDetails|RedirectCommand> = (route) => {
    const TMDBMovieStore = inject(TmdbService);
    const NavigationStore = inject(NavigationService);
    const UILoader = inject(UiLoaderService);
    const router = inject(Router);
    const tmdb_id = parseInt(route.paramMap.get('tmdb_id') || '');

    UILoader.showSpinner();
    return TMDBMovieStore.movie_details(tmdb_id).pipe(finalize(() => UILoader.stopSpinner()),catchError(error => {
        console.error('Failed to load movie details:', error);
        return of(new RedirectCommand(router.parseUrl(NavigationStore.getReturnURL() || '/')))
    }));
}