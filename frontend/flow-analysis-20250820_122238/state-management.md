# State Management Analysis
Generated on: Wed Aug 20 12:22:38 PDT 2025

## useState Hooks
- ./frontend/src/components/ui/PhotoCapture.tsx:1:import React, { useRef, useState } from 'react';
- ./frontend/src/components/ui/PhotoCapture.tsx:14:  const [photos, setPhotos] = useState<string[]>([]);
- ./frontend/src/components/ui/PhotoCapture.tsx:15:  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
- ./frontend/src/components/mobile/MobileTechApp.tsx:1:import React, { useState, useEffect } from 'react';
- ./frontend/src/components/mobile/MobileTechApp.tsx:23:  const [activeJob, setActiveJob] = useState<any>(null);
- ./frontend/src/components/mobile/MobileTechApp.tsx:24:  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
- ./frontend/src/components/mobile/MobileTechApp.tsx:25:  const [isPhotoMode, setIsPhotoMode] = useState(false);
- ./frontend/src/components/mobile/MobileTechApp.tsx:26:  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null);
- ./frontend/src/components/mobile/MobileTechApp.tsx:27:  const [currentTime, setCurrentTime] = useState(new Date());
- ./frontend/src/components/mobile/JobCard.tsx:1:import React, { useState } from 'react';
- ./frontend/src/components/mobile/JobCard.tsx:24:  const [notes, setNotes] = useState('');
- ./frontend/src/components/mobile/JobCard.tsx:25:  const [photos, setPhotos] = useState<File[]>([]);
- ./frontend/src/components/mobile/TimeTracker.tsx:1:import React, { useState, useEffect } from 'react';
- ./frontend/src/components/mobile/TimeTracker.tsx:12:  const [isRunning, setIsRunning] = useState(true);
- ./frontend/src/components/mobile/TimeTracker.tsx:13:  const [elapsed, setElapsed] = useState(0);
- ./frontend/src/components/mobile/TimeTracker.tsx:14:  const [startTime] = useState(Date.now());
- ./frontend/src/components/diagnostics/VehicleDiagnostics.tsx:1:import React, { useState, useEffect } from 'react';
- ./frontend/src/components/diagnostics/VehicleDiagnostics.tsx:25:  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
- ./frontend/src/components/diagnostics/VehicleDiagnostics.tsx:26:  const [isScanning, setIsScanning] = useState(false);
- ./frontend/src/components/diagnostics/VehicleDiagnostics.tsx:27:  const [liveDataEnabled, setLiveDataEnabled] = useState(false);
- ./frontend/src/components/diagnostics/VehicleDiagnostics.tsx:28:  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
- ./frontend/src/components/auth/LoginPage.tsx:1:import React, { useState } from 'react';
- ./frontend/src/components/auth/LoginPage.tsx:19:  const [showPassword, setShowPassword] = useState(false);
- ./frontend/src/components/layout/DashboardLayout.tsx:1:import React, { useState } from 'react';
- ./frontend/src/components/layout/DashboardLayout.tsx:22:  const [sidebarOpen, setSidebarOpen] = useState(false);
- ./frontend/src/components/layout/DashboardLayout.tsx:23:  const [userMenuOpen, setUserMenuOpen] = useState(false);

## useEffect Hooks
- ./frontend/src/components/ui/QRScanner.tsx:1:import React, { useEffect, useRef } from 'react';
- ./frontend/src/components/ui/QRScanner.tsx:14:  useEffect(() => {
- ./frontend/src/components/ui/PhotoCapture.tsx:30:  React.useEffect(() => {
- ./frontend/src/components/mobile/MobileTechApp.tsx:1:import React, { useState, useEffect } from 'react';
- ./frontend/src/components/mobile/MobileTechApp.tsx:30:  useEffect(() => {
- ./frontend/src/components/mobile/MobileTechApp.tsx:48:  useEffect(() => {
- ./frontend/src/components/mobile/TimeTracker.tsx:1:import React, { useState, useEffect } from 'react';
- ./frontend/src/components/mobile/TimeTracker.tsx:16:  useEffect(() => {
- ./frontend/src/components/diagnostics/VehicleDiagnostics.tsx:1:import React, { useState, useEffect } from 'react';
- ./frontend/src/App.tsx:1:import React, { Suspense, useEffect } from 'react';
- ./frontend/src/App.tsx:43:  useEffect(() => {

## Context Usage
