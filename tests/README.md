# Dental Clinic System Tests

This directory contains automated tests for the Alan Dental Clinic Management System.

## Setup

1. Install Python 3.8 or higher
2. Install the required packages:
```bash
pip install -r test-requirements.txt
```

3. Install Chrome WebDriver:
   - Download ChromeDriver from: https://sites.google.com/chromium.org/driver/
   - Add it to your system PATH
   - Or use webdriver-manager (included in requirements)

## Running Tests

To run all tests:
```bash
python -m unittest test_dental_clinic.py
```

To run a specific test:
```bash
python -m unittest test_dental_clinic.py -k test_01_login_page
```

## Test Cases

1. Login Functionality (`test_01_login_page`)
   - Verifies login page elements
   - Tests admin login
   - Checks successful redirect

2. Dashboard Elements (`test_02_dashboard_elements`)
   - Verifies dashboard components after login
   - Checks statistics and charts

3. Patient Management (`test_03_patient_management`)
   - Tests adding new patients
   - Verifies patient list display

4. Appointment Scheduling (`test_04_appointment_scheduling`)
   - Tests appointment creation
   - Verifies appointment list

5. Dental Charts (`test_05_dental_charts`)
   - Tests dental chart interface
   - Verifies chart elements

6. Logout (`test_06_logout`)
   - Tests logout functionality
   - Verifies redirect to login

## Notes

- Tests assume the application is running locally
- Default admin credentials are used
- Tests are run in sequence due to dependencies
- Each test includes cleanup in tearDown 