// src/pages/NotFound.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            404
          </div>
          <div className="text-6xl mb-4">🔧</div>
        </div>

        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600">
            The page you're looking for seems to have taken a detour to the garage.
          </p>
          <p className="text-gray-500">
            Don't worry, even the best mechanics sometimes lose track of their tools!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Home
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Links
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <Link to="/services" className="text-blue-600 hover:text-blue-800 hover:underline">
              Services
            </Link>
            <Link to="/appointments" className="text-blue-600 hover:text-blue-800 hover:underline">
              Appointments
            </Link>
            <Link to="/customers" className="text-blue-600 hover:text-blue-800 hover:underline">
              Customers
            </Link>
            <Link to="/reports" className="text-blue-600 hover:text-blue-800 hover:underline">
              Reports
            </Link>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            Still can't find what you're looking for?{' '}
            <a href="#" className="font-medium underline hover:no-underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
