import { Injectable } from '@angular/core';
import {BehaviorSubject, shareReplay, Subscription} from "rxjs";
import { Country, State, City }  from 'country-state-city';
import {first} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  countryRoutePath: String = 'countries';
  countries$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) {
    if(this.allCountries.length === 0)
      this.allCountries = this.getAllCountries();
  }

  get allCountries(): any {
    return this.countries$.value;
  }

  set allCountries(countries) {
    this.countries$.next(countries);
  }

  getAllCountries() {
    // return Country.getAllCountries();
    return this.http.get<{}>(API_URL + this.countryRoutePath)
      .pipe(shareReplay(), first())
      .subscribe((countries: any | undefined) => {
        this.countries$.next(countries);
      });
  }

  getCountryByCode(countryCode: any) {
    return Country.getCountryByCode(countryCode);
  }

  getAllStates() {
    return State.getAllStates();
  }

  getStatesOfCountry(countryCode: any) {
    return this.http.get<{}>(API_URL + this.countryRoutePath + '/' + countryCode + '/states')
  }

  getStateByCodeAndCountry(stateCode: any, countryCode: any) {
    return State.getStateByCodeAndCountry(stateCode, countryCode);
  }

  getAllCities() {
    return City.getAllCities();
  }

  getCitiesOfCountry(countryCode: any) {
    return City.getCitiesOfCountry(countryCode);
  }

  getCitiesOfState(countryCode: any, stateCode: any) {
    // return City.getCitiesOfState(countryCode, stateCode);
    return this.http.get<{}>(API_URL + this.countryRoutePath + '/' + countryCode + '/' + stateCode + '/cities')
  }

}
