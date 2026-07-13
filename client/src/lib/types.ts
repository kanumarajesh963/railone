export interface Station {
  code: string;
  name: string;
  city: string;
}

export interface TrainClass {
  code: string;
  name: string;
  fare: number;
  availability: number;
  status: "AVAILABLE" | "RAC" | "WAITLIST";
}

export interface Train {
  number: string;
  name: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  date: string | null;
  classes: TrainClass[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: string;
}

export interface BookedPassenger extends Passenger {
  id: number;
  status: string;
  seat: string | null;
}

export interface Booking {
  pnr: string;
  trainNumber: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  classCode: string;
  contact: { name: string; mobile: string };
  passengers: BookedPassenger[];
  chartPrepared: boolean;
  bookedAt: string;
}

export interface UtsTicket {
  ticketId: string;
  fromStation: string;
  toStation: string;
  ticketType: "journey" | "platform";
  passengers: number;
  distanceKm: number;
  farePerPassenger: number;
  totalFare: number;
  issuedAt: string;
  validMinutes: number;
}

export interface RouteStop {
  code: string;
  name: string;
  distanceKm: number;
  scheduledTime: string;
  status: "DEPARTED" | "CURRENT" | "UPCOMING";
  platform: number | null;
}

export interface LiveStatus {
  trainNumber: string;
  trainName: string;
  delayMinutes: number;
  lastUpdated: string;
  currentStationCode: string;
  route: RouteStop[];
}
