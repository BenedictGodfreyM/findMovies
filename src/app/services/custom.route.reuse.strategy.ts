import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, BaseRouteReuseStrategy } from "@angular/router";

@Injectable({
    providedIn: 'root'
})
export class CustomRouteReuseStrategy extends BaseRouteReuseStrategy {
    override shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        if(future.data["reuse"] && future.data["reuse"] === false){
            return false;
        }
        return super.shouldReuseRoute(future,curr);
    }
}
