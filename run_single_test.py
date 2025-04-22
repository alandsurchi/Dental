import unittest
import logging
import sys
from test_dental_clinic import DentalClinicTest

if __name__ == "__main__":
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        stream=sys.stdout
    )
    
    logger = logging.getLogger('DentalClinicTest')
    logger.info("Starting single test execution...")
    
    # Create a test suite with just the login test
    suite = unittest.TestSuite()
    suite.addTest(DentalClinicTest('test_01_login_page'))
    
    # Run the test
    runner = unittest.TextTestRunner(verbosity=2)
    runner.run(suite)
    
    logger.info("Test execution completed")
    input("Press Enter to exit...") 