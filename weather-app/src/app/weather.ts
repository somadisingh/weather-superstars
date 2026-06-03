import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../environment/environment';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  clouds: {
    all: number;
  };
  visibility: number;
}

@Injectable({
  providedIn: 'root',
})
export class Weather {
  private cache: { [zip: string]: { data: WeatherData, cachedAt: number } } = {};
  private readonly cacheDuration = 1000 * 60 * 60; // weather data is valid for 1 hour

  constructor (private http: HttpClient) {}

  getWeather(query: string): Observable<WeatherData> {

    const cacheKey = query.trim().toLowerCase();


    if (this.cache[cacheKey] && this.cache[cacheKey].cachedAt > Date.now() - this.cacheDuration) {
      console.log('Cache hit for query:', cacheKey);
      return of(this.cache[cacheKey].data);
    }

    return this.http.get<WeatherData>(`${environment.apiUrl}/weather`, { params: { q: query } }).pipe(
      tap((data) => {
        this.cache[cacheKey] = { data, cachedAt: Date.now() };
      }),
      catchError((error) => {
        console.error('Error fetching weather data for query:', query, error);
        return throwError(() => error);
      })
    );
  }
}
