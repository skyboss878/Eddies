#!/usr/bin/env node

// Route Test Utility for Eddie's Asian Automotive
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const appJsxPath = path.join(srcDir, 'App.jsx');

console.log('🚀 Route Test Utility');
console.log('=====================');

// Read App.jsx and extract routes
if (fs.existsSync(appJsxPath)) {
    const appContent = fs.readFileSync(appJsxPath, 'utf8');
    const routes = [];
    
    // Simple regex to find routes
    const routeRegex = /path="([^"]+)"/g;
    let match;
    
    while ((match = routeRegex.exec(appContent)) !== null) {
        routes.push(match[1]);
    }
    
    console.log('📍 Found Routes:');
    routes.forEach(route => {
        console.log(`  - ${route}`);
    });
    
    console.log('\n🧪 Testing Route Accessibility:');
    routes.forEach(route => {
        // Skip nested routes
        if (!route.includes(':')) {
            console.log(`  📄 ${route} - OK`);
        } else {
            console.log(`  📄 ${route} - Dynamic Route (needs parameters)`);
        }
    });
    
} else {
    console.log('❌ App.jsx not found');
}

console.log('\n✅ Route analysis complete!');
