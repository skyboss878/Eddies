#!/bin/bash
echo '🔧 Applying fixes to database...'
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE settings ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE settings ADD COLUMN shop_name TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE settings ADD COLUMN address TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE settings ADD COLUMN phone TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE settings ADD COLUMN email TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE vehicles ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE vehicles ADD COLUMN customer_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE vehicles ADD COLUMN make TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE vehicles ADD COLUMN model TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE vehicles ADD COLUMN year TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE vehicles ADD COLUMN color TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE jobs ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE jobs ADD COLUMN vehicle_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE jobs ADD COLUMN customer_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE jobs ADD COLUMN symptoms TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE jobs ADD COLUMN status TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE estimates ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE estimates ADD COLUMN customer_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE estimates ADD COLUMN job_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE estimates ADD COLUMN total_amount TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE estimates ADD COLUMN status TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE invoices ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE invoices ADD COLUMN customer_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE invoices ADD COLUMN estimate_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE invoices ADD COLUMN total_amount TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE invoices ADD COLUMN paid TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE appointments ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE appointments ADD COLUMN customer_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE appointments ADD COLUMN vehicle_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE appointments ADD COLUMN service_date TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE appointments ADD COLUMN is_active TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE customers ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE customers ADD COLUMN name TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE customers ADD COLUMN email TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE customers ADD COLUMN phone TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE time_entries ADD COLUMN id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE time_entries ADD COLUMN employee_id TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE time_entries ADD COLUMN start_time TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE time_entries ADD COLUMN end_time TEXT DEFAULT '';"
sqlite3 sqlite:///eddie_automotive.db
postgresql://user:password@localhost:5432/eddies_automotive "ALTER TABLE time_entries ADD COLUMN break_duration TEXT DEFAULT '';"
