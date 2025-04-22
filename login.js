// Ensure script.js loaded before this, so checkLoginCredentials is available
// This script handles the logic ONLY for login.html

// Import Supabase client
import * as supabaseClient from './supabase.js';

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginErrorsDiv = document.getElementById('loginErrors');

    if (!loginForm || !usernameInput || !passwordInput || !loginErrorsDiv) {
        console.error("Login page elements not found. Script cannot function.");
        return; // Stop if elements are missing
    }

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const email = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!email || !password) {
            showLoginError("Please enter both email and password.");
            return;
        }

        try {
            // Attempt to sign in using Supabase
            const { user, session } = await supabaseClient.signIn(email, password);
            
            if (user) {
                // Get user role from user metadata or a separate profile table
                const { data: profile, error: profileError } = await supabaseClient.supabase
                    .from('user_profiles')
                    .select('role')
                    .eq('user_id', user.id)
                    .single();

                if (profileError) {
                    throw profileError;
                }

                const role = profile.role;
                
                // Store the role and user info in sessionStorage
                sessionStorage.setItem('currentUserRole', role);
                sessionStorage.setItem('userId', user.id);
                sessionStorage.setItem('userEmail', user.email);

                // Redirect to the main application page
                window.location.href = 'dental_clinic.html';
            }
        } catch (error) {
            console.error('Login error:', error.message);
            showLoginError("Invalid email or password.");
            passwordInput.value = '';
            usernameInput.focus();
        }
    });

    // Helper function to display login errors
    function showLoginError(message) {
        loginErrorsDiv.textContent = message;
        loginErrorsDiv.style.display = 'block'; // Make it visible (assuming default display is none)
        console.warn("Login Error: " + message);
    }

    // Hide error message on input focus
    usernameInput.addEventListener('focus', hideLoginError);
    passwordInput.addEventListener('focus', hideLoginError);

    // Helper function to hide login errors
    function hideLoginError() {
        loginErrorsDiv.textContent = '';
        loginErrorsDiv.style.display = 'none';
    }

    // Optional: Check if a role is already logged in (shouldn't happen if redirection from dental_clinic.html works, but good practice)
    // const storedRole = sessionStorage.getItem('currentUserRole');
    // if (storedRole && storedRole !== 'loggedOut') {
    //      console.log(`User already logged in as ${storedRole}. Redirecting to main app.`);
    //      window.location.href = 'dental_clinic.html';
    // }
});