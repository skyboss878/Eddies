// src/components/SearchSystem.jsx - FIXED VERSION
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2 } from 'lucide-react';
import { useData } from "../contexts/DataContext";
import { showError } from "../utils/toast";

// And replace showMessage calls with toast.error
// A global state hook for managing search modal visibility
export const useGlobalSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  return { isSearchOpen, openSearch, closeSearch };
};

// Search button component for the Navbar/Dashboard
export const SearchButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-lg"
    title="Global Search"
  >
    <Search className="h-5 w-5" />
  </button>
);

const SearchSystem = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { customers, vehicles, jobs } = useData();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);

  const handleSearch = useCallback(async (searchTerm) => {
    if (searchTerm.trim().length < 2) {
      setResults(null);
      return;
    }

    setLoading(true);
    try {
      // Search through local data instead of making API call
      const searchResults = {
        customers: [],
        vehicles: [],
        jobs: []
      };

      const searchLower = searchTerm.toLowerCase();

      // Search customers
      if (customers && Array.isArray(customers)) {
        searchResults.customers = customers.filter(customer => 
          customer.name?.toLowerCase().includes(searchLower) ||
          customer.phone?.includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchLower) ||
          customer.id?.toString().includes(searchTerm)
        ).slice(0, 5); // Limit to 5 results
      }

      // Search vehicles
      if (vehicles && Array.isArray(vehicles)) {
        searchResults.vehicles = vehicles.filter(vehicle => 
          vehicle.make?.toLowerCase().includes(searchLower) ||
          vehicle.model?.toLowerCase().includes(searchLower) ||
          vehicle.year?.toString().includes(searchTerm) ||
          vehicle.vin?.toLowerCase().includes(searchLower) ||
          vehicle.license_plate?.toLowerCase().includes(searchLower)
        ).slice(0, 5);
      }

      // Search jobs
      if (jobs && Array.isArray(jobs)) {
        searchResults.jobs = jobs.filter(job => 
          job.title?.toLowerCase().includes(searchLower) ||
          job.description?.toLowerCase().includes(searchLower) ||
          job.id?.toString().includes(searchTerm) ||
          job.status?.toLowerCase().includes(searchLower)
        ).slice(0, 5);
      }

      setResults(searchResults);
    } catch (error) {
      showMessage('Search failed. Please try again.', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [customers, vehicles, jobs]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  // Handle search on query change with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      handleSearch(query);
    }, 300); // Debounce search

    return () => {
      clearTimeout(handler);
    };
  }, [query, handleSearch]);

  // Auto-focus on open
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleResultClick = (path) => {
    onClose();
    navigate(path);
  };

  if (!isOpen) return null;

  const totalResults = results ? 
    (results.customers?.length || 0) + 
    (results.vehicles?.length || 0) + 
    (results.jobs?.length || 0) : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-xl mx-4 p-6 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-gray-800">Quick Search</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for customers, vehicles, jobs..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="text-center py-8 text-gray-500">
            <Loader2 className="h-6 w-6 animate-spin inline-block mr-2" />
            Searching...
          </div>
        )}

        {!loading && query.length >= 2 && totalResults === 0 && (
          <div className="text-center py-8 text-gray-500">
            No results found for "{query}".
          </div>
        )}

        {!loading && query.length < 2 && (
          <div className="text-center py-8 text-gray-500">
            Type at least 2 characters to search...
          </div>
        )}

        {!loading && results && totalResults > 0 && (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {results.customers?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                  Customers ({results.customers.length})
                </h4>
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200 border">
                  {results.customers.map(item => (
                    <li
                      key={item.id}
                      onClick={() => handleResultClick(`/customers`)}
                      className="p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        📞 {item.phone} • 📧 {item.email}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.vehicles?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                  Vehicles ({results.vehicles.length})
                </h4>
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200 border">
                  {results.vehicles.map(item => (
                    <li
                      key={item.id}
                      onClick={() => handleResultClick(`/vehicles`)}
                      className="p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <p className="font-medium text-gray-900">
                        {item.year} {item.make} {item.model}
                      </p>
                      <p className="text-sm text-gray-500">
                        🚗 {item.license_plate} • VIN: {item.vin}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {results.jobs?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-400 uppercase mb-2">
                  Jobs ({results.jobs.length})
                </h4>
                <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200 border">
                  {results.jobs.map(item => (
                    <li
                      key={item.id}
                      onClick={() => handleResultClick(`/jobs`)}
                      className="p-4 hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <p className="font-medium text-gray-900">
                        #{item.id} - {item.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        📋 {item.status} • {item.description?.substring(0, 50)}...
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 pt-4 border-t text-xs text-gray-400 text-center">
          💡 Tip: Use Escape to close, click results to navigate
        </div>
      </div>
    </div>
  );
};

export default SearchSystem;
