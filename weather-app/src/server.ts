import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');
const openWeatherApiUrl = 'https://api.openweathermap.org/data/2.5';

const app = express();
const angularApp = new AngularNodeAppEngine();

function buildOpenWeatherUrl(query: string, apiKey: string): string {
  const isZipCode = /^\d+$/.test(query);
  const hasCountryCode = /^\d+,[a-zA-Z]{2}$/.test(query);
  const params = new URLSearchParams({ appid: apiKey, units: 'imperial' });

  if (hasCountryCode) {
    params.set('zip', query);
  } else if (isZipCode) {
    params.set('zip', `${query},us`);
  } else {
    params.set('q', query);
  }

  return `${openWeatherApiUrl}/weather?${params}`;
}

app.get('/api/weather', async (req, res) => {
  const apiKey = process.env['OPENWEATHER_API_KEY'];
  if (!apiKey) {
    res.status(503).json({ message: 'Weather API is not configured.' });
    return;
  }

  const q = typeof req.query['q'] === 'string' ? req.query['q'].trim() : '';
  if (q.length < 2) {
    res.status(400).json({ message: 'Invalid query.' });
    return;
  }

  try {
    const upstream = await fetch(buildOpenWeatherUrl(q, apiKey));
    const body = await upstream.json();
    res.status(upstream.status).json(body);
  } catch {
    res.status(502).json({ message: 'Failed to reach weather service.' });
  }
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`Server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
