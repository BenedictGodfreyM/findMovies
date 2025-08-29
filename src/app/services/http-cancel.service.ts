import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpCancelService {
  private pendingHttpRequestsSubject: Subject<void> = new Subject<void>();

  constructor() { }

  // Cancel Pending HTTP Calls
  public cancelPendingRequests(): void {
    this.pendingHttpRequestsSubject.next();
  }

  public onCancelPendingRequests(){
    return this.pendingHttpRequestsSubject.asObservable()
  }
}
