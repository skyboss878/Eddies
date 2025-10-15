// src/components/TimeClockWidget.jsx
import React, { useEffect, useState } from "react";
import TechnicianTimeClockCard from "./TechnicianTimeClockCard";
import TimeclockHistory from "./TimeclockHistory";
import TimeClockNavbar from "./TimeClockNavbar";

export default function TimeClockWidget() {
  const [status, setStatus] = useState({ clockedIn: false, since: null });
  const [history, setHistory] = useState([]);

  const refresh = async () => {
    try {
      const res = await fetch("/api/timeclock/me");
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
        setHistory(data.history || []);
      }
    } catch (e) {
      console.error("timeclock refresh error", e);
    }
  };

  const toggleClock = async () => {
    try {
      const res = await fetch(`/api/timeclock/${status.clockedIn ? "clockout" : "clockin"}`, { method: "POST" });
      if (res.ok) refresh();
    } catch (e) {
      console.error("timeclock toggle error", e);
    }
  };

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-4">
      {TimeClockNavbar ? <TimeClockNavbar /> : null}
      {TechnicianTimeClockCard ? (
        <TechnicianTimeClockCard status={status} onToggle={toggleClock} />
      ) : (
        <div className="p-4 border rounded bg-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{status.clockedIn ? "Clocked In" : "Clocked Out"}</div>
              {status.since && <div className="text-xs text-gray-500">Since {new Date(status.since).toLocaleString()}</div>}
            </div>
            <button
              onClick={toggleClock}
              className={`px-3 py-1 rounded text-white ${status.clockedIn ? "bg-red-600" : "bg-green-600"}`}
            >
              {status.clockedIn ? "Clock Out" : "Clock In"}
            </button>
          </div>
        </div>
      )}
      {TimeclockHistory ? <TimeclockHistory entries={history} /> : null}
    </div>
  );
}
