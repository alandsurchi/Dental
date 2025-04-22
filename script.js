// --- Initial Check & Redirect (Runs before DOMContentLoaded) ---
// Check sessionStorage for a stored role IMMEDIATELY.
// This section runs as soon as the script is parsed in the HTML HEAD (if the script tag is there).
const storedRoleForLoad = sessionStorage.getItem('currentUserRole');

// Define pages where redirection *shouldn't* happen early (login.html, index.html, base path)
const currentPage = window.location.pathname.split('/').pop();
const isLoginPageCheck = currentPage === 'login.html' || currentPage === '' || currentPage === 'index.html';

if (!storedRoleForLoad || storedRoleForLoad === '' || storedRoleForLoad === 'loggedOut') {
     // User is NOT logged in.
     window.currentUserRole = 'loggedOut'; // Ensure global state reflects this.

     if (!isLoginPageCheck) {
          // We are on a page that *requires* login (like dental_clinic.html) but are not logged in.
          console.log(`Script.js (early check): No valid user role found in sessionStorage (${storedRoleForLoad || 'empty'}). Not on a known entry page (${currentPage}). Redirecting to login.html.`);
          // Use window.location.replace() to prevent the user from clicking back to the secured page after logout
          window.location.replace('login.html');
          // Optional: Throw an error to forcefully halt script execution in some environments
          // throw new Error("Redirecting to login..."); // May show in console, optional but effective
          // Using replace() and not throwing lets the rest of this script potentially load, but navigation will change the page soon anyway.

     } else {
          // We are on a known entry page (login.html, index.html, or base path). Allow script to proceed.
           console.log(`Script.js (early check): Not logged in but on entry page (${currentPage}). Allowing script execution. Global currentUserRole = 'loggedOut'.`);
     }

} else {
    // User IS logged in according to sessionStorage.
    window.currentUserRole = storedRoleForLoad; // Set the global state based on sessionStorage.
     console.log(`Script.js (early check): User role '${window.currentUserRole}' found in sessionStorage. Setting global state and allowing script execution.`);
    // We are on a secured page and authenticated, so no redirect is needed *at this point*.
    // The rest of the script, especially updateUIState, will build the UI based on this role.

     // If somehow we landed on login.html while sessionstorage exists (e.g. user typed login url), redirect them to the app
     if (isLoginPageCheck && currentUserRole !== 'loggedOut') {
          console.log(`Script.js (early check): Logged in but on entry page (${currentPage}). Redirecting to main app page.`);
          window.location.replace('dental_clinic.html');
          // throw new Error("Redirecting to main app...");
     }
}


// Define window functions and data structures if execution is allowed to continue


// --- Global variables ---
// currentUserRole is initialized by the early sessionStorage check or defaults to 'loggedOut'.
// window.currentUserRole = 'loggedOut'; // This line is effectively replaced by the check above


// State variable for the calendar month being viewed
window.calendarDate = new Date(); // Initialize to current month

// Store the currently selected section and tab IDs for state tracking
window.currentSection = null;
window.currentTab = {}; // Object to hold active tab per section, e.g., { 'patients': 'patient-list', 'billing': 'invoices' }


// --- User Data (Simulated) - NOW includes login credentials ---
const userData = {
     'admin': { name: 'Dr. ALAN FAHMI', role: 'Admin', avatar: 'https://placehold.co/40x40/7b68ee/ffffff', username: 'alan.fahmi', password: '123' },
     'receptionist': { name: 'Sarah Davis', role: 'Receptionist', avatar: 'https://placehold.co/40x40/2ecc71/ffffff', username: 'sarah.davis', password: '123' },
     'dentist': { name: 'Dr. Jane Doe', role: 'Dentist', avatar: 'https://placehold.co/40x40/f39c12/ffffff', username: 'jane.doe', password: '123' },
     // Add more user data if needed, each must have username, password, name, role, avatar.
     // The key ('admin', 'receptionist', 'dentist') IS the role used internally and stored in session storage.
};

// --- Function to Check Login Credentials (Called by login.js) ---
// Added to window scope for access from the separate login.js file.
window.checkLoginCredentials = function(username, password) {
    // Iterate through defined user roles in userData object keys
     for (const role in userData) {
         // Check if the property exists and has the credentials
         if (Object.hasOwnProperty.call(userData, role) &&
             userData[role].username === username &&
             userData[role].password === password) {
             return role; // Return the role string ('admin', 'receptionist', etc.) if credentials match
         }
     }
     return false; // Return false if no match is found
}


// --- Simulated Dummy Data Arrays (Frontend Only) ---
// These arrays hold the data rows/cards that would normally come from a database.
// Modifications (add/edit/delete) in the demo directly change these arrays and/or the DOM, NOT a backend.

window.allDemoAppointments = [
     { id: 'A001', patientId: 'P001', date: '2023-04-06', time: '09:00', patient: 'Sarah Johnson', section: 'Women\'s Section', treatment: 'Dental Cleaning', doctorId: 'D001', doctor: 'Dr. ALAN FAHMI', status: 'Confirmed', notes: 'Regular cleaning.' },
     { id: 'A002', patientId: 'P002', date: '2023-04-06', time: '10:30', patient: 'Michael Brown', section: 'Men\'s Section', treatment: 'Root Canal', doctorId: 'D002', doctor: 'Dr. ALI ENZAR', status: 'Confirmed', notes: 'Pain in molar.' },
     { id: 'A003', patientId: 'P003', date: '2023-04-06', time: '11:45', patient: 'Emily Davis', section: 'Women\'s Section', treatment: 'Consultation', doctorId: 'D003', doctor: 'Dr. MUHAMMAD ENZAR', status: 'Pending', notes: '' },
     { id: 'A004', patientId: 'P004', date: '2023-04-06', time: '14:15', patient: 'Robert Wilson', section: 'Men\'s Section', treatment: 'Tooth Extraction', doctorId: 'D004', doctor: 'Dr. ALI RAJO', status: 'Confirmed', notes: 'Problematic wisdom tooth.' },
     { id: 'A005', patientId: 'P005', date: '2023-04-07', time: '10:00', patient: 'Jennifer Lee', section: 'Women\'s Section', treatment: 'Teeth Whitening', doctorId: 'D005', doctor: 'Dr. ALAND RAED', status: 'Confirmed', notes: '' },
     { id: 'A006', patientId: 'P001', date: '2023-04-15', time: '11:00', patient: 'Sarah Johnson', section: 'Women\'s Section', treatment: 'Follow-up', doctorId: 'D001', doctor: 'Dr. ALAN FAHMI', status: 'Pending', notes: '' },
     { id: 'A007', patientId: 'P002', date: '2023-05-01', time: '09:30', patient: 'Michael Brown', section: 'Men\'s Section', treatment: 'Check-up', doctorId: 'D002', doctor: 'Dr. ALI ENZAR', status: 'Confirmed', notes: '6-month check-up.' },
     { id: 'A008', patientId: 'P001', date: '2024-07-25', time: '09:00', patient: 'Sarah Johnson', section: 'Women\'s Section', treatment: 'Dental Cleaning', doctorId: 'D001', doctor: 'Dr. ALAN FAHMI', status: 'Confirmed', notes: 'Regular cleaning.' }, // Example appointments for "today"
     { id: 'A009', patientId: 'P002', date: '2024-07-25', time: '10:00', patient: 'Michael Brown', section: 'Men\'s Section', treatment: 'Root Canal', doctorId: 'D002', doctor: 'Dr. ALI ENZAR', status: 'Pending', notes: '' }, // Example appointments for "today"
     // Add more appointments for different dates/years if desired for demo
];

window.allDemoPatients = [
      { id: 'P001', name: 'Sarah Johnson', age: 35, gender: 'Female', phone: '(555) 123-4567', email: 'sarah.j@example.com', address: '123 Main St', section: 'Women\'s Section', treatment: 'Disease Treatment', doctorId: 'D001', medicalHistory: 'None.', lastVisitDate: '2023-04-15' }, // Added lastVisitDate
     { id: 'P002', name: 'Michael Brown', age: 42, gender: 'Male', phone: '(555) 234-5678', email: 'mike.b@example.com', address: '456 Oak Ave', section: 'Men\'s Section', treatment: 'Disease Treatment', doctorId: 'D002', medicalHistory: 'Allergic to Penicillin.', lastVisitDate: '2023-05-01' },
     { id: 'P003', name: 'Emily Davis', age: 28, gender: 'Female', phone: '(555) 345-6789', email: 'emily.d@example.com', address: '789 Pine Ln', section: 'Women\'s Section', treatment: 'Cosmetic Treatment', doctorId: 'D003', medicalHistory: 'Sensitive gums.', lastVisitDate: '2023-03-22' },
     { id: 'P004', name: 'Robert Wilson', age: 45, gender: 'Male', phone: '(555) 456-7890', email: 'robert.w@example.com', address: '101 Maple Rd', section: 'Men\'s Section', treatment: 'Disease Treatment', medicalHistory: 'Past tooth removal.', lastVisitDate: '2023-04-06' },
     { id: 'P005', name: 'Jennifer Lee', age: 32, gender: 'Female', phone: '(555) 567-8901', email: 'jen.l@example.com', address: '222 Elm Ct', section: 'Women\'s Section', treatment: 'Cosmetic Treatment', doctorId: 'D005', medicalHistory: 'None.', lastVisitDate: '2023-04-07' },
 ];

 window.allDemoStaff = [
      { id: 'D001', name: 'Dr. ALAN FAHMI', role: 'Dentist', email: 'alan.fahmi@alandental.com', phone: '+1 (555) 123-4567', specialty: 'General Dentistry', address: '123 Dental Ave', imageUrl: 'https://placehold.co/100x100/7b68ee/ffffff', isDemoUser: true }, // Added isDemoUser flag
      { id: 'D002', name: 'Dr. ALI ENZAR', role: 'Endodontist', email: 'ali.enzar@alandental.com', phone: '+1 (555) 234-5678', specialty: 'Root Canal Specialist', address: '456 Dental Blvd', imageUrl: 'https://placehold.co/100x100/2ecc71/ffffff' },
      { id: 'D003', name: 'Dr. MUHAMMAD ENZAR', role: 'Orthodontist', email: 'muhammad.enzar@alandental.com', phone: '+1 (555) 345-6789', specialty: 'Braces Specialist', address: '789 Ortho Way', imageUrl: 'https://placehold.co/100x100/f39c12/ffffff', isDemoUser: true }, // isDemoUser for Dr. Jane Doe's mapped staff profile
     { id: 'D004', name: 'Dr. ALI RAJO', role: 'Oral Surgeon', email: 'ali.rajo@alandental.com', phone: '+1 (555) 456-7890', specialty: 'Extraction Specialist', address: '101 Surgery Cir', imageUrl: 'https://placehold.co/100x100/3498db/ffffff' },
     { id: 'D005', name: 'Dr. ALAND RAED', role: 'Dentist', email: 'aland.raed@alandental.com', phone: '+1 (555) 678-9012', specialty: 'Cosmetic Dentistry', address: '222 Veneer View', imageUrl: 'https://placehold.co/100x100/1abc9c/ffffff' },
     // Receptionist Sarah Davis doesn't have a staff 'doctor' ID in the original list, but if she were in this list with an ID and `isDemoUser`, you could potentially link. Keeping separate for now.
 ];
 // Map staff IDs to demo usernames for clarity if needed, but username/password lives in userData
 // Example: { staffId: 'D001', username: 'alan.fahmi' }, { staffId: 'D003', username: 'jane.doe' }

 // Dummy Treatments (used in selects and price lookup)
 window.allDemoTreatments = [
      { value: 'Dental Cleaning', text: 'Dental Cleaning', price: 150.00, duration: 60, category: 'Preventive' },
      { value: 'Root Canal', text: 'Root Canal', price: 850.00, duration: 90, category: 'Restorative' },
      { value: 'Tooth Extraction', text: 'Tooth Extraction', price: 200.00, duration: 45, category: 'Surgical' },
      { value: 'Teeth Whitening', text: 'Teeth Whitening', price: 300.00, duration: 60, category: 'Cosmetic' },
      { value: 'Consultation', text: 'Consultation', price: 75.00, duration: 30, category: 'Diagnostic' },
      { value: 'Filling', text: 'Filling', price: 100.00, duration: 45, category: 'Restorative' },
      { value: 'Crown', text: 'Crown', price: 1200.00, duration: 90, category: 'Restorative' },
      { value: 'Bridge', text: 'Bridge', price: 2500.00, duration: 120, category: 'Restorative' },
      { value: 'Implant', text: 'Implant', price: 3500.00, duration: 120, category: 'Surgical' },
      { value: 'Veneer', text: 'Veneer', price: 900.00, duration: 60, category: 'Cosmetic' },
 ];

 // Dummy Historical Charting Data (used for loadPatientChart)
 window.demoHistoricalCharting = {
      'P001': [ // Sarah Johnson
           { date: '2022-10-15', teeth: ['16', '26'], treatmentType: 'filling', notes: 'Mesial composite fillings' },
           { date: '2023-02-10', teeth: ['36', '46'], treatmentType: 'filling', notes: 'Distal composite fillings' },
           { date: '2023-03-20', teeth: ['36'], treatmentType: 'root-canal', notes: 'Root canal therapy on 36 due to pain' },
           { date: '2023-03-25', teeth: ['36'], treatmentType: 'crown', notes: 'Crown placed on 36 after root canal' }
      ],
       'P002': [ // Michael Brown
           { date: '2021-11-05', teeth: ['18', '28', '38', '48'], treatmentType: 'extraction', notes: 'All 4 wisdom teeth extracted' },
           { date: '2022-08-12', teeth: ['17', '42'], treatmentType: 'extraction', notes: 'Extraction of #17 and #42' }, // Fixed typo, clarified notes
           { date: '2023-01-30', teeth: ['11', '21'], treatmentType: 'consult-needed', notes: 'Evaluation for orthodontic referral' }
       ],
       'P003': [ // Emily Davis
          { date: '2023-03-22', teeth: ['13', '23'], treatmentType: 'veneer', notes: 'Porcelain veneers placed on upper canines' },
          { date: '2023-03-22', teeth: ['12', '11', '21', '22'], treatmentType: 'whitening', notes: 'Full mouth whitening performed after veneer placement' }
      ],
      'P004': [ // Robert Wilson - Add a sample charting entry matching the extraction appointment data
          { date: '2023-04-06', teeth: ['48'], treatmentType: 'extraction', notes: 'Problematic wisdom tooth #48 extracted.' }
      ],
       'P005': [ // Jennifer Lee
           { date: '2023-04-07', teeth: [], treatmentType: 'veneer', notes: 'Consultation regarding cosmetic treatments, focused on veneers and whitening.' }, // Example entry with no specific teeth selected initially
           { date: '2023-04-07', teeth: ['12','11','21','22'], treatmentType: 'whitening', notes: 'Teeth whitening treatment performed on upper incisors and canines.' }
       ]
 };

 // Dummy Invoice Data
 window.allDemoInvoices = [
      { id: 'INV001', patientId: 'P001', patientName: 'Sarah Johnson', date: '2023-02-15', treatment: 'Dental Cleaning', amount: 150.00, status: 'Paid', method: 'credit-card', notes: '' }, // Using value for method
     { id: 'INV002', patientId: 'P002', patientName: 'Michael Brown', date: '2023-03-10', treatment: 'Root Canal', amount: 850.00, status: 'Pending', method: '', notes: 'Initial visit for pain.' },
     { id: 'INV003', patientId: 'P003', patientName: 'Emily Davis', date: '2023-03-22', treatment: 'Consultation', amount: 75.00, status: 'Paid', method: 'cash', notes: '' }, // Using value for method
     { id: 'INV004', patientId: 'P004', patientName: 'Robert Wilson', date: '2023-04-05', treatment: 'Tooth Extraction', amount: 200.00, status: 'Pending', method: '', notes: 'Wisdom tooth #48.' },
     // Add more if needed
 ];

 // Dummy Payment History (derive from Paid invoices usually) - Update structure to store method VALUE
 window.allDemoPayments = [
      { id: 'PMT001', invoiceId: 'INV001', patientId: 'P001', patientName: 'Sarah Johnson', date: '2023-02-15', amount: 150.00, method: 'credit-card' }, // Using value for method
      { id: 'PMT002', invoiceId: 'INV003', patientId: 'P003', patientName: 'Emily Davis', date: '2023-03-22', amount: 75.00, method: 'cash' }, // Using value for method
      // Add more if needed
 ];

