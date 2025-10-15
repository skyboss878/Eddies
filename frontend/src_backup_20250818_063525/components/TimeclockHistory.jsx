import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Download } from 'lucide-react';

const TimeclockHistory = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams(dateRange);
      const response = await fetch(`/api/timeclock/entries?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error('Error fetching timeclock entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [dateRange]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatHours = (hours) => {
    return hours ? `${hours.toFixed(2)}h` : 'In Progress';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Clock className="w-5 h-5 mr-2" />
          Timeclock History
        </h2>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start_date}
            onChange={(e) => setDateRange(prev => ({...prev, start_date: e.target.value}))}
            className="bg-gray-700 text-white px-3 py-2 rounded"
          />
          <input
            type="date"
            value={dateRange.end_date}
            onChange={(e) => setDateRange(prev => ({...prev, end_date: e.target.value}))}
            className="bg-gray-700 text-white px-3 py-2 rounded"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No timeclock entries found for this period</p>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-white font-medium">
                      {formatTime(entry.clock_in_time)}
                      {entry.clock_out_time && ` - ${formatTime(entry.clock_out_time)}`}
                    </div>
                    <div className="text-sm text-gray-400">
                      {entry.job_number && `Job: ${entry.job_number}`}
                      {entry.notes && ` | ${entry.notes}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{formatHours(entry.total_hours)}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      entry.status === 'clocked_out' ? 'bg-green-600' : 'bg-yellow-600'
                    }`}>
                      {entry.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default TimeclockHistory;
