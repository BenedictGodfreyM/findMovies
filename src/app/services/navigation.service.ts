import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor() { }

  public setReturnURL(url: string): void{
    localStorage.setItem('returnURL', url);
  }

  public getReturnURL(): string | null{
    return localStorage.getItem('returnURL');
  }

  public clearURLCache(): void{
    localStorage.removeItem('returnURL');
  }
}
