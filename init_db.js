import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function initializeDatabase() {
    try {
        // Create user_profiles table
        const { error: profileError } = await supabase.rpc('create_user_profiles_table', {
            sql: `
                CREATE TABLE IF NOT EXISTS user_profiles (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                    role TEXT NOT NULL CHECK (role IN ('admin', 'receptionist', 'dentist')),
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    specialty TEXT,
                    phone TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `
        });

        if (profileError) throw profileError;

        // Create patients table
        const { error: patientError } = await supabase.rpc('create_patients_table', {
            sql: `
                CREATE TABLE IF NOT EXISTS patients (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    first_name TEXT NOT NULL,
                    last_name TEXT NOT NULL,
                    email TEXT,
                    phone TEXT,
                    date_of_birth DATE,
                    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
                    address TEXT,
                    medical_history TEXT,
                    section TEXT CHECK (section IN ('Men''s Section', 'Women''s Section', 'Children''s Section')),
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `
        });

        if (patientError) throw patientError;

        // Create appointments table
        const { error: appointmentError } = await supabase.rpc('create_appointments_table', {
            sql: `
                CREATE TABLE IF NOT EXISTS appointments (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
                    dentist_id UUID REFERENCES auth.users(id),
                    appointment_date TIMESTAMPTZ NOT NULL,
                    treatment_type TEXT NOT NULL,
                    section TEXT CHECK (section IN ('Men''s Section', 'Women''s Section', 'Children''s Section')),
                    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
                    notes TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `
        });

        if (appointmentError) throw appointmentError;

        // Create treatments table
        const { error: treatmentError } = await supabase.rpc('create_treatments_table', {
            sql: `
                CREATE TABLE IF NOT EXISTS treatments (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    name TEXT NOT NULL UNIQUE,
                    description TEXT,
                    price DECIMAL(10,2) NOT NULL,
                    duration INTEGER NOT NULL,
                    category TEXT CHECK (category IN ('Preventive', 'Restorative', 'Cosmetic', 'Surgical', 'Orthodontic', 'Diagnostic', 'Periodontal', 'Prosthodontics')),
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `
        });

        if (treatmentError) throw treatmentError;

        // Create dental_charts table
        const { error: chartError } = await supabase.rpc('create_dental_charts_table', {
            sql: `
                CREATE TABLE IF NOT EXISTS dental_charts (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
                    tooth_number TEXT NOT NULL,
                    treatment TEXT NOT NULL,
                    notes TEXT,
                    dentist_id UUID REFERENCES auth.users(id),
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `
        });

        if (chartError) throw chartError;

        // Create invoices table
        const { error: invoiceError } = await supabase.rpc('create_invoices_table', {
            sql: `
                CREATE TABLE IF NOT EXISTS invoices (
                    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
                    appointment_id UUID REFERENCES appointments(id),
                    amount DECIMAL(10,2) NOT NULL,
                    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
                    payment_method TEXT,
                    notes TEXT,
                    created_at TIMESTAMPTZ DEFAULT NOW(),
                    updated_at TIMESTAMPTZ DEFAULT NOW()
                );
            `
        });

        if (invoiceError) throw invoiceError;

        console.log('Database tables created successfully!');

        // Create RLS policies
        await setupRLSPolicies();

    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

async function setupRLSPolicies() {
    try {
        // Enable RLS on all tables
        const tables = ['user_profiles', 'patients', 'appointments', 'treatments', 'dental_charts', 'invoices'];
        
        for (const table of tables) {
            await supabase.rpc('enable_rls', { table_name: table });
        }

        // Create policies for each table
        await createTablePolicies();

        console.log('RLS policies created successfully!');
    } catch (error) {
        console.error('Error setting up RLS policies:', error);
    }
}

async function createTablePolicies() {
    const policies = [
        // User Profiles policies
        {
            table: 'user_profiles',
            name: 'Users can view their own profile',
            definition: "auth.uid() = user_id"
        },
        {
            table: 'user_profiles',
            name: 'Admins can view all profiles',
            definition: "EXISTS (SELECT 1 FROM user_profiles WHERE user_id = auth.uid() AND role = 'admin')"
        },
        // Patients policies
        {
            table: 'patients',
            name: 'All authenticated users can view patients',
            definition: "auth.role() = 'authenticated'"
        },
        // Add more policies as needed
    ];

    for (const policy of policies) {
        await supabase.rpc('create_policy', {
            table_name: policy.table,
            policy_name: policy.name,
            policy_definition: policy.definition
        });
    }
}

// Run the initialization
initializeDatabase(); 