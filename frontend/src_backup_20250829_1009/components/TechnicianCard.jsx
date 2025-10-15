// src/components/TechnicianCard.jsx - Updated for Dashboard
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  ClockIcon, 
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';
import api from "../utils/api";

const TechnicianCard = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTechnicians();
  }, []);

  const loadTechnicians = async () => {
    try {
      const response = await api.get('/users?role=technician&limit=5');
      setTechnicians(response.data.items || []);
    } catch (error) {
      // Fallback data
      setTechnicians([
        {
          id: 1,
          first_name: 'Mike',
          last_name: 'Johnson',
          email: 'mike@eddiesauto.com',
          status: 'working',
          current_job: 'Oil Change - Honda Civic',
          hours_today: 6.5,
          jobs_completed: 3
        },
        {
          id: 2,
          first_name: 'Sarah',
          last_name: 'Wilson',
          email: 'sarah@eddiesauto.com',
          status: 'available',
          current_job: null,
          hours_today: 4.0,
          jobs_completed: 2
        },
        {
          id: 3,
          first_name: 'Tom',
          last_name: 'Davis',
          email: 'tom@eddiesauto.com',
          status: 'on_break',
          current_job: 'Brake Service - Toyota Camry',
          hours_today: 5.5,
          jobs_completed: 2
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'working':
        return <WrenchScrewdriverIcon className="h-4 w-4 text-blue-500" />;
      case 'available':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'on_break':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      case 'offline':
        return <ExclamationCircleIcon className="h-4 w-4 text-red-500" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'working':
        return 'bg-blue-100 text-blue-800';
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on_break':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (technicians.length === 0) {
    return (
      <div className="text-center py-8">
        <UserIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No technicians found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {technicians.map((tech) => (
        <div key={tech.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {tech.first_name?.charAt(0)}{tech.last_name?.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  {tech.first_name} {tech.last_name}
                </h4>
                <div className="flex items-center text-xs text-gray-500 space-x-2 mt-1">
                  <span className="flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {tech.hours_today || 0}h today
                  </span>
                  <span>•</span>
                  <span>{tech.jobs_completed || 0} jobs</span>
                </div>
                {tech.current_job && (
                  <p className="text-xs text-gray-600 mt-1">{tech.current_job}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(tech.status)}`}>
                {getStatusIcon(tech.status)}
                <span className="ml-1 capitalize">{tech.status?.replace('_', ' ')}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
      
      <div className="text-center pt-4">
        <Link
          to="/employees"
          className="text-sm text-blue-600 hover:text-blue-500 font-medium"
        >
          View all technicians →
        </Link>
      </div>
    </div>
  );
};

export default TechnicianCard;
