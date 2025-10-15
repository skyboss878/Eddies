#!/usr/bin/env bash
# =========================================================
# Eddie's "Million Dollar Experience" Bootstrapper
# - Fixes imports
# - Drops in a robust api.js with ALL named services
# - Ensures .env for Vite
# - Starts frontend (and backend if detected) in tmux
# =========================================================
set -euo pipefail

ROOT="${HOME}/eddies-askan-automotive"
FRONTEND="${ROOT}/frontend"
BACKEND="${ROOT}/backend"            # optional; detected automatically
SESSION="eddies-stack"
VITE_PORT="${VITE_PORT:-3002}"
API_URL_DEFAULT="http://localhost:5000/api"

say()   { printf "\033[0;34m[INFO]\033[0m %s\n" "$*"; }
ok()    { printf "\033[0;32m[ OK ]\033[0m %s\n" "$*"; }
warn()  { printf "\033[1;33m[WARN]\033[0m %s\n" "$*"; }
err()   { printf "\033[0;31m[ERR ]\033[0m %s\n" "$*" >&2; }

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    warn "Missing '$1' — attempting to install (Termux/apt)…"
    if command -v pkg >/dev/null 2>&1; then
      pkg update -y && pkg install -y "$2"
    elif command -v apt-get >/dev/null 2>&1; then
      sudo apt-get update && sudo apt-get install -y "$2"
    else
      err "Couldn't auto-install '$1'. Please install it and re-run."
      exit 1
    fi
  fi
  ok "Found $1"
}

# --- sanity checks
[ -d "$FRONTEND" ] || { err "Frontend not found at $FRONTEND"; exit 1; }

say "Ensuring required tooling…"
need node nodejs
need npm npm
need tmux tmux

# --- FRONTEND SETUP ----------------------------------------------------------
say "Preparing frontend… ($FRONTEND)"
cd "$FRONTEND"

# 1) Ensure .env with API URL for Vite
if [ ! -f ".env" ]; then
  cat > .env <<EOF
VITE_API_URL=${API_URL_DEFAULT}
EOF
  ok "Created frontend/.env with VITE_API_URL=${API_URL_DEFAULT}"
else
  if ! grep -q '^VITE_API_URL=' .env; then
    echo "VITE_API_URL=${API_URL_DEFAULT}" >> .env
    ok "Appended VITE_API_URL=${API_URL_DEFAULT} to existing .env"
  else
    ok ".env already contains VITE_API_URL"
  fi
fi

# 2) Fix the common ProtectedRoute import path issue
if [ -f "src/components/ProtectedRoute.jsx" ]; then
  sed -i 's|from "./auth/AuthContext"|from "../contexts/AuthContext"|g' src/components/ProtectedRoute.jsx || true
  ok "Checked & fixed src/components/ProtectedRoute.jsx import"
fi
# keep ../../ for components/auth/ProtectedRoute.* (intentional)

# 3) Ensure AuthContext uses ../utils/api (your earlier fix)
if [ -f "src/contexts/AuthContext.jsx" ]; then
  sed -i "s|from '../../api'|from '../utils/api'|g" src/contexts/AuthContext.jsx || true
  ok "Checked & fixed src/contexts/AuthContext.jsx import"
fi

# 4) Drop-in: COMPLETE utils/api.js (all services, default api, helpers)
say "Installing robust src/utils/api.js with all services…"
mkdir -p src/utils
cp -f src/utils/api.js "src/utils/api.js.backup.$(date +%Y%m%d_%H%M%S)" 2>/dev/null || true

cat > src/utils/api.js <<'EOFAPI'
import axios from "axios";

/**
 * Base URL supports Vite (VITE_API_URL) and CRA-style (REACT_APP_API_URL),
 * with a safe localhost default.
 */
const API_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_URL) ||
  "http://localhost:5000/api";

// Token helper
const getToken = () => (typeof localStorage !== "undefined" ? localStorage.getItem("token") : null);

// Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    config.metadata = { startTime: new Date() };
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    if (typeof process !== "undefined" && process.env && process.env.NODE_ENV === "development" && response.config?.metadata) {
      const dur = new Date() - response.config.metadata.startTime;
      // eslint-disable-next-line no-console
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} - ${dur}ms`);
    }
    return response;
  },
  (error) => {
    // augment with user-friendly message
    if (error?.response) {
      const { status, data } = error.response;
      const messages = {
        400: "Invalid request. Please check your input.",
        401: "Authentication required. Please log in.",
        403: "You don't have permission to perform this action.",
        404: "The requested resource was not found.",
        409: "This action conflicts with existing data.",
        422: "The submitted data is invalid.",
        429: "Too many requests. Please try again later.",
        500: "Server error. Please try again later.",
        502: "Service temporarily unavailable.",
        503: "Service temporarily unavailable.",
        504: "Request timeout. Please try again.",
      };
      error.userMessage = data?.message || messages[status] || "An error occurred. Please try again.";
      if (status === 401 && typeof window !== "undefined" && !window.location.pathname.includes("/login")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    } else if (error?.request) {
      error.userMessage = "Network error. Please check your connection.";
    } else {
      error.userMessage = "An unexpected error occurred.";
    }
    return Promise.reject(error);
  }
);

// -------- Helpers
export const handleApiError = (err) => {
  // eslint-disable-next-line no-console
  console.error("[API ERROR]", err?.userMessage || err?.message || err);
  throw err;
};

const uploadFile = (url, file, extraData = {}) => {
  const formData = new FormData();
  formData.append("file", file);
  Object.keys(extraData).forEach((k) => formData.append(k, extraData[k]));
  return api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      const pct = Math.round((e.loaded * 100) / (e.total || 1));
      // eslint-disable-next-line no-console
      console.log(`Upload Progress: ${pct}%`);
    },
  });
};

const createCrudApi = (resource) => ({
  list: (params = {}) => api.get(`/${resource}`, { params }),
  get: (id) => api.get(`/${resource}/${id}`),
  create: (data) => api.post(`/${resource}`, data),
  update: (id, data) => api.put(`/${resource}/${id}`, data),
  patch: (id, data) => api.patch(`/${resource}/${id}`, data),
  delete: (id) => api.delete(`/${resource}/${id}`),
  bulkCreate: (items) => api.post(`/${resource}/bulk`, { items }),
  bulkUpdate: (updates) => api.put(`/${resource}/bulk`, updates),
  bulkDelete: (ids) => api.delete(`/${resource}/bulk`, { data: { ids } }),
});

// -------- Auth (hooks/pages import { authService } from '../utils/api')
export const authService = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (data) => api.post("/auth/register", data),
  logout: () => api.post("/auth/logout"),
  refresh: () => api.post("/auth/refresh"),
  me: () => api.get("/auth/me"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }),
  changePassword: (oldPassword, newPassword) => api.put("/auth/change-password", { oldPassword, newPassword }),
  updateProfile: (data) => api.put("/auth/profile", data),
  uploadAvatar: (file) => uploadFile("/auth/avatar", file),
};

// -------- Core CRUD Services used across pages
export const customerService   = createCrudApi("customers");
export const vehicleService    = createCrudApi("vehicles");
export const jobService        = createCrudApi("jobs");
export const estimateService   = createCrudApi("estimates");
export const partService       = createCrudApi("parts");
export const laborService      = createCrudApi("labor");
export const invoiceService    = createCrudApi("invoices");
export const appointmentService= createCrudApi("appointments");

// -------- Specials / nested endpoints used in your pages
// Customers
customerService.search       = (q) => api.get(`/customers/search?q=${encodeURIComponent(q)}`);
customerService.getVehicles  = (id) => api.get(`/customers/${id}/vehicles`);
customerService.getJobs      = (id) => api.get(`/customers/${id}/jobs`);
customerService.getInvoices  = (id) => api.get(`/customers/${id}/invoices`);
customerService.sendMessage  = (id, message) => api.post(`/customers/${id}/messages`, message);
customerService.getMessages  = (id) => api.get(`/customers/${id}/messages`);

// Vehicles
vehicleService.vinLookup         = (vin) => api.get(`/vehicles/vin-lookup/${vin}`);
vehicleService.getHistory        = (id) => api.get(`/vehicles/${id}/history`);
vehicleService.getMaintenance    = (id) => api.get(`/vehicles/${id}/maintenance`);
vehicleService.updateMaintenance = (id, data) => api.put(`/vehicles/${id}/maintenance`, data);

// Jobs
jobService.updateStatus = (id, status) => api.patch(`/jobs/${id}/status`, { status });
jobService.startTimer   = (id) => api.post(`/jobs/${id}/timer/start`);
jobService.stopTimer    = (id) => api.post(`/jobs/${id}/timer/stop`);
jobService.getTimes     = (id) => api.get(`/jobs/${id}/times`);
jobService.addPart      = (id, part) => api.post(`/jobs/${id}/parts`, part);
jobService.addLabor     = (id, labor) => api.post(`/jobs/${id}/labor`, labor);
jobService.addNote      = (id, note) => api.post(`/jobs/${id}/notes`, note);
jobService.uploadPhoto  = (id, file) => uploadFile(`/jobs/${id}/photos`, file);
jobService.getPhotos    = (id) => api.get(`/jobs/${id}/photos`);

// Estimates
estimateService.convertToJob    = (id) => api.post(`/estimates/${id}/convert-to-job`);
estimateService.sendToCustomer  = (id, method="email") => api.post(`/estimates/${id}/send`, { method });
estimateService.generatePdf     = (id) => api.get(`/estimates/${id}/pdf`, { responseType: "blob" });

// Invoices
export const invoices = invoiceService;
invoiceService.markPaid   = (id, payment) => api.post(`/invoices/${id}/mark-paid`, payment);
invoiceService.generatePdf= (id) => api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
invoiceService.send       = (id, method="email") => api.post(`/invoices/${id}/send`, { method });
invoiceService.addPayment = (id, data) => api.post(`/invoices/${id}/payments`, data);
invoiceService.getPayments= (id) => api.get(`/invoices/${id}/payments`);

// Reports / Dashboard / Settings
export const dashboardService = {
  stats: () => api.get("/dashboard/stats"),
  recentActivity: (limit=10) => api.get(`/dashboard/recent-activity?limit=${limit}`),
  charts: (period="30d") => api.get(`/dashboard/charts?period=${period}`),
  alerts: () => api.get("/dashboard/alerts"),
};

export const reports = {
  sales: (start, end) => api.get(`/reports/sales?start=${start}&end=${end}`),
  inventory: () => api.get("/reports/inventory"),
  customers: (period="30d") => api.get(`/reports/customers?period=${period}`),
  jobs: (status, period="30d") => api.get(`/reports/jobs?status=${status}&period=${period}`),
  exportSales: (format="pdf", start, end) => api.get(`/reports/sales/export?format=${format}&start=${start}&end=${end}`, { responseType: "blob" }),
};

export const settingsService = {
  get: () => api.get("/settings"),
  update: (data) => api.put("/settings", data),
  getShop: () => api.get("/settings/shop"),
  updateShop: (data) => api.put("/settings/shop", data),
  getTax: () => api.get("/settings/tax"),
  updateTax: (data) => api.put("/settings/tax", data),
  getNotifications: () => api.get("/settings/notifications"),
  updateNotifications: (data) => api.put("/settings/notifications", data),
  backup: () => api.get("/settings/backup", { responseType: "blob" }),
  restore: (file) => uploadFile("/settings/restore", file),
};

// AI + utilities frequently imported
export const aiService = {
  quickDiagnosis: (data) => api.post("/ai/diagnostics/quick-diagnosis", data),
  obdLookup: (code) => api.get(`/ai/diagnostics/obd/${code}`),
  symptomAnalysis: (symptoms) => api.post("/ai/diagnostics/symptoms", { symptoms }),
  generateEstimate: (data) => api.post("/ai/estimates/generate", data),
  feedback: (id, feedback) => api.post(`/ai/diagnostics/${id}/feedback`, feedback),
};

// Time clock helpers (Navbar uses these)
export const timeClockService = {
  clockIn:  () => api.post("/timeclock/clock-in"),
  clockOut: () => api.post("/timeclock/clock-out"),
  status:   () => api.get("/timeclock/status"),
  history:  (start, end) => api.get(`/timeclock/history?start=${start}&end=${end}`),
};

export const timeClockUtils = {
  formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    return `${h}h ${m}m ${ss}s`;
  },
};

export const healthService = {
  ping: () => api.get("/health"),
};

export const apiUtils = {
  handleApiError,
};

// Default export for direct axios access
export default api;
EOFAPI
ok "api.js written"

# 5) Install deps
say "Installing frontend dependencies…"
npm install
ok "npm install complete"

# --- BACKEND (optional: start if we can detect a runner) ---------------------
BACKEND_CMD=""
if [ -d "$BACKEND" ]; then
  say "Backend folder detected: $BACKEND"
  if [ -f "$BACKEND/package.json" ]; then
    # Node backend
    if (cd "$BACKEND" && npm run | grep -q -E 'dev|start'); then
      BACKEND_CMD="cd \"$BACKEND\" && npm install && (npm run dev || npm start)"
    fi
  elif [ -f "$BACKEND/requirements.txt" ]; then
    # Python backend (Flask/FastAPI heuristic)
    if grep -Rqi "fastapi\|uvicorn" "$BACKEND/requirements.txt" "$BACKEND" 2>/dev/null; then
      BACKEND_CMD="cd \"$BACKEND\" && python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt && (uvicorn app:app --host 0.0.0.0 --port 5000 || uvicorn main:app --host 0.0.0.0 --port 5000)"
    else
      BACKEND_CMD="cd \"$BACKEND\" && python3 -m venv .venv && . .venv/bin/activate && pip install --upgrade pip && pip install -r requirements.txt && (FLASK_APP=app.py flask run --host 0.0.0.0 --port 5000 || python app.py)"
    fi
  fi
fi

# --- START in tmux -----------------------------------------------------------
say "Launching in tmux session: $SESSION"
if tmux has-session -t "$SESSION" 2>/dev/null; then
  warn "Session '$SESSION' already exists. Attaching…"
  tmux attach -t "$SESSION"
  exit 0
fi

tmux new-session -d -s "$SESSION" -n "backend"

if [ -n "$BACKEND_CMD" ]; then
  tmux send-keys -t "$SESSION":0 "$BACKEND_CMD" C-m
else
  tmux send-keys -t "$SESSION":0 "echo 'No backend detected or start command unknown. Skipping backend…'" C-m
fi

tmux new-window -t "$SESSION" -n "frontend"
tmux send-keys  -t "$SESSION":1 "cd \"$FRONTEND\" && PORT=${VITE_PORT} npm run dev -- --port ${VITE_PORT}" C-m

ok "tmux session '$SESSION' started."
say "Frontend: http://localhost:${VITE_PORT}"
say "Backend : ${API_URL_DEFAULT%/api}"
say "Attach with: tmux attach -t ${SESSION}"
