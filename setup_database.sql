-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create Tables
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

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_treatments_updated_at ON treatments;
CREATE TRIGGER update_treatments_updated_at
    BEFORE UPDATE ON treatments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_dental_charts_updated_at ON dental_charts;
CREATE TRIGGER update_dental_charts_updated_at
    BEFORE UPDATE ON dental_charts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE dental_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "All authenticated users can view patients" ON patients;
DROP POLICY IF EXISTS "Staff can modify patients" ON patients;
DROP POLICY IF EXISTS "All authenticated users can view appointments" ON appointments;
DROP POLICY IF EXISTS "Staff can modify appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can view treatments" ON treatments;
DROP POLICY IF EXISTS "Only admins can modify treatments" ON treatments;
DROP POLICY IF EXISTS "Staff can view dental charts" ON dental_charts;
DROP POLICY IF EXISTS "Dentists and admins can modify dental charts" ON dental_charts;
DROP POLICY IF EXISTS "Staff can view invoices" ON invoices;
DROP POLICY IF EXISTS "Staff can modify invoices" ON invoices;

-- Create RLS Policies
-- User Profiles policies
CREATE POLICY "Users can view their own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
    ON user_profiles FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Patients policies
CREATE POLICY "All authenticated users can view patients"
    ON patients FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can modify patients"
    ON patients FOR ALL
    USING (auth.role() = 'authenticated');

-- Appointments policies
CREATE POLICY "All authenticated users can view appointments"
    ON appointments FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can modify appointments"
    ON appointments FOR ALL
    USING (auth.role() = 'authenticated');

-- Treatments policies
CREATE POLICY "Anyone can view treatments"
    ON treatments FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify treatments"
    ON treatments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Dental Charts policies
CREATE POLICY "Staff can view dental charts"
    ON dental_charts FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Dentists and admins can modify dental charts"
    ON dental_charts FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role IN ('dentist', 'admin')
        )
    );

-- Invoices policies
CREATE POLICY "Staff can view invoices"
    ON invoices FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Staff can modify invoices"
    ON invoices FOR ALL
    USING (auth.role() = 'authenticated'); 