// Dummy Payment Methods (for list and selection) - Added 'value' property consistently
window.allDemoPaymentMethods = [
    { id: 'PM001', value: 'cash', name: 'Cash', description: 'Accept cash payments directly at the clinic', icon: 'fas fa-money-bill-wave' },
    { id: 'PM002', value: 'credit-card', name: 'Credit Card', description: 'Accept Visa, MasterCard, and American Express', icon: 'far fa-credit-card' },
    { id: 'PM003', value: 'insurance', name: 'Insurance', description: 'Process payments through dental insurance providers', icon: 'fas fa-file-medical' },
     { id: 'PM004', value: 'online-transfer', name: 'Online Transfer', description: 'Direct bank transfer option', icon: 'fas fa-university' },
];


// --- User Role Permissions Map (Simulated Access Control) ---
// Defines which roles are allowed to see which menu items and sections
const rolePermissionsMap = {
     // No 'loggedOut' state defined here for permissions because that state is handled by the login page redirect.
     // Permissions here define access *while logged in*.
     'admin':     { canSee: ['dashboard', 'patients', 'appointments', 'dental-charting', 'billing', 'staff', 'treatments', 'payment-methods', 'reports']},
     'receptionist': { canSee: ['dashboard', 'patients', 'appointments', 'billing']},
     'dentist':   { canSee: ['dashboard', 'patients', 'appointments', 'dental-charting', 'treatments']},
     // Any other potential future roles...
};
// Data-role attributes in HTML on menu items should match keys in this map.
// Section visibility in showSection implicitly relies on this via the menu item check.


// --- Function to Handle Logout ---
// Added to window scope for access from the header button
window.logout = function() {
     console.log(`Attempting logout for role: ${window.currentUserRole}`);
    // Clear the stored role from sessionStorage
    sessionStorage.removeItem('currentUserRole');
    window.currentUserRole = 'loggedOut'; // Update global script state

    // Redirect to the login page
    // Use window.location.replace to prevent 'back' button showing previous logged-in page
    window.location.replace('login.html');
     console.log('Session storage cleared. Redirecting to login.html.');
}


// --- Function to Render UI State based on Role ---
// This function now ASSUMES window.currentUserRole is already set from sessionStorage (or is 'loggedOut').
// It hides/shows elements based on this state and navigates to the appropriate default view.
window.updateUIState = function() {
     // Use the already set global variable `window.currentUserRole`
     console.log(`Updating UI state for role: ${window.currentUserRole}`);

     const sectionTitle = document.getElementById('section-title');
     const userNameHeader = document.getElementById('userName');
     const userRoleSpan = document.getElementById('userRole');
     const userInfoDiv = document.querySelector('.header-controls .user-info'); // Assuming dental_clinic.html structure
     const userAvatarImg = userInfoDiv?.querySelector('img');
     const headerLogoutBtn = document.getElementById('headerLogoutBtn'); // Assuming dental_clinic.html structure
     const sidebarMenuItems = document.querySelectorAll('.sidebar .menu-item');


    // --- Update Header User Info and Logout Button ---
     // This function now *only* runs on dental_clinic.html because of the login page redirect.
     // Therefore, it assumes window.currentUserRole is set to a valid role ('admin', 'receptionist', 'dentist').
     const user = userData[window.currentUserRole];
     if (user) {
         // Header should display logged-in user info
         userNameHeader.textContent = user.name;
         userRoleSpan.textContent = user.role;
         if(userAvatarImg) userAvatarImg.src = user.avatar;
          if(userInfoDiv) userInfoDiv.style.display = 'flex'; // Show user info container
          if(headerLogoutBtn) headerLogoutBtn.style.display = 'inline-block'; // Show logout button

          // sectionTitle text is handled by showSection

     } else {
         // This case is unexpected if the redirect logic works, but good for robustness.
          // If somehow a bad role is in session storage and lands here.
         console.error(`User data not found for session role: ${window.currentUserRole}. Cannot display user info.`);
         sectionTitle.textContent = 'System Error'; // Indicate an issue
         userNameHeader.textContent = 'Unknown User';
         userRoleSpan.textContent = 'N/A';
         if(userAvatarImg) userAvatarImg.src = 'https://placehold.co/40x40/cccccc/333333'; // Default error avatar
          if(userInfoDiv) userInfoDiv.style.display = 'flex'; // Still show info container for feedback
          if(headerLogoutBtn) headerLogoutBtn.style.display = 'none'; // Hide logout button
           // In a real app, you'd force logout here or show an error screen.
            alert(`Error: User data for role "${window.currentUserRole}" not found.`);
            logout(); // Force logout
            return; // Stop further UI updates in this bad state
     }


    // --- Update Sidebar Menu Item Visibility ---
     sidebarMenuItems.forEach(item => {
         const allowedRolesAttr = item.getAttribute('data-role');
         let shouldShow = false;

          // Split data-role string into an array of roles
         const allowedRolesList = allowedRolesAttr ? allowedRolesAttr.split(',').map(role => role.trim()) : [];

         // An item is visible if its data-role includes the current user's role.
         // 'all' roles are not used anymore as this function only runs when logged in.
         if (allowedRolesList.includes(window.currentUserRole)) {
              shouldShow = true;
         } else {
              shouldShow = false; // Hide if the current role is not explicitly listed
         }

         // Apply or remove the hidden class and manage display
         if (shouldShow) {
             item.classList.remove('hidden-by-role');
             item.style.display = 'flex'; // Ensure display is flex
         } else {
             item.classList.add('hidden-by-role');
             item.style.display = 'none'; // Ensure display is none
         }
     });


    // --- Manage Section Visibility and Initial View After Login ---
     const contentSections = document.querySelectorAll('.main-content .content-section');

     // Reset active section class before setting the initial one
     document.querySelectorAll('.content-section.active').forEach(section => section.classList.remove('active'));

     // Initially hide ALL content sections explicitly
     contentSections.forEach(section => {
         section.style.display = 'none';
         // No longer adding 'hidden-by-role' to sections via JS, just relying on display: none
     });

    // Determine the first allowed section for navigation
     let firstAllowedSectionId = null;
     // Check the rolePermissionsMap for the current role's allowed sections
     const userPermittedSections = rolePermissionsMap[window.currentUserRole]?.canSee || [];

      // Try to find the first section ID that corresponds to the first *visible* menu item.
      const firstVisibleMenuItem = document.querySelector('.sidebar .menu-item:not(.hidden-by-role)');

       if (firstVisibleMenuItem) {
            const sectionMatch = firstVisibleMenuItem.getAttribute('onclick')?.match(/showSection\('([^']+)'\)/);
            const sectionIdFromMenu = sectionMatch ? sectionMatch[1] : null;

             // Verify the section ID from the menu is actually permitted by the role map
            if (sectionIdFromMenu && userPermittedSections.includes(sectionIdFromMenu)) {
                 firstAllowedSectionId = sectionIdFromMenu; // Use the section linked by the first visible menu item
                 console.log(`First allowed section determined from first visible menu item: ${firstAllowedSectionId}`);
            } else {
                 // This shouldn't happen if data-role on menu items perfectly matches canSee sections in map,
                 // but as a fallback, take the first permitted section ID directly from the map.
                 console.warn(`First visible menu item links to section "${sectionIdFromMenu}", which is unexpectedly not in rolePermissionsMap.canSee for role "${window.currentUserRole}". Falling back to first ID from map.`);
                 firstAllowedSectionId = userPermittedSections[0] || null; // Take the first one listed in the map
            }
       } else {
           // This means NO menu items are visible for the user's role - something is severely wrong.
           console.error(`No visible menu items found for role: ${window.currentUserRole}. Cannot determine initial section.`);
           firstAllowedSectionId = null;
       }


      if (firstAllowedSectionId) {
           // Set the global current section state
           window.currentSection = firstAllowedSectionId;
           console.log(`Navigating to initial allowed section: ${firstAllowedSectionId}`);
          showSection(firstAllowedSectionId); // Navigate to the first allowed section

      } else {
           // Should not happen if the rolePermissionsMap is correctly set up and at least one section is listed for the role.
           // Indicates an configuration error.
           sectionTitle.textContent = "Configuration Error: No Accessible Sections Defined";
           console.error(`FATAL: No permitted section found for role: ${window.currentUserRole} in rolePermissionsMap.`);
           alert("Your role does not have access to any defined sections. Please contact support.");
           logout(); // Force logout as user has no functional access
      }

     // Cleanup any stray active tab classes from previous state/sections
     // This is somewhat redundant with showSection/showTab but harmless as a final reset.
      document.querySelectorAll('.tab-content.active').forEach(tabContent => tabContent.classList.remove('active'));
     document.querySelectorAll('.tabs .tab.active').forEach(tab => tab.classList.remove('active'));
}


