# Agenxa Selenium E2E Automation Suite

This directory contains automated Selenium scripts to test Agenxa workflows:
- **Read**: Extract and list all existing subaccounts from an agency.
- **Filter**: Type into the search input and filter accounts dynamically.
- **Select**: Click on a subaccount card to enter its workspace dashboard.
- **Write / Create**: Open the modal and fill the subaccount registration form (Name, Email, Phone, Address, City, State, Zip, Country).

---

## Prerequisites

1. **Python 3.10+** (already installed on system).
2. **Chrome & ChromeDriver** (ChromeDriver 137 is already installed in `/opt/homebrew/bin/chromedriver`).
3. Install Python dependencies:
   ```bash
   pip3 install selenium webdriver-manager
   ```

---

## How to Run the Tester

### 1. Read / List All Subaccounts
```bash
python3 e2e-tests/agenxa_selenium_tester.py \
  --url http://localhost:3000 \
  --agency-id <YOUR_AGENCY_ID> \
  --action read
```

### 2. Search & Select an Existing Subaccount
```bash
python3 e2e-tests/agenxa_selenium_tester.py \
  --url http://localhost:3000 \
  --agency-id <YOUR_AGENCY_ID> \
  --action select \
  --select-name "Acme Corp"
```

### 3. Create a New Subaccount (Form fill & write)
```bash
python3 e2e-tests/agenxa_selenium_tester.py \
  --url http://localhost:3000 \
  --agency-id <YOUR_AGENCY_ID> \
  --action create \
  --new-name "Enterprise Client Inc" \
  --new-email "client@enterprise.com"
```

### 4. Run Everything in Headless Mode (CI / Background)
```bash
python3 e2e-tests/agenxa_selenium_tester.py \
  --url http://localhost:3000 \
  --agency-id <YOUR_AGENCY_ID> \
  --action all \
  --headless
```
