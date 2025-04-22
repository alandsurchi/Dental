import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

// Initialize the Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Database operations
export async function getPatients() {
    const { data, error } = await supabase
        .from('patients')
        .select('*')
    if (error) throw error
    return data
}

export async function getAppointments() {
    const { data, error } = await supabase
        .from('appointments')
        .select('*')
    if (error) throw error
    return data
}

export async function createPatient(patientData) {
    const { data, error } = await supabase
        .from('patients')
        .insert([patientData])
        .select()
    if (error) throw error
    return data[0]
}

export async function updatePatient(id, updates) {
    const { data, error } = await supabase
        .from('patients')
        .update(updates)
        .eq('id', id)
        .select()
    if (error) throw error
    return data[0]
}

export async function createAppointment(appointmentData) {
    const { data, error } = await supabase
        .from('appointments')
        .insert([appointmentData])
        .select()
    if (error) throw error
    return data[0]
}

export async function updateAppointment(id, updates) {
    const { data, error } = await supabase
        .from('appointments')
        .update(updates)
        .eq('id', id)
        .select()
    if (error) throw error
    return data[0]
}

// Authentication functions
export async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    if (error) throw error
    return data
}

export async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

// Real-time subscriptions setup
export function subscribeToAppointments(callback) {
    return supabase
        .channel('appointments')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'appointments' },
            callback
        )
        .subscribe()
} 