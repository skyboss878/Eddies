#!/bin/bash

echo "🗑️  Removing placeholder files and keeping your original full components..."

# Remove the placeholder files I created
rm -f src/pages/VehicleDetails.jsx
rm -f src/pages/JobDetails.jsx
rm -f src/pages/AddJob.jsx
rm -f src/pages/EstimateDetails.jsx
rm -f src/pages/AddEstimate.jsx
rm -f src/pages/InvoiceDetails.jsx
rm -f src/pages/CreateInvoice.jsx
rm -f src/pages/PartDetails.jsx
rm -f src/pages/AddPart.jsx
rm -f src/pages/Analytics.jsx
rm -f src/pages/Profile.jsx
rm -f src/pages/Appointments.jsx
rm -f src/pages/Schedule.jsx
rm -f src/pages/Backup.jsx

# Remove any swap files
rm -f src/pages/.*.swp
rm -f src/pages/.*.tmp
rm -f src/pages/*~

echo "✅ Placeholder files removed!"
echo ""
echo "📋 Your remaining ORIGINAL full components:"
ls src/pages/ | grep -v backup | sort

echo ""
echo "🎉 Clean! Only your full working components remain."
