import { Pipe, PipeTransform } from '@angular/core';
import { TMDBMovieCountry } from '../models';

@Pipe({
  name: 'formatCountries'
})
export class FormatCountriesPipe implements PipeTransform {

  transform(value: Array<TMDBMovieCountry>): string{
    let countries = "...";
    if(typeof value !== "undefined" && typeof value === "object" && typeof value.forEach === "function"){
      value.forEach((country, index, arr) => {
        (index === 0) ? countries = `${country.name}` : countries = `${countries}, ${country.name}`;
      });
    }
    return `${countries}`;
  }

}