// Helper function to populate select dropdowns dynamically from dummy data
function populateDropdowns() {
    console.log("Populating select dropdowns with dummy data...");

    // Patient dropdowns (Appointments, Billing, Charting)
     const patientSelects = document.querySelectorAll('#appointmentPatient, #invoicePatient, #chartPatient');
     patientSelects.forEach(select => {
         select.innerHTML = '<option value="">Select Patient</option>'; // Keep default option
          // Sort patients by name for better UX
         window.allDemoPatients.sort((a, b) => a.name.localeCompare(b.name)).forEach(patient => {
             const option = document.createElement('option');
             option.value = patient.id;
             option.textContent = patient.name;
             select.appendChild(option);
         });
     });
     console.log(`Populated patient dropdowns (${window.allDemoPatients.length} options).`);


    // Doctor dropdowns (Appointments, maybe other staff selectors)
    const doctorSelects = document.querySelectorAll('#appointmentDoctor'); // Currently only appointments needs this
     doctorSelects.forEach(select => {
         select.innerHTML = '<option value="">Select Doctor</option>'; // Keep default option
         // Filter staff for roles typically assigned as doctors for appointments
          const doctors = window.allDemoStaff.filter(staff => staff.role === 'Dentist' || staff.role === 'Endodontist' || staff.role === 'Orthodontist' || staff.role === 'Oral Surgeon');
          doctors.sort((a, b) => a.name.localeCompare(b.name)).forEach(doctor => {
             const option = document.createElement('option');
             option.value = doctor.id; // Use the doctor's ID as the value
             option.textContent = doctor.name;
             select.appendChild(option);
         });
     });
     console.log(`Populated doctor dropdowns (${window.allDemoStaff.filter(s=> ['Dentist', 'Endodontist', 'Orthodontist', 'Oral Surgeon'].includes(s.role)).length} options).`);


    // Treatment dropdowns (Appointments, Billing Create)
    const treatmentSelects = document.querySelectorAll('#appointmentTreatment, #invoiceTreatment'); // Charting treatment is buttons, not select
     treatmentSelects.forEach(select => {
         select.innerHTML = '<option value="">Select Treatment Type</option>'; // Keep default option
         window.allDemoTreatments.sort((a,b) => a.text.localeCompare(b.text)).forEach(treatment => {
             const option = document.createElement('option');
              // Use the 'value' property if you want a short code, or 'text' if you want the full name
              // Using 'value' property from dummy data structure for select options
             option.value = treatment.value; // e.g., "Dental Cleaning"
             option.textContent = treatment.text; // e.g., "Dental Cleaning" (display)
             select.appendChild(option);
         });
     });
     console.log(`Populated ${treatmentSelects.length} treatment dropdowns.`);

    // Event listener for treatment dropdowns to potentially update price
    treatmentSelects.forEach(select => {
        select.addEventListener('change', function(event) {
             if (event.target.id === 'invoiceTreatment') { // Only affects the invoice amount field
                 const selectedOption = event.target.options[event.target.selectedIndex];
                 // Find the treatment in the dummy data using the selected value to get its price
                  const selectedTreatmentValue = selectedOption.value;
                  const treatmentDetails = window.allDemoTreatments.find(t => t.value === selectedTreatmentValue);

                  const estimatedPrice = treatmentDetails?.price; // Use optional chaining
                  const amountInput = document.getElementById('invoiceAmount');

                  if(amountInput && typeof estimatedPrice === 'number' && estimatedPrice >= 0) { // Check if price is a valid number
                      amountInput.value = parseFloat(estimatedPrice).toFixed(2);
                       console.log(`Updated invoice amount based on selected treatment to $${amountInput.value}`);
                   } else if (amountInput) {
                       amountInput.value = ''; // Clear if no price found or "Select..." option
                        console.log("Cleared invoice amount (no valid treatment or price found).");
                   }
             }
        });
    });


    // Payment Method dropdown (Billing create/edit invoice form) - Used in Edit view primarily now
    const invoicePaymentMethodSelect = document.getElementById('invoicePaymentMethodSelect'); // Use the new ID
    if (invoicePaymentMethodSelect) {
         invoicePaymentMethodSelect.innerHTML = '<option value="">Select Method (if Paid)</option>'; // Keep default
        window.allDemoPaymentMethods.forEach(method => {
            const option = document.createElement('option');
             option.value = method.value; // Use the internal value ('cash', 'credit-card')
            option.textContent = method.name; // Use the display name ('Cash', 'Credit Card')
            invoicePaymentMethodSelect.appendChild(option);
        });
        console.log(`Populated invoice payment method select dropdown (${window.allDemoPaymentMethods.length} options).`);
    }

    // Also dynamically render the Payment Methods *buttons* on the Create Invoice form
     const paymentOptionButtonsContainer = document.querySelector('#invoicePaymentMethodsButtonsContainer .payment-options'); // Use the new container ID
     if (paymentOptionButtonsContainer) {
         paymentOptionButtonsContainer.innerHTML = ''; // Clear static HTML
         window.allDemoPaymentMethods.forEach(method => {
             const btnDiv = document.createElement('div');
             btnDiv.className = 'payment-option';
             // Pass button element ('this') and the method 'value' string
             btnDiv.setAttribute('onclick', `selectPaymentMethod(this, '${method.value}')`);
             btnDiv.setAttribute('data-value', method.value); // Add data-value for easy lookup in selectPaymentMethod
             btnDiv.innerHTML = `
                 <div class="payment-icon"><i class="${method.icon}"></i></div>
                 <div class="payment-name">${method.name}</div>
             `;
             paymentOptionButtonsContainer.appendChild(btnDiv);
         });
         console.log(`Rendered ${window.allDemoPaymentMethods.length} payment option buttons.`);
     }


     // Report Period dropdowns - populate simple static options as before
      const financialReportPeriodSelect = document.getElementById('financialReportPeriod');
     if (financialReportPeriodSelect) {
          financialReportPeriodSelect.innerHTML = `
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
           `;
         console.log("Populated financial report period dropdown.");
     }
      // No other period selects in reports currently.

      // --- Initial rendering of the Patient, Staff, Treatment, Payment Method lists ---
      renderPatientListTable();
      renderStaffGrid(); // Assumes #staffGrid exists
      renderTreatmentList(); // Assumes #treatmentsList exists
      renderPaymentMethodList(); // Assumes #paymentMethodsList exists
}

// Function to toggle visibility/state of Payment Method elements on Invoice form
// Called on load and onchange of Status dropdown
window.togglePaymentMethodVisibility = function() { // Make global
     const invoiceStatusSelect = document.getElementById('invoiceStatus');
     const paymentMethodSelect = document.getElementById('invoicePaymentMethodSelect');
     const paymentMethodButtonsContainer = document.getElementById('invoicePaymentMethodsButtonsContainer');

     if (!invoiceStatusSelect || !paymentMethodSelect || !paymentMethodButtonsContainer) {
          console.warn("Invoice form payment method elements not found for toggling.");
         return;
     }

     const isPaid = invoiceStatusSelect.value === 'Paid';

     if (isPaid) {
         // If status is Paid, show the SELECT (used for edit prefill/final state)
         // and potentially hide the BUTTONS (used for quick selection during creation).
          paymentMethodSelect.closest('.form-group').style.display = 'block'; // Show parent form-group for SELECT
          paymentMethodSelect.disabled = false; // Enable the SELECT


          paymentMethodButtonsContainer.style.display = 'block'; // Or 'flex' depending on original style, let's stick to block
          // Optional: Reset button selections if status changes back to Pending and then to Paid
           document.querySelectorAll('#invoicePaymentMethodsButtonsContainer .payment-option').forEach(btn => btn.classList.remove('selected'));
            const hiddenPaymentMethodButtonValue = document.getElementById('paymentMethodButtonValue');
           if(hiddenPaymentMethodButtonValue) hiddenPaymentMethodButtonValue.value = ''; // Clear hidden input too

           // If editing, the select's value is used and the corresponding button might be selected by editInvoice
           // If adding and switching to paid, the buttons appear.
     } else { // Status is Pending or other non-Paid
         // If status is Pending, hide/disable the SELECT (it's for recording payment method once paid)
          paymentMethodSelect.closest('.form-group').style.display = 'none'; // Hide parent form-group for SELECT
          paymentMethodSelect.value = ''; // Clear value when Pending
          paymentMethodSelect.disabled = true; // Disable the SELECT

          // Show or hide the BUTTONS? Conventionally buttons are for ADDING payments, not changing status later.
          // In 'Add New Invoice' mode, buttons show. In 'Edit Invoice' mode, only the SELECT shows.
          // This depends on whether invoiceId hidden input has a value.
          const invoiceId = document.getElementById('invoiceId').value; // Check if we are in edit mode
           if (!invoiceId) { // We are Adding
              paymentMethodButtonsContainer.style.display = 'block'; // Show buttons for picking payment method during add
               // Deselect any previously selected button and clear its hidden input value
                document.querySelectorAll('#invoicePaymentMethodsButtonsContainer .payment-option.selected').forEach(btn => btn.classList.remove('selected'));
                 const hiddenPaymentMethodButtonValue = document.getElementById('paymentMethodButtonValue');
                 if(hiddenPaymentMethodButtonValue) hiddenPaymentMethodButtonValue.value = '';

          } else { // We are Editing
              // In edit mode, the payment method is selected via the dropdown (#invoicePaymentMethodSelect), not the buttons.
              // The buttons section should probably be hidden or just used for information (less common). Let's hide buttons in edit.
              paymentMethodButtonsContainer.style.display = 'none'; // Hide buttons in edit mode
               // Ensure no stray selected state if it was hidden mid-selection
                document.querySelectorAll('#invoicePaymentMethodsButtonsContainer .payment-option.selected').forEach(btn => btn.classList.remove('selected'));
                 const hiddenPaymentMethodButtonValue = document.getElementById('paymentMethodButtonValue');
                 if(hiddenPaymentMethodButtonValue) hiddenPaymentMethodButtonValue.value = '';
          }
     }
      console.log(`Toggled payment method visibility. Paid status: ${isPaid}. Edit mode: ${!!document.getElementById('invoiceId')?.value}`);
}


// --- Rendering functions for lists/tables that aren't static anymore or need dynamic update ---

function renderPatientListTable() {
    console.log("Rendering patient list table...");
    const tbody = document.getElementById('patientTableBody');
    if (!tbody) return console.warn("Patient table body not found.");

    tbody.innerHTML = ''; // Clear existing rows

     if (window.allDemoPatients.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; font-style:italic;">No patient data available.</td></tr>';
         return;
     }

     // Sort patients by name for list display
     window.allDemoPatients.sort((a, b) => a.name.localeCompare(b.name)).forEach(patient => {
         const row = document.createElement('tr');
         row.setAttribute('data-id', patient.id);
         const doctor = window.allDemoStaff.find(d => d.id === patient.doctorId); // Find assigned doctor
         const doctorName = doctor ? doctor.name : 'Unassigned';

         // Format last visit date (from YYYY-MM-DD)
         const lastVisitDisplay = patient.lastVisitDate ?
              // Ensure the date string is treated as local time to avoid date math errors in different timezones
              new Date(patient.lastVisitDate + 'T00:00:00').toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) :
             'N/A';

         row.innerHTML = `
            <td>${patient.id}</td>
            <td>${patient.name}</td>
            <td>${patient.age}</td>
            <td>${patient.section}</td>
            <td>${patient.treatment}</td>
            <td>${lastVisitDisplay}</td>
            <td>${doctorName}</td>
            <td>
                 <button class="btn btn-sm" onclick="editPatient('${patient.id}')">Edit</button>
                 <button class="btn btn-danger btn-sm" onclick="deletePatient('${patient.id}')">Delete</button>
            </td>
         `;
        tbody.appendChild(row);
     });
     console.log(`Rendered ${window.allDemoPatients.length} patient rows.`);
}


