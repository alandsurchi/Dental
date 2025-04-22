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

    // Flag to determine if we should use Supabase or dummy data
    const USE_SUPABASE_AUTH = false; // Set to false to use dummy credentials during development

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic validation
        if (!username || !password) {
            showLoginError("Please enter both username and password.");
            return;
        }

        try {
            if (USE_SUPABASE_AUTH) {
                // Attempt to sign in using Supabase
                const { data, error } = await supabaseClient.signIn(username, password);
                
                if (error) throw error;
                
                if (data.user) {
                    // Get user role from user metadata or a separate profile table
                    const { data: profile, error: profileError } = await supabaseClient.supabase
                        .from('user_profiles')
                        .select('role')
                        .eq('user_id', data.user.id)
                        .single();

                    if (profileError) {
                        throw profileError;
                    }

                    const role = profile.role;
                    
                    // Store the role and user info in sessionStorage
                    sessionStorage.setItem('currentUserRole', role);
                    sessionStorage.setItem('userId', data.user.id);
                    sessionStorage.setItem('userEmail', data.user.email);

                    // Redirect to the main application page
                    window.location.href = 'dental_clinic.html';
                } else {
                    throw new Error("Invalid username or password");
                }
            } else {
                // Use dummy data for login during development
                const role = window.checkLoginCredentials(username, password);
                
                if (role) {
                    // Valid credentials - store the role in sessionStorage for persistence
                    sessionStorage.setItem('currentUserRole', role);
                    
                    // Redirect to the main dental clinic page
                    window.location.href = 'dental_clinic.html';
                } else {
                    throw new Error("Invalid username or password");
                }
            }
        } catch (error) {
            console.error('Login error:', error.message);
            showLoginError("Invalid username or password.");
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
    
    // Display a message on the login page with valid dummy credentials
    if (!USE_SUPABASE_AUTH) {
        const credentialsDiv = document.createElement('div');
        credentialsDiv.innerHTML = `
            <div style="margin-top: 20px; background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: left;">
                <h4 style="margin-top: 0; color: #333;">Demo Credentials:</h4>
                <p><strong>Admin:</strong> alan.fahmi / 123</p>
                <p><strong>Receptionist:</strong> sarah.davis / 123</p>
                <p><strong>Dentist:</strong> jane.doe / 123</p>
            </div>
        `;
        loginForm.appendChild(credentialsDiv);
    }
});