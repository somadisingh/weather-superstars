import { Component, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
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
  query = '';
  weatherData = signal<WeatherData | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(private weather: Weather) {}

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
    if (event.key === 'Enter' && !this.isLoading()) {
      this.onSearch();
    }
  }

  onSearch(): void {
    if (!this.isValidQuery()) {
      this.errorMessage.set('Please enter a city name or zip code.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.weatherData.set(null);

    this.weather.getWeather(this.query.trim()).subscribe({
      next: (data) => {
        this.weatherData.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(
          err.status === 404
            ? 'Location not found. Please check your input and try again.'
            : 'Something went wrong. Please try again later.',
        );
        this.isLoading.set(false);
      },
    });
  }
}