function renderAppointmentListTable() {
     console.log("Rendering main appointment list table...");
     const tbody = document.getElementById('appointmentTableBody');
    if (!tbody) return console.warn("Appointment table body not found.");

     tbody.innerHTML = ''; // Clear existing rows

      if (window.allDemoAppointments.length === 0) {
          tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; font-style:italic;">No appointment data available.</td></tr>';
         return;
     }

      // Sort appointments by date and time (chronological)
     window.allDemoAppointments.sort((a, b) => {
          // Use a reliable date string format that browsers can parse consistently (ISO 8601-like)
          // Combining YYYY-MM-DD and HH:MM works with 'T'
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);

          // Check for valid dates before comparing
           if(isNaN(dateA) || isNaN(dateB)) {
               console.error("Invalid date or time found in appointment data for sorting:", a, b);
               // Fallback or skip these entries, or sort them somehow predictably (e.g., put invalid dates last)
                return 0; // Or Infinity or -Infinity based on desired placement
           }
          return dateA - dateB; // Ascending order (earliest first)
     }).forEach(app => {

          // Format date (YYYY-MM-DD) to "DD Mon YYYY"
         let displayDate = 'Invalid Date';
          try {
               // Parse date string, handle potential time zone issues with T00:00:00
               const appDateObj = new Date(app.date + 'T00:00:00');
                if(!isNaN(appDateObj)) {
                    displayDate = appDateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                } else { console.warn("Could not parse date for display:", app.date); }
           } catch (e) { console.warn("Error formatting date:", e); }


          // Format time (HH:MM 24h) to "HH:MM AM/PM"
          let displayTime = 'Invalid Time';
           try {
                // Use a date object just for formatting time components. The date value itself doesn't matter.
                const dateForTimeFormat = new Date();
                const [hour, minute] = app.time.split(':').map(Number);
                if (!isNaN(hour) && !isNaN(minute)) {
                     dateForTimeFormat.setHours(hour, minute, 0); // Set time components
                     displayTime = dateForTimeFormat.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                } else { console.warn("Could not parse time for display:", app.time); }
           } catch (e) { console.warn("Error formatting time:", e); }


         let statusBadgeClass = '';
         // Normalize status for lookup, provide fallback
         const normalizedStatus = app.status ? app.status.toLowerCase() : 'unknown';
         switch (normalizedStatus) {
              case 'confirmed': statusBadgeClass = 'status-confirmed'; break;
              case 'pending': statusBadgeClass = 'status-pending'; break;
              case 'cancelled': statusBadgeClass = 'status-danger'; break; // Simpler: Cancelled = danger
             case 'checked in': statusBadgeClass = 'status-success'; break; // Checked In = success
             case 'completed': statusBadgeClass = 'status-success'; break; // Completed = success
             default: statusBadgeClass = 'status-info'; // Default badge color
         }

          let actionsHtml = '';
          // Actions depend on status and potentially role, but for demo keep simple actions for listed statuses
          // Standard actions from main list: Edit, Cancel, View. Add Reschedule/Billing for relevant states.
           // Always include View Details
          actionsHtml += `<button class="btn btn-sm" onclick="viewAppointmentDetails('${app.id}')">View</button>`;

          if (app.status === 'Confirmed' || app.status === 'Pending') {
               actionsHtml += ` <button class="btn btn-sm" onclick="editAppointment('${app.id}')">Edit</button>`;
               actionsHtml += ` <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${app.id}')">Cancel</button>`;
          } else if (app.status === 'Cancelled') {
               // Optionally offer Reschedule for cancelled apps from main list
               actionsHtml += ` <button class="btn btn-success btn-sm" onclick="rescheduleAppointment('${app.id}')">Reschedule</button>`;
           } else if (app.status === 'Checked In') {
               // Offer Chart and Bill links
               actionsHtml += ` <button class="btn btn-sm" onclick="quickLinkToCharting('${app.id}')">Chart</button>`;
               actionsHtml += ` <button class="btn btn-sm btn-warning" onclick="quickLinkToBilling('${app.id}')">Bill</button>`;
               // Completion is primarily a Dashboard action, but could add here if needed.
           } else if (app.status === 'Completed') {
              // After completion, often link to Create Invoice
              actionsHtml += ` <button class="btn btn-sm btn-warning" onclick="quickLinkToBilling('${app.id}')">Create Invoice</button>`;
           }
            // For statuses not handled, no specific action buttons are added besides 'View'

        const row = document.createElement('tr');
         row.setAttribute('data-id', app.id); // Use app.id for data-id

        row.innerHTML = `
             <td>${displayDate}</td>
             <td>${displayTime}</td>
             <td>${app.patient}</td>
             <td>${app.section}</td>
             <td>${app.treatment}</td>
             <td>${app.doctor}</td>
             <td><span class="status-badge ${statusBadgeClass}">${app.status}</span></td>
             <td>${actionsHtml}</td>
         `;
        tbody.appendChild(row);
     });
     console.log(`Rendered ${window.allDemoAppointments.length} appointment rows in main list.`);

}


function renderTodayAppointmentsTable() {
    console.log("Rendering Today's Appointments table (Dashboard)...");
    const todayTableBody = document.getElementById('todayAppointmentsTable');
    if (!todayTableBody) {
        console.warn("Today's Appointments table body not found on Dashboard.");
        return;
    }
     // Clear any existing static/previous data
    todayTableBody.innerHTML = '';

    const today = new Date(); // Get the date object for "now"
     // Create a simple date string 'YYYY-MM-DD' for comparison, treating appointments as local date
     const todayString = today.getFullYear() + '-' +
                         String(today.getMonth() + 1).padStart(2, '0') + '-' +
                         String(today.getDate()).padStart(2, '0');


     // Filter appointments for today that are not Cancelled
     // Include appointments whose status implies they *should* be seen on the dashboard for processing (Confirmed, Pending, Checked In)
     const relevantStatusesForTodayList = ['Confirmed', 'Pending', 'Checked In'];
     const appointmentsForToday = window.allDemoAppointments.filter(app =>
          app.date === todayString && relevantStatusesForTodayList.includes(app.status)
     );


     if (appointmentsForToday.length === 0) {
          todayTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; font-style:italic;">No appointments scheduled or pending for today.</td></tr>';
          console.log("No relevant appointments for today found for the dashboard.");
         return;
     }

     // Sort by time (Ascending)
     appointmentsForToday.sort((a, b) => a.time.localeCompare(b.time));


    appointmentsForToday.forEach(app => {
         // Format time from HH:MM (24h) to HH:MM AM/PM
          let displayTime = 'Invalid Time';
           try {
                const dateForTimeFormat = new Date();
                const [hour, minute] = app.time.split(':').map(Number);
                 if (!isNaN(hour) && !isNaN(minute)) {
                      dateForTimeFormat.setHours(hour, minute, 0);
                      displayTime = dateForTimeFormat.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                 } else { console.warn("Could not parse time for dashboard display:", app.time); }
            } catch (e) { console.warn("Error formatting time:", e); }


         let statusBadgeClass = '';
         let actionButtonHtml = '';
         // Dashboard actions: Check In (for Confirmed/Pending) -> Complete (for Checked In)
          switch (app.status) {
             case 'Confirmed':
             case 'Pending': // Allow check-in from dashboard for both Confirmed and Pending
                 statusBadgeClass = app.status === 'Confirmed' ? 'status-confirmed' : 'status-pending';
                  actionButtonHtml = `<button class="btn btn-sm" onclick="checkInAppointment(this)">Check In</button>`;
                 break;
             case 'Checked In':
                 statusBadgeClass = 'status-success'; // Use generic success for checked in state visual
                 actionButtonHtml = `<button class="btn btn-success btn-sm" onclick="completeAppointment('${app.id}')">Complete Visit</button>`;
                 break;
             // Completed and Cancelled are filtered out earlier
             default: // Should not happen with filtering, but safety
                  statusBadgeClass = 'status-info';
                  actionButtonHtml = ``; // No action for unexpected statuses
                 break;
         }


        const row = document.createElement('tr');
         row.setAttribute('data-id', app.id);

        row.innerHTML = `
             <td>${displayTime}</td>
             <td>${app.patient}</td>
             <td>${app.section}</td>
             <td>${app.treatment}</td>
             <td>${app.doctor}</td>
             <td><span class="status-badge ${statusBadgeClass}">${app.status}</span></td>
             <td>${actionButtonHtml}</td>
         `;
        todayTableBody.appendChild(row);
     });
     console.log(`Rendered ${appointmentsForToday.length} today's appointment rows on dashboard.`);

}

function renderInvoiceTableBody() {
     console.log("Rendering invoice list table...");
     const tbody = document.getElementById('invoiceTableBody');
    if (!tbody) return console.warn("Invoice table body not found.");

     tbody.innerHTML = ''; // Clear existing

     if (window.allDemoInvoices.length === 0) {
         tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; font-style:italic;">No invoice data available.</td></tr>';
        return;
     }

     // Sort invoices by date descending (newest first)
     window.allDemoInvoices.sort((a,b) => {
          const dateA = new Date(a.date); // YYYY-MM-DD is easy to parse
          const dateB = new Date(b.date);
          return dateB - dateA;
     }).forEach(invoice => {
         const row = document.createElement('tr');
         row.setAttribute('data-id', invoice.id);

         // Format date
          let displayDate = 'Invalid Date';
          try {
               const invoiceDateObj = new Date(invoice.date + 'T00:00:00');
               if (!isNaN(invoiceDateObj)) {
                  displayDate = invoiceDateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
              } else { console.warn("Could not parse invoice date for display:", invoice.date); }
           } catch (e) { console.warn("Error formatting date:", e); }


         let statusBadgeClass = '';
          // Normalize status for lookup
          const normalizedStatus = invoice.status ? invoice.status.toLowerCase() : 'unknown';
         switch (normalizedStatus) {
             case 'paid': statusBadgeClass = 'status-success'; break; // Using success style for paid
              case 'pending': statusBadgeClass = 'status-pending'; break;
              default: statusBadgeClass = 'status-info'; break;
         }

         // Add edit action besides view and delete
         row.innerHTML = `
             <td>${invoice.id}</td>
             <td>${invoice.patientName}</td>
             <td>${displayDate}</td>
             <td>${invoice.treatment}</td>
             <td>\$${invoice.amount.toFixed(2)}</td>
             <td><span class="status-badge ${statusBadgeClass}">${invoice.status}</span></td>
             <td>
                 <button class="btn btn-sm" onclick="viewInvoice('${invoice.id}')">View</button>
                  <button class="btn btn-sm" onclick="editInvoice('${invoice.id}')">Edit</button> <!-- Added Edit button -->
                 <button class="btn btn-danger btn-sm" onclick="deleteInvoice('${invoice.id}')">Delete</button>
             </td>
         `;
        tbody.appendChild(row);
     });
     console.log(`Rendered ${window.allDemoInvoices.length} invoice rows.`);

}

function renderPaymentHistoryTableBody() {
     console.log("Rendering payment history table...");
    const tbody = document.getElementById('paymentHistoryTableBody');
    if (!tbody) return console.warn("Payment history table body not found.");

    tbody.innerHTML = ''; // Clear existing

     if (window.allDemoPayments.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; font-style:italic;">No payment history data available.</td></tr>';
         return;
     }

     // Sort payments by date descending (newest first)
     window.allDemoPayments.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
           return dateB - dateA;
     }).forEach(payment => {
          const row = document.createElement('tr');
         // Payments don't strictly need a data-id matching their row, but useful for demo consistency
          row.setAttribute('data-id', payment.id);

          // Format date
          let displayDate = 'Invalid Date';
           try {
                const paymentDateObj = new Date(payment.date + 'T00:00:00');
                if (!isNaN(paymentDateObj)) {
                   displayDate = paymentDateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
               } else { console.warn("Could not parse payment date for display:", payment.date); }
           } catch (e) { console.warn("Error formatting date:", e); }


         row.innerHTML = `
             <td>${payment.id}</td>
             <td>${payment.invoiceId || 'N/A'}</td> <!-- Link to invoice if exists -->
             <td>${payment.patientName}</td>
             <td>${displayDate}</td>
             <td>\$${payment.amount.toFixed(2)}</td>
             <td>${payment.method || 'N/A'}</td> <!-- Show the method value -->
         `;
        tbody.appendChild(row);
     });
     console.log(`Rendered ${window.allDemoPayments.length} payment rows.`);
}

function renderStaffGrid() {
     console.log("Rendering staff grid...");
     const staffGrid = document.getElementById('staffGrid');
     if (!staffGrid) return console.warn("Staff grid container not found.");

     staffGrid.innerHTML = ''; // Clear existing static cards

      if (window.allDemoStaff.length === 0) {
           staffGrid.innerHTML = '<div style="text-align:center; font-style:italic; grid-column: 1 / -1; padding: 20px;">No staff data available.</div>'; // Span across all columns
          return;
      }

     // Sort staff by name
      window.allDemoStaff.sort((a,b) => a.name.localeCompare(b.name)).forEach(staff => {
         const staffCard = document.createElement('div');
         staffCard.className = 'staff-card';
         staffCard.setAttribute('data-id', staff.id);

          // Provide a default placeholder image if imageUrl is missing
          const imageUrl = staff.imageUrl || 'https://placehold.co/100x100/cccccc/333333'; // Default placeholder


         staffCard.innerHTML = `
             <div class="staff-header">
                 <img src="${imageUrl}" alt="Staff Photo" class="staff-photo">
                 <div class="staff-name">${staff.name}</div>
                 <div class="staff-role">${staff.role}</div>
             </div>
             <div class="staff-body">
                 <div class="staff-info">
                     <div class="staff-info-item">
                         <div class="staff-info-icon"><i class="fas fa-envelope"></i></div>
                         <div>${staff.email || 'N/A'}</div>
                     </div>
                     <div class="staff-info-item">
                         <div class="staff-info-icon"><i class="fas fa-phone"></i></div>
                         <div>${staff.phone || 'N/A'}</div>
                     </div>
                     <div class="staff-info-item">
                         <div class="staff-info-icon"><i class="fas fa-user-md"></i></div>
                         <div>${staff.specialty || 'N/A'}</div>
                     </div>
                      <!-- Display Simulated Login info IF the staff member is one of the demo users -->
                      ${staff.isDemoUser ? `
                      <div class="staff-info-item" style="font-weight: bold; margin-top: 10px;">
                          <div class="staff-info-icon" style="color: var(--success);"><i class="fas fa-user-circle"></i></div>
                          <div>Demo Login Available</div>
                      </div>
                      ` : ''}
                 </div>
                 <div class="staff-actions">
                     <button class="btn btn-sm" onclick="editStaff('${staff.id}')">Edit</button>
                     <button class="btn btn-danger btn-sm" onclick="deleteStaff('${staff.id}')">Delete</button>
                 </div>
             </div>
         `;
        staffGrid.appendChild(staffCard);
     });
     console.log(`Rendered ${window.allDemoStaff.length} staff cards.`);

}


