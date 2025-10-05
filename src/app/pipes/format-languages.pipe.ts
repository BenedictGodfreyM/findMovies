import { Pipe, PipeTransform } from '@angular/core';
import { TMDBMovieLanguage } from '@/app/interfaces';

@Pipe({
  name: 'formatLanguages'
})
export class FormatLanguagesPipe implements PipeTransform {

  transform(value: Array<TMDBMovieLanguage>): string{
    let languages = "...";
    if(typeof value !== "undefined" && typeof value === "object" && typeof value.forEach === "function"){
      value.forEach((language, index, arr) => {
        (index === 0) ? languages = `${language.english_name}` : languages = `${languages}, ${language.english_name}`;
      });
    }
    return `${languages}`;
  }

}
