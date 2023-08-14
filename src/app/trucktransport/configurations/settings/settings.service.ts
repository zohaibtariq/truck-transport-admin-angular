import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BehaviorSubject, Subscription, shareReplay} from "rxjs";
import {first} from "rxjs/operators";

const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient){ }

  getSettings(): Subscription {
    let api_url = API_USERS_URL+'settings';
    return this.http.get<any[]>(api_url)
      .pipe(shareReplay(), first())
      .subscribe((settings: any | undefined) => {
        this.settings$.next(settings);
      });
  }

  updateSettings(settings: any): Observable<any> {
    let url = API_USERS_URL+'settings';
    return this.http.post<any[]>(url, {...settings});
  }

}