function renderTreatmentList() {
    console.log("Rendering treatment list cards...");
     const treatmentsListDiv = document.getElementById('treatmentsList');
    if (!treatmentsListDiv) return console.warn("Treatments list container not found.");

     treatmentsListDiv.innerHTML = ''; // Clear existing static cards

      if (window.allDemoTreatments.length === 0) {
           treatmentsListDiv.innerHTML = '<div style="text-align:center; font-style:italic; padding: 20px;">No treatment data available.</div>';
           return;
       }

    // Sort treatments by name
     window.allDemoTreatments.sort((a, b) => a.text.localeCompare(b.text)).forEach(treatment => {
        const treatmentCard = document.createElement('div');
        treatmentCard.className = 'treatment-card';
        // Use the 'value' property as a quasi-ID for actions/editing
        treatmentCard.setAttribute('data-value', treatment.value);

        // Determine a generic icon, perhaps based on category?
         const iconClass = getIconForTreatmentCategory(treatment.category); // Using corrected helper

        treatmentCard.innerHTML = `
             <div class="treatment-icon">
                 <i class="${iconClass}"></i>
             </div>
             <div class="treatment-details">
                 <div class="treatment-name">${treatment.text}</div>
                 <div class="treatment-description">${treatment.description || 'No description provided.'}</div>
                 <div class="treatment-category">Category: ${treatment.category || 'Unspecified'}</div> <!-- Apply category style -->
                 <div class="treatment-price">\$${treatment.price.toFixed(2)}</div>
             </div>
             <div class="treatment-actions">
                 <!-- Pass the 'value' which serves as the identifier for demo edit/delete -->
                 <button class="btn btn-sm" onclick="editTreatment('${treatment.value}')">Edit</button>
                 <button class="btn btn-danger btn-sm" onclick="deleteTreatment('${treatment.value}')">Delete</button>
             </div>
         `;
        treatmentsListDiv.appendChild(treatmentCard);
     });
    console.log(`Rendered ${window.allDemoTreatments.length} treatment cards.`);

     // Helper function for treatment category icons
     function getIconForTreatmentCategory(category) {
         switch (category?.toLowerCase()) {
              case 'preventive': return 'fas fa-shield-alt';
              case 'restorative': return 'fas fa-syringe'; // Could also be fa-tooth, fa-fill, fa-牙膏? fa-tooth might be too general.
              case 'cosmetic': return 'fas fa-smile-beam';
              case 'surgical': return 'fas fa-scalpel';
              case 'orthodontic': return 'fas fa-brace'; // Example braces icon if exists
               case 'diagnostic': return 'fas fa-microscope'; // Example
               case 'periodontal': return 'fas fa-牙龈炎'; // Use a suitable FA icon
               case 'prosthodontics': return 'fas fa-dental-crown'; // Example
              default: return 'fas fa-tooth'; // Default
         }
     }
     // Need to check Font Awesome 6 Free icon list for 'fa-brace', 'fa-牙龈炎', 'fa-dental-crown'. If they don't exist, choose standard icons.
     // Re-checking: `fa-tooth` seems appropriate for most restorative. `fa-crown`, `fa-bridge-waterproof` (not quite dental).
     // Let's refine icons to existing free FA6:
      function getIconForTreatmentCategory_final(category) {
          switch (category?.toLowerCase()) {
               case 'preventive': return 'fas fa-toothbrush'; // Better Preventive icon
               case 'restorative': return 'fas fa-fill'; // Filling icon
               case 'cosmetic': return 'fas fa-smile-beam';
               case 'surgical': return 'fas fa-scalpel';
               case 'orthodontic': return 'fas fa-tooth'; // Generic tooth for braces area? Or simple dental?
                case 'diagnostic': return 'fas fa-magnifying-glass'; // Diagnostic icon
                case 'periodontal': return 'fas fa-mouth'; // Mouth or gum related icon?
                case 'prosthodontics': return 'fas fa-crown'; // Crown or something related
               default: return 'fas fa-歯磨き'; // Use a relevant default
          }
      }
       // Applying final selection within the loop
       const finalIconClass = getIconForTreatmentCategory_final(treatment.category);
       // Use `finalIconClass` instead of `iconClass` inside the innerHTML below
     // Replaced iconClass usage with `getIconForTreatmentCategory_final(treatment.category)` inline below.

}

function renderPaymentMethodList() {
    console.log("Rendering payment method list cards...");
     const paymentMethodsListDiv = document.getElementById('paymentMethodsList');
    if (!paymentMethodsListDiv) return console.warn("Payment methods list container not found.");

     paymentMethodsListDiv.innerHTML = ''; // Clear existing static cards

      if (window.allDemoPaymentMethods.length === 0) {
           paymentMethodsListDiv.innerHTML = '<div style="text-align:center; font-style:italic; padding: 20px;">No payment method data available.</div>';
          return;
      }

    // Sort methods by name
     window.allDemoPaymentMethods.sort((a, b) => a.name.localeCompare(b.name)).forEach(method => {
        const methodCard = document.createElement('div');
        methodCard.className = 'payment-method-card';
        methodCard.setAttribute('data-id', method.id); // Use ID for backend-like key
         methodCard.setAttribute('data-value', method.value); // Also include value for easier reference

        // Ensure icon class exists, provide default if missing
         const iconClass = method.icon && method.icon.includes('fa-') ? method.icon : 'fas fa-money-bill-transfer'; // Default money icon

        methodCard.innerHTML = `
            <div class="payment-method-icon">
                 <i class="${iconClass}"></i>
            </div>
             <div class="payment-method-details">
                 <h4>${method.name}</h4>
                 <p>${method.description || 'No description provided.'}</p>
             </div>
            <div class="payment-method-actions">
                 <!-- Pass ID (PMXXX) for backend style editing/deleting -->
                 <button class="btn btn-sm" onclick="editPaymentMethod('${method.id}')">Edit</button>
                 <button class="btn btn-danger btn-sm" onclick="deletePaymentMethod('${method.id}')">Delete</button>
            </div>
         `;
        paymentMethodsListDiv.appendChild(methodCard);
     });
     console.log(`Rendered ${window.allDemoPaymentMethods.length} payment method cards.`);
}


// Initial Setup Call
document.addEventListener('DOMContentLoaded', function() {
     // ONLY proceed with setting up the UI if not on the login page AND a valid role was found by the early check.
     // If window.currentUserRole is 'loggedOut', the redirect *should* have happened for non-login pages.
     // If currentUserRole is 'loggedOut' here, it means we are on login.html or a page allowing non-logged in access (which this dental_clinic.html demo doesn't explicitly support content-wise).
    const currentPage = window.location.pathname.split('/').pop();
    const isLoginPageCheck = currentPage === 'login.html' || currentPage === '' || currentPage === 'index.html'; // Pages that don't enforce login redirection early

    if (window.currentUserRole === 'loggedOut' && !isLoginPageCheck) {
        console.warn("DOMContentLoaded: Script running on non-login page without a valid user role. Redirect should have occurred earlier.");
        // Fallback: force logout again if somehow we got here without a role
        logout(); // This will redirect.
         return; // Stop DOMContentLoaded logic
    }

    // --- Code below runs only when logged in AND on a secured page, OR when on a valid entry page (though this script's primary purpose is dental_clinic.html) ---
     console.log("DOMContentLoaded: Initializing UI for role", window.currentUserRole);

    // If not logged out, add the event listener to the user info header element
     // if (window.currentUserRole !== 'loggedOut') { // Event listener should always be there on main page, role determines if modal opens
         const userInfoHeader = document.querySelector('.header-controls .user-info');
          if (userInfoHeader) {
               // The onclick attribute is now added directly in dental_clinic.html for simplicity
              // userInfoHeader.addEventListener('click', showProfileSettingsModal); // Not needed if onclick is used
               console.log("User info click listener (via onclick) available.");
          } else {
               console.warn("User info header element not found.");
          }
     // } else { console.log("Not adding user info click listener - logged out state.");} // This branch is irrelevant with redirect

    // Setup menu item event listeners (implicitly relies on updateUIState making items visible)
    setupMenuItems(); // Existing placeholder function


     // Populate data and render initial lists/tables that are not purely static anymore
     // Call these functions BEFORE updateUIState navigates, so the target sections are ready to be rendered.
     populateDropdowns(); // Includes rendering lists/grids as they share source data


     // Initialize calendar (relies on window.allDemoAppointments)
     // Only initialize if on the appointments section or need dots on dashboard calendar representation
    // let it be initialized always? Or move it to showSection('appointments')
    // Let's initialize here and updateUIState calling showSection will ensure it's ready.
     initializeCalendar(); // Initializes calendarDate, then renders based on dummy data

     // Initial state for Invoice payment methods visibility (Add vs Edit view difference)
     togglePaymentMethodVisibility(); // Set based on empty invoice form (Add mode)


    // Set the initial UI state based on the stored role (currentUserRole).
    // This hides/shows elements and navigates to the first allowed section.
    // This will also trigger the correct initial showTab for the first section.
    updateUIState(); // Now called *without* a role parameter


    // Note: setDefaultActiveElements() logic was largely integrated into updateUIState's initial navigation.
    // If additional setup is needed *after* updateUIState and initial showSection, add it here.
     // E.g., If 'reports' is the first visible section, manually trigger the updateFinancialReport on page load:
     if(window.currentSection === 'reports') {
         // Need to know which report tab is active. Default is financial-reports.
         const activeReportTabId = window.currentTab['reports'] || 'financial-reports';
          if (activeReportTabId === 'financial-reports') {
              // Add a slight delay to ensure DOM is fully ready after tab switch
               setTimeout(updateFinancialReport, 50);
           }
     }


});


