echo "=== Testing the Correct Admin Credentials ==="

# Test the credentials from app.py (most likely the correct one)
echo "1. Testing admin@eddiesauto.com / admin123:"
response1=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eddiesauto.com","password":"admin123"}' \
  -w "HTTPSTATUS:%{http_code}")

echo "Response: ${response1%HTTPSTATUS:*}"
echo "Status Code: ${response1##*HTTPSTATUS:}"
echo

# Test the credentials from create_user.py
echo "2. Testing admin@example.com / admin_password:"
response2=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin_password"}' \
  -w "HTTPSTATUS:%{http_code}")

echo "Response: ${response2%HTTPSTATUS:*}"
echo "Status Code: ${response2##*HTTPSTATUS:}"
echo

# If the first one works, show success message
if [[ "${response1##*HTTPSTATUS:}" == "200" ]]; then
    echo "🎉 SUCCESS! Use these credentials in your frontend:"
    echo "   Email: admin@eddiesauto.com"
    echo "   Password: admin123"
elif [[ "${response2##*HTTPSTATUS:}" == "200" ]]; then
    echo "🎉 SUCCESS! Use these credentials in your frontend:"
    echo "   Email: admin@example.com"
    echo "   Password: admin_password"
else
    echo "❌ Neither credential set worked. There might be an issue with the backend."
fi
