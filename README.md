# Weather Superstars

A small weather lookup app built with Angular. Search by city name or zip code and see current conditions from the OpenWeatherMap API (Fahrenheit, imperial units).

## Features

- Search by city (`London`), city + country (`London,uk`), US zip (`11218`), or zip + country (`11218,us`)
- Current temp, feels-like, hi/lo, humidity, wind, gusts, pressure, cloud cover, visibility, sunrise/sunset
- In-memory cache (1 hour per query)
- SSR build served by Express in production; optional Docker image

## Quick start

```bash
cd weather-app
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

API settings live in `weather-app/src/environment/environment.ts`.

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
docker run -p 4000:4000 weather-app
```

## Project layout

```
weather-app/
  src/app/          UI (app component) + Weather service
  src/environment/  API URL and key
  src/server.ts     Express SSR server
  Dockerfile        Multi-stage production image
```
