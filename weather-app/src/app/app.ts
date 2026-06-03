import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Weather, WeatherData } from './weather';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, DecimalPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  query: string = '';
  weatherData: WeatherData | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private weather: Weather, private cdr: ChangeDetectorRef) {}

  isValidQuery(): boolean {
    return this.query.trim().length >= 2;
  }

  getIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }

  getWindDirection(deg: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
  }

  formatTime(unix: number): string {
    return new Date(unix * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getVisibilityMiles(visibility: number): string {
    return (visibility / 1609).toFixed(1);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  onSearch(): void {
    if (!this.isValidQuery()) {
      this.errorMessage = 'Please enter a city name or zip code.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.weatherData = null;

    this.weather.getWeather(this.query.trim()).subscribe({
      next: (data: WeatherData) => {
        this.weatherData = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        if (err.status === 404) {
          this.errorMessage = 'Location not found. Please check your input and try again.';
        } else {
          this.errorMessage = 'Something went wrong. Please try again later.';
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}