// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  UserGroupIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";

import Navbar from "../components/Navbar";
import CompleteNavigationMenu from "../components/CompleteNavigationMenu";
import SmartBreadcrumb from "../components/SmartBreadcrumb";
import GlobalToastDisplay from "../components/GlobalToastDisplay";
import RealTimeNotifications from "../components/RealTimeNotifications";

import DashboardCard from "../components/DashboardCard";
import AppointmentCard from "../components/AppointmentCard";
import JobCard from "../components/JobCard";
import TechnicianCard from "../components/TechnicianCard";
import TimeClockWidget from "../components/TimeClockWidget";

import AIEstimateModal from "../components/AIEstimateModal";
import AIDiagnosticHelper from "../components/AIDiagnosticHelper";
import QuickActionButton from "../components/QuickActionButton";

import { useSettings } from "../contexts/SettingsContext";

const StatCard = ({ title, value, icon: Icon, color, link }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
    {link && (
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <Link to={link} className="font-medium text-cyan-700 hover:text-cyan-900">
            View all
          </Link>
        </div>
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const { settings } = useSettings(); // live rates/markup/tax for any widgets that need them
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customers: 0,
    vehicles: 0,
    activeJobs: 0,
    pendingAppointments: 0,
    monthlyRevenue: 0,
    completedJobs: 0
  });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    // Replace with your API calls
    (async () => {
      try {
        // Example: const res = await fetch('/api/dashboard');
        // const data = await res.json();
        setStats({
          customers: 247,
          vehicles: 389,
          activeJobs: 12,
          pendingAppointments: 8,
          monthlyRevenue: 45250.0,
          completedJobs: 156
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex">
        <aside className="hidden lg:block w-64 bg-white border-r">
          <CompleteNavigationMenu />
        </aside>
        <main className="flex-1 p-6 space-y-6">
          <SmartBreadcrumb />

          {/* Welcome Header */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back{settings.shopName ? ` to ${settings.shopName}` : ""}! 👋
                </h1>
                <p className="text-gray-600">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center text-lg font-semibold text-gray-900">
                  <ClockIcon className="h-5 w-5 mr-2" />
                  {currentTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </div>
                {settings.shopName && <p className="text-sm text-gray-500">{settings.shopName}</p>}
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Customers" value={stats.customers} icon={UserGroupIcon} color="text-blue-500" link="/customers" />
            <StatCard title="Total Vehicles" value={stats.vehicles} icon={TruckIcon} color="text-green-500" link="/vehicles" />
            <StatCard title="Active Jobs" value={stats.activeJobs} icon={WrenchScrewdriverIcon} color="text-yellow-500" link="/jobs" />
            <StatCard title="Pending Appointments" value={stats.pendingAppointments} icon={CalendarDaysIcon} color="text-purple-500" link="/appointments" />
          </div>

          {/* Revenue / Performance */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
                  <p className="text-2xl font-bold text-green-600">${stats.monthlyRevenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Jobs Completed</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.completedJobs}</p>
                  <p className="text-sm text-gray-500">This month</p>
                </div>
              </div>
            </div>

              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Time Clock</h3>
                <TimeClockWidget />
              </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <DashboardCard title="Jobs">
              <JobCard />
            </DashboardCard>
            <DashboardCard title="Appointments">
              <AppointmentCard />
            </DashboardCard>
            <DashboardCard title="Technicians">
              <TechnicianCard />
            </DashboardCard>
          </div>

          {/* Quick Actions */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3">
            <QuickActionButton label="Create Estimate" to="/estimates/create" />
            <QuickActionButton label="New Job" to="/jobs/create" />
            <QuickActionButton label="Add Customer" to="/customers/add" />
          </div>
        </main>
      </div>

      {/* AI Modals / System */}
      <AIEstimateModal />
      <AIDiagnosticHelper />
      <GlobalToastDisplay />
      <RealTimeNotifications />
    </div>
  );
}
