import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import PageTransition from "./components/PageTransition";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import Booking from "./pages/Booking";
import Confirmation from "./pages/Confirmation";
import PnrStatus from "./pages/PnrStatus";
import UtsBooking from "./pages/UtsBooking";
import LiveStatus from "./pages/LiveStatus";

export default function App() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <PageTransition>
                  <Home />
                </PageTransition>
              }
            />
            <Route
              path="/search"
              element={
                <PageTransition>
                  <SearchResults />
                </PageTransition>
              }
            />
            <Route
              path="/booking"
              element={
                <PageTransition>
                  <Booking />
                </PageTransition>
              }
            />
            <Route
              path="/confirmation/:pnr"
              element={
                <PageTransition>
                  <Confirmation />
                </PageTransition>
              }
            />
            <Route
              path="/pnr"
              element={
                <PageTransition>
                  <PnrStatus />
                </PageTransition>
              }
            />
            <Route
              path="/uts"
              element={
                <PageTransition>
                  <UtsBooking />
                </PageTransition>
              }
            />
            <Route
              path="/live"
              element={
                <PageTransition>
                  <LiveStatus />
                </PageTransition>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <footer className="border-t border-gray-200 bg-white py-4 text-center text-xs text-gray-400">
        RailOne — demo platform combining reserved booking, UTS unreserved ticketing &amp; live status. Not affiliated with Indian Railways/IRCTC.
      </footer>
    </div>
  );
}