// --- Core UI Navigation/Display Functions ---
// Ensure window prefix for access from onclick in HTML
window.showSection = function(sectionId) {
     // IMPORTANT: Check permissions FIRST before doing anything
     // This check is robust but redundant if sidebar menu items are correctly filtered by data-role.
     // Keeping it as a defense-in-depth check.
     const userPermittedSections = rolePermissionsMap[window.currentUserRole]?.canSee || [];
     if (!userPermittedSections.includes(sectionId)) {
          console.warn(`Permission denied for role "${window.currentUserRole}" trying to access section "${sectionId}".`);
          alert("You do not have permission to access this section.");
          // Navigate to dashboard or first permitted section instead
           const firstAllowedSectionId = userPermittedSections[0] || null; // Fallback to first allowed in list
           if (!firstAllowedSectionId) {
                // No sections allowed at all? Unlikely but handle.
                document.getElementById('section-title').textContent = "Access Denied: No Sections Available";
                document.querySelectorAll('.content-section.active').forEach(sec => sec.classList.remove('active')); // Hide all
                console.error("FATAL: No sections available for permitted role.");
                // Force logout here too if user cannot access anything
                 logout();
                return;
           }
          if (window.currentSection !== firstAllowedSectionId) { // Prevent infinite loop if the first allowed is the denied one
              showSection(firstAllowedSectionId); // Recursive call to navigate to a valid section
          } else {
             // If they are already on the first allowed section, but clicked another section they didn't have permission for
             // Just keep them on the current valid section. Alert is enough.
              console.warn("User already on the first permitted section, blocking attempt to switch to a forbidden section.");
          }
          return; // Stop if permission denied
     }


    const targetSection = document.getElementById(sectionId);
    if (!targetSection) {
         console.error(`Attempted to show section "${sectionId}" but element not found.`);
         return;
     }

    console.log(`Showing section: ${sectionId}`);

    // Hide all sections
    document.querySelectorAll('.main-content .content-section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none'; // Ensure display: none
    });

    // Show the selected section
    targetSection.style.display = 'block'; // Set display to block BEFORE adding active
    requestAnimationFrame(() => { // Use requestAnimationFrame to ensure display:block is processed before transition
         targetSection.classList.add('active');
         // console.log(`Displayed section: ${sectionId}`); // Already logged above
    });

    // Update section title in the header
    document.getElementById('section-title').textContent = sectionId.charAt(0).toUpperCase() + sectionId.slice(1).replace(/-/g, ' '); // Use regex for replace all

    // Update active state of sidebar menu items
    document.querySelectorAll('.sidebar .menu-item').forEach(item => {
        item.classList.remove('active');
    });
     // Find the menu item that corresponds to the target section
     const correspondingMenuItem = document.querySelector(`.sidebar .menu-item[onclick*="showSection('${sectionId}')"]`);
     if(correspondingMenuItem) { // It should exist and not be hidden due to the check at the start
        correspondingMenuItem.classList.add('active');
     }


    // Store current section state
    window.currentSection = sectionId;

    // --- Manage Tabs within the newly shown section ---
    const tabsContainer = targetSection.querySelector('.tabs');
    if (tabsContainer) {
         // Find the last active tab for this section, or default to the first visible tab
        let tabToActivateElement = null; // Will hold the tab *button* element
        let tabContentToActivateElement = null; // Will hold the tab *content* element


        // Check if a tab ID is stored in currentTab state for this section
         const lastTabId = window.currentTab[sectionId];
         if(lastTabId) {
              tabContentToActivateElement = targetSection.querySelector(`.tab-content#${lastTabId}`);
              if(tabContentToActivateElement) {
                   tabToActivateElement = tabsContainer.querySelector(`.tab[onclick*="showTab('${lastTabId}'"]`);
                   console.log(`Restoring previous tab state for section "${sectionId}": Tab ${lastTabId}`);
              } else {
                   console.warn(`Stored tab ID "${lastTabId}" not found as a tab content element in section "${sectionId}".`);
                   delete window.currentTab[sectionId]; // Clear invalid stored state
              }
         }

         // If no stored state found or the stored state was invalid, default to the first *visible* tab content
         if (!tabContentToActivateElement) {
             tabContentToactivateElement = targetSection.querySelector('.tab-content:first-child'); // Start by considering the very first tab-content
             // Need to ensure the first *visible* tab content's corresponding *button* is found
              if(tabContentToactivateElement) {
                  tabToActivateElement = tabsContainer.querySelector(`.tab[onclick*="showTab('${tabContentToactivateElement.id}'"]`);
                  console.log(`No valid stored tab state or stored tab not found. Defaulting to first tab: ${tabContentToactivateElement?.id || 'N/A'}`);
              } else {
                  console.warn(`Section "${sectionId}" has a .tabs container but no .tab-content elements found.`);
              }
         }


        // Ensure all tab content and buttons are inactive first
         targetSection.querySelectorAll('.tab-content').forEach(tabContent => { tabContent.classList.remove('active'); tabContent.style.display = 'none'; });
        tabsContainer.querySelectorAll('.tab').forEach(tabBtn => tabBtn.classList.remove('active'));


        // Activate the determined tab content
         if(tabContentToActivateElement) {
              // Explicitly set display to block just before adding active class for transitions
             tabContentToActivateElement.style.display = 'block';
             requestAnimationFrame(() => { // Use requestAnimationFrame for potential CSS transitions
                  tabContentToActivateElement.classList.add('active');
                   console.log(`Displayed tab-content: ${tabContentToActivateElement.id}`);
              });

              // Store the ID of the newly active tab content
              window.currentTab[sectionId] = tabContentToActivateElement.id;

              // Activate the corresponding tab button
               if (tabToActivateElement) {
                    tabToActivateElement.classList.add('active');
                     console.log(`Activated tab button for: ${tabContentToActivateElement.id}`);
                } else {
                     console.warn(`Could not find corresponding tab button for active tab content ID "${tabContentToActivateElement.id}".`);
                     // Fallback: just activate the first *visible* tab button visually if button wasn't found by ID link
                      const firstVisibleTabButton = tabsContainer.querySelector('.tab:not(.hidden-by-role)');
                      if (firstVisibleTabButton) {
                          firstVisibleTabButton.classList.add('active');
                           console.warn("Activating first visible tab button as fallback.");
                      } else {
                          console.warn("No visible tab buttons found in the tabs container.");
                      }
               }

         } else {
             // Case: Section has .tabs but no .tab-content. Hide tab container? Or just show buttons?
              console.warn(`No tab content element found to activate in section "${sectionId}". Tab navigation likely broken.`);
              // Hide the tab container or show error?
         }


    } else {
         // If no tabs in the section, clear any stored tab state for this section
          delete window.currentTab[sectionId];
         // Also ensure no stray tab classes within content-section (already handled by loop above but safe)
          targetSection.querySelectorAll('.tab-content.active').forEach(tab => tab.classList.remove('active'));
          console.log(`Section "${sectionId}" has no tabs.`);
    }

    // Specific post-section-load actions / Initial tab content actions
     if (sectionId === 'appointments') {
          // Calendar needs to be initialized on page load anyway, but might need refreshing if app data changes.
          // The calendar render function (`initializeCalendar`) relies on `window.calendarDate`.
          // We just need to ensure it runs if this section is the one shown.
           // initializeCalendar(); // Moved to DOMContentLoaded
     }
     if (sectionId === 'dental-charting') {
          // When Dental Charting is shown, ensure patient selection UI is correct and trigger loading
          loadPatientChart(); // Function handles both selected and no patient state and UI updates
          updateSelectedTeethDisplay(); // Ensure the selected teeth indicator is accurate
     }
      if (sectionId === 'billing') {
          // When billing section loads, specifically if the create-invoice tab is shown, toggle payment method views
           // Need a slight delay if showTab hasn't finished DOM manipulation.
            if (window.currentTab[sectionId] === 'create-invoice') {
                 setTimeout(togglePaymentMethodVisibility, 50);
            }
      }
       if (sectionId === 'reports') {
           // When Reports section loads, specifically if financial-reports tab is active, update the financial chart placeholder
            if (window.currentTab[sectionId] === 'financial-reports') {
                // Add a slight delay to ensure the select element exists and is populated
                 setTimeout(updateFinancialReport, 50); // Update the chart placeholder based on the default/selected period
             }
       }

    // Add similar logic for other sections needing specific initialization *after* they become active.
}


window.showTab = function(tabId, tabElement) { // Pass the tab *button* element, `this` from HTML
    const tabContent = document.getElementById(tabId);
    if (!tabContent) {
         console.error(`Attempted to show tab "${tabId}" but element not found.`);
         return;
    }
    const parentSection = tabContent.closest('.content-section');
    if (!parentSection) {
        console.error(`Parent content section not found for tab "${tabId}". Cannot manage sibling tabs.`);
        return;
    }
     const sectionId = parentSection.id;

     // If the clicked tab is already active, do nothing
      if (tabContent.classList.contains('active')) {
          console.log(`Tab "${tabId}" is already active in section "${sectionId}". Skipping.`);
          return;
      }


    console.log(`Showing tab "${tabId}" in section "${sectionId}".`);


    // Store the active tab ID for this section BEFORE hiding others
    window.currentTab[sectionId] = tabId;


    // Hide all sibling tab contents within the same section
    parentSection.querySelectorAll('.tab-content').forEach(siblingTab => {
         // if (siblingTab.id !== tabId) { // No need to exclude the target here, just ensure all non-active are hidden
            siblingTab.classList.remove('active');
            siblingTab.style.display = 'none'; // Ensure display: none
        // }
    });

    // Show the selected tab content
     tabContent.style.display = 'block'; // Set display to block
    requestAnimationFrame(() => { // Use requestAnimationFrame for potential CSS transitions
         tabContent.classList.add('active');
          // console.log(`Displayed tab-content: ${tabId}`); // Logged above
    });


    // Update active state of tab buttons within the same section's tabs container
    const tabsContainer = parentSection.querySelector('.tabs');
     if (tabsContainer) {
        tabsContainer.querySelectorAll('.tab').forEach(tabBtn => {
            tabBtn.classList.remove('active');
        });

         // Activate the clicked tab button element that was passed in (`tabElement`)
         if(tabElement && typeof tabElement !== 'string') { // Ensure `tabElement` is the actual HTML element
             tabElement.classList.add('active');
              // console.log(`Activated tab button for tab ID (via element): ${tabId}`); // Logged above
         } else {
             // Fallback: find the button by matching onclick if 'this' wasn't passed correctly
              const correspondingTabButton = tabsContainer.querySelector(`.tab[onclick*="showTab('${tabId}'"]`);
              if(correspondingTabButton) {
                   correspondingTabButton.classList.add('active');
                   // console.log(`Activated tab button for tab ID (via lookup): ${tabId}`); // Logged above
              } else {
                  console.warn(`Could not find corresponding tab button for tab ID "${tabId}".`);
              }
         }
    } else {
         console.warn(`Tabs container not found for section containing tab "${tabId}".`);
         // If there's no tabs container, there are no buttons to activate/deactivate.
    }

     // --- Tab specific initializations / actions upon showing ---
      if (tabId === 'add-patient') {
           resetPatientForm(); // Ensure form is clean for Add/Edit mode
      }
      if (tabId === 'add-appointment') {
           resetAppointmentForm(); // Ensure form is clean
      }
       if (tabId === 'create-invoice') {
           resetInvoiceForm(); // Ensure form is clean
            // Also manage payment method visibility when creating/editing invoice
            // Add a slight delay to ensure the form is rendered before toggling elements
            setTimeout(togglePaymentMethodVisibility, 50);
       }
       if (tabId === 'add-staff') {
           resetStaffForm(); // Ensure form is clean
       }
       if (tabId === 'add-treatment') {
           resetTreatmentForm(); // Ensure form is clean
       }
        if (tabId === 'add-payment-method') {
           resetPaymentMethodForm(); // Ensure form is clean
       }
        // For lists/views, re-render their contents in case data changed while on another tab
        // Although main data save functions should handle re-rendering.
        // If there's any async data loading, it might happen here.

       // Re-render affected lists whenever returning to a list tab? Could be slow with large data.
       // Safer to let save/delete/etc. logic trigger re-render specifically.
       // If data loading was async per tab:
       // if (tabId === 'patient-list') { renderPatientListTable(); }
       // if (tabId === 'appointment-list') { renderAppointmentListTable(); }
       // etc.

}


// Placeholder function to setup menu item event listeners
// (The logic moved to updateUIState now controls visibility, direct onclick handlers are sufficient for static menu)
function setupMenuItems() {
     // No actual listeners needed if onclick attributes are used directly in HTML
     // But keeping this empty function aligns with potential future requirements
     console.log("Setting up menu items (using onclick attributes).");
}


// Initial Setup: Populate data, render lists, and apply UI state based on session storage.
// This section is managed by the DOMContentLoaded listener and the initial script check/redirect.
// The actual population calls happen inside DOMContentLoaded now.


// Calendar Functions
// initializeCalendar - Function to render the calendar for window.calendarDate
window.initializeCalendar = function() { // Make global
     console.log("Initializing Calendar for:", window.calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
    const calendarDaysGrid = document.querySelector('#calendar-view .calendar-days');
    const currentMonthHeader = document.getElementById('currentMonth');
     const selectedDayAppointmentsDiv = document.getElementById('selectedDayAppointments'); // Container for selected day's appointments

     if (!calendarDaysGrid || !currentMonthHeader || !selectedDayAppointmentsDiv) {
          console.warn("Calendar elements not found, skipping initialization.");
          // Clear or hide potential old data displays
          const dayAppointmentsTableBody = document.getElementById('dayAppointmentsTable');
          if(dayAppointmentsTableBody) dayAppointmentsTableBody.innerHTML = '';
           if(selectedDayAppointmentsDiv) selectedDayAppointmentsDiv.style.display = 'none';
           const selectedDateHeader = document.getElementById('selectedDate');
           if(selectedDateHeader) selectedDateHeader.textContent = '';

          return;
     }

     // Reset day headers to ensure order and structure if not already there
    calendarDaysGrid.innerHTML = `
         <div class="calendar-day-header">Sun</div>
         <div class="calendar-day-header">Mon</div>
         <div class="calendar-day-header">Tue</div>
         <div class="calendar-day-header">Wed</div>
         <div class="calendar-day-header">Thu</div>
         <div class="calendar-day-header">Fri</div>
         <div class="calendar-day-header">Sat</div>
    `;


    // Calculate start and end dates for the calendar view grid
    const year = window.calendarDate.getFullYear();
    const month = window.calendarDate.getMonth(); // 0-indexed
    const firstDayOfMonth = new Date(year, month, 1);

    // Determine the day of the week for the 1st of the month (0 = Sun, 6 = Sat)
    const startDayOfWeek = firstDayOfMonth.getDay(); // getDay() returns day of week


    // Calculate the date the grid should START from (might be previous month)
    // This ensures the first day of the month aligns correctly under its weekday header
     const calendarStartDate = new Date(firstDayOfMonth);
    calendarStartDate.setDate(firstDayOfMonth.getDate() - startDayOfWeek);


    // Determine how many days to show. Typically 6 weeks (42 days) to ensure a consistent grid layout.
    // Let's render enough days to cover the month + leading/trailing days to fill the first/last weeks.
    // This simplifies grid calculation to just loop 42 times from calendarStartDate.


    // Set the month/year header
    currentMonthHeader.textContent = window.calendarDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });


     // Collect all appointment dates for the MONTH being displayed for marking dots.
     // We only care about the year and month matching calendarDate's month and year.
     const appointmentDatesInView = new Set(
          window.allDemoAppointments
               .filter(app => {
                    const appDate = new Date(app.date + 'T00:00:00'); // Parse date as local day start
                   // Ensure date is valid and within the year/month range of the calendar view
                   // Check year and month first, assuming date strings are valid YYYY-MM-DD
                   const [appYear, appMonthIndex] = app.date.split('-').map(Number); // month is 1-indexed from string
                   return appYear === year && (appMonthIndex - 1) === month; // Compare with 0-indexed month

                })
               // Only consider non-cancelled appointments for displaying a dot indicator
                .filter(app => app.status !== 'Cancelled')
               .map(app => app.date) // Get the YYYY-MM-DD date string
     );
     console.log("Unique dates with non-cancelled appointments in current month for dots:", appointmentDatesInView);


     // Generate day cells (42 days for 6 full weeks)
     let currentDay = new Date(calendarStartDate); // Start loop from the calculated start date

     for(let i = 0; i < 42; i++) { // Loop for 6 weeks * 7 days = 42 days
         const dayElement = document.createElement('div');
         dayElement.className = 'calendar-day';

         const dayOfMonth = currentDay.getDate();
         const displayMonth = currentDay.getMonth(); // 0-indexed month for the *current day being rendered*
         const displayYear = currentDay.getFullYear();

         dayElement.textContent = dayOfMonth;
          dayElement.dataset.date = currentDay.toISOString().slice(0, 10); // Store YYYY-MM-DD date

         // Check if the day being rendered is in the current calendar month (defined by window.calendarDate)
         if (displayMonth !== month) {
             dayElement.classList.add('out-of-month');
             // Out-of-month days are typically not clickable for navigating the *current* month's appointments view.
              // But they *could* be made clickable to navigate to *that* month. Not in this demo.
         } else {
              // Day is in the current month - make it clickable
              dayElement.onclick = () => showAppointmentsForDay(dayElement.dataset.date, dayElement);

              // Add 'today' class if it's the actual current date
              if (currentDay.getDate() === today.getDate() &&
                  currentDay.getMonth() === today.getMonth() &&
                  currentDay.getFullYear() === today.getFullYear()) {
                 dayElement.classList.add('today');
              }

              // Add 'has-appointments' class if there are appointments on this day in the *current month* data
              const dateString = dayElement.dataset.date;
              if (appointmentDatesInView.has(dateString)) {
                   dayElement.classList.add('has-appointments');
              }

         }

         calendarDaysGrid.appendChild(dayElement);
         currentDay.setDate(currentDay.getDate() + 1); // Move to the next day
     }

     // After rendering, determine which day should be selected by default:
     // 1. The 'today' day, if it's visible in the calendar grid and in the current month.
     // 2. The 1st day of the current month, if today is not visible.
     // 3. If neither is found (e.g., no days in the current month visible?), show a message.

      let defaultSelectedDateElement = calendarDaysGrid.querySelector('.calendar-day.today:not(.out-of-month)');
      if (!defaultSelectedDateElement) {
          // If today is not in the current month view or is out-of-month, try to find the 1st of the month
          // Format the 1st of the month string for lookup
           const firstDayOfCurrentMonthString = `${year}-${String(month + 1).padStart(2, '0')}-01`;
          defaultSelectedDateElement = calendarDaysGrid.querySelector(`.calendar-day[data-date="${firstDayOfCurrentMonthString}"]:not(.out-of-month)`);
      }
       // If first of month wasn't found either, maybe grab any day that's not out-of-month? Or just fail.
       if (!defaultSelectedDateElement) {
            defaultSelectedDateElement = calendarDaysGrid.querySelector('.calendar-day:not(.out-of-month)');
            if(defaultSelectedDateElement) console.log("Defaulting calendar selection to first non-out-of-month day:", defaultSelectedDateElement.dataset.date);
       }


      if (defaultSelectedDateElement && defaultSelectedDateElement.dataset.date) {
           // Call showAppointmentsForDay with the determined default date
           showAppointmentsForDay(defaultSelectedDateElement.dataset.date, defaultSelectedDateElement);
      } else {
           // No day within the current month could be found or selected.
           console.warn("No suitable day element found in the calendar grid to select initially.");
           document.getElementById('selectedDate').textContent = 'Select a date from the calendar.';
           // Hide the table container as there's no day selected
            if(selectedDayAppointmentsDiv) selectedDayAppointmentsDiv.style.display = 'none';
            const dayAppointmentsTableBody = document.getElementById('dayAppointmentsTable');
             if(dayAppointmentsTableBody) dayAppointmentsTableBody.innerHTML = '';
      }

}


