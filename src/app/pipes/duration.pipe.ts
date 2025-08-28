import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  transform(value: string | number | null): string {
    var num = parseInt(`${value}`);
    if(num > 60){
      var hours = (num / 60);
      var rhours = Math.floor(hours);
      var minutes = (hours - rhours) * 60;
      var rminutes = Math.round(minutes);
      if(rminutes > 0){
        return `${rhours}h ${rminutes}min`;
      }else{
        return `${rhours}hrs`;
      }
    }else{
      return `${value}min`;
    }
  }

}
