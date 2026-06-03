# Weather Superstars

A small weather lookup app built with Angular. Search by city name or zip code and see current conditions from the OpenWeatherMap API (Fahrenheit, imperial units). Please note that the API key in the commit history has been rotated.

## Features

- Search by city (`London`), city + country (`London,uk`), US zip (`11218`), or zip + country (`11218,us`)
- Current temp, feels-like, hi/lo, humidity, wind, gusts, pressure, cloud cover, visibility, sunrise/sunset
- In-memory cache (1 hour per query)
- SSR build served by Express in production; optional Docker image

## Quick start

```bash
cd weather-app
npm install
ng serve
```

Open [live deployed app](https://soma--weather-superstars--sq6b4k4646b5.code.run).

Set your OpenWeatherMap key (server-side only; never bundled in the client):

```bash
export OPENWEATHER_API_KEY=your_key_here
```

## Other commands

| Command | Description |
| --- | --- |
| `npm run build` | Production build (browser + SSR server) |
| `npm run serve:ssr:weather-app` | Run built app (default port 4000) |
| `npm test` | Unit tests (Vitest) |

## Docker

From `weather-app`:

```bash
docker build -t weather-app .
docker run -p 4000:4000 -e OPENWEATHER_API_KEY=your_key_here weather-app
```

## Project layout

```
weather-app/
  src/app/       UI + Weather service (calls `/api/weather`)
  src/server.ts  Express SSR + API proxy
  Dockerfile     Production image
```
