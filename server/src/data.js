export const stations = [
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "BCT", name: "Mumbai Central", city: "Mumbai" },
  { code: "MAS", name: "Chennai Central", city: "Chennai" },
  { code: "HWH", name: "Howrah Jn", city: "Kolkata" },
  { code: "SBC", name: "Bengaluru City Jn", city: "Bengaluru" },
  { code: "SC", name: "Secunderabad Jn", city: "Hyderabad" },
  { code: "PUNE", name: "Pune Jn", city: "Pune" },
  { code: "ADI", name: "Ahmedabad Jn", city: "Ahmedabad" },
  { code: "JP", name: "Jaipur Jn", city: "Jaipur" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow" },
];

const classDefs = [
  { code: "SL", name: "Sleeper", baseFare: 1.0 },
  { code: "3A", name: "AC 3 Tier", baseFare: 2.6 },
  { code: "2A", name: "AC 2 Tier", baseFare: 3.8 },
  { code: "1A", name: "AC First Class", baseFare: 6.5 },
  { code: "CC", name: "AC Chair Car", baseFare: 2.1 },
];

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export const trains = [
  { number: "12951", name: "Mumbai Rajdhani", from: "NDLS", to: "BCT", departure: "16:25", arrival: "08:35", duration: "16h 10m", classes: ["1A", "2A", "3A"] },
  { number: "12301", name: "Howrah Rajdhani", from: "NDLS", to: "HWH", departure: "17:00", arrival: "10:05", duration: "17h 05m", classes: ["1A", "2A", "3A"] },
  { number: "12621", name: "Tamil Nadu Express", from: "NDLS", to: "MAS", departure: "22:30", arrival: "05:15", duration: "30h 45m", classes: ["SL", "3A", "2A"] },
  { number: "12723", name: "Telangana Express", from: "NDLS", to: "SC", departure: "23:05", arrival: "05:30", duration: "30h 25m", classes: ["SL", "3A", "2A"] },
  { number: "12627", name: "Karnataka Express", from: "NDLS", to: "SBC", departure: "20:40", arrival: "06:05", duration: "33h 25m", classes: ["SL", "3A", "2A"] },
  { number: "12925", name: "Paschim Express", from: "NDLS", to: "BCT", departure: "11:25", arrival: "13:15", duration: "25h 50m", classes: ["SL", "3A", "2A", "CC"] },
  { number: "12009", name: "Shatabdi Express", from: "NDLS", to: "PUNE", departure: "06:05", arrival: "22:30", duration: "16h 25m", classes: ["CC", "1A"] },
  { number: "12958", name: "Ajmer Rajdhani", from: "BCT", to: "JP", departure: "17:05", arrival: "07:30", duration: "14h 25m", classes: ["1A", "2A", "3A"] },
  { number: "12480", name: "Suryanagri Express", from: "ADI", to: "NDLS", departure: "07:15", arrival: "22:10", duration: "14h 55m", classes: ["SL", "3A", "2A"] },
  { number: "12229", name: "Lucknow Mail", from: "LKO", to: "BCT", departure: "21:40", arrival: "01:20", duration: "27h 40m", classes: ["SL", "3A", "2A"] },
];

export function searchTrains(from, to, date) {
  const dateKey = date ? date.split("-").reduce((a, b) => a + Number(b), 0) : 1;
  return trains
    .filter((t) => (!from || t.from === from) && (!to || t.to === to))
    .map((t) => {
      const rnd = seededRandom(Number(t.number) + dateKey);
      const classes = t.classes.map((code) => {
        const def = classDefs.find((c) => c.code === code);
        const availSeed = rnd();
        let status;
        let count;
        if (availSeed > 0.7) {
          count = Math.floor(rnd() * 120) + 20;
          status = "AVAILABLE";
        } else if (availSeed > 0.35) {
          count = Math.floor(rnd() * 15) + 1;
          status = "AVAILABLE";
        } else if (availSeed > 0.15) {
          count = Math.floor(rnd() * 40) + 1;
          status = "RAC";
        } else {
          count = Math.floor(rnd() * 60) + 1;
          status = "WAITLIST";
        }
        const fare = Math.round(def.baseFare * (300 + Number(t.number.slice(-2))) * (0.9 + rnd() * 0.3));
        return { code: def.code, name: def.name, fare, availability: count, status };
      });
      return { ...t, date: date || null, classes };
    });
}

