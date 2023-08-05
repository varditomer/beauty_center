import { useEffect, useState } from 'react';
import AppointmentTable from '../components/AppointmentTable';
import { Link } from 'react-router-dom';

export default function Appointments({ BASE_URL, loggedInUser }) {
    // State to hold appointments
    const [appointments, setAppointments] = useState(null);

    useEffect(() => {
        // Fetch and sort user appointments when component mounts
        const fetchAppointments = async () => {
            try {
                // Fetch user appointments
                console.log(`loggedInUser:`, loggedInUser)
                const isEmployee = loggedInUser.isEmployee
                console.log(`isEmployee:`, isEmployee)
                const appointments = isEmployee ? await getEmployeeAppointments() : await getUserAppointments();
                console.log(`appointments:`, appointments)
                // Sort appointments by appointmentDateTime
                appointments.sort((a, b) => {
                    const dateA = new Date(a.appointmentDateTime);
                    const dateB = new Date(b.appointmentDateTime);
                    return dateA - dateB;
                });
                // Update state with sorted appointments
                setAppointments(appointments);
            } catch (error) {
                console.error(error);
            }
        };

        fetchAppointments();
    }, []);

    // Function to fetch user appointments
    const getUserAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const appointments = await response.json();
            return appointments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    // Function to fetch user appointments
    const getEmployeeAppointments = async () => {
        try {
            const response = await fetch(`${BASE_URL}/appointment/employee/${loggedInUser.id}`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                },
            });
            const appointments = await response.json();
            return appointments;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <section className="appointment-page">
            {/* Display page title */}
            <h1 className="page-title">{loggedInUser.isEmployee ? `Employee's ` : `Customer's `}Appointments</h1>

            {/* Link to add appointment page */}
            {!(loggedInUser.isEmployee) && <Link to='/addAppointment'>
                <button className="add-appointment-btn">Add Appointment</button>
            </Link>}

            <div className="appointment-section">
                {/* Display AppointmentTable component if appointments are available */}
                {appointments &&
                    <AppointmentTable setAppointments={setAppointments} BASE_URL={BASE_URL} appointments={appointments} loggedInUser={loggedInUser} />
                }
            </div>
        </section>
    );
}
