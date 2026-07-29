# open-football-sse

A lightweight SSE (Server-Sent Events) relay server for the Open Football Project platform. It polls a backend API for live match events and broadcasts the data in real-time to connected clients.

## How it works

1. Clients connect to `GET /events` and receive an SSE stream.
2. The server polls the configured backend API at a regular interval.
3. Each poll result is broadcast to all connected clients.

## Configuration

Set the following environment variables to override defaults:

| Variable          | Default                 | Description                                |
|-------------------|-------------------------|---------------------------------------------|
| `API_HOST`        | `http://localhost:8080` | Backend API URL to fetch events from         |
| `EVENTS_REFRESH`  | `40000`                 | Match events polling interval in milliseconds |
| `CHARTS_REFRESH`  | `180000`                | Live charts polling interval in milliseconds |

The server runs on port **5005**.

## Development

```bash
npm install
npm run dev       # run with ts-node
npm test          # run tests
```

## Production

```bash
npm run build     # compile TypeScript to dist/
npm start         # run compiled output
```

## Docker

```bash
docker build -t open-football-sse .
docker run -p 5005:5005 \
  -e API_HOST=http://your-api \
  open-football-sse
```