export function getTrainByNumber(number) {
  return trains.find((t) => t.number === number);
}

const bookings = new Map();
let pnrCounter = 4267198000;

export function createBooking({ trainNumber, classCode, date, passengers, contact }) {
  const train = getTrainByNumber(trainNumber);
  pnrCounter += 1;
  const pnr = String(pnrCounter);
  const rnd = seededRandom(pnrCounter);
  const chartPrepared = rnd() > 0.5;
  const bookedPassengers = passengers.map((p, i) => {
    const statusSeed = rnd();
    let status;
    let seat;
    if (statusSeed > 0.3) {
      status = "CNF";
      const coach = ["S", "B", "A"][Math.floor(rnd() * 3)] + (Math.floor(rnd() * 8) + 1);
      seat = `${coach}/${Math.floor(rnd() * 72) + 1}`;
    } else if (statusSeed > 0.12) {
      status = `RAC ${Math.floor(rnd() * 20) + 1}`;
      seat = null;
    } else {
      status = `WL ${Math.floor(rnd() * 30) + 1}`;
      seat = null;
    }
    return { ...p, id: i + 1, status, seat };
  });
  const record = {
    pnr,
    trainNumber,
    trainName: train?.name || "Unknown",
    from: train?.from,
    to: train?.to,
    date,
    classCode,
    contact,
    passengers: bookedPassengers,
    chartPrepared,
    bookedAt: new Date().toISOString(),
  };
  bookings.set(pnr, record);
  return record;
}

export function getBooking(pnr) {
  return bookings.get(pnr);
}

const utsTickets = new Map();
let utsCounter = 900100;

export function createUtsTicket({ fromStation, toStation, passengers, ticketType }) {
  utsCounter += 1;
  const ticketId = `UTS${utsCounter}`;
  const fromIdx = stations.findIndex((s) => s.code === fromStation);
  const toIdx = stations.findIndex((s) => s.code === toStation);
  const distanceKm = Math.max(5, Math.abs((toIdx - fromIdx) * 47 + 12));
  const farePerPassenger = ticketType === "platform" ? 10 : Math.round(distanceKm * 0.35) + 15;
  const ticket = {
    ticketId,
    fromStation,
    toStation,
    ticketType,
    passengers,
    distanceKm,
    farePerPassenger,
    totalFare: farePerPassenger * passengers,
    issuedAt: new Date().toISOString(),
    validMinutes: ticketType === "platform" ? 120 : Math.max(60, distanceKm * 3),
  };
  utsTickets.set(ticketId, ticket);
  return ticket;
}

export function getUtsTicket(ticketId) {
  return utsTickets.get(ticketId);
}

export function getLiveStatus(trainNumber) {
  const train = getTrainByNumber(trainNumber);
  if (!train) return null;
  const rnd = seededRandom(Number(trainNumber) + new Date().getHours());
  const routeStations = [
    stations.find((s) => s.code === train.from),
    ...stations.filter((s) => s.code !== train.from && s.code !== train.to).slice(0, 4),
    stations.find((s) => s.code === train.to),
  ].filter(Boolean);
  const delayMinutes = Math.floor(rnd() * 45);
  const currentIndex = Math.min(routeStations.length - 1, Math.floor(rnd() * routeStations.length));
  const route = routeStations.map((s, i) => ({
    code: s.code,
    name: s.name,
    distanceKm: i * (80 + Math.floor(rnd() * 60)),
    scheduledTime: `${String((5 + i * 3) % 24).padStart(2, "0")}:${String(Math.floor(rnd() * 6) * 10).padStart(2, "0")}`,
    status: i < currentIndex ? "DEPARTED" : i === currentIndex ? "CURRENT" : "UPCOMING",
    platform: i === currentIndex ? Math.floor(rnd() * 8) + 1 : null,
  }));
  return {
    trainNumber,
    trainName: train.name,
    delayMinutes,
    lastUpdated: new Date().toISOString(),
    currentStationCode: route[currentIndex]?.code,
    route,
  };
}
