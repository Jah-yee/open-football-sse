import express from "express";
import cors from "cors";
import { sseService } from "./service/SEEService";

const app = express();
app.use(cors());

const PORT = 5005;
const API_HOST = process.env.API_HOST ?? "http://localhost:8080";

const EVENTS_REFRESH = process.env.EVENTS_REFRESH ? Number(process.env.EVENTS_REFRESH) : 40000;
const CHARTS_REFRESH = process.env.CHARTS_REFRESH ? Number(process.env.CHARTS_REFRESH) : 180000;

function registerChannel(path: string, endpoint: string, refreshMs: number) {
  const { addNewClient, broadcast, fetchEvents } = sseService(endpoint);

  async function refresh() {
    try {
      const data = await fetchEvents();
      broadcast(data);
    } catch (err) {
      console.error("Spring API error", err);
    }
  }

  app.get(path, (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    addNewClient(req, res);
    refresh();
  });

  setInterval(refresh, refreshMs);
}

registerChannel("/events", `${API_HOST}/api/live/events`, EVENTS_REFRESH);
registerChannel("/events/charts", `${API_HOST}/api/charts/all`, CHARTS_REFRESH);
registerChannel("/events/charts/odds", `${API_HOST}/api/charts/odds/fixtures`, CHARTS_REFRESH);

app.listen(PORT, () => {
  console.log("SSE server running on port", PORT);
});
