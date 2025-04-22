import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
import sys

class DentalClinicTest(unittest.TestCase):
    def setUp(self):
        """Set up the test environment before each test"""
        print("\nSetting up test...")
        
        try:
            # Configure Chrome options
            chrome_options = Options()
            chrome_options.add_argument('--no-sandbox')
            chrome_options.add_argument('--disable-dev-shm-usage')
            # chrome_options.add_argument('--headless')  # Uncomment to run tests without browser window
            chrome_options.add_argument('--start-maximized')
            
            # Initialize the Chrome WebDriver with automatic driver management
            service = Service()
            try:
                self.driver = webdriver.Chrome(
                    service=service,
                    options=chrome_options
                )
            except Exception as e:
                print(f"Failed to initialize Chrome with default service. Trying with ChromeDriverManager...")
                service = Service(ChromeDriverManager().install())
                self.driver = webdriver.Chrome(
                    service=service,
                    options=chrome_options
                )
                
            self.driver.implicitly_wait(10)
            
            # Base URL of your application
            self.base_url = "file:///C:/Users/aland/Desktop/web%20tree/login.html"
            print("Setup complete.")
            
        except Exception as e:
            print(f"Error during setup: {str(e)}")
            if hasattr(self, 'driver'):
                self.driver.quit()
            raise

    def wait_and_find_element(self, by, value, timeout=10):
        """Helper method to wait for and find an element"""
        try:
            element = WebDriverWait(self.driver, timeout).until(
                EC.presence_of_element_located((by, value))
            )
            return element
        except Exception as e:
            print(f"Error finding element {value}: {str(e)}")
            self.driver.save_screenshot(f"error_{value}.png")
            raise

    def test_01_login_page(self):
        """Test the login functionality"""
        print("\nTesting login page...")
        driver = self.driver
        driver.get(self.base_url)
        
        print("Checking login page elements...")
        # Verify login page elements
        self.assertTrue(self.wait_and_find_element(By.ID, "username").is_displayed())
        self.assertTrue(self.wait_and_find_element(By.ID, "password").is_displayed())
        self.assertTrue(self.wait_and_find_element(By.ID, "loginForm").is_displayed())

        print("Attempting login with admin credentials...")
        # Test login with admin credentials
        username = self.wait_and_find_element(By.ID, "username")
        password = self.wait_and_find_element(By.ID, "password")
        
        username.send_keys("admin@alandental.com")
        password.send_keys("Admin123!@#")
        
        self.wait_and_find_element(By.CSS_SELECTOR, "button[type='submit']").click()
        
        # Wait for redirect to dental_clinic.html
        WebDriverWait(driver, 10).until(
            EC.url_contains("dental_clinic.html")
        )
        
        print("Login successful.")
        # Verify successful login
        self.assertIn("dental_clinic.html", driver.current_url)

    def test_02_dashboard_elements(self):
        """Test the dashboard elements after login"""
        print("\nTesting dashboard elements...")
        self.test_01_login_page()  # Login first
        
        print("Verifying dashboard components...")
        # Verify dashboard elements
        self.assertTrue(self.wait_and_find_element(By.ID, "dashboard").is_displayed())
        self.assertTrue(self.wait_and_find_element(By.CLASS_NAME, "dashboard-stats").is_displayed())
        self.assertTrue(self.wait_and_find_element(By.CLASS_NAME, "dashboard-charts").is_displayed())
        print("Dashboard elements verified.")

    def test_03_patient_management(self):
        """Test patient management functionality"""
        print("\nTesting patient management...")
        self.test_01_login_page()  # Login first
        
        print("Navigating to patients section...")
        # Click on Patients menu
        self.wait_and_find_element(By.CSS_SELECTOR, "[onclick*='showSection(\"patients\")']").click()
        
        # Verify patients section is displayed
        self.wait_and_find_element(By.ID, "patients")
        
        print("Adding new patient...")
        # Test adding a new patient
        self.wait_and_find_element(By.ID, "addPatientBtn").click()
        
        # Fill in patient details
        self.wait_and_find_element(By.ID, "patientFirstName").send_keys("John")
        self.wait_and_find_element(By.ID, "patientLastName").send_keys("Doe")
        self.wait_and_find_element(By.ID, "patientEmail").send_keys("john.doe@example.com")
        self.wait_and_find_element(By.ID, "patientPhone").send_keys("1234567890")
        
        # Submit patient form
        self.wait_and_find_element(By.CSS_SELECTOR, "#addPatientForm button[type='submit']").click()
        
        print("Verifying patient was added...")
        # Verify patient was added
        self.wait_and_find_element(By.XPATH, "//td[contains(text(), 'John')]")
        print("Patient added successfully.")

    def test_04_appointment_scheduling(self):
        """Test appointment scheduling functionality"""
        print("\nTesting appointment scheduling...")
        self.test_01_login_page()  # Login first
        
        print("Navigating to appointments section...")
        # Click on Appointments menu
        self.wait_and_find_element(By.CSS_SELECTOR, "[onclick*='showSection(\"appointments\")']").click()
        
        # Verify appointments section is displayed
        self.wait_and_find_element(By.ID, "appointments")
        
        print("Creating new appointment...")
        # Test adding a new appointment
        self.wait_and_find_element(By.ID, "addAppointmentBtn").click()
        
        # Fill in appointment details
        self.wait_and_find_element(By.ID, "appointmentPatient").send_keys("John Doe")
        self.wait_and_find_element(By.ID, "appointmentDate").send_keys("2024-03-20")
        self.wait_and_find_element(By.ID, "appointmentTime").send_keys("10:00")
        self.wait_and_find_element(By.ID, "appointmentType").send_keys("Checkup")
        
        # Submit appointment form
        self.wait_and_find_element(By.CSS_SELECTOR, "#addAppointmentForm button[type='submit']").click()
        
        print("Verifying appointment was created...")
        # Verify appointment was added
        self.wait_and_find_element(By.XPATH, "//td[contains(text(), 'John Doe')]")
        print("Appointment created successfully.")

    def test_05_dental_charts(self):
        """Test dental charts functionality"""
        print("\nTesting dental charts...")
        self.test_01_login_page()  # Login first
        
        print("Navigating to dental charts section...")
        # Click on Dental Charting menu
        self.wait_and_find_element(By.CSS_SELECTOR, "[onclick*='showSection(\"dental-charting\")']").click()
        
        # Verify dental charts section is displayed
        self.wait_and_find_element(By.ID, "dental-charting")
        
        print("Verifying dental chart elements...")
        # Verify dental chart elements
        self.assertTrue(self.wait_and_find_element(By.CLASS_NAME, "dental-chart").is_displayed())
        print("Dental chart elements verified.")

    def test_06_logout(self):
        """Test logout functionality"""
        print("\nTesting logout...")
        self.test_01_login_page()  # Login first
        
        print("Clicking logout button...")
        # Click logout button
        self.wait_and_find_element(By.ID, "headerLogoutBtn").click()
        
        print("Verifying redirect to login page...")
        # Verify redirect to login page
        WebDriverWait(self.driver, 10).until(
            EC.url_contains("login.html")
        )
        
        # Verify we're back at login page
        self.assertTrue(self.wait_and_find_element(By.ID, "loginForm").is_displayed())
        print("Logout successful.")

    def tearDown(self):
        """Clean up after each test"""
        print("\nCleaning up...")
        if self.driver:
            self.driver.quit()
        print("Test complete.\n" + "-"*50)

if __name__ == "__main__":
    print("Starting Dental Clinic System Tests...")
    unittest.main(verbosity=2) 