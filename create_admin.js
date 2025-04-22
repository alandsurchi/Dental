import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.7/+esm'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function createAdminUser() {
    try {
        // Create a new user
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email: 'admin@alandental.com',
            password: 'Admin123!@#',
        });

        if (signUpError) throw signUpError;

        // Create the admin profile
        const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
                {
                    user_id: user.id,
                    role: 'admin',
                    first_name: 'Alan',
                    last_name: 'Admin',
                    specialty: 'System Administrator',
                    phone: '+1234567890'
                }
            ]);

        if (profileError) throw profileError;

        console.log('Admin user created successfully!');
        console.log('Email:', 'admin@alandental.com');
        console.log('Password:', 'Admin123!@#');
        console.log('Please change the password after first login.');

    } catch (error) {
        console.error('Error creating admin user:', error);
    }
}

// Run the script
createAdminUser(); 