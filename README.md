# Alan Dental Clinic Management System

A comprehensive dental clinic management system built with modern web technologies and Supabase backend.

## Features

- User Authentication and Authorization
- Patient Management
- Appointment Scheduling
- Dental Charts
- Treatment Planning
- Invoicing and Billing
- Section-based Organization (Men's, Women's, Children's)

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Supabase (PostgreSQL)
- Authentication: Supabase Auth
- Real-time Updates: Supabase Realtime

## Setup

1. Clone the repository:
```bash
git clone https://github.com/alandsurchi/Dental.git
cd Dental
```

2. Configure Supabase:
- Create a Supabase project
- Update `config.js` with your Supabase credentials
- Run the database setup script in Supabase SQL editor

3. Open `dental_clinic.html` in your browser

## Database Structure

The system uses the following tables:
- user_profiles: Staff information and roles
- patients: Patient records
- appointments: Scheduling and booking
- treatments: Available dental procedures
- dental_charts: Patient dental records
- invoices: Billing and payments

## Security

- Row Level Security (RLS) policies implemented
- Role-based access control
- Secure authentication via Supabase

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 