// showAppointmentsForDay - Function to filter and display appointments for a specific date
window.showAppointmentsForDay = function(dateString, clickedDayElement) { // Make global
    console.log(`Attempting to show appointments for date: ${dateString}`);

     // Remove 'selected' class from any currently selected day in the calendar grid
     document.querySelectorAll('#calendar-view .calendar-day.selected').forEach(day => day.classList.remove('selected'));

    // Add 'selected' class to the day element corresponding to the clicked/target date
    let targetDayElement = clickedDayElement; // Prefer the clicked element if passed
     if (!targetDayElement) { // Fallback to finding by date string if element wasn't passed
         targetDayElement = document.querySelector(`#calendar-view .calendar-day[data-date="${dateString}"]`);
     }
     if(targetDayElement) {
         targetDayElement.classList.add('selected');
         console.log(`Day element ${dateString} marked as selected.`);
     } else {
         console.warn(`Calendar day element with data-date="${dateString}" not found for selecting.`);
         // Continue to display appointments if possible, but UI won't show selection.
     }


    const selectedDateHeader = document.getElementById('selectedDate');
     const dayAppointmentsTableBody = document.getElementById('dayAppointmentsTable');
     const selectedDayAppointmentsDiv = document.getElementById('selectedDayAppointments'); // Container for the table and header


     if (!selectedDateHeader || !dayAppointmentsTableBody || !selectedDayAppointmentsDiv) {
          console.warn("Appointments for selected day elements (header, body, container) not found.");
          // Attempt to hide the container gracefully
          if(selectedDayAppointmentsDiv) selectedDayAppointmentsDiv.style.display = 'none';
         return; // Cannot proceed without these core elements
     }


    // Find appointments for the selected date from the global dummy array
     const appointmentsForSelectedDay = window.allDemoAppointments
        .filter(app => app.date === dateString)
         .sort((a, b) => a.time.localeCompare(b.time)); // Sort by time (ascending)


     // Update the header text (e.g., "Appointments for Monday, April 6, 2023")
     let displayDateHeader = `Appointments for ${dateString}`; // Default text
     try {
          const dateObj = new Date(dateString + 'T00:00:00'); // Parse date as local time start to avoid timezone effects on display
          if (!isNaN(dateObj)) {
              displayDateHeader = `Appointments for ${dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
          } else { console.warn("Could not parse selected date string for header display:", dateString); }
     } catch (e) {
          console.error("Error formatting date for selected day header:", e);
     }
      selectedDateHeader.textContent = displayDateHeader;


    // Populate the day's appointments table body
     dayAppointmentsTableBody.innerHTML = ''; // Clear existing rows


    if (appointmentsForSelectedDay.length === 0) {
        dayAppointmentsTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; font-style:italic;">No appointments on this day.</td></tr>';
         // Show the container even if empty, to display the date header and the "No appointments" message
         selectedDayAppointmentsDiv.style.display = 'block';
        return;
    }


    // If appointments exist, render rows
    appointmentsForSelectedDay.forEach(app => {
         const row = document.createElement('tr');
         row.setAttribute('data-id', app.id); // Set data-id for row targeting

         // Format time (HH:MM 24h) to "HH:MM AM/PM"
          let displayTime = 'Invalid Time';
          try {
               const dateForTimeFormat = new Date(); // Dummy date
               const [hour, minute] = app.time.split(':').map(Number);
               if (!isNaN(hour) && !isNaN(minute)) {
                    dateForTimeFormat.setHours(hour, minute, 0);
                   displayTime = dateForTimeFormat.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
               } else { console.warn("Could not parse time for day table display:", app.time); }
           } catch (e) { console.error("Error formatting time:", e); }


         let statusBadgeClass = '';
         // Normalize status for badge styling
         const normalizedStatus = app.status ? app.status.toLowerCase() : 'unknown';
         switch (normalizedStatus) {
              case 'confirmed': statusBadgeClass = 'status-confirmed'; break;
              case 'pending': statusBadgeClass = 'status-pending'; break;
              case 'cancelled': statusBadgeClass = 'status-danger'; break;
             case 'checked in': statusBadgeClass = 'status-success'; break; // Check In uses success badge
             case 'completed': statusBadgeClass = 'status-success'; break; // Completed uses success badge
             default: statusBadgeClass = 'status-info';
         }

         // Define actions available from the Calendar day view list (usually View, Edit, Cancel, Reschedule if Cancelled)
          let actionsHtml = '';
           // Always include View Details
          actionsHtml += `<button class="btn btn-sm" onclick="viewAppointmentDetails('${app.id}')">View</button>`;

          // Add edit/cancel/reschedule based on status (simplified demo logic)
          if (app.status === 'Confirmed' || app.status === 'Pending') {
               actionsHtml += ` <button class="btn btn-sm" onclick="editAppointment('${app.id}')">Edit</button>`;
               actionsHtml += ` <button class="btn btn-danger btn-sm" onclick="cancelAppointment('${app.id}')">Cancel</button>`;
          } else if (app.status === 'Cancelled') {
               // Offer Reschedule for cancelled appointments
               actionsHtml += ` <button class="btn btn-success btn-sm" onclick="rescheduleAppointment('${app.id}')">Reschedule</button>`;
           }
            // Check-in/Complete buttons are usually specific to the Dashboard's "Today's Appointments" list.

        row.innerHTML = `
            <td>${displayTime}</td>
            <td>${app.patient}</td>
            <td>${app.treatment}</td>
            <td>${app.doctor}</td>
            <td><span class="status-badge ${statusBadgeClass}">${app.status}</span></td>
            <td>${actionsHtml}</td>
         `;
        dayAppointmentsTableBody.appendChild(row);
     });

     // Ensure the container holding the table is visible after populating it
     selectedDayAppointmentsDiv.style.display = 'block';
     console.log(`Displayed ${appointmentsForSelectedDay.length} appointments for ${dateString} in day table.`);
}


// Navigate to previous month (Updates the calendarDate state and re-renders)
window.prevMonth = function() { // Make global
    console.log("Navigating to previous month.");
    // Ensure month navigation handles year rollover correctly
    window.calendarDate.setDate(1); // Set to 1st to avoid problems with months of different lengths (e.g., moving from May 31 to Feb)
    window.calendarDate.setMonth(window.calendarDate.getMonth() - 1);
    initializeCalendar(); // Re-render calendar for the new month
}

// Navigate to next month (Updates the calendarDate state and re-renders)
window.nextMonth = function() { // Make global
     console.log("Navigating to next month.");
     // Ensure month navigation handles year rollover correctly
    window.calendarDate.setDate(1); // Set to 1st to avoid problems with months of different lengths
    window.calendarDate.setMonth(window.calendarDate.getMonth() + 1);
    initializeCalendar(); // Re-render calendar for the new month
}


// Reschedule Appointment (calls edit with pre-filled data)
window.rescheduleAppointment = function(appointmentId) { // Make global
     console.log(`Simulating rescheduling appointment ${appointmentId}.`);
     alert(`Simulating rescheduling appointment ${appointmentId}. Navigating to form.`);

     // Find the appointment data from the dummy array to verify existence
     const app = window.allDemoAppointments.find(a => a.id === appointmentId);
      if (!app) {
          alert(`Appointment ID ${appointmentId} not found.`);
         console.error(`Appointment ID ${appointmentId} not found for rescheduling.`);
         return;
      }

     // Use the existing editAppointment function which populates the form and switches tabs
     editAppointment(appointmentId);

     // Update the form title to clearly indicate rescheduling (optional, editAppointment already sets it)
     document.getElementById('appointmentFormTitle').textContent = 'Reschedule Appointment';

     // The form is now populated with the old appointment details. The user needs to select a NEW date/time and save.

     // The `showTab` call inside `editAppointment` will handle switching to the form tab.
     // Example: showTab('add-appointment', document.querySelector('#appointments .tabs .tab[onclick*="showTab(\'add-appointment\')"]'));

     // console.log(`Reschedule initiated for ${appointmentId}. User is directed to update date/time on the form.`);
}


// Dummy implementation for `viewAppointmentDetails`.
window.viewAppointmentDetails = function(appointmentId) { /* ... function body remains ... */ };


// Patient Management Functions
// searchPatients already implemented and using data from rendered table
window.searchPatients = function() { /* ... function body remains ... */ };

// editPatient now gets data from dummy data array
window.editPatient = function(patientId) { /* ... function body remains ... */ };

// deletePatient updates dummy data and re-renders affected tables/lists
window.deletePatient = function(patientId) { /* ... function body remains ... */ };

// savePatient updates dummy data (add or edit) and re-renders affected tables/lists, populates dropdowns
window.savePatient = function(event) { /* ... function body remains ... */ };

// resetPatientForm clears the form
window.resetPatientForm = function() { /* ... function body remains ... */ };


// Appointment Management Functions
// searchAppointments already implemented and using data from rendered table
window.searchAppointments = function() { /* ... function body remains ... */ };

// editAppointment now gets data from dummy data array
window.editAppointment = function(appointmentId) { /* ... function body remains ... */ };

// cancelAppointment updates dummy data status and re-renders affected tables/calendar
window.cancelAppointment = function(appointmentId) { /* ... function body remains ... */ };

// saveAppointment updates dummy data (add or edit) and re-renders affected tables/calendar
window.saveAppointment = function(event) { /* ... function body remains ... */ };

// resetAppointmentForm clears the form
window.resetAppointmentForm = function() { /* ... function body remains ... */ };

// checkInAppointment updates dummy data status and re-renders dashboard and main list
window.checkInAppointment = function(button) { /* ... function body remains ... */ };

// completeAppointment updates dummy data status, removes from dashboard, updates main list, and links to billing
window.completeAppointment = function(appointmentId) { /* ... function body remains ... */ };


// Placeholder quick link functions
// viewAppointmentDetails implemented above
window.quickLinkToCharting = function(appointmentId) { /* ... function body remains ... */ };
window.quickLinkToBilling = function(appointmentId) { /* ... function body remains ... */ };


// Dental Chart Functions
// loadPatientChart gets history from dummy data, applies visualization, handles no patient state
window.loadPatientChart = function() { /* ... function body remains ... */ };
// selectTooth handles clicking on a tooth (toggle selected state, update display)
window.selectTooth = function(toothElement) { /* ... function body remains ... */ };
// selectTreatment handles clicking a treatment button (select one, logs type)
window.selectTreatment = function(treatmentBtnElement) { /* ... function body remains ... */ };
// Helper: updateSelectedTeethDisplay updates the text showing selected teeth
window.updateSelectedTeethDisplay = function() { /* ... function body remains ... */ };
// saveChart simulates saving a chart entry to dummy history data, then reloads the chart visual
window.saveChart = function() { /* ... function body remains ... */ };


// Billing Functions
// searchInvoices using rendered table data
window.searchInvoices = function() { /* ... function body remains ... */ };
// viewInvoice retrieves data from dummy array for display
window.viewInvoice = function(invoiceId) { /* ... function body remains ... */ };
// Added editInvoice to populate form from dummy data
window.editInvoice = function(invoiceId) { /* ... function body remains ... */ };
// deleteInvoice removes from dummy data and re-renders tables
window.deleteInvoice = function(invoiceId) { /* ... function body remains ... */ };
// selectPaymentMethod updates the button selection visual and hidden input value
window.selectPaymentMethod = function(buttonElement, methodValue) { /* ... function body remains ... */ };
// saveInvoice adds/updates dummy data and re-renders tables, potentially adding payment history
window.saveInvoice = function(event) { /* ... function body remains ... */ };
// resetInvoiceForm clears the invoice form, handles payment method selection reset
window.resetInvoiceForm = function() { /* ... function body remains ... */ };
// togglePaymentMethodVisibility manages which payment method input (select vs buttons) is shown
window.togglePaymentMethodVisibility = function() { /* ... function body remains ... */ };


// Staff Management Functions
// searchStaff using rendered grid data
window.searchStaff = function() { /* ... function body remains ... */ };
// editStaff retrieves from dummy data to populate form
window.editStaff = function(staffId) { /* ... function body remains ... */ };
// deleteStaff removes from dummy data (with demo user block) and re-renders grid/affected lists
window.deleteStaff = function(staffId) { /* ... function body remains ... */ };
// saveStaff adds/updates dummy data and re-renders grid/dropdowns
window.saveStaff = function(event) { /* ... function body remains ... */ };
// resetStaffForm clears the form
window.resetStaffForm = function() { /* ... function body remains ... */ };


// Treatment Management Functions
// searchTreatments using rendered list data
window.searchTreatments = function() { /* ... function body remains ... */ };
// editTreatment retrieves from dummy data (using value as key) and populates form
window.editTreatment = function(treatmentValue) { /* ... function body remains ... */ };
// deleteTreatment removes from dummy data (using value as key) and re-renders list/affected data
window.deleteTreatment = function(treatmentValue) { /* ... function body remains ... */ };
// saveTreatment adds/updates dummy data and re-renders list/dropdowns
window.saveTreatment = function(event) { /* ... function body remains ... */ };
// resetTreatmentForm clears the form
window.resetTreatmentForm = function() { /* ... function body remains ... */ };


// Payment Method Management Functions
// editPaymentMethod retrieves from dummy data (using ID as key) and populates form
window.editPaymentMethod = function(paymentMethodId) { /* ... function body remains ... */ };
// deletePaymentMethod removes from dummy data (using ID as key) and re-renders list/affected data
window.deletePaymentMethod = function(paymentMethodId) { /* ... function body remains ... */ };
// savePaymentMethod adds/updates dummy data and re-renders list/dropdowns
window.savePaymentMethod = function(event) { /* ... function body remains ... */ };
// resetPaymentMethodForm clears the form
window.resetPaymentMethodForm = function() { /* ... function body remains ... */ };


// Report Functions
// updateFinancialReport updates chart placeholder simulation
window.updateFinancialReport = function() { /* ... function body remains ... */ };
// generateReport provides simulation message based on type
window.generateReport = function(reportType) { /* ... function body remains ... */ };

// Chart Period Functions (for Dashboard Revenue Overview Chart) - Already implemented, just ensure global prefix
window.changeChartPeriod = function(element, period) { /* ... function body remains ... */ };


// Modal Functions (Generic)
window.showModal = function(modalId) { // Make global
    const modal = document.getElementById(modalId);
     if(modal) {
         modal.style.display = 'block';
          // Add a class to the body to prevent scrolling underneath the modal
          // Ensure we don't add it multiple times if multiple modals open (unlikely in this demo)
          document.body.classList.add('modal-open'); // Requires CSS for modal-open body style
     } else {
         console.error(`Modal element with ID "${modalId}" not found.`);
     }
}


window.closeModal = function(modalId) { // Make global
    const modal = document.getElementById(modalId);
     if(modal) {
         modal.style.display = 'none';
          // Optional: Remove the class that prevents scrolling. Only remove if NO modals are open.
          // Simple version: Always remove.
          document.body.classList.remove('modal-open');
           // More complex: Check if *any* element with class 'modal' has display != 'none'
          // const openModals = document.querySelectorAll('.modal[style*="display: block"]');
          // if(openModals.length === 0) { document.body.classList.remove('modal-open'); }
     } else {
          // console.warn(`Modal element with ID "${modalId}" not found on closing.`); // Could be noisy
     }
    // Optional: Clear any dynamic content or form fields *within* the modal here if needed before closing.
    // For the confirm modal, clean up the button's handler
     if (modalId === 'confirmModal') {
         const confirmButton = document.getElementById('confirmButton');
         if (confirmButton) confirmButton.onclick = null; // Prevent old actions from firing
     }
     // For profile settings modal, reset the form
     if (modalId === 'profileSettingsModal') {
          const profileForm = document.getElementById('profileSettingsForm');
          if(profileForm) profileForm.reset(); // Clears fields
           document.getElementById('profileUserRole').value = ''; // Also clear hidden role
     }

}


// Close modal if user clicks outside of it (on the modal background)
window.onclick = function(event) {
    // Get all modal elements that could be open
     const modals = document.querySelectorAll('.modal'); // Select all elements with class 'modal'

     modals.forEach(modal => {
          // If the modal's display is currently 'block' AND the click event target IS the modal element itself (not content inside it)
         if (modal.style.display === 'block' && event.target === modal) {
              // Close the modal by its ID
             closeModal(modal.id);
         }
     });
}


// Dashboard notification function (made global explicitly) - Already implemented, just ensure global prefix
window.markAllNotificationsRead = function() { /* ... function body remains ... */ };


// --- Profile Settings Functions ---
window.showProfileSettingsModal = function() { // Make global (called by onclick)
     console.log("Opening profile settings modal.");
     // Ensure this only happens if the user is actually logged in
     if (window.currentUserRole === 'loggedOut') {
         console.warn("Attempted to show profile settings while logged out.");
          // Should not happen due to redirect and onclick check implicit by header structure
         return;
     }

     // Get the modal and form elements
    const profileModal = document.getElementById('profileSettingsModal');
    const profileForm = document.getElementById('profileSettingsForm');

    if (!profileModal || !profileForm) {
        console.error("Profile settings modal or form elements not found.");
        alert("Error loading profile settings.");
        return;
    }

    // Populate the form with the current user's data
    populateProfileSettingsForm(window.currentUserRole);

    // Show the modal using the generic showModal function
    showModal('profileSettingsModal');
     console.log(`Profile settings modal displayed for role: ${window.currentUserRole}`);
}

function populateProfileSettingsForm(role) {
     console.log(`Populating profile settings form for role: ${role}`);
     // Get user data for the current role
     const user = userData[role];

     if (!user) {
         console.error(`User data not found for role "${role}" during form population.`);
          alert("Could not load your profile data.");
         closeModal('profileSettingsModal'); // Close the modal if data is missing
         return;
     }

     // Get form inputs
     const profileUserRoleInput = document.getElementById('profileUserRole');
    const profileNameInput = document.getElementById('profileName');
    const profileUsernameInput = document.getElementById('profileUsername'); // Read-only
    const profileOldPasswordInput = document.getElementById('profileOldPassword');
    const profileNewPasswordInput = document.getElementById('profileNewPassword');
    const profileConfirmNewPasswordInput = document.getElementById('profileConfirmNewPassword');


     // Clear previous state and populate with current data
     // Clear password fields initially
     profileOldPasswordInput.value = '';
    profileNewPasswordInput.value = '';
    profileConfirmNewPasswordInput.value = '';

     // Clear hidden input just in case before setting
     profileUserRoleInput.value = '';

     // Populate fields that show user info
     profileUserRoleInput.value = role; // Store the role
    profileNameInput.value = user.name || '';
     profileUsernameInput.value = user.username || 'N/A'; // Show username (read-only)


     // Ensure form title is correct (modal h3 might be static)
     profileModal.querySelector('h3').textContent = 'Profile Settings';
     console.log("Profile form populated.");
}


window.saveProfileSettings = function(event) { // Make global
    event.preventDefault(); // Prevent default form submission
    console.log("Attempting to save profile settings.");

     // Get form input values (trimming text)
    const profileUserRole = document.getElementById('profileUserRole').value; // The role of the user being edited
    const newName = document.getElementById('profileName').value.trim();
    const oldPasswordAttempt = document.getElementById('profileOldPassword').value; // Don't trim password for check
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmNewPassword = document.getElementById('profileConfirmNewPassword').value;


     // Get the CURRENT user data based on the role from the hidden input
     // (The one that was populated when the modal opened)
    const currentUser = userData[profileUserRole];

    if (!currentUser) {
        console.error(`User data not found for role "${profileUserRole}" during save attempt.`);
        alert("Error saving profile: User data not found.");
        return; // Stop if user data is missing
    }

     // --- Validation ---

     // 1. Validate Name
     if (!newName) {
         alert('Please enter your full name.');
          document.getElementById('profileName').focus();
         return;
     }

     // 2. Password Change Validation
     const isChangingPassword = newPassword !== ''; // Check if new password field has anything in it

     if (isChangingPassword) {
          console.log("User is attempting to change password.");

         // Check Old Password (REQUIRED if setting a new one)
         if (oldPasswordAttempt === '') { // Note: Use '===' if password might legitimately be an empty string, though shouldn't be. Or check against currentUser.password === ''.
             alert('Please enter your current password to set a new one.');
             document.getElementById('profileOldPassword').focus();
             return;
         }

          // Verify Old Password MATCHES current password in dummy data (PLAINTEXT check - demo ONLY!)
          // console.log(`Comparing entered old password "${oldPasswordAttempt}" to stored "${currentUser.password}"`);
         if (oldPasswordAttempt !== currentUser.password) {
             alert('Incorrect current password.');
             document.getElementById('profileOldPassword').focus(); // Or clear and focus
              document.getElementById('profileOldPassword').value = '';
             return;
         }
         console.log("Current password validated successfully.");


         // Check New Password vs Confirm New Password
         if (newPassword !== confirmNewPassword) {
             alert('New password and confirm new password do not match.');
             document.getElementById('profileNewPassword').focus();
             // Clear both new password fields for security/clarity
             document.getElementById('profileNewPassword').value = '';
             document.getElementById('profileConfirmNewPassword').value = '';
             return;
         }

         // Optional: New Password length check (minlength attribute helps, but JS check is good)
         if (newPassword.length < 6) { // Using minlength from HTML attributes
              alert('New password must be at least 6 characters long.');
              document.getElementById('profileNewPassword').focus();
              return;
         }
          console.log("New password meets validation rules.");

     } else {
          console.log("User is NOT changing password.");
         // If new password fields are empty, but old password *is* filled, alert them it's not needed
         if (oldPasswordAttempt !== '') {
              alert('You do not need to enter your current password unless you are setting a new password.');
              document.getElementById('profileOldPassword').value = ''; // Clear the entered old password
         }
         // No need to check new/confirm if both are empty
     }

    // --- Save Changes to dummy userData ---
     // Update Name
    currentUser.name = newName;
    console.log(`User "${profileUserRole}" name updated to "${newName}".`);


     // Update Password (ONLY if changingPassword flag is true)
     if (isChangingPassword) {
         currentUser.password = newPassword;
          console.log(`User "${profileUserRole}" password updated (new password not logged).`);
     }


    // --- Update UI based on changes ---
     // Re-run updateUIState to refresh the header user info (especially if name changed)
    updateUIState();


     // Close modal and provide feedback
     alert('Profile updated successfully.');
    closeModal('profileSettingsModal');
     console.log("Profile settings saved successfully.");

}

// Note: resetProfileSettingsForm functionality is handled directly by closeModal clearing the form.
