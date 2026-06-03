import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

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
  private cache = new Map<string, { data: WeatherData; cachedAt: number }>();
  private readonly cacheDurationMs = 60 * 60 * 1000;

  constructor(private http: HttpClient) {}

  getWeather(query: string): Observable<WeatherData> {
    const cacheKey = query.trim().toLowerCase();
    const cached = this.cache.get(cacheKey);

    if (cached && cached.cachedAt > Date.now() - this.cacheDurationMs) {
      return of(cached.data);
    }

    return this.http
      .get<WeatherData>('/api/weather', { params: { q: query } })
      .pipe(tap((data) => this.cache.set(cacheKey, { data, cachedAt: Date.now() })));
  }
}
