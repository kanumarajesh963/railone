import express from "express";
import cors from "cors";
import {
  stations,
  searchTrains,
  getTrainByNumber,
  createBooking,
  getBooking,
  createUtsTicket,
  getUtsTicket,
  getLiveStatus,
} from "./data.js";

const app = express();
const allowedOrigin = process.env.CLIENT_ORIGIN || "*";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "RailOne API" });
});

app.get("/api/stations", (req, res) => {
  res.json(stations);
});

app.get("/api/trains", (req, res) => {
  const { from, to, date } = req.query;
  res.json(searchTrains(from, to, date));
});

app.get("/api/trains/:number", (req, res) => {
  const train = getTrainByNumber(req.params.number);
  if (!train) return res.status(404).json({ error: "Train not found" });
  res.json(train);
});

app.post("/api/bookings", (req, res) => {
  const { trainNumber, classCode, date, passengers, contact } = req.body;
  if (!trainNumber || !classCode || !date || !passengers?.length) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }
  const booking = createBooking({ trainNumber, classCode, date, passengers, contact });
  res.status(201).json(booking);
});

app.get("/api/pnr/:pnr", (req, res) => {
  const booking = getBooking(req.params.pnr);
  if (!booking) return res.status(404).json({ error: "PNR not found" });
  res.json(booking);
});

app.post("/api/uts/book", (req, res) => {
  const { fromStation, toStation, passengers, ticketType } = req.body;
  if (!fromStation || !passengers) {
    return res.status(400).json({ error: "Missing required UTS fields" });
  }
  const ticket = createUtsTicket({
    fromStation,
    toStation: toStation || fromStation,
    passengers,
    ticketType: ticketType || "journey",
  });
  res.status(201).json(ticket);
});

app.get("/api/uts/:ticketId", (req, res) => {
  const ticket = getUtsTicket(req.params.ticketId);
  if (!ticket) return res.status(404).json({ error: "Ticket not found" });
  res.json(ticket);
});

app.get("/api/live/:trainNumber", (req, res) => {
  const status = getLiveStatus(req.params.trainNumber);
  if (!status) return res.status(404).json({ error: "Train not found" });
  res.json(status);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Railway API server running on http://localhost:${PORT}`);
});
