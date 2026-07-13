import type { Booking, LiveStatus, Passenger, Station, Train, UtsTicket } from "./types";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || "Request failed");
  }
  return res.json();
}

export function fetchStations() {
  return request<Station[]>("/stations");
}

export function fetchTrains(from: string, to: string, date: string) {
  const params = new URLSearchParams({ from, to, date });
  return request<Train[]>(`/trains?${params.toString()}`);
}

export function fetchTrain(number: string) {
  return request<Train>(`/trains/${number}`);
}

export function createBooking(payload: {
  trainNumber: string;
  classCode: string;
  date: string;
  passengers: Passenger[];
  contact: { name: string; mobile: string };
}) {
  return request<Booking>("/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchPnr(pnr: string) {
  return request<Booking>(`/pnr/${pnr}`);
}

export function bookUtsTicket(payload: {
  fromStation: string;
  toStation: string;
  passengers: number;
  ticketType: "journey" | "platform";
}) {
  return request<UtsTicket>("/uts/book", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchLiveStatus(trainNumber: string) {
  return request<LiveStatus>(`/live/${trainNumber}`);
}
