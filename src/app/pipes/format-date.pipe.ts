import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string, outputMode: string): string {
    let formatedDate = '...';
    if(typeof value !== "undefined" && value !== null && value !== ""){
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      let d = new Date(`${value}`);
      switch (outputMode) {
        case 'Year':
          formatedDate = `${d.getFullYear()}`;
          break;
        case 'Full':
          formatedDate = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
          break;
        default:
          break;
      }
    }
    return `${formatedDate}`;
  }

}
