// api-bridge.js - Bridge between UI and Supabase backend
import * as supabaseClient from './supabase.js';

// Cache for loaded data
let dataCache = {
    patients: null,
    appointments: null,
    staff: null,
    treatments: null,
    invoices: null,
    payments: null,
    paymentMethods: null
};

// Flag to determine if we should use mock data or real data
const USE_REAL_DATA = false; // Set to false to use dummy data during development

// ===== DATA LOADING FUNCTIONS =====

// Load patients from backend or use dummy data
export async function loadPatients() {
    if (USE_REAL_DATA) {
        try {
            const data = await supabaseClient.getPatients();
            dataCache.patients = data;
            return data;
        } catch (error) {
            console.error("Error loading patients:", error);
            return window.allDemoPatients; // Fallback to dummy data
        }
    } else {
        return window.allDemoPatients;
    }
}

// Load appointments from backend or use dummy data
export async function loadAppointments() {
    if (USE_REAL_DATA) {
        try {
            const data = await supabaseClient.getAppointments();
            dataCache.appointments = data;
            return data;
        } catch (error) {
            console.error("Error loading appointments:", error);
            return window.allDemoAppointments; // Fallback to dummy data
        }
    } else {
        return window.allDemoAppointments;
    }
}

// ===== DATA MANIPULATION FUNCTIONS =====

// Add a new patient
export async function addPatient(patientData) {
    if (USE_REAL_DATA) {
        try {
            const newPatient = await supabaseClient.createPatient(patientData);
            // Refresh cache
            if (dataCache.patients) {
                dataCache.patients.push(newPatient);
            }
            return newPatient;
        } catch (error) {
            console.error("Error adding patient:", error);
            throw error;
        }
    } else {
        // Generate a new ID for dummy data
        const newId = 'P' + String(window.allDemoPatients.length + 1).padStart(3, '0');
        const newPatient = { id: newId, ...patientData };
        window.allDemoPatients.push(newPatient);
        return newPatient;
    }
}

// Update an existing patient
export async function updatePatient(id, updates) {
    if (USE_REAL_DATA) {
        try {
            const updatedPatient = await supabaseClient.updatePatient(id, updates);
            // Update in cache
            if (dataCache.patients) {
                const index = dataCache.patients.findIndex(p => p.id === id);
                if (index !== -1) {
                    dataCache.patients[index] = updatedPatient;
                }
            }
            return updatedPatient;
        } catch (error) {
            console.error("Error updating patient:", error);
            throw error;
        }
    } else {
        // Update in dummy data
        const index = window.allDemoPatients.findIndex(p => p.id === id);
        if (index !== -1) {
            window.allDemoPatients[index] = { ...window.allDemoPatients[index], ...updates };
            return window.allDemoPatients[index];
        }
        throw new Error("Patient not found");
    }
}

// Add a new appointment
export async function addAppointment(appointmentData) {
    if (USE_REAL_DATA) {
        try {
            const newAppointment = await supabaseClient.createAppointment(appointmentData);
            // Refresh cache
            if (dataCache.appointments) {
                dataCache.appointments.push(newAppointment);
            }
            return newAppointment;
        } catch (error) {
            console.error("Error adding appointment:", error);
            throw error;
        }
    } else {
        // Generate a new ID for dummy data
        const newId = 'A' + String(window.allDemoAppointments.length + 1).padStart(3, '0');
        const newAppointment = { id: newId, ...appointmentData };
        window.allDemoAppointments.push(newAppointment);
        return newAppointment;
    }
}

// Update an existing appointment
export async function updateAppointment(id, updates) {
    if (USE_REAL_DATA) {
        try {
            const updatedAppointment = await supabaseClient.updateAppointment(id, updates);
            // Update in cache
            if (dataCache.appointments) {
                const index = dataCache.appointments.findIndex(a => a.id === id);
                if (index !== -1) {
                    dataCache.appointments[index] = updatedAppointment;
                }
            }
            return updatedAppointment;
        } catch (error) {
            console.error("Error updating appointment:", error);
            throw error;
        }
    } else {
        // Update in dummy data
        const index = window.allDemoAppointments.findIndex(a => a.id === id);
        if (index !== -1) {
            window.allDemoAppointments[index] = { ...window.allDemoAppointments[index], ...updates };
            return window.allDemoAppointments[index];
        }
        throw new Error("Appointment not found");
    }
}

// Add an invoice
export async function addInvoice(invoiceData) {
    // Generate a new ID for dummy data
    const newId = 'INV' + String(window.allDemoInvoices.length + 1).padStart(3, '0');
    const newInvoice = { id: newId, ...invoiceData };
    window.allDemoInvoices.push(newInvoice);
    return newInvoice;
}

// Update invoice status
export async function updateInvoiceStatus(id, status, paymentMethod = null) {
    const index = window.allDemoInvoices.findIndex(i => i.id === id);
    if (index !== -1) {
        window.allDemoInvoices[index].status = status;
        
        // If payment method is provided, add it to the invoice
        if (paymentMethod) {
            window.allDemoInvoices[index].method = paymentMethod;
            
            // If status is 'Paid', add to payment history
            if (status === 'Paid') {
                const invoice = window.allDemoInvoices[index];
                const newPaymentId = 'PMT' + String(window.allDemoPayments.length + 1).padStart(3, '0');
                const payment = {
                    id: newPaymentId,
                    invoiceId: invoice.id,
                    patientId: invoice.patientId,
                    patientName: invoice.patientName,
                    date: new Date().toISOString().split('T')[0], // Today's date
                    amount: invoice.amount,
                    method: paymentMethod
                };
                window.allDemoPayments.push(payment);
            }
        }
        
        return window.allDemoInvoices[index];
    }
    throw new Error("Invoice not found");
}

// Get patient details by ID
export function getPatientById(patientId) {
    return window.allDemoPatients.find(p => p.id === patientId);
}

// ===== UI HELPER FUNCTIONS =====

// Format a date string
export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

// Format a time string (24h to 12h)
export function formatTime(timeString) {
    if (!timeString) return '';
    // Convert 24-hour time to 12-hour format with AM/PM
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
}

// Format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
    }).format(amount);
}

// Show a notification message
export function showNotification(message, type = 'success') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        document.body.appendChild(notification);

        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = '4px';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '9999';
        notification.style.transition = 'opacity 0.3s ease-in-out';
    }

    // Set the message and style based on type
    notification.textContent = message;
    if (type === 'success') {
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#F44336';
        notification.style.color = 'white';
    } else if (type === 'warning') {
        notification.style.backgroundColor = '#FF9800';
        notification.style.color = 'white';
    }

    // Show the notification
    notification.style.opacity = '1';

    // Hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
